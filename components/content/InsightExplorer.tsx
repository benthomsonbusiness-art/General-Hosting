"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { InsightCard } from "@/components/cards/Cards";
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
      <div className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-2">
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          {options.map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={type === value}
              className={`min-h-11 px-4 text-[15px] font-semibold ${
                type === value ? "bg-forest text-ivory" : "bg-stone text-ink hover:bg-ink/10"
              }`}
              onClick={() =>
                window.history.replaceState(null, "", value ? `${pathname}?type=${value}` : pathname)
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p role="status" className="sr-only">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      </div>
      <Results insights={results} />
    </>
  );
}

function Results({ insights }: { insights: Insight[] }) {
  const [first, ...rest] = insights;
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-3">
      {first ? (
        <li className="md:col-span-3">
          <InsightCard insight={first} lead />
        </li>
      ) : null}
      {rest.map((insight) => (
        <li key={insight.slug}>
          <InsightCard insight={insight} />
        </li>
      ))}
    </ul>
  );
}
