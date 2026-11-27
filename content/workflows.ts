import type { AppSlug, Glyph } from "../lib/logos.ts";

export type NodeKind = "trigger" | "deterministic" | "ai" | "human" | "output";

/** One app and the operation it performs. Drawn as the mono line "App: Operation". */
export type AppRef = {
  /** Registry slug from lib/logos.ts, or a house glyph for code, schedules and webhooks. */
  app: AppSlug | Glyph;
  /** "New response", "Update contact". `${appName}: ${operation}` stays at or under 22 characters. */
  operation: string;
  /** Text version only, never drawn: "HubSpot (or Salesforce, Pipedrive)". */
  alternatives: string[];
};

/** A circle hanging off a spine card by a dashed line. */
export type Attachment = AppRef & {
  id: string;
  /** Verb-first, at most 24 characters. */
  label: string;
  /** model, memory and tools only on ai nodes. calls only on trigger and deterministic nodes. */
  port: "model" | "memory" | "tools" | "calls";
  does: string;
  /** Must be true on every ai-node attachment: the model never holds a write. */
  readOnly: boolean;
};

export type WorkflowNode = {
  id: string;
  /** Verb-first action, at most 28 characters. */
  label: string;
  kind: NodeKind;
  does: string;
  guardrail: string;
  failure: string;
  timingLabel: string;
  payload: string;
  /** Outputs only. "external" must sit downstream of a human node. */
  audience?: "external" | "internal";
  gate?: {
    approver: string;
    channel: string;
    expiresAfter?: string;
    approveLabel?: string;
    rejectLabel?: string;
    /** Completes the sentence "Rejected — …". */
    rejectOutcome?: string;
    /** The app where the person approves. Named in the mono line, never drawn on the gold card. */
    channelApp: AppSlug;
    /** Mono operation for the approval, e.g. "Approve button". */
    operation: string;
  };
  confidence?: { threshold: number; belowThreshold: string };
  /** Required on trigger, deterministic and output nodes. Absent on ai and human nodes. */
  app?: AppRef;
  attached?: Attachment[];
  /**
   * Exit stub text drawn above the card: on a rule step that can stop the item, or on an AI step
   * whose unsure path differs from the default "Unsure: goes to a person, nothing sent".
   */
  stopLabel?: string;
};

export type WorkflowEdge = {
  from: string;
  to: string;
  label?: string;
  branch?: "approved" | "rejected" | "low-confidence" | "expired";
};

export type Workflow = {
  id: string;
  title: string;
  trigger: string;
  outcome: string;
  summary: string;
  metaDescription: string;
  services: string[];
  industries: string[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  ownership: string;
};

/** Side branches a run can end on. They are not steps, so they live outside `nodes`. */
export const EXITS = {
  "exit-manual": "Manual queue",
  "exit-rejected": "Rejected",
  "exit-expired": "Expired",
} as const;

export type ExitId = keyof typeof EXITS;

export const NODE_KINDS: Record<NodeKind, string> = {
  trigger: "Trigger",
  deterministic: "Rule",
  ai: "AI",
  human: "Human in the loop",
  output: "Result",
};

const ALL_INDUSTRIES = ["hvac", "plumbing", "electrical", "roofing", "landscaping", "cleaning"];

function sample(value: Record<string, unknown>): string {
  return JSON.stringify({ _sample: true, ...value }, null, 2);
}

/** Linear edges, plus the branches every AI step and human gate carries. */
function edgesFor(nodes: WorkflowNode[]): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];
  nodes.forEach((node, index) => {
    const next = nodes[index + 1];
    if (next) {
      edges.push(
        node.gate
          ? { from: node.id, to: next.id, label: "Approved", branch: "approved" }
          : { from: node.id, to: next.id },
      );
    }
    if (node.kind === "ai") {
      edges.push({
        from: node.id,
        to: "exit-manual",
        label: "Low confidence",
        branch: "low-confidence",
      });
    }
    if (node.gate) {
      edges.push({ from: node.id, to: "exit-rejected", label: "Rejected", branch: "rejected" });
      edges.push({ from: node.id, to: "exit-expired", label: "Expired", branch: "expired" });
    }
  });
  return edges;
}

