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

const BOOKING = "booking-automation";

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

const OWNED = "It runs in your accounts. The code, logs, AI instructions and logins are yours.";

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
    outcome: "A text back within minutes, with real times to choose from",
    summary:
      "When a call goes unanswered, the caller is matched to your customer list and a text is drafted offering open times. The office approves it from a phone in one tap, and the visit is pencilled in.",
    metaDescription:
      "How a missed call becomes a booked visit: the caller is looked up, a text with open times is drafted, the office approves it in one tap, and the visit is held.",
    services: [BOOKING],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "missed-call",
        label: "Missed call",
        kind: "trigger",
        app: { app: "callrail", operation: "Missed call", alternatives: ["RingCentral", "Your phone system"] },
        does: "Picks up every unanswered call during and after hours, with the caller's number and any voicemail.",
        guardrail: "Spam and blocked numbers are filtered out before anything else happens.",
        failure: "If the call record is incomplete, the office is alerted with the number.",
        timingLabel: "On event",
        payload: sample({
          event: "call.missed",
          from: "+1 555 0142",
          at: "2026-06-02T18:12:00Z",
          voicemail: "AC not cooling",
        }),
      },
      {
        id: "draft-text",
        label: "Read the call, draft a text",
        kind: "ai",
        attached: [
          claude("text-model"),
          {
            id: "find-client",
            label: "Find the customer",
            port: "tools",
            app: "jobber",
            operation: "Find client",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Looks up the number in your customer list and reads past visits and the service address.",
            readOnly: true,
          },
          {
            id: "open-slots",
            label: "See open time slots",
            port: "tools",
            app: "jobber",
            operation: "Schedule",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Reads which arrival windows are open in the next two days.",
            readOnly: true,
          },
        ],
        does: "Reads the voicemail transcript, guesses the job type and urgency, and drafts a short text offering two open arrival windows.",
        guardrail: "Only real open windows can be offered. Nothing is sent from this step.",
        failure: "One retry on a bad answer, then the office gets the call details to handle by phone.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "The office gets the call details and calls back. Nothing is sent.",
        },
        payload: sample({
          job_type: "AC repair",
          urgency: "today",
          customer: "existing",
          draft: "Sorry we missed you. We can be there today 2 to 4 p.m. or tomorrow 8 to 10 a.m. Which works?",
          confidence: 0.91,
        }),
      },
      {
        id: "office-approves",
        label: "Office approves the text",
        kind: "human",
        does: "Sends the draft to the office manager's phone with the voicemail and customer history.",
        guardrail: "Nothing is sent without a tap. There is no automatic approval.",
        failure: "After 10 minutes with no answer, the on-call tech is alerted to call back.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Office manager",
          channel: "Text message with Approve and Edit",
          channelApp: "twilio",
          operation: "Approve reply",
          expiresAfter: "10 minutes, then the on-call tech is alerted",
        },
        payload: sample({
          approval: "pending",
          approver_role: "office_manager",
          options: ["approve", "edit", "call instead"],
        }),
      },
      {
        id: "text-back",
        label: "Text back with times",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Sends exactly the approved text from your business number.",
        guardrail: "Only the approved text is sent, once.",
        failure: "A failed send alerts the office with the number to call.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0142", approved_by: "office_manager", sent: false }),
      },
      {
        id: "hold-visit",
        label: "Pencil in the visit",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Draft visit", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Holds the offered windows on the schedule until the customer replies.",
        guardrail: "Holds expire after two hours so the board never fills with ghosts.",
        failure: "A failed hold alerts the dispatcher.",
        timingLabel: "Seconds",
        payload: sample({
          status: "held",
          windows: ["today 2-4 p.m.", "tomorrow 8-10 a.m."],
          expires_in: "2h",
          sent: false,
        }),
      },
    ],
  }),
  define({
    id: "web-lead-booking",
    title: "Web lead to booked job",
    trigger: "A homeowner fills in your website or ad form",
    outcome: "A booked job with the right tech and a confirmed arrival window",
    summary:
      "A new web or ad lead is checked against your service area, matched to a tech with the right skills and an open arrival window, and approved by a CSR. The customer gets the window by text and the job is booked.",
    metaDescription:
      "How a web or ad lead becomes a booked job: service area check, the right tech and arrival window chosen, CSR approval, a confirmation text and the job booked.",
    services: [BOOKING],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "web-lead",
        label: "New lead from your website",
        kind: "trigger",
        app: {
          app: "form",
          operation: "New request",
          alternatives: ["Google Local Services Ads", "Facebook lead ads", "Typeform"],
        },
        does: "Saves the lead to the log the moment it arrives, day or night.",
        guardrail: "Submissions that fail the spam check are logged and dropped.",
        failure: "A broken submission is stored and the office is told.",
        timingLabel: "On event",
        payload: sample({
          name: "J. Alvarez",
          phone: "+1 555 0177",
          zip: "07960",
          job: "Water heater leaking",
          source: "website",
        }),
      },
      {
        id: "area-check",
        label: "Check service area and job",
        kind: "deterministic",
        app: { app: "code", operation: "Zip and job type", alternatives: [] },
        does: "Checks the zip code against your service area and the job against the work you take.",
        guardrail: "Plain rules you can edit. Same input, same result.",
        failure: "A missing zip sends the lead to the office.",
        timingLabel: "Instant",
        stopLabel: "Outside service area: goes to office",
        payload: sample({ zip: "07960", in_area: true, job_type: "Water heater repair", trade: "plumbing" }),
      },
      {
        id: "match-slot",
        label: "Match a tech and window",
        kind: "ai",
        attached: [
          claude("match-model"),
          {
            id: "find-customer",
            label: "Find the customer",
            port: "tools",
            app: "servicetitan",
            operation: "Customer",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Checks whether this homeowner is already a customer or on a service plan.",
            readOnly: true,
          },
          {
            id: "tech-skills",
            label: "Read tech skills",
            port: "tools",
            app: "servicetitan",
            operation: "Techs",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads which techs are qualified for this job type.",
            readOnly: true,
          },
          {
            id: "capacity",
            label: "See open windows",
            port: "tools",
            app: "servicetitan",
            operation: "Capacity",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads open arrival windows for qualified techs near the address.",
            readOnly: true,
          },
        ],
        does: "Picks the best tech and arrival window for the job and drafts the confirmation text.",
        guardrail: "Can only choose windows that are open. Nothing is booked or sent from this step.",
        failure: "One retry, then the CSR gets the lead to book by phone.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.8, belowThreshold: "The CSR gets the lead and calls. Nothing is booked or sent." },
        payload: sample({ tech: "M. Ortiz", window: "Tue 10 a.m.-12 p.m.", member: false, confidence: 0.88 }),
      },
      {
        id: "csr-approves",
        label: "CSR approves the booking",
        kind: "human",
        does: "Shows the lead, the chosen tech and window, and the text to your customer service rep.",
        guardrail: "Nothing is booked or sent without a click.",
        failure: "If nobody answers in 15 minutes, the lead is flagged red on the board.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Customer service rep",
          channel: "Slack message with Book, Edit and Call instead",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "15 minutes, then flagged for a call",
        },
        payload: sample({ approval: "pending", approver_role: "csr", options: ["book", "edit", "call instead"] }),
      },
      {
        id: "confirm-text",
        label: "Text the arrival window",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["ServiceTitan texting", "Podium"] },
        does: "Sends the approved confirmation with the arrival window and the tech's name.",
        guardrail: "Only the approved text is sent.",
        failure: "A failed send alerts the CSR.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0177", approved_by: "csr", sent: false }),
      },
      {
        id: "book-job",
        label: "Book the job",
        kind: "output",
        audience: "internal",
        app: { app: "servicetitan", operation: "Book job", alternatives: ["Jobber", "Housecall Pro"] },
        does: "Books the job on the dispatch board with the source, so you know which ads produce work.",
        guardrail: "Matched on phone and address, so no customer is entered twice.",
        failure: "A failed booking retries once, then alerts the dispatcher.",
        timingLabel: "Seconds",
        payload: sample({ job: "sample-job-201", tech: "M. Ortiz", window: "Tue 10 a.m.-12 p.m.", source: "website" }),
      },
    ],
  }),
  define({
    id: "marketplace-leads",
    title: "Angi and Thumbtack leads",
    trigger: "A request arrives from a lead marketplace",
    outcome: "A fast, priced reply inside the app and the lead in your schedule",
    summary:
      "Marketplace leads go to whoever answers first. Each request is read, checked against your price ranges and open times, and a reply is drafted. The owner approves it from a phone and the lead lands in your field service software.",
    metaDescription:
      "How Angi and Thumbtack requests get a fast, priced reply: the job is read, checked against your price ranges and schedule, approved by the owner and logged.",
    services: [BOOKING],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "new-request",
        label: "New marketplace request",
        kind: "trigger",
        app: { app: "thumbtack", operation: "New request", alternatives: ["Angi", "HomeAdvisor", "Yelp"] },
        does: "Catches each new request as it arrives, with the job details the homeowner entered.",
        guardrail: "Duplicate requests from the same homeowner are merged.",
        failure: "If the request cannot be read, the owner gets a link to it.",
        timingLabel: "On event",
        payload: sample({
          request: "sample-req-310",
          job: "Replace two outlets, add GFCI",
          zip: "07962",
          when: "this week",
        }),
      },
      {
        id: "qualify",
        label: "Qualify and draft a reply",
        kind: "ai",
        attached: [
          claude("qualify-model"),
          {
            id: "price-ranges",
            label: "Read your price ranges",
            port: "tools",
            app: "notion",
            operation: "Get page",
            alternatives: ["Google Docs", "Your price book"],
            does: "Reads the price ranges you are willing to quote before a site visit.",
            readOnly: true,
          },
          {
            id: "schedule",
            label: "See open time slots",
            port: "tools",
            app: "jobber",
            operation: "Schedule",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Reads open windows this week.",
            readOnly: true,
          },
        ],
        does: "Decides whether the job fits, writes a short reply with a price range and two times, and notes anything to ask.",
        guardrail: "Only quotes ranges from your price list. Nothing is sent from this step.",
        failure: "One retry, then the owner gets the request to answer by hand.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.8, belowThreshold: "The owner gets the request to answer. Nothing is sent." },
        payload: sample({ fit: true, range: "$180-$260", times: ["Wed 9-11 a.m.", "Thu 1-3 p.m."], confidence: 0.86 }),
      },
      {
        id: "owner-approves",
        label: "Owner approves the reply",
        kind: "human",
        does: "Texts the draft to the owner with the request, the price range and the times.",
        guardrail: "Nothing goes out without a tap.",
        failure: "If nobody answers in 15 minutes, the owner gets a reminder.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Owner",
          channel: "Text message with Approve and Edit",
          channelApp: "twilio",
          operation: "Approve reply",
          expiresAfter: "15 minutes, then a reminder",
        },
        payload: sample({ approval: "pending", approver_role: "owner", options: ["approve", "edit", "pass"] }),
      },
      {
        id: "reply-in-app",
        label: "Reply inside the app",
        kind: "output",
        audience: "external",
        app: { app: "thumbtack", operation: "Reply", alternatives: ["Angi", "HomeAdvisor"] },
        does: "Posts the approved reply to the homeowner inside the marketplace.",
        guardrail: "Only the approved text is sent.",
        failure: "A failed send alerts the owner with a link to the request.",
        timingLabel: "Seconds",
        payload: sample({ request: "sample-req-310", approved_by: "owner", sent: false }),
      },
      {
        id: "add-request",
        label: "Add the lead to Jobber",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "New request", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Creates the request in your field service software with the source marked, so it stops living in an app.",
        guardrail: "Matched on phone and address, so no lead is entered twice.",
        failure: "A failed write alerts the owner.",
        timingLabel: "Seconds",
        payload: sample({ request: "sample-req-310", source: "thumbtack", status: "quoted" }),
      },
    ],
  }),
  define({
    id: "appointment-reminders",
    title: "Confirmations and reminders",
    trigger: "Every afternoon at 4 p.m.",
    outcome: "Tomorrow's visits confirmed, and changes caught before the truck rolls",
    summary:
      "Each afternoon tomorrow's visits are checked and a reminder is written for each one. The dispatcher approves the board, every customer gets a text asking them to reply YES, and the visits are marked.",
    metaDescription:
      "How tomorrow's visits get confirmed: each visit is checked, the dispatcher approves the board, customers reply to confirm, and replies update the schedule.",
    services: ["reminders-and-rescheduling"],
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
            label: "Tomorrow's visits",
            port: "calls",
            app: "jobber",
            operation: "Visits",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Reads every visit booked for tomorrow with its customer, address and window.",
            readOnly: true,
          },
        ],
        does: "Starts the reminder run at the same time every day.",
        guardrail: "Runs once a day. A second run the same day is skipped.",
        failure: "If the schedule cannot be read, the dispatcher is alerted.",
        timingLabel: "Daily",
        payload: sample({ run: "2026-06-02", visits: 14 }),
      },
      {
        id: "ready-check",
        label: "Check each visit is ready",
        kind: "deterministic",
        app: { app: "code", operation: "Readiness check", alternatives: [] },
        does: "Checks every visit has an address, a phone number, a tech and an arrival window.",
        guardrail: "Plain rules. Visits that fail are listed, never guessed.",
        failure: "Visits missing details go to the dispatcher's list.",
        timingLabel: "Seconds",
        stopLabel: "Missing details: goes to dispatcher",
        payload: sample({ ready: 13, missing: [{ visit: "sample-visit-9", field: "phone" }] }),
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
            does: "Reads the job type and any access notes, like a gate code or a pet.",
            readOnly: true,
          },
        ],
        does: "Writes a short reminder for each visit with the window, the tech's name and anything the customer should do first.",
        guardrail: "Never changes a time. Nothing is sent from this step.",
        failure: "Reminders it cannot write use your standard template.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.85,
          belowThreshold: "That visit gets your standard template for the dispatcher to check.",
        },
        payload: sample({
          written: 13,
          sample_text:
            "Marco arrives 8-10 a.m. tomorrow for your AC tune-up. Please clear access to the unit. Reply YES to confirm.",
        }),
      },
      {
        id: "dispatcher-approves",
        label: "Dispatcher approves board",
        kind: "human",
        does: "Shows tomorrow's board and the reminder text in one message.",
        guardrail: "No reminder goes out until the board is approved.",
        failure: "If not approved by 6 p.m., reminders wait and the owner is told.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Dispatcher",
          channel: "Slack summary with one Approve button",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "6 p.m., then the owner is told",
        },
        payload: sample({ approval: "pending", approver_role: "dispatcher", visits: 13 }),
      },
      {
        id: "send-reminders",
        label: "Text each customer",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Jobber reminders", "Podium"] },
        does: "Texts each customer their window and tech, and asks them to reply YES to confirm or R to reschedule.",
        guardrail: "One reminder per visit. Customers who opted out are skipped.",
        failure: "Failed texts are listed for a phone call.",
        timingLabel: "Minutes",
        payload: sample({
          sent: false,
          approved_by: "dispatcher",
          template: "Reply YES to confirm or R to reschedule",
        }),
      },
      {
        id: "update-board",
        label: "Mark reminders sent",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Visit note", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Notes on each visit that the reminder went out. YES replies mark it confirmed, and reschedule replies start the cancellation workflow.",
        guardrail: "It never moves a visit by itself.",
        failure: "A failed update alerts the dispatcher.",
        timingLabel: "Seconds",
        payload: sample({ noted: 13, sent: false }),
      },
    ],
  }),
  define({
    id: "cancellation-waitlist",
    title: "Cancellations and the waitlist",
    trigger: "A customer cancels or asks to reschedule by text",
    outcome: "The open slot offered to the next customer who can take it",
    summary:
      "When a customer cancels, the reply is read, the visit is found and your waitlist is ranked for who can take the slot. The dispatcher approves the swap, the slot is offered by text and the visit is moved.",
    metaDescription:
      "How a cancellation becomes a filled slot: the reply is read, the waitlist is ranked, the dispatcher approves the swap, and the open time is offered by text.",
    services: ["reminders-and-rescheduling"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "cancel-text",
        label: "Customer cancels by text",
        kind: "trigger",
        app: { app: "twilio", operation: "Reply received", alternatives: ["Jobber texting", "Podium"] },
        does: "Catches a cancel or reschedule reply to any reminder.",
        guardrail: "Only replies from numbers with a booked visit start a run.",
        failure: "An unmatched reply goes to the dispatcher.",
        timingLabel: "On event",
        payload: sample({ from: "+1 555 0123", text: "Can't make tomorrow, can we do next week?" }),
      },
      {
        id: "read-cancel",
        label: "Read the cancellation",
        kind: "ai",
        attached: [
          claude("cancel-model"),
          {
            id: "find-visit",
            label: "Find the visit",
            port: "tools",
            app: "jobber",
            operation: "Visits",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Finds the visit this customer is replying about.",
            readOnly: true,
          },
          {
            id: "waitlist",
            label: "Read the waitlist",
            port: "tools",
            app: "airtable",
            operation: "Waitlist",
            alternatives: ["Google Sheets", "Jobber requests"],
            does: "Reads customers who asked for an earlier time.",
            readOnly: true,
          },
        ],
        does: "Works out whether it is a cancel or a reschedule, which visit it is, and what times the customer asked for.",
        guardrail: "Nothing is moved or sent from this step.",
        failure: "One retry, then the dispatcher reads the reply.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.85, belowThreshold: "The dispatcher reads the reply. Nothing is moved." },
        payload: sample({ intent: "reschedule", visit: "sample-visit-44", asks_for: "next week", confidence: 0.93 }),
      },
      {
        id: "rank-waitlist",
        label: "Rank who can take the slot",
        kind: "deterministic",
        app: { app: "code", operation: "Rank waitlist", alternatives: [] },
        does: "Ranks waitlisted customers by distance, job length and how long they have waited.",
        guardrail: "Plain rules you can edit. Same input, same result.",
        failure: "If nobody fits, the slot is left open for new bookings.",
        timingLabel: "Instant",
        stopLabel: "Nobody fits: slot stays open",
        payload: sample({ slot: "Tue 8-10 a.m.", top: ["sample-cust-7", "sample-cust-12"] }),
      },
      {
        id: "dispatcher-swap",
        label: "Dispatcher approves the swap",
        kind: "human",
        does: "Shows the cancellation, the open slot and who it would be offered to.",
        guardrail: "No visit moves and no offer goes out without a click.",
        failure: "If nobody answers in 30 minutes, the slot is left open.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Dispatcher",
          channel: "Slack message with Approve and Pick someone else",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "30 minutes, then the slot stays open",
        },
        payload: sample({ approval: "pending", approver_role: "dispatcher" }),
      },
      {
        id: "offer-slot",
        label: "Offer the slot by text",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Jobber texting", "Podium"] },
        does: "Texts the next customer the earlier time and asks them to reply YES.",
        guardrail: "One offer at a time, so a slot is never promised twice.",
        failure: "No reply in an hour moves the offer to the next person, with approval.",
        timingLabel: "Seconds",
        payload: sample({ to: "sample-cust-7", slot: "Tue 8-10 a.m.", sent: false }),
      },
      {
        id: "move-visit",
        label: "Move the visit",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Reschedule", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Moves the cancelled visit to the customer's new time and logs the change.",
        guardrail: "Only the approved change is made.",
        failure: "A failed move alerts the dispatcher.",
        timingLabel: "Seconds",
        payload: sample({ visit: "sample-visit-44", from: "Tue 8-10 a.m.", to: "next Tue 1-3 p.m." }),
      },
    ],
  }),
  define({
    id: "estimate-follow-up",
    title: "Unsold estimate follow-up",
    trigger: "An estimate has been open for three days",
    outcome: "A personal follow-up on every open estimate, logged on the job",
    summary:
      "Open estimates are checked every morning. For each one still unsold after three days, a follow-up is drafted from the tech's notes and the options quoted. The comfort advisor approves it before it is sent.",
    metaDescription:
      "How open estimates get followed up: unsold ones are found, a personal note is drafted from the tech's notes, the advisor approves it, and it is logged.",
    services: ["follow-up-and-reviews"],
    industries: ["hvac", "plumbing", "electrical", "roofing"],
    ownership: OWNED,
    nodes: [
      {
        id: "open-estimate",
        label: "Estimate open three days",
        kind: "trigger",
        app: { app: "servicetitan", operation: "Estimate", alternatives: ["Jobber quotes", "Housecall Pro estimates"] },
        does: "Finds estimates that were presented three days ago and are still open.",
        guardrail: "Each estimate is followed up at most three times.",
        failure: "If estimates cannot be read, the sales manager is alerted.",
        timingLabel: "Daily",
        payload: sample({
          estimate: "sample-est-88",
          options: ["Repair $640", "New system $9,800"],
          presented: "3 days ago",
        }),
      },
      {
        id: "still-open",
        label: "Check it is still open",
        kind: "deterministic",
        app: { app: "code", operation: "Status check", alternatives: [] },
        does: "Skips estimates already sold, declined or with a follow-up booked.",
        guardrail: "Plain rules. A sold job is never chased.",
        failure: "Unclear statuses go to the sales manager.",
        timingLabel: "Instant",
        stopLabel: "Sold or declined: nothing sent",
        payload: sample({ estimate: "sample-est-88", status: "open", follow_ups: 0 }),
      },
      {
        id: "draft-follow-up",
        label: "Draft a follow-up",
        kind: "ai",
        attached: [
          claude("follow-model"),
          {
            id: "read-estimate",
            label: "Read the estimate",
            port: "tools",
            app: "servicetitan",
            operation: "Options",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads the options quoted and their prices.",
            readOnly: true,
          },
          {
            id: "tech-notes",
            label: "Read the tech's notes",
            port: "tools",
            app: "servicetitan",
            operation: "Notes",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads what the tech saw and what the homeowner cared about.",
            readOnly: true,
          },
        ],
        does: "Writes a short, personal follow-up that mentions what the homeowner cared about and offers a time to talk.",
        guardrail: "Never changes a price or invents a discount. Nothing is sent from this step.",
        failure: "One retry, then the advisor writes it.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.8, belowThreshold: "The advisor writes the follow-up. Nothing is sent." },
        payload: sample({
          draft: "Hi Dana, any questions on the two options? Happy to walk through financing.",
          confidence: 0.87,
        }),
      },
      {
        id: "advisor-approves",
        label: "Comfort advisor approves",
        kind: "human",
        does: "Shows the estimate, the notes and the draft to the advisor who ran the call.",
        guardrail: "Nothing is sent without a click.",
        failure: "If not approved by end of day, the follow-up waits until tomorrow.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Comfort advisor",
          channel: "Slack message with Approve, Edit and Skip",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "End of day",
        },
        payload: sample({ approval: "pending", approver_role: "comfort_advisor" }),
      },
      {
        id: "send-follow-up",
        label: "Send the follow-up",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Gmail", "ServiceTitan texting"] },
        does: "Sends the approved follow-up by text, or email if the customer prefers it.",
        guardrail: "Only the approved text is sent.",
        failure: "A failed send alerts the advisor.",
        timingLabel: "Seconds",
        payload: sample({ estimate: "sample-est-88", approved_by: "comfort_advisor", sent: false }),
      },
      {
        id: "log-follow-up",
        label: "Log it on the estimate",
        kind: "output",
        audience: "internal",
        app: { app: "servicetitan", operation: "Note", alternatives: ["Jobber", "Housecall Pro"] },
        does: "Logs the follow-up on the estimate and sets the next check date.",
        guardrail: "The log names who approved it.",
        failure: "A failed write alerts the sales manager.",
        timingLabel: "Seconds",
        payload: sample({ estimate: "sample-est-88", follow_ups: 1, next_check: "in 4 days" }),
      },
    ],
  }),
  define({
    id: "review-requests",
    title: "Review requests after the job",
    trigger: "A job is marked complete",
    outcome: "Happy customers asked for a review, unhappy ones flagged to you first",
    summary:
      "When a job is marked complete, it is checked for callbacks and payment, a thank-you is drafted, and the tech confirms the customer was happy before the review link is texted. Anything unhappy goes to the owner.",
    metaDescription:
      "How finished jobs turn into reviews: callbacks and unpaid jobs are skipped, the tech confirms a happy customer, a review link is sent and complaints reach you.",
    services: ["follow-up-and-reviews"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "job-complete",
        label: "Job marked complete",
        kind: "trigger",
        app: { app: "jobber", operation: "Job completed", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Starts when the tech closes out the job on their phone.",
        guardrail: "One run per job.",
        failure: "If the job cannot be read, the office is told.",
        timingLabel: "On event",
        payload: sample({ job: "sample-job-512", tech: "R. Chen", type: "Drain cleaning" }),
      },
      {
        id: "job-checks",
        label: "Check job and invoice",
        kind: "deterministic",
        app: { app: "code", operation: "Job checks", alternatives: [] },
        does: "Skips callbacks, unpaid invoices and customers asked in the last six months.",
        guardrail: "Plain rules you can edit.",
        failure: "Unclear jobs go to the office.",
        timingLabel: "Instant",
        stopLabel: "Callback or unpaid: no request",
        payload: sample({ callback: false, paid: true, asked_recently: false }),
      },
      {
        id: "draft-thanks",
        label: "Draft a thank-you",
        kind: "ai",
        attached: [
          claude("review-model"),
          {
            id: "job-summary",
            label: "Read the job summary",
            port: "tools",
            app: "jobber",
            operation: "Job summary",
            alternatives: ["ServiceTitan", "Housecall Pro"],
            does: "Reads what was done and the tech's name.",
            readOnly: true,
          },
        ],
        does: "Writes a short thank-you that names the tech and the job, with your review link.",
        guardrail: "Never offers anything in exchange for a review. Nothing is sent from this step.",
        failure: "Falls back to your standard thank-you text.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.85, belowThreshold: "The office checks the text first. Nothing is sent." },
        payload: sample({
          draft: "Thanks for having Rick out to clear your drain today. Would you leave us a quick Google review?",
          confidence: 0.92,
        }),
      },
      {
        id: "tech-confirms",
        label: "Tech confirms happy customer",
        kind: "human",
        does: "Texts the tech one question: was the customer happy with the visit?",
        guardrail: "No request goes out unless the tech says yes.",
        failure: "No answer in two hours means no request.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Technician",
          channel: "Text message with Yes and No",
          channelApp: "twilio",
          operation: "Yes or No",
          expiresAfter: "2 hours, then no request",
        },
        payload: sample({ approval: "pending", approver_role: "technician" }),
      },
      {
        id: "send-review-link",
        label: "Text the review link",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Podium", "NiceJob"] },
        does: "Sends the approved thank-you with your Google review link.",
        guardrail: "Never offers anything in exchange for a review.",
        failure: "A failed send is logged.",
        timingLabel: "Seconds",
        payload: sample({ job: "sample-job-512", approved_by: "technician", sent: false }),
      },
      {
        id: "alert-owner",
        label: "Log the request",
        kind: "output",
        audience: "internal",
        app: { app: "jobber", operation: "Job note", alternatives: ["ServiceTitan", "Housecall Pro"] },
        does: "Logs the request on the job. Any reply that sounds unhappy is sent to the owner, so you can call before a bad review.",
        guardrail: "Internal only. Replies are never answered automatically.",
        failure: "A failed write alerts the office.",
        timingLabel: "Seconds",
        payload: sample({ job: "sample-job-512", requested: true, sent: false }),
      },
    ],
  }),
  define({
    id: "maintenance-reminders",
    title: "Tune-up and service plan reminders",
    trigger: "The first of every month",
    outcome: "Every plan member and past customer due for service reminded, with times held",
    summary:
      "Each month the customers due for a tune-up or plan visit are found, a reminder is written from their service history, and the office approves the batch. Reminders go out and tune-up slots are held for them.",
    metaDescription:
      "How tune-ups fill the slow season: plan members due for service are found, reminders are written from their history, the office approves, and slots are held.",
    services: ["follow-up-and-reviews"],
    industries: ["hvac", "plumbing", "landscaping", "cleaning"],
    ownership: OWNED,
    nodes: [
      {
        id: "monthly",
        label: "First of every month",
        kind: "trigger",
        app: { app: "clock", operation: "Monthly", alternatives: [] },
        attached: [
          {
            id: "plans-due",
            label: "Find plans coming due",
            port: "calls",
            app: "servicetitan",
            operation: "Plans",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads service plan members and past customers due for a visit in the next 30 days.",
            readOnly: true,
          },
        ],
        does: "Starts the reminder run on the first of the month.",
        guardrail: "Runs once a month.",
        failure: "If plans cannot be read, the office is alerted.",
        timingLabel: "Monthly",
        payload: sample({ run: "2026-09-01", due: 42 }),
      },
      {
        id: "due-list",
        label: "Build the due list",
        kind: "deterministic",
        app: { app: "code", operation: "Due list", alternatives: [] },
        does: "Removes anyone already booked, opted out or with an open complaint.",
        guardrail: "Plain rules you can edit.",
        failure: "Unclear records go to the office.",
        timingLabel: "Seconds",
        payload: sample({ due: 42, removed: 5, list: 37 }),
      },
      {
        id: "write-reminders",
        label: "Write each reminder",
        kind: "ai",
        attached: [
          claude("reminder-model"),
          {
            id: "history",
            label: "Read past visits",
            port: "tools",
            app: "servicetitan",
            operation: "History",
            alternatives: ["Jobber", "Housecall Pro"],
            does: "Reads the last visit, the equipment and the tech who went out.",
            readOnly: true,
          },
        ],
        does: "Writes a short reminder for each customer that names their equipment and last visit, with two times to pick from.",
        guardrail: "Only offers times that are open. Nothing is sent from this step.",
        failure: "Reminders it cannot write go to the office.",
        timingLabel: "Minutes",
        confidence: { threshold: 0.8, belowThreshold: "That reminder goes to the office to write. It is not sent." },
        payload: sample({
          written: 37,
          sample_text: "Your furnace tune-up is due. We have Tue 9-11 or Thu 1-3. Reply 1 or 2.",
        }),
      },
      {
        id: "office-batch",
        label: "Office approves the batch",
        kind: "human",
        does: "Shows a sample of the reminders and the full list in one message.",
        guardrail: "Nothing is sent until the batch is approved.",
        failure: "If not approved in two days, the run is cancelled.",
        timingLabel: "Waits for a person",
        gate: {
          approver: "Office manager",
          channel: "Slack message with Approve and Review list",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "2 days, then cancelled",
        },
        payload: sample({ approval: "pending", approver_role: "office_manager", count: 37 }),
      },
      {
        id: "send-reminders-batch",
        label: "Text the reminders",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Gmail", "ServiceTitan marketing"] },
        does: "Sends each approved reminder, spread over the morning so the phones are not swamped.",
        guardrail: "Opted-out customers are never texted.",
        failure: "Failed sends are listed for a call.",
        timingLabel: "Hours",
        payload: sample({ sent: false, approved_by: "office_manager", count: 37 }),
      },
      {
        id: "hold-slots",
        label: "Hold tune-up slots",
        kind: "output",
        audience: "internal",
        app: { app: "servicetitan", operation: "Book job", alternatives: ["Jobber", "Housecall Pro"] },
        does: "Holds the offered times and books them as customers reply.",
        guardrail: "Holds release after 48 hours.",
        failure: "A failed hold alerts the dispatcher.",
        timingLabel: "Seconds",
        payload: sample({ held: 74, release_after: "48h" }),
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
