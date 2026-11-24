export type Industry = {
  slug: string;
  name: string;
  metaDescription: string;
  summary: string;
  dek: string;
  hours: { title: string; body: string }[];
  applyNote: string;
  workflowIds: string[];
  systems: { group: string; tools: string }[];
  wont: { title: string; body: string }[];
  keywords: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "professional-services",
    name: "Professional Services",
    metaDescription:
      "Where the hours go in consultancies, agencies and law or design practices, and which proposal, intake and reporting workflows can take the manual steps.",
    summary:
      "Consultancies, agencies, and legal or design practices, where senior time goes to assembly.",
    dek: "In a services firm the product is people's time, and a surprising amount of it goes to assembling documents, chasing entries and setting up work that has already been sold.",
    hours: [
      {
        title: "Proposals assembled by hand",
        body: "Someone copies the last proposal, updates the scope from memory and asks about the price. The margin is checked after the document is nearly finished.",
      },
      {
        title: "Time entries chased every week",
        body: "An operations lead sends reminders, corrects project codes and rebuilds the same utilization sheet before the billing run can start.",
      },
      {
        title: "Client intake spread across email",
        body: "Conflict checks, contact details and documents arrive in separate threads. Work starts before anyone knows what is missing.",
      },
      {
        title: "Project setup repeated for each engagement",
        body: "Folders, permissions, channels and task lists are created one at a time, and each one is slightly different.",
      },
      {
        title: "Status reports rebuilt from three systems",
        body: "The figures exist. They live in the project tool, the time system and the ledger, and someone reconciles them by eye.",
      },
    ],
    applyNote:
      "These three usually come first because the steps are repeated often and the approval points are already clear. A partner or account lead is in the habit of reviewing the document. The workflow brings it to them complete.",
    workflowIds: ["proposal-ops", "client-onboarding", "recruiting-screen"],
    systems: [
      { group: "CRM and proposals", tools: "HubSpot, Salesforce, Google Docs, PandaDoc, DocuSign" },
      { group: "Projects and time", tools: "Asana, ClickUp, Harvest, Toggl" },
      { group: "Finance", tools: "QuickBooks, Xero, Stripe" },
      { group: "Communication", tools: "Gmail, Outlook, Slack, Microsoft Teams, Zoom" },
    ],
    wont: [
      {
        title: "Advice to your clients",
        body: "A model can organize the source material. The opinion, and the signature under it, belong to a professional.",
      },
      {
        title: "Conflict decisions",
        body: "A search can list possible matches. Clearing a conflict is a person's decision, recorded with a name.",
      },
      {
        title: "Privileged material without a rule",
        body: "Nothing confidential reaches a model provider until you have approved the provider, the terms and the retention setting.",
      },
    ],
    keywords: ["consulting", "agency", "law firm", "architecture", "proposals", "time entry"],
  },
  {
    slug: "health-wellness-fitness",
    name: "Health & Wellness / Fitness",
    metaDescription:
      "How studios, clinics and wellness operators lose hours to onboarding, schedule changes and member messages, and which workflows help, with staff approval.",
    summary:
      "Studios, clinics and wellness operators, where the front desk is also the operations team.",
    dek: "The people who greet members also answer messages, fix schedules and follow up with the ones who stopped coming. The software helps with each task and leaves the handoffs to them.",
    hours: [
      {
        title: "Membership onboarding",
        body: "Waivers, payment details and first bookings are collected in separate places. New members ask questions their paperwork already answered.",
      },
      {
        title: "Class and appointment changes",
        body: "One instructor calls in sick and the desk spends the morning moving people, sending messages and explaining credits.",
      },
      {
        title: "Lapsed-member outreach",
        body: "Someone exports a list, guesses who should hear from the studio and writes the same message again. It happens when there is time, so it rarely happens.",
      },
      {
        title: "Questions arriving in five inboxes",
        body: "Email, web chat, text and social messages carry the same few questions, and the answers differ by shift.",
      },
      {
        title: "Ad and membership numbers kept apart",
        body: "Campaign results sit in one tool and joins in another, so the owner reads both and estimates the connection.",
      },
    ],
    applyNote:
      "Each of these keeps staff in control of what members see. Outreach is drafted from records, with the reason shown, and a person at the studio approves every message before it goes out.",
    workflowIds: ["client-onboarding", "support-routing", "meta-ads-reporting"],
    systems: [
      { group: "Membership and booking", tools: "Mindbody, Mariana Tek, Glofox, Acuity" },
      { group: "Payments", tools: "Stripe, Square" },
      { group: "Messaging", tools: "Gmail, Twilio, Intercom, Klaviyo" },
      { group: "Advertising and analytics", tools: "Meta Ads, GA4, Google Sheets" },
    ],
    wont: [
      {
        title: "Health guidance",
        body: "Workflows do not give clinical, nutritional or injury advice. Those questions go to a qualified person with the message attached.",
      },
      {
        title: "Unapproved member outreach",
        body: "A list of lapsed members can be prepared overnight. Nothing is sent until someone at the studio approves the list and the text.",
      },
      {
        title: "Protected health records",
        body: "Records covered by health-privacy law stay out of scope unless your counsel has approved the design and the vendors involved.",
      },
    ],
    keywords: ["gym", "studio", "clinic", "membership", "fitness", "wellness", "scheduling"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    metaDescription:
      "Where brokerages, property managers and developers lose hours to lead response, showings and checklists, and which workflows can handle the routine steps.",
    summary:
      "Brokerages, property managers and developers, where the first reply and the next deadline both matter.",
    dek: "Leads arrive at all hours, showings move, and every transaction carries a checklist of dates. Much of the day goes to passing the same details between people and portals.",
    hours: [
      {
        title: "Slow lead response",
        body: "Portal leads, website forms and calls land in different places. The first reply depends on who looked at which inbox.",
      },
      {
        title: "Showing schedules",
        body: "Times are traded over text between agents, owners and tenants, then typed into a calendar, then changed.",
      },
      {
        title: "Transaction checklists",
        body: "Inspection, financing and document dates are tracked in a spreadsheet that one coordinator understands.",
      },
      {
        title: "Maintenance requests",
        body: "A tenant message becomes a call, a work order and an update, each written separately and sometimes forgotten.",
      },
      {
        title: "Owner reporting",
        body: "Monthly statements are rebuilt from accounting, leasing and maintenance records, with the commentary written last.",
      },
    ],
    applyNote:
      "Lead triage handles the first minutes after an inquiry, with an agent approving the reply. The daily brief covers deadlines and exceptions across listings or units. Ad reporting connects spend to the inquiries it produced.",
    workflowIds: ["lead-triage", "daily-brief", "meta-ads-reporting"],
    systems: [
      { group: "CRM and listings", tools: "Follow Up Boss, HubSpot, portal lead feeds" },
      { group: "Property management", tools: "AppFolio, Buildium, Yardi Breeze" },
      { group: "Documents and dates", tools: "DocuSign, Dotloop, Google Calendar" },
      { group: "Advertising and analytics", tools: "Meta Ads, GA4, Google Sheets" },
    ],
    wont: [
      {
        title: "Tenant or buyer screening decisions",
        body: "Fair-housing rules apply. A workflow can collect a complete application. A person applies your written criteria and records the decision.",
      },
      {
        title: "Pricing and valuation opinions",
        body: "Comparable sales can be gathered and cited. The opinion of value comes from a licensed person.",
      },
      {
        title: "Wire or deposit instructions",
        body: "Payment instructions are never generated, changed or sent by a workflow. They are confirmed by a person using a known number.",
      },
    ],
    keywords: ["brokerage", "property management", "showings", "listings", "transaction", "tenant"],
  },
  {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    metaDescription:
      "How online and store-based retailers lose hours to tickets, stock exceptions and supplier invoices, and which approval-gated workflows can take them on.",
    summary:
      "Online and store-based sellers, where every exception touches three systems.",
    dek: "Orders move on their own. The exceptions do not: a wrong size, a short shipment, an invoice that does not match. Each one sends someone looking through several tabs.",
    hours: [
      {
        title: "Support routing",
        body: "Agents read every message to decide who should answer it, then search the same help articles they used yesterday.",
      },
      {
        title: "Inventory exceptions",
        body: "Store, warehouse and marketplace counts drift apart. Someone finds out when an order cannot be filled.",
      },
      {
        title: "Supplier invoices",
        body: "Invoices arrive in different formats, and each is keyed and compared with the purchase order by eye.",
      },
      {
        title: "Product content",
        body: "Titles, attributes and size notes are rewritten for each channel, with small differences that later cause returns.",
      },
      {
        title: "Weekly performance reporting",
        body: "Ad spend, orders and margin come from three exports, and the totals rarely agree on the first try.",
      },
    ],
    applyNote:
      "These start from records you already keep. Support drafts come only from your own articles. Invoices are checked against your own purchase orders, and a person approves both the reply and the payment.",
    workflowIds: ["support-routing", "ap-intake", "meta-ads-reporting"],
    systems: [
      { group: "Store and orders", tools: "Shopify, WooCommerce, marketplace exports" },
      { group: "Support", tools: "Zendesk, Gorgias, Intercom, Gmail" },
      { group: "Inventory and finance", tools: "Cin7, QuickBooks, Xero, Stripe" },
      { group: "Advertising and analytics", tools: "Meta Ads, GA4, Klaviyo" },
    ],
    wont: [
      {
        title: "Refunds above your limit",
        body: "A workflow can prepare a refund with its reason. Anything over the limit you set waits for a person.",
      },
      {
        title: "Price changes without review",
        body: "Suggested changes go to a list with the margin shown. A person publishes them.",
      },
      {
        title: "Product claims",
        body: "Safety, health and material claims come from your approved source. A model does not write new ones.",
      },
    ],
    keywords: ["shop", "store", "Shopify", "support", "inventory", "supplier", "orders"],
  },
  {
    slug: "home-services",
    name: "Home Services",
    metaDescription:
      "Where contractors and trade businesses lose hours to quote follow-up, dispatch notes and invoices, and which workflows can handle them with approval.",
    summary:
      "Contractors and trade businesses, where the office runs on notes from the field.",
    dek: "The crews are out, the phone is ringing, and the details live in texts and photos. The office spends its day turning those details into quotes, jobs and invoices.",
    hours: [
      {
        title: "Quote follow-up",
        body: "Quotes go out and then wait. Following up depends on the estimator's memory and how busy the week is.",
      },
      {
        title: "Dispatch notes",
        body: "Gate codes, part numbers and customer requests arrive by call and text, and the technician gets some of them.",
      },
      {
        title: "Review requests",
        body: "Everyone agrees to ask for reviews. The request is sent when someone remembers, sometimes to a customer with an open complaint.",
      },
      {
        title: "Supplier and subcontractor invoices",
        body: "Paper, email and portal invoices are matched to jobs at the end of the month, when nobody remembers the job.",
      },
      {
        title: "Seasonal hiring",
        body: "Applications arrive in bursts. Good candidates wait while someone finds an hour to read them.",
      },
    ],
    applyNote:
      "Lead triage covers the gap between a call and a quote. Invoice intake ties supplier bills to jobs while they are fresh. The recruiting workflow organizes applications, and a person decides on each one.",
    workflowIds: ["lead-triage", "ap-intake", "recruiting-screen"],
    systems: [
      { group: "Field service", tools: "ServiceTitan, Jobber, Housecall Pro" },
      { group: "Phone and messaging", tools: "Twilio, OpenPhone, Gmail" },
      { group: "Finance", tools: "QuickBooks, Stripe, supplier portals" },
      { group: "Hiring", tools: "Web forms, Indeed exports, Calendly" },
    ],
    wont: [
      {
        title: "Safety and code judgments",
        body: "Whether a job is safe or meets code is decided by a licensed person on site. A workflow can attach the photos.",
      },
      {
        title: "Binding quotes",
        body: "A draft can be priced from your book. A person at the company approves it before the customer sees a number.",
      },
      {
        title: "Review filtering",
        body: "We do not build workflows that ask only satisfied customers for reviews. The request goes to everyone or to no one.",
      },
    ],
    keywords: ["contractor", "HVAC", "plumbing", "dispatch", "quotes", "field service"],
  },
  {
    slug: "financial-accounting-firms",
    name: "Financial & Accounting Firms",
    metaDescription:
      "Where accounting, bookkeeping and advisory firms lose hours to document intake, engagement letters and matching, and which workflows keep a human sign-off.",
    summary:
      "Accounting, bookkeeping and advisory practices, where the sign-off matters as much as the work.",
    dek: "The calendar sets the pace. Documents arrive late and unnamed, letters go out in batches, and reviewers spend their evenings on matching that could have been done earlier.",
    hours: [
      {
        title: "Document intake",
        body: "Clients send photos, portals and forwarded emails. Staff rename, sort and work out what is still missing.",
      },
      {
        title: "Engagement letters",
        body: "Each season starts with hundreds of near-identical letters, edited one at a time and tracked in a sheet.",
      },
      {
        title: "Invoice and statement matching",
        body: "Bookkeepers compare amounts and dates across systems, and the exceptions are explained in email.",
      },
      {
        title: "Request-list chasing",
        body: "Managers keep a list of open items per client and write the same reminder with different details.",
      },
      {
        title: "Deadline visibility",
        body: "Status is known by the person doing the work. Partners learn about a problem when the date is close.",
      },
    ],
    applyNote:
      "These workflows prepare work for review. They gather, read, match and list what is missing. The reviewer sees the source beside each figure, and the sign-off stays with the person who holds the license.",
    workflowIds: ["ap-intake", "proposal-ops", "daily-brief"],
    systems: [
      { group: "Ledger and payables", tools: "QuickBooks, Xero, Bill" },
      { group: "Practice management", tools: "Karbon, TaxDome, Canopy" },
      { group: "Documents and signature", tools: "ShareFile, Google Drive, DocuSign" },
      { group: "Communication", tools: "Outlook, Gmail, Microsoft Teams, Slack" },
    ],
    wont: [
      {
        title: "Tax, audit or investment judgments",
        body: "Conclusions come from a licensed person. A workflow can gather the evidence and show where it came from.",
      },
      {
        title: "Filing or paying without sign-off",
        body: "Returns, payments and journal entries wait for a named reviewer, and the approval is logged.",
      },
      {
        title: "Client data in unapproved tools",
        body: "Client records reach a model provider only after you have approved the provider, the terms and the retention setting.",
      },
    ],
    keywords: ["accounting", "bookkeeping", "tax", "advisory", "engagement letter", "matching"],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}
