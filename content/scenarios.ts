/** Sample inputs a visitor can choose in the workflow player. Fictional, and the copy says so. */
export type Scenario = {
  id: string;
  label: string;
  /** Model confidence for every AI step in this sample run. */
  confidence: number;
  /** A rule (not a model) hands the item to a person at this step. */
  stopAt?: string;
  /** Editable text at the approval gate, when the workflow sends one. */
  draft?: string;
};

export const SCENARIOS: Record<string, [Scenario, Scenario]> = {
  "missed-call-text-back": [
    {
      id: "clear",
      label: "Left a voicemail",
      confidence: 0.91,
      draft: "Sorry we missed you. We can be there today 2 to 4 or tomorrow 8 to 10. Which works?",
    },
    { id: "silent", label: "No voicemail", confidence: 0.55, draft: "Sorry we missed your call. How can we help?" },
  ],
  "web-lead-booking": [
    {
      id: "in-area",
      label: "In your area",
      confidence: 0.88,
      draft: "You're booked Tuesday 10 to 12 with Marco. Reply C to change.",
    },
    { id: "out-of-area", label: "Outside your area", confidence: 0.9, stopAt: "area-check" },
  ],
  "appointment-reminders": [
    { id: "all-ready", label: "All visits ready", confidence: 0.92 },
    { id: "missing", label: "Missing details", confidence: 0.92, stopAt: "ready-check" },
  ],
};

/** The steps where a sample run leaves the automatic path. */
export function stopsFor(nodes: { id: string; kind: string }[], scenario: Scenario, threshold: number): string[] {
  return nodes
    .filter((node) => node.id === scenario.stopAt || (node.kind === "ai" && scenario.confidence < threshold))
    .map((node) => node.id);
}
