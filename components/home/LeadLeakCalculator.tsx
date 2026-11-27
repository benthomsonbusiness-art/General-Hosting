"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BusinessPreset = {
  slug: string;
  label: string;
  defaultMissed: number;
  defaultValue: number;
};

const PRESETS: BusinessPreset[] = [
  { slug: "gyms", label: "Gyms & studios", defaultMissed: 10, defaultValue: 220 },
  { slug: "recruiting", label: "Recruiting & staffing", defaultMissed: 8, defaultValue: 1200 },
  { slug: "events", label: "Events & entertainment", defaultMissed: 6, defaultValue: 1400 },
  { slug: "landscaping", label: "Landscaping & home services", defaultMissed: 8, defaultValue: 480 },
];

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Missed-bookings calculator centered on gyms & studios first, with zero clutter or fine print.
 */
export function LeadLeakCalculator() {
  const [preset, setPreset] = useState<BusinessPreset>(PRESETS[0]);
  const [missedPerWeek, setMissedPerWeek] = useState(PRESETS[0].defaultMissed);
  const [bookingValue, setBookingValue] = useState(PRESETS[0].defaultValue);

  function choosePreset(next: BusinessPreset) {
    setPreset(next);
    setMissedPerWeek(next.defaultMissed);
    setBookingValue(next.defaultValue);
  }

  const monthlyLeads = Math.round(missedPerWeek * 4.33);
  const rescuedBookings = Math.max(1, Math.round(monthlyLeads * 0.35));
  const monthlyValue = rescuedBookings * bookingValue;
  const hoursSaved = Math.max(2, Math.round((monthlyLeads * 7) / 60));
  const formattedValue = CURRENCY.format(bookingValue);
  const formattedMonthly = CURRENCY.format(monthlyValue);
  const auditHref = `/contact?practice=missed-calls&trade=${preset.slug}&missed=${missedPerWeek}`;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 id="calculator" className="h2 max-w-[18ch]">
          What missed bookings cost each month
        </h2>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Business type">
          {PRESETS.map((item) => {
            const active = item.slug === preset.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => choosePreset(item)}
                aria-pressed={active}
                className={`min-h-10 rounded-[6px] px-3.5 text-[14px] font-semibold transition ${
                  active ? "bg-ivory text-obsidian" : "border border-line text-ivory hover:border-ivory"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid max-w-[36rem] gap-6">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="calc-missed" className="text-[15px] font-medium text-ivory">
                Missed calls and slow web leads a week
              </label>
              <span className="font-mono text-[16px] font-semibold text-ivory tabular-nums">
                {missedPerWeek} / wk
              </span>
            </div>
            <input
              id="calc-missed"
              type="range"
              min={1}
              max={35}
              step={1}
              value={missedPerWeek}
              onChange={(event) => setMissedPerWeek(Number(event.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="calc-ticket" className="text-[15px] font-medium text-ivory">
                Value of a new member or booking
              </label>
              <span className="font-mono text-[16px] font-semibold text-ivory tabular-nums">
                {formattedValue}
              </span>
            </div>
            <input
              id="calc-ticket"
              type="range"
              min={100}
              max={3500}
              step={20}
              value={bookingValue}
              onChange={(event) => setBookingValue(Number(event.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="repo-panel p-6 sm:p-8 lg:col-span-5" aria-live="polite">
        <div className="grid grid-cols-2 gap-6 border-b border-line pb-6">
          <div>
            <p className="font-mono text-3xl font-semibold text-ivory tabular-nums sm:text-4xl">
              ~{rescuedBookings}
            </p>
            <p className="mt-1 text-[14px] text-muted">bookings kept a month</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-semibold text-ivory tabular-nums sm:text-4xl">
              ~{hoursSaved} hrs
            </p>
            <p className="mt-1 text-[14px] text-muted">saved on back-and-forth</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[14px] text-muted">Monthly bookings recovered</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-gold tabular-nums sm:text-4xl">
            {formattedMonthly} / mo
          </p>
        </div>

        <Link
          href={auditHref}
          className="copper-key mt-7 flex min-h-12 w-full items-center justify-center gap-2 px-4 text-[15px] font-semibold"
        >
          <span>Request a booking audit</span>
          <ArrowRight aria-hidden size={17} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
