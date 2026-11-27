import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  Compass,
  FileCheck,
  Gauge,
  GitBranch,
  Hammer,
  Handshake,
  KeyRound,
  ListChecks,
  Map,
  MapPin,
  Layers,
  UserRound,
  Megaphone,
  PenLine,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ENGAGEMENTS } from "@/content/engagements";

/** One icon per known title; anything unlisted falls back by position. */
const ICONS: Record<string, LucideIcon> = {
  // Getting started
  "Booking audit": ClipboardList,
  Setup: Hammer,
  "Ongoing care": Activity,
  // Four steps
  Look: Map,
  Plan: PenLine,
  Test: Wrench,
  "Go live": KeyRound,
  "We look": Map,
  "We set it up": Hammer,
  "We test it with you": Handshake,
  // Services
  "Missed call text-back": Workflow,
  "Instant booking": Compass,
  "Appointment reminders": Megaphone,
  "By industry": Building2,
  "How it works": Workflow,
  // What you get
  "Text back in minutes": Megaphone,
  "Real open times": ListChecks,
  "Day and night": Gauge,
  "You approve": UserCheck,
  "Area check": Map,
  "Right tech": Users,
  "Open time": ListChecks,
  "Booked for you": FileCheck,
  "Day-before text": Megaphone,
  "Reply YES": UserCheck,
  "Changes flagged": GitBranch,
  // About
  "Morristown, New Jersey": MapPin,
  "Founder-led": UserRound,
  "One focus": Layers,
  "You own it": ShieldCheck,
  // Principles
  "Simple rules first": GitBranch,
  "AI only writes drafts": Bot,
  "You approve every text": UserCheck,
  "You own everything": ShieldCheck,
  "Clear instructions": FileCheck,
};

const FALLBACK: LucideIcon[] = [Target, Workflow, BarChart3, ShieldCheck, Building2];

export function iconFor(title: string, index = 0): LucideIcon {
  return ICONS[title] ?? FALLBACK[index % FALLBACK.length];
}

/** The three engagement stages as large connected cards. */
export function ScopeSteps() {
  const stages = ENGAGEMENTS.stages;
  return (
    <ol className="scope">
      {stages.map((stage, index) => {
        const Icon = iconFor(stage.name, index);
        return (
          <li key={stage.id} className="scope-card" data-first={index === 0 ? "" : undefined}>
            <span className="scope-top">
              <span className="g-icon">
                <Icon aria-hidden size={22} strokeWidth={1.5} />
              </span>
              <span className="scope-num">0{index + 1}</span>
            </span>
            <h3 className="scope-name">{stage.name}</h3>
            <span className="g-chip">{stage.shape}</span>
            <p className="scope-line">{stage.delivers}</p>
            {index < stages.length - 1 ? (
              <span className="scope-arrow" aria-hidden>
                <ArrowRight size={18} strokeWidth={1.75} />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/** Numbered steps on one line: an icon, a title and one short line each. */
export function StepTrack({ steps }: { steps: { title: string; line: string }[] }) {
  return (
    <ol className="track" style={{ "--n": steps.length } as React.CSSProperties}>
      {steps.map((step, index) => {
        const Icon = iconFor(step.title, index);
        return (
          <li key={step.title} className="track-step">
            <span className="track-dot">
              <Icon aria-hidden size={22} strokeWidth={1.5} />
              <span className="track-num">{index + 1}</span>
            </span>
            <h3 className="track-title">{step.title}</h3>
            <p className="track-line">{step.line}</p>
          </li>
        );
      })}
    </ol>
  );
}

/** A grid of icon cards. `body` is optional; keep it to one short line. */
export function IconCards({
  items,
  columns = 3,
}: {
  items: { title: string; body?: string; href?: string }[];
  columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <ul className="icards" data-cols={columns}>
      {items.map((item, index) => {
        const Icon = iconFor(item.title, index);
        const inner = (
          <>
            <span className="g-icon">
              <Icon aria-hidden size={22} strokeWidth={1.5} />
            </span>
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

/** A slow, endless strip of client names. Repeats the list so the strip is always full. */
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
