export type Faq = { q: string; a: string };

export const PRINCIPLES: { title: string; short: string; body: string }[] = [
  {
    title: "Deterministic code wherever possible",
    short: "Rules, lookups and arithmetic are ordinary code. They give the same answer every time.",
    body: "If a step can be written as a rule, we write it as a rule. Matching an invoice to a purchase order, checking a margin floor and routing by territory do not need a model. Code is cheaper to run, easier to test and simple to explain to an auditor or a new hire. When it fails, it fails in a place you can point to.",
  },
  {
    title: "AI only where judgment is needed",
    short: "Model output has to match a schema. Output that does not match is discarded.",
    body: "Reading a message, pulling fields from a document and drafting a reply are judgment work, and a model is useful there. We ask for structured output and validate it against a schema before the next step sees it. A confidence threshold decides what continues. Anything below it goes to a person's queue with the original attached.",
  },
  {
    title: "A person approves what leaves the company",
    short: "Anything a customer, supplier or candidate will see waits for a named person.",
    body: "The gate shows the draft, the source and the reason it was produced. The person can approve, edit or reject, and their choice is logged with the time. If nobody answers, the item expires and returns to the queue. It does not send itself.",
  },
  {
    title: "You own the code, the accounts and the logs",
    short: "The work runs in your accounts, from your repository, under credentials you can revoke.",
    body: "We build under accounts you control. The repository, the prompts, the automation platform and the log store belong to the company. If the engagement ends, nothing has to be moved and nothing stops working. Removing our access is one line in the runbook.",
  },
  {
    title: "Every workflow ships with its operating kit",
    short: "Monitoring, an audit log and a runbook are part of the build, not an extra.",
    body: "Each run writes a record of what came in, what each step decided and who approved it. Monitoring watches for failures, stuck items and unusual volume. The runbook says what each alert means, who handles it and how to run the process by hand for a day.",
  },
];

/** The four mechanics shown on the homepage. */
export const MECHANICS: { title: string; body: string }[] = [
  {
    title: "Schema-validated AI steps",
    body: "A model's answer is checked against a fixed shape before the next step can read it. A bad answer stops there.",
  },
  {
    title: "Approval gates",
    body: "A message with Approve, Edit and Reject goes to a named person. The workflow waits. If nobody answers, the item goes back to the queue.",
  },
  {
    title: "An audit log",
    body: "Each run records its input, each decision, the person who approved it and what was sent. You can read it without us.",
  },
  {
    title: "Monitoring and a runbook",
    body: "Failures raise an alert with a page that says what it means, who handles it and how to run the step by hand.",
  },
];

export const METHOD: {
  title: string;
  happens: string;
  see: string;
  approve: string;
}[] = [
  {
    title: "Map",
    happens:
      "We follow real items through the process with the people who handle them. We record where data enters, where it is retyped, where it waits and what happens when a field is empty. The exceptions get as much time as the normal path, because they are where most automations break.",
    see: "A process map, a systems inventory and a ranked list of candidates, with the hours arithmetic and every assumption behind it.",
    approve: "The map itself. If it does not match how the work is done, we correct it before going further.",
  },
  {
    title: "Design",
    happens:
      "We choose one candidate and write its data contract: each field, its type, its source and its owner. We mark which steps are code, which need a model and which need a person. Failure cases are written down with the response each one should get.",
    see: "A short design document with the data contract, the approval gates, the failure table and the list of access we will need.",
    approve: "The gates, the thresholds and the access list. Nothing is built until these are agreed.",
  },
  {
    title: "Build and shadow-test",
    happens:
      "The workflow is built in your repository and your accounts. It then runs beside the manual process for an agreed period without sending anything. We compare its output with what your team did, item by item, and treat each difference as a defect until it is explained.",
    see: "A shadow report listing every difference, its cause and the change made because of it.",
    approve: "The cut-over. You decide when the difference list is short enough to switch.",
  },
  {
    title: "Hand over and operate",
    happens:
      "Your team runs the process with us present, including one deliberate failure. They learn where the log is, what the alerts mean and how to go back to the manual path. After that, you can run it alone or keep us on for monitoring and changes.",
    see: "The runbook, the alert list, the saved test examples and a record of who holds each credential.",
    approve: "Acceptance of the handover, and separately, whether you want ongoing operations.",
  },
];

export const OWNED_ITEMS: { title: string; body: string }[] = [
  { title: "Repositories", body: "Source code, configuration and tests, in your organization's account." },
  { title: "Accounts", body: "Automation platform, model provider and integrations, billed to you and administered by you." },
  { title: "Logs", body: "Run history and approvals, stored where your team can query them." },
  { title: "Runbooks", body: "Written for the people on your team who will use them, with the manual fallback included." },
  { title: "Prompts and schemas", body: "Versioned beside the code, with the saved examples used to test a change." },
];

export const APPROACH_FAQ: Faq[] = [
  {
    q: "Do we have to do all four steps?",
    a: "No. The audit stands on its own. You can take the roadmap to your own team, to another firm, or decide that nothing is worth building yet.",
  },
  {
    q: "How much time do you need from our people?",
    a: "Most of it falls in the audit, when we watch the work being done. After that we need one owner who can answer questions, plus the people who will sit at each approval gate.",
  },
  {
    q: "What happens if the shadow test goes badly?",
    a: "The manual process is still running, so nothing has been lost. We fix the cause and run it again, or we tell you the step is not a good candidate and stop there.",
  },
  {
    q: "Can you work with automations we already have?",
    a: "Yes. The audit inventories them, including who owns each one and what it does when it fails. Some are worth keeping, and some are worth replacing with a few lines of code.",
  },
  {
    q: "What does it cost?",
    a: "The audit is a fixed-scope proposal. Build work is scoped after the audit, once the size of each workflow is known.",
  },
];
