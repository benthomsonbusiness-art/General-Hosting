"use client";

import { useEffect, useState } from "react";

export type IndexItem = { id: string; label: string };

/** Sticky section list on desktop, a collapsible "On this page" below 1024px. */
export function InPageIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((item) => visible.has(item.id));
        if (first) {
          setActive(first.id);
          return;
        }
        // Above the first section nothing is in the band, so the first item is current.
        const top = document.getElementById(items[0]?.id ?? "");
        if (top && top.getBoundingClientRect().top > 0) setActive(items[0].id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    for (const item of items) {
      const target = document.getElementById(item.id);
      if (target) observer.observe(target);
    }
    return () => observer.disconnect();
  }, [items]);

  // Focus moves at once. scrollend does not fire when the page is already at the target.
  function moveFocus(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    window.setTimeout(() => target.focus({ preventScroll: true }), 0);
  }

  const list = (
    <ul className="border-l border-rule">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`-ml-px flex min-h-11 items-center border-l-2 py-1.5 pl-4 text-[14px] leading-snug ${
                current
                  ? "border-heading font-semibold text-heading"
                  : "border-transparent text-slate hover:text-heading"
              }`}
              onClick={() => moveFocus(item.id)}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav aria-label="On this page" data-print="hide">
      <div className="sticky top-[calc(var(--header-h)+2.5rem)] hidden lg:block">
        <p className="mb-3 text-[14px] font-bold text-heading">On this page</p>
        {list}
      </div>
      <details className="border-y border-rule lg:hidden">
        <summary className="flex min-h-12 items-center justify-between font-semibold text-heading">
          On this page
          <span aria-hidden>+</span>
        </summary>
        <div className="pb-4">{list}</div>
      </details>
    </nav>
  );
}
