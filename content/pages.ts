/** Copy for the one-off pages. Short on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Valentini Systems automates back-office work for owner-led companies, inside the tools you already use. Nothing leaves your company until a person approves it.",
  problems: [
    { q: "Inbound leads sitting a full day before anyone sends a first reply", workflowId: "lead-triage" },
    { q: "Supplier invoices keyed line by line and matched to purchase orders by eye", workflowId: "ap-intake" },
    { q: "Managers pulling the same Monday numbers out of three separate tools", workflowId: "daily-brief" },
  ],
  how: {
    steps: [
      { title: "Rules", body: "Lookups, routing and invoice math. Same result every time." },
      { title: "AI", body: "Reads messy emails and notes and drafts a reply. Drafts that fail a check are thrown out." },
      { title: "Human in the loop", body: "You see the draft next to the original. Nothing goes out until you click approve." },
      { title: "Record", body: "Logs who approved it, what they changed and exactly what was sent." },
    ],
    own: "It runs in your accounts, from code in your repository. Every login, log and line of code belongs to you.",
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
    "Eight example workflows for leads, proposals, onboarding, invoices, support, hiring and reporting. Each one shows every step and where a person approves.",
  title: "Example workflows",
  dek: "Pick one to see each step, the apps it connects, and where a person approves.",
  listHeading: "All eight workflows",
  open: "Open this workflow",
  /** Exit text drawn above a card. A rule or AI step with its own stopLabel uses that instead. */
  stubs: {
    ai: "Unsure: goes to a person, nothing sent",
    human: "Rejected or expired: nothing sent",
  },
  internalOnly: "Internal only, so no approval step.",
  fits: "Fits:",
  service: "Service:",
  decides: {
    heading: "Human in the loop",
    expires: "Expires after",
    closing: "Rejected, expired or unsure items send nothing.",
  },
  steps: {
    heading: "Step by step",
    check: "Check:",
    alternatives: "Also works with:",
    uses: "Uses:",
  },
  /** One sentence per exit the workflow has, then its ownership line. */
  exits: {
    manual: "If the AI is unsure, the item goes to a person instead.",
    rejected: "If you reject it, nothing is sent.",
    expired: "If nobody approves in time, nothing is sent and the item goes back to the queue.",
  },
  closing: "Want this in your company?",
  previous: "Previous workflow",
  next: "Next workflow",
  all: "All workflows",
};

export const INSIGHTS_HUB = {
  metaDescription:
    "Short guides for owner-led companies on what to automate, where a person should approve, what a workflow audit covers and how a daily brief is built.",
  dek: "Short guides on what to automate, where a person should approve, and what an audit covers.",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How Valentini Systems runs a project: map the process, write down the rules and approvals, test beside your team, then hand over the code, accounts and manuals.",
  dek: "We follow real work through your tools, write down every rule, test the automation beside your team before it sends anything, and hand you the code.",
};

export const ABOUT = {
  metaDescription:
    "Valentini Systems is a Morristown, New Jersey firm that automates back-office work for owner-led companies. You approve what goes out and you own the code.",
  dek: "We automate back-office work inside the software your company already runs.",
  founder:
    "Routine work is written as plain rules. AI is used only where a step needs reading or drafting. Nothing leaves your company until a person on your team approves it.",
  where: "Based in Morristown, New Jersey, working with owner-led companies in person and remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini Systems which process slows your week down. Request a workflow audit, or ask about Meta ads or strategy, using the short form on this page.",
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
    "Search the Valentini Systems site for services, example workflows, industries and guides about automating back-office work at owner-led companies.",
};

export const TESTIMONIALS_PAGE = {
  metaDescription:
    "What owner-led companies say after Valentini Systems automated their back-office work: faster replies, fewer hours keyed by hand, and every send approved.",
  dek: "What clients say once the work runs on its own and they still approve every send.",
  empty:
    "Client stories will appear here as our first engagements wrap up. In the meantime, request an audit and see the work for yourself.",
};

export const HOW_IT_WORKS = {
  metaDescription:
    "What Valentini Systems offers and how a project runs: workflow automation, Meta ads and strategy, delivered in four steps from mapping to handing you the code.",
  statement: "Three services. Four steps. You approve every one.",
};
