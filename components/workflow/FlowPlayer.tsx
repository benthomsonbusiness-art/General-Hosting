"use client";

import { ArrowRight, CalendarCheck, Check, Globe, PhoneMissed, RotateCcw, UserCheck } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { Workflow } from "@/content/workflows";

type ArtifactSlot = {
  time: string;
  label: string;
  open?: boolean;
};

type StoryBeat = {
  stepTitle: string;
  time: string;
  narrative: string;
  quote?: string;
  result?: string;
  activeNodes: string[];
  awaitingNode?: string;
  artifact:
    | { kind: "trigger"; badge: string; headline: string; sub: string; wave?: boolean }
    | { kind: "slots"; badge: string; slots: ArtifactSlot[] }
    | { kind: "gate"; badge: string; channel: string; preview: string }
    | { kind: "booked"; badge: string; person: string; session: string; detail: string; filled: number };
};

const STORIES: Record<string, StoryBeat[]> = {
  "missed-call-text-back": [
    {
      stepTitle: "1. Call missed",
      time: "6:15 p.m.",
      narrative:
        "Jordan calls your gym asking about a trial workout while coaches are leading the evening class. Instead of hitting a dead voicemail, the call is picked up right away.",
      activeNodes: ["missed-call"],
      artifact: {
        kind: "trigger",
        badge: "Incoming call",
        headline: "Jordan M. · (973) 555-0148",
        sub: "Voicemail captured during 6:00 p.m. class",
        wave: true,
      },
    },
    {
      stepTitle: "2. Reply drafted",
      time: "6:15 p.m.",
      narrative:
        "Checks your class calendar, sees two open intro spots tomorrow, and writes a plain text reply ready for you to check.",
      quote: "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to grab one.”",
      activeNodes: ["draft-text"],
      artifact: {
        kind: "slots",
        badge: "Calendar scan",
        slots: [
          { time: "6:00 a.m.", label: "Strength · Full" },
          { time: "7:00 a.m.", label: "Intro spot open", open: true },
          { time: "5:30 p.m.", label: "Intro spot open", open: true },
        ],
      },
    },
    {
      stepTitle: "3. You approve",
      time: "6:16 p.m.",
      narrative:
        "Between sets, your phone shows the voicemail and the drafted text. Nothing goes to Jordan until you tap Approve.",
      quote: "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to grab one.”",
      activeNodes: ["office-approves"],
      awaitingNode: "office-approves",
      artifact: {
        kind: "gate",
        badge: "Human gate",
        channel: "Owner phone",
        preview: "Tap Approve to send from your business number.",
      },
    },
    {
      stepTitle: "4. Spot booked",
      time: "6:18 p.m.",
      narrative:
        "The text goes out, Jordan replies “2”, and tomorrow's 5:30 p.m. spot is held on your roster with class reminders ready.",
      result: "Booked: Jordan M. · Tomorrow 5:30 p.m. Strength Intro",
      activeNodes: ["text-back", "hold-visit"],
      artifact: {
        kind: "booked",
        badge: "Roster locked",
        person: "Jordan M.",
        session: "Tomorrow · 5:30 p.m. Strength Intro",
        detail: "Coach Maya · Reminder scheduled",
        filled: 10,
      },
    },
  ],
  "web-lead-booking": [
    {
      stepTitle: "1. Form comes in",
      time: "9:40 p.m.",
      narrative:
        "Someone fills out the intro or consult form on your website at night while comparing three local options.",
      activeNodes: ["web-lead", "area-check"],
      artifact: {
        kind: "trigger",
        badge: "Website form",
        headline: "J. Alvarez · Intro session",
        sub: "Morning sessions · Fit check passed",
      },
    },
    {
      stepTitle: "2. Time matched",
      time: "9:40 p.m.",
      narrative:
        "Checks that the request fits what you offer, finds open slots on the right coach or recruiter's calendar, and writes the reply.",
      quote: "“Thanks for reaching out. We have Thursday at 6 a.m. or Friday at 12 p.m. open for your first session. Which works?”",
      activeNodes: ["match-slot"],
      artifact: {
        kind: "slots",
        badge: "Matched times",
        slots: [
          { time: "Wed · 6 a.m.", label: "Booked" },
          { time: "Thu · 6 a.m.", label: "Open for intro", open: true },
          { time: "Fri · 12 p.m.", label: "Open for intro", open: true },
        ],
      },
    },
    {
      stepTitle: "3. You approve",
      time: "7:05 a.m.",
      narrative:
        "You see the inquiry, the matched slot, and the text in one message. One tap sends it, or you can edit first.",
      quote: "“Thanks for reaching out. We have Thursday at 6 a.m. or Friday at 12 p.m. open for your first session. Which works?”",
      activeNodes: ["approve-booking"],
      awaitingNode: "approve-booking",
      artifact: {
        kind: "gate",
        badge: "Human gate",
        channel: "Morning queue",
        preview: "Inquiry notes + two matched times ready to send.",
      },
    },
    {
      stepTitle: "4. Added to calendar",
      time: "7:12 a.m.",
      narrative:
        "They confirm Thursday at 6 a.m. The booking lands directly on your calendar with their form notes attached.",
      result: "Booked: J. Alvarez · Thursday 6:00 a.m. · Source: Website form",
      activeNodes: ["confirm-text", "book-job"],
      artifact: {
        kind: "booked",
        badge: "Calendar updated",
        person: "J. Alvarez",
        session: "Thursday · 6:00 a.m. First Session",
        detail: "Form notes attached to invite",
        filled: 9,
      },
    },
  ],
  "appointment-reminders": [
    {
      stepTitle: "1. Roster pulled",
      time: "4:00 p.m.",
      narrative:
        "Every afternoon, tomorrow's recurring classes, intro sessions, and client appointments are gathered from your calendar.",
      activeNodes: ["daily-4pm", "ready-check"],
      artifact: {
        kind: "trigger",
        badge: "Daily 4:00 p.m.",
        headline: "Tomorrow's 18 spots gathered",
        sub: "Strength · Reformer · New member consults",
      },
    },
    {
      stepTitle: "2. Reminders written",
      time: "4:01 p.m.",
      narrative:
        "Writes a short reminder for each person with their class time, coach, and any first-visit note.",
      quote: "“See you tomorrow at 6 a.m. for Strength with Coach Maya. Reply YES to confirm or C if you need to move.”",
      activeNodes: ["write-visit-texts"],
      artifact: {
        kind: "slots",
        badge: "18 drafts ready",
        slots: [
          { time: "6:00 a.m.", label: "Strength · 12 members", open: true },
          { time: "9:30 a.m.", label: "Intro · 2 bookings", open: true },
          { time: "5:30 p.m.", label: "Conditioning · 4 spots", open: true },
        ],
      },
    },
    {
      stepTitle: "3. You approve once",
      time: "4:05 p.m.",
      narrative:
        "Instead of texting 18 people one by one, you review tomorrow's list in a single message and approve the whole batch.",
      activeNodes: ["approve-list"],
      awaitingNode: "approve-list",
      artifact: {
        kind: "gate",
        badge: "Batch approval",
        channel: "18 reminders",
        preview: "Approve tomorrow's full class & client list in one tap.",
      },
    },
    {
      stepTitle: "4. Class stays full",
      time: "4:20 p.m.",
      narrative:
        "17 members reply YES. One asks to move to Friday, opening their 6 a.m. spot early enough for someone on the waitlist.",
      result: "Roster updated: 17 confirmed · 1 spot reopened for waitlist",
      activeNodes: ["send-reminders", "update-board"],
      artifact: {
        kind: "booked",
        badge: "Class full",
        person: "17 confirmed by text",
        session: "1 moved to Friday · Waitlist notified",
        detail: "Zero morning surprise no-shows",
        filled: 10,
      },
    },
  ],
};

