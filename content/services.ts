import type { EngagementId } from "./engagements.ts";
import type { Faq } from "./approach.ts";

export type Photo = { src: string; alt: string; position: string };

export const PHOTOS = {
  hero: {
    src: "/images/hero-architecture.jpg",
    alt: "Green marble and walnut slats beside a window onto a city at twilight.",
    position: "64% center",
  },
  fins: {
    src: "/images/systems-geometry.jpg",
    alt: "Vertical brass and dark stone fins crossed by diagonal sunlight.",
    position: "22% center",
  },
  room: {
    src: "/images/consultation-room.jpg",
    alt: "A consultation room with forest-green paneling, a leather chair and linen curtains.",
    position: "center 30%",
  },
  desk: {
    src: "/images/editorial-workspace.jpg",
    alt: "A wood desk in window light with a closed laptop, an open notebook and a brass pen.",
    position: "center",
  },
} satisfies Record<string, Photo>;

export type Capability = { title: string; problem: string; what: string; get: string[] };

export type Service = {
  slug: string;
  name: string;
  kind: "flagship" | "secondary";
  summary: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  cta: { label: string; href: string };
  photo: Photo;
  introHeading: string;
  intro: string[];
  capabilities: Capability[];
  detail?: { heading: string; lede: string; rows: { title: string; body: string }[] };
  workflowIds: string[];
  faqs: Faq[];
  keywords: string[];
};

