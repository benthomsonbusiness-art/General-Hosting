export type Industry = {
  slug: string;
  name: string;
  line: string;
  hours: string[];
  workflowIds: string[];
  stays: string;
  keywords: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "professional-services",
    name: "Professional Services",
    line: "Senior time goes to assembling documents that were sold weeks ago.",
    hours: ["Proposals", "Client intake", "Time entries", "Project setup", "Status reports"],
    workflowIds: ["proposal-ops", "client-onboarding", "recruiting-screen"],
    stays: "Advice, conflict decisions and anything privileged.",
    keywords: ["consulting", "agency", "law firm", "architecture", "proposals", "time entry"],
  },
  {
    slug: "health-wellness-fitness",
    name: "Health & Wellness / Fitness",
    line: "The front desk is also the operations team.",
    hours: ["Membership onboarding", "Schedule changes", "Lapsed members", "Five inboxes"],
    workflowIds: ["client-onboarding", "support-routing", "meta-ads-reporting"],
    stays: "Health guidance, unapproved outreach and protected records.",
    keywords: ["gym", "studio", "clinic", "membership", "fitness", "wellness", "scheduling"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    line: "Leads arrive at all hours, and every deal carries a list of dates.",
    hours: ["Lead response", "Showings", "Transaction dates", "Maintenance requests", "Owner reports"],
    workflowIds: ["lead-triage", "daily-brief", "meta-ads-reporting"],
    stays: "Screening decisions, valuations and payment instructions.",
    keywords: ["brokerage", "property management", "showings", "listings", "transaction", "tenant"],
  },
  {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    line: "Orders move on their own. The exceptions do not.",
    hours: ["Support routing", "Stock exceptions", "Supplier invoices", "Product content"],
    workflowIds: ["support-routing", "ap-intake", "meta-ads-reporting"],
    stays: "Refunds above your limit, price changes and product claims.",
    keywords: ["shop", "store", "Shopify", "support", "inventory", "supplier", "orders"],
  },
  {
    slug: "home-services",
    name: "Home Services",
    line: "The crews are out, and the details live in texts and photos.",
    hours: ["Quote follow-up", "Dispatch notes", "Job invoices", "Seasonal hiring"],
    workflowIds: ["lead-triage", "ap-intake", "recruiting-screen"],
    stays: "Safety calls, binding quotes and who gets asked for a review.",
    keywords: ["contractor", "HVAC", "plumbing", "dispatch", "quotes", "field service"],
  },
  {
    slug: "financial-accounting-firms",
    name: "Financial & Accounting Firms",
    line: "Reviewers spend evenings on matching that could have been done earlier.",
    hours: ["Document intake", "Engagement letters", "Matching", "Open-item chasing", "Deadlines"],
    workflowIds: ["ap-intake", "proposal-ops", "daily-brief"],
    stays: "Judgments, filings and the sign-off.",
    keywords: ["accounting", "bookkeeping", "tax", "advisory", "engagement letter", "matching"],
  },
];
