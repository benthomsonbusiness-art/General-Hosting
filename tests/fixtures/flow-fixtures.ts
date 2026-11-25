/**
 * Diagram fixtures for the layout test, written from the v6 specs (Appendix A section 2,
 * lead-triage; Appendix B section 2, ap-intake: six columns and two approvals). They use only
 * the fields the diagram reads, so the test does not depend on the live workflow data.
 */
import type { FlowNodeInput } from "../../components/workflow/flow/layout.ts";
import type { Attachment, WorkflowNode } from "../../content/workflows.ts";

export type FixtureNode = FlowNodeInput & Pick<WorkflowNode, "does" | "guardrail" | "failure">;
export type FixtureWorkflow = { id: string; title: string; nodes: FixtureNode[] };

const CLAUDE: Omit<Attachment, "id"> = {
  label: "Claude",
  port: "model",
  app: "claude",
  operation: "Messages",
  alternatives: ["OpenAI GPT"],
  does: "The language model. Its version is pinned in your repository.",
  readOnly: true,
};

export const LEAD_TRIAGE: FixtureWorkflow = {
  id: "lead-triage",
  title: "Inbound lead triage",
  nodes: [
    {
      id: "lead-received",
      label: "New lead from website form",
      kind: "trigger",
      app: { app: "typeform", operation: "New response", alternatives: ["Jotform", "HubSpot Forms", "Webflow"] },
      does: "Accepts the submission and writes the raw record to the audit log before any later step runs.",
      guardrail: "The form's webhook signature is checked. Unsigned payloads are rejected and logged.",
      failure: "A malformed payload is stored as rejected and never reaches the CRM.",
    },
    {
      id: "scoring",
      label: "Score lead, draft reply",
      kind: "ai",
      attached: [
        { ...CLAUDE, id: "scoring-model" },
        {
          id: "enrichment",
          label: "Look up the company",
          port: "tools",
          app: "apollo",
          operation: "Enrich company",
          alternatives: ["Clearbit", "ZoomInfo"],
          does: "Looks up the company by its email domain. Missing fields are marked partial, never guessed.",
          readOnly: true,
        },
        {
          id: "existing-account",
          label: "Find existing account",
          port: "tools",
          app: "hubspot",
          operation: "Find contact",
          alternatives: ["Salesforce", "Pipedrive"],
          does: "Checks whether the company or the person is already in the CRM.",
          readOnly: true,
        },
        {
          id: "fit-definition",
          label: "Read your fit definition",
          port: "tools",
          app: "notion",
          operation: "Get page",
          alternatives: ["Google Docs", "Confluence"],
          does: "Reads the written definition of a good-fit customer that your team keeps.",
          readOnly: true,
        },
      ],
      does: "Reads the message and the company record, then returns fit, intent and a draft reply.",
      guardrail: "Output that fails the check is thrown out. Nothing is sent from this step.",
      failure: "One retry, then the lead goes to a person with the raw output attached.",
    },
    {
      id: "crm-sync",
      label: "Save lead to the CRM",
      kind: "deterministic",
      app: { app: "hubspot", operation: "Update record", alternatives: ["Salesforce", "Pipedrive"] },
      does: "Creates or updates the contact and saves the score and the draft reply on the record.",
      guardrail: "One record per email address. Every write is logged.",
      failure: "A failed write retries once, then alerts the owner.",
    },
    {
      id: "reply-approval",
      label: "Sales lead approves reply",
      kind: "human",
      gate: {
        approver: "Sales lead",
        channel: "Slack message with Approve, Edit and Reject",
        expiresAfter: "4 business hours, then back to the queue",
        channelApp: "slack",
        operation: "Approve button",
      },
      does: "Shows the draft, the score and the original message to the sales lead, and waits.",
      guardrail: "Nothing is sent without a click.",
      failure: "If nobody responds, the item expires and returns to the queue unsent.",
    },
    {
      id: "first-reply",
      label: "Send the approved reply",
      kind: "output",
      audience: "external",
      app: { app: "gmail", operation: "Send message", alternatives: ["Outlook"] },
      does: "Sends exactly the approved text from the approver's mailbox.",
      guardrail: "Only the approved text is sent.",
      failure: "A send failure alerts the approver. It never retries with different text.",
    },
  ],
};

