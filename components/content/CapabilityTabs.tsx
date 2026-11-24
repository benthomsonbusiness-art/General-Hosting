"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Capability } from "@/content/services";

/** ARIA tabs. Every panel stays in the HTML, so the text is indexable. */
export function CapabilityTabs({ items, label }: { items: Capability[]; label: string }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKey(event: KeyboardEvent) {
    const last = items.length - 1;
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = selected === last ? 0 : selected + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = selected === 0 ? last : selected - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="grid border border-rule md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="flex flex-col border-b border-rule md:border-r md:border-b-0"
        onKeyDown={onKey}
      >
        {items.map((item, index) => {
          const active = index === selected;
          return (
            <button
              key={item.title}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`capability-tab-${index}`}
              aria-selected={active}
              aria-controls={`capability-panel-${index}`}
              tabIndex={active ? 0 : -1}
              className={`min-h-14 border-b border-l-4 border-b-rule px-5 py-3 text-left font-semibold last:border-b-0 ${
                active
                  ? "border-l-gold-ink bg-stone text-forest"
                  : "border-l-transparent text-ink hover:bg-stone/50"
              }`}
              onClick={() => setSelected(index)}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={item.title}
          role="tabpanel"
          id={`capability-panel-${index}`}
          aria-labelledby={`capability-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
          className="px-6 py-7 md:px-9 md:py-9"
        >
          <h3 className="h3">{item.problem}</h3>
          <p className="mt-3">{item.what}</p>
          <p className="mt-6 font-bold text-forest">What you get</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-gold-ink">
            {item.get.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
