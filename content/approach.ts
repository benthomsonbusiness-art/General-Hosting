export type Faq = { q: string; a: string };

export const PRINCIPLES: { title: string; short: string }[] = [
  { title: "Deterministic code wherever possible", short: "The same answer every time." },
  { title: "AI only where judgment is needed", short: "Output that fails its schema is discarded." },
  { title: "A person approves what leaves the company", short: "It waits. It never sends itself." },
  { title: "You own the code, the accounts and the logs", short: "Removing our access is one line in the runbook." },
  { title: "Every workflow ships with its operating kit", short: "Monitoring, an audit log and a runbook." },
];

export const METHOD: { title: string; line: string; happens: string; see: string; approve: string }[] = [
  {
    title: "Map",
    line: "Follow the work",
    happens:
      "We follow real items with the people who handle them. Exceptions get as much time as the normal path, because they are where most automations break.",
    see: "A process map, a systems inventory and a ranked list.",
    approve: "The map. If it is wrong, we correct it first.",
  },
  {
    title: "Design",
    line: "Write the contract",
    happens:
      "We write each field, its source and its owner. We mark which steps are code, which need a model and which need a person.",
    see: "The data contract, the gates and the failure table.",
    approve: "Gates, thresholds and access.",
  },
  {
    title: "Build",
    line: "Run it in shadow",
    happens:
      "The workflow runs beside the manual process and sends nothing. Each difference is a defect until it is explained.",
    see: "A shadow report of every difference.",
    approve: "The cut-over.",
  },
  {
    title: "Hand over",
    line: "Make it yours",
    happens: "Your team runs it with us present, including one deliberate failure and one run by hand.",
    see: "The runbook, the alerts and the saved tests.",
    approve: "Acceptance, and whether we stay on.",
  },
];

export const OWNED_ITEMS = ["Repositories", "Accounts", "Logs", "Runbooks", "Prompts and schemas"];

export const APPROACH_FAQ: Faq[] = [
  {
    q: "Do we have to do all of it?",
    a: "No. The audit stands on its own. You can take the roadmap to your own team or decide that nothing is worth building yet.",
  },
  {
    q: "How much time do you need from our people?",
    a: "Most of it falls in the audit. After that we need one owner, plus the people who will sit at each approval gate.",
  },
  {
    q: "What if the shadow test goes badly?",
    a: "The manual process is still running, so nothing is lost. We fix the cause, or we tell you the step is not a good candidate.",
  },
  {
    q: "What does it cost?",
    a: "The audit is a fixed-scope proposal. Build work is scoped after the audit.",
  },
];
