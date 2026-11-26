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
    slug: "booking-automation",
    name: "Booking automation",
    kind: "flagship",
    summary: "Every missed call, web form and marketplace lead answered fast and turned into a booked job.",
    metaTitle: "Booking automation for home service businesses",
    metaDescription:
      "Missed-call text-back, fast replies to web and marketplace leads, and jobs booked into ServiceTitan, Jobber or Housecall Pro, with your office approving each.",
    h1: "Turn every call and lead into a booked job",
    dek: "Missed calls get a text back in minutes. Web and marketplace leads get a reply with real open times. Your office approves each one from a phone.",
    cta: { label: "Request a booking audit", href: "/contact" },
    photo: PHOTOS.invoices,
    areas: [
      { title: "Missed calls", body: "A text back within minutes, with open times." },
      { title: "Web leads", body: "Area check, the right tech, a confirmed window." },
      { title: "Marketplace leads", body: "Fast replies on Angi and Thumbtack." },
      { title: "After hours", body: "Leads caught at night and on weekends." },
      { title: "Booking", body: "Jobs land in your field service software." },
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "marketplace-leads"],
    faqs: [
      {
        q: "Does a person still approve what goes out?",
        a: "Yes. The text is drafted for you, and your office approves it from a phone in one tap. Nothing sends itself.",
      },
      {
        q: "Which software do you work with?",
        a: "ServiceTitan, Jobber and Housecall Pro most often, plus your phone system, texting line and lead sources.",
      },
      {
        q: "Do we need to change how dispatch works?",
        a: "No. Jobs land on the same board your dispatcher already uses.",
      },
    ],
    keywords: [
      "booking",
      "speed to lead",
      "missed call",
      "text back",
      "CSR",
      "dispatch",
      "ServiceTitan",
      "Jobber",
      "Housecall Pro",
    ],
  },
  {
    slug: "reminders-and-rescheduling",
    name: "Reminders and rescheduling",
    kind: "secondary",
    summary: "Fewer no-shows and wasted truck rolls, and cancelled slots filled from your waitlist.",
    metaTitle: "Appointment reminders and rescheduling",
    metaDescription:
      "Day-before confirmations, reply-to-confirm reminders, reschedule handling and waitlist offers for home service businesses, approved by your dispatcher first.",
    h1: "Fewer no-shows, fewer wasted truck rolls",
    dek: "Customers confirm by text the day before. Cancellations are caught early and the slot is offered to someone on your waitlist.",
    cta: { label: "Request a booking audit", href: "/contact" },
    photo: PHOTOS.ads,
    areas: [
      { title: "Confirmations", body: "Reply YES to confirm, the day before." },
      { title: "Reminders", body: "Window and tech name, by text." },
      { title: "Reschedules", body: "Caught early, put in front of dispatch." },
      { title: "Waitlist", body: "Open slots offered to the next customer." },
      { title: "Dispatch board", body: "Always matches who is really coming." },
    ],
    steps: [
      { title: "Map your schedule", body: "We learn your arrival windows, job lengths and how dispatch works." },
      { title: "Set the messages", body: "You approve every template and when it goes out." },
      { title: "Run it beside you", body: "It runs alongside your office for two weeks before it sends anything." },
    ],
    workflowIds: ["appointment-reminders", "cancellation-waitlist"],
    faqs: [
      {
        q: "Will it move jobs on its own?",
        a: "No. It flags changes and suggests swaps. Your dispatcher approves every move.",
      },
      {
        q: "What if a customer replies with a question?",
        a: "Questions go to your office. The automation only sorts replies.",
      },
    ],
    keywords: ["appointment reminders", "no-shows", "confirmation", "reschedule", "waitlist", "dispatch"],
  },
  {
    slug: "follow-up-and-reviews",
    name: "Follow-up and reviews",
    kind: "secondary",
    summary: "Open estimates followed up, reviews requested and tune-ups booked before the slow season.",
    metaTitle: "Estimate follow-up, reviews and tune-up reminders",
    metaDescription:
      "Unsold estimate follow-up, review requests after happy jobs, and tune-up and service plan reminders that fill the slow season, each approved by your team first.",
    h1: "Win the jobs you already quoted",
    dek: "Open estimates get a personal follow-up, happy customers get asked for a review, and plan members get reminded before they forget.",
    cta: { label: "Request a booking audit", href: "/contact" },
    photo: PHOTOS.brief,
    areas: [
      { title: "Estimate follow-up", body: "Every open estimate, chased politely." },
      { title: "Review requests", body: "Only after the tech says the customer was happy." },
      { title: "Tune-up reminders", body: "Booked before the slow season." },
      { title: "Service plans", body: "Members reminded before visits lapse." },
      { title: "Complaints", body: "Sent to you first, before a bad review." },
    ],
    steps: [
      { title: "Find the gaps", body: "We count open estimates, unasked reviews and plans coming due." },
      { title: "Write the messages", body: "Drafted in your voice. You approve the wording." },
      { title: "Run it beside you", body: "Your team approves each send until you trust it." },
    ],
    workflowIds: ["estimate-follow-up", "review-requests", "maintenance-reminders"],
    faqs: [
      {
        q: "Will it change our prices?",
        a: "No. Follow-ups never change a price or offer a discount you did not set.",
      },
      {
        q: "Do you buy or gate reviews?",
        a: "No. Every happy customer gets the same link, and nothing is offered in exchange.",
      },
    ],
    keywords: [
      "estimate follow-up",
      "unsold estimates",
      "reviews",
      "Google reviews",
      "tune-up",
      "service agreement",
      "membership",
    ],
  },
];

export const SUB_SERVICES: SubService[] = [
  {
    slug: "workflow-audit",
    name: "Booking audit",
    question: "Not sure where bookings slip?",
    answer: "We follow your calls, forms and leads from first ring to booked job and show where they leak.",
    get: ["Call and lead map", "Software inventory", "Ranked fixes", "Booking rate by source"],
    keywords: ["audit", "process map", "roadmap", "ROI", "hours"],
  },
  {
    slug: "build-and-deploy",
    name: "Build and deploy",
    question: "Know what to automate?",
    answer: "We build it in your accounts and run it beside your office before it sends anything.",
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
    name: "Phone, text and software connections",
    question: "Phones, texts and software that don't talk?",
    answer: "Plain code connects your phone system, texting line and field service software. AI gets one narrow job.",
    get: ["Connection code", "Written limits for the AI", "Saved tests", "Log of every text"],
    keywords: ["agents", "integration", "API", "webhook", "tools"],
  },
  {
    slug: "reporting-and-data-pipelines",
    name: "Booking rate reporting",
    question: "Know your real booking rate?",
    answer: "Calls, leads and booked jobs by source, every Monday, so you know which ads pay.",
    get: ["Calls and leads by source", "Booking rate", "Missed calls", "Monday report"],
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
