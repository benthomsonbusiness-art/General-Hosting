import type { AppSlug, Glyph } from "../lib/logos.ts";

export type NodeKind = "trigger" | "deterministic" | "ai" | "human" | "output";

/** One app and the operation it performs. Drawn as the mono line "App: Operation". */
export type AppRef = {
  app: AppSlug | Glyph;
  operation: string;
  alternatives: string[];
};

/** A circle hanging off a spine card by a dashed line. */
export type Attachment = AppRef & {
  id: string;
  label: string;
  port: "model" | "memory" | "tools" | "calls";
  does: string;
  readOnly: boolean;
};

export type WorkflowNode = {
  id: string;
  label: string;
  kind: NodeKind;
  does: string;
  guardrail: string;
  failure: string;
  timingLabel: string;
  payload: string;
  audience?: "external" | "internal";
  gate?: {
    approver: string;
    channel: string;
    expiresAfter?: string;
    approveLabel?: string;
    rejectLabel?: string;
    rejectOutcome?: string;
    channelApp: AppSlug;
    operation: string;
  };
  confidence?: { threshold: number; belowThreshold: string };
  app?: AppRef;
  attached?: Attachment[];
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

const ALL_INDUSTRIES = ["gyms", "recruiting", "events", "landscaping", "plumbing", "appointments"];

function sample(value: Record<string, unknown>): string {
  return JSON.stringify({ _sample: true, ...value }, null, 2);
}

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
    alternatives: ["OpenAI"],
    does,
    readOnly: true,
  };
}

