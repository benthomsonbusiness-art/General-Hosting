"use client";

import { CalendarCheck, Check, ChevronDown, Globe, PhoneMissed, RotateCcw, type LucideIcon } from "lucide-react";
import { useState } from "react";

type QueueItem = {
  id: string;
  icon: LucideIcon;
  time: string;
  title: string;
  detail: string;
  approvedDetail: string;
  smsPreview: string;
  initialStatus: "approve" | "done";
  doneLabel: string;
};

const ITEMS: QueueItem[] = [
  {
    id: "missed-gym",
    icon: PhoneMissed,
    time: "6:15 p.m.",
    title: "Missed call · Trial workout",
    detail: "Draft ready for tomorrow 7 a.m. or 5:30 p.m.",
    approvedDetail: "Sent · Held on tomorrow's 5:30 p.m. class",
    smsPreview:
      "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to book.”",
    initialStatus: "approve",
    doneLabel: "Sent",
  },
  {
    id: "web-screen",
    icon: Globe,
    time: "6:08 p.m.",
    title: "Website form · New member consult",
    detail: "Draft ready for Thursday 10 a.m.",
    approvedDetail: "Booked Thursday 10 a.m.",
    smsPreview:
      "“Thanks for reaching out. We have Thursday at 10 a.m. open for a quick intro. Reply YES to lock it in.”",
    initialStatus: "approve",
    doneLabel: "Booked",
  },
  {
    id: "class-roster",
    icon: CalendarCheck,
    time: "4:20 p.m.",
    title: "Tomorrow's 18 class & client spots",
    detail: "17 confirmed by text, 1 moved to Friday",
    approvedDetail: "17 confirmed by text, 1 moved to Friday",
    smsPreview: "“See you tomorrow at 6 a.m. for Strength. Reply YES to confirm or C if you need another day.”",
    initialStatus: "done",
    doneLabel: "Confirmed",
  },
];

/** High-tech operator triage console with interactive approval switches and expandable SMS previews. */
export function QueuePanel() {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>("missed-gym");

  const waitingCount = ITEMS.filter(
    (item) => item.initialStatus === "approve" && !approvedIds.includes(item.id),
  ).length;
  const completedCount = ITEMS.length - waitingCount;

  function approveItem(id: string) {
    setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setExpandedId((prev) => (prev === id ? null : prev));
  }

  return (
    <div className="repo-panel" role="region" aria-label="Today's approval queue">
      <div className="repo-bar justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full ${waitingCount > 0 ? "pulse-dot bg-gold shadow-[0_0_8px_#ff6b4a]" : "bg-cyan"}`}
          />
          <span className="repo-path font-semibold">Today&apos;s queue</span>
        </div>

        <div className="flex items-center gap-3 text-[13px]">
          <div className="hidden items-center gap-1 sm:flex" aria-hidden>
            {ITEMS.map((item, idx) => (
              <span
                key={item.id}
                className={`h-1.5 w-5 rounded-[2px] ${
                  idx < completedCount ? "bg-cyan" : "bg-[rgb(255_107_74_/_0.45)]"
                }`}
              />
            ))}
          </div>
          <span className={waitingCount > 0 ? "font-mono text-[12px] font-medium text-gold" : "font-mono text-[12px] text-cyan"}>
            {waitingCount > 0 ? `${waitingCount} waiting` : "All clear"}
          </span>
          {approvedIds.length > 0 ? (
            <button
              type="button"
              onClick={() => setApprovedIds([])}
              className="inline-flex items-center gap-1 text-muted hover:text-ivory"
            >
              <RotateCcw aria-hidden size={12} strokeWidth={1.75} />
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <ul className="queue-rows">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isDone = item.initialStatus === "done" || approvedIds.includes(item.id);
          const isExpanded = expandedId === item.id;
          return (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <div className="queue-row" data-status={isDone ? "done" : "approve"}>
                <span className="queue-icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.75} className={isDone ? "text-cyan" : "text-gold"} />
                </span>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  aria-expanded={isExpanded}
                  className="queue-text text-left"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="queue-title underline-offset-4 hover:underline">{item.title}</span>
                    <span className="font-mono text-[11.5px] text-muted">{item.time}</span>
                    <ChevronDown
                      aria-hidden
                      size={14}
                      className={`text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </span>
                  <span className="queue-detail">{isDone ? item.approvedDetail : item.detail}</span>
                </button>

                <div className="queue-actions">
                  {!isDone ? (
                    <button
                      type="button"
                      onClick={() => approveItem(item.id)}
                      className="copper-key shrink-0 px-3.5 py-1.5 text-[13px] font-semibold"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="queue-done">
                      <Check aria-hidden size={13} strokeWidth={2.5} className="text-cyan" />
                      {item.doneLabel}
                    </span>
                  )}
                </div>
              </div>
              {isExpanded ? (
                <div className="mx-5 mb-4 rounded-[8px] border border-[rgb(253_224_71_/_0.2)] bg-[#0b0604] px-3.5 py-2.5 text-[13.5px] text-ivory shadow-[inset_2px_0_0_#fde047]">
                  {item.smsPreview}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
