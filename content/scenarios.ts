/** Sample inputs a visitor can choose in the workflow player. Fictional, and the copy says so. */
export type Scenario = {
  id: string;
  label: string;
  confidence: number;
  stopAt?: string;
  draft?: string;
};

export const SCENARIOS: Record<string, [Scenario, Scenario]> = {
  "missed-call-text-back": [
    {
      id: "clear",
      label: "Asked about intro class",
      confidence: 0.91,
      draft: "Sorry we missed your call. Coach Maya has intro spots open tomorrow at 7 a.m. or 5:30 p.m. Which works?",
    },
    { id: "silent", label: "No voicemail left", confidence: 0.55, draft: "Sorry we missed your call. How can we help?" },
  ],
  "web-lead-booking": [
    {
      id: "in-area",
      label: "Trial form after hours",
      confidence: 0.88,
      draft: "You're booked for Thursday 6 a.m. Strength with Coach Maya. Reply C if you need another time.",
    },
    { id: "out-of-area", label: "Custom group inquiry", confidence: 0.9, stopAt: "area-check" },
  ],
  "appointment-reminders": [
    { id: "all-ready", label: "Tomorrow's 18 class spots", confidence: 0.92 },
    { id: "missing", label: "Missing phone number", confidence: 0.92, stopAt: "ready-check" },
  ],
};

/** The steps where a sample run leaves the automatic path. */
export function stopsFor(nodes: { id: string; kind: string }[], scenario: Scenario, threshold: number): string[] {
  return nodes
    .filter((node) => node.id === scenario.stopAt || (node.kind === "ai" && scenario.confidence < threshold))
    .map((node) => node.id);
}
