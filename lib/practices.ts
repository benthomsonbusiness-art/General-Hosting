export const NAV_PRACTICES = [
  {
    id: "ai",
    href: "/",
    label: "AI Workflow Consulting",
    param: "ai-workflow",
    mark: "Current flagship",
  },
  {
    id: "meta",
    href: "/practices/meta-ads",
    label: "Meta Ads Consulting",
    param: "meta-ads",
    mark: "Active",
  },
  {
    id: "strategy",
    href: "/practices/strategy",
    label: "Strategy",
    param: "strategy",
    mark: "Active",
  },
] as const;

export type PracticeId = (typeof NAV_PRACTICES)[number]["id"];

export type PracticePage = {
  id: PracticeId;
  param: string;
  kicker: string;
  title: string;
  description: string;
  statement: string;
  lede: string;
  image: { src: string; alt: string; position: string; side: "left" | "right" };
  areas: { title: string; body: string }[];
  engagement: { title: string; body: string }[];
};

export const metaAds: PracticePage = {
  id: "meta",
  param: "meta-ads",
  kicker: "Meta Ads Consulting",
  title: "Paid acquisition, run as a system.",
  description:
    "Valentini & Co. builds Meta account structure, creative testing, and measurement a team can operate. An active advisory practice taking direct inquiries.",
  statement: "Paid Acquisition & Creative Testing Systems",
  lede: "The work is the account structure, the testing ledger, and the measurement a team can run after we leave. This practice is open. Inquiries come straight to the firm.",
  image: {
    src: "/images/systems-geometry.jpg",
    alt: "Vertical brass and dark stone fins crossed by diagonal sunlight.",
    position: "object-[18%_center]",
    side: "right",
  },
  areas: [
    {
      title: "Account architecture",
      body: "Campaigns, ad sets, and names a new buyer can audit in an afternoon. The structure is the document.",
    },
    {
      title: "Creative testing",
      body: "A written hypothesis, a kill line, and a rule for what gets promoted. The ads live inside that ledger.",
    },
    {
      title: "Signal quality",
      body: "Which events reach the platform, which are held back, and how duplicates are caught before they train delivery.",
    },
    {
      title: "Spend governance",
      body: "Budget moves on a schedule and a threshold. A named person owns the exceptions.",
    },
    {
      title: "The Monday brief",
      body: "What spent, what came back, what is fatigued, and what changes this week. Short enough to read before the first meeting.",
    },
  ],
  engagement: [
    {
      title: "Read",
      body: "The account, the pixel, and the last ninety days of creative. The leaks get names before anything is rebuilt.",
    },
    {
      title: "Rebuild",
      body: "Structure, the testing ledger, and the query behind the Monday brief. Changes ship with a written reason.",
    },
    {
      title: "Hand off",
      body: "The team runs the cadence. A retained review is available. It is a separate decision, made after the system is theirs.",
    },
  ],
};

export const strategy: PracticePage = {
  id: "strategy",
  param: "strategy",
  kicker: "Strategy",
  title: "Commercial and operational decisions, written so they can be executed.",
  description:
    "Commercial and operational strategy for founders, COOs, and managing partners. An active Valentini & Co. advisory practice taking direct inquiries.",
  statement: "Commercial & Operational Strategy",
  lede: "For founders, COOs, and managing partners who need a clear account of the offer, the margin, and how the company actually decides. The practice is open. Work starts with a direct inquiry.",
  image: {
    src: "/images/consultation-room.jpg",
    alt: "A consultation room with forest-green paneling, a cognac leather chair, and linen curtains.",
    position: "object-[center_18%]",
    side: "left",
  },
  areas: [
    {
      title: "Offer and price",
      body: "What is sold, to whom, at what margin, and what the company will not sell.",
    },
    {
      title: "Cadence",
      body: "Which meetings exist, which decisions they own, and which numbers they require before they start.",
    },
    {
      title: "Unit economics",
      body: "The few figures that would change a decision, taken from systems the company already runs.",
    },
    {
      title: "Attention",
      body: "Where the next quarter of effort goes, and which work stops to make room for it.",
    },
    {
      title: "Into execution",
      body: "When the constraint is a workflow or an acquisition system, the work continues in that practice with the same firm.",
    },
  ],
  engagement: [
    {
      title: "Frame",
      body: "Interviews with the people who decide, plus the numbers already in the ledger. The output is a written problem, not a slide tour.",
    },
    {
      title: "Decide",
      body: "A short set of choices: what continues, what stops, and what has to be true in ninety days. Each choice names an owner.",
    },
    {
      title: "Install",
      body: "The cadence and the report that keep the decision alive. If the next constraint is a system, that work is scoped on its own.",
    },
  ],
};
