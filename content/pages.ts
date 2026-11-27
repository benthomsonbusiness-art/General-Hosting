/** Copy for the one-off pages. Short and plain on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Temporant helps gyms, studios and service businesses book more clients: missed calls get a text back, web leads get booked and classes get reminders.",
  problems: [
    { q: "Calls missed while you're coaching a class or with a client", workflowId: "missed-call-text-back" },
    { q: "Website leads that wait hours for an answer", workflowId: "web-lead-booking" },
    { q: "Classes, calls and appointments people forget", workflowId: "appointment-reminders" },
  ],
  how: {
    steps: [
      { title: "Rules", body: "Checks your schedule and what you offer." },
      { title: "AI", body: "Writes a short reply with real open times." },
      { title: "Human in the loop", body: "You approve from your phone in one tap." },
      { title: "Booked", body: "The spot lands on your calendar." },
    ],
    own: "It runs in your own accounts. Everything we set up belongs to you.",
  },
};

export const CTA = {
  headline: "Tell us where bookings slip.",
};

export const SERVICES_HUB = {
  metaDescription:
    "Three booking tools for gyms, studios and service businesses: text back missed calls, book web leads fast and send class or appointment reminders.",
  dek: "Three simple tools that keep your calendar full.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Booking tools for gyms, fitness studios, recruiting teams, event companies, landscaping and home services: missed call text-back and class reminders.",
  dek: "Built for gyms, studios and service businesses.",
};

export const WORKFLOWS_PAGE = {
  metaDescription:
    "See how each booking tool works: missed call text-back, instant booking for website leads and class or appointment reminders. You approve every text.",
  title: "See how each one works",
  dek: "Three tools. You approve every text.",
  listHeading: "The three workflows",
  open: "Open this workflow",
  stubs: {
    ai: "Not sure: goes to your team, nothing sent",
    human: "Not approved: nothing sent",
  },
  internalOnly: "Only you see this, so no approval needed.",
  fits: "Fits:",
  service: "Service:",
  decides: {
    heading: "Human in the loop",
    expires: "If nobody answers:",
    closing: "Nothing goes out until you approve it.",
  },
  steps: {
    heading: "Step by step",
    check: "Guardrail:",
    alternatives: "Also works with:",
    uses: "Uses:",
  },
  exits: {
    manual: "If the AI isn't sure, your team handles it directly.",
    rejected: "If you skip it, nothing is sent.",
    expired: "If nobody approves in time, nothing is sent.",
  },
  closing: "Want this for your business?",
  previous: "Previous",
  next: "Next",
  all: "All three",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How setup works: we look at how you book today, write the texts with you, run two weeks of practice tests and hand everything over to your team.",
  dek: "We look at how you book today, write the texts with you, test it for two weeks, then hand it over.",
};

export const ABOUT = {
  metaDescription:
    "Temporant is based in Morristown, New Jersey and helps gyms, studios and service businesses book more clients with simple texts you approve first.",
  dek: "We help gyms, studios and service businesses book more of the people who reach out.",
  founder:
    "Every missed call and new inquiry deserves a quick, real answer. We set up simple tools that draft the reply from your real schedule, and you approve every text before it goes out.",
  where: "Based in Morristown, New Jersey. Working with gyms and service businesses in person and remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Temporant where bookings slip: missed calls during classes or jobs, slow replies to web leads or no-shows. Request a booking audit on this page.",
  dek: "Tell us what kind of business you run, what calendar or software you use, and where bookings slip.",
  guidance: "",
  next: ["Ben reads every note.", "If it's a fit, we'll walk through your calls and bookings together."],
  offline: "Form delivery is not connected yet.",
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search Temporant for missed call text-back, instant booking for website leads, class and appointment reminders, industries and how setup works.",
};

export const TESTIMONIALS_PAGE = {
  metaDescription:
    "What gyms, event companies and service businesses say after Temporant set up their booking: faster replies, fewer no-shows and hours saved weekly.",
  dek: "What clients say.",
  empty: "Client stories will appear here soon. Request an audit to walk through how it works.",
};

export const HOW_IT_WORKS = {
  metaDescription:
    "How it works: three simple booking tools for gyms and service businesses, set up in four clear steps from your first booking audit to team handover.",
  statement: "Three tools. Four steps. You approve every text.",
};
