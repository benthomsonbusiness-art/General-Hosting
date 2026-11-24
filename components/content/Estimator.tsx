"use client";

import { useState } from "react";

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

  const lowHours = Math.round(people * hours * WEEKS * CAPTURE_LOW);
  const highHours = Math.round(people * hours * WEEKS * CAPTURE_HIGH);

  return (
    <div data-surface="light" className="bg-stone p-6 md:p-9">
      <div className="grid gap-x-12 gap-y-8 xl:grid-cols-2">
        <div>
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
        <div className="border-t border-rule pt-7 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-12">
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
      </div>
      <p className="small mt-7 border-t border-rule pt-5 text-slate">
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
      <p className="mt-1 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-bold tracking-[-0.02em] text-forest tabular-nums">
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
