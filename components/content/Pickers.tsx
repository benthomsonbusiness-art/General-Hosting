"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type KeyboardEvent } from "react";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import type { Industry } from "@/content/industries";

const INDUSTRY_PHOTO: Record<string, { src: string; alt: string }> = {
  hvac: {
    src: "/images/station-model.jpg",
    alt: "A dark charcoal control dial with engraved tick marks, like a thermostat.",
  },
  plumbing: {
    src: "/images/ins-daily-brief.jpg",
    alt: "Three gauges on a dark charcoal panel, with morning light across them.",
  },
  electrical: {
    src: "/images/station-code.jpg",
    alt: "A row of toggle switches on a dark charcoal panel.",
  },
  roofing: {
    src: "/images/ind-home.jpg",
    alt: "The open side door of a service van at dusk, with a tool rack and parts bins.",
  },
  landscaping: {
    src: "/images/ind-retail.jpg",
    alt: "A stockroom after hours, plain boxes on shelves and a steel bench.",
  },
  cleaning: {
    src: "/images/ind-wellness.jpg",
    alt: "A tidy room after closing, shelves of folded supplies and a clean counter.",
  },
};

const TRADE_SMS: Record<string, { trigger: string; draft: string; reply: string }> = {
  hvac: {
    trigger: "Missed call, 6:12 p.m. · Voicemail: AC blowing warm air",
    draft: "Sorry we missed your call. Marco can come tomorrow 8 to 10 a.m. or 1 to 3 p.m. Which works?",
    reply: "Tomorrow 8 to 10 works, thank you.",
  },
  plumbing: {
    trigger: "Missed call, 7:40 a.m. · Voicemail: Water heater leaking in basement",
    draft: "Sorry we missed you. Sam is nearby and has 10 to 12 today or 8 to 10 tomorrow open.",
    reply: "10 to 12 today please.",
  },
  electrical: {
    trigger: "Website form · 200-amp panel quote in Morristown",
    draft: "Thanks for reaching out. Devon can stop by Thursday 9 to 11 a.m. or Friday 1 to 3 p.m. for an estimate.",
    reply: "Thursday 9 to 11 is great.",
  },
  roofing: {
    trigger: "Missed call after storm · Shingles blown off garage ridge",
    draft: "Sorry we missed your call. Luis can inspect your roof Wednesday 11 to 1 or Thursday 8 to 10.",
    reply: "Wednesday 11 to 1 works.",
  },
  landscaping: {
    trigger: "Website form · Spring cleanup and weekly mowing",
    draft: "Thanks for your note. Crew B is on your street Tuesday afternoon for a quick walk-through.",
    reply: "See you Tuesday afternoon.",
  },
  cleaning: {
    trigger: "Day-before reminder · Recurring home visit",
    draft: "Friendly reminder that Maria's team arrives tomorrow between 9 and 11 a.m. Reply YES to confirm.",
    reply: "YES, back gate will be unlocked.",
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
                />
              ) : null}
            </div>
            <div className="console p-6 lg:col-span-7">
              <h2 className="h3">{current.name}</h2>
              <p className="mt-3 text-muted">{current.line}</p>
              <p className="mt-6 text-[15px]">Where jobs slip</p>
              <ul className="mt-2 text-[15px] leading-relaxed text-muted">
                {current.hours.map((hour) => (
                  <li key={hour}>{hour}</li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[15px]">Stays with your team: {current.stays}</p>
              {TRADE_SMS[current.slug] ? (
                <div className="mt-6 rounded-[10px] border border-line bg-obsidian p-4">
                  <p className="font-mono text-[12px] text-muted">{TRADE_SMS[current.slug].trigger}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <p className="max-w-[88%] self-end rounded-[12px_12px_4px_12px] border border-[rgb(249_115_22_/_0.35)] bg-[#2a1b13] px-3 py-2 text-[13px] text-ivory">
                      {TRADE_SMS[current.slug].draft}
                    </p>
                    <p className="max-w-[82%] self-start rounded-[12px_12px_12px_4px] bg-[rgb(251_246_241_/_0.08)] px-3 py-2 text-[13px] text-ivory">
                      {TRADE_SMS[current.slug].reply}
                    </p>
                  </div>
                </div>
              ) : null}
              <h3 className="h4 mt-8">How we help</h3>
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
