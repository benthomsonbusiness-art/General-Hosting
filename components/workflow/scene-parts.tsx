"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Scenario } from "@/content/scenarios";
import type { RunState } from "@/lib/run-machine";

export type SceneProps = {
  state: RunState;
  scenario: Scenario;
  draft: string;
  onDraft: (value: string) => void;
};

/** True once the run has reached step `n` (0-based). */
export function reached(state: RunState, n: number): boolean {
  return state.index >= n;
}

/** True while step `n` is the one on stage. */
export function during(state: RunState, n: number): boolean {
  return state.index === n && state.status === "running";
}

export function finished(state: RunState): boolean {
  return state.status === "completed";
}

function wait(on: boolean, ms: number): CSSProperties {
  return { "--delay": `${on ? ms : 0}ms` } as CSSProperties;
}

/** Keeps its place in the layout and appears when `on`. */
export function Show({
  on,
  children,
  className = "",
  delay = 0,
}: {
  on: boolean;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div aria-hidden={!on} className={`sx ${on ? "sx-on" : ""} ${className}`} style={wait(on, delay)}>
      {children}
    </div>
  );
}

/** Slides up into a reserved space, like a reply opening under a message. */
export function Rise({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div aria-hidden={!on} inert={!on} className={`scene-rise ${on ? "scene-rise-on" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[14px] text-slate">{children}</p>;
}

/** Who a message is from. The initials come from the sample name. */
export function From({ name, meta }: { name: string; meta: string }) {
  const initials = name
    .split(/[ .]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="grid h-10 w-11 shrink-0 place-items-center bg-forest text-[14px] font-semibold text-ivory"
        style={{ clipPath: "polygon(16% 0,100% 0,84% 100%,0 100%)" }}
      >
        {initials}
      </span>
      <p className="leading-snug">
        <span className="font-semibold text-forest">{name}</span>
        <span className="block text-[14px] text-slate">{meta}</span>
      </p>
    </div>
  );
}

/** Text the model relied on, highlighted when that step runs. */
export function Mark({ on, children }: { on: boolean; children: ReactNode }) {
  return <span className={`scene-mark ${on ? "scene-mark-on" : ""}`}>{children}</span>;
}

/** Something the workflow established. */
export function Fact({
  on,
  children,
  tone = "stone",
  delay = 0,
}: {
  on: boolean;
  children: ReactNode;
  tone?: "stone" | "gold";
  delay?: number;
}) {
  return (
    <Show
      on={on}
      delay={delay}
      className={`px-3 py-1.5 text-[14px] leading-snug font-semibold ${
        tone === "gold" ? "bg-gold text-obsidian" : "bg-stone text-forest"
      }`}
    >
      {children}
    </Show>
  );
}

export function Confidence({ value, on }: { value: number; on: boolean }) {
  return (
    <Show on={on} className="py-1.5 text-[14px] leading-snug text-slate">
      Confidence {value.toFixed(2)}
    </Show>
  );
}

export function Stamp({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div aria-hidden={!on} className={`scene-stamp ${on ? "scene-stamp-on" : ""}`}>
      {children}
    </div>
  );
}

/** Words arrive one after another. The whole sentence is always in the page. */
export function Typed({ on, text, className = "" }: { on: boolean; text: string; className?: string }) {
  return (
    <p aria-hidden={!on} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${i}-${word}`} className={`scene-word ${on ? "scene-word-on" : ""}`} style={wait(on, i * 55)}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

/** Three dots while a message is being written. */
export function Dots() {
  return (
    <span aria-hidden className="inline-flex gap-1.5 bg-stone px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="scene-dot h-2 w-2 rounded-full bg-slate" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  );
}

export function Draft({
  state,
  draft,
  onDraft,
  label,
  sent,
}: {
  state: RunState;
  draft: string;
  onDraft: (value: string) => void;
  label: string;
  sent: string;
}) {
  return state.status === "awaiting" ? (
    <label className="block">
      <span className="text-[14px] text-slate">{label}</span>
      <textarea
        value={draft}
        onChange={(event) => onDraft(event.target.value)}
        rows={2}
        maxLength={240}
        className="field mt-1.5 resize-none max-sm:h-[7.4rem] font-display text-[1.3rem] leading-snug"
      />
    </label>
  ) : (
    <div className="border-l-4 border-gold bg-stone px-4 py-3">
      <p className="text-[14px] font-semibold text-gold-ink">{finished(state) ? sent : "Draft"}</p>
      <p className="mt-1 font-display text-[1.3rem] leading-snug break-words text-forest">{draft}</p>
    </div>
  );
}

/** A working week with one day chosen. */
export function Week({ on, day = 3 }: { on: boolean; day?: number }) {
  return (
    <div aria-hidden className="grid grid-cols-5 gap-1.5">
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((name, i) => (
        <span
          key={name}
          className={`scene-fade grid h-11 place-items-center text-[14px] ${
            on && i === day ? "bg-forest font-bold text-ivory" : "bg-stone text-slate"
          }`}
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export function Tick({ on, children, delay = 0 }: { on: boolean; children: ReactNode; delay?: number }) {
  return (
    <div className="flex min-h-9 items-center gap-3 text-[15px]">
      <span
        aria-hidden
        style={wait(on, delay)}
        className={`scene-fade grid h-5 w-5 shrink-0 place-items-center border text-[12px] ${
          on ? "border-forest bg-forest text-ivory" : "border-ink/40"
        }`}
      >
        {on ? "✓" : ""}
      </span>
      {children}
    </div>
  );
}
