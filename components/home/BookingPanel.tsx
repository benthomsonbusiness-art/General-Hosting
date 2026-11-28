import { Check, Disc3, Music } from "lucide-react";

const EVENTS = [
  {
    day: "THU",
    time: "5:30 p.m.",
    title: "Timeline & music call · Miller reception",
    rig: "Playlist + cue sheet",
    state: "Confirmed",
    barWidth: "55%",
  },
  {
    day: "FRI",
    time: "6:00 p.m.",
    title: "Corporate mixer · DJ & sound setup",
    rig: "Full PA + wireless mics",
    state: "Booked",
    barWidth: "78%",
  },
  {
    day: "SAT",
    time: "4:00 p.m.",
    title: "Ceremony & reception DJ set · Bloomington",
    rig: "2 setups + dance lighting",
    state: "Confirmed",
    barWidth: "96%",
  },
  {
    day: "SUN",
    time: "2:00 p.m.",
    title: "October wedding inquiry · Consult call",
    rig: "Booked by text reply",
    state: "Just booked",
    barWidth: "64%",
    fresh: true,
  },
];

const EQ_BARS = [6, 12, 18, 10, 16, 20, 14, 8, 16, 12, 18, 10];

/** High-tech DJ & event production schedule paired with the Blessinger Entertainment client story. */
export function BookingPanel() {
  return (
    <div className="repo-panel" role="region" aria-label="Example weekly DJ and event booking schedule">
      <div className="repo-bar justify-between">
        <span className="inline-flex items-center gap-2.5">
          <Disc3 aria-hidden size={16} strokeWidth={1.75} className="text-gold" />
          <span className="repo-path font-semibold">This week&apos;s bookings</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden items-end gap-[2px] sm:inline-flex" aria-hidden>
            {EQ_BARS.map((h, idx) => (
              <span
                key={idx}
                className="w-[2.5px] rounded-full bg-[linear-gradient(180deg,#fde047,#ff6b4a)]"
                style={{ height: `${h}px` }}
              />
            ))}
          </span>
          <span className="font-mono text-[12px] text-muted">Event &amp; DJ board</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-b border-line bg-[#0b0604] px-5 py-3" aria-hidden>
        {EVENTS.map((ev) => (
          <div
            key={ev.day}
            className={`rounded-[6px] border px-2.5 py-1.5 ${
              ev.fresh
                ? "border-[rgb(255_107_74_/_0.45)] bg-[rgb(255_107_74_/_0.1)]"
                : "border-[rgb(251_246_241_/_0.09)] bg-[#140c08]"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className={ev.fresh ? "font-semibold text-gold" : "text-ivory"}>{ev.day}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${ev.fresh ? "bg-gold" : "bg-cyan"}`} />
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[rgb(251_246_241_/_0.1)]">
              <div
                className={`h-full rounded-full ${
                  ev.fresh ? "bg-gold" : "bg-[linear-gradient(90deg,#fde047,#f97316)]"
                }`}
                style={{ width: ev.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-line">
        {EVENTS.map((event) => (
          <li
            key={event.day}
            className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 ${
              event.fresh ? "bg-[linear-gradient(90deg,rgb(255_107_74_/_0.1),transparent_75%)] shadow-[inset_3px_0_0_#ff6b4a]" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="grid w-12 shrink-0 rounded-[6px] border border-[rgb(251_246_241_/_0.12)] bg-[#170e09] py-1 text-center font-mono">
                <span className={`text-[11px] font-semibold ${event.fresh ? "text-gold" : "text-ivory"}`}>
                  {event.day}
                </span>
                <span className="text-[10px] text-muted">{event.time.replace(" p.m.", "p")}</span>
              </div>
              <div className="min-w-0">
                <span className="block truncate text-[14.5px] font-medium text-ivory">{event.title}</span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-muted">
                  <Music aria-hidden size={11} className="text-violet-hi" />
                  {event.rig}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] ${
                event.fresh
                  ? "border border-[rgb(255_107_74_/_0.45)] bg-[rgb(255_107_74_/_0.14)] font-semibold text-gold-hi"
                  : "border border-[rgb(251_246_241_/_0.14)] bg-[rgb(251_246_241_/_0.04)] text-ivory"
              }`}
            >
              <Check aria-hidden size={12} strokeWidth={2.5} className={event.fresh ? "text-gold" : "text-cyan"} />
              {event.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
