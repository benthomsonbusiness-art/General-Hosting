/** How each workflow looks on stage: the window it happens in, and what the window says it is doing. */
export type StageWindow = {
  place: string;
  /** Background of the stage. All four come from the brand palette. */
  field: "forest" | "gold" | "obsidian" | "stone";
  /** One short status per step. Human steps show "Waiting for you" instead. */
  doing: string[];
};

export const WINDOWS: Record<string, StageWindow> = {
  "missed-call-text-back": {
    place: "Phones",
    field: "forest",
    doing: ["Call missed", "Drafting a text", "", "Texting back", "Holding the visit"],
  },
  "web-lead-booking": {
    place: "Booking",
    field: "gold",
    doing: ["Receiving", "Checking the area", "Matching tech and window", "", "Confirming", "Booking"],
  },
  "marketplace-leads": {
    place: "Lead inbox",
    field: "stone",
    doing: ["Receiving", "Qualifying", "", "Replying", "Adding the lead"],
  },
  "appointment-reminders": {
    place: "Dispatch board",
    field: "obsidian",
    doing: ["Pulling tomorrow", "Checking each visit", "Writing reminders", "", "Reminding", "Marking visits"],
  },
  "cancellation-waitlist": {
    place: "Dispatch board",
    field: "forest",
    doing: ["Reply received", "Reading it", "Ranking the waitlist", "", "Offering the slot", "Moving the visit"],
  },
  "estimate-follow-up": {
    place: "Sales",
    field: "gold",
    doing: ["Finding open estimates", "Checking status", "Drafting", "", "Sending", "Logging"],
  },
  "review-requests": {
    place: "Reviews",
    field: "stone",
    doing: ["Job complete", "Checking the job", "Drafting a thank-you", "", "Asking for a review", "Logging"],
  },
  "maintenance-reminders": {
    place: "Service plans",
    field: "obsidian",
    doing: ["Finding plans due", "Building the list", "Writing reminders", "", "Sending", "Holding slots"],
  },
};