function define(workflow: Omit<Workflow, "edges">): Workflow {
  return { ...workflow, edges: edgesFor(workflow.nodes) };
}

const OWNED = "It runs in your own accounts. Everything we set up belongs to you.";

/** The model behind an AI step. Named "Claude" with no version: versions go stale on a page. */
function claude(
  id: string,
  does = "Reads only what this step hands it and answers in fixed fields. Its version is pinned in your code and tested before any update.",
): Attachment {
  return {
    id,
    label: "Claude",
    port: "model",
    app: "claude",
    operation: "Messages",
    alternatives: ["OpenAI", "Azure OpenAI"],
    does,
    readOnly: true,
  };
}

export const WORKFLOWS: Workflow[] = [
  define({
    id: "missed-call-text-back",
    title: "Missed call text-back",
    trigger: "A customer calls and nobody picks up",
    outcome: "A text back in minutes with times you're free",
    summary:
      "When you miss a call, the caller gets a text back in minutes with two times you're free. You approve the text from your phone with one tap, and the time is held on your calendar.",
    metaDescription:
      "When you miss a call, the caller gets a text back in minutes with two times you're free. You approve it from your phone, and the time is held on your calendar.",
    services: ["missed-calls"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "missed-call",
        label: "Missed call",
        kind: "trigger",
        app: { app: "callrail", operation: "Missed call", alternatives: ["RingCentral", "Your business phone"] },
        does: "Notices every call you miss, day or night, along with any voicemail.",
        guardrail: "Spam and blocked numbers are ignored.",
        failure: "If something is unclear, your office gets the number to call back.",
        timingLabel: "Right away",
        payload: sample({
          event: "call.missed",
          from: "+1 555 0142",
          at: "2026-06-02T18:12:00Z",
          voicemail: "AC not cooling",
        }),
      },
      {
        id: "draft-text",
        label: "Write a text back",
        kind: "ai",
        attached: [
          claude("text-model"),
          {
            id: "find-client",
            label: "Look up the caller",
            port: "tools",
            app: "jobber",
            operation: "Find client",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Checks if the caller is already a customer and where they live.",
            readOnly: true,
          },
          {
            id: "open-slots",
            label: "See open times",
            port: "tools",
            app: "jobber",
            operation: "Schedule",
            alternatives: ["ServiceTitan", "Housecall Pro", "Google Calendar"],
            does: "Finds two open times in the next couple of days.",
            readOnly: true,
          },
        ],
        does: "Listens to the voicemail, figures out what the job is, and writes a short, friendly text with two open times.",
        guardrail: "It can only offer times that are really open. It never sends anything itself.",
        failure: "If it can't tell what the caller needs, your office calls them back instead.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.8, belowThreshold: "Your office gets the details and calls back. No text is sent." },
        payload: sample({
          job: "AC repair",
          customer: "existing",
          draft: "Sorry we missed you. We can be there today 2 to 4 or tomorrow 8 to 10. Which works?",
          confidence: 0.91,
        }),
      },
      {
        id: "office-approves",
        label: "You approve the text",
        kind: "human",
        does: "Sends the text to your phone first, with the voicemail, so you can approve or change it.",
        guardrail: "Nothing goes to the customer until you tap Approve.",
        failure: "If nobody answers in 10 minutes, your on-call tech gets a heads-up to call.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Owner or office manager",
          channel: "A text with Approve and Edit buttons",
          channelApp: "twilio",
          operation: "Approve reply",
          expiresAfter: "10 minutes, then your on-call tech is told",
        },
        payload: sample({ approval: "pending", options: ["approve", "edit", "call instead"] }),
      },
      {
        id: "text-back",
        label: "Text the customer",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Sends the text you approved from your business number.",
        guardrail: "Only the text you approved is sent, once.",
        failure: "If it can't send, your office gets the number to call.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0142", approved: true, sent: false }),
      },
      {
        id: "hold-visit",
        label: "Hold the time slot",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Draft visit", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Holds both times on your calendar until the customer picks one.",
        guardrail: "Holds clear after two hours so your calendar stays clean.",
        failure: "If it can't hold the time, your office is told.",
        timingLabel: "Seconds",
        payload: sample({ status: "held", times: ["today 2-4", "tomorrow 8-10"], clears_in: "2h", sent: false }),
      },
    ],
  }),
  define({
    id: "web-lead-booking",
    title: "Instant booking for web leads",
    trigger: "Someone fills out the form on your website",
    outcome: "A booked job and a text telling the customer when you'll arrive",
    summary:
      "When someone fills out your website form, we check you serve their area, pick the right tech and an open time, and write a text. You approve it, the customer gets their time, and the job is booked.",
    metaDescription:
      "When someone fills out your website form, we check your area, pick a tech and an open time, and write a text. You approve it and the job is booked for you.",
    services: ["instant-booking"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "web-lead",
        label: "New form on your website",
        kind: "trigger",
        app: { app: "form", operation: "New request", alternatives: ["Google ads", "Facebook ads", "Typeform"] },
        does: "Catches every form the moment it comes in, even at night.",
        guardrail: "Spam is filtered out.",
        failure: "If a form is broken, your office is told.",
        timingLabel: "Right away",
        payload: sample({ name: "J. Alvarez", phone: "+1 555 0177", zip: "07960", job: "Water heater leaking" }),
      },
      {
        id: "area-check",
        label: "Check you serve the area",
        kind: "deterministic",
        app: { app: "code", operation: "Zip and job type", alternatives: [] },
        does: "Checks the zip code is in your service area and the job is work you do.",
        guardrail: "Simple rules you can change any time.",
        failure: "If the zip is missing, your office gets the lead.",
        timingLabel: "Instant",
        stopLabel: "Outside your area: goes to your office",
        payload: sample({ zip: "07960", in_area: true, job: "Water heater repair" }),
      },
      {
        id: "match-slot",
        label: "Pick a tech and a time",
        kind: "ai",
        attached: [
          claude("match-model"),
          {
            id: "find-customer",
            label: "Look up the customer",
            port: "tools",
            app: "servicetitan",
            operation: "Customer",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Checks if this person is already a customer.",
            readOnly: true,
          },
          {
            id: "tech-skills",
            label: "See who can do the job",
            port: "tools",
            app: "servicetitan",
            operation: "Techs",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Checks which techs do this kind of job.",
            readOnly: true,
          },
          {
            id: "capacity",
            label: "See open times",
            port: "tools",
            app: "servicetitan",
            operation: "Capacity",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Finds open times for those techs near the address.",
            readOnly: true,
          },
        ],
        does: "Picks the best tech and an open time, and writes the text to the customer.",
        guardrail: "It can only pick times that are really open. It never books or sends anything itself.",
        failure: "If it isn't sure, your office gets the lead to call.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "Your office gets the lead and calls. Nothing is booked or sent.",
        },
        payload: sample({ tech: "M. Ortiz", time: "Tue 10-12", confidence: 0.88 }),
      },
      {
        id: "csr-approves",
        label: "You approve the booking",
        kind: "human",
        does: "Shows you the lead, the tech, the time and the text in one message.",
        guardrail: "Nothing is booked or sent until you approve.",
        failure: "If nobody answers in 15 minutes, the lead is flagged so someone calls.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Front desk",
          channel: "A message with Book, Edit and Call instead buttons",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "15 minutes, then flagged for a call",
        },
        payload: sample({ approval: "pending", options: ["book", "edit", "call instead"] }),
      },
      {
        id: "confirm-text",
        label: "Text the customer the time",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Texts the customer their time and the tech's name.",
        guardrail: "Only the text you approved is sent.",
        failure: "If it can't send, your front desk is told.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0177", approved: true, sent: false }),
      },
      {
        id: "book-job",
        label: "Book the job",
        kind: "output",
        audience: "internal",
        app: { app: "servicetitan", operation: "Book job", alternatives: ["Jobber", "Housecall Pro"] },
        does: "Puts the job on your schedule and notes where the lead came from.",
        guardrail: "Never enters the same customer twice.",
        failure: "If booking fails, it tries once more, then tells your office.",
        timingLabel: "Seconds",
        payload: sample({ job: "sample-job-201", tech: "M. Ortiz", time: "Tue 10-12", source: "website" }),
      },
    ],
  }),
  define({
    id: "appointment-reminders",
    title: "Appointment reminders",
    trigger: "Every afternoon at 4 p.m.",
    outcome: "Tomorrow's customers reminded, and changes caught before you drive out",
    summary:
      "Every afternoon, each of tomorrow's customers gets a friendly reminder with their time and tech. You approve the list first. Customers reply YES to confirm, and anyone who needs to change is flagged for you.",
    metaDescription:
      "Every afternoon, tomorrow's customers get a reminder with their time and tech. You approve the list first, customers reply YES, and changes are flagged early.",
    services: ["reminders"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "daily-4pm",
        label: "Every day at 4 p.m.",
        kind: "trigger",
        app: { app: "clock", operation: "4 p.m. daily", alternatives: [] },
        attached: [
          {
            id: "tomorrow",
            label: "Get tomorrow's visits",
            port: "calls",
            app: "jobber",
            operation: "Visits",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Gets every visit on tomorrow's schedule.",
            readOnly: true,
          },
        ],
        does: "Starts the reminders at the same time every day.",
        guardrail: "Runs once a day.",
        failure: "If your schedule can't be read, your office is told.",
        timingLabel: "Daily",
        payload: sample({ day: "2026-06-02", visits: 14 }),
      },
      {
        id: "ready-check",
        label: "Check each visit",
        kind: "deterministic",
        app: { app: "code", operation: "Visit check", alternatives: [] },
        does: "Makes sure every visit has a phone number, an address, a tech and a time.",
        guardrail: "Simple rules. Nothing is guessed.",
        failure: "Visits missing details go on a list for your office.",
        timingLabel: "Seconds",
        stopLabel: "Missing details: goes to your office",
        payload: sample({ ready: 13, missing: 1 }),
      },
      {
        id: "write-visit-texts",
        label: "Write each reminder",
        kind: "ai",
        attached: [
          claude("reminder-text-model"),
          {
            id: "visit-notes",
            label: "Read the visit notes",
            port: "tools",
            app: "jobber",
            operation: "Visit notes",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Reads notes like a gate code or a dog in the yard.",
            readOnly: true,
          },
        ],
        does: "Writes a short reminder for each visit with the time, the tech's name and anything the customer should do first.",
        guardrail: "Never changes a time. It never sends anything itself.",
        failure: "If it gets stuck, it uses your standard reminder.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.85, belowThreshold: "That visit gets your standard reminder for you to check." },
        payload: sample({
          written: 13,
          example:
            "Marco arrives 8-10 tomorrow for your AC tune-up. Please clear a path to the unit. Reply YES to confirm.",
        }),
      },
      {
        id: "dispatcher-approves",
        label: "You approve the list",
        kind: "human",
        does: "Shows you tomorrow's list and the reminders in one message.",
        guardrail: "No reminders go out until you approve.",
        failure: "If not approved by 6 p.m., the reminders wait and you get a nudge.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Office manager",
          channel: "One message with an Approve button",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "6 p.m., then you get a nudge",
        },
        payload: sample({ approval: "pending", visits: 13 }),
      },
      {
        id: "send-reminders",
        label: "Text each customer",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Jobber reminders", "Your business texting line"] },
        does: "Texts each customer their reminder and asks them to reply YES to confirm or C to change.",
        guardrail: "One reminder per visit. People who opted out are skipped.",
        failure: "Texts that fail go on a list to call.",
        timingLabel: "Minutes",
        payload: sample({ sent: false, approved: true, ask: "Reply YES to confirm or C to change" }),
      },
      {
        id: "update-board",
        label: "Mark who confirmed",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Visit note", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Marks visits as confirmed when customers reply YES, and puts anyone who wants to change at the top of your list.",
        guardrail: "It never moves a visit by itself.",
        failure: "If it can't update a visit, your office is told.",
        timingLabel: "Seconds",
        payload: sample({ confirmed: 12, wants_to_change: 1, sent: false }),
      },
    ],
  }),
];

export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.id === id);
}

export function workflowsById(ids: string[]): Workflow[] {
  return ids.map(getWorkflow).filter((item): item is Workflow => item !== undefined);
}