export type SubService = {
  slug: string;
  name: string;
  question: string;
  answer: string;
  metaDescription: string;
  dek: string;
  photo: Photo;
  what: string[];
  deliverables: { title: string; body: string }[];
  /** Timeline from content/engagements.ts. */
  engagement: EngagementId;
  runsNote: string;
  weekOne: string[];
  workflowIds: string[];
  keywords: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-workflow-automation",
    name: "AI Workflow Automation",
    kind: "flagship",
    summary:
      "We map how information moves through the company, then build automations inside the tools you already use.",
    metaTitle: "AI Workflow Automation",
    metaDescription:
      "We map how leads, documents and approvals move through your company, then automate the steps that do not need a person, inside the tools you already use.",
    h1: "AI workflow automation for owner-led companies",
    dek: "We follow one process from trigger to finished record, then automate the steps that don't need a person. Your team approves anything that leaves the company.",
    cta: { label: "Request a Workflow Audit", href: "/contact" },
    photo: PHOTOS.fins,
    introHeading: "Where the hours go",
    intro: [
      "In a company of five to two hundred people, the same facts are typed many times. A lead goes from a form to an inbox to the CRM. A proposal is assembled from last month's proposal. A report is rebuilt by hand each Monday because three systems disagree. None of it is difficult. All of it waits on someone.",
      "Chat tools help one person at a time and leave no record. Chains of triggers work until a field is empty, and then nobody knows who should fix them. We build the middle ground: ordinary software for the predictable steps, a model for the few that need judgment, and a person at each point where a mistake would reach a customer.",
    ],
    capabilities: [
      {
        title: "Lead and intake handling",
        problem: "Leads wait for a first reply because the inbox belongs to everyone.",
        what: "We verify and enrich each lead, score it against your written definition of fit, update the CRM and draft a reply for approval.",
        get: ["A scored CRM record for each lead", "A drafted reply with its source", "A queue for the unclear cases"],
      },
      {
        title: "Proposals and contracts",
        problem: "Each proposal starts from an old one, and the price depends on who wrote it.",
        what: "We pull cited requirements from the call, price them from your rate card, and merge them into your template for review.",
        get: ["Requirements with timestamps", "A margin check before review", "A reviewed document ready for signature"],
      },
      {
        title: "Client and customer onboarding",
        problem: "The work starts late because the folder, the form and the kickoff depend on one person.",
        what: "A signed contract starts intake, sets up the workspace from a template and prepares the welcome for approval.",
        get: ["A workspace with correct permissions", "Enforced intake fields", "An approved welcome and kickoff invite"],
      },
      {
        title: "Back-office processing",
        problem: "Invoices and tickets are keyed by hand, and exceptions hide in someone's email.",
        what: "Documents are read into fixed fields, checked arithmetically and matched. Mismatches go to a queue with a reason.",
        get: ["Structured records", "A visible exception queue", "Human approval of every payment batch"],
      },
      {
        title: "Reporting",
        problem: "The numbers arrive late, and nobody is sure which system they came from.",
        what: "Data is pulled on a schedule, checked against thresholds you set, and summarized with a source on every line.",
        get: ["A scheduled brief", "Named gaps when a source fails", "Rules your team can edit"],
      },
    ],
    workflowIds: ["lead-triage", "proposal-ops", "ap-intake"],
    faqs: [
      {
        q: "Who owns the code?",
        a: "You do. It lives in your repository and runs in your accounts. The prompts, logs and runbooks are yours as well. If we part ways, everything keeps working.",
      },
      {
        q: "What if the AI step is wrong?",
        a: "Each AI step returns structured output that is checked against a schema and a confidence threshold. Low-confidence items go to a person. Anything a customer would see also waits at an approval gate, and the runbook covers how to correct a record after the fact.",
      },
      {
        q: "Which tools do you work with?",
        a: "We build inside what you already use: common CRMs, accounting systems, help desks, document suites and messaging tools with an API or a reliable export. The tools named on this site are example integrations, not partnerships.",
      },
      {
        q: "How long does an audit take?",
        a: "The Workflow Audit is a fixed scope of one to two weeks. The range depends on how many processes are included and how quickly we can watch the work being done.",
      },
      {
        q: "Do you need access to our systems?",
        a: "The audit can start with screen-sharing and exports. Building needs access, and we ask for the narrowest scope each step requires, under credentials you can revoke.",
      },
    ],
    keywords: ["automation", "workflow", "AI", "CRM", "approval", "audit"],
  },
  {
    slug: "meta-ads-consulting",
    name: "Meta Ads Consulting",
    kind: "secondary",
    summary:
      "We check the tracking, set a testing cadence and automate the weekly report, so spend decisions rest on numbers you trust.",
    metaTitle: "Meta Ads Consulting",
    metaDescription:
      "Account structure, tracking checks, a written testing cadence, budget pacing rules and automated reporting for companies that run Meta advertising in-house.",
    h1: "Meta advertising, run as a system",
    dek: "We check your Meta tracking, set a testing cadence and automate the weekly report, so spend decisions rest on numbers you trust.",
    cta: { label: "Request a consultation", href: "/contact?practice=meta-ads" },
    photo: { ...PHOTOS.fins, position: "78% center" },
    introHeading: "What this practice addresses",
    intro: [
      "Many ad accounts grow one campaign at a time. Names stop meaning anything, the same conversion is counted twice, and creative changes happen when someone has an idea. The account still spends. It is hard to say why a week went well or badly.",
      "We work on the parts that make the account readable: structure, signal, testing and reporting. Your team or your media buyer keeps running it. We do not need control of the budget, and the reporting workflow we build has read-only access.",
    ],
    capabilities: [
      {
        title: "Structure and tracking audit",
        problem: "The platform, the site analytics and the order system report three different totals.",
        what: "We compare the Pixel, the Conversions API and GA4 event by event, find duplicates and gaps, and write down which source answers which question.",
        get: ["An event inventory", "A duplicate and gap list", "A naming scheme a new buyer can follow"],
      },
      {
        title: "Creative testing cadence",
        problem: "Ads change when someone has an idea, and nobody records what was learned.",
        what: "We set up a testing ledger: one hypothesis per test, a stopping rule written in advance, and a rule for what continues.",
        get: ["A testing ledger", "Written stopping rules", "A review slot on the calendar"],
      },
      {
        title: "Budget pacing and anomaly checks",
        problem: "An overspend is noticed at the end of the month.",
        what: "Rules compare each day with a rolling baseline and flag the outliers. A person decides what to do about them.",
        get: ["Pacing rules with named owners", "Flags linked to source rows", "No automatic budget changes"],
      },
      {
        title: "Reporting automation",
        problem: "Someone spends Monday morning copying figures into a slide.",
        what: "A read-only pull feeds a weekly brief. Figures are inserted from the data, and the text only explains them.",
        get: ["A weekly brief in Slack or email", "A statement of any missing day", "Queries your team can edit"],
      },
      {
        title: "Handover documentation",
        problem: "The logic of the account lives in one person's head.",
        what: "We write down the structure, the rules and the reasons, so the next buyer can audit the account in an afternoon.",
        get: ["An account guide", "The change log", "A list of open questions"],
      },
    ],
    detail: {
      heading: "How a consultation runs",
      lede: "The work is scoped after a first read of the account. It has three parts, and you can stop after any of them.",
      rows: [
        {
          title: "Read",
          body: "We review the account structure, the events and recent creative with read-only access. You get a written list of what is leaking and what is fine as it is.",
        },
        {
          title: "Rebuild",
          body: "We set the structure, the testing ledger and the queries behind the weekly brief. Each change ships with a written reason.",
        },
        {
          title: "Hand off",
          body: "Your team runs the cadence. A periodic review is available as a separate decision, made after the system is yours.",
        },
      ],
    },
    workflowIds: ["meta-ads-reporting"],
    faqs: [
      {
        q: "Do you manage the ads day to day?",
        a: "No. We advise on structure, measurement and testing. Your team or your agency keeps operating the account.",
      },
      {
        q: "Will you change our budgets?",
        a: "No. The reporting workflow has read-only access and flags what it sees. Budget changes stay with a person at your company.",
      },
      {
        q: "Can you work alongside our agency?",
        a: "Yes. A clear event inventory and a testing ledger tend to make that conversation easier for both sides.",
      },
      {
        q: "Who owns the reports and queries?",
        a: "You do. They run in your accounts, and the handover guide explains how to change them.",
      },
    ],
    keywords: ["Meta", "Facebook", "Instagram", "ads", "Pixel", "Conversions API", "GA4", "ROAS"],
  },
  {
    slug: "strategy",
    name: "Strategy",
    kind: "secondary",
    summary:
      "We help owners decide what to change first: how decisions get made, which tools to keep, and where automation is worth the effort.",
    metaTitle: "Strategy",
    metaDescription:
      "Operating-model review, decision rights, automation priorities, tool selection and owner-level reporting for founders, COOs and managing principals.",
    h1: "Strategy that ends in a decision someone owns",
    dek: "For founders, COOs and managing principals who need a clear account of how the company decides, what it runs on and what to change first.",
    cta: { label: "Request a consultation", href: "/contact?practice=strategy" },
    photo: { ...PHOTOS.room, position: "center 18%" },
    introHeading: "What this practice addresses",
    intro: [
      "Growing companies often run on arrangements nobody chose. Approvals go to the owner because they always have. Two tools do the same job because two people bought them. The monthly numbers are complete and still do not settle the question on the table.",
      "We write the problem down in a form that can be decided. The output is short: the choices, what each one requires, who owns it, and which report will show whether it is working. When the answer is a workflow, we can build it. When the answer is to leave something alone, we say so.",
    ],
    capabilities: [
      {
        title: "Operating-model review",
        problem: "Work crosses four people before it is finished, and each one adds a wait.",
        what: "We chart who does what, where handoffs stall and which roles have outgrown their description.",
        get: ["A one-page operating map", "A list of stalled handoffs", "Recommended role changes"],
      },
      {
        title: "Decision rights and approval paths",
        problem: "Everything needs the owner, including the things that should not.",
        what: "We list the recurring decisions, set who makes each one and to what limit, and define when it should escalate.",
        get: ["A decision-rights table", "Approval limits", "Escalation rules"],
      },
      {
        title: "Automation priorities",
        problem: "There are thirty ideas for automation and no order to them.",
        what: "We rank candidates by hours, risk and dependency, and mark the ones that should stay manual.",
        get: ["A ranked list", "Reasons for each position", "A first candidate to scope"],
      },
      {
        title: "Vendor and tool selection",
        problem: "Tools are bought on a demo and judged on a renewal notice.",
        what: "We write the requirements first, test the short list against real records and record why the choice was made.",
        get: ["A requirements sheet", "A test with your own data", "A written recommendation"],
      },
      {
        title: "Owner and board reporting",
        problem: "The report is long, and the meeting still ends with a question.",
        what: "We start from the decisions the report should support and keep the few figures that would change one.",
        get: ["A report outline", "Definitions for each figure", "A source for every number"],
      },
    ],
    detail: {
      heading: "How decisions get structured",
      lede: "Each question goes through the same three steps. The aim is a decision with an owner, a date and a way to check it.",
      rows: [
        {
          title: "Frame",
          body: "We interview the people who decide and read the numbers already in the ledger. The output is the problem in writing, short enough to argue with.",
        },
        {
          title: "Decide",
          body: "You get a small set of choices: what continues, what stops, what each one costs in attention, and what would have to be true for it to work. Each choice names an owner.",
        },
        {
          title: "Install",
          body: "We set the meeting, the report and the threshold that keep the decision alive. If the next constraint is a system, that work is scoped on its own.",
        },
      ],
    },
    workflowIds: [],
    faqs: [
      {
        q: "Is this separate from the automation work?",
        a: "It can be. Some questions are about roles or decisions and need no software. Others lead to a workflow, and that is scoped separately.",
      },
      {
        q: "What does the output look like?",
        a: "A short written document and a working session. We avoid long slide decks because they are hard to act on afterward.",
      },
      {
        q: "Who should be involved?",
        a: "The people who own the decision, plus the people who live with it each day. The second group usually knows where the problem is.",
      },
      {
        q: "How do you choose between tools?",
        a: "We write the requirements first and test the short list with your own records. The recommendation names the options we set aside and the reason for each, so you can check the reasoning.",
      },
    ],
    keywords: ["strategy", "operating model", "decision rights", "tool selection", "reporting"],
  },
];

