export type Faq = { q: string; a: string };

export const PRINCIPLES: { title: string; short: string }[] = [
  { title: "Plain rules wherever possible", short: "Same input, same result." },
  { title: "AI only for reading and drafting", short: "Answers that fail a check are thrown out." },
  { title: "A person approves what leaves the company", short: "It waits. It never sends itself." },
  { title: "You own the code, the accounts and the logs", short: "Removing our access is one line in the runbook." },
  { title: "Every workflow comes with a manual", short: "Alerts, a log of every action, and written steps for your team." },
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
    line: "Write it down",
    happens:
      "We write down each piece of information, where it comes from and who owns it. We mark which steps are rules, which use AI and which need your approval.",
    see: "The field list, the approval points, and what happens when something fails.",
    approve: "Where you approve, the limits, and who gets access.",
  },
  {
    title: "Build",
    line: "Test it beside your team",
    happens:
      "The workflow runs beside the manual process and sends nothing. Each difference is a defect until it is explained.",
    see: "A report of every difference from your team's work.",
    approve: "Going live.",
  },
  {
    title: "Hand over",
    line: "Make it yours",
    happens: "Your team runs it with us present, including one deliberate failure and one run by hand.",
    see: "The runbook, the alerts and the saved tests.",
    approve: "Acceptance, and whether we stay on.",
  },
];

/** Links the four method stages to the three engagement stages. */
export const STAGES_NOTE = "Map and Design happen in the workflow audit. Build and Hand over happen in build and deploy.";

export const APPROACH_FAQ: Faq[] = [
  {
    q: "Do we have to do all of it?",
    a: "No. The audit stands on its own. You can take the roadmap to your own team or decide that nothing is worth building yet.",
  },
  {
    q: "How much time do you need from our people?",
    a: "Most of it falls in the audit. After that we need one owner, plus the people who will approve each step.",
  },
  {
    q: "What if the test goes badly?",
    a: "The manual process is still running, so nothing is lost. We fix the cause, or we tell you the step is not a good candidate.",
  },
  {
    q: "What does it cost?",
    a: "The audit is a fixed-scope proposal. Build work is scoped after the audit.",
  },
];
