"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { InsightCard, insightMeta } from "@/components/cards/Cards";
import { INSIGHT_TYPES, type Insight, type InsightType } from "@/content/insights";

export function InsightExplorer({ insights }: { insights: Insight[] }) {
  return (
    <Suspense fallback={<Results insights={insights} />}>
      <Filtered insights={insights} />
    </Suspense>
  );
}

function Filtered({ insights }: { insights: Insight[] }) {
  const raw = useSearchParams().get("type");
  const pathname = usePathname();
  const type = raw && raw in INSIGHT_TYPES ? (raw as InsightType) : null;
  const results = type ? insights.filter((item) => item.type === type) : insights;
  const options: [InsightType | null, string][] = [
    [null, "All"],
    ...(Object.entries(INSIGHT_TYPES) as [InsightType, string][]),
  ];

  return (
    <>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 py-3">
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          {options.map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={type === value}
              className={`min-h-11 px-4 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors ${
                type === value
                  ? "bg-forest font-semibold text-ivory"
                  : "border border-ink/15 bg-paper text-ink hover:border-forest hover:text-forest"
              }`}
              onClick={() =>
                window.history.replaceState(null, "", value ? `${pathname}?type=${value}` : pathname)
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p role="status" className="font-mono text-[12px] text-slate">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
      </div>
      <Results insights={results} />
    </>
  );
}

function Results({ insights }: { insights: Insight[] }) {
  const [first, ...rest] = insights;
  const restSpans =
    rest.length === 1
      ? ["md:col-span-8"]
      : rest.length === 2
        ? ["md:col-span-7", "md:col-span-5"]
        : ["md:col-span-5", "md:col-span-4", "md:col-span-3"];

  return (
    <div className="space-y-16">
      {first ? (
        <article className="border-b border-ink/15 pb-14">
          <Link href={`/insights/${first.slug}`} className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <ViewTransition name={`insight-${first.slug}`} share="morph" default="none">
              <span className="relative block aspect-[16/10] overflow-hidden bg-obsidian lg:col-span-7">
                <Image
                  src={first.image.src}
                  alt={first.image.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="zoom object-cover"
                  style={{ objectPosition: first.image.position }}
                />
              </span>
            </ViewTransition>
            <div className="lg:col-span-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">
                Lead feature · {INSIGHT_TYPES[first.type]}
              </span>
              <h2 className="card-title mt-3 font-display text-[clamp(2rem,1.45rem+1.8vw,3.1rem)] leading-[1.02] font-medium tracking-[-0.025em] text-ink">
                {first.title}
              </h2>
              <p className="mt-4 text-[1.1rem] leading-relaxed text-slate">{first.dek}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-4">
                <span className="font-mono text-[12px] text-slate">{insightMeta(first)}</span>
                <span className="arrow-link text-forest">Read</span>
              </div>
            </div>
          </Link>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-12">
          {rest.map((insight, index) => (
            <li key={insight.slug} className={restSpans[index % restSpans.length]}>
              <InsightCard insight={insight} tall={index === 0 || index === 2} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