export const SUB_SERVICES: SubService[] = [
  {
    slug: "workflow-audit",
    name: "Workflow Audit",
    question: "Not sure where the hours go?",
    answer:
      "We follow the work through your systems and return a ranked roadmap with the arithmetic shown.",
    metaDescription:
      "A fixed-scope audit that maps your processes, systems and handoffs, then returns a ranked automation roadmap with the hours arithmetic and assumptions shown.",
    dek: "One to two weeks to map the work as it is done today, and a ranked list of what to automate, what to fix and what to leave alone.",
    photo: PHOTOS.desk,
    what: [
      "The audit is where every engagement starts. We watch real items move through the process with the people who handle them, and we write down what happens, including the parts that are not in any manual. Where does the data enter? Who retypes it? Which step waits for an answer, and what happens on the day that person is out?",
      "The result is a set of maps and a roadmap you can use with or without us. Each candidate on the roadmap shows its hours, its loaded rate and the assumptions behind both, so you can change a number and see what moves. We also list what should not be automated, with the reason.",
    ],
    deliverables: [
      { title: "Process maps", body: "Each process from trigger to finished record, with waits, retyping and exception paths marked." },
      { title: "Systems inventory", body: "Every tool involved, the fields it owns, who administers it and how it can be connected." },
      { title: "Prioritized roadmap", body: "Candidates ranked by hours, risk and dependency, with a first one ready to scope." },
      { title: "Hours and assumptions sheet", body: "The arithmetic in a spreadsheet: hours, loaded rate and capture range, each editable." },
      { title: "Risk notes", body: "Where a mistake would reach a customer, move money or touch regulated data, and the gate each needs." },
    ],
    engagement: "workflow-audit",
    runsNote: "Fixed scope. The length depends on how many processes are in scope and how soon we can watch them.",
    weekOne: [
      "Which process would you least like to explain to a new hire?",
      "Where does the same value get typed more than once?",
      "What happens when a required field is empty?",
      "Who can approve a refund, a discount or a payment, and how do they do it today?",
      "Which spreadsheet would stop the company if it were lost?",
      "Who holds the administrator login for each system?",
    ],
    workflowIds: ["lead-triage", "daily-brief"],
    keywords: ["audit", "process map", "roadmap", "ROI", "hours"],
  },
  {
    slug: "build-and-deploy",
    name: "Build & Deploy",
    question: "You know what to automate, but nobody has time to build it properly?",
    answer:
      "We build it in your accounts, run it beside the manual process, and cut over when the differences are explained.",
    metaDescription:
      "Fixed-scope builds with data contracts, approval gates and shadow testing beside the manual process, then documentation and handover to your own team.",
    dek: "Two to six weeks to build the chosen workflow in your accounts, test it beside the manual process and hand it over.",
    photo: PHOTOS.fins,
    what: [
      "A build starts with a written data contract: the fields, their types, the step that owns each one and what happens when a value is missing. You approve that document before any workflow code exists. It becomes the test plan, and later the first page of the runbook.",
      "Then we build in your repository and run the workflow in shadow. It reads the same inputs as your team and produces the same outputs, but it sends nothing. We compare the two, item by item. Cut-over happens when the remaining differences are understood and you are satisfied with them.",
    ],
    deliverables: [
      { title: "Data contract", body: "Fields, types, sources, owners and failure cases, approved by you before the build." },
      { title: "Working workflow", body: "Code in your repository, running in your accounts, with the approval gates agreed in the contract." },
      { title: "Shadow report", body: "Each difference between the workflow and the manual process, with its cause and resolution." },
      { title: "Monitoring and audit log", body: "Alerts for failures and stuck items, and a log your team can query." },
      { title: "Runbook and handover session", body: "How to pause it, fix it, change it and run the process by hand." },
    ],
    engagement: "build-and-deploy",
    runsNote: "Fixed scope, set after the audit. The range reflects how many systems are connected and how long the shadow period needs to be.",
    weekOne: [
      "Which system is the source of truth for each field?",
      "Who approves at each gate, and who covers for them?",
      "What is the worst message this workflow could send by mistake?",
      "Which past items should we use as test cases, including the awkward ones?",
      "How will the team run this by hand if it is paused?",
      "Who will be able to change a threshold after we leave?",
    ],
    workflowIds: ["proposal-ops", "client-onboarding"],
    keywords: ["build", "deploy", "shadow testing", "data contract", "handover"],
  },
  {
    slug: "retained-operations",
    name: "Retained Operations",
    question: "Who notices when an automation stops?",
    answer:
      "We watch the runs, fix what breaks, test model and prompt changes, and add workflows as you need them.",
    metaDescription:
      "Monthly monitoring, fixes, tested model and prompt updates, and new workflows for automations running in your own accounts, with a clear written record.",
    dek: "A monthly arrangement for companies that would like someone to watch the workflows, fix them and change them with care.",
    photo: { ...PHOTOS.hero, position: "78% center" },
    what: [
      "Workflows age. A supplier changes an invoice layout, a CRM renames a field, a model version is retired. The failure is usually quiet: items stop arriving, or they arrive a little wrong. Retained Operations means someone is looking, with limits agreed in advance for what counts as a problem.",
      "Changes are made the same way they were built. Each prompt or model update runs against saved examples first. Each fix is logged with its cause. You receive a short note every month covering what ran, what stopped, what your team overrode at the gates and what that suggests. You can end the arrangement and keep everything.",
    ],
    deliverables: [
      { title: "Run monitoring", body: "Failures, queue age, expiry counts and unusual volume, checked against limits you agree." },
      { title: "Fixes with a cause", body: "Every incident recorded with what happened, why, and what changed." },
      { title: "Tested updates", body: "Model and prompt changes run against saved examples before they reach live items." },
      { title: "Monthly note", body: "A page or two in plain language, with the override reasons grouped." },
      { title: "New workflows", body: "Taken from the roadmap and scoped one at a time, with the same gates and tests." },
    ],
    engagement: "retained-operations",
    runsNote: "Monthly, scoped after the audit. It covers workflows we built, and existing ones once they have been inventoried.",
    weekOne: [
      "Which failure would you want to hear about within the hour?",
      "Which ones can wait for the morning?",
      "Who on your team should receive each alert?",
      "How often are drafts edited at each gate, and why?",
      "Which connected systems are due for an upgrade or a contract change?",
      "What would make you pause a workflow without asking us?",
    ],
    workflowIds: ["daily-brief", "support-routing"],
    keywords: ["monitoring", "operations", "maintenance", "retainer", "updates"],
  },
  {
    slug: "ai-agents-and-integrations",
    name: "AI Agents & Integrations",
    question: "Two systems that should talk, and a judgment call in between?",
    answer:
      "We connect the systems with ordinary code and give the model one narrow job with a schema, a threshold and a limit on its tools.",
    metaDescription:
      "System integrations and narrowly scoped AI agents with fixed tool lists, schema-checked output, spending limits and human approval before any send.",
    dek: "Integrations between the systems you run, and agents with a fixed list of tools, a narrow job and a person at the exit.",
    photo: { ...PHOTOS.fins, position: "50% center" },
    what: [
      "Most integration work needs no model at all. A field moves from one system to another, with a rule for conflicts and a retry that does not create duplicates. We write that part as ordinary code with tests, because it should behave the same way every time.",
      "An agent is useful when the next step depends on reading something. We keep the job small: a short list of permitted tools, a schema for every answer, a ceiling on the number of steps and the spend, and a log of each call it makes. It can look things up and prepare a draft. It cannot send, pay, delete or change permissions without a person.",
    ],
    deliverables: [
      { title: "Integration code", body: "Webhooks, scheduled syncs and API connections with idempotency keys and retries." },
      { title: "Agent definition", body: "The job, the tool list, the output schema, the step ceiling and the spending limit, in one file." },
      { title: "Test set", body: "Saved examples, including hostile and incomplete inputs, run before each change." },
      { title: "Call log", body: "Every tool call with its input, result and cost, stored in your account." },
      { title: "Access register", body: "Each credential, its scope, its owner and how to revoke it." },
    ],
    engagement: "build-and-deploy",
    runsNote: "Delivered as a Build & Deploy engagement. Scope follows the audit or a short technical review of the systems involved.",
    weekOne: [
      "Which system wins when two records disagree?",
      "What is the smallest set of tools this agent could work with?",
      "Which actions should never be available to it?",
      "What could arrive in the input that should be treated as data and not as an instruction?",
      "What is the limit on steps and spend for one run?",
      "Who reads the call log when something looks wrong?",
    ],
    workflowIds: ["support-routing", "recruiting-screen"],
    keywords: ["agents", "integration", "API", "webhook", "tools"],
  },
  {
    slug: "reporting-and-data-pipelines",
    name: "Reporting & Data Pipelines",
    question: "Rebuilding the same report every week?",
    answer:
      "We pull the data on a schedule, check it against your rules and deliver a brief that cites its rows and names its gaps.",
    metaDescription:
      "Scheduled data pulls, reconciliation rules and cited summaries that name a missing source openly, built with queries and thresholds your team can edit.",
    dek: "Scheduled pulls from the systems you run, rules your team can edit, and a brief that says where each figure came from.",
    photo: { ...PHOTOS.desk, position: "30% center" },
    what: [
      "A report is a promise about where the numbers came from. When it is assembled by hand, that promise depends on one person's memory. We replace the assembly with a pipeline: a scheduled pull from each source, a set of reconciliation rules, and a store your team can query.",
      "Summaries come last. The arithmetic is done in code, and a model may describe the result in plain sentences, each tied to its source rows. If a source fails to load, the brief says so in its first line. A missing figure is shown as missing. It is never filled in.",
    ],
    deliverables: [
      { title: "Source map", body: "Each figure, the system it comes from, its definition and the person who owns it." },
      { title: "Scheduled pulls", body: "Read-only connections with retries and a visible status for each source." },
      { title: "Reconciliation rules", body: "Checks between systems, with thresholds in a file your team can edit." },
      { title: "Cited brief", body: "Delivered to Slack or email, with a source on each line and gaps stated first." },
      { title: "Query access", body: "The underlying tables in your account, so a question can be answered without us." },
    ],
    engagement: "build-and-deploy",
    runsNote: "Delivered as a Build & Deploy engagement. A first brief usually covers two or three sources, and others are added once it is trusted.",
    weekOne: [
      "Which decision should this report change?",
      "When two systems disagree, which one is right, and who says so?",
      "Which figure do people ask about after every meeting?",
      "How old can a number be before it is misleading?",
      "Who sets the thresholds, and how often do they change?",
      "Who should not receive this report?",
    ],
    workflowIds: ["daily-brief", "meta-ads-reporting"],
    keywords: ["reporting", "data", "pipeline", "dashboard", "brief", "reconciliation"],
  },
];

export const FLAGSHIP = SERVICES[0];

export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

export function subServiceHref(slug: string): string {
  return `/services/${FLAGSHIP.slug}/${slug}`;
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getSubService(slug: string): SubService | undefined {
  return SUB_SERVICES.find((service) => service.slug === slug);
}
