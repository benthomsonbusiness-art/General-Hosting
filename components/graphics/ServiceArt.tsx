import { Bot, CalendarCheck, Check, MessageSquare, PhoneMissed, RotateCcw, Star, UserCheck } from "lucide-react";

/** Booking: a missed call becomes a booked job, with a person approving the text. */
function BookingArt() {
  const steps = [
    { icon: PhoneMissed, label: "Missed call" },
    { icon: Bot, label: "AI drafts" },
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
            <span className="art-node" data-gold={step.gold ? "" : undefined}>
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

/** Follow-up: an open estimate followed up, and a five-star review. */
function FollowUpArt() {
  return (
    <span className="art-follow">
      <span className="art-estimate">
        <span className="art-caption">Estimate</span>
        <span className="art-estimate-title">New system, 2 options</span>
        <span className="art-pill">Followed up</span>
      </span>
      <span className="art-review">
        <span className="art-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={18} strokeWidth={1.5} fill="currentColor" />
          ))}
        </span>
        <span className="art-caption">Review requested after the job</span>
      </span>
    </span>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  "booking-automation": BookingArt,
  "reminders-and-rescheduling": RemindersArt,
  "follow-up-and-reviews": FollowUpArt,
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
