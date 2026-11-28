"use client";

import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type KeyboardEvent } from "react";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import type { Industry } from "@/content/industries";

const INDUSTRY_PHOTO: Record<string, { src: string; alt: string }> = {
  gyms: {
    src: "/images/ind-wellness.jpg",
    alt: "A clean studio interior after hours, folded towels on shelves and a tidy front desk.",
  },
  recruiting: {
    src: "/images/station-code.jpg",
    alt: "A row of precision toggle switches on a dark charcoal panel.",
  },
  events: {
    src: "/images/station-model.jpg",
    alt: "A dark charcoal control dial with engraved tick marks, like a sound mixer knob.",
  },
  landscaping: {
    src: "/images/ind-retail.jpg",
    alt: "A tidy equipment room after hours, shelves and a steel bench.",
  },
  plumbing: {
    src: "/images/ind-home.jpg",
    alt: "The open side door of a service van at dusk, with organized gear.",
  },
  appointments: {
    src: "/images/ins-daily-brief.jpg",
    alt: "Three analog gauges on a dark charcoal panel in morning light.",
  },
};

const SAMPLE_TEXT: Record<string, { trigger: string; draft: string }> = {
  gyms: {
    trigger: "Missed call during 6 p.m. class",
    draft:
      "“Sorry we missed your call. Coach Maya has intro spots open tomorrow at 7 a.m. or 5:30 p.m. Reply 1 or 2 to grab one.”",
  },
  recruiting: {
    trigger: "New candidate form submitted",
    draft: "“Thanks for applying. Do you have 15 minutes Thursday at 11 a.m. or 2 p.m. for a quick intro call?”",
  },
  events: {
    trigger: "Saturday night date inquiry",
    draft:
      "“Thanks for reaching out. October 14 is open on our calendar — want to hop on a quick call Tuesday at 5:30 p.m.?”",
  },
  landscaping: {
    trigger: "Spring cleanup website inquiry",
    draft:
      "“Thanks for your note. Our crew is on your street Wednesday afternoon if you'd like a quick walk-through.”",
  },
  plumbing: {
    trigger: "Missed call while on a job",
    draft: "“Sorry we missed you. Sam has 10 to 12 today or 8 to 10 tomorrow open. Which works?”",
  },
  appointments: {
    trigger: "Recurring session reminder",
    draft: "“See you tomorrow at 9:30 a.m. Reply YES to confirm or C if you need to pick another day.”",
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
      <div
        role="tablist"
        aria-label="Industries"
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
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
              aria-controls="industry-panel"
              tabIndex={active ? 0 : -1}
              className="tab-chip min-h-11 shrink-0 px-4 text-left text-[15px] font-semibold"
              onClick={() => choose(index, false)}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {current ? (
        <div
          id="industry-panel"
          role="tabpanel"
          aria-labelledby={`industry-tab-${selected}`}
          tabIndex={0}
          className="mt-8 outline-none"
        >
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {INDUSTRY_PHOTO[current.slug] ? (
                <HardwareFrame
                  src={INDUSTRY_PHOTO[current.slug].src}
                  alt={INDUSTRY_PHOTO[current.slug].alt}
                  width={1600}
                  height={2000}
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="rounded-[12px] border border-line shadow-(--shadow-console)"
                />
              ) : null}
            </div>
            <div className="lg:col-span-7">
              <h2 className="h2">{current.name}</h2>
              <p className="lead mt-3 text-muted">{current.line}</p>

              <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[16px] text-ivory">
                {current.hours.map((hour) => (
                  <li key={hour} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{hour}</span>
                  </li>
                ))}
              </ul>

              {SAMPLE_TEXT[current.slug] ? (
                <div className="repo-panel mt-7 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 font-mono text-cyan">
                      <MessageSquare aria-hidden size={13} strokeWidth={2} />
                      {SAMPLE_TEXT[current.slug].trigger}
                    </span>
                    <span className="font-mono text-[11px] text-gold">You approve first</span>
                  </div>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-ivory">
                    {SAMPLE_TEXT[current.slug].draft}
                  </p>
                </div>
              ) : null}

              <p className="mt-6 text-[15px] text-muted">Stays with your team: {current.stays}</p>

              <ul className="mt-8 divide-y divide-line border-y border-line">
                {current.workflows.map((workflow) => (
                  <li key={workflow.id}>
                    <Link
                      href={`/workflows/${workflow.id}`}
                      className="group flex min-h-14 items-center justify-between gap-4 py-2"
                    >
                      <span className="card-title row-title">{workflow.title}</span>
                      <ArrowRight
                        aria-hidden
                        size={18}
                        strokeWidth={1.75}
                        className="text-gold transition-transform group-hover:translate-x-1"
                      />
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
