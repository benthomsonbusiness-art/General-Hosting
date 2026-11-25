"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HardwareFrame } from "@/components/media/HardwareFrame";
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
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {options.map(([value, label]) => (
          <button
            key={label}
            type="button"
            aria-pressed={type === value}
            className={`min-h-11 rounded-[6px] px-4 ${
              type === value ? "bg-ivory text-obsidian" : "border border-line"
            }`}
            onClick={() => window.history.replaceState(null, "", value ? `${pathname}?type=${value}` : pathname)}
          >
            {label}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {results.length} {results.length === 1 ? "piece" : "pieces"}
      </p>
      <Results insights={results} />
    </>
  );
}

function Results({ insights }: { insights: Insight[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {insights.map((insight) => (
        <li key={insight.slug}>
          <Link href={`/insights/${insight.slug}`} className="grid items-center gap-6 py-6 lg:grid-cols-12">
            <span className="lg:col-span-4">
              <HardwareFrame
                src={insight.image.src}
                alt={insight.image.alt}
                width={1920}
                height={1080}
                sizes="(min-width: 1024px) 28vw, 100vw"
              />
            </span>
            <span className="lg:col-span-8">
              <span className="text-[15px] text-muted">{INSIGHT_TYPES[insight.type]}</span>
              <span className="card-title mt-2 block text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-tight">
                {insight.title}
              </span>
              <span className="mt-2 block text-muted">{insight.dek}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
