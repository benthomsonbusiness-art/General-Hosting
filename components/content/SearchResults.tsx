"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { loadSearchIndex, search, SEARCH_GROUPS, type SearchEntry } from "@/lib/search";

export function SearchResults() {
  return (
    <Suspense fallback={<SearchForm initial="" />}>
      <FromQuery />
    </Suspense>
  );
}

/** A plain GET form, so it submits without JavaScript. */
function SearchForm({ initial }: { initial: string }) {
  return (
    <form action="/search" role="search" className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1 basis-64">
        <label htmlFor="q" className="mb-2 block font-semibold text-heading">
          Search terms
        </label>
        <input key={initial} id="q" name="q" type="search" defaultValue={initial} className="field" />
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}

function FromQuery() {
  const query = (useSearchParams().get("q") ?? "").trim();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSearchIndex().then(
      (entries) => mounted && setIndex(entries),
      () => mounted && setFailed(true),
    );
    return () => {
      mounted = false;
    };
  }, []);

  const results = index ? search(index, query) : [];

  return (
    <>
      <SearchForm initial={query} />
      <p role="status" className="mt-8 font-semibold text-heading">
        {failed
          ? "Search could not be loaded. Use the menu, or reload the page to try again."
          : query === ""
            ? "Enter a word or two to search services, workflows and industries."
            : index === null
              ? "Searching…"
              : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
      </p>

      {query !== "" && index !== null && results.length === 0 ? (
        <p className="mt-4 max-w-[40rem]">
          Nothing matched. See the{" "}
          <Link href="/workflows" className="text-link">
            example workflows
          </Link>
          , or{" "}
          <Link href="/contact" className="text-link">
            tell us about your process
          </Link>
          .
        </p>
      ) : null}

      {SEARCH_GROUPS.map((group) => {
        const entries = results.filter((entry) => entry.type === group.type);
        if (entries.length === 0) return null;
        return (
          <section key={group.type} aria-labelledby={`group-${group.type}`} className="mt-10">
            <h2 id={`group-${group.type}`} className="h4">
              {group.heading}
            </h2>
            <ul className="mt-3 border-t border-rule">
              {entries.map((entry) => (
                <li key={entry.url} className="border-b border-rule">
                  <Link href={entry.url} className="group block py-4">
                    <span className="card-title block font-semibold text-heading">{entry.title}</span>
                    <span className="mt-1 block text-muted">{entry.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
