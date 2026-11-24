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

export function finished(state: RunState): boolean {
  return state.status === "completed";
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
    <div
      aria-hidden={!on}
      className={`sx ${on ? "sx-on" : ""} ${className}`}
      style={delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

export function Paper({
  children,
  className = "",
  tone = "ivory",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ivory" | "stone";
}) {
  return (
    <div
      data-surface="light"
      className={`scene-paper ${tone === "stone" ? "bg-stone" : "bg-ivory"} p-5 md:p-7 short:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-slate">{children}</p>;
}

/** Text the model relied on, highlighted when that step runs. */
export function Mark({ on, children }: { on: boolean; children: ReactNode }) {
  return <span className={`scene-mark ${on ? "scene-mark-on" : ""}`}>{children}</span>;
}

export function Fill({ label, value, on, delay }: { label: string; value: string; on: boolean; delay?: number }) {
  return (
    <div className="flex min-h-9 items-baseline justify-between gap-4 py-1 text-[15px]">
      <span className="text-slate">{label}</span>
      <Show on={on} delay={delay} className="text-right font-semibold text-forest">
        {value}
      </Show>
    </div>
  );
}

export function Stamp({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div aria-hidden={!on} className={`scene-stamp ${on ? "scene-stamp-on" : ""}`}>
      {children}
    </div>
  );
}

export function Draft({
  state,
  draft,
  onDraft,
  label,
}: {
  state: RunState;
  draft: string;
  onDraft: (value: string) => void;
  label: string;
}) {
  const open = state.status === "awaiting";
  return open ? (
    <label className="block">
      <span className="text-[13px] text-slate">{label}</span>
      <textarea
        value={draft}
        onChange={(event) => onDraft(event.target.value)}
        rows={4}
        maxLength={240}
        className="field mt-2 resize-none font-display text-[1.35rem] leading-snug"
      />
    </label>
  ) : (
    <div>
      <p className="text-[13px] text-slate">{finished(state) ? "Sent (sample)" : label}</p>
      <p className="mt-2 font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] leading-snug break-words text-forest">
        {draft}
      </p>
    </div>
  );
}

/** Confidence against the line a visitor sets. */
export function Gauge({ value, on }: { value: number; on: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] text-slate">
        <span>Confidence</span>
        <Show on={on}>{value.toFixed(2)}</Show>
      </div>
      <div className="mt-1.5 h-1.5 bg-ink/10">
        <div
          className="scene-grow h-full origin-left bg-gold-ink"
          style={{ transform: `scaleX(${on ? value : 0})` }}
        />
      </div>
    </div>
  );
}

/** A month with one day chosen. */
export function Month({ on, day = 16 }: { on: boolean; day?: number }) {
  return (
    <div aria-hidden className="grid grid-cols-7 gap-1">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className={`scene-fade grid aspect-square place-items-center text-[12px] ${
            on && i + 1 === day ? "bg-forest font-bold text-ivory" : "bg-ink/5 text-slate"
          }`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}

export function Tick({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center gap-3 text-[15px]">
      <span
        aria-hidden
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