const QB = { app: "quickbooks" as const, alternatives: ["Xero"], readOnly: true, port: "calls" as const };

export const AP_INTAKE: FixtureWorkflow = {
  id: "ap-intake",
  title: "Accounts payable intake",
  nodes: [
    {
      id: "invoice-arrives",
      label: "New invoice in AP inbox",
      kind: "trigger",
      app: { app: "outlook", operation: "New email", alternatives: ["Gmail"] },
      does: "Watches the AP mailbox and opens one item per invoice attachment.",
      guardrail: "Senders must be on the vendor list. Attachments are scanned before anything opens them.",
      failure: "An unknown sender goes to a person and is never processed automatically.",
    },
    {
      id: "extraction",
      label: "Read the invoice",
      kind: "ai",
      attached: [{ ...CLAUDE, id: "extraction-model", alternatives: ["Azure OpenAI"] }],
      does: "Reads the supplier, invoice number, dates, lines and total. This step has no tools.",
      guardrail: "Code checks that the lines add up to the total.",
      failure: "An unreadable file goes to a person with the original attached.",
    },
    {
      id: "po-match",
      label: "Match PO and receipt",
      kind: "deterministic",
      app: { app: "code", operation: "Three-way match", alternatives: [] },
      attached: [
        { ...QB, id: "get-po", label: "Get the purchase order", operation: "Get order", does: "Reads the purchase order." },
        {
          id: "find-receipt",
          label: "Find the receipt",
          port: "calls",
          app: "googlesheets",
          operation: "Look up",
          alternatives: ["Excel"],
          does: "Finds the receiving log row.",
          readOnly: true,
        },
        { ...QB, id: "find-duplicate", label: "Check for duplicates", operation: "Find bill", does: "Looks for the same bill." },
        { ...QB, id: "get-vendor", label: "Check the vendor", operation: "Get vendor", does: "Reads the vendor record." },
      ],
      does: "Matches the invoice to its purchase order and receipt, and checks for a duplicate.",
      guardrail: "Any mismatch, duplicate or changed bank detail goes to the clerk.",
      failure: "If QuickBooks is unavailable, the item waits and retries on a schedule.",
    },
    {
      id: "exception-queue",
      label: "AP clerk resolves mismatch",
      kind: "human",
      gate: {
        approver: "AP clerk",
        channel: "Slack, #ap-exceptions, with Resolve and Return to supplier",
        expiresAfter: "3 business days, then the controller",
        channelApp: "slack",
        operation: "Review request",
      },
      does: "Posts the mismatch with both documents and waits for a decision and a reason.",
      guardrail: "A person resolves each exception, and the reason is logged.",
      failure: "An unresolved item cannot move to payment.",
    },
    {
      id: "batch-approval",
      label: "Controller approves batch",
      kind: "human",
      gate: {
        approver: "Controller",
        channel: "BILL approvals, with Approve and Deny",
        expiresAfter: "End of the payment day",
        channelApp: "billcom",
        operation: "Approve bills",
      },
      does: "Shows the batch with every invoice and exception note, and waits for the controller.",
      guardrail: "Payments are never released automatically.",
      failure: "An unanswered batch expires and returns to the queue unpaid.",
    },
    {
      id: "batch-scheduled",
      label: "Schedule approved batch",
      kind: "output",
      audience: "external",
      app: { app: "billcom", operation: "Schedule payment", alternatives: ["QuickBooks Bill Pay", "Ramp"] },
      does: "Schedules exactly the approved batch and records who approved it.",
      guardrail: "The batch is locked at approval.",
      failure: "A failed schedule alerts the controller.",
    },
  ],
};

export const FIXTURES: FixtureWorkflow[] = [LEAD_TRIAGE, AP_INTAKE];
