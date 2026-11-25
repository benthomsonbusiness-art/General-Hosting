/** Copy for the one-off pages. Short on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Valentini & Co. maps how information moves through owner-led companies, then builds AI workflow automation inside the tools they already use, with approvals.",
  dek: "Deterministic code handles routing and arithmetic. A model reads unstructured notes and drafts replies under a strict schema. A person approves anything that leaves the company.",
  problems: [
    { q: "Inbound leads sitting a full day before anyone sends a first reply", workflowId: "lead-triage" },
    { q: "Supplier invoices keyed line by line and matched to purchase orders by eye", workflowId: "ap-intake" },
    { q: "Managers pulling the same Monday numbers out of three separate tools", workflowId: "daily-brief" },
  ],
  how: {
    heading: "Four stations on one sheet, paused at the human decision",
    steps: [
      { title: "Code", body: "Lookups, routing rules, and invoice math. Runs the same way on every item." },
      { title: "Model", body: "Reads messy notes and drafts a response. Output that fails its schema is dropped." },
      { title: "Person", body: "Inspects the draft beside its source. Nothing goes out until someone clicks approve." },
      { title: "Record", body: "Logs who reviewed the item, what changed in the draft, and the exact text sent." },
    ],
    own: "Everything runs in your accounts, from your own repository. If we stop working together, every workflow keeps running.",
  },
};

export const CTA = {
  headline: ["Tell us which process slows your week down.", "We will map the steps before building anything."],
};

export const SERVICES_HUB = {
  metaDescription:
    "AI workflow automation is the main practice: audits, builds and ongoing operations. Meta Ads Consulting and Strategy support it for owner-led companies.",
  dek: "One main practice, and two that support it.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Where workflow automation applies across professional services, wellness, real estate, retail, home services and accounting firms, and what stays with people.",
  dek: "The patterns are the same. The systems and the approvals differ.",
};

export const WORKFLOWS_PAGE = {
  metaDescription:
    "Three example workflows drawn as the steps they follow. A person approves anything that leaves the company. The other five are written out the same way.",
  title: "Example workflows",
  dek: "Three of them are drawn here. Approval is a labeled step in the path.",
  note: "The step names are the workflow's own. These are examples, not measured results.",
};

export const INSIGHTS_HUB = {
  metaDescription:
    "Guides, articles, checklists and illustrative blueprints on approval gates, deterministic steps, workflow audits and reporting for owner-led companies.",
  dek: "Field notes on building operations software that holds up under real work.",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How Valentini & Co. works: map the process, design the data contract and gates, build and shadow-test, then hand over code, accounts, logs and runbooks.",
  dek: "We follow real items across your tools, write the data contract, run the build beside your team before anything sends, and hand over the repository.",
};

export const ABOUT = {
  metaDescription:
    "Valentini & Co. is an advisory firm in Bloomington, Indiana. How we think about deterministic code, human approval and who should own the finished work.",
  dek: "A private advisory firm building the operational connections between the software your company already runs.",
  beliefs: [
    {
      title: "Keep the software that holds your history",
      body: "Your CRM, ledger, and inbox already contain years of context. We build the reliable routing and checks between them instead of asking your staff to learn another workspace.",
    },
    {
      title: "Write every business rule down first",
      body: "Most delays come from routing logic nobody has written down. Once those thresholds and rules are explicit, ordinary deterministic code handles them cleanly.",
    },
    {
      title: "Keep a person behind every external send",
      body: "A quote, reply, or payment run carries the reputation of your company. Someone on your staff should see the draft beside its source and click approve before it leaves.",
    },
    {
      title: "Leave the repository and keys in your name",
      body: "Every workflow runs inside your own accounts from your own repository, with audit logs and runbooks written for the person who operates it next.",
    },
  ],
  name: "Valentini is a family name.",
  where: "Based in Bloomington, Indiana, working remotely with owner-led companies.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini & Co. which process is slowing the team down. Request a workflow audit, or a consultation on Meta advertising or strategy, by form.",
  dek: "Tell us which workflow is eating up your week and where handoffs tend to stall.",
  guidance: "Please do not send passwords, client records or other confidential material.",
  next: [
    "Ben reads every note.",
    "The form is the way to reach the firm.",
    "A first conversation traces the steps on screen.",
  ],
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Valentini & Co. site for services, workflow blueprints, industries, guides and articles on AI workflow automation for owner-led companies today.",
};