export const WORKFLOWS: Workflow[] = [
  define({
    id: "missed-call-text-back",
    title: "Missed call text-back",
    trigger: "Someone calls while you're coaching or with a client",
    outcome: "A text back in minutes with open times on your calendar",
    summary:
      "When you miss a call, the caller gets a text back in minutes with two times you're free. You approve the text from your phone with one tap, and the spot is held on your calendar.",
    metaDescription:
      "When you miss a call, the caller gets a text back in minutes with two open times on your calendar. You approve it from your phone in a single tap.",
    services: ["missed-calls"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "missed-call",
        label: "Missed call",
        kind: "trigger",
        app: { app: "callrail", operation: "Missed call", alternatives: ["Twilio", "Your business phone"] },
        does: "Catches every call you miss during a class, meeting or job, along with any voicemail.",
        guardrail: "Spam and blocked numbers are ignored.",
        failure: "If something is unclear, your team gets the number to call back.",
        timingLabel: "Right away",
        payload: sample({
          event: "call.missed",
          from: "+1 555 0142",
          at: "2026-06-02T18:15:00Z",
          voicemail: "Asking about intro strength class",
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
            label: "Check past visits",
            port: "tools",
            app: "hubspot",
            operation: "Find contact",
            alternatives: ["Calendly", "Jobber", "Greenhouse"],
            does: "Checks whether the caller is already a member, candidate or client.",
            readOnly: true,
          },
          {
            id: "open-slots",
            label: "See open times",
            port: "tools",
            app: "googlecalendar",
            operation: "Open",
            alternatives: ["Calendly", "Jobber"],
            does: "Finds two real open class or appointment times in the next couple of days.",
            readOnly: true,
          },
        ],
        does: "Reads the voicemail, checks your calendar, and drafts a short reply offering two open times.",
        guardrail: "Only offers times that are open on your calendar. Never sends anything itself.",
        failure: "If it can't tell what the caller wants, your team gets a note to call back.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.8, belowThreshold: "Your team gets the voicemail to call back. No text is sent." },
        payload: sample({
          inquiry: "Intro class",
          member: "new",
          draft: "Sorry we missed your call. We have intro spots tomorrow at 7 a.m. or 5:30 p.m. Which works?",
          confidence: 0.91,
        }),
      },
      {
        id: "office-approves",
        label: "You approve the text",
        kind: "human",
        does: "Sends the draft and voicemail summary to your phone so you can approve or edit in one tap.",
        guardrail: "Nothing goes to the caller until you tap Approve.",
        failure: "If nobody answers in 10 minutes, your team gets a heads-up to call back.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Owner or front desk",
          channel: "Phone notification with Approve and Edit",
          channelApp: "twilio",
          operation: "Approve reply",
          expiresAfter: "10 minutes, then flagged for a call",
        },
        payload: sample({ approval: "pending", options: ["approve", "edit", "call instead"] }),
      },
      {
        id: "text-back",
        label: "Text the caller",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Sends the approved text from your business number.",
        guardrail: "Only the exact text you approved is sent, once.",
        failure: "If delivery fails, your team gets the number to call.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0142", approved: true, sent: false }),
      },
      {
        id: "hold-visit",
        label: "Hold the spot",
        kind: "output",
        audience: "internal",
        app: { app: "googlecalendar", operation: "Hold", alternatives: ["Calendly", "Jobber"] },
        does: "Holds the offered slot on your calendar until they reply.",
        guardrail: "Unconfirmed holds clear after two hours so your schedule stays open.",
        failure: "If a hold fails, your front desk is notified.",
        timingLabel: "Seconds",
        payload: sample({ status: "held", times: ["tomorrow 7 a.m.", "tomorrow 5:30 p.m."], clears_in: "2h", sent: false }),
      },
    ],
  }),
  define({
    id: "web-lead-booking",
    title: "Instant booking for web leads",
    trigger: "Someone submits the form on your website",
    outcome: "A booked class, call or visit and a personal confirmation text",
    summary:
      "When someone fills out your website form, we check fit, match an open class, coach or calendar slot, and draft a reply. You approve it, they get their time, and the booking is on your calendar.",
    metaDescription:
      "When someone fills out your website form, we check fit, match an open class or calendar slot and draft the reply. You approve and the spot is booked.",
    services: ["instant-booking"],
    industries: ALL_INDUSTRIES,
    ownership: OWNED,
    nodes: [
      {
        id: "web-lead",
        label: "New form on your website",
        kind: "trigger",
        app: { app: "typeform", operation: "New inquiry", alternatives: ["Your website form", "Meta Ads"] },
        does: "Catches every trial, consult or quote form the moment it comes in.",
        guardrail: "Spam submissions are filtered out.",
        failure: "If a form field is broken, your inbox is alerted.",
        timingLabel: "Right away",
        payload: sample({ name: "J. Alvarez", phone: "+1 555 0177", goal: "6 a.m. strength trial" }),
      },
      {
        id: "area-check",
        label: "Check fit and availability",
        kind: "deterministic",
        app: { app: "code", operation: "Fit check", alternatives: [] },
        does: "Checks that the request matches your classes, services or open roles.",
        guardrail: "Plain rules you can adjust any time.",
        failure: "Requests needing a custom quote go straight to your inbox.",
        timingLabel: "Instant",
        stopLabel: "Needs custom reply: goes to your inbox",
        payload: sample({ fit: true, interest: "Trial session" }),
      },
      {
        id: "match-slot",
        label: "Match a coach and time",
        kind: "ai",
        attached: [
          claude("match-model"),
          {
            id: "find-customer",
            label: "Look up contact",
            port: "tools",
            app: "hubspot",
            operation: "Contact",
            alternatives: ["Greenhouse", "Airtable"],
            does: "Checks if this person has inquired or visited before.",
            readOnly: true,
          },
          {
            id: "capacity",
            label: "See open slots",
            port: "tools",
            app: "googlecalendar",
            operation: "Slots",
            alternatives: ["Calendly", "Jobber"],
            does: "Finds open class, screen or appointment times that fit their request.",
            readOnly: true,
          },
        ],
        does: "Picks the best open class or calendar slot and writes a friendly confirmation text.",
        guardrail: "Only offers times with open space. Never books or texts on its own.",
        failure: "If it isn't sure, your team gets the inquiry to reply.",
        timingLabel: "Seconds",
        confidence: {
          threshold: 0.8,
          belowThreshold: "Your team gets the lead to reply personally. Nothing is sent.",
        },
        payload: sample({ host: "Coach Maya", time: "Thu 6:00 a.m.", confidence: 0.88 }),
      },
      {
        id: "approve-booking",
        label: "You approve the booking",
        kind: "human",
        does: "Shows you the inquiry, chosen slot and drafted text in one place.",
        guardrail: "Nothing is booked or sent until you approve.",
        failure: "If nobody answers in 15 minutes, the inquiry is flagged for follow-up.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Owner or front desk",
          channel: "Message with Book, Edit and Call buttons",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "15 minutes, then flagged",
        },
        payload: sample({ approval: "pending", options: ["book", "edit", "call instead"] }),
      },
      {
        id: "confirm-text",
        label: "Text the confirmation",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Texts the client their confirmed time and what to bring.",
        guardrail: "Only the text you approved is sent.",
        failure: "If sending fails, your front desk is notified.",
        timingLabel: "Seconds",
        payload: sample({ to: "+1 555 0177", approved: true, sent: false }),
      },
      {
        id: "book-job",
        label: "Add to calendar",
        kind: "output",
        audience: "internal",
        app: { app: "googlecalendar", operation: "Book", alternatives: ["Calendly", "HubSpot", "Jobber"] },
        does: "Adds the booking to your class roster or calendar and logs the source.",
        guardrail: "Never creates duplicate contacts.",
        failure: "If calendar sync fails, it retries once and alerts your team.",
        timingLabel: "Seconds",
        payload: sample({ booking: "sample-201", host: "Coach Maya", time: "Thu 6:00 a.m.", source: "website" }),
      },
    ],
  }),
  define({
    id: "appointment-reminders",
    title: "Appointment reminders",
    trigger: "Every afternoon for tomorrow's classes and bookings",
    outcome: "Confirmed rosters, fewer no-shows, and open spots filled early",
    summary:
      "Every afternoon, tomorrow's class members and appointments get a friendly reminder text. You approve the batch first. Clients reply YES to confirm, and anyone needing to move opens their spot early.",
    metaDescription:
      "Every afternoon, tomorrow's class members and appointments get a reminder text. You approve the list once, replies mark confirmed and spots reopen.",
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
            label: "Get tomorrow's list",
            port: "calls",
            app: "googlecalendar",
            operation: "List",
            alternatives: ["Calendly", "Jobber", "Greenhouse"],
            does: "Reads every recurring class, intro session or appointment on tomorrow's calendar.",
            readOnly: true,
          },
        ],
        does: "Gathers tomorrow's recurring classes and booked appointments automatically.",
        guardrail: "Runs once a day.",
        failure: "If your calendar cannot be read, your team is alerted.",
        timingLabel: "Daily",
        payload: sample({ day: "2026-06-02", bookings: 18 }),
      },
      {
        id: "ready-check",
        label: "Check the roster",
        kind: "deterministic",
        app: { app: "code", operation: "Roster check", alternatives: [] },
        does: "Checks that each booking has a phone number, time and host.",
        guardrail: "Simple rules. Nothing is guessed.",
        failure: "Entries missing a phone number are listed for your front desk.",
        timingLabel: "Seconds",
        stopLabel: "Missing details: goes to front desk",
        payload: sample({ ready: 17, missing: 1 }),
      },
      {
        id: "write-visit-texts",
        label: "Write each reminder",
        kind: "ai",
        attached: [
          claude("reminder-text-model"),
          {
            id: "visit-notes",
            label: "Read booking notes",
            port: "tools",
            app: "googlesheets",
            operation: "Notes",
            alternatives: ["HubSpot", "Airtable"],
            does: "Reads first-timer notes like shoe size, intro waiver or meeting link.",
            readOnly: true,
          },
        ],
        does: "Writes a short reminder for each class or appointment with the time and any first-visit note.",
        guardrail: "Never changes a time. Never sends anything itself.",
        failure: "Falls back to your standard reminder template if needed.",
        timingLabel: "Seconds",
        confidence: { threshold: 0.85, belowThreshold: "Uses your standard reminder wording for you to review." },
        payload: sample({
          written: 17,
          example:
            "See you tomorrow at 6 a.m. for Strength with Coach Maya. Arrive 5 minutes early if it's your first class. Reply YES to confirm.",
        }),
      },
      {
        id: "approve-list",
        label: "You approve the list",
        kind: "human",
        does: "Shows tomorrow's roster and reminder count in one message.",
        guardrail: "No reminders go out until you approve.",
        failure: "If not approved by 6 p.m., reminders hold and send a gentle nudge.",
        timingLabel: "Waits for you",
        gate: {
          approver: "Owner or studio manager",
          channel: "One message with an Approve button",
          channelApp: "slack",
          operation: "Approve button",
          expiresAfter: "6 p.m., then holds",
        },
        payload: sample({ approval: "pending", bookings: 17 }),
      },
      {
        id: "send-reminders",
        label: "Text each person",
        kind: "output",
        audience: "external",
        app: { app: "twilio", operation: "Send SMS", alternatives: ["Your business texting line"] },
        does: "Sends each reminder and lets people reply YES to confirm or C to reschedule.",
        guardrail: "One reminder per booking. Opt-outs are respected.",
        failure: "Undelivered numbers are listed for follow-up.",
        timingLabel: "Minutes",
        payload: sample({ sent: false, approved: true, ask: "Reply YES to confirm or C to change" }),
      },
      {
        id: "update-board",
        label: "Update roster status",
        kind: "output",
        audience: "internal",
        app: { app: "googlesheets", operation: "Roster", alternatives: ["Google Calendar", "HubSpot"] },
        does: "Marks confirmed spots and flags reschedules early so waitlisted members can take the spot.",
        guardrail: "Never cancels or moves a booking without your say-so.",
        failure: "Alerts your front desk if a reply needs attention.",
        timingLabel: "Seconds",
        payload: sample({ confirmed: 16, wants_to_change: 1, sent: false }),
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
