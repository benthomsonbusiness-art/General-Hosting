import type { Faq } from "./approach.ts";

export type Photo = { src: string; alt: string; position: string };

export const PHOTOS = {
  invoices: {
    src: "/images/station-record.jpg",
    alt: "A stack of thin forest-green and near-black aluminum plates, one plate offset.",
    position: "center",
  },
  ads: {
    src: "/images/station-model.jpg",
    alt: "A dark green rotary dial with engraved tick marks and a knurled edge.",
    position: "center",
  },
  brief: {
    src: "/images/ins-daily-brief.jpg",
    alt: "Three blank analog gauges on a dark green panel, with morning light across them.",
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
    dek: "Built inside the tools your team already uses, pausing wherever someone needs to approve what goes out.",
    cta: { label: "Request a workflow audit", href: "/contact" },
    photo: PHOTOS.invoices,
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
    dek: "Clean conversion tracking and automated weekly reporting so spend decisions rest on numbers your team trusts.",
    cta: { label: "Request a consultation", href: "/contact?practice=meta-ads" },
    photo: PHOTOS.ads,
    areas: [
      { title: "Tracking", body: "Pixel, Conversions API and GA4 compared event by event." },
      { title: "Testing", body: "One hypothesis per test, with the stopping rule written first." },
      { title: "Pacing", body: "Outliers are flagged daily. A person decides what to do." },
      { title: "Reporting", body: "A weekly brief with figures inserted from the data." },
      { title: "Handover", body: "A guide the next buyer can read in an afternoon." },
    ],
    steps: [
      { title: "Audit the tracking", body: "We inspect Pixel, Conversions API, and GA4 under read-only access to list every gap." },
      { title: "Rebuild the cadence", body: "We set the campaign structure, written testing log, and weekly automated brief." },
      { title: "Hand it to your buyer", body: "Your in-house team or agency runs daily spend inside clear pacing limits." },
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
    dek: "Clear operating-model priorities for founders and COOs deciding what to fix before buying new software.",
    cta: { label: "Request a consultation", href: "/contact?practice=strategy" },
    photo: PHOTOS.brief,
    areas: [
      { title: "Operating model", body: "Who does what, and where handoffs stall." },
      { title: "Decision rights", body: "Who decides, to what limit, and when it escalates." },
      { title: "Automation priorities", body: "Ranked by hours, risk and dependency." },
      { title: "Tool selection", body: "Requirements first, then a test with your own records." },
      { title: "Owner reporting", body: "The few figures that would change a decision." },
    ],
    steps: [
      { title: "Frame the constraint", body: "Put the operational bottleneck in writing, short enough for the leadership team to test." },
      { title: "Assign the decisions", body: "Set a small list of priorities and limits, each tied to one named owner." },
      { title: "Install the cadence", body: "Establish the weekly meeting and exception report that keep the plan alive." },
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
