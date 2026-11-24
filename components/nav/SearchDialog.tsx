"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type RefObject } from "react";
import { loadSearchIndex, search, type SearchEntry } from "@/lib/search";

/** A modal <dialog>: the browser supplies the focus trap, Escape and an inert page. */
export function SearchDialog({
  dialogRef,
  onNavigate,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onNavigate: () => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  // The index is fetched when the dialog first opens, not with the page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const observer = new MutationObserver(() => {
      if (!dialog.open) return;
      loadSearchIndex().then(
        (entries) => {
          setIndex(entries);
          setFailed(false);
        },
        () => setFailed(true),
      );
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, [dialogRef]);

  const results = index ? search(index, query, 8) : [];
  const searched = query.trim().length > 0 && index !== null;

  function close() {
    dialogRef.current?.close();
  }

  function follow() {
    close();
    onNavigate();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      data-surface="light"
      className="m-0 max-h-[100dvh] w-full max-w-none bg-ivory p-0 backdrop:bg-obsidian/60"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="wrap max-w-[56rem] py-6 md:py-10">
        <form action="/search" role="search" className="flex items-center gap-3 border-b-2 border-forest">
          <Search size={22} strokeWidth={1.5} aria-hidden className="shrink-0 text-forest" />
          <label htmlFor="site-search" className="sr-only">
            Search the site
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Search services, workflows and insights"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // A search input clears on Escape first. One press should close the dialog.
              if (event.key !== "Escape") return;
              event.preventDefault();
              close();
            }}
            className="min-h-14 w-full bg-transparent text-[18px] placeholder:text-slate focus-visible:outline-none md:text-[20px]"
          />
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-forest"
            aria-label="Close search"
            onClick={close}
          >
            <X strokeWidth={1.5} aria-hidden />
          </button>
        </form>

        <p className="sr-only" role="status">
          {searched ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
        </p>

        {failed ? (
          <p className="mt-6 text-slate">
            Search could not be loaded. Press Enter to open the search page, or use the menu.
          </p>
        ) : null}

        {searched && results.length > 0 ? (
          <ul className="mt-3">
            {results.map((entry) => (
              <li key={entry.url} className="border-b border-rule">
                <Link href={entry.url} className="group block py-3.5" onClick={follow}>
                  <span className="eyebrow">{entry.type}</span>
                  <span className="card-title mt-0.5 block font-semibold text-forest">{entry.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                className="arrow-link mt-3 min-h-11 items-center"
                onClick={follow}
              >
                See all results
              </Link>
            </li>
          </ul>
        ) : null}

        {searched && results.length === 0 ? (
          <p className="mt-6 text-slate">
            No results for that search. Try the{" "}
            <Link href="/workflows" className="text-link" onClick={follow}>
              workflow explorer
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-link" onClick={follow}>
              contact the firm
            </Link>
            .
          </p>
        ) : null}
      </div>
    </dialog>
  );
}