const MINI_BARS = [8, 16, 24, 14, 26, 18, 12, 22, 16, 10, 18, 12];
const METER_CELLS = Array.from({ length: 10 }, (_, i) => i);

function StoryArtifact({
  artifact,
  onApprove,
}: {
  artifact: StoryBeat["artifact"];
  onApprove: () => void;
}) {
  if (artifact.kind === "trigger") {
    return (
      <div className="rounded-[10px] border border-[rgb(251_246_241_/_0.14)] bg-[#0b0604] p-4 shadow-[inset_0_1px_0_rgb(251_246_241_/_0.06)]">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-gold">
            <span aria-hidden className="pulse-dot h-2 w-2 rounded-full bg-gold" />
            {artifact.badge}
          </span>
          {artifact.wave ? (
            <PhoneMissed aria-hidden size={14} className="text-gold" />
          ) : (
            <Globe aria-hidden size={14} className="text-muted" />
          )}
        </div>
        <p className="mt-2.5 text-[15px] font-semibold text-ivory">{artifact.headline}</p>
        <p className="mt-1 text-[13px] text-muted">{artifact.sub}</p>
        {artifact.wave ? (
          <div className="mt-3 flex h-7 items-center gap-1 rounded-[6px] border border-[rgb(251_246_241_/_0.07)] bg-[#130b07] px-3" aria-hidden>
            {MINI_BARS.map((h, idx) => (
              <span
                key={idx}
                className="wave-bar flex-1 rounded-full bg-[linear-gradient(180deg,#fde047,#f97316)]"
                data-live="true"
                style={{ height: `${h}px`, animationDelay: `${(idx % 5) * 140}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (artifact.kind === "slots") {
    return (
      <div className="rounded-[10px] border border-[rgb(253_224_71_/_0.28)] bg-[#0c0705] p-4 shadow-[inset_0_1px_0_rgb(253_224_71_/_0.12)]">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-cyan">
            <span aria-hidden className="h-2 w-2 rounded-full bg-cyan" />
            {artifact.badge}
          </span>
          <span className="font-mono text-[11px] text-muted">Read-only</span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {artifact.slots.map((slot) => (
            <li
              key={slot.time}
              className={`flex items-center justify-between gap-2 rounded-[6px] border px-2.5 py-1.5 text-[12.5px] ${
                slot.open
                  ? "border-[rgb(253_224_71_/_0.38)] bg-[rgb(253_224_71_/_0.08)] text-ivory"
                  : "border-[rgb(251_246_241_/_0.08)] bg-[rgb(251_246_241_/_0.02)] text-muted"
              }`}
            >
              <span className="font-mono text-[11.5px]">{slot.time}</span>
              <span className={slot.open ? "font-medium text-cyan" : "text-muted"}>{slot.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (artifact.kind === "gate") {
    return (
      <div className="rounded-[10px] border border-[rgb(255_107_74_/_0.42)] bg-[linear-gradient(180deg,#20120c,#0e0805)] p-4 shadow-[0_0_28px_-8px_rgb(255_107_74_/_0.35)]">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-mono text-gold-hi">
            <UserCheck aria-hidden size={14} className="text-gold" />
            {artifact.badge}
          </span>
          <span className="font-mono text-[11px] text-muted">{artifact.channel}</span>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-snug text-ivory">{artifact.preview}</p>
        <button
          type="button"
          onClick={onApprove}
          className="copper-key mt-3 min-h-9 w-full px-3 py-1.5 text-[13px] font-semibold"
        >
          <span>Tap to approve</span>
          <ArrowRight aria-hidden size={14} strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-[rgb(255_107_74_/_0.45)] bg-[linear-gradient(180deg,#22130d,#0d0705)] p-4">
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <span className="inline-flex items-center gap-1.5 font-mono font-medium text-gold-hi">
          <CalendarCheck aria-hidden size={14} className="text-gold" />
          {artifact.badge}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(255_107_74_/_0.18)] px-2 py-0.5 font-mono text-[11px] text-ivory">
          <Check aria-hidden size={11} strokeWidth={2.5} className="text-gold" />
          Live
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-ivory">{artifact.person}</p>
      <p className="text-[13px] text-ivory">{artifact.session}</p>
      <p className="mt-0.5 text-[12px] text-muted">{artifact.detail}</p>
      <div className="mt-3 grid grid-cols-10 gap-1" aria-hidden>
        {METER_CELLS.map((idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-[2px] ${
              idx === artifact.filled - 1
                ? "bg-gold shadow-[0_0_8px_#ff6b4a]"
                : idx < artifact.filled
                  ? "bg-[rgb(253_224_71_/_0.68)]"
                  : "bg-[rgb(251_246_241_/_0.12)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Story-driven walkthrough paired with the server-rendered FlowDiagram.
 * Stepping through the 4 story beats illuminates matching workflow nodes and renders a live visual preview.
 */
export function FlowPlayer({
  workflow,
  children,
}: {
  workflow: Workflow;
  children: ReactNode;
}) {
  const beats = STORIES[workflow.id] ?? STORIES["missed-call-text-back"];
  const [step, setStep] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const current = beats[step] ?? beats[0];
  const isLast = step === beats.length - 1;
  const isGate = Boolean(current.awaitingNode);
  const progressRatio = (step + 1) / beats.length;

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;
    const activeIds = new Set(current.activeNodes);
    const allNodeIds = workflow.nodes.map((n) => n.id);
    const maxActiveIdx = Math.max(
      ...current.activeNodes.map((id) => allNodeIds.indexOf(id)).filter((idx) => idx >= 0),
    );

    const items = container.querySelectorAll<HTMLElement>(".flow-item[data-node-id]");
    items.forEach((item) => {
      const nodeId = item.dataset.nodeId;
      if (!nodeId) return;
      const idx = allNodeIds.indexOf(nodeId);
      if (current.awaitingNode === nodeId) {
        item.dataset.runState = "awaiting";
      } else if (activeIds.has(nodeId)) {
        item.dataset.runState = "active";
      } else if (idx >= 0 && idx < maxActiveIdx) {
        item.dataset.runState = "complete";
      } else {
        delete item.dataset.runState;
      }
    });
  }, [current, workflow.nodes]);

  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const clickedItem = target?.closest<HTMLElement>(".flow-item[data-node-id]");
    if (!clickedItem) return;
    const nodeId = clickedItem.dataset.nodeId;
    if (!nodeId) return;
    const matchingBeat = beats.findIndex((b) => b.activeNodes.includes(nodeId));
    if (matchingBeat >= 0) {
      event.preventDefault();
      if (matchingBeat === step && isGate && !isLast) {
        setStep(step + 1);
      } else {
        setStep(matchingBeat);
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="story-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Walk through the story" className="flex flex-wrap gap-1.5">
            {beats.map((beat, idx) => {
              const active = idx === step;
              const passed = idx < step;
              return (
                <button
                  key={beat.stepTitle}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStep(idx)}
                  className={`tab-chip min-h-9 px-3 text-[13px] font-medium ${
                    passed && !active ? "border-[rgb(253_224_71_/_0.3)] text-ivory" : ""
                  }`}
                >
                  {passed && !active ? <Check aria-hidden size={12} strokeWidth={2.5} className="text-cyan" /> : null}
                  <span>{beat.stepTitle}</span>
                </button>
              );
            })}
          </div>

          <span className="rounded-[5px] border border-[rgb(251_246_241_/_0.12)] bg-[#0b0604] px-2.5 py-1 font-mono text-[12px] text-ivory tabular-nums">
            {current.time}
          </span>
        </div>

        <div className="mt-3.5 h-[2px] w-full overflow-hidden rounded-full bg-[rgb(251_246_241_/_0.1)]" aria-hidden>
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#fde047,#f97316,#ff6b4a)] transition-transform duration-300 origin-left"
            style={{ transform: `scaleX(${progressRatio})` }}
          />
        </div>

        <div aria-live="polite" className="mt-5 grid items-center gap-6 lg:grid-cols-12">
          <div className="space-y-3.5 lg:col-span-7">
            <p className="text-[17px] leading-relaxed text-ivory">{current.narrative}</p>
            {current.quote ? (
              <p className="rounded-r-[8px] border-l-2 border-cyan bg-[rgb(253_224_71_/_0.05)] py-2 pr-3 pl-3.5 text-[14.5px] text-ivory">
                {current.quote}
              </p>
            ) : null}
            {current.result ? (
              <p className="inline-flex items-center gap-2 rounded-[7px] border border-[rgb(255_107_74_/_0.45)] bg-[rgb(255_107_74_/_0.12)] px-3.5 py-2 text-[14px] font-semibold text-ivory">
                <Check aria-hidden size={16} strokeWidth={2.5} className="text-gold" />
                {current.result}
              </p>
            ) : null}

            <div className="pt-1">
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className={
                    isGate
                      ? "copper-key min-h-11 px-5 py-2.5 text-[14px] font-semibold"
                      : "btn btn-secondary min-h-11 px-4 text-[14px]"
                  }
                >
                  <span>{isGate ? "Approve text & finish" : "Next step"}</span>
                  <ArrowRight aria-hidden size={16} strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="btn btn-secondary min-h-11 px-4 text-[14px]"
                >
                  <RotateCcw aria-hidden size={15} strokeWidth={1.75} />
                  <span>Start story over</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <StoryArtifact artifact={current.artifact} onApprove={() => setStep(step + 1)} />
          </div>
        </div>
      </div>

      <div ref={stageRef} onClick={onStageClick}>
        {children}
      </div>
    </div>
  );
}
