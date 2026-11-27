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
    doing: ["Call missed", "Writing a text", "", "Texting back", "Holding the time"],
  },
  "web-lead-booking": {
    place: "Booking",
    field: "gold",
    doing: ["Form received", "Checking the area", "Picking a tech and time", "", "Texting the time", "Booking"],
  },
  "appointment-reminders": {
    place: "Tomorrow's schedule",
    field: "obsidian",
    doing: ["Getting tomorrow", "Checking each visit", "Writing reminders", "", "Reminding", "Marking confirmed"],
  },
};
