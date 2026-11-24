"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { InsightCard } from "@/components/cards/Cards";
import { INSIGHT_TYPES, type Insight } from "@/content/insights";

export type Facet = { key: "type" | "service" | "industry"; label: string; options: { value: string; label: string }[] };

const PAGE_SIZE = 9;

function matches(insight: Insight, filters: Record<string, string>, query: string): boolean {
  if (filters.type && insight.type !== filters.type) return false;
  if (filters.service && !insight.services.includes(filters.service)) return false;
  if (filters.industry && !insight.industries.includes(filters.industry)) return false;
  if (!query) return true;
  const text = [insight.title, insight.dek, INSIGHT_TYPES[insight.type], ...insight.topics].join(" ").toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((term) => text.includes(term));
}

export function InsightExplorer(props: { insights: Insight[]; facets: Facet[] }) {
  return (
    <Suspense fallback={<Results insights={props.insights} />}>
      <Filtered {...props} />
    </Suspense>
  );
}

function Filtered({ insights, facets }: { insights: Insight[]; facets: Facet[] }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // The URL is the state. Unknown values are ignored.
  const filters: Record<string, string> = {};
  for (const facet of facets) {
    const value = params.get(facet.key);
    if (value && facet.options.some((option) => option.value === value)) filters[facet.key] = value;
  }
  const query = params.get("q") ?? "";
  const results = insights.filter((insight) => matches(insight, filters, query));
  // Uncontrolled while typing. Follows the URL when it changes from elsewhere, such as the menu.
  useEffect(() => {
    const input = searchRef.current;
    if (input && document.activeElement !== input) input.value = query;
  }, [query]);

  const active = Object.keys(filters).length > 0 || query !== "";

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    setLimit(PAGE_SIZE);
    const search = next.toString();
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <label htmlFor="insight-search" className="mb-2 block font-semibold text-forest">
          Search insights
        </label>
        <input
          id="insight-search"
          type="search"
          autoComplete="off"
          className="field"
          ref={searchRef}
          defaultValue={query}
          onChange={(event) => update("q", event.target.value.trim() || null)}
        />
        {facets.map((facet) => (
          <fieldset key={facet.key} className="mt-7">
            <legend className="mb-2.5 font-semibold text-forest">{facet.label}</legend>
            <div className="flex flex-wrap gap-2">
              {facet.options.map((option) => {
                const on = filters[facet.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={on}
                    className={`min-h-11 border px-3 py-1.5 text-left text-[14px] font-medium leading-snug ${
                      on ? "border-forest bg-forest text-ivory" : "border-ink/40 text-ink hover:border-forest hover:bg-stone"
                    }`}
                    onClick={() => update(facet.key, on ? null : option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="lg:col-span-9">
        <div className="mb-7 flex min-h-11 flex-wrap items-center justify-between gap-4 border-b border-rule pb-3">
          <p role="status" className="font-semibold text-forest">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          {active ? (
            <button
              type="button"
              className="text-link min-h-11"
              onClick={() => window.history.replaceState(null, "", pathname)}
            >
              Clear all
            </button>
          ) : null}
        </div>
        {results.length > 0 ? (
          <Results insights={results.slice(0, limit)} />
        ) : (
          <p className="text-muted">Nothing matches those filters. Clear them to see every insight.</p>
        )}
        {results.length > limit ? (
          <button type="button" className="btn btn-secondary mt-10" onClick={() => setLimit(limit + PAGE_SIZE)}>
            Show more
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Results({ insights }: { insights: Insight[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight) => (
        <li key={insight.slug}>
          <InsightCard insight={insight} />
        </li>
      ))}
    </ul>
  );
}
