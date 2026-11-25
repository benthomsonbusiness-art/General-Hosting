"use client";

import { useState } from "react";

function formatInt(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

/** Hours only. No rate and no capture percentage. */
export function Estimator() {
  const [people, setPeople] = useState(6);
  const [hours, setHours] = useState(5);
  const yearly = people * hours * 48;
  const span = 25 * 10 * 48;

  return (
    <div data-surface="light" className="border border-ink/15 bg-ivory p-6 text-ink md:p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Slider
            id="estimate-people"
            label="People touching the workflow"
            hint="Everyone who routes, formats, copies or re-enters the work."
            min={1}
            max={25}
            value={people}
            onChange={setPeople}
          />
          <Slider
            id="estimate-hours"
            label="Hours per person per week"
            hint="Manual routing, formatting and entry on this one workflow."
            min={1}
            max={10}
            value={hours}
            onChange={setHours}
          />
        </div>
        <div>
          <p className="text-slate">Hours a year on this workflow</p>
          <p className="mt-2 font-display text-[clamp(2rem,1.4rem+1.6vw,3rem)] leading-none tracking-[-0.02em] text-ink">
            {formatInt(yearly)}
          </p>
          <div className="mt-6 h-2 overflow-hidden bg-ink/10" aria-hidden>
            <div
              className="h-full origin-left bg-forest"
              style={{ transform: `scaleX(${Math.min(1, yearly / span)})` }}
            />
          </div>
          <p className="mt-4 text-[15px] text-slate">
            {people} people, {hours} hours a week, 48 weeks.
          </p>
        </div>
      </div>
      <p className="small mt-8 border-t border-ink/12 pt-5 text-slate">
        An illustrative reading of the hours on this one workflow. Not a measured result.
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
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="mt-6 block first:mt-0">
      <span className="block font-semibold">{label}</span>
      <span className="mt-1 block text-[15px] text-slate">{hint}</span>
      <span className="mt-2 block text-[1.25rem]">{value}</span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
