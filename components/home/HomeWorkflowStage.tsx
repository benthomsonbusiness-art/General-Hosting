"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

export type WorkflowTabSlot = {
  id: string;
  title: string;
  summary: string;
  player: ReactNode;
};

/**
 * Tactile workflow channel switcher on the home page.
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
        <Link
          href={`/workflows/${current.id}`}
          className="text-link inline-flex min-h-11 items-center gap-1.5 text-[15px] text-ivory"
        >
          <span>Full breakdown</span>
          <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} className="text-gold" />
        </Link>
      </div>

      <div role="tablist" aria-label="Choose a workflow" className="mt-6 flex gap-2.5 overflow-x-auto pb-1">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(index)}
              className="tab-chip min-h-11 shrink-0 px-4 text-[15px] font-semibold"
            >
              <span
                aria-hidden
                className={`font-mono text-[12px] ${selected ? "text-gold-ink" : "text-muted"}`}
              >
                0{index + 1}
              </span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-w-0">{current.player}</div>
    </div>
  );
}
