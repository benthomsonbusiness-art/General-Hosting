/** Copy for the one-off pages. Short on purpose: pictures and the workflows carry the rest. */

export const HOME = {
  metaDescription:
    "Valentini Systems automates booking for home service businesses: missed calls, web leads, reminders and follow-up, with your office approving every text.",
  problems: [
    { q: "Calls that ring out while the whole crew is on jobs", workflowId: "missed-call-text-back" },
    { q: "Customers who forget the visit and leave a tech at a locked door", workflowId: "appointment-reminders" },
    { q: "Estimates that sit open because nobody had time to follow up", workflowId: "estimate-follow-up" },
  ],
  how: {
    steps: [
      { title: "Rules", body: "Service area, job type and open windows. Same answer every time." },
      { title: "AI", body: "Reads voicemails and texts and drafts the reply with real open times." },
      { title: "Human in the loop", body: "Your office sees the draft and approves it from a phone in one tap." },
      { title: "Booked", body: "The job lands on your dispatch board, with the source logged." },
    ],
    own: "It runs in your accounts, from code in your repository. Every login, log and line of code belongs to you.",
  },
};

export const CTA = {
  headline: "Tell us where your bookings slip.",
};

export const SERVICES_HUB = {
  metaDescription:
    "Booking automation for home service businesses: missed-call text-back, fast replies to leads, reminders, rescheduling, estimate follow-up and review requests.",
  dek: "Everything between the first ring and the finished job.",
};

export const INDUSTRIES_HUB = {
  metaDescription:
    "Booking automation for HVAC, plumbing, electrical, roofing, lawn care, cleaning and pest control companies, and what stays with your office and your techs.",
  dek: "Pick your trade to see where bookings slip and what stays with your team.",
};

export const WORKFLOWS_PAGE = {
  metaDescription:
    "Eight booking workflows for home service businesses: missed calls, web and marketplace leads, reminders, cancellations, estimates, reviews and tune-ups.",
  title: "Example workflows",
  dek: "Eight ways to book more jobs, each with a person approving what goes out.",
  listHeading: "All eight workflows",
  open: "Open this workflow",
  /** Exit text drawn above a card. A rule or AI step with its own stopLabel uses that instead. */
  stubs: {
    ai: "Unsure: goes to a person, nothing sent",
    human: "Rejected or expired: nothing sent",
  },
  internalOnly: "Internal only, so no approval step.",
  fits: "Fits:",
  service: "Service:",
  decides: {
    heading: "Human in the loop",
    expires: "Expires after",
    closing: "Rejected, expired or unsure items send nothing.",
  },
  steps: {
    heading: "Step by step",
    check: "Check:",
    alternatives: "Also works with:",
    uses: "Uses:",
  },
  /** One sentence per exit the workflow has, then its ownership line. */
  exits: {
    manual: "If the AI is unsure, the item goes to a person instead.",
    rejected: "If you reject it, nothing is sent.",
    expired: "If nobody approves in time, nothing is sent and the item goes back to the queue.",
  },
  closing: "Want this running in your shop?",
  previous: "Previous workflow",
  next: "Next workflow",
  all: "All workflows",
};

export const APPROACH_PAGE = {
  metaDescription:
    "How Valentini Systems sets up booking automation: map your calls and leads, write the rules and messages, run it beside your office, then hand over the code.",
  dek: "We follow your calls and leads from first ring to booked job, write down every rule, run it beside your office before it sends anything, and hand you the code.",
};

export const ABOUT = {
  metaDescription:
    "Valentini Systems is a Morristown, New Jersey firm that automates booking for home service businesses. Your office approves what goes out and you own the code.",
  dek: "We help home service businesses book more of the jobs they already pay to find.",
  founder:
    "Every missed call and lead should get a fast, real answer. Routine steps run as plain rules, AI drafts the replies, and your office approves every text before it goes out.",
  where: "Based in Morristown, New Jersey, working with home service businesses in person and remotely.",
};

export const CONTACT = {
  metaDescription:
    "Tell Valentini Systems where your bookings slip: missed calls, slow lead replies, no-shows or open estimates. Request a booking audit with the short form here.",
  dek: "A few sentences is enough. Say what trade you are in, what software you use, and where bookings slip.",
  guidance: "Please do not send passwords, client records or other confidential material.",
  next: ["Ben reads every note.", "If it is a fit, the first call walks through your calls and leads on screen."],
  /** Shown above the form until NEXT_PUBLIC_INQUIRY_LIVE is "1". */
  offline: "Sending is not set up yet. Nothing you type here is sent.",
};

export const SEARCH_PAGE = {
  metaDescription:
    "Search the Valentini Systems site for booking services, example workflows and trades, from missed-call text-back to tune-up reminders and review requests.",
};

export const TESTIMONIALS_PAGE = {
  metaDescription:
    "What service businesses say after Valentini Systems automated their booking: faster replies, fewer no-shows, hours back each week, and every text approved.",
  dek: "What clients say once booking runs on its own and they still approve every send.",
  empty:
    "Client stories will appear here as our first engagements wrap up. In the meantime, request an audit and see the work for yourself.",
};

export const HOW_IT_WORKS = {
  metaDescription:
    "How booking automation is set up for a home service business: lead response, reminders and follow-up, in four steps from mapping your calls to handing over.",
  statement: "One focus: more booked jobs. Four steps. You approve every one.",
};
