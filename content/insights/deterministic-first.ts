import type { Block } from "./index.ts";

const body: Block[] = [
  {
    type: "p",
    text: "A language model can do almost any step in a workflow badly and some of them well. The useful skill is telling the two apart before anything is built. Our rule is to start from the assumption that a step is ordinary code, and to make the case for a model one step at a time.",
  },
  {
    type: "p",
    text: "The reason is practical. Code gives the same answer to the same input. It can be tested once and trusted until it changes. When it fails, it fails at a line. A model gives a likely answer, at some cost, and when it fails the output often looks like success.",
  },
  { type: "h2", id: "two-questions", text: "Two questions for each step" },
  {
    type: "p",
    text: "For every step on the map, we ask two questions. Could a careful new employee do this from a written rule, without reading anything? If yes, it is code. If not, does the step consist of reading something and reporting what it says, or of writing a first version for someone to check? If yes, a model may help. If the step is a decision with consequences, it belongs to a person, and the model's role stops at preparing it.",
  },
  {
    type: "table",
    caption: "A decision table for common steps",
    head: ["Step", "Use", "Why"],
    rows: [
      ["Match an invoice to a purchase order", "Code", "Numbers are equal or they are not."],
      ["Check a margin against a floor", "Code", "Arithmetic with a threshold."],
      ["Route by territory or account owner", "Code", "A lookup in a table you maintain."],
      ["Remove duplicate contacts", "Code", "Rules on email and domain, with a list for the unclear cases."],
      ["Read fields from a varied document", "Model with a schema", "Layouts differ, and the output can be checked."],
      ["Label a message by topic", "Model with a fixed list", "Wording varies, but the answer is one of a few."],
      ["Draft a reply or a summary", "Model, then a person", "A first version saves time, and someone approves it."],
      ["Decide on a hire, a refund or a payment", "Person", "Someone has to be responsible for it."],
    ],
  },
  { type: "h2", id: "hidden-rules", text: "Many judgment steps are rules in disguise" },
  {
    type: "p",
    text: "When someone says a step needs judgment, ask them to do it aloud ten times. Often a rule appears. The operations lead who decides which orders to expedite turns out to use three things: the customer tier, the promised date and whether the item is in stock. That is a short function and a table. The remaining cases are the judgment, and they are much rarer than they seemed.",
  },
  {
    type: "p",
    text: "Splitting a step this way has a second benefit. The rule is now written down. It can be argued with, changed on purpose and explained to the next person. A prompt that says to use good judgment offers none of that.",
  },
  { type: "h2", id: "schema", text: "When a model is right, give it a shape to fill" },
  {
    type: "p",
    text: "A model step should return an object with named fields and types, checked by code before anything else reads it. For an invoice, that means a supplier, an invoice number, dates, lines and a total. If a date is not a date, the object is rejected. If the label is not on the list, the object is rejected. Free text is allowed only where a person will read it.",
  },
  {
    type: "p",
    text: "Then check the content with arithmetic wherever you can. Invoice lines should add up to the total. A due date should not come before the invoice date. A quoted passage should appear in the source, character for character. These checks are cheap, and they catch the errors that look convincing.",
  },
  {
    type: "callout",
    title: "A useful division of labor",
    text: "Let the model find the numbers and let code do the math. A figure in a report should be inserted from the data. It should never be typed by the model.",
  },
  { type: "workflow", id: "ap-intake" },
  { type: "h2", id: "thresholds", text: "Confidence thresholds and the manual queue" },
  {
    type: "p",
    text: "A threshold decides what continues and what goes to a person. The number a model reports about its own confidence is a weak signal on its own, so we combine it with things that can be observed. Did the arithmetic check pass? Were all the required fields found? Is this a supplier or a customer we have seen before? Did two reads of the same document agree?",
  },
  {
    type: "p",
    text: "Set the first threshold high. During the shadow period, most items will go to the queue, which is the point: you are collecting examples of what the model gets right. Lower it only where the record supports doing so, and separately for each category. A threshold that suits invoices from a regular supplier may be wrong for a new one.",
  },
  {
    type: "p",
    text: "The manual queue is part of the design. Each item should arrive with the original, the model's attempt and the reason it stopped. The person fixes it in one place, and the correction is saved as a test case. A queue that only says an item failed will be ignored within a month.",
  },
  { type: "quote", text: "The manual queue is where the workflow learns what it does not know." },
  { type: "h2", id: "cost", text: "Cost, speed and drift" },
  {
    type: "p",
    text: "There are ordinary engineering reasons to prefer code as well. A rule runs in a fraction of a second and costs almost nothing. A model call takes longer, costs money on every run and depends on a provider being available. Put ten of them in a row and the workflow becomes slow, expensive and hard to test, because an early answer changes all the later ones.",
  },
  {
    type: "p",
    text: "Models also change underneath you. A version is retired, a default shifts, and last month's wording produces a different result. Code does not do that. Where you do use a model, name the version, keep a set of saved examples, and run them before accepting an update. Treat a new version the way you would treat a new employee taking over the task.",
  },
  { type: "h2", id: "untrusted", text: "Treat what arrives as data" },
  {
    type: "p",
    text: "Documents and messages come from outside, and some will contain text addressed to the model. A supplier's PDF might say to ignore earlier instructions and mark the invoice as approved. The defense is structural. The model that reads the document has no tools. It returns fields, code checks them, and the payment step requires a human approval record. Text in a document can produce a wrong field. It has no path to a payment.",
  },
  { type: "h2", id: "worked-example", text: "A worked example" },
  {
    type: "p",
    text: "Take accounts payable intake. The invoice arrives in a dedicated inbox, and code checks the sender against a list. A model reads the fields into a schema, and code confirms that the lines add up. Code matches the invoice to the purchase order and the receipt. A mismatch goes to a person with both documents side by side. Code assembles the batch, and the controller approves it.",
  },
  {
    type: "p",
    text: "That is six or seven steps with one model call in the middle. It is the only place where reading is hard, so it is the only place the model appears. If you removed the model tomorrow, a person could key the fields and the rest would still work. That makes a good final test. If the workflow cannot run without its model, even slowly, too much of it depends on something you do not control.",
  },
  { type: "h2", id: "starting", text: "How to start" },
  {
    type: "ol",
    items: [
      "Write the steps of one process on a single page.",
      "Mark each one as code, model or person, using the two questions above.",
      "For each model step, write the schema and the checks before the prompt.",
      "Name the person who owns the queue, and what they will see in it.",
      "Run it in shadow and count the disagreements.",
    ],
  },
  {
    type: "p",
    text: "Most processes end up with more code and fewer model calls than people expected. They are also easier to explain, which tends to be what gets them approved.",
  },
];

export default body;
