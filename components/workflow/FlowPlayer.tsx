"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useRef } from "react";
import type { Workflow } from "@/content/workflows";

type StoryBeat = {
  stepTitle: string;
  time: string;
  narrative: string;
  quote?: string;
  result?: string;
  activeNodes: string[];
  awaitingNode?: string;
};

const STORIES: Record<string, StoryBeat[]> = {
  "missed-call-text-back": [
    {
      stepTitle: "1. Call missed",
      time: "6:15 p.m.",
      narrative:
        "Jordan calls your gym asking about a trial workout while coaches are leading the evening class. Instead of hitting a dead voicemail, the call is picked up right away.",
      activeNodes: ["missed-call"],
    },
    {
      stepTitle: "2. Reply drafted",
      time: "6:15 p.m.",
      narrative:
        "Checks your class calendar, sees two open intro spots tomorrow, and writes a plain text reply ready for you to check.",
      quote: "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to grab one.”",
      activeNodes: ["draft-text"],
    },
    {
      stepTitle: "3. You approve",
      time: "6:16 p.m.",
      narrative:
        "Between sets, your phone shows the voicemail and the drafted text. Nothing goes to Jordan until you tap Approve.",
      quote: "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to grab one.”",
      activeNodes: ["office-approves"],
      awaitingNode: "office-approves",
    },
    {
      stepTitle: "4. Spot booked",
      time: "6:18 p.m.",
      narrative:
        "The text goes out, Jordan replies “2”, and tomorrow's 5:30 p.m. spot is held on your roster with class reminders ready.",
      result: "Booked: Jordan M. · Tomorrow 5:30 p.m. Strength Intro",
      activeNodes: ["text-back", "hold-visit"],
    },
  ],
  "web-lead-booking": [
    {
      stepTitle: "1. Form comes in",
      time: "9:40 p.m.",
      narrative:
        "Someone fills out the intro or consult form on your website at night while comparing three local options.",
      activeNodes: ["web-lead", "area-check"],
    },
    {
      stepTitle: "2. Time matched",
      time: "9:40 p.m.",
      narrative:
        "Checks that the request fits what you offer, finds open slots on the right coach or recruiter's calendar, and writes the reply.",
      quote: "“Thanks for reaching out. We have Thursday at 6 a.m. or Friday at 12 p.m. open for your first session. Which works?”",
      activeNodes: ["match-slot"],
    },
    {
      stepTitle: "3. You approve",
      time: "7:05 a.m.",
      narrative:
        "You see the inquiry, the matched slot, and the text in one message. One tap sends it, or you can edit first.",
      quote: "“Thanks for reaching out. We have Thursday at 6 a.m. or Friday at 12 p.m. open for your first session. Which works?”",
      activeNodes: ["approve-booking"],
      awaitingNode: "approve-booking",
    },
    {
      stepTitle: "4. Added to calendar",
      time: "7:12 a.m.",
      narrative:
        "They confirm Thursday at 6 a.m. The booking lands directly on your calendar with their form notes attached.",
      result: "Booked: J. Alvarez · Thursday 6:00 a.m. · Source: Website form",
      activeNodes: ["confirm-text", "book-job"],
    },
  ],
  "appointment-reminders": [
    {
      stepTitle: "1. Roster pulled",
      time: "4:00 p.m.",
      narrative:
        "Every afternoon, tomorrow's recurring classes, intro sessions, and client appointments are gathered from your calendar.",
      activeNodes: ["daily-4pm", "ready-check"],
    },
    {
      stepTitle: "2. Reminders written",
      time: "4:01 p.m.",
      narrative:
        "Writes a short reminder for each person with their class time, coach, and any first-visit note.",
      quote: "“See you tomorrow at 6 a.m. for Strength with Coach Maya. Reply YES to confirm or C if you need to move.”",
      activeNodes: ["write-visit-texts"],
    },
    {
      stepTitle: "3. You approve once",
      time: "4:05 p.m.",
      narrative:
        "Instead of texting 18 people one by one, you review tomorrow's list in a single message and approve the whole batch.",
      activeNodes: ["approve-list"],
      awaitingNode: "approve-list",
    },
    {
      stepTitle: "4. Class stays full",
      time: "4:20 p.m.",
      narrative:
        "17 members reply YES. One asks to move to Friday, opening their 6 a.m. spot early enough for someone on the waitlist.",
      result: "Roster updated: 17 confirmed · 1 spot reopened for waitlist",
      activeNodes: ["send-reminders", "update-board"],
    },
  ],
};

/**
 * Story-driven walkthrough paired with the server-rendered FlowDiagram.
 * Stepping through the 4 story beats highlights the matching workflow nodes and ends on a concrete result.
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div role="tablist" aria-label="Walk through the story" className="flex flex-wrap gap-1.5">
            {beats.map((beat, idx) => {
              const active = idx === step;
              return (
                <button
                  key={beat.stepTitle}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStep(idx)}
                  className={`min-h-9 rounded-[6px] px-3 text-[13px] font-medium transition ${
                    active
                      ? "bg-ivory font-semibold text-obsidian"
                      : "border border-line text-muted hover:text-ivory"
                  }`}
                >
                  {beat.stepTitle}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[13px] text-muted">{current.time}</span>
        </div>

        <div aria-live="polite" className="mt-4 grid items-center gap-5 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            <p className="text-[17px] leading-relaxed text-ivory">{current.narrative}</p>
            {current.quote ? (
              <p className="border-l-2 border-violet pl-3.5 text-[15px] text-muted">{current.quote}</p>
            ) : null}
            {current.result ? (
              <p className="inline-flex items-center gap-2 rounded-[6px] border border-[rgb(255_107_74_/_0.4)] bg-[rgb(255_107_74_/_0.1)] px-3.5 py-2 text-[14px] font-semibold text-ivory">
                <Check aria-hidden size={16} strokeWidth={2.5} className="text-gold" />
                {current.result}
              </p>
            ) : null}
          </div>

          <div className="flex lg:col-span-4 lg:justify-end">
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
      </div>

      <div ref={stageRef} onClick={onStageClick}>
        {children}
      </div>
    </div>
  );
}
