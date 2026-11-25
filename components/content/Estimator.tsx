"use client";

import Image from "next/image";
import { useState } from "react";
import { useMotion } from "@/components/workflow/hooks";

const CAPTURE_LOW = 0.6;
const CAPTURE_HIGH = 0.75;
const WEEKS = 48;

function formatInt(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function formatMoney(value: number) {
  return `$${formatInt(value)}`;
}

/** The value is computed from rounded hours, so the shown arithmetic always reconciles. */
export function Estimator() {
  const [people, setPeople] = useState(6);
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(85);
  const [motion] = useMotion();

  const lowHours = Math.round(people * hours * WEEKS * CAPTURE_LOW);
  const highHours = Math.round(people * hours * WEEKS * CAPTURE_HIGH);

  const sheetCount = Math.min(20, Math.max(3, Math.round(highHours / 450)));

  return (
    <div
      data-surface="light"
      className="border border-ink/15 bg-paper p-6 shadow-[0_24px_60px_-28px_rgba(11,31,22,0.16)] md:p-10"
    >
      <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Slider
            id="estimate-people"
            label="People touching the workflow"
            hint="Everyone who routes, formats, copies or re-enters the work."
            min={1}
            max={25}
            step={1}
            value={people}
            display={String(people)}
            onChange={setPeople}
          />
          <Slider
            id="estimate-hours"
            label="Hours lost per person per week"
            hint="Manual routing, formatting and entry on this one workflow."
            min={1}
            max={10}
            step={1}
            value={hours}
            display={String(hours)}
            onChange={setHours}
          />
          <Slider
            id="estimate-rate"
            label="Blended hourly cost"
            hint="Loaded cost of the people involved."
            min={30}
            max={200}
            step={5}
            value={rate}
            display={formatMoney(rate)}
            onChange={setRate}
          />
        </div>

        <div className="grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-12 lg:col-span-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div className="sm:col-span-7">
            <Figure label="Hours that could be reclaimed per year">
              {formatInt(lowHours)}–{formatInt(highHours)}
            </Figure>
            <Figure label="Illustrative annual capacity value">
              {formatMoney(lowHours * rate)}–{formatMoney(highHours * rate)}
            </Figure>
            <p className="text-[14px] leading-7 text-slate tabular-nums">
              {people} × {hours} × {WEEKS} weeks × 0.60 = {formatInt(lowHours)} hours
              <br />
              {people} × {hours} × {WEEKS} weeks × 0.75 = {formatInt(highHours)} hours
              <br />
              Hours × {formatMoney(rate)} = {formatMoney(lowHours * rate)} to {formatMoney(highHours * rate)}
            </p>
          </div>

          <div
            aria-hidden
            className="relative flex min-h-[15rem] flex-col justify-end overflow-hidden bg-obsidian p-5 sm:col-span-5"
          >
            <Image
              src="/images/texture-green.jpg"
              alt=""
              fill
              sizes="260px"
              className="object-cover opacity-50"
            />
            <div className="relative z-10 flex items-center justify-between text-ivory/70">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Reclaimed volume</span>
              <span className="font-mono text-[11px] tabular-nums">{sheetCount} batches</span>
            </div>
            <div className="relative z-10 mt-auto h-44 w-full pt-4">
              {Array.from({ length: sheetCount }).map((_, index) => {
                const depth = index * 5;
                const tilt = motion ? ((index % 5) - 2) * 0.9 : 0;
                const offsetX = ((index % 3) - 1) * 3;
                const isTop = index === sheetCount - 1;
                return (
                  <span
                    key={index}
                    style={{
                      transform: `translate(${offsetX}px, -${depth}px) rotate(${tilt}deg)`,
                      transition: motion ? "transform 280ms var(--ease-paper), opacity 220ms ease" : "none",
                    }}
                    className={`absolute right-3 bottom-2 left-3 block h-14 border ${
                      isTop
                        ? "border-forest/35 bg-paper shadow-[0_-2px_0_rgba(19,50,36,0.28),0_-6px_14px_rgba(11,31,22,0.4)]"
                        : index % 2 === 0
                          ? "border-forest/25 bg-ivory shadow-[0_-1px_0_rgba(19,50,36,0.24)]"
                          : "border-ink/25 bg-[#EFECE3] shadow-[0_-1px_0_rgba(19,50,36,0.2)]"
                    }`}
                  >
                    {isTop ? (
                      <span className="flex h-full items-center justify-between px-3.5">
                        <span className="h-px w-1/2 bg-ink/25" />
                        <span className="font-mono text-[10px] text-forest tabular-nums">{formatInt(highHours)} h</span>
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="small mt-8 border-t border-ink/12 pt-5 text-slate">
        An illustrative reading of the hours. The 60 to 75 percent capture range is an assumption, not a
        measured result from your business or anyone else&apos;s.
      </p>
    </div>
  );
}

function Figure({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="small text-slate">{label}</p>
      <p className="mt-1 font-display text-[clamp(1.85rem,1.35rem+1.6vw,2.65rem)] leading-none font-medium tracking-[-0.02em] text-forest tabular-nums">
        {children}
      </p>
    </div>
  );
}

function Slider({
  id,
  label,
  hint,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-semibold text-forest">
          {label}
        </label>
        <output htmlFor={id} className="font-bold text-forest tabular-nums">
          {display}
        </output>
      </div>
      <p id={`${id}-hint`} className="text-[14px] text-slate">
        {hint}
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        aria-describedby={`${id}-hint`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
