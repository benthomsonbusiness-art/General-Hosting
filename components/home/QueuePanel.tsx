"use client";

import { CalendarCheck, Check, Globe, PhoneMissed, RotateCcw, UserCheck } from "lucide-react";
import { useState } from "react";

type QueueItem = {
  id: string;
  icon: "call" | "web" | "cal";
  title: string;
  detail: string;
  approvedDetail: string;
  smsPreview: string;
  initialStatus: "approve" | "done";
  doneLabel: string;
};

const ITEMS: QueueItem[] = [
  {
    id: "missed-ac",
    icon: "call",
    title: "Missed call, 6:12 p.m. · AC not cooling",
    detail: "Voicemail read. Text ready with Tuesday 8 to 10 or 1 to 3",
    approvedDetail: "Approved by you · Text sent to caller",
    smsPreview: "“Sorry we missed your call. Marco has Tuesday 8 to 10 a.m. or 1 to 3 p.m. open. Reply 1 or 2 to book.”",
    initialStatus: "approve",
    doneLabel: "Sent",
  },
  {
    id: "web-heater",
    icon: "web",
    title: "Website form · Water heater quote",
    detail: "In your area. Draft ready for Wednesday 9 to 11 with Sam",
    approvedDetail: "Approved by you · Booked Wednesday 9 to 11 with Sam",
    smsPreview: "“Thanks for your note. Sam can check your water heater Wednesday 9 to 11 a.m. Reply YES to confirm.”",
    initialStatus: "approve",
    doneLabel: "Booked",
  },
  {
    id: "visits",
    icon: "cal",
    title: "Tomorrow's 14 visits",
    detail: "Reminders sent. 12 confirmed, 1 asked for a new time",
    approvedDetail: "Reminders sent. 12 confirmed, 1 asked for a new time",
    smsPreview: "“Friendly reminder that your visit is tomorrow morning. Reply YES to confirm or C to change.”",
    initialStatus: "done",
    doneLabel: "Confirmed",
  },
];

function RowIcon({ kind }: { kind: QueueItem["icon"] }) {
  if (kind === "call") return <PhoneMissed size={18} strokeWidth={1.5} />;
  if (kind === "web") return <Globe size={18} strokeWidth={1.5} />;
  return <CalendarCheck size={18} strokeWidth={1.5} />;
}

/** "Where it helps first", drawn as a playable approval queue with sample data. */
export function QueuePanel() {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>("missed-ac");

  const waitingCount = ITEMS.filter(
    (item) => item.initialStatus === "approve" && !approvedIds.includes(item.id),
  ).length;

  function approveItem(id: string) {
    setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setExpandedId((prev) => (prev === id ? null : prev));
  }

  function resetQueue() {
    setApprovedIds([]);
    setExpandedId("missed-ac");
  }

  return (
    <figure className="repo-panel" aria-label="Interactive example of the daily approval queue, with sample data">
      <div className="repo-bar">
        <span className="repo-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="repo-path">Today&apos;s queue</span>
        <span
          className="repo-badge"
          style={
            waitingCount > 0
              ? { borderColor: "rgb(255 107 74 / 0.45)", color: "#ffa58f" }
              : undefined
          }
        >
          {waitingCount > 0 ? (
            <>
              <UserCheck aria-hidden size={12} strokeWidth={2} />
              {waitingCount === 1 ? "1 needs approval" : `${waitingCount} need approval`}
            </>
          ) : (
            <>
              <Check aria-hidden size={12} strokeWidth={2.25} />
              All caught up
            </>
          )}
        </span>
      </div>
      <ul className="queue-rows">
        {ITEMS.map((item) => {
          const isDone = item.initialStatus === "done" || approvedIds.includes(item.id);
          const status = isDone ? "done" : "approve";
          const isExpanded = expandedId === item.id;
          return (
            <li key={item.id} className="border-b border-[rgb(251_246_241_/_0.08)] last:border-b-0">
              <div className="queue-row border-b-0" data-status={status}>
                <span className="queue-icon" aria-hidden>
                  <RowIcon kind={item.icon} />
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  aria-expanded={isExpanded}
                  className="queue-text text-left"
                >
                  <span className="queue-title underline-offset-4 hover:underline">{item.title}</span>
                  <span className="queue-detail">{isDone ? item.approvedDetail : item.detail}</span>
                </button>
                {!isDone ? (
                  <span className="queue-actions">
                    <button
                      type="button"
                      onClick={() => approveItem(item.id)}
                      className="copper-key px-3.5 py-1.5 text-[13px] font-semibold"
                    >
                      Approve
                    </button>
                    <span className="queue-status">Waiting for you</span>
                  </span>
                ) : (
                  <span className="queue-actions">
                    <span className="queue-done">
                      <Check aria-hidden size={14} strokeWidth={2.25} />
                      {item.doneLabel}
                    </span>
                  </span>
                )}
              </div>
              {isExpanded ? (
                <div className="mx-4 mb-3.5 rounded-[8px] border border-line bg-[rgb(251_246_241_/_0.03)] px-3.5 py-2.5 font-mono text-[12px] text-ivory">
                  <span className="text-muted">Draft text: </span>
                  {item.smsPreview}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <figcaption className="repo-foot flex flex-wrap items-center justify-between gap-3">
        <span>Sample data. Click a row to read the text, or tap Approve.</span>
        {approvedIds.length > 0 ? (
          <button
            type="button"
            onClick={resetQueue}
            className="inline-flex items-center gap-1.5 font-medium text-ivory underline underline-offset-4"
          >
            <RotateCcw aria-hidden size={12} strokeWidth={2} />
            Reset queue
          </button>
        ) : null}
      </figcaption>
    </figure>
  );
}
