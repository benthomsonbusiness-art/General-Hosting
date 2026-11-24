export type InsightType = "article" | "guide" | "blueprint" | "checklist";

export const INSIGHT_TYPES: Record<InsightType, string> = {
  article: "Article",
  guide: "Guide",
  blueprint: "Blueprint",
  checklist: "Checklist",
};

export type Insight = {
  slug: string;
  type: InsightType;
  title: string;
  dek: string;
  metaDescription: string;
  /** ISO date, never later than the build date. */
  date: string;
  /** Checked against the body word count by scripts/check-content.ts. */
  readMinutes: number;
  topics: string[];
  services: string[];
  industries: string[];
  image: { src: string; alt: string; position: string };
  workflowIds: string[];
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "workflow"; id: string };

export const INSIGHTS: Insight[] = [
  {
    slug: "where-the-approval-gate-goes",
    type: "guide",
    title: "Where the approval gate goes in an automated workflow",
    dek: "Which steps need a person, what the approval message should show, and what happens when nobody answers.",
    metaDescription:
      "A practical guide to placing approval gates: which steps need a person, what the message should show, how expiry should work and what to write in the log.",
    date: "2026-11-24",
    readMinutes: 5,
    topics: ["Approval gates", "Workflow design"],
    services: ["ai-workflow-automation"],
    industries: ["professional-services", "health-wellness-fitness", "real-estate", "home-services"],
    image: {
      src: "/images/systems-geometry.jpg",
      alt: "Brass fins crossed by diagonal sunlight.",
      position: "20% center",
    },
    workflowIds: ["lead-triage"],
  },
  {
    slug: "deterministic-first",
    type: "article",
    title: "Deterministic first: when a workflow step needs a model",
    dek: "Rules, lookups and arithmetic belong in code. Reading and drafting can use a model, inside a schema and under a threshold.",
    metaDescription:
      "How to decide whether a workflow step needs a language model or ordinary code, with a decision table, confidence thresholds and manual review queues.",
    date: "2026-11-24",
    readMinutes: 6,
    topics: ["Workflow design", "AI steps"],
    services: ["ai-workflow-automation"],
    industries: ["financial-accounting-firms", "ecommerce-retail", "home-services"],
    image: {
      src: "/images/editorial-workspace.jpg",
      alt: "An open notebook and brass pen on a wood desk in window light.",
      position: "center 60%",
    },
    workflowIds: ["ap-intake"],
  },
  {
    slug: "what-a-workflow-audit-maps",
    type: "checklist",
    title: "What a workflow audit maps in week one",
    dek: "Eight lists that show how work moves through a company, and the questions that fill each one in. Made to be printed.",
    metaDescription:
      "A printable checklist for the first week of a workflow audit: processes, systems, handoffs, exceptions, owners, access, hours arithmetic and risk notes.",
    date: "2026-11-24",
    readMinutes: 5,
    topics: ["Workflow audit"],
    services: ["ai-workflow-automation", "strategy"],
    industries: [
      "professional-services",
      "health-wellness-fitness",
      "real-estate",
      "ecommerce-retail",
      "home-services",
      "financial-accounting-firms",
    ],
    image: {
      src: "/images/consultation-room.jpg",
      alt: "A leather chair beside forest-green paneling and linen curtains.",
      position: "center 62%",
    },
    workflowIds: ["daily-brief"],
  },
  {
    slug: "daily-brief-for-a-services-company",
    type: "blueprint",
    title: "A daily brief for a 40-person services company",
    dek: "An illustrative design for a morning summary that cites its sources, names its gaps and stays inside the company.",
    metaDescription:
      "An illustrative blueprint for a cited daily brief: sources, variance rules, guardrails, failure notices and the measures an owner would track over time.",
    date: "2026-11-24",
    readMinutes: 5,
    topics: ["Reporting", "Workflow design"],
    services: ["ai-workflow-automation"],
    industries: ["home-services", "professional-services", "financial-accounting-firms"],
    image: {
      src: "/images/hero-architecture.jpg",
      alt: "Walnut slats beside a window onto a city at twilight.",
      position: "82% center",
    },
    workflowIds: ["daily-brief"],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((insight) => insight.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Insights that match first, then the latest others, up to `count`. */
export function relatedInsights(
  match: (insight: Insight) => boolean,
  count = 3,
  excludeSlug?: string,
): Insight[] {
  const pool = INSIGHTS.filter((insight) => insight.slug !== excludeSlug);
  return [...pool.filter(match), ...pool.filter((insight) => !match(insight))].slice(0, count);
}
