/** Copy for the one-off pages: home, about, contact, hubs. */

export const HOME = {
  metaDescription:
    "Valentini & Co. maps how information moves through owner-led companies, then builds AI workflow automation inside the tools they already use, with approvals.",
  dek: "We map how information moves through your business, then build automations inside the tools you already use. Deterministic where it can be, AI where judgment is needed, and a person approves anything that leaves the company.",
  problems: [
    {
      area: "Lead response",
      q: "Leads waiting a day for a first reply?",
      a: "We route, score and draft the reply. Your team approves it.",
      workflowId: "lead-triage",
    },
    {
      area: "Proposals and contracts",
      q: "Proposals take a week to assemble?",
      a: "We turn the call into cited requirements, check the margin and draft the document for review.",
      workflowId: "proposal-ops",
    },
    {
      area: "Onboarding",
      q: "New clients waiting on folders, forms and a kickoff date?",
      a: "A signed contract starts the setup, and the account lead approves the welcome.",
      workflowId: "client-onboarding",
    },
    {
      area: "Reporting",
      q: "Rebuilding the same report every Monday?",
      a: "We pull the data on a schedule and cite the source of every line. If a source fails, the brief says so.",
      workflowId: "daily-brief",
    },
    {
      area: "Accounts payable",
      q: "Invoices keyed by hand and matched by eye?",
      a: "We read, check and match them. Exceptions and payment batches go to a person.",
      workflowId: "ap-intake",
    },
    {
      area: "Support routing",
      q: "Agents reading every ticket to decide who should answer it?",
      a: "Tickets are labeled from your own list, and a reply is drafted only when your articles support one.",
      workflowId: "support-routing",
    },
  ],
  mechanicsHeading: "How a build is put together",
  mechanicsLede:
    "Four parts appear in every workflow we build. They are what make it safe to leave running, and simple to take over.",
};

export const CTA = {
  headline: ["Tell us where the hours go.", "We'll map it before anything is built."],
  body: "Describe one process that is slowing the team down. We reply by email to set up a first conversation.",
};

export const SERVICES_HUB = {
  metaDescription:
    "AI workflow automation is the main practice: audits, builds and ongoing operations. Meta Ads Consulting and Strategy support it for owner-led companies.",
  dek: "Most of our work is AI workflow automation for owner-led companies. We also advise on Meta advertising and on strategy where it connects to how the business runs.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Where workflow automation applies across professional services, wellness, real estate, retail, home services and accounting firms, and what stays with people.",
  dek: "Where these workflows apply. The patterns are the same; the systems and the approvals differ.",
  other:
    "The method does not depend on the industry. If work arrives, gets retyped, waits for an answer and ends as a record somewhere, it can be mapped. Tell us what the process is and which systems it touches.",
};

export const WORKFLOWS_PAGE = {
  metaDescription:
    "Run eight illustrative workflow blueprints step by step. Open any node to see its guardrail, its failure path and the approval gate that waits for a person.",
  dek: "Illustrative blueprints of patterns we build inside the tools a company already uses. Sample data. Run one. Open any step.",
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
  dek: "Every build follows the same order: map it, design the data contract, build it, run it beside the manual process, then hand it over.",
};

export const ABOUT = {
  metaDescription:
    "Valentini & Co. is an advisory firm in Bloomington, Indiana. How we think about deterministic code, human approval and who should own the finished work.",
  dek: "Valentini & Co. is a private advisory firm. We map how a business moves information, and we build the automations that should exist between its tools.",
  sections: [
    {
      id: "tools",
      title: "Why inside the tools you already use",
      paragraphs: [
        "Your CRM, your accounting system and your inbox hold the history of the company. Replacing them to gain an automation is a poor trade. People would have to learn a new system before they saw any benefit, and the old one would linger for years. We leave the systems of record where they are and build the part between them.",
        "It also keeps the test simple. If the workflow is working, the right record appears in the place your team already looks.",
      ],
    },
    {
      id: "deterministic",
      title: "Why deterministic first",
      paragraphs: [
        "A rule gives the same answer every time and can be explained to anyone. Most steps in a business process are rules, even when nobody has written them down. We write them down and turn them into code. A model gets the steps that involve reading or drafting, and its output is checked before anything depends on it.",
      ],
    },
    {
      id: "approval",
      title: "Why a person approves",
      paragraphs: [
        "A message to a customer carries the company's name. So does a payment, an offer or a refusal. Those should have a person behind them who saw what was going out and chose to send it. The gate is also how a team learns whether to trust the draft, because every edit is recorded.",
      ],
    },
    {
      id: "ownership",
      title: "Why you own it",
      paragraphs: [
        "Software that only its builder understands is a liability. The code lives in your repository. The automations run in your accounts. The runbook is written for your people. If we part ways, everything keeps working, and the next person can read how it was made.",
      ],
    },
  ],
  name: "Valentini is a family name.",
  where: "Bloomington, Indiana. Working with clients remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini & Co. which process is slowing the team down. Request a Workflow Audit, or a consultation on Meta advertising or strategy, by form or email.",
  dek: "Tell us which process is slowing the team down. We'll reply by email to set up a first conversation.",
  guidance:
    "A useful note names the process, the systems it touches, how often it happens and what goes wrong. Please do not send passwords, client records or other confidential material through this form.",
  next: [
    {
      title: "We read your note",
      body: "A person reads it and looks at whether the process is a good fit for an audit.",
    },
    {
      title: "We reply by email",
      body: "You get a few questions about the systems involved, or a plain no if we are not the right firm for it.",
    },
    {
      title: "We have a first conversation",
      body: "We talk through the process. If an audit makes sense, you receive a fixed-scope proposal.",
    },
  ],
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Valentini & Co. site for services, workflow blueprints, industries, guides and articles on AI workflow automation for owner-led companies today.",
};
