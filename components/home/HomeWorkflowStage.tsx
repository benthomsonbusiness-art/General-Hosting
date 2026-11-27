"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

export type WorkflowTabSlot = {
  id: string;
  title: string;
  summary: string;
  player: ReactNode;
};

/**
 * Home workflow explorer switching between server-rendered FlowPlayer + FlowDiagram slots.
 */
export function HomeWorkflowStage({ items }: { items: WorkflowTabSlot[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex] ?? items[0];

  if (!current) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="small font-semibold tracking-[0.08em] text-violet-hi uppercase">Interactive workflow stage</p>
          <h2 id="hero-flow" className="h2 mt-2">
            Watch a job move from lead to schedule
          </h2>
        </div>
        <Link href={`/workflows/${current.id}`} className="text-link inline-flex min-h-11 items-center gap-1.5">
          <span>Read every step of {current.title.toLowerCase()}</span>
          <ArrowRight aria-hidden size={16} strokeWidth={1.75} />
        </Link>
      </div>

      <div role="tablist" aria-label="Choose a workflow to test" className="mt-6 flex gap-2 overflow-x-auto pb-1">
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

      <p className="mt-4 max-w-[46rem] text-muted">{current.summary}</p>

      <div className="mt-6 min-w-0">{current.player}</div>
    </div>
  );
}
