"use client";

import { CalendarCheck, Check } from "lucide-react";
import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalEvent = { day: number; start: number; span: number; label: string };

const SERVICE_EVENTS: CalEvent[] = [
  { day: 0, start: 0, span: 2, label: "AC no-cool · Marco" },
  { day: 1, start: 1, span: 2, label: "Water heater · Sam" },
  { day: 1, start: 4, span: 2, label: "Tune-up · Marco" },
  { day: 2, start: 0, span: 2, label: "Panel quote · Devon" },
  { day: 3, start: 2, span: 2, label: "Drain clear · Sam" },
  { day: 4, start: 1, span: 3, label: "Heat pump install" },
  { day: 5, start: 2, span: 2, label: "Emergency callout" },
];

const CLIENT_EVENTS: CalEvent[] = [
  { day: 0, start: 1, span: 2, label: "Consult call" },
  { day: 1, start: 3, span: 2, label: "Venue walk-through" },
  { day: 2, start: 0, span: 1, label: "Deposit received" },
  { day: 3, start: 2, span: 2, label: "Consult call" },
  { day: 4, start: 4, span: 3, label: "Private event" },
  { day: 5, start: 3, span: 4, label: "Weekend booking" },
];

const ROWS = 7;

/** The testimonial's graphic: a booking calendar that fills and confirms itself. Sample data. */
export function BookingPanel() {
  const [board, setBoard] = useState<"service" | "client">("service");
  const events = board === "service" ? SERVICE_EVENTS : CLIENT_EVENTS;

  return (
    <figure className="repo-panel" aria-label="Example booking calendar filled automatically, with sample data">
      <div className="repo-bar flex-wrap">
        <span className="repo-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="repo-path">Schedule · this week</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBoard("service")}
            aria-pressed={board === "service"}
            className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium transition ${
              board === "service" ? "bg-ivory text-obsidian" : "border border-white/15 text-[#b8a99d] hover:text-ivory"
            }`}
          >
            Trade board
          </button>
          <button
            type="button"
            onClick={() => setBoard("client")}
            aria-pressed={board === "client"}
            className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium transition ${
              board === "client" ? "bg-ivory text-obsidian" : "border border-white/15 text-[#b8a99d] hover:text-ivory"
            }`}
          >
            Client week
          </button>
          <span className="repo-badge hidden sm:inline-flex">
            <CalendarCheck aria-hidden size={12} strokeWidth={2} />
            Approved by you
          </span>
        </div>
      </div>
      <div className="cal">
        {DAYS.map((day, d) => (
          <div key={day} className="cal-col">
            <span className="cal-day">{day}</span>
            <div className="cal-slots" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
              {events.filter((event) => event.day === d).map((event) => (
                <span
                  key={event.label + d}
                  className="cal-event"
                  style={{ gridRow: `${event.start + 1} / span ${event.span}` }}
                >
                  {event.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="cal-toast" aria-hidden>
        <span className="cal-toast-icon">
          <Check size={14} strokeWidth={2.5} />
        </span>
        <span>
          <span className="block font-semibold text-ivory">
            {board === "service" ? "Missed call booked into Tuesday 10 to 12" : "New request booked"}
          </span>
          <span className="block">
            {board === "service"
              ? "Area checked, tech matched, text approved from phone"
              : "Date checked, calendar updated, confirmation sent"}
          </span>
        </span>
      </div>
    </figure>
  );
}
