"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export type WorkflowTabSlot = {
  id: string;
  title: string;
  summary: string;
  player: ReactNode;
};

/**
 * Clean workflow switcher on the home page with zero redundant kickers or duplicate paragraphs.
 */
export function HomeWorkflowStage({ items }: { items: WorkflowTabSlot[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex] ?? items[0];

  if (!current) return null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="hero-flow" className="h2">
          How a missed booking turns into a full class
        </h2>
        <Link href={`/workflows/${current.id}`} className="text-link inline-flex min-h-11 items-center text-[15px]">
          Full breakdown →
        </Link>
      </div>

      <div role="tablist" aria-label="Choose a workflow" className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(index)}
              className={`min-h-11 shrink-0 rounded-[6px] px-4 text-[15px] font-semibold transition ${
                selected ? "bg-ivory text-obsidian" : "border border-line bg-obsidian text-ivory hover:border-ivory"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-w-0">{current.player}</div>
    </div>
  );
}
