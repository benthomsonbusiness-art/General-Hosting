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
  /** Secondary practices: short focus areas. The flagship shows its sub-services instead. */
  areas: { title: string; body: string }[];
  steps?: { title: string; body: string }[];
  workflowIds: string[];
  faqs: Faq[];
  keywords: string[];
};

export type SubService = {
  slug: string;
  name: string;
  question: string;
  answer: string;
  get: string[];
  keywords: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-workflow-automation",
    name: "AI Workflow Automation",
    kind: "flagship",
    summary: "We follow one process from trigger to finished record, then automate the steps that don't need a person.",
    metaTitle: "AI Workflow Automation",
    metaDescription:
      "We map how leads, documents and approvals move through your company, then automate the steps that do not need a person, inside the tools you already use.",
    h1: "Automate the steps that don't need a person",
    dek: "Inside the tools you already use. Your team approves anything that leaves the company.",
    cta: { label: "Request a Workflow Audit", href: "/contact" },
    photo: PHOTOS.fins,
    areas: [],
    workflowIds: ["lead-triage", "proposal-ops", "ap-intake"],
    faqs: [
      {
        q: "Who owns the code?",
        a: "You do. It lives in your repository and runs in your accounts. If we part ways, everything keeps working.",
      },
      {
        q: "What if the AI step is wrong?",
        a: "Its output is checked against a schema and a confidence threshold. Low-confidence items go to a person, and anything a customer would see waits at an approval gate.",
      },
      {
        q: "Which tools do you work with?",
        a: "Common CRMs, accounting systems, help desks and document suites with an API or a reliable export. The tools named on this site are example integrations, not partnerships.",
      },
      {
        q: "How long does an audit take?",
        a: "The Workflow Audit is a fixed scope of one to two weeks.",
      },
      {
        q: "Do you need access to our systems?",
        a: "The audit can start with screen-sharing and exports. Building needs access, and we ask for the narrowest scope, under credentials you can revoke.",
      },
    ],
    keywords: ["automation", "workflow", "AI", "CRM", "approval", "audit"],
  },
  {
    slug: "meta-ads-consulting",
    name: "Meta Ads Consulting",
    kind: "secondary",
    summary: "Tracking you can trust, a testing cadence, and a weekly report that writes itself.",
    metaTitle: "Meta Ads Consulting",
    metaDescription:
      "Account structure, tracking checks, a written testing cadence, budget pacing rules and automated reporting for companies that run Meta advertising in-house.",
    h1: "Meta advertising, run as a system",
    dek: "So spend decisions rest on numbers you trust. Your team keeps running the account.",
    cta: { label: "Request a consultation", href: "/contact?practice=meta-ads" },
    photo: { ...PHOTOS.fins, position: "78% center" },
    areas: [
      { title: "Tracking", body: "Pixel, Conversions API and GA4 compared event by event." },
      { title: "Testing", body: "One hypothesis per test, with the stopping rule written first." },
      { title: "Pacing", body: "Outliers are flagged daily. A person decides what to do." },
      { title: "Reporting", body: "A weekly brief with figures inserted from the data." },
      { title: "Handover", body: "A guide the next buyer can read in an afternoon." },
    ],
    steps: [
      { title: "Read", body: "Read-only access. A written list of what is leaking." },
      { title: "Rebuild", body: "Structure, testing ledger and the report." },
      { title: "Hand off", body: "Your team runs it." },
    ],
    workflowIds: ["meta-ads-reporting"],
    faqs: [
      {
        q: "Do you manage the ads day to day?",
        a: "No. We advise on structure, measurement and testing. Your team or agency keeps operating the account.",
      },
      {
        q: "Will you change our budgets?",
        a: "No. The reporting workflow has read-only access. Budget changes stay with a person at your company.",
      },
      { q: "Who owns the reports and queries?", a: "You do. They run in your accounts." },
    ],
    keywords: ["Meta", "Facebook", "Instagram", "ads", "Pixel", "Conversions API", "GA4", "ROAS"],
  },
  {
    slug: "strategy",
    name: "Strategy",
    kind: "secondary",
    summary: "How decisions get made, which tools to keep, and where automation is worth the effort.",
    metaTitle: "Strategy",
    metaDescription:
      "Operating-model review, decision rights, automation priorities, tool selection and owner-level reporting for founders, COOs and managing principals.",
    h1: "Strategy that ends in a decision someone owns",
    dek: "For founders and COOs who need a clear account of what to change first.",
    cta: { label: "Request a consultation", href: "/contact?practice=strategy" },
    photo: { ...PHOTOS.room, position: "center 18%" },
    areas: [
      { title: "Operating model", body: "Who does what, and where handoffs stall." },
      { title: "Decision rights", body: "Who decides, to what limit, and when it escalates." },
      { title: "Automation priorities", body: "Ranked by hours, risk and dependency." },
      { title: "Tool selection", body: "Requirements first, then a test with your own records." },
      { title: "Owner reporting", body: "The few figures that would change a decision." },
    ],
    steps: [
      { title: "Frame", body: "The problem in writing, short enough to argue with." },
      { title: "Decide", body: "A small set of choices, each with an owner." },
      { title: "Install", body: "The meeting and the report that keep it alive." },
    ],
    workflowIds: [],
    faqs: [
      {
        q: "Is this separate from the automation work?",
        a: "It can be. Some questions need no software. Others lead to a workflow, scoped separately.",
      },
      { q: "What does the output look like?", a: "A short written document and a working session." },
      {
        q: "How do you choose between tools?",
        a: "We write the requirements first and test the short list with your own records. The recommendation names the options we set aside and why.",
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
    answer: "We follow the work and return a ranked roadmap with the arithmetic shown.",
    get: ["Process maps", "Systems inventory", "Ranked roadmap", "Risk notes"],
    keywords: ["audit", "process map", "roadmap", "ROI", "hours"],
  },
  {
    slug: "build-and-deploy",
    name: "Build & Deploy",
    question: "Know what to automate?",
    answer: "We build it in your accounts and run it beside the manual process before it sends anything.",
    get: ["Data contract", "Working workflow", "Shadow report", "Runbook"],
    keywords: ["build", "deploy", "shadow testing", "data contract", "handover"],
  },
  {
    slug: "retained-operations",
    name: "Retained Operations",
    question: "Who notices when it stops?",
    answer: "We watch the runs, fix what breaks and test every model or prompt change.",
    get: ["Monitoring", "Fixes with a cause", "Tested updates", "Monthly note"],
    keywords: ["monitoring", "operations", "maintenance", "retainer", "updates"],
  },
  {
    slug: "ai-agents-and-integrations",
    name: "AI Agents & Integrations",
    question: "Two systems that should talk?",
    answer: "Ordinary code connects them. A model gets one narrow job and a short list of tools.",
    get: ["Integration code", "Agent limits", "Test set", "Call log"],
    keywords: ["agents", "integration", "API", "webhook", "tools"],
  },
  {
    slug: "reporting-and-data-pipelines",
    name: "Reporting & Data Pipelines",
    question: "Rebuilding the same report?",
    answer: "Scheduled pulls, rules you can edit, and a brief that names its own gaps.",
    get: ["Source map", "Scheduled pulls", "Editable rules", "Cited brief"],
    keywords: ["reporting", "data", "pipeline", "dashboard", "brief", "reconciliation"],
  },
];

export const FLAGSHIP = SERVICES[0];

export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

/** Sub-services are sections of the flagship page. */
export function subServiceHref(slug: string): string {
  return `/services/${FLAGSHIP.slug}#${slug}`;
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
