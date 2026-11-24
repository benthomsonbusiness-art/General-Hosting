import type { Block } from "./index.ts";

const body: Block[] = [
  {
    type: "p",
    text: "The first week of an audit is spent watching. The aim is to describe how the work is done today, accurately enough that two people who do it would both agree with the description. Automation comes later. This checklist covers the eight things we write down, with the questions that fill them in. You can use it without us.",
  },
  {
    type: "p",
    text: "Print it, choose one process, and work through it with the person who handles that process every day. A manager's account is useful too, but collect it second and compare the two. The differences are usually where the hours are.",
  },
  {
    type: "callout",
    title: "Before you start",
    text: "Pick a process with a clear beginning and end, such as a lead becoming a quote or an invoice becoming a payment. Follow five real items, including one that went wrong.",
  },
  { type: "h2", id: "processes", text: "1. Processes" },
  {
    type: "p",
    text: "Describe the path from trigger to finished record. Use the verbs people use. If someone says they bug the project manager, write that down, because it is a handoff with no system behind it.",
  },
  {
    type: "checklist",
    title: "For each process",
    items: [
      "What starts it, and where does the first record appear?",
      "What does finished look like, and who would notice if it never finished?",
      "Which steps are done by memory or habit?",
      "How many items pass through in a normal week, and in a bad one?",
      "Which step do people put off?",
    ],
  },
  { type: "h2", id: "systems", text: "2. Systems inventory" },
  {
    type: "p",
    text: "List every tool the item touches, including spreadsheets, shared inboxes and messaging groups. Those last three often hold the real state of the work.",
  },
  {
    type: "checklist",
    title: "For each system",
    items: [
      "Which fields does it own, and which does it only copy?",
      "Who administers it, and who pays for it?",
      "Can it be connected by API, export or webhook?",
      "Is there a test environment?",
      "When does the contract renew?",
    ],
  },
  { type: "h2", id: "handoffs", text: "3. Handoffs" },
  {
    type: "p",
    text: "A handoff is any point where the item waits for a different person or a different system. Record how the next person finds out. If the answer is that they check, the delay is however often they check.",
  },
  {
    type: "checklist",
    title: "For each handoff",
    items: [
      "Who gives it, and who receives it?",
      "How does the receiver know?",
      "What is retyped, copied or reformatted on the way?",
      "How long does it usually wait, and what is the longest wait anyone remembers?",
      "What happens if the receiver is out?",
    ],
  },
  { type: "h2", id: "exceptions", text: "4. Exception paths" },
  {
    type: "p",
    text: "Exceptions are where automations break, so they deserve as much time as the normal path. Ask for the last three strange ones. People remember them in detail.",
  },
  {
    type: "checklist",
    title: "For each exception",
    items: [
      "What was different about it?",
      "How was it noticed, and by whom?",
      "What did the person do, and where was that recorded?",
      "Does it have a rule, or was it decided fresh?",
      "How often does it happen in a month?",
    ],
  },
  { type: "h2", id: "owners", text: "5. Data owners" },
  {
    type: "p",
    text: "Every field that matters needs one owner and one source of truth. When two systems hold a customer's address, someone has to say which one is right. If nobody can, that is a finding.",
  },
  {
    type: "checklist",
    title: "For each important field",
    items: [
      "Which system is the source of truth?",
      "Who may change it?",
      "Who is told when it changes?",
      "What should happen when it is empty?",
      "Is it personal, financial or health information?",
    ],
  },
  { type: "h2", id: "access", text: "6. Credentials and access" },
  {
    type: "p",
    text: "Record who holds which keys. Do not collect the keys themselves. Shared logins, former employees and personal accounts used for company work all belong on this list, and they are worth fixing whether or not anything is automated.",
  },
  {
    type: "checklist",
    title: "For each system",
    items: [
      "Who has administrator access today?",
      "Are any logins shared, and by whom?",
      "Is two-step sign-in on?",
      "Which existing automations use this access, and who set them up?",
      "How would you revoke a credential, and how long would that take?",
    ],
  },
  { type: "h2", id: "hours", text: "7. The hours estimate" },
  {
    type: "p",
    text: "An hours estimate is only useful if someone can disagree with it. Write each input separately, so that a person who doubts one number can change it and see the result move.",
  },
  {
    type: "ul",
    items: [
      "**People:** how many touch this process in a normal week.",
      "**Hours:** what each spends on the manual parts only. Ask, then time a few items.",
      "**Loaded rate:** the cost of an hour including taxes and benefits.",
      "**Weeks:** use 48 to allow for holidays and slow periods.",
      "**Capture range:** the share of those hours a workflow might take on. Use a range and state that it is an assumption.",
    ],
  },
  {
    type: "p",
    text: "Multiply people by hours by weeks, apply the capture range, and round before applying the rate. Then write one more line: what those hours would be used for. Reclaimed time that nobody has a use for is a weak reason to build anything.",
  },
  { type: "h2", id: "risk", text: "8. Risk notes" },
  {
    type: "p",
    text: "Last, mark the points where a mistake would leave the building. These become the approval gates. They also decide the order of work, because a small, internal process is a better first build than a large one that writes to customers.",
  },
  {
    type: "checklist",
    title: "For each process",
    items: [
      "Which step sends something to a customer, supplier or candidate?",
      "Which step moves money or changes a commitment?",
      "Which step is covered by a law, a license or a contract term?",
      "What is the worst message it could send by mistake?",
      "How would you stop it, and who can do that today?",
      "How would the team run the process by hand for a day?",
    ],
  },
  { type: "workflow", id: "daily-brief" },
  { type: "h2", id: "ranking", text: "Turning the lists into an order" },
  {
    type: "p",
    text: "With the eight lists complete, ranking is mostly reading. Good first candidates happen often, follow rules, touch two or three systems that can be connected, and stay inside the company. Poor first candidates are rare, depend on one person's judgment, or run through a system with no way in.",
  },
  {
    type: "p",
    text: "Some findings need no automation at all. A field nobody uses can be deleted. A report nobody reads can be stopped. An approval that has never been refused can have its limit raised. We put those at the top of the roadmap, because they cost nothing to do and they make everything after them simpler.",
  },
  {
    type: "quote",
    text: "The best outcome for a step is often to delete it. Automating it comes second.",
  },
  {
    type: "p",
    text: "Finish by reading the map back to the people who do the work. When they stop correcting it, the first week is done.",
  },
];

export default body;
