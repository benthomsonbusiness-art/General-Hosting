import { Bot, CalendarCheck, Check, Globe, MessageSquare, PhoneMissed, RotateCcw, UserCheck } from "lucide-react";

/** Instant booking: a website form becomes a booked job, with you approving the text. */
function BookingArt() {
  const steps = [
    { icon: Globe, label: "Web form" },
    { icon: Bot, label: "AI drafts", ai: true },
    { icon: UserCheck, label: "You approve", gold: true },
    { icon: MessageSquare, label: "Text sent" },
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

/** Reminders: tomorrow's visits, confirmed by text, one reschedule flagged. */
function RemindersArt() {
  const rows = [
    { time: "8-10 a.m.", job: "AC tune-up", state: "ok" },
    { time: "10-12", job: "Water heater", state: "ok" },
    { time: "1-3 p.m.", job: "Panel quote", state: "move" },
    { time: "3-5 p.m.", job: "Drain clean", state: "ok" },
  ];
  return (
    <span className="art-list">
      <span className="art-list-head">Tomorrow</span>
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
        Missed call, 6:12 p.m.
      </span>
      <span className="art-bubble" data-out="">
        Sorry we missed you. We can come today 2 to 4 or tomorrow 8 to 10. Which works?
      </span>
      <span className="art-bubble">Tomorrow 8 to 10 please</span>
      <span className="art-bubble" data-out="">
        You&apos;re booked. See you tomorrow.
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
