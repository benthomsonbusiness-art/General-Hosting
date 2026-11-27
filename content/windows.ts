/** How each workflow looks on stage: the window it happens in, and what the window says it is doing. */
export type StageWindow = {
  place: string;
  field: "forest" | "gold" | "obsidian" | "stone";
  doing: string[];
};

export const WINDOWS: Record<string, StageWindow> = {
  "missed-call-text-back": {
    place: "Phones",
    field: "forest",
    doing: ["Call missed", "Writing a text", "", "Texting back", "Holding the spot"],
  },
  "web-lead-booking": {
    place: "Booking",
    field: "gold",
    doing: ["Form received", "Checking fit", "Matching a time", "", "Texting confirmation", "Adding to calendar"],
  },
  "appointment-reminders": {
    place: "Tomorrow's roster",
    field: "obsidian",
    doing: ["Pulling roster", "Checking roster", "Writing reminders", "", "Sending reminders", "Updating roster"],
  },
};
