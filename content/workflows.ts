import type { AppSlug, Glyph } from "../lib/logos.ts";

export type NodeKind = "trigger" | "deterministic" | "ai" | "human" | "output";

/** One app and the operation it performs. Drawn as the mono line "App: Operation". */
export type AppRef = {
  /** Registry slug from lib/logos.ts, or a house glyph for code, schedules and webhooks. */
  app: AppSlug | Glyph;
  /** "New response", "Update contact". `${appName}: ${operation}` stays at or under 22 characters. */
  operation: string;
  /** Text version only, never drawn: "HubSpot (or Salesforce, Pipedrive)". */
  alternatives: string[];
};

/** A circle hanging off a spine card by a dashed line. */
export type Attachment = AppRef & {
  id: string;
  /** Verb-first, at most 24 characters. */
  label: string;
  /** model, memory and tools only on ai nodes. calls only on trigger and deterministic nodes. */
  port: "model" | "memory" | "tools" | "calls";
  does: string;
  /** Must be true on every ai-node attachment: the model never holds a write. */
  readOnly: boolean;
};

export type WorkflowNode = {
  id: string;
  label: string;
  kind: NodeKind;
  does: string;
  guardrail: string;
  failure: string;
  timingLabel: string;
  payload: string;
  /** Outputs only. "external" must sit downstream of a human node. */
  audience?: "external" | "internal";
  gate?: {
    approver: string;
    channel: string;
    expiresAfter?: string;
    approveLabel?: string;
    rejectLabel?: string;
    /** Completes the sentence "Rejected — …". */
    rejectOutcome?: string;
    /** The app where the person approves. Named in the mono line, never drawn on the gold card. */
    channelApp?: AppSlug;
    /** Mono operation for the approval, e.g. "Approve button". */
    operation?: string;
  };
  confidence?: { threshold: number; belowThreshold: string };
  /** Required on trigger, deterministic and output nodes. Absent on ai and human nodes. */
  app?: AppRef;
  attached?: Attachment[];
  /** Exit stub text for a rule step that can stop the item, drawn above the card. */
  stopLabel?: string;
};

export type WorkflowEdge = {
  from: string;
  to: string;
  label?: string;
  branch?: "approved" | "rejected" | "low-confidence" | "expired";
};

export type Workflow = {
  id: string;
  title: string;
  trigger: string;
  outcome: string;
  summary: string;
  metaDescription: string;
  services: string[];
  industries: string[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  ownership: string;
};

/** Side branches a run can end on. They are not steps, so they live outside `nodes`. */
export const EXITS = {
  "exit-manual": "Manual queue",
  "exit-rejected": "Rejected",
  "exit-expired": "Expired",
} as const;

export type ExitId = keyof typeof EXITS;

export const NODE_KINDS: Record<NodeKind, string> = {
  trigger: "Trigger",
  deterministic: "Rule",
  ai: "AI",
  human: "Approval",
  output: "Result",
};

const ALL_INDUSTRIES = [
  "professional-services",
  "health-wellness-fitness",
  "real-estate",
  "ecommerce-retail",
  "home-services",
  "financial-accounting-firms",
];

const AI = "ai-workflow-automation";

function sample(value: Record<string, unknown>): string {
  return JSON.stringify({ _sample: true, ...value }, null, 2);
}

/** Linear edges, plus the branches every AI step and human gate carries. */
function edgesFor(nodes: WorkflowNode[]): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];
  nodes.forEach((node, index) => {
    const next = nodes[index + 1];
    if (next) {
      edges.push(
        node.gate
          ? { from: node.id, to: next.id, label: "Approved", branch: "approved" }
          : { from: node.id, to: next.id },
      );
    }
    if (node.kind === "ai") {
      edges.push({
        from: node.id,
        to: "exit-manual",
        label: "Low confidence",
        branch: "low-confidence",
      });
    }
    if (node.gate) {
      edges.push({ from: node.id, to: "exit-rejected", label: "Rejected", branch: "rejected" });
      edges.push({ from: node.id, to: "exit-expired", label: "Expired", branch: "expired" });
    }
  });
  return edges;
}

