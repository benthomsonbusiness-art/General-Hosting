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
  /** Verb-first action, at most 28 characters. */
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
    channelApp: AppSlug;
    /** Mono operation for the approval, e.g. "Approve button". */
    operation: string;
  };
  confidence?: { threshold: number; belowThreshold: string };
  /** Required on trigger, deterministic and output nodes. Absent on ai and human nodes. */
  app?: AppRef;
  attached?: Attachment[];
  /**
   * Exit stub text drawn above the card: on a rule step that can stop the item, or on an AI step
   * whose unsure path differs from the default "Unsure: goes to a person, nothing sent".
   */
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
  human: "Human in the loop",
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

const OWNED = "It runs in your accounts. The code, logs, AI instructions and logins are yours.";

/** The model behind an AI step. Named "Claude" with no version: versions go stale on a page. */
function claude(
  id: string,
  does = "Reads only what this step hands it and answers in fixed fields. Its version is pinned in your code and tested before any update.",
): Attachment {
  return {
    id,
    label: "Claude",
    port: "model",
    app: "claude",
    operation: "Messages",
    alternatives: ["OpenAI", "Azure OpenAI"],
    does,
    readOnly: true,
  };
}

export const WORKFLOWS: Workflow[] = [
  define({
    id: "lead-triage",
    title: "New lead follow-up",
    trigger: "A lead fills in your website form",
    outcome: "A scored CRM record and an approved first reply",
    summary:
      "Every new lead is checked, looked up and scored against your definition of a good fit, and a first reply is drafted. The CRM is updated, and your sales lead approves the reply before it goes out.",
    metaDescription:
      "How a new lead is checked, looked up, scored and added to your CRM, with a first reply drafted for your sales lead to approve before it goes out. An example.",
    services: [AI],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "lead-received",
        label: "New lead from website form",
        kind: "trigger",
        app: { app: "typeform", operation: "New response", alternatives: ["Jotform", "HubSpot Forms", "Webflow"] },
        does: "Saves the lead to the log before anything else happens.",
        guardrail: "Submissions that fail the form's security check are rejected and logged.",
        failure: "A malformed submission is stored as rejected and never reaches the CRM.",
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
        id: "scoring",
        label: "Score lead, draft reply",
        kind: "ai",
        attached: [
          claude("scoring-model"),
          {
            id: "enrichment",
            label: "Look up the company",
            port: "tools",
            app: "apollo",
            operation: "Enrich company",
            alternatives: ["ZoomInfo", "HubSpot"],
            does: "Looks up the company by its website, checks the domain receives email, and fills in size and industry. Missing fields are marked partial, never guessed.",
            readOnly: true,
          },
          {
            id: "existing-account",
            label: "Find existing account",
            port: "tools",
            app: "hubspot",
            operation: "Find contact",
            alternatives: ["Salesforce", "Pipedrive"],
            does: "Checks whether the company or the person is already in your CRM.",
            readOnly: true,
          },
          {
            id: "fit-definition",
            label: "Read your fit definition",
            port: "tools",
            app: "notion",
            operation: "Get page",
            alternatives: ["Google Docs", "Confluence"],
            does: "Reads the written description of a good-fit customer that your team keeps.",
            readOnly: true,
          },
        ],
        does: "Reads the message and the company record, rates how good a fit the lead is and how ready they are to buy, and drafts a first reply. All of it comes back in fixed fields with a confidence level.",
        guardrail: "Answers in the wrong format are thrown out. Nothing is sent from this step.",
        failure: "One retry on a bad answer, then the lead goes to a person with the raw answer attached.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The lead goes to a person. The draft is discarded and nothing is sent.",
        },
        payload: sample({
          intent: "process_automation",
          fit: "medium",
          confidence: 0.9,
          reason: "Names a manual quoting process and the inbox it runs through.",
          draft: "Thanks for the note about quoting. Could you tell us which system holds the price list?",
          enrichment: "partial",
          existing_account: false,
          schema: "lead-score.v1",
        }),
      },
      {
        id: "crm-sync",
        label: "Save lead to the CRM",
        kind: "deterministic",
        app: { app: "hubspot", operation: "Update record", alternatives: ["Salesforce", "Pipedrive"] },
        does: "Creates or updates the contact and company, and saves the score and the draft reply on the record.",
        guardrail: "Matched by email, so no lead is entered twice. Every change is logged.",
        failure: "A failed write retries without creating a duplicate, then alerts the owner.",
        timingLabel: "Seconds",
        payload: sample({
          operation: "upsert",
          match_on: "email",
          record_id: "sample-contact-100",
          fields_written: ["fit", "intent", "source", "draft_reply"],
          draft_reply: "ready_for_review",
        }),
      },
      {
        id: "reply-approval",
        label: "Sales lead approves reply",
        kind: "human",
        does: "Shows the draft reply, the score and the original message to the sales lead, and waits.",
        guardrail: "Nothing is sent without a click. There is no automatic approval.",
        failure: "If nobody responds, the item expires and returns to the queue unsent.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Sales lead",
          channel: "Slack message with Approve, Edit and Reject",
          channelApp: "slack",
          operation: "Approve button",
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
        label: "Send the approved reply",
        kind: "output",
        audience: "external",
        app: { app: "gmail", operation: "Send message", alternatives: ["Outlook"] },
        does: "Sends exactly the approved text from the approver's mailbox and logs it on the CRM record.",
        guardrail: "Only the approved text is sent. The approver's name is written to the log.",
        failure: "A send failure alerts the approver. It never retries with different text.",
        timingLabel: "Seconds",
        payload: sample({
          to: "rivera@harborline.example",
          approved_by: "sales_lead",
          sent: false,
          log_id: "audit-lead-001-5",
        }),
      },
    ],
  }),
  define({
    id: "proposal-ops",
    title: "Proposals and contracts",
    trigger: "A discovery call is transcribed",
    outcome: "An approved proposal, a signature request and a draft invoice",
    summary:
      "After a discovery call, what the client asked for is listed with timestamps, priced from your rate card and placed in your proposal template. A partner approves it before it goes out for signature, and the first invoice waits as a draft.",
    metaDescription:
      "How a sales call becomes a priced proposal: requirements pulled from the call, a margin check, partner approval, a signature request and a draft first invoice.",
    services: [AI],
    industries: ["professional-services", "financial-accounting-firms"],
    ownership: OWNED,
    nodes: [
      {
        id: "transcript",
        label: "Discovery call ends",
        kind: "trigger",
        app: { app: "zoom", operation: "Transcript ready", alternatives: ["Microsoft Teams", "Google Meet", "Fireflies"] },
        does: "Picks up a finished transcript and attaches it to the open deal in the CRM.",
        guardrail: "Only calls booked as discovery calls are processed.",
        failure: "Any other call is ignored. A call with no matching deal goes to the owner.",
        timingLabel: "On event",
        payload: sample({
          call_type: "discovery",
          deal: "sample-deal-200",
          company: "Northfield Studio",
          duration_min: 30,
          received_at: "2026-03-03T17:00:00Z",
        }),
      },
      {
        id: "requirements",
        label: "Pull requirements from call",
        kind: "ai",
        attached: [
          claude("requirements-model"),
          {
            id: "open-deal",
            label: "Find the open deal",
            port: "tools",
            app: "hubspot",
            operation: "Get deal",
            alternatives: ["Salesforce", "Pipedrive"],
            does: "Reads the deal the call belongs to, so each requirement lands on the right client.",
            readOnly: true,
          },
        ],
        does: "Lists what the client asked for on the call, each item tied to the moment it was said.",
        guardrail: "Every item carries a timestamp that code checks against the transcript. Missing items are flagged, not filled.",
        failure: "An item with no timestamp is dropped and listed for the account owner.",
        timingLabel: "Minutes",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The transcript goes to a person, who writes the requirements. Nothing is sent.",
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
        label: "Price it, check margin",
        kind: "deterministic",
        app: { app: "googlesheets", operation: "Look up", alternatives: ["Excel"] },
        stopLabel: "Below your margin floor: nothing sent",
        does: "Prices each item from your rate card, totals the estimate and compares it with your minimum margin.",
        guardrail: "Below your minimum margin, the proposal stops and the owner is told.",
        failure: "An item missing from the rate card stops the proposal and names the item.",
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
        label: "Fill the proposal template",
        kind: "deterministic",
        app: { app: "googledocs", operation: "New copy", alternatives: ["Word", "PandaDoc"] },
        does: "Copies your proposal template and fills it with the requirements and priced lines.",
        guardrail: "Prices come only from the rate card. AI never writes the pricing section.",
        failure: "An unfilled template field stops the step and names the field.",
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
        label: "Partner approves proposal",
        kind: "human",
        does: "Asks the responsible partner to read, edit and approve the proposal, and waits.",
        guardrail: "Edits are tracked. Nothing goes out unapproved.",
        failure: "An unanswered request expires and returns to the partner's queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Responsible partner",
          channel: "Slack message with Approve and Reject, linking the Google Doc with tracked edits",
          channelApp: "slack",
          operation: "Approve button",
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
        label: "Send for signature",
        kind: "output",
        audience: "external",
        app: { app: "docusign", operation: "Send to sign", alternatives: ["PandaDoc"] },
        does: "Sends the approved version to the named signer.",
        guardrail: "Sent only after approval, and only the approved version.",
        failure: "A bounced signer address alerts the account owner and pauses the proposal.",
        timingLabel: "Seconds",
        payload: sample({
          signer: "j.park@northfield.example",
          document_version: "approved",
          sent: false,
        }),
      },
      {
        id: "invoice-created",
        label: "Draft the first invoice",
        kind: "output",
        audience: "internal",
        app: { app: "quickbooks", operation: "Draft", alternatives: ["Xero"] },
        does: "Creates the first invoice as a draft from the approved proposal total. It is not sent to the client.",
        guardrail: "The amount must match the approved proposal total exactly.",
        failure: "Any mismatch stops the invoice and alerts finance.",
        timingLabel: "Seconds",
        payload: sample({
          invoice: "sample-inv-200",
          total_units: 100,
          matches_proposal: true,
          status: "draft",
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
      "A signed contract sends the intake form, sets up folders and tasks, and drafts a welcome email from the client's answers. The account lead approves it before anything is sent.",
    metaDescription:
      "How a signed contract starts onboarding: the intake form, folders and tasks, a welcome email your account lead approves, and a kickoff invite. An example.",
    services: [AI],
    industries: ["professional-services", "health-wellness-fitness", "financial-accounting-firms"],
    ownership: OWNED,
    nodes: [
      {
        id: "contract-signed",
        label: "Client signs the contract",
        kind: "trigger",
        app: { app: "docusign", operation: "Completed", alternatives: ["PandaDoc"] },
        does: "Receives the signed-contract notice and starts onboarding for that client.",
        guardrail: "Each contract is handled once, so no client is onboarded twice.",
        failure: "A repeated notice is logged and ignored.",
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
        label: "Collect intake answers",
        kind: "deterministic",
        app: { app: "typeform", operation: "New response", alternatives: ["Jotform"] },
        stopLabel: "Incomplete: account lead alerted",
        does: "Sends the intake form agreed in the contract and waits for a complete set of answers.",
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
        label: "Set up the workspace",
        kind: "deterministic",
        app: { app: "code", operation: "From templates", alternatives: [] },
        attached: [
          {
            id: "client-folder",
            label: "Create the client folder",
            port: "calls",
            app: "googledrive",
            operation: "Copy",
            alternatives: ["SharePoint", "Dropbox"],
            does: "Copies your folder template for the client, with access set by role.",
            readOnly: false,
          },
          {
            id: "client-project",
            label: "Create the project",
            port: "calls",
            app: "asana",
            operation: "Create project",
            alternatives: ["ClickUp", "monday.com"],
            does: "Creates the project from your template and assigns the starting tasks.",
            readOnly: false,
          },
        ],
        does: "Creates the client folder and the project from templates and assigns the starting tasks.",
        guardrail: "Access is set by role. No open sharing links.",
        failure: "A partial setup finishes on retry. It never creates a second folder.",
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
        label: "Draft the welcome email",
        kind: "ai",
        attached: [claude("welcome-model")],
        does: "Drafts a welcome that refers to the client's own answers and the first three dates.",
        guardrail: "Draft only. Names, dates and facts are checked against the intake answers.",
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
        does: "Puts the draft in the account lead's Gmail, asks for a decision in Slack, and waits.",
        guardrail: "The lead approves or edits before anything is sent.",
        failure: "An unanswered request expires and returns to the lead's queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Account lead",
          channel: "Slack message with Approve and Reject. The draft sits in the lead's Gmail for edits.",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "1 business day, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "account_lead",
          draft: "sample-draft-300",
        }),
      },
      {
        id: "welcome-sent",
        label: "Send the welcome email",
        kind: "output",
        audience: "external",
        app: { app: "gmail", operation: "Send draft", alternatives: ["Outlook"] },
        does: "Sends exactly the approved welcome from the lead's mailbox.",
        guardrail: "Only the approved text is sent. The approver's name is written to the log.",
        failure: "A send failure alerts the account lead. It never retries with different text.",
        timingLabel: "Seconds",
        payload: sample({
          to: "m.bell@cedarrow.example",
          approved_by: "account_lead",
          sent: false,
        }),
      },
      {
        id: "kickoff",
        label: "Book the kickoff call",
        kind: "output",
        audience: "external",
        app: { app: "googlecalendar", operation: "Book", alternatives: ["Outlook calendar", "Calendly"] },
        does: "Sends a kickoff invite from the lead's calendar at a time both sides have open.",
        guardrail: "Uses the account lead's calendar. The invite goes out only after approval.",
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
    title: "Daily owner brief",
    trigger: "6:30 each weekday morning",
    outcome: "A cited, internal summary of what changed",
    summary:
      "Every weekday morning, yesterday's numbers are pulled from your systems, checked against limits you set, and summarized with a source for each line. The brief goes to your leadership team only.",
    metaDescription:
      "How a morning brief is built from billing, accounting and CRM numbers, flagged against limits you set, with a source for every line. An example workflow.",
    services: [AI],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "schedule",
        label: "Weekdays at 6:30 a.m.",
        kind: "trigger",
        app: { app: "clock", operation: "Weekdays", alternatives: [] },
        does: "Starts on working days in the owner's time zone.",
        guardrail: "Skips weekends and holidays on a calendar you can edit.",
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
        label: "Pull yesterday's figures",
        kind: "deterministic",
        app: { app: "code", operation: "Read-only pulls", alternatives: [] },
        attached: [
          {
            id: "payments",
            label: "Read payments",
            port: "calls",
            app: "stripe",
            operation: "List payments",
            alternatives: ["Square"],
            does: "Reads yesterday's payments received.",
            readOnly: true,
          },
          {
            id: "invoices",
            label: "Read invoices and bills",
            port: "calls",
            app: "quickbooks",
            operation: "Get report",
            alternatives: ["Xero"],
            does: "Reads invoices issued, bills due and what is overdue.",
            readOnly: true,
          },
          {
            id: "deals",
            label: "Read open deals",
            port: "calls",
            app: "hubspot",
            operation: "Search deals",
            alternatives: ["Pipedrive", "Salesforce"],
            does: "Reads deals that were opened, moved or closed yesterday.",
            readOnly: true,
          },
        ],
        does: "Reads yesterday's figures from billing, accounting and the CRM with read-only access.",
        guardrail: "If a source fails, the brief names it. There is no silent gap.",
        failure: "Two retries per source, then the brief goes ahead with that source marked missing.",
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
        label: "Check against your limits",
        kind: "deterministic",
        app: { app: "code", operation: "Check limits", alternatives: [] },
        attached: [
          {
            id: "limits",
            label: "Read your limits",
            port: "calls",
            app: "googlesheets",
            operation: "Read",
            alternatives: ["Excel"],
            does: "Reads the limits from a sheet the office manager can edit.",
            readOnly: true,
          },
        ],
        does: "Compares each number with its usual range and flags the ones outside your limits.",
        guardrail: "You set the limits. Every flag links to its source rows.",
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
        label: "Write the cited brief",
        kind: "ai",
        attached: [claude("brief-model")],
        stopLabel: "Unsure: summary held, nothing posted",
        does: "Turns the flags into a few plain sentences, each with its source row.",
        guardrail: "Every sentence cites a source row. Uncited sentences are dropped.",
        failure: "If the summary fails, nothing is posted and the owner is alerted.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The summary is held for a person. Nothing is posted.",
        },
        payload: sample({
          sentences: [{ text: "One invoice passed its due date.", source: "sample-row-41" }],
          dropped_uncited: 1,
          confidence: 0.9,
        }),
      },
      {
        id: "brief-delivered",
        label: "Post brief to leadership",
        kind: "output",
        audience: "internal",
        app: { app: "slack", operation: "Post message", alternatives: ["Microsoft Teams", "email"] },
        does: "Posts the brief to the leadership channel. Nothing goes to customers, so no approval step is needed.",
        guardrail: "Internal recipients only, from a fixed list. Nothing in this workflow reaches a customer.",
        failure: "A posting failure alerts the owner and stores the brief for pickup.",
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
    title: "Supplier invoice processing",
    trigger: "A supplier invoice reaches the AP inbox",
    outcome: "A matched, approved payment batch",
    summary:
      "Supplier invoices are read, checked line by line and matched to purchase orders. Mismatches go to a person, and your controller approves every payment batch.",
    metaDescription:
      "How supplier invoices are read, matched to purchase orders and sent to a person when they disagree, with your controller approving every payment batch.",
    services: [AI],
    industries: ["financial-accounting-firms", "ecommerce-retail", "home-services"],
    ownership: OWNED,
    nodes: [
      {
        id: "invoice-arrives",
        label: "New invoice in AP inbox",
        kind: "trigger",
        app: { app: "outlook", operation: "New email", alternatives: ["Gmail"] },
        does: "Watches the AP mailbox and opens one item per invoice attachment.",
        guardrail: "Only approved senders are accepted. Attachments are virus-scanned before opening.",
        failure: "An unknown sender goes to a person and is never processed automatically.",
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
        label: "Read the invoice",
        kind: "ai",
        attached: [
          claude(
            "extraction-model",
            "Reads the invoice file and answers in fixed fields. It has no tools, so text inside an invoice cannot reach a payment.",
          ),
        ],
        does: "Reads the supplier, invoice number, dates, lines and total into fixed fields. This step has no tools.",
        guardrail: "Code checks the fields and that the lines add up to the total. A failed check goes to the AP clerk.",
        failure: "An unreadable file goes to a person with the original attached.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.85,
          belowThreshold: "A person keys the invoice by hand. Nothing moves to payment.",
        },
        payload: sample({
          supplier: "Fieldstone Supply",
          invoice_number: "SAMPLE-1001",
          lines: [100, 150, 50],
          total: 300,
          sum_matches: true,
          confidence: 0.9,
          tools_available: 0,
        }),
      },
      {
        id: "po-match",
        label: "Match PO and receipt",
        kind: "deterministic",
        app: { app: "code", operation: "Three-way match", alternatives: [] },
        attached: [
          {
            id: "get-po",
            label: "Get the purchase order",
            port: "calls",
            app: "quickbooks",
            operation: "Get order",
            alternatives: ["Xero"],
            does: "Reads the purchase order the invoice refers to.",
            readOnly: true,
          },
          {
            id: "find-receipt",
            label: "Find the receipt",
            port: "calls",
            app: "googlesheets",
            operation: "Look up",
            alternatives: ["Excel"],
            does: "Finds the delivery in your receiving log.",
            readOnly: true,
          },
          {
            id: "find-duplicate",
            label: "Check for duplicates",
            port: "calls",
            app: "quickbooks",
            operation: "Find bill",
            alternatives: ["Xero"],
            does: "Checks whether the same invoice was already entered.",
            readOnly: true,
          },
          {
            id: "get-vendor",
            label: "Check the vendor",
            port: "calls",
            app: "quickbooks",
            operation: "Get vendor",
            alternatives: ["Xero"],
            does: "Reads the supplier record and flags any change to bank details.",
            readOnly: true,
          },
        ],
        does: "Matches the invoice to its purchase order and receipt by number, quantity and amount, and checks for a duplicate.",
        guardrail: "Invoice, purchase order and receipt must all agree. Any mismatch, duplicate or changed bank detail goes to the AP clerk.",
        failure: "If QuickBooks is unavailable, the step waits and retries on a schedule.",
        timingLabel: "Seconds",
        payload: sample({
          purchase_order: "SAMPLE-PO-77",
          receipt: "SAMPLE-RC-77",
          duplicate: false,
          bank_details_changed: false,
          match: "three_way",
          mismatch: ["quantity"],
        }),
      },
      {
        id: "exception-queue",
        label: "AP clerk resolves mismatch",
        kind: "human",
        does: "Posts the mismatch with both documents to #ap-exceptions and waits for a decision and a reason.",
        guardrail: "A person resolves each mismatch, and the reason is logged.",
        failure: "An unresolved item cannot move to payment.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "AP clerk",
          channel: "Slack, #ap-exceptions, with Resolve and Return to supplier",
          channelApp: "slack",
          operation: "Review request",
          expiresAfter: "3 business days, then escalated to the controller",
          approveLabel: "Resolve mismatch",
          rejectLabel: "Return to supplier",
          rejectOutcome: "returned to the supplier and nothing was paid",
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
        label: "Controller approves batch",
        kind: "human",
        does: "Shows the batch with every invoice and mismatch note, and waits for the controller.",
        guardrail: "Payments are never released automatically. Only the controller's approval releases a batch.",
        failure: "An unanswered batch expires and returns to the queue unpaid.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Controller",
          channel: "BILL approvals, with Approve and Deny",
          channelApp: "billcom",
          operation: "Approve bills",
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
        label: "Schedule approved batch",
        kind: "output",
        audience: "external",
        app: { app: "billcom", operation: "Schedule payment", alternatives: ["QuickBooks Bill Pay", "Ramp"] },
        does: "Schedules exactly the approved batch and records who approved it.",
        guardrail: "The batch is locked at approval. Nothing outside it can be added.",
        failure: "A failed schedule alerts the controller. It is never retried under a new batch number.",
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
    outcome: "A labeled ticket and a reply a person sent",
    summary:
      "Tickets are tagged by urgency and topic, and a reply is drafted only when your help articles cover the question. A support rep sends, edits or discards the draft.",
    metaDescription:
      "How support tickets are tagged by urgency and topic, with replies drafted from your help articles and sent only when a support rep approves. An example.",
    services: [AI],
    industries: ["ecommerce-retail", "health-wellness-fitness"],
    ownership: OWNED,
    nodes: [
      {
        id: "ticket-received",
        label: "New ticket in Zendesk",
        kind: "trigger",
        app: { app: "zendesk", operation: "New ticket", alternatives: ["Gorgias", "Help Scout", "Freshdesk", "Intercom"] },
        attached: [
          {
            id: "get-order",
            label: "Look up the order",
            port: "calls",
            app: "shopify",
            operation: "Get orders",
            alternatives: ["Stripe"],
            does: "Attaches the customer's recent order before any AI step reads the ticket.",
            readOnly: true,
          },
        ],
        does: "Opens one ticket per conversation and attaches the customer's recent order or account record.",
        guardrail: "One conversation is one ticket, never two.",
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
        label: "Label urgency and topic",
        kind: "ai",
        attached: [claude("label-model")],
        does: "Chooses an urgency and a topic from a list your support lead keeps.",
        guardrail: "Only tags from your list are allowed. Anything else is rejected.",
        failure: "A rejected tag becomes Needs triage and goes to a person.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The ticket is tagged Needs triage and goes to a person.",
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
        label: "Draft from help articles",
        kind: "ai",
        attached: [
          claude("draft-model"),
          {
            id: "search-articles",
            label: "Search help articles",
            port: "tools",
            app: "zendesk",
            operation: "Find articles",
            alternatives: ["Help Scout Docs"],
            does: "Searches your published help articles. It cannot edit them.",
            readOnly: true,
          },
        ],
        does: "Finds the relevant help articles and drafts a reply that cites them for the rep.",
        guardrail: "The draft lists the articles used. With no source, there is no draft.",
        failure: "When nothing relevant is found, the rep gets an empty reply box and a note.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "No draft is shown. The rep answers from the manual queue.",
        },
        payload: sample({
          articles: ["exchange-policy", "size-guide"],
          draft: "You can exchange the item. Here are the steps from our exchange policy.",
          confidence: 0.9,
        }),
      },
      {
        id: "agent-approves",
        label: "Support rep sends reply",
        kind: "human",
        does: "Shows the draft and its articles beside the ticket. The rep sends it, edits it or discards it.",
        guardrail: "The rep sends or edits. There is no automatic send.",
        failure: "An untouched draft expires and the ticket returns to the open queue.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Support rep",
          channel: "Zendesk ticket sidebar, with Send, Edit and Discard",
          channelApp: "zendesk",
          operation: "Sidebar draft",
          expiresAfter: "The ticket's response target, then returned to the queue",
        },
        payload: sample({
          approval: "pending",
          approver_role: "support_rep",
          ticket: "sample-ticket-500",
        }),
      },
      {
        id: "csat-logged",
        label: "Post reply, log survey",
        kind: "output",
        audience: "external",
        app: { app: "zendesk", operation: "Public reply", alternatives: ["Gorgias"] },
        does: "Posts the approved reply on the ticket. A survey answer, if one arrives later, is recorded against it.",
        guardrail: "Survey results are recorded as received and tied to the ticket.",
        failure: "A missing survey is left blank. It is never estimated.",
        timingLabel: "Seconds",
        payload: sample({
          ticket: "sample-ticket-500",
          approved_by: "support_rep",
          survey: null,
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "meta-ads-reporting",
    title: "Meta Ads reporting",
    trigger: "A read-only pull each morning",
    outcome: "Daily flags and a Monday brief a person acts on",
    summary:
      "Each morning, yesterday's ad results are pulled with read-only access and compared with recent weeks. Flags post the same day, and a brief follows on Mondays. Budget changes stay with a person.",
    metaDescription:
      "How Meta ad results are pulled with read-only access, checked each day for unusual spend and tired ads, and written up on Mondays with numbers from the data.",
    services: ["meta-ads-consulting", AI],
    industries: ["ecommerce-retail", "health-wellness-fitness", "real-estate"],
    ownership: OWNED,
    nodes: [
      {
        id: "daily-pull",
        label: "Pull yesterday's ad data",
        kind: "trigger",
        app: { app: "meta", operation: "Get insights", alternatives: ["Supermetrics"] },
        attached: [
          {
            id: "site-conversions",
            label: "Read site conversions",
            port: "calls",
            app: "googleanalytics",
            operation: "Read",
            alternatives: ["Shopify"],
            does: "Reads yesterday's sales and sign-ups from your site, to set beside the ad figures.",
            readOnly: true,
          },
        ],
        does: "Reads the previous day's campaign and site data on a schedule.",
        guardrail: "Read-only access. It cannot change anything in the ad account.",
        failure: "A failed pull retries, then the post says which day is missing.",
        timingLabel: "Scheduled",
        payload: sample({
          date: "2026-03-05",
          scopes: ["read"],
          rows: { meta: 40, ga4: 40 },
        }),
      },
      {
        id: "anomaly-check",
        label: "Compare to baseline",
        kind: "deterministic",
        app: { app: "code", operation: "Baseline rule", alternatives: ["Google Sheets formulas"] },
        does: "Compares spend, cost per sale and return on ad spend with recent weeks, and flags anything unusual.",
        guardrail: "Flags only. It never changes a budget.",
        failure: "Too little history means no flag, and the post says so.",
        timingLabel: "Seconds",
        payload: sample({
          rules: ["spend_vs_baseline", "cpa_vs_baseline", "roas_vs_baseline"],
          flags: [{ rule: "cpa_vs_baseline", campaign: "sample-campaign-a" }],
        }),
      },
      {
        id: "fatigue-flag",
        label: "Flag tired creative",
        kind: "deterministic",
        app: { app: "code", operation: "Frequency rule", alternatives: ["Meta Ads automated rule, notify only"] },
        does: "Flags ads people have seen too often while clicks are falling.",
        guardrail: "A suggestion only. No ad is paused.",
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
        label: "Write the brief",
        kind: "ai",
        attached: [
          claude("brief-model"),
          {
            id: "last-brief",
            label: "Read last week's brief",
            port: "memory",
            app: "notion",
            operation: "Get page",
            alternatives: ["Google Docs"],
            does: "Reads last week's brief, so the new one can say what changed. Nothing else is kept between days.",
            readOnly: true,
          },
        ],
        stopLabel: "Unsure: brief held, nothing posted",
        does: "Each morning it writes a short note only when a rule fires. On Mondays it writes the week's brief around figures inserted from the data.",
        guardrail: "Numbers are inserted from the data. The AI does not write them.",
        failure: "If the text fails its check, nothing is posted and the owner is alerted.",
        timingLabel: "Minutes",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The brief is held for a person. Nothing is posted.",
        },
        payload: sample({
          template: "monday-brief",
          figures_inserted: 8,
          figures_written_by_model: 0,
          confidence: 0.9,
        }),
      },
      {
        id: "posted",
        label: "Post to #marketing",
        kind: "output",
        audience: "internal",
        app: { app: "slack", operation: "Post message", alternatives: ["Microsoft Teams"] },
        does: "Posts to #marketing. Nothing leaves the company and no budget is touched, so there is no approval step.",
        guardrail: "Internal channel only. Budget and ad changes are made by a person in Ads Manager.",
        failure: "A posting failure alerts the workflow owner.",
        timingLabel: "Scheduled",
        payload: sample({
          channel: "#marketing",
          budget_changes: "none_by_design",
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "recruiting-screen",
    title: "Applicant screening",
    trigger: "An application is submitted",
    outcome: "A person's decision and an approved interview invite",
    summary:
      "Personal details are masked, then AI quotes the resume passages that speak to each job requirement. It does not score or rank. A person reads the application, makes every decision and approves every email.",
    metaDescription:
      "How a job application is screened: personal details are masked, AI quotes evidence without scoring or ranking, and people make every decision. An example.",
    services: [AI],
    industries: ["professional-services", "home-services"],
    ownership: `${OWNED} Rules on automated hiring tools differ by city and state. Your counsel decides whether notice or an audit applies.`,
    nodes: [
      {
        id: "application",
        label: "New application in ATS",
        kind: "trigger",
        app: { app: "greenhouse", operation: "Applied", alternatives: ["Lever", "Workable", "BambooHR"] },
        does: "Stores the application before anything is read.",
        guardrail: "Candidates are told how evidence is prepared and can ask for a person-only review. If they do, the AI step is skipped.",
        failure: "A file that cannot be opened is sent to the recruiter as received.",
        timingLabel: "On event",
        payload: sample({
          application: "sample-app-700",
          role: "Operations coordinator",
          person_only_review: false,
          candidate: "Candidate 700",
        }),
      },
      {
        id: "redaction",
        label: "Mask personal details",
        kind: "deterministic",
        app: { app: "code", operation: "Redact fields", alternatives: [] },
        does: "Masks name, photo, address, date of birth and graduation years before the AI reads anything.",
        guardrail: "The AI only ever sees the masked copy. The original stays in Greenhouse for the hiring manager.",
        failure: "If masking fails, the AI step is skipped and a person reads the original.",
        timingLabel: "Seconds",
        payload: sample({
          application: "sample-app-700",
          masked: ["name", "photo", "address", "date_of_birth", "graduation_years"],
        }),
      },
      {
        id: "rubric-extraction",
        label: "Quote evidence per criterion",
        kind: "ai",
        attached: [
          claude("evidence-model"),
          {
            id: "get-job",
            label: "Read the job criteria",
            port: "tools",
            app: "greenhouse",
            operation: "Get job",
            alternatives: ["Lever"],
            does: "Reads the job requirements your team wrote before any application was read.",
            readOnly: true,
          },
        ],
        does: "Quotes the parts of the masked application that speak to each job requirement.",
        guardrail: "Requirements are job-related and written before any application is read. The AI quotes passages. It gives no score, rank or pass or fail.",
        failure: "Code checks that each quote appears in the application word for word. A requirement with no quote is left blank for a person to read.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "No evidence panel is shown. The hiring manager reads the application as submitted.",
        },
        payload: sample({
          criteria: "operations-coordinator.v1",
          redaction: "applied",
          evidence: [{ requirement: "scheduling experience", quoted: true }],
          score: "none_by_design",
          decision: "none_by_design",
          extraction_confidence: 0.9,
        }),
      },
      {
        id: "shortlist",
        label: "Hiring manager decides",
        kind: "human",
        does: "Shows the quoted evidence beside the full application. The hiring manager advances or declines.",
        guardrail: "A person makes every advance or decline decision with the full application in view. The AI never rejects, ranks or scores anyone.",
        failure: "An application with no decision stays open.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Hiring manager",
          channel: "Greenhouse candidate profile, with Advance and Decline",
          channelApp: "greenhouse",
          operation: "Review",
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
        label: "Recruiter approves invite",
        kind: "human",
        does: "Asks the recruiter to read the interview invite before it is sent, and waits.",
        guardrail: "No candidate receives an unapproved email.",
        failure: "An unanswered request expires and returns to the recruiter.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Recruiter",
          channel: "Greenhouse email draft, with Send and Edit",
          channelApp: "greenhouse",
          operation: "Draft",
          expiresAfter: "2 business days, then returned to the recruiter",
        },
        payload: sample({
          approval: "pending",
          approver_role: "recruiter",
          message: "sample-message-700",
        }),
      },
      {
        id: "interview",
        label: "Send invite and book",
        kind: "output",
        audience: "external",
        app: { app: "calendly", operation: "Invite link", alternatives: ["Google Calendar booking page"] },
        does: "Sends the approved invite with a scheduling link and records the booking.",
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
