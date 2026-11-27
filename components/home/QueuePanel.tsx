"use client";

import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";

type QueueItem = {
  id: string;
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
    title: "Missed call, 6:15 p.m. · Trial workout",
    detail: "Draft ready for tomorrow 7 a.m. or 5:30 p.m.",
    approvedDetail: "Sent · Held on tomorrow's 5:30 p.m. class",
    smsPreview: "“Sorry we missed your call. Coach Maya has intro spots tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to book.”",
    initialStatus: "approve",
    doneLabel: "Sent",
  },
  {
    id: "web-screen",
    title: "Website form · New member consult",
    detail: "Draft ready for Thursday 10 a.m.",
    approvedDetail: "Booked Thursday 10 a.m.",
    smsPreview: "“Thanks for reaching out. We have Thursday at 10 a.m. open for a quick intro. Reply YES to lock it in.”",
    initialStatus: "approve",
    doneLabel: "Booked",
  },
  {
    id: "class-roster",
    title: "Tomorrow's 18 class & client spots",
    detail: "17 confirmed by text, 1 moved to Friday",
    approvedDetail: "17 confirmed by text, 1 moved to Friday",
    smsPreview: "“See you tomorrow at 6 a.m. for Strength. Reply YES to confirm or C if you need another day.”",
    initialStatus: "done",
    doneLabel: "Confirmed",
  },
];

/** Clean approval queue without fake window dots or disclaimer clutter. */
export function QueuePanel() {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const waitingCount = ITEMS.filter(
    (item) => item.initialStatus === "approve" && !approvedIds.includes(item.id),
  ).length;

  function approveItem(id: string) {
    setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setExpandedId((prev) => (prev === id ? null : prev));
  }

  return (
    <div className="repo-panel" role="region" aria-label="Today's approval queue">
      <div className="repo-bar justify-between">
        <span className="repo-path font-semibold">Today&apos;s queue</span>
        <div className="flex items-center gap-3 text-[13px]">
          <span className={waitingCount > 0 ? "text-gold font-medium" : "text-muted"}>
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
          const isDone = item.initialStatus === "done" || approvedIds.includes(item.id);
          const isExpanded = expandedId === item.id;
          return (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <div className="flex items-center justify-between gap-4 px-5 py-4" data-status={isDone ? "done" : "approve"}>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  aria-expanded={isExpanded}
                  className="min-w-0 text-left"
                >
                  <span className="queue-title block underline-offset-4 hover:underline">{item.title}</span>
                  <span className="queue-detail mt-0.5 block">{isDone ? item.approvedDetail : item.detail}</span>
                </button>

                {!isDone ? (
                  <button
                    type="button"
                    onClick={() => approveItem(item.id)}
                    className="copper-key shrink-0 px-3.5 py-1.5 text-[13px] font-semibold"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-muted">
                    <Check aria-hidden size={14} strokeWidth={2.25} className="text-ivory" />
                    {item.doneLabel}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <p className="mx-5 mb-4 border-l-2 border-line pl-3 text-[13px] text-muted">{item.smsPreview}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
