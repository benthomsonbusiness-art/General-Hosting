"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type KeyboardEvent } from "react";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import type { Industry } from "@/content/industries";

const INDUSTRY_PHOTO: Record<string, { src: string; alt: string }> = {
  "professional-services": {
    src: "/images/ind-professional.jpg",
    alt: "A closed laptop and a desk lamp on a dark green desk, with a glass meeting room behind.",
  },
  "health-wellness-fitness": {
    src: "/images/ind-wellness.jpg",
    alt: "A fitness studio desk after closing, a tablet face down and rolled mats on the shelves.",
  },
  "real-estate": {
    src: "/images/ind-realestate.jpg",
    alt: "A property office key cabinet at night, a few keys on unlabeled hooks.",
  },
  "ecommerce-retail": {
    src: "/images/ind-retail.jpg",
    alt: "A packing room after hours, plain boxes on shelves and a scale on a steel bench.",
  },
  "home-services": {
    src: "/images/ind-home.jpg",
    alt: "The open side door of a service van at dusk, with a tool rack and parts bins.",
  },
  "financial-accounting-firms": {
    src: "/images/ind-finance.jpg",
    alt: "An accounting office at night, two monitors off, a scanner and a stack of folders.",
  },
};

function nextIndex(key: string, index: number, last: number): number {
  if (key === "ArrowDown" || key === "ArrowRight") return index === last ? 0 : index + 1;
  if (key === "ArrowUp" || key === "ArrowLeft") return index === 0 ? last : index - 1;
  if (key === "Home") return 0;
  if (key === "End") return last;
  return -1;
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
    const chosen = industries[index];
    if (chosen && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("industry", chosen.slug);
      window.history.replaceState(null, "", url.toString());
    }
    if (focus) tabs.current[index]?.focus();
  }

  function onKey(event: KeyboardEvent) {
    const next = nextIndex(event.key, selected, industries.length - 1);
    if (next < 0) return;
    event.preventDefault();
    choose(next, true);
  }

  const current = industries[selected];

  return (
    <div>
      <div role="tablist" aria-label="Industries" className="flex gap-2 overflow-x-auto" onKeyDown={onKey}>
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
              aria-controls="industry-panel"
              tabIndex={active ? 0 : -1}
              className={`min-h-11 shrink-0 rounded-[6px] px-4 text-left text-[15px] ${
                active ? "bg-ivory text-obsidian" : "border border-line text-ivory"
              }`}
              onClick={() => choose(index, false)}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {current ? (
        <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${selected}`} tabIndex={0} className="mt-8 outline-none">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {INDUSTRY_PHOTO[current.slug] ? (
                <HardwareFrame
                  src={INDUSTRY_PHOTO[current.slug].src}
                  alt={INDUSTRY_PHOTO[current.slug].alt}
                  width={1600}
                  height={2000}
                  sizes="(min-width: 1024px) 36vw, 100vw"
                />
              ) : null}
            </div>
            <div className="console p-6 lg:col-span-7">
              <h2 className="h3">{current.name}</h2>
              <p className="mt-3 text-muted">{current.line}</p>
              <p className="mt-6 text-[15px]">Work that piles up</p>
              <ul className="mt-2 text-[15px] leading-relaxed text-muted">
                {current.hours.map((hour) => (
                  <li key={hour}>{hour}</li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[15px]">Stays with your team: {current.stays}</p>
              <h3 className="h4 mt-8">Example workflows</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {current.workflows.map((workflow) => (
                  <li key={workflow.id}>
                    <Link href={`/workflows/${workflow.id}`} className="group flex min-h-14 items-center py-2">
                      <span className="card-title row-title">{workflow.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
