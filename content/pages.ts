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
    "Run eight illustrative workflows and watch one sample item change at each step. Set the threshold, edit the draft and decide at the approval gate yourself.",
  title: "Watch a workflow run and wait for your decision",
  dek: "Eight everyday processes running on sample data until a person needs to step in.",
  note: "Simulation with sample data. Timings are illustrative. Vendor names are example integrations, not partnerships.",
};

export const INSIGHTS_HUB = {
  metaDescription:
    "Guides, articles, checklists and illustrative blueprints on approval gates, deterministic steps, workflow audits and reporting for owner-led companies.",
  dek: "Field notes on building workflows that hold up.",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How Valentini & Co. works: map the process, design the data contract and gates, build and shadow-test, then hand over code, accounts, logs and runbooks.",
  dek: "Map it. Design it. Run it beside the manual process. Hand it over.",
};

export const ABOUT = {
  metaDescription:
    "Valentini & Co. is an advisory firm in Bloomington, Indiana. How we think about deterministic code, human approval and who should own the finished work.",
  dek: "A private advisory firm. We build the automations that should exist between a company's tools.",
  beliefs: [
    {
      title: "Keep the tools you have.",
      body: "Your systems hold the history of the company. We build the part between them.",
    },
    {
      title: "Write the rule down first.",
      body: "Most steps are rules, even when nobody has written them. Rules become code.",
    },
    {
      title: "Put a person behind every send.",
      body: "A message carries your name. Someone should have seen it and chosen to send it.",
    },
    {
      title: "Own all of it.",
      body: "Code, accounts, logs and runbook are yours from the first day.",
    },
  ],
  name: "Valentini is a family name.",
  where: "Bloomington, Indiana. Working with clients remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini & Co. which process is slowing the team down. Request a Workflow Audit, or a consultation on Meta advertising or strategy, by form or email.",
  dek: "Which process is slowing the team down?",
  guidance: "Please do not send passwords, client records or other confidential material.",
  next: ["A person reads your note.", "We reply by email with a few questions.", "We have a first conversation."],
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Valentini & Co. site for services, workflow blueprints, industries, guides and articles on AI workflow automation for owner-led companies today.",
};
