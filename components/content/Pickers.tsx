"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type KeyboardEvent } from "react";
import { Thumb } from "@/components/workflow/Thumb";
import { METHOD } from "@/content/approach";
import type { Industry } from "@/content/industries";

function nextIndex(key: string, index: number, last: number): number {
  if (key === "ArrowDown" || key === "ArrowRight") return index === last ? 0 : index + 1;
  if (key === "ArrowUp" || key === "ArrowLeft") return index === 0 ? last : index - 1;
  if (key === "Home") return 0;
  if (key === "End") return last;
  return -1;
}

/** The method: pick a station, see what happens there. Every panel stays in the HTML. */
export function MethodStepper() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKey(event: KeyboardEvent) {
    const next = nextIndex(event.key, selected, METHOD.length - 1);
    if (next < 0) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="The method" className="relative grid grid-cols-4" onKeyDown={onKey}>
        <span aria-hidden className="absolute top-[13px] right-0 left-0 h-px bg-ivory/30" />
        {METHOD.map((step, index) => {
          const active = index === selected;
          return (
            <button
              key={step.title}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              id={`method-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`method-panel-${index}`}
              tabIndex={active ? 0 : -1}
              className="relative flex min-h-24 flex-col items-start pr-3 text-left"
              onClick={() => setSelected(index)}
            >
              <span
                aria-hidden
                className={`mt-[3px] h-5 w-5 rotate-45 border-2 ${index <= selected ? "border-gold bg-gold" : "border-ivory/60 bg-forest"}`}
              />
              <span
                className={`mt-5 font-display text-[clamp(1.35rem,0.9rem+2vw,2.5rem)] leading-none ${active ? "text-gold" : "text-ivory"}`}
              >
                {step.title}
              </span>
              <span className="mt-2 hidden text-[15px] text-ivory/80 sm:block">{step.line}</span>
            </button>
          );
        })}
      </div>
      {METHOD.map((step, index) => (
        <div
          key={step.title}
          id={`method-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`method-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
          className="mt-12 grid gap-x-16 gap-y-8 lg:grid-cols-12"
        >
          <p className="font-display text-[clamp(1.5rem,1.1rem+1.3vw,2.1rem)] leading-[1.28] lg:col-span-7">
            {step.happens}
          </p>
          <dl className="space-y-6 lg:col-span-5">
            <div>
              <dt className="font-semibold text-gold">You see</dt>
              <dd className="mt-1">{step.see}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gold">You approve</dt>
              <dd className="mt-1">{step.approve}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

type Tile = { id: string; title: string };
export type IndustryView = Industry & { workflows: Tile[] };

export function IndustryPicker({ industries }: { industries: IndustryView[] }) {
  return (
    <Suspense fallback={<IndustryTabs industries={industries} initial={0} />}>
      <IndustryFromQuery industries={industries} />
    </Suspense>
  );
}

function IndustryFromQuery({ industries }: { industries: IndustryView[] }) {
  const slug = useSearchParams().get("industry");
  const initial = Math.max(
    0,
    industries.findIndex((item) => item.slug === slug),
  );
  return <IndustryTabs key={initial} industries={industries} initial={initial} />;
}

function IndustryTabs({ industries, initial }: { industries: IndustryView[]; initial: number }) {
  const [selected, setSelected] = useState(initial);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function choose(index: number, focus: boolean) {
    setSelected(index);
    if (focus) tabs.current[index]?.focus();
  }

  function onKey(event: KeyboardEvent) {
    const next = nextIndex(event.key, selected, industries.length - 1);
    if (next < 0) return;
    event.preventDefault();
    choose(next, true);
  }

  return (
    <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <div
        role="tablist"
        aria-label="Industries"
        aria-orientation="vertical"
        className="flex flex-col items-start lg:col-span-5"
        onKeyDown={onKey}
      >
        {industries.map((item, index) => {
          const active = index === selected;
          return (
            <button
              key={item.slug}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              id={`industry-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`industry-panel-${index}`}
              tabIndex={active ? 0 : -1}
              className={`min-h-11 py-1.5 text-left font-display text-[clamp(1.6rem,1.1rem+1.7vw,2.5rem)] leading-[1.12] ${
                active ? "text-forest underline decoration-gold decoration-2 underline-offset-8" : "text-slate hover:text-forest"
              }`}
              onClick={() => choose(index, false)}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <div className="lg:col-span-7">
        {industries.map((item, index) => (
          <div
            key={item.slug}
            id={`industry-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`industry-tab-${index}`}
            hidden={index !== selected}
            tabIndex={0}
          >
            <p className="lead text-forest">{item.line}</p>
            <ul aria-label="Where the hours go" className="mt-5 flex flex-wrap gap-2">
              {item.hours.map((hour) => (
                <li key={hour} className="bg-stone px-3.5 py-1.5 text-[15px]">
                  {hour}
                </li>
              ))}
            </ul>
            <ul aria-label="Workflows that apply" className="mt-8 grid gap-3 sm:grid-cols-2">
              {item.workflows.map((workflow, position) => (
                <li key={workflow.id} className={position === 0 ? "sm:col-span-2" : ""}>
                  <Link
                    href={`/workflows/${workflow.id}`}
                    data-surface="dark"
                    className="group flex h-full min-h-44 flex-col justify-between bg-forest p-5"
                  >
                    <Thumb id={workflow.id} className="h-14 w-24 text-ivory/80" />
                    <span className="card-title arrow-after mt-6 block text-[17px] leading-snug font-semibold after:ml-2 after:text-gold">
                      {workflow.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <span className="font-semibold text-forest">Stays with people:</span> {item.stays}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
