import { CalendarCheck, Check, Globe, MessageSquare, PhoneMissed, RotateCcw, UserCheck } from "lucide-react";

/** Instant booking: a website form becomes a booked slot, with you approving the text. */
function BookingArt() {
  const steps = [
    { icon: Globe, label: "Web form" },
    { icon: MessageSquare, label: "Drafts", ai: true },
    { icon: UserCheck, label: "You approve", gold: true },
    { icon: CalendarCheck, label: "Booked" },
  ];
  return (
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
      <span className="art-list-head">Tomorrow&apos;s roster</span>
      {rows.map((row) => (
        <span key={row.time} className="art-row" data-move={row.state === "move" ? "" : undefined}>
          <span className="art-row-time">{row.time}</span>
          <span className="art-row-job">{row.job}</span>
          <span className="art-row-state">
            {row.state === "ok" ? <Check size={14} strokeWidth={2.5} /> : <RotateCcw size={14} strokeWidth={2.25} />}
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
      <span className="art-call">
        <PhoneMissed size={16} strokeWidth={1.75} />
        Missed call, 6:15 p.m.
      </span>
      <span className="art-bubble" data-out="">
        Sorry we missed you. Intro spots are open tomorrow at 7 a.m. or 5:30 p.m. Which works?
      </span>
      <span className="art-bubble">Tomorrow 5:30 please</span>
      <span className="art-bubble" data-out="">
        You&apos;re on the list. See you tomorrow.
      </span>
    </span>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  "missed-calls": TextBackArt,
  "instant-booking": BookingArt,
  reminders: RemindersArt,
};

/** A drawn picture of what each service does, in place of a photograph. Decorative. */
export function ServiceArt({ slug, className = "" }: { slug: string; className?: string }) {
  const Art = ART[slug] ?? BookingArt;
  return (
    <span className={`art ${className}`} aria-hidden>
      <Art />
    </span>
  );
}
