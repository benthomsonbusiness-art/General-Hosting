import type { Block } from "./index.ts";

const body: Block[] = [
  { type: "h2", id: "situation", text: "The situation" },
  {
    type: "p",
    text: "Picture a 40-person home-services company. It has crews in the field, a small office, a bookkeeper three days a week and an owner who opens the laptop at six. The company is fictional, and we chose it because its tools are ordinary: a field-service system for jobs, an accounting package, a payment processor and a CRM that the sales side keeps mostly current.",
  },
  {
    type: "p",
    text: "Every morning the owner wants the same few answers. What was finished yesterday? What was invoiced, and what came in? Which jobs are at risk this week? Which quotes have gone quiet? The answers exist, but they are spread across four logins. So the office manager spends the first hour of the day copying figures into an email, and on the days she is away the owner goes without.",
  },
  {
    type: "p",
    text: "Two things go wrong with the manual version. The figures are sometimes stale, because one system was checked before it finished syncing. And when a number looks odd, nobody can say where it came from without opening the system again. The email saves no time on exactly the mornings when it matters.",
  },
  { type: "h2", id: "design", text: "The workflow design" },
  {
    type: "p",
    text: "The design has five steps, and only one of them uses a model. It runs at 6:30 on working days. It reads with credentials that cannot write anything. It produces a short message to a fixed internal list.",
  },
  { type: "workflow", id: "daily-brief" },
  { type: "h3", text: "Sources" },
  {
    type: "p",
    text: "Each source has its own pull, its own retry and its own status. Jobs come from the field-service system, invoices and bills from accounting, receipts from the payment processor and open quotes from the CRM. Every row is stored with the time it was read and a link back to the record. Yesterday is defined once, in the owner's time zone, in a config file. Otherwise each system would use its own.",
  },
  { type: "h3", text: "Variance rules" },
  {
    type: "p",
    text: "The owner sets the rules, and they are kept in a file that the office manager can edit. A first set might look like this:",
  },
  {
    type: "table",
    caption: "Illustrative rules. Each company would set its own.",
    head: ["Rule", "Flag when", "Source"],
    rows: [
      ["Unbilled work", "A job is complete and has no invoice after two working days", "Jobs, accounting"],
      ["Overdue invoice", "An invoice passes its due date", "Accounting"],
      ["Quiet quote", "A quote has no activity for seven days", "CRM"],
      ["Schedule risk", "A job starts within two days and parts are not received", "Jobs"],
      ["Unmatched receipt", "A payment has no invoice", "Payments, accounting"],
    ],
  },
  {
    type: "p",
    text: "These rules are code. They give the same result whenever they run, and each flag carries the rows that caused it. A rule that cannot run because its source is missing is listed as not checked, so an empty section never looks like good news.",
  },
  { type: "h3", text: "The cited summary" },
  {
    type: "p",
    text: "The model receives the flags and the rows behind them. It returns a list of sentences, and each sentence must name at least one row. Code then checks that the rows exist and that any figure in the sentence equals the figure in the row. A sentence that fails is dropped, and the number of dropped sentences is logged. If the whole step fails, the owner gets the plain list of flags, which is enough to start the day.",
  },
  {
    type: "callout",
    title: "Mechanics",
    text: "Figures are placed by the template. The model writes the words between them. If it returns a number that is not in the rows, the sentence does not survive the check.",
  },
  { type: "h3", text: "Delivery" },
  {
    type: "p",
    text: "The brief goes to a private channel or a short email list. The first line is always the source status: which systems loaded, which did not, and as of when. Then the flags, the most urgent first. Then a link to the rows. It should fit on a phone screen, because that is where it will be read.",
  },
  { type: "h2", id: "guardrails", text: "Guardrails" },
  {
    type: "ul",
    items: [
      "**Source-failure notice.** If a source fails after its retries, the brief says so in the first line. It never carries forward an old figure as if it were new.",
      "**No uncited claims.** A sentence without a source row is removed before delivery.",
      "**Read-only access.** The credentials cannot create, change or delete anything in any system.",
      "**Fixed recipients.** The list is in a config file. The workflow has no way to send outside it.",
      "**Quiet-day rule.** If nothing is flagged, the brief says that nothing was flagged and lists what was checked.",
      "**Missed-run alert.** If no brief has been produced by 6:45, the office manager is told, with the cause if it is known.",
    ],
  },
  {
    type: "p",
    text: "There is no approval gate, and that is deliberate. Nothing in this workflow reaches a customer, moves money or changes a record. If the owner later asks for the brief to send payment reminders, that is a new workflow, and a person would approve each reminder before it left.",
  },
  { type: "h2", id: "shadow", text: "The shadow period" },
  {
    type: "p",
    text: "Before anyone relies on it, the brief would run beside the office manager's email for an agreed period. Each morning the two are compared. A difference is either an error in the workflow, an error in the email, or a definition that the two do not share. The third kind is the most common and the most useful. Does a job count as finished when the crew leaves or when the customer signs? The workflow forces the company to choose.",
  },
  {
    type: "p",
    text: "Cut-over is the owner's decision. A reasonable condition is a run of mornings in which every difference has been explained and no flag was missing from the workflow's version.",
  },
  { type: "h2", id: "measure", text: "What to measure" },
  {
    type: "p",
    text: "This is an illustrative scenario, so there are no results to report. These are the measures we would track, and the reason for each:",
  },
  {
    type: "ul",
    items: [
      "**Delivery time against the schedule,** to show whether the brief can be depended on.",
      "**Source failures by system,** to show which connection needs attention.",
      "**Dropped sentences,** to show whether the summary step is drifting.",
      "**Flags acted on and flags ignored,** to show which rules are worth keeping.",
      "**Corrections reported by readers,** with the cause of each one.",
      "**Office hours spent preparing the morning email,** before and after, measured the same way.",
    ],
  },
  {
    type: "p",
    text: "Record the starting values in the week before the shadow period. Without them, any later claim about the workflow is a feeling.",
  },
  { type: "h2", id: "handover", text: "What the company would own" },
  {
    type: "p",
    text: "At handover the company has the repository, the rules file, the stored rows, the log of every brief and a runbook. The runbook covers adding a rule, replacing a credential, changing the recipients, reading the log, and producing the brief by hand when the workflow is paused. The model provider's account is in the company's name, and so is the bill.",
  },
  {
    type: "p",
    text: "The design carries over to other kinds of company with few changes. An accounting practice would swap jobs for engagements and deadlines. A retailer would watch stock and returns. The sources and thresholds change. The order of the steps does not: pull, check, cite, deliver, and say plainly what is missing.",
  },
];

export default body;
