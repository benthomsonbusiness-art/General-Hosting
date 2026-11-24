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
  "lead-triage": [
    {
      id: "clear",
      label: "Clear lead",
      confidence: 0.92,
      draft: "Thanks for writing. Which system holds your price list today?",
    },
    {
      id: "vague",
      label: "Vague lead",
      confidence: 0.62,
      draft: "Happy to explain. What made you look for this now?",
    },
  ],
  "proposal-ops": [
    { id: "healthy", label: "Healthy margin", confidence: 0.9 },
    { id: "thin", label: "Below the floor", confidence: 0.9, stopAt: "margin-check" },
  ],
  "client-onboarding": [
    {
      id: "complete",
      label: "Complete intake",
      confidence: 0.9,
      draft: "Welcome. Your folder is ready, and the kickoff agenda is inside.",
    },
    { id: "missing", label: "Missing answers", confidence: 0.9, stopAt: "intake" },
  ],
  "daily-brief": [
    { id: "all", label: "All sources load", confidence: 0.9 },
    { id: "gap", label: "CRM is down", confidence: 0.86 },
  ],
  "ap-intake": [
    { id: "short", label: "Short delivery", confidence: 0.93 },
    { id: "scan", label: "Poor scan", confidence: 0.58 },
  ],
  "support-routing": [
    {
      id: "exchange",
      label: "Exchange request",
      confidence: 0.91,
      draft: "You can exchange the item. The steps are in our exchange policy.",
    },
    { id: "unclear", label: "Unclear message", confidence: 0.55, draft: "Could you tell us more?" },
  ],
  "meta-ads-reporting": [
    { id: "spike", label: "Cost spike", confidence: 0.9 },
    { id: "steady", label: "Steady week", confidence: 0.94 },
  ],
  "recruiting-screen": [
    {
      id: "evidence",
      label: "Clear evidence",
      confidence: 0.9,
      draft: "We would like to talk. Please choose a time that suits you.",
    },
    { id: "thin", label: "Thin resume", confidence: 0.6, draft: "We would like to talk." },
  ],
};

/** The steps where a sample run leaves the automatic path. */
export function stopsFor(
  nodes: { id: string; kind: string }[],
  scenario: Scenario,
  threshold: number,
): string[] {
  return nodes
    .filter(
      (node) =>
        node.id === scenario.stopAt || (node.kind === "ai" && scenario.confidence < threshold),
    )
    .map((node) => node.id);
}
