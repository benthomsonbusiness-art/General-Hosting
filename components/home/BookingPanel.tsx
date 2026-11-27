import { CalendarCheck, Check } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Sample bookings: day index, start row, length in rows, label. */
const EVENTS: { day: number; start: number; span: number; label: string }[] = [
  { day: 0, start: 1, span: 2, label: "Consult call" },
  { day: 1, start: 3, span: 2, label: "Venue walk-through" },
  { day: 2, start: 0, span: 1, label: "Deposit received" },
  { day: 3, start: 2, span: 2, label: "Consult call" },
  { day: 4, start: 4, span: 3, label: "Private event" },
  { day: 5, start: 3, span: 4, label: "Wedding reception" },
];

const ROWS = 7;

/** The testimonial's graphic: a booking calendar that fills and confirms itself. Sample data. */
export function BookingPanel() {
  return (
    <figure className="repo-panel" aria-label="Example booking calendar filled automatically, with sample data">
      <div className="repo-bar">
        <span className="repo-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="repo-path">Bookings · this week</span>
        <span className="repo-badge">
          <CalendarCheck aria-hidden size={12} strokeWidth={2} />
          Approved by you
        </span>
      </div>
      <div className="cal">
        {DAYS.map((day, d) => (
          <div key={day} className="cal-col">
            <span className="cal-day">{day}</span>
            <div className="cal-slots" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
              {EVENTS.filter((event) => event.day === d).map((event) => (
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
          <span className="block font-semibold text-ivory">New request booked</span>
          <span className="block">Date checked, calendar updated, confirmation sent</span>
        </span>
      </div>
    </figure>
  );
}
