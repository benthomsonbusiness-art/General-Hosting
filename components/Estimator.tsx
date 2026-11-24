"use client";

import { useMemo, useState } from "react";

const CAPTURE_LOW = 0.6;
const CAPTURE_HIGH = 0.75;
const WEEKS = 48;

function formatInt(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function formatMoney(value: number) {
  return `$${formatInt(value)}`;
}

export function Estimator() {
  const [people, setPeople] = useState(6);
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(85);

  const figures = useMemo(() => {
    const lowHours = Math.round(people * hours * WEEKS * CAPTURE_LOW);
    const highHours = Math.round(people * hours * WEEKS * CAPTURE_HIGH);
    return {
      lowHours,
      highHours,
      lowValue: lowHours * rate,
      highValue: highHours * rate,
    };
  }, [people, hours, rate]);

  return (
    <section data-surface="light" className="bg-[#EDE7DA] text-[#1A1E1B]" aria-labelledby="drag-heading">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="font-mono text-[12px] tracking-[0.16em] text-gold-ink uppercase">
              Operational drag
            </p>
            <h2
              id="drag-heading"
              className="mt-4 font-display text-[clamp(2.5rem,4vw,3.7rem)] leading-[1.02] font-medium tracking-[-0.02em] text-[#133224]"
            >
              An illustrative reading of the hours.
            </h2>
            <p className="mt-6 text-[16px] leading-7 text-[#4F5752]">
              Move the sliders to the size of one workflow. The figures apply a 60 to 75 percent
              capture range to hours the team already spends. They are arithmetic, labeled as an
              illustrative estimate.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Slider
              id="people"
              label="People touching the workflow"
              hint="Everyone who routes, formats, copies, or re-enters the work."
              min={1}
              max={25}
              step={1}
              value={people}
              display={String(people)}
              onChange={setPeople}
            />
            <Slider
              id="hours"
              label="Hours lost per person per week"
              hint="Manual routing, formatting, and entry on this one workflow."
              min={1}
              max={10}
              step={1}
              value={hours}
              display={String(hours)}
              onChange={setHours}
            />
            <Slider
              id="rate"
              label="Blended hourly cost"
              hint="Loaded cost of the people in the loop."
              min={30}
              max={200}
              step={5}
              value={rate}
              display={formatMoney(rate)}
              onChange={setRate}
            />
          </div>
        </div>

        <div className="mt-12 grid border-t border-[rgba(19,50,36,0.14)] md:grid-cols-2">
          <div className="border-b border-[rgba(19,50,36,0.14)] py-8 md:border-r md:border-b-0 md:pr-10">
            <p className="font-sans text-[12px] text-[#4F5752]">Hours that could be reclaimed per year</p>
            <p className="mt-4 font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-none font-medium tracking-[-0.02em] text-[#133224]">
              {formatInt(figures.lowHours)}–{formatInt(figures.highHours)}
            </p>
          </div>
          <div className="py-8 md:pl-10">
            <p className="font-sans text-[12px] text-[#4F5752]">Illustrative annual capacity value</p>
            <p className="mt-4 font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-none font-medium tracking-[-0.02em] text-[#133224]">
              {formatMoney(figures.lowValue)}–{formatMoney(figures.highValue)}
            </p>
          </div>
        </div>
        <p className="mt-8 font-mono text-[12px] leading-6 text-[#4F5752]">
          round({people} × {hours} × {WEEKS} × 0.60) = {formatInt(figures.lowHours)} hours
          <br />
          round({people} × {hours} × {WEEKS} × 0.75) = {formatInt(figures.highHours)} hours
          <br />
          {formatInt(figures.lowHours)} × {formatMoney(rate)} = {formatMoney(figures.lowValue)}
          <br />
          {formatInt(figures.highHours)} × {formatMoney(rate)} = {formatMoney(figures.highValue)}
        </p>
        <p className="mt-4 max-w-2xl text-[14px] leading-6 text-[#4F5752]">
          Illustrative estimate. The capture range is an assumption, not a measured result from
          your business.
        </p>
      </div>
    </section>
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
    <div className="border-t border-[rgba(19,50,36,0.14)] py-6">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-display text-[1.65rem] leading-none text-[#133224]">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[13px] text-[#133224]">
          {display}
        </output>
      </div>
      <p id={`${id}-hint`} className="mt-2 text-[14px] text-[#4F5752]">
        {hint}
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={display}
        aria-describedby={`${id}-hint`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
