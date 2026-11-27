import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileCheck,
  Gauge,
  GitBranch,
  Hammer,
  Handshake,
  KeyRound,
  Layers,
  ListChecks,
  Map,
  MapPin,
  Megaphone,
  MessageSquare,
  PenLine,
  PhoneMissed,
  ShieldCheck,
  Target,
  UserCheck,
  UserRound,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ENGAGEMENTS } from "@/content/engagements";

const ICONS: Record<string, LucideIcon> = {
  "Booking audit": ClipboardList,
  Setup: Hammer,
  "Ongoing care": Activity,
  Look: Map,
  Plan: PenLine,
  Test: Wrench,
  "Go live": KeyRound,
  "We look": Map,
  "We set it up": Hammer,
  "We test it with you": Handshake,
  "Missed call text-back": PhoneMissed,
  "Instant booking": CalendarCheck,
  "Instant booking for web leads": CalendarCheck,
  "Appointment reminders": Megaphone,
  "By industry": Building2,
  "How it works": Workflow,
  "Text back in minutes": Megaphone,
  "Real open times": ListChecks,
  "During classes or after hours": Gauge,
  "You approve": UserCheck,
  "Fit check": Map,
  "Right calendar": Users,
  "Open time": ListChecks,
  "Booked for you": FileCheck,
  "Recurring classes": CalendarCheck,
  "Reply YES": UserCheck,
  "Changes caught early": GitBranch,
  "Morristown, New Jersey": MapPin,
  "Founder-led": UserRound,
  "One focus": Layers,
  "You own it": ShieldCheck,
  "Checks first, then writes": GitBranch,
  "AI only writes drafts": MessageSquare,
  "You approve every text": UserCheck,
  "You own everything": ShieldCheck,
  "Clear instructions": FileCheck,
};

const FALLBACK: LucideIcon[] = [Target, Workflow, BarChart3, ShieldCheck, Building2];

export function iconFor(title: string, index = 0): LucideIcon {
  return ICONS[title] ?? FALLBACK[index % FALLBACK.length];
}

/** The three engagement stages as clean architectural columns separated by hairlines. */
export function ScopeSteps() {
  const stages = ENGAGEMENTS.stages;
  return (
    <ol className="scope">
      {stages.map((stage, index) => (
        <li key={stage.id} className="scope-card">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[13px] text-muted">0{index + 1}</span>
            <span className="font-mono text-[13px] text-muted">{stage.shape}</span>
          </div>
          <h3 className="scope-name">{stage.name}</h3>
          <p className="scope-line">{stage.delivers}</p>
        </li>
      ))}
    </ol>
  );
}

/** Numbered steps on one line: clean number, title, and one short line. */
export function StepTrack({ steps }: { steps: { title: string; line: string }[] }) {
  return (
    <ol className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="space-y-2">
          <span className="font-mono text-[13px] text-gold">0{index + 1}</span>
          <h3 className="h4">{step.title}</h3>
          <p className="text-[15px] text-muted">{step.line}</p>
        </li>
      ))}
    </ol>
  );
}

/** Clean list/grid without beveled icon boxes or neon hover cards. */
export function IconCards({
  items,
  columns = 3,
}: {
  items: { title: string; body?: string; href?: string }[];
  columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <ul className="icards" data-cols={columns}>
      {items.map((item) => {
        const inner = (
          <>
            <span className="icard-title">{item.title}</span>
            {item.body ? <span className="icard-body">{item.body}</span> : null}
            {item.href ? (
              <span className="icard-more">
                Learn more <ArrowRight aria-hidden size={16} strokeWidth={1.75} />
              </span>
            ) : null}
          </>
        );
        return (
          <li key={item.title}>
            {item.href ? (
              <Link href={item.href} className="icard group" data-link="">
                {inner}
              </Link>
            ) : (
              <div className="icard">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function NameMarquee({ names, label }: { names: { name: string; place?: string }[]; label: string }) {
  const minimum = 8;
  const row = Array.from({ length: Math.max(minimum, names.length) }, (_, i) => names[i % names.length]);
  return (
    <div className="marquee" role="region" aria-label={label}>
      <ul className="sr-only">
        {names.map((item) => (
          <li key={item.name}>{item.place ? `${item.name}, ${item.place}` : item.name}</li>
        ))}
      </ul>
      <div className="marquee-track" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="marquee-item">
                <span className="marquee-mark">{item.name.charAt(0)}</span>
                <span>
                  <span className="block font-semibold text-ivory">{item.name}</span>
                  {item.place ? <span className="block text-[12px]">{item.place}</span> : null}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
