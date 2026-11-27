/** Copy for the one-off pages. Short and plain on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Temporant helps service businesses book more jobs: missed calls get a text back, web leads get booked, customers get reminders. You approve every text.",
  problems: [
    { q: "Calls that ring out while you're on a job", workflowId: "missed-call-text-back" },
    { q: "Website leads that wait hours for an answer", workflowId: "web-lead-booking" },
    { q: "Customers who forget and aren't home", workflowId: "appointment-reminders" },
  ],
  how: {
    steps: [
      { title: "Rules", body: "Checks your area, your schedule and the job." },
      { title: "AI", body: "Writes a friendly text with real open times." },
      { title: "Human in the loop", body: "You approve it from your phone in one tap." },
      { title: "Booked", body: "The job lands on your schedule." },
    ],
    own: "It runs in your own accounts. Everything we set up belongs to you.",
  },
};

export const CTA = {
  headline: "Tell us where your bookings slip.",
};

export const SERVICES_HUB = {
  metaDescription:
    "Three simple tools for service businesses: text back missed calls, book website leads fast, and remind customers the day before. You approve every text first.",
  dek: "Three simple tools that book more jobs.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Booking help for HVAC, plumbing, electrical, roofing, lawn care, cleaning and pest control companies: missed call text-back, instant booking and reminders.",
  dek: "Pick your trade.",
};

export const WORKFLOWS_PAGE = {
  metaDescription:
    "See exactly how it works: missed call text-back, instant booking for website leads, and appointment reminders. Every step is shown, and you approve each text.",
  title: "See how each one works",
  dek: "Three tools. You approve every text.",
  listHeading: "The three workflows",
  open: "Open this workflow",
  /** Exit text drawn above a card. A rule or AI step with its own stopLabel uses that instead. */
  stubs: {
    ai: "Not sure: goes to your office, nothing sent",
    human: "Not approved: nothing sent",
  },
  internalOnly: "Only you see this, so no approval needed.",
  fits: "Fits:",
  service: "Service:",
  decides: {
    heading: "Human in the loop",
    expires: "If nobody answers:",
    closing: "If you don't approve it, nothing is sent.",
  },
  steps: {
    heading: "Step by step",
    check: "Safety check:",
    alternatives: "Also works with:",
    uses: "Uses:",
  },
  /** One sentence per exit the workflow has, then its ownership line. */
  exits: {
    manual: "If the AI isn't sure, your office handles it instead.",
    rejected: "If you say no, nothing is sent.",
    expired: "If nobody approves in time, nothing is sent and someone is told.",
  },
  closing: "Want this for your business?",
  previous: "Previous",
  next: "Next",
  all: "All three",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How setup works: we look at how you book today, write the texts with you, test it next to your office for two weeks, then hand it over to your team to run.",
  dek: "We look at how you book today, write the texts with you, test it next to your office, then hand it over.",
};

export const ABOUT = {
  metaDescription:
    "Temporant is based in Morristown, New Jersey and helps service businesses book more jobs with simple text tools. You approve every text we set up.",
  dek: "We help service businesses book more of the jobs they already pay to find.",
  founder:
    "Every missed call and every lead deserves a fast, real answer. We set up simple tools that write the text for you, and you approve it before it goes out.",
  where: "Based in Morristown, New Jersey. Working with service businesses in person and remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Temporant where your bookings slip: missed calls, slow replies to web leads, or no-shows. Request a booking audit with the short form on this page.",
  dek: "A few sentences is enough. What's your trade, what software do you use, and where do jobs slip away?",
  guidance: "Please don't send passwords or customer records.",
  next: ["Ben reads every note.", "If it's a fit, we'll walk through your calls and leads together."],
  /** Shown above the form until NEXT_PUBLIC_INQUIRY_LIVE is "1". */
  offline: "Sending is not set up yet. Nothing you type here is sent.",
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Temporant site for missed call text-back, instant booking for website leads, appointment reminders, trades and how setup works for you.",
};

export const TESTIMONIALS_PAGE = {
  metaDescription:
    "What service businesses say after Temporant set up their booking: faster replies, fewer no-shows, hours back each week, and every text approved.",
  dek: "What clients say.",
  empty: "Client stories will appear here soon. In the meantime, request an audit and see it for yourself.",
};

export const HOW_IT_WORKS = {
  metaDescription:
    "How it works: three simple booking tools for service businesses, set up in four steps, from looking at how you book today to handing it over to your team.",
  statement: "Three tools. Four steps. You approve every text.",
};