function define(workflow: Omit<Workflow, "edges">): Workflow {
  return { ...workflow, edges: edgesFor(workflow.nodes) };
}

const OWNED =
  "Runs in your accounts, from your repository. The logs, prompts and credentials are yours.";

export const WORKFLOWS: Workflow[] = [
  define({
    id: "lead-triage",
    title: "Inbound lead triage",
    trigger: "A lead arrives by form or webhook",
    outcome: "A scored CRM record and an approved first reply",
    summary:
      "A new lead is verified, enriched and scored against a written definition of fit. The CRM is updated, a reply is drafted, and a person approves it before it goes out.",
    metaDescription:
      "See how an inbound lead is verified, enriched, scored and synced to the CRM, with a person approving the first reply. Simulation with sample data.",
    services: [AI],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "lead-received",
        label: "Form or webhook received",
        kind: "trigger",
        does: "Accepts the submission and writes the raw record to the audit log before any later step runs.",
        guardrail: "The HMAC signature is checked. Unsigned payloads are rejected and logged.",
        failure: "A malformed payload returns an error, is stored as rejected, and never reaches the CRM.",
        timingLabel: "On event",
        payload: sample({
          event: "lead.received",
          run_id: "run-lead-001",
          received_at: "2026-03-02T15:04:00Z",
          signature: "valid",
          lead: {
            name: "A. Rivera",
            email: "rivera@harborline.example",
            company: "Harborline Supply",
            message: "Our quoting still runs through one inbox.",
          },
        }),
      },
      {
        id: "enrichment",
        label: "Company enrichment",
        kind: "deterministic",
        does: "Looks up the company by domain, checks for an existing account, and fills the firmographic fields.",
        guardrail: "Missing fields are marked partial. They are never guessed.",
        failure: "A lookup timeout retries twice, then continues with the record marked partial.",
        timingLabel: "Seconds",
        payload: sample({
          domain: "harborline.example",
          mx_valid: true,
          existing_account: false,
          size_band: "20-50",
          enrichment: "partial",
          missing: ["industry_code"],
        }),
      },
      {
        id: "scoring",
        label: "Fit and intent scoring",
        kind: "ai",
        does: "Reads the message and returns intent, fit and confidence as an object that must match a schema.",
        guardrail: "Output that fails the schema is discarded. Nothing is sent from this step.",
        failure: "One retry on a schema failure, then the lead goes to the manual queue with the raw output attached.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The lead goes to the manual review queue and no reply is drafted.",
        },
        payload: sample({
          intent: "process_automation",
          fit: "medium",
          confidence: 0.9,
          reason: "Names a manual quoting process and the inbox it runs through.",
          schema: "lead-score.v1",
        }),
      },
      {
        id: "crm-sync",
        label: "CRM sync",
        kind: "deterministic",
        does: "Creates or updates the contact and company, and attaches the score and a drafted reply.",
        guardrail: "Upsert on email. Duplicates merge by rule, and every write is logged.",
        failure: "A failed write retries with the same idempotency key, then alerts the owner.",
        timingLabel: "Seconds",
        payload: sample({
          operation: "upsert",
          match_on: "email",
          record_id: "sample-contact-100",
          fields_written: ["fit", "intent", "source"],
          draft_reply: "ready_for_review",
        }),
      },
      {
        id: "reply-approval",
        label: "Reply approval",
        kind: "human",
        does: "Shows the drafted reply, the score and the original message to the sales lead, and waits.",
        guardrail: "Nothing is sent without a click. There is no automatic approval.",
        failure: "If nobody responds, the item expires and returns to the queue unsent.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Sales lead",
          channel: "Slack message with Approve, Edit and Reject",
          expiresAfter: "4 business hours, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "sales_lead",
          draft: "Thanks for the note about quoting. Could you tell us which system holds the price list?",
          options: ["approve", "edit", "reject"],
        }),
      },
      {
        id: "first-reply",
        label: "First reply sent",
        kind: "output",
        audience: "external",
        does: "Sends exactly the approved text from the approver's mailbox and closes the run.",
        guardrail: "Only the approved text is sent. The approver's name is written to the log.",
        failure: "A send failure alerts the approver. It never retries with different text.",
        timingLabel: "Seconds",
        payload: sample({
          to: "rivera@harborline.example",
          approved_by: "sales_lead",
          sent: false,
          log_id: "audit-lead-001-6",
        }),
      },
    ],
  }),
  define({
    id: "proposal-ops",
    title: "Proposal and contract ops",
    trigger: "A discovery call is transcribed",
    outcome: "A reviewed proposal, a signature request and a matching invoice",
    summary:
      "Requirements are pulled from the call with citations, priced from a rate card, and merged into a template. A partner at your firm reviews the document before it is sent for signature.",
    metaDescription:
      "Follow a proposal from call transcript to cited requirements, margin check, partner review, signature request and matching invoice. Sample data only.",
    services: [AI],
    industries: ["professional-services", "financial-accounting-firms"],
    ownership: OWNED,
    nodes: [
      {
        id: "transcript",
        label: "Discovery call transcript",
        kind: "trigger",
        does: "Picks up a finished transcript and attaches it to the open opportunity.",
        guardrail: "Only calls tagged as discovery are processed.",
        failure: "A call without a tag is ignored. A call with no matching opportunity goes to the owner.",
        timingLabel: "On event",
        payload: sample({
          call_type: "discovery",
          opportunity: "sample-opp-200",
          company: "Northfield Studio",
          duration_min: 30,
          received_at: "2026-03-03T17:00:00Z",
        }),
      },
      {
        id: "requirements",
        label: "Requirements extraction",
        kind: "ai",
        does: "Lists the requirements stated on the call, each tied to the moment it was said.",
        guardrail: "Every requirement cites a transcript timestamp. Missing items are flagged, not filled.",
        failure: "A requirement with no citation is dropped and listed for the account owner.",
        timingLabel: "Minutes",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The transcript goes to the manual queue for a person to write the requirements.",
        },
        payload: sample({
          requirements: [
            { item: "Monthly reporting pack", cited_at: "00:08:10" },
            { item: "Two review rounds", cited_at: "00:19:40" },
          ],
          missing: ["start_date"],
          confidence: 0.9,
        }),
      },
      {
        id: "margin-check",
        label: "Pricing and margin check",
        kind: "deterministic",
        does: "Looks up each item on the rate card, totals the estimate and compares it with the margin floor.",
        guardrail: "Below the margin floor, the proposal is blocked and flagged to the owner.",
        failure: "An item missing from the rate card blocks the run and names the item.",
        timingLabel: "Seconds",
        payload: sample({
          lines_priced: 2,
          rate_card: "sample-rate-card",
          margin_floor: "met",
          total_units: 100,
          status: "pass",
        }),
      },
      {
        id: "proposal-draft",
        label: "Proposal draft",
        kind: "deterministic",
        does: "Merges the requirements and priced lines into the firm's own template.",
        guardrail: "Template merge only. No free-form model text in the pricing sections.",
        failure: "An unfilled template field stops the merge and lists the field.",
        timingLabel: "Seconds",
        payload: sample({
          template: "proposal-standard",
          fields_filled: 18,
          fields_empty: 0,
          document: "sample-doc-200",
          state: "draft",
        }),
      },
      {
        id: "partner-review",
        label: "Partner review",
        kind: "human",
        does: "Asks the responsible partner to read, edit and release the proposal, and waits.",
        guardrail: "Edits are tracked. Nothing goes out unapproved.",
        failure: "An unanswered request expires and returns to the partner's queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Responsible partner",
          channel: "Document comment plus a Slack message",
          expiresAfter: "2 business days, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "partner",
          document: "sample-doc-200",
          tracked_edits: 0,
        }),
      },
      {
        id: "signature-request",
        label: "Signature request",
        kind: "output",
        audience: "external",
        does: "Sends the released version for signature to the named signer.",
        guardrail: "Sent only after approval, and only the approved version.",
        failure: "A bounced signer address alerts the account owner and pauses the run.",
        timingLabel: "Seconds",
        payload: sample({
          signer: "j.park@northfield.example",
          document_version: "approved",
          sent: false,
        }),
      },
      {
        id: "invoice-created",
        label: "Invoice created",
        kind: "output",
        audience: "external",
        does: "Creates the first invoice from the approved proposal total.",
        guardrail: "The amount must match the approved proposal total exactly.",
        failure: "Any mismatch stops the invoice and alerts finance.",
        timingLabel: "Seconds",
        payload: sample({
          invoice: "sample-inv-200",
          total_units: 100,
          matches_proposal: true,
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "client-onboarding",
    title: "Client onboarding",
    trigger: "A contract is signed",
    outcome: "A ready workspace, an approved welcome and a booked kickoff",
    summary:
      "A signed contract starts intake, sets up the workspace from templates, and drafts a welcome from the client's own answers. The account lead approves before anything is sent.",
    metaDescription:
      "Watch a signed contract start intake, workspace setup, a drafted welcome email, account-lead approval and a kickoff invite. Simulation with sample data.",
    services: [AI],
    industries: ["professional-services", "health-wellness-fitness", "financial-accounting-firms"],
    ownership: OWNED,
    nodes: [
      {
        id: "contract-signed",
        label: "Contract signed",
        kind: "trigger",
        does: "Receives the signed-document event and opens one onboarding run for that contract.",
        guardrail: "An idempotency key prevents the same client from being onboarded twice.",
        failure: "A repeated event is logged and ignored.",
        timingLabel: "On event",
        payload: sample({
          event: "contract.signed",
          idempotency_key: "sample-contract-300",
          client: "Cedar Row Wellness",
          duplicate: false,
        }),
      },
      {
        id: "intake",
        label: "Intake sent and returned",
        kind: "deterministic",
        does: "Sends the intake form agreed in the contract and waits for a complete answer set.",
        guardrail: "Required fields are enforced. A reminder goes out after two days.",
        failure: "No answer after the second reminder alerts the account lead.",
        timingLabel: "Days",
        payload: sample({
          form: "intake-standard",
          required_complete: true,
          answers: 14,
          reminder_count: 0,
        }),
      },
      {
        id: "workspace",
        label: "Workspace setup",
        kind: "deterministic",
        does: "Creates the folder and the project from templates and assigns the starting tasks.",
        guardrail: "Permissions come from a role map, never from an open link.",
        failure: "A partial setup rolls forward on retry. It never creates a second folder.",
        timingLabel: "Seconds",
        payload: sample({
          folder: "sample-folder-300",
          project: "sample-project-300",
          sharing: "role_map",
          tasks_created: 9,
        }),
      },
      {
        id: "welcome-draft",
        label: "Welcome email draft",
        kind: "ai",
        does: "Drafts a welcome that refers to the client's own answers and the first three dates.",
        guardrail: "Draft only. Names, dates and facts are checked against the intake record.",
        failure: "A fact that does not match the intake is removed and flagged in the draft.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The draft is withheld and the account lead writes the welcome.",
        },
        payload: sample({
          draft: "Welcome. Your folder is ready and the kickoff agenda is inside.",
          facts_checked: 6,
          mismatches: 0,
          confidence: 0.9,
        }),
      },
      {
        id: "lead-approves",
        label: "Account lead approves",
        kind: "human",
        does: "Puts the draft in the account lead's mailbox, notifies them, and waits.",
        guardrail: "The lead approves or edits before anything is sent.",
        failure: "An unanswered request expires and returns to the lead's queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Account lead",
          channel: "Gmail draft plus a Slack message",
          expiresAfter: "1 business day, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "account_lead",
          draft: "sample-draft-300",
        }),
      },
      {
        id: "kickoff",
        label: "Kickoff scheduled",
        kind: "output",
        audience: "external",
        does: "Sends the approved welcome and a kickoff invite from the lead's calendar.",
        guardrail: "Uses the account lead's availability. The invite goes out after approval.",
        failure: "With no shared opening, the lead is asked to choose a time.",
        timingLabel: "Seconds",
        payload: sample({
          event: "kickoff",
          attendee: "m.bell@cedarrow.example",
          approved_by: "account_lead",
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "daily-brief",
    title: "Executive daily brief",
    trigger: "6:30 each weekday morning",
    outcome: "A cited, internal summary of what changed",
    summary:
      "Figures are pulled from the systems of record, checked against thresholds the owner sets, and summarized with a source on every sentence. The brief stays inside the company.",
    metaDescription:
      "See a daily brief assembled from billing, accounting and CRM data, with owner-set thresholds and a source cited on every line. Sample data only.",
    services: [AI],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "schedule",
        label: "6:30 a.m. schedule",
        kind: "trigger",
        does: "Starts the run on working days in the owner's time zone.",
        guardrail: "Skips weekends and holidays according to a config file you can edit.",
        failure: "A missed start alerts the owner of the workflow.",
        timingLabel: "Scheduled",
        payload: sample({
          schedule: "06:30 weekdays",
          reporting_date: "2026-03-04",
          skipped: false,
        }),
      },
      {
        id: "data-pull",
        label: "Data pull",
        kind: "deterministic",
        does: "Reads yesterday's figures from each source with read-only credentials.",
        guardrail: "If a source fails, the brief names it. There is no silent gap.",
        failure: "Two retries per source, then the run continues with that source marked missing.",
        timingLabel: "Minutes",
        payload: sample({
          sources: [
            { name: "billing", status: "ok" },
            { name: "accounting", status: "ok" },
            { name: "crm", status: "missing" },
          ],
          access: "read_only",
        }),
      },
      {
        id: "variance",
        label: "Variance and exceptions",
        kind: "deterministic",
        does: "Compares each figure with its baseline and marks the ones outside the owner's thresholds.",
        guardrail: "Thresholds are set by the owner. Every flag links to its source rows.",
        failure: "A rule that cannot run is reported in the brief as not checked.",
        timingLabel: "Seconds",
        payload: sample({
          rules_run: 12,
          exceptions: [{ rule: "invoice_overdue", rows: ["sample-row-41"] }],
          not_checked: ["pipeline_change"],
        }),
      },
      {
        id: "cited-summary",
        label: "Cited summary",
        kind: "ai",
        does: "Turns the exceptions into a few plain sentences, each with its source row.",
        guardrail: "Every sentence cites a source row. Uncited sentences are dropped.",
        failure: "If the summary fails, the plain exception list is delivered on its own.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The summary is held for a person and the exception list is used instead.",
        },
        payload: sample({
          sentences: [{ text: "One invoice passed its due date.", source: "sample-row-41" }],
          dropped_uncited: 1,
          confidence: 0.9,
        }),
      },
      {
        id: "brief-delivered",
        label: "Brief delivered",
        kind: "output",
        audience: "internal",
        does: "Posts the brief to the leadership channel. This workflow sends nothing to customers, so it has no approval gate.",
        guardrail: "Internal recipients only, from a fixed list. No customer-facing send exists in this workflow.",
        failure: "A delivery failure alerts the owner and stores the brief for pickup.",
        timingLabel: "Scheduled",
        payload: sample({
          channel: "leadership-internal",
          sources_missing: ["crm"],
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "ap-intake",
    title: "Accounts payable intake",
    trigger: "A supplier invoice reaches the inbox",
    outcome: "A matched, approved payment batch",
    summary:
      "Invoices are read into structured fields, checked arithmetically and matched to purchase orders. Exceptions go to a person, and a person approves every payment batch.",
    metaDescription:
      "Step through invoice extraction, three-way PO matching, an exception queue and human approval of the payment batch. Simulation with sample data.",
    services: [AI],
    industries: ["financial-accounting-firms", "ecommerce-retail", "home-services"],
    ownership: OWNED,
    nodes: [
      {
        id: "invoice-arrives",
        label: "Invoice arrives",
        kind: "trigger",
        does: "Watches one inbox, stores the attachment, and opens a run for each invoice.",
        guardrail: "Allowed-sender list. Attachments are virus-scanned before they are opened.",
        failure: "An unknown sender goes to review and is never processed automatically.",
        timingLabel: "On event",
        payload: sample({
          from: "billing@fieldstone.example",
          sender_allowed: true,
          attachment: "sample-invoice.pdf",
          scan: "clean",
        }),
      },
      {
        id: "extraction",
        label: "Field extraction",
        kind: "ai",
        does: "Reads the supplier, invoice number, dates, lines and totals into a fixed schema.",
        guardrail: "Totals must equal the sum of the lines, or the invoice goes to the exception queue.",
        failure: "An unreadable file goes to the exception queue with the original attached.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.85,
          belowThreshold: "The invoice goes to the manual review queue for a person to key.",
        },
        payload: sample({
          supplier: "Fieldstone Supply",
          invoice_number: "SAMPLE-1001",
          lines: [100, 150, 50],
          total: 300,
          sum_matches: true,
          confidence: 0.9,
        }),
      },
      {
        id: "po-match",
        label: "PO match",
        kind: "deterministic",
        does: "Matches the invoice to its purchase order and receipt by number, quantity and amount.",
        guardrail: "Three-way match. Any mismatch goes to the exception queue.",
        failure: "If the accounting system is unavailable, the run waits and retries on a schedule.",
        timingLabel: "Seconds",
        payload: sample({
          purchase_order: "SAMPLE-PO-77",
          receipt: "SAMPLE-RC-77",
          match: "three_way",
          mismatch: ["quantity"],
        }),
      },
      {
        id: "exception-queue",
        label: "Exception queue",
        kind: "human",
        does: "Shows a person the mismatch beside both documents and waits for a decision and a reason.",
        guardrail: "A person resolves each exception, and the reason is logged.",
        failure: "An unresolved item stays in the queue. It cannot move to payment.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Accounts payable clerk",
          channel: "Shared queue with Resolve and Return to supplier",
          expiresAfter: "3 business days, then escalated to the controller's queue",
          approveLabel: "Resolve exception",
          rejectLabel: "Return to supplier",
          rejectOutcome: "returned to the supplier queue and nothing was paid",
        },
        payload: sample({
          exception: "quantity_mismatch",
          invoiced: 10,
          received: 9,
          resolution: "pending",
          reason_required: true,
        }),
      },
      {
        id: "batch-approval",
        label: "Payment batch approval",
        kind: "human",
        does: "Presents the batch with every invoice and exception note, and waits for the controller.",
        guardrail: "Payments are never released automatically.",
        failure: "An unanswered batch expires and returns to the queue unpaid.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Controller",
          channel: "Approval step inside the accounting system",
          expiresAfter: "End of the payment day, then returned to the queue",
          rejectOutcome: "nothing was paid",
        },
        payload: sample({
          batch: "sample-batch-12",
          invoices: 3,
          approval: "pending",
          approver_role: "controller",
        }),
      },
      {
        id: "batch-scheduled",
        label: "Batch scheduled",
        kind: "output",
        audience: "external",
        does: "Schedules the approved batch in the accounting system and records who approved it.",
        guardrail: "Only the approved batch is scheduled, and the batch is locked against edits.",
        failure: "A failed schedule alerts the controller. It is never retried under a new batch id.",
        timingLabel: "Seconds",
        payload: sample({
          batch: "sample-batch-12",
          approved_by: "controller",
          locked: true,
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "support-routing",
    title: "Support ticket routing",
    trigger: "A customer message opens a ticket",
    outcome: "A labeled ticket and an agent-approved reply",
    summary:
      "Tickets are labeled from a fixed list, and a reply is drafted only when the help articles support one. An agent sends, edits or discards the draft.",
    metaDescription:
      "Explore ticket de-duplication, labeling from a fixed list, replies drafted from help articles, and agent approval before sending. Sample data only.",
    services: [AI],
    industries: ["ecommerce-retail", "health-wellness-fitness"],
    ownership: OWNED,
    nodes: [
      {
        id: "ticket-received",
        label: "Ticket received",
        kind: "trigger",
        does: "Opens one run per conversation and attaches the customer's recent order or account record.",
        guardrail: "De-duplicates by thread, so one conversation is one ticket.",
        failure: "A message with no readable body is assigned to a person.",
        timingLabel: "On event",
        payload: sample({
          ticket: "sample-ticket-500",
          from: "l.chen@maplecart.example",
          thread_known: false,
          subject: "Item arrived in the wrong size",
        }),
      },
      {
        id: "classification",
        label: "Urgency and topic labels",
        kind: "ai",
        does: "Chooses an urgency and a topic from a list your support lead maintains.",
        guardrail: "Labels come from an enum only. A label outside the list is rejected.",
        failure: "A rejected label becomes Needs triage and goes to a person.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The ticket is labeled Needs triage and goes to the manual review queue.",
        },
        payload: sample({
          urgency: "normal",
          topic: "exchange_request",
          confidence: 0.9,
          label_set: "support-labels.v1",
        }),
      },
      {
        id: "reply-draft",
        label: "Reply draft from articles",
        kind: "ai",
        does: "Finds the relevant help articles and drafts a reply that cites them for the agent.",
        guardrail: "The draft lists the articles used. With no source, there is no draft.",
        failure: "When nothing relevant is found, the agent gets an empty reply box and a note.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "No draft is shown. The agent answers from the manual queue.",
        },
        payload: sample({
          articles: ["exchange-policy", "size-guide"],
          draft: "You can exchange the item. Here are the steps from our exchange policy.",
          confidence: 0.9,
        }),
      },
      {
        id: "agent-approves",
        label: "Agent approves",
        kind: "human",
        does: "Shows the draft beside the ticket. The agent sends it, edits it or discards it.",
        guardrail: "The agent sends or edits. There is no automatic send.",
        failure: "An untouched draft expires and the ticket returns to the open queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Support agent",
          channel: "Help-desk side panel with Send, Edit and Discard",
          expiresAfter: "The ticket's response target, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "support_agent",
          ticket: "sample-ticket-500",
        }),
      },
      {
        id: "csat-logged",
        label: "Reply and CSAT logged",
        kind: "output",
        audience: "external",
        does: "Records the agent's reply and any later survey answer against the ticket.",
        guardrail: "Survey results are recorded as received and tied to the ticket.",
        failure: "A missing survey is left blank. It is never estimated.",
        timingLabel: "Seconds",
        payload: sample({
          ticket: "sample-ticket-500",
          approved_by: "support_agent",
          csat: null,
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "meta-ads-reporting",
    title: "Meta Ads reporting",
    trigger: "A read-only pull each morning",
    outcome: "A weekly brief with flags a person acts on",
    summary:
      "Spend and results are pulled with read-only access and checked against rolling baselines. The workflow flags and explains. Budgets stay with a person.",
    metaDescription:
      "See a read-only Meta Ads pull, anomaly and creative-fatigue rules, and a weekly brief where every number comes from the data. Sample data only.",
    services: ["meta-ads-consulting", AI],
    industries: ["ecommerce-retail", "health-wellness-fitness", "real-estate"],
    ownership: OWNED,
    nodes: [
      {
        id: "daily-pull",
        label: "Daily pull",
        kind: "trigger",
        does: "Reads the previous day's campaign and site data on a schedule.",
        guardrail: "Read-only tokens. No write scopes are granted.",
        failure: "A failed pull retries, then the brief states which day is missing.",
        timingLabel: "Scheduled",
        payload: sample({
          date: "2026-03-05",
          scopes: ["read"],
          rows: { meta: 40, ga4: 40 },
        }),
      },
      {
        id: "anomaly-check",
        label: "Spend and CPA checks",
        kind: "deterministic",
        does: "Compares spend, CPA and ROAS with a rolling baseline and marks the outliers.",
        guardrail: "Flags only. It never changes a budget.",
        failure: "Too little history means no flag, and the brief says so.",
        timingLabel: "Seconds",
        payload: sample({
          rules: ["spend_vs_baseline", "cpa_vs_baseline", "roas_vs_baseline"],
          flags: [{ rule: "cpa_vs_baseline", campaign: "sample-campaign-a" }],
        }),
      },
      {
        id: "fatigue-flag",
        label: "Creative-fatigue flag",
        kind: "deterministic",
        does: "Looks for rising frequency together with a falling click rate on the same ad.",
        guardrail: "Recommendation only. No ad is paused.",
        failure: "An ad with missing frequency data is listed as not checked.",
        timingLabel: "Seconds",
        payload: sample({
          rule: "frequency_up_ctr_down",
          review: ["sample-ad-3"],
          not_checked: [],
        }),
      },
      {
        id: "weekly-brief",
        label: "Weekly brief",
        kind: "ai",
        does: "Writes a short account of the week around figures inserted from the data.",
        guardrail: "Numbers are inserted from the data. The model does not write them.",
        failure: "If the text fails its check, the table of flags is posted without it.",
        timingLabel: "Minutes",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The brief is held for a person and only the flag table is available.",
        },
        payload: sample({
          template: "weekly-brief",
          figures_inserted: 8,
          figures_written_by_model: 0,
          confidence: 0.9,
        }),
      },
      {
        id: "posted",
        label: "Posted to Slack",
        kind: "output",
        audience: "internal",
        does: "Posts the brief to the internal marketing channel. Budget changes stay with a person, so there is no outbound step to gate.",
        guardrail: "Internal channel only. Budget and creative changes are made by a person.",
        failure: "A posting failure alerts the workflow owner.",
        timingLabel: "Scheduled",
        payload: sample({
          channel: "marketing-internal",
          budget_changes: "none_by_design",
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "recruiting-screen",
    title: "Recruiting screen",
    trigger: "An application is submitted",
    outcome: "A reviewed shortlist and approved outreach",
    summary:
      "Applications are organized against a job-related rubric with protected attributes redacted. A person makes every advance or decline decision, and approves every message.",
    metaDescription:
      "Review a recruiting workflow in which a model organizes evidence against a rubric and people make every decision. Simulation with sample data.",
    services: [AI],
    industries: ["professional-services", "home-services"],
    ownership: OWNED,
    nodes: [
      {
        id: "application",
        label: "Application received",
        kind: "trigger",
        does: "Stores the application and the candidate's consent before anything is read.",
        guardrail: "Consent is captured. Without it, nothing is processed.",
        failure: "A file that cannot be opened is sent to the recruiter as received.",
        timingLabel: "On event",
        payload: sample({
          application: "sample-app-700",
          role: "Operations coordinator",
          consent: true,
          candidate: "Candidate 700",
        }),
      },
      {
        id: "rubric-extraction",
        label: "Rubric extraction",
        kind: "ai",
        does: "Finds the passages that speak to each rubric line and quotes them.",
        guardrail: "The rubric is job-related only. Protected attributes are excluded and redacted before this step.",
        failure: "A rubric line with no evidence is left blank for a person to read.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The application goes to the manual review queue and is read in full.",
        },
        payload: sample({
          rubric: "operations-coordinator.v1",
          redaction: "applied",
          evidence: [{ line: "scheduling experience", quoted: true }],
          decision: "none_by_design",
          confidence: 0.9,
        }),
      },
      {
        id: "shortlist",
        label: "Shortlist for review",
        kind: "human",
        does: "Shows the evidence beside the application and waits for the hiring manager's decision.",
        guardrail: "A person makes every advance or decline decision. The model never rejects anyone.",
        failure: "An application with no decision stays open.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Hiring manager",
          channel: "Applicant tracking view with Advance and Decline",
          expiresAfter: "5 business days, then returned to the queue",
          approveLabel: "Advance candidate",
          rejectLabel: "Decline",
          rejectOutcome: "declined by a person, and nothing was sent",
        },
        payload: sample({
          application: "sample-app-700",
          decision: "pending",
          decided_by: "hiring_manager",
        }),
      },
      {
        id: "outreach-approval",
        label: "Outreach approval",
        kind: "human",
        does: "Asks the recruiter to read the interview message before it is sent, and waits.",
        guardrail: "No candidate receives an unapproved email.",
        failure: "An unanswered request expires and returns to the recruiter's queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Recruiter",
          channel: "Email draft in the applicant tracking system",
          expiresAfter: "2 business days, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "recruiter",
          message: "sample-message-700",
        }),
      },
      {
        id: "interview",
        label: "Interview scheduled",
        kind: "output",
        audience: "external",
        does: "Sends the approved message with a scheduling link and records the booking.",
        guardrail: "Sent after approval, with the approved text only.",
        failure: "A bounced address is returned to the recruiter.",
        timingLabel: "Seconds",
        payload: sample({
          application: "sample-app-700",
          approved_by: "recruiter",
          sent: false,
        }),
      },
    ],
  }),
];

export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.id === id);
}

export function workflowsById(ids: string[]): Workflow[] {
  return ids.map(getWorkflow).filter((item): item is Workflow => item !== undefined);
}
