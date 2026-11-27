export type Faq = { q: string; a: string };

export const PRINCIPLES: { title: string; short: string }[] = [
  { title: "Simple rules first", short: "Same input, same answer." },
  { title: "AI only writes drafts", short: "It never sends anything." },
  { title: "You approve every text", short: "One tap from your phone." },
  { title: "You own everything", short: "It runs in your accounts." },
  { title: "Clear instructions", short: "Your team knows how it works." },
];

export const METHOD: { title: string; line: string; happens: string; see: string; approve: string }[] = [
  {
    title: "Look",
    line: "How you book today",
    happens: "We watch how calls and leads come in, and where they slip.",
    see: "A short list of what to fix first.",
    approve: "The list.",
  },
  {
    title: "Plan",
    line: "Write the texts with you",
    happens: "We write every text with you and decide when you approve.",
    see: "Every text, in plain words.",
    approve: "The wording.",
  },
  {
    title: "Test",
    line: "Run it next to your office",
    happens: "It runs next to your office for two weeks and sends nothing.",
    see: "What it would have sent.",
    approve: "Going live.",
  },
  {
    title: "Go live",
    line: "It's yours",
    happens: "Your team uses it, with us on hand.",
    see: "Simple instructions for your team.",
    approve: "Whether we stay on to look after it.",
  },
];

/** Links the four steps to the three stages. */
export const STAGES_NOTE = "Look and Plan happen in the booking audit. Test and Go live happen in setup.";

export const APPROACH_FAQ: Faq[] = [
  {
    q: "Do I have to buy everything?",
    a: "No. Start with the audit. You can stop there if nothing is worth setting up.",
  },
  {
    q: "How much of my time does it take?",
    a: "A couple of short calls in the audit, then someone to approve texts while we test.",
  },
  {
    q: "What if it doesn't work for us?",
    a: "Your office keeps working the old way while we test, so nothing is lost.",
  },
  {
    q: "What does it cost?",
    a: "The audit is a set price agreed up front. Setup is priced after the audit.",
  },
];
