/** Copy for the one-off pages. Short on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Valentini & Co. automates back-office work for owner-led companies, inside the tools you already use. Nothing leaves your company until a person approves it.",
  problems: [
    { q: "Inbound leads sitting a full day before anyone sends a first reply", workflowId: "lead-triage" },
    { q: "Supplier invoices keyed line by line and matched to purchase orders by eye", workflowId: "ap-intake" },
    { q: "Managers pulling the same Monday numbers out of three separate tools", workflowId: "daily-brief" },
  ],
  how: {
    steps: [
      { title: "Code", body: "Lookups, routing rules, and invoice math. Runs the same way on every item." },
      { title: "Model", body: "Reads messy notes and drafts a response. Output that fails its schema is dropped." },
      { title: "Person", body: "Inspects the draft beside its source. Nothing goes out until someone clicks approve." },
      { title: "Record", body: "Logs who reviewed the item, what changed in the draft, and the exact text sent." },
    ],
    own: "It runs in your accounts, from code in your repository. If we stop working together, it keeps running.",
  },
};

export const CTA = {
  headline: "Tell us which process slows your week down.",
};

export const SERVICES_HUB = {
  metaDescription:
    "AI workflow automation is the main practice: audits, builds and ongoing operations. Meta Ads Consulting and Strategy support it for owner-led companies.",
  dek: "Workflow automation is the main work. Meta ads and strategy support it.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Where workflow automation applies across professional services, wellness, real estate, retail, home services and accounting firms, and what stays with people.",
  dek: "Pick your industry to see where the hours go and what stays with your team.",
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
    "Short guides for owner-led companies on what to automate, where a person should approve, what a workflow audit covers and how a daily brief is built.",
  dek: "Short guides on what to automate, where a person should approve, and what an audit covers.",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How Valentini & Co. runs a project: map the process, write down the rules and approvals, test beside your team, then hand over the code, accounts and manuals.",
  dek: "We follow real work through your tools, write down every rule, test the automation beside your team before it sends anything, and hand you the code.",
};

export const ABOUT = {
  metaDescription:
    "Valentini & Co. is an advisory firm in Bloomington, Indiana that automates back-office work for owner-led companies. You approve what goes out and own the code.",
  dek: "We automate back-office work inside the software your company already runs.",
  founder:
    "Routine work is written as plain rules. AI is used only where a step needs reading or drafting. Nothing leaves your company until a person on your team approves it.",
  where: "Based in Bloomington, Indiana, working remotely with owner-led companies.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini & Co. which process slows your week down. Request a workflow audit, or ask about Meta ads or strategy, using the short form on this page.",
  dek: "A few sentences is enough. Say what the process is, who touches it, and where it stalls.",
  guidance: "Please do not send passwords, client records or other confidential material.",
  next: [
    "Ben reads every note.",
    "If it is a fit, the first call walks through the process on screen.",
  ],
  /** Shown above the form until NEXT_PUBLIC_INQUIRY_LIVE is "1". */
  offline: "Sending is not set up yet. Nothing you type here is sent.",
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Valentini & Co. site for services, example workflows, industries and guides about automating back-office work at owner-led companies.",
};
