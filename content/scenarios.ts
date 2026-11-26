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
      label: "Clear voicemail",
      confidence: 0.91,
      draft: "Sorry we missed you. We can be there today 2 to 4 or tomorrow 8 to 10. Which works?",
    },
    {
      id: "silent",
      label: "No voicemail",
      confidence: 0.55,
      draft: "Sorry we missed your call. What can we help with?",
    },
  ],
  "web-lead-booking": [
    {
      id: "in-area",
      label: "In your area",
      confidence: 0.88,
      draft: "You're booked Tue 10 to 12 with Marco. Reply C to change.",
    },
    { id: "out-of-area", label: "Outside your area", confidence: 0.9, stopAt: "area-check" },
  ],
  "marketplace-leads": [
    {
      id: "good-fit",
      label: "Good fit",
      confidence: 0.86,
      draft: "We can do this within our usual range. Wed 9 to 11 or Thu 1 to 3?",
    },
    {
      id: "unclear",
      label: "Unclear job",
      confidence: 0.6,
      draft: "Happy to help. Can you send a photo of the panel?",
    },
  ],
  "appointment-reminders": [
    { id: "all-ready", label: "All visits ready", confidence: 0.92 },
    { id: "missing", label: "Missing details", confidence: 0.92, stopAt: "ready-check" },
  ],
  "cancellation-waitlist": [
    {
      id: "filled",
      label: "Waitlist match",
      confidence: 0.93,
      draft: "A Tuesday 8 to 10 slot opened up. Want it? Reply YES.",
    },
    { id: "nobody", label: "Nobody fits", confidence: 0.93, stopAt: "rank-waitlist" },
  ],
  "estimate-follow-up": [
    {
      id: "open",
      label: "Still open",
      confidence: 0.87,
      draft: "Hi Dana, any questions on the two options? Happy to walk through financing.",
    },
    { id: "sold", label: "Already sold", confidence: 0.87, stopAt: "still-open" },
  ],
  "review-requests": [
    {
      id: "happy",
      label: "Happy customer",
      confidence: 0.9,
      draft: "Thanks for having us out today. Would you leave us a quick Google review?",
    },
    { id: "callback", label: "Callback job", confidence: 0.9, stopAt: "job-checks" },
  ],
  "maintenance-reminders": [
    {
      id: "batch",
      label: "Full batch",
      confidence: 0.88,
      draft: "Your furnace tune-up is due. Tue 9 to 11 or Thu 1 to 3? Reply 1 or 2.",
    },
    { id: "unsure", label: "Thin history", confidence: 0.6, draft: "Your yearly tune-up is due. What day works best?" },
  ],
};

/** The steps where a sample run leaves the automatic path. */
export function stopsFor(nodes: { id: string; kind: string }[], scenario: Scenario, threshold: number): string[] {
  return nodes
    .filter((node) => node.id === scenario.stopAt || (node.kind === "ai" && scenario.confidence < threshold))
    .map((node) => node.id);
}
