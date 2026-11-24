import type { Block } from "./index.ts";

const body: Block[] = [
  {
    type: "p",
    text: "Most arguments about automation are about trust, and most of them can be settled by deciding where a person stands. Put the gate too early and the team approves things nobody would have objected to. Put it too late and the customer is the one who finds the mistake. This guide describes how we place gates, what we put in front of the person, and what the workflow should do when that person is at lunch.",
  },
  { type: "h2", id: "which-steps", text: "Which steps need a person" },
  {
    type: "p",
    text: "Start by listing every step that changes something outside the workflow. Reading a record changes nothing. Writing a note to your own CRM changes something you can correct. Sending an email changes what someone else believes, and it cannot be taken back. The gate belongs in front of that last kind.",
  },
  { type: "p", text: "In practice, four kinds of step always get a gate:" },
  {
    type: "ul",
    items: [
      "**Messages that leave the company.** Replies to leads, proposals, onboarding emails, support answers and candidate outreach.",
      "**Money.** Payment batches, refunds above a limit, credits, invoices and any change to bank details.",
      "**Decisions about people.** Hiring, credit, tenancy and discipline. The workflow can organize the evidence. The decision is made by a person and recorded under their name.",
      "**Anything regulated.** Advice, filings, disclosures and health information, where a license or a statute assigns responsibility to someone.",
    ],
  },
  {
    type: "p",
    text: "Internal steps usually do not need one. A morning brief posted to your own leadership channel can go out on schedule, because a mistake in it costs a correction and not a relationship. It should still be logged, and it should still say when a source was missing.",
  },
  {
    type: "callout",
    title: "A test for each step",
    text: "Ask who would have to apologize if this step went wrong. If the answer is someone outside the room, put a gate in front of it.",
  },
  { type: "h2", id: "as-late-as-possible", text: "Put it late, with the work done" },
  {
    type: "p",
    text: "A gate is expensive because it uses attention. So everything that can be prepared should be prepared before the request reaches a person. Enrichment, scoring, matching and drafting all come first. The person should arrive to find the item complete, with one question left: should this go out?",
  },
  {
    type: "p",
    text: "The exception is a step that is costly to undo or costly to run. If the workflow would create forty folders, or spend real money on data, ask before that step as well. Two gates in one workflow is normal. Five usually means the design has not decided what it trusts.",
  },
  { type: "workflow", id: "lead-triage" },
  { type: "h2", id: "the-message", text: "What the approval message shows" },
  {
    type: "p",
    text: "The message decides whether the gate works. If it shows a summary and a button, people will press the button. If it shows the draft, the source and the reason, they will read it. We include six things:",
  },
  {
    type: "ol",
    items: [
      "The exact text or amount that will go out, with nothing hidden behind a link.",
      "The source it was made from: the original message, the document or the rows.",
      "The reason it was produced, in one line, including the confidence if a model was involved.",
      "What is unusual about it, such as a missing field or a new recipient.",
      "Three choices: approve, edit and reject.",
      "The time it expires and what happens then.",
    ],
  },
  {
    type: "p",
    text: "Edit matters more than it appears to. Without it, a person who wants to change one word has to choose between sending something slightly wrong and rejecting good work. With it, every edit becomes a record of how the draft differed from what your team would have said. Those edits are the best test data you will collect.",
  },
  {
    type: "p",
    text: "Put the message where the person already works. For a sales lead that may be a chat message with buttons. For a controller it is the approval step inside the accounting system. A separate approvals website is one more place to forget.",
  },
  { type: "h2", id: "expiry", text: "What expiry should do" },
  {
    type: "p",
    text: "Every gate needs an answer to silence. There are only two honest ones. The item can wait without limit, or it can expire and go back to a queue that someone owns. Either way it stays unsent.",
  },
  {
    type: "quote",
    text: "Silence is not consent. A gate that approves itself after four hours is a delay with a button on it.",
  },
  {
    type: "p",
    text: "Choose the expiry from the work. A reply to a lead goes stale within hours, so it should expire quickly and return to the top of the queue with its age showing. A payment batch should expire at the end of the payment day. A hiring decision can stay open for a week. Write the period into the message so nobody has to remember it.",
  },
  {
    type: "p",
    text: "Expiry is also a measurement. If one gate expires far more often than the others, it is in front of the wrong person or it asks too often. Move it, or narrow what reaches it.",
  },
  { type: "h2", id: "logging", text: "How to log an approval" },
  {
    type: "p",
    text: "The log should let someone answer a question six months later without asking anyone. We record:",
  },
  {
    type: "ul",
    items: [
      "The run id and the item.",
      "The draft as it was presented, and the version that was sent.",
      "The person who acted, the action, and the time.",
      "The reason, when the action was a rejection.",
      "The model, prompt and schema versions behind the draft.",
    ],
  },
  {
    type: "p",
    text: "Store it in your own account, in a table your team can query. An approval history that lives only in a chat channel will be hard to find and easy to lose. If you use chat for the request, copy the result to the table in the same step.",
  },
  { type: "h2", id: "loosening", text: "When a gate can be relaxed" },
  {
    type: "p",
    text: "Teams often ask when the gate can come out. For messages, money, people and regulated work, our answer is that it stays. What can change is how much reaches it. Suppose your log shows that a certain category is approved without edits over a long period, such as a booking confirmation that only restates the booking. That step may not need a draft at all. Replace it with a fixed template, filled by code, and the question of whether the model got it right goes away.",
  },
  {
    type: "p",
    text: "That is the pattern to look for. The safest way to remove a person from a step is to remove the judgment from it first.",
  },
  { type: "h2", id: "mistakes", text: "Four ways gates go wrong" },
  {
    type: "ul",
    items: [
      "**One approver with no cover.** The workflow stops when that person takes a holiday. Name a second person in the runbook and test that the request reaches them.",
      "**Batch approval without detail.** Fifty items and one button is a rubber stamp. Show the exceptions first and let the rest be opened.",
      "**A gate the sender can skip.** If the send step can be called from anywhere else, the gate is decoration. The send should require an approval record and refuse to run without one.",
      "**Approval of one version, sending of another.** Store a fingerprint of the approved text. If the text at send time does not match, stop and ask again.",
    ],
  },
  {
    type: "p",
    text: "None of this takes special software. It takes a decision, made early and written down, about which actions belong to a person. Once that is settled, the rest of the workflow can be as fast as you like.",
  },
];

export default body;
