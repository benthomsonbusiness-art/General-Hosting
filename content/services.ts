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
    name: "AI workflow automation",
    kind: "flagship",
    summary: "We follow one process from first email to finished record, then automate the steps that don't need a person.",
    metaTitle: "AI workflow automation",
    metaDescription:
      "We map how leads, documents and approvals move through your company, then automate the steps that do not need a person, inside the tools you already use.",
    h1: "Automate the steps that don't need a person",
    dek: "Built inside the tools your team already uses. It waits for your approval before anything goes out.",
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
        q: "What if the AI gets it wrong?",
        a: "Its answer is checked by rules first. If it is unsure, the item goes to a person, and anything a customer would see waits for your approval.",
      },
      {
        q: "Which tools do you work with?",
        a: "Common CRMs, accounting systems, help desks and document suites with an API or a reliable export. The tools named on this site are example integrations, not partnerships.",
      },
      {
        q: "How long does an audit take?",
        a: "One to two weeks, fixed scope.",
      },
      {
        q: "Do you need access to our systems?",
        a: "The audit can start with screen-sharing and exports. Building needs access, and we ask for the least access the work needs, under logins you can revoke.",
      },
    ],
    keywords: ["automation", "workflow", "AI", "CRM", "approval", "audit"],
  },
  {
    slug: "meta-ads-consulting",
    name: "Meta ads consulting",
    kind: "secondary",
    summary: "Tracking you can check, a written testing plan, and a weekly report built from your ad data.",
    metaTitle: "Meta ads consulting",
    metaDescription:
      "Account structure, tracking checks, a written testing cadence, budget pacing rules and automated reporting for companies that run Meta advertising in-house.",
    h1: "Meta ads with tracking you can check",
    dek: "We fix your conversion tracking and set up a weekly report, so spend decisions rest on numbers your team trusts.",
    cta: { label: "Request a consultation", href: "/contact?practice=meta-ads" },
    photo: PHOTOS.ads,
    areas: [
      { title: "Tracking", body: "Pixel, Conversions API and GA4 compared event by event." },
      { title: "Testing", body: "One hypothesis per test, with the stopping rule written first." },
      { title: "Pacing", body: "Outliers are flagged daily. A person decides what to do." },
      { title: "Reporting", body: "A weekly brief with figures inserted from the data." },
      { title: "Handover", body: "A guide your next ad manager can read in an afternoon." },
    ],
    steps: [
      { title: "Audit the tracking", body: "We inspect Pixel, Conversions API, and GA4 under read-only access to list every gap." },
      { title: "Set the testing plan", body: "We set the campaign structure, a written test log and the weekly report." },
      { title: "Hand it to your team", body: "Your team or agency runs daily spend inside written limits." },
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
    dek: "For owners deciding what to fix before buying new software.",
    cta: { label: "Request a consultation", href: "/contact?practice=strategy" },
    photo: PHOTOS.brief,
    areas: [
      { title: "Who does what", body: "Who does what, and where handoffs stall." },
      { title: "Decision rights", body: "Who decides, to what limit, and when it escalates." },
      { title: "Automation priorities", body: "Ranked by hours, risk and dependency." },
      { title: "Tool selection", body: "Requirements first, then a test with your own records." },
      { title: "Owner reporting", body: "The few figures that would change a decision." },
    ],
    steps: [
      { title: "Name the bottleneck", body: "Write down what is slowing the company, in one page your leaders can check." },
      { title: "Assign the decisions", body: "Set a small list of priorities and limits, each tied to one named owner." },
      { title: "Set the weekly review", body: "A weekly meeting and a short report of what is off plan." },
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
    name: "Workflow audit",
    question: "Not sure where the hours go?",
    answer: "We follow the work and return a ranked roadmap with the arithmetic shown.",
    get: ["Process maps", "Systems inventory", "Ranked roadmap", "Risk notes"],
    keywords: ["audit", "process map", "roadmap", "ROI", "hours"],
  },
  {
    slug: "build-and-deploy",
    name: "Build and deploy",
    question: "Know what to automate?",
    answer: "We build it in your accounts and run it beside the manual process before it sends anything.",
    get: ["Field list", "Working workflow", "Side-by-side test report", "Runbook"],
    keywords: ["build", "deploy", "shadow testing", "data contract", "handover"],
  },
  {
    slug: "retained-operations",
    name: "Retained operations",
    question: "Who notices when it stops?",
    answer: "We watch it work, fix what breaks, and test every AI change before it goes live.",
    get: ["Monitoring", "Fixes, each with its cause", "Tested updates", "Monthly note"],
    keywords: ["monitoring", "operations", "maintenance", "retainer", "updates"],
  },
  {
    slug: "ai-agents-and-integrations",
    name: "AI agents and integrations",
    question: "Two systems that should talk?",
    answer: "Plain code connects them. AI gets one narrow job and a short list of tools.",
    get: ["Connection code", "Written limits for the AI", "Saved tests", "Log of every action"],
    keywords: ["agents", "integration", "API", "webhook", "tools"],
  },
  {
    slug: "reporting-and-data-pipelines",
    name: "Reporting and data pipelines",
    question: "Rebuilding the same report?",
    answer: "Scheduled pulls, rules you can edit, and a brief that says when a source is missing.",
    get: ["List of sources", "Scheduled pulls", "Rules you can edit", "Brief with sources"],
    keywords: ["reporting", "data", "pipeline", "dashboard", "brief", "reconciliation"],
  },
];

/** The two build types listed under "What we build". The three engagement stages are drawn once, as the StageDiagram. */
export const BUILD_TYPES = ["ai-agents-and-integrations", "reporting-and-data-pipelines"];

/** The "Built inside the tools you already use" section on the flagship page. */
export const INTEGRATIONS = {
  heading: "Built inside the tools you already use",
  note: "Example integrations. Product names and logos belong to their owners. No partnership or endorsement is implied.",
};

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
