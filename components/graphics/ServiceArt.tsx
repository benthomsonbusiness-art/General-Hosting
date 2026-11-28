import { CalendarCheck, Check, Globe, MessageSquare, PhoneMissed, RotateCcw, UserCheck } from "lucide-react";

const MINI_WAVE = [5, 11, 15, 9, 14, 7];

/** Instant booking: a website form becomes a booked slot, with you approving the text. */
function BookingArt() {
  const steps = [
    { icon: Globe, label: "Web form" },
    { icon: MessageSquare, label: "Drafts", ai: true },
    { icon: UserCheck, label: "You approve", gold: true },
    { icon: CalendarCheck, label: "Booked" },
  ];
  return (
    <span className="flex w-full flex-col gap-3.5">
      <span className="art-flow">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <span key={step.label} className="art-flow-step">
              <span className="art-node" data-ai={step.ai ? "" : undefined} data-gold={step.gold ? "" : undefined}>
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="art-caption">{step.label}</span>
              {i < steps.length - 1 ? <span className="art-link" /> : null}
            </span>
          );
        })}
      </span>

      <span className="grid grid-cols-2 gap-2 rounded-[8px] border border-[rgb(251_246_241_/_0.12)] bg-[rgb(14_8_5_/_0.78)] p-2.5 text-[11px]">
        <span className="flex items-center justify-between rounded-[5px] border border-[rgb(253_224_71_/_0.32)] bg-[rgb(253_224_71_/_0.08)] px-2 py-1 font-mono text-cyan">
          <span>Thu 6:00a</span>
          <span>Open</span>
        </span>
        <span className="flex items-center justify-between rounded-[5px] border border-[rgb(255_107_74_/_0.4)] bg-[rgb(255_107_74_/_0.12)] px-2 py-1 font-mono text-ivory">
          <span>Booked</span>
          <Check size={12} strokeWidth={2.5} className="text-gold" />
        </span>
      </span>
    </span>
  );
}

/** Reminders: tomorrow's recurring classes and appointments confirmed by text. */
function RemindersArt() {
  const rows = [
    { time: "6:00 a.m.", job: "Strength class (14)", state: "ok" },
    { time: "9:30 a.m.", job: "Intro session", state: "ok" },
    { time: "12:00 p.m.", job: "Pilates reformer", state: "move" },
    { time: "5:30 p.m.", job: "Small group", state: "ok" },
  ];
  return (
    <span className="art-list">
      <span className="flex items-center justify-between">
        <span className="art-list-head font-medium text-ivory">Tomorrow&apos;s roster</span>
        <span className="font-mono text-[11px] text-cyan">17 / 18 confirmed</span>
      </span>
      {rows.map((row) => (
        <span key={row.time} className="art-row" data-move={row.state === "move" ? "" : undefined}>
          <span className="art-row-time">{row.time}</span>
          <span className="art-row-job truncate">{row.job}</span>
          <span className="art-row-state">
            {row.state === "ok" ? <Check size={13} strokeWidth={2.5} /> : <RotateCcw size={13} strokeWidth={2.25} />}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Missed calls: the text thread a caller sees a few minutes after you miss them. */
function TextBackArt() {
  return (
    <span className="art-thread">
      <span className="flex items-center justify-between rounded-[7px] border border-[rgb(251_246_241_/_0.12)] bg-[rgb(14_8_5_/_0.78)] px-3 py-1.5 text-[11.5px]">
        <span className="inline-flex items-center gap-1.5 text-ivory">
          <PhoneMissed size={13} strokeWidth={2} className="text-gold" />
          <span>Missed call · 6:15 p.m.</span>
        </span>
        <span className="inline-flex items-center gap-[2px]">
          {MINI_WAVE.map((h, idx) => (
            <span
              key={idx}
              className="w-[2.5px] rounded-full bg-[linear-gradient(180deg,#fde047,#ff6b4a)]"
              style={{ height: `${h}px` }}
            />
          ))}
        </span>
      </span>
      <span className="art-bubble" data-out="">
        Sorry we missed you. Intro spots are open tomorrow at 7 a.m. or 5:30 p.m. Which works?
      </span>
      <span className="art-bubble">Tomorrow 5:30 please</span>
      <span className="inline-flex items-center gap-1.5 self-end rounded-full border border-[rgb(255_107_74_/_0.45)] bg-[rgb(255_107_74_/_0.14)] px-2.5 py-1 font-mono text-[11px] font-medium text-ivory">
        <Check size={12} strokeWidth={2.5} className="text-gold" />
        Held · Tomorrow 5:30 p.m.
      </span>
    </span>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  "missed-calls": TextBackArt,
  "instant-booking": BookingArt,
  reminders: RemindersArt,
};

/** A drawn schematic of what each service does, in place of a photograph. Decorative. */
export function ServiceArt({ slug, className = "" }: { slug: string; className?: string }) {
  const Art = ART[slug] ?? BookingArt;
  return (
    <span className={`art ${className}`} aria-hidden>
      <Art />
    </span>
  );
}
