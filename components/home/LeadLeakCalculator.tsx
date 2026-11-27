"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TradePreset = {
  slug: string;
  label: string;
  defaultMissed: number;
  defaultTicket: number;
};

const TRADES: TradePreset[] = [
  { slug: "hvac", label: "HVAC", defaultMissed: 8, defaultTicket: 680 },
  { slug: "plumbing", label: "Plumbing", defaultMissed: 9, defaultTicket: 520 },
  { slug: "electrical", label: "Electrical", defaultMissed: 7, defaultTicket: 460 },
  { slug: "roofing", label: "Roofing", defaultMissed: 5, defaultTicket: 2200 },
];

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Interactive calculator letting service business owners estimate missed-call and slow-lead
 * recovery using their own weekly volume and typical job size.
 */
export function LeadLeakCalculator() {
  const [trade, setTrade] = useState<TradePreset>(TRADES[0]);
  const [missedPerWeek, setMissedPerWeek] = useState(TRADES[0].defaultMissed);
  const [jobValue, setJobValue] = useState(TRADES[0].defaultTicket);

  function chooseTrade(next: TradePreset) {
    setTrade(next);
    setMissedPerWeek(next.defaultMissed);
    setJobValue(next.defaultTicket);
  }

  const monthlyLeads = Math.round(missedPerWeek * 4.33);
  const rescuedJobs = Math.max(1, Math.round(monthlyLeads * 0.34));
  const monthlyValue = rescuedJobs * jobValue;
  const hoursSaved = Math.max(2, Math.round((monthlyLeads * 7) / 60));
  const formattedTicket = CURRENCY.format(jobValue);
  const formattedMonthly = CURRENCY.format(monthlyValue);
  const auditHref = `/contact?practice=missed-calls&trade=${trade.slug}&missed=${missedPerWeek}`;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="small font-semibold tracking-[0.08em] text-violet-hi uppercase">Run your own numbers</p>
        <h2 id="calculator" className="h2 mt-2 max-w-[18ch]">
          What missed calls cost a busy week
        </h2>
        <p className="mt-3 max-w-[38rem] text-muted">
          Pick your trade and slide to match a normal week. The math uses your own job size, assuming roughly one in
          three fast text-backs turns into a booked visit.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose your trade">
          {TRADES.map((item) => {
            const active = item.slug === trade.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => chooseTrade(item)}
                aria-pressed={active}
                className={`min-h-10 rounded-[6px] px-4 text-[14px] font-semibold transition ${
                  active ? "bg-ivory text-obsidian" : "border border-line text-ivory hover:border-ivory"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid gap-5 max-w-[36rem]">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="calc-missed" className="text-[15px] font-medium text-ivory">
                Missed calls and slow web leads a week
              </label>
              <span className="font-mono text-[16px] font-semibold text-violet-hi tabular-nums">
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
                Your typical booked job size
              </label>
              <span className="font-mono text-[16px] font-semibold text-violet-hi tabular-nums">
                {formattedTicket}
              </span>
            </div>
            <input
              id="calc-ticket"
              type="range"
              min={180}
              max={3500}
              step={20}
              value={jobValue}
              onChange={(event) => setJobValue(Number(event.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="repo-panel p-6 sm:p-7 lg:col-span-5" aria-live="polite">
        <p className="small font-semibold tracking-[0.08em] text-muted uppercase">
          Estimated monthly impact ({trade.label})
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 border-b border-line pb-5">
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-cyan tabular-nums">
              ~{rescuedJobs}
            </p>
            <p className="mt-1 text-[14px] text-muted">extra booked jobs a month</p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-ivory tabular-nums">
              ~{hoursSaved} hrs
            </p>
            <p className="mt-1 text-[14px] text-muted">saved on phone tag</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[14px] text-muted">Job value kept off competitors&apos; trucks</p>
          <p className="mt-1 font-mono text-3xl sm:text-4xl font-semibold text-gold tabular-nums">
            {formattedMonthly} / mo
          </p>
          <p className="mt-2 text-[12px] text-muted">
            Estimate from your sliders ({monthlyLeads} leads a month). Your booking audit maps your real call log.
          </p>
        </div>

        <Link href={auditHref} className="copper-key mt-6 flex min-h-12 w-full items-center justify-center gap-2 px-4 text-[15px] font-semibold">
          <span>Audit my {trade.label} bookings</span>
          <ArrowRight aria-hidden size={17} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
