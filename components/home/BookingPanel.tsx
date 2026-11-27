import { Check } from "lucide-react";

const EVENTS = [
  {
    when: "Thu · 5:30 p.m.",
    title: "Timeline & music call · Miller reception",
    state: "Confirmed",
  },
  {
    when: "Fri · 6:00 p.m.",
    title: "Corporate mixer · DJ & sound setup",
    state: "Booked",
  },
  {
    when: "Sat · 4:00 p.m.",
    title: "Ceremony & reception DJ set · Bloomington",
    state: "Confirmed",
  },
  {
    when: "Sun · 2:00 p.m.",
    title: "October wedding inquiry · Consult call",
    state: "Just booked",
    fresh: true,
  },
];

/** Clean DJ & event schedule paired with the Blessinger Entertainment client story. */
export function BookingPanel() {
  return (
    <div className="repo-panel" role="region" aria-label="Example weekly DJ and event booking schedule">
      <div className="repo-bar justify-between">
        <span className="repo-path font-semibold">This week&apos;s bookings</span>
        <span className="text-[13px] text-muted">Event &amp; DJ calendar</span>
      </div>
      <ul className="divide-y divide-line">
        {EVENTS.map((event) => (
          <li key={event.when} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <span className="font-mono text-[12px] text-muted block">{event.when}</span>
              <span className="mt-0.5 block text-[15px] font-medium text-ivory">{event.title}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[13px] ${
                event.fresh ? "font-semibold text-gold" : "text-muted"
              }`}
            >
              <Check aria-hidden size={14} strokeWidth={2.25} />
              {event.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
