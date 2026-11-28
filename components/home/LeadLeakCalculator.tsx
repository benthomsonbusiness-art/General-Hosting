"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

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

const METER_SEGMENTS = Array.from({ length: 20 }, (_, i) => i);

/**
 * Missed-bookings calculator centered on gyms & studios first, with tactile illuminated faders
 * and a live dynamic recovery meter.
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

  const missedPct = Math.round(((missedPerWeek - 1) / (35 - 1)) * 100);
  const ticketPct = Math.round(((bookingValue - 100) / (3500 - 100)) * 100);
  const activeBars = Math.min(20, Math.max(2, Math.round((rescuedBookings / 53) * 20)));

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
                className="tab-chip min-h-10 px-3.5 text-[14px] font-semibold"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid max-w-[38rem] gap-7">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="calc-missed" className="text-[15px] font-medium text-ivory">
                Missed calls and slow web leads a week
              </label>
              <span className="rounded-[6px] border border-[rgb(251_246_241_/_0.14)] bg-[#0b0604] px-2.5 py-0.5 font-mono text-[15px] font-semibold text-ivory tabular-nums">
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
              style={{ "--range-pct": `${missedPct}%` } as CSSProperties}
              className="mt-2"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="calc-ticket" className="text-[15px] font-medium text-ivory">
                Value of a new member or booking
              </label>
              <span className="rounded-[6px] border border-[rgb(251_246_241_/_0.14)] bg-[#0b0604] px-2.5 py-0.5 font-mono text-[15px] font-semibold text-ivory tabular-nums">
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
              style={{ "--range-pct": `${ticketPct}%` } as CSSProperties}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="repo-panel p-6 sm:p-8 lg:col-span-5" aria-live="polite">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4 text-[12.5px]">
          <span className="inline-flex items-center gap-2 font-mono text-ivory">
            <TrendingUp aria-hidden size={15} className="text-gold" />
            Monthly recovery estimate
          </span>
          <span className="font-mono text-muted tabular-nums">{monthlyLeads} leads / mo</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-6">
          <div className="rounded-[8px] border border-[rgb(251_246_241_/_0.1)] bg-[#0b0604] p-3.5">
            <p className="font-mono text-3xl font-semibold text-ivory tabular-nums sm:text-4xl">
              ~{rescuedBookings}
            </p>
            <p className="mt-1 text-[13.5px] text-muted">bookings kept a month</p>
          </div>
          <div className="rounded-[8px] border border-[rgb(251_246_241_/_0.1)] bg-[#0b0604] p-3.5">
            <p className="font-mono text-3xl font-semibold text-ivory tabular-nums sm:text-4xl">
              ~{hoursSaved} hrs
            </p>
            <p className="mt-1 text-[13.5px] text-muted">saved on back-and-forth</p>
          </div>
        </div>

        <div className="mt-5 rounded-[10px] border border-[rgb(255_107_74_/_0.32)] bg-[linear-gradient(180deg,#20120c,#0e0805)] p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13.5px] text-muted">Monthly bookings recovered</p>
            <span className="font-mono text-[11.5px] text-cyan">{preset.label}</span>
          </div>
          <p className="mt-1 font-mono text-3xl font-semibold text-gold tabular-nums sm:text-4xl">
            {formattedMonthly} / mo
          </p>
          <div className="mt-3.5 grid grid-cols-20 gap-1" aria-hidden>
            {METER_SEGMENTS.map((idx) => (
              <span
                key={idx}
                className={`h-2 rounded-[2px] transition-colors ${
                  idx < activeBars
                    ? idx >= activeBars - 2
                      ? "bg-gold shadow-[0_0_8px_#ff6b4a]"
                      : "bg-[linear-gradient(180deg,#fde047,#f97316)]"
                    : "bg-[rgb(251_246_241_/_0.1)]"
                }`}
              />
            ))}
          </div>
        </div>

        <Link
          href={auditHref}
          className="copper-key mt-6 flex min-h-12 w-full items-center justify-center gap-2 px-4 text-[15px] font-semibold"
        >
          <span>Request a booking audit</span>
          <ArrowRight aria-hidden size={17} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
