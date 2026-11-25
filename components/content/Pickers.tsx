"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type KeyboardEvent } from "react";
import { useMotion } from "@/components/workflow/hooks";
import { WORKFLOW_MEDIA } from "@/components/workflow/media";
import type { Industry } from "@/content/industries";

function nextIndex(key: string, index: number, last: number): number {
  if (key === "ArrowDown" || key === "ArrowRight") return index === last ? 0 : index + 1;
  if (key === "ArrowUp" || key === "ArrowLeft") return index === 0 ? last : index - 1;
  if (key === "Home") return 0;
  if (key === "End") return last;
  return -1;
}

const INDUSTRY_STRIPS = [
  {
    src: "/images/wf-lead.jpg",
    position: "center",
    cutout: "/images/cut-contract.png",
    folio: "Folio 01",
  },
  {
    src: "/images/editorial-workspace.jpg",
    position: "center",
    cutout: "/images/cut-notebook.png",
    folio: "Folio 02",
  },
  {
    src: "/images/gate-detail.jpg",
    position: "center",
    cutout: "/images/cut-envelope.png",
    folio: "Folio 03",
  },
  {
    src: "/images/wf-invoice.jpg",
    position: "70% center",
    cutout: "/images/cut-ticket.png",
    folio: "Folio 04",
  },
  {
    src: "/images/consultation-room.jpg",
    position: "center 30%",
    cutout: "/images/cut-receipt.png",
    folio: "Folio 05",
  },
  {
    src: "/images/hero-paper-fall.jpg",
    position: "center",
    cutout: "/images/cut-invoice.png",
    folio: "Folio 06",
  },
];

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
  const [motion] = useMotion();
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

  return (
    <div>
      <div
        role="tablist"
        aria-label="Industries"
        aria-orientation="horizontal"
        className="flex flex-col gap-3 lg:h-[30rem] lg:flex-row"
        onKeyDown={onKey}
      >
        {industries.map((item, index) => {
          const active = index === selected;
          const strip = INDUSTRY_STRIPS[index % INDUSTRY_STRIPS.length];
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
              style={
                motion
                  ? { transition: "flex-grow 420ms var(--ease-paper), min-height 320ms var(--ease-paper)" }
                  : undefined
              }
              className={`group relative flex flex-col justify-between overflow-hidden bg-obsidian text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                active
                  ? "min-h-[16rem] p-6 lg:min-h-0 lg:flex-[3.2] lg:p-7"
                  : "min-h-[5.25rem] p-4 lg:min-h-0 lg:flex-[1] lg:hover:flex-[1.15]"
              }`}
              onClick={() => choose(index, false)}
            >
              <Image
                src={strip.src}
                alt=""
                fill
                loading="eager"
                sizes={active ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 16vw, 100vw"}
                className={`object-cover ${motion ? "transition-transform duration-700 ease-[var(--ease-paper)]" : ""} ${
                  active ? "scale-100 opacity-70" : "scale-105 opacity-50 group-hover:opacity-65"
                }`}
                style={{ objectPosition: strip.position }}
              />
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 ${
                  active
                    ? "bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/20"
                    : "bg-gradient-to-t from-obsidian/95 via-obsidian/65 to-obsidian/40"
                }`}
              />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/75">
                  {strip.folio}
                </span>
                {active ? (
                  <div className="relative hidden h-28 w-24 shrink-0 sm:block lg:h-32 lg:w-24">
                    <Image
                      src={strip.cutout}
                      alt=""
                      fill
                      loading="eager"
                      sizes="112px"
                      className="object-contain drop-shadow-[0_18px_22px_rgba(11,31,22,0.8)]"
                    />
                  </div>
                ) : null}
              </div>

              <div className="relative z-10 mt-auto">
                <span
                  className={`block font-display font-medium tracking-[-0.02em] text-ivory ${
                    active
                      ? "text-[clamp(1.85rem,1.4rem+1.5vw,2.6rem)] leading-[1.02]"
                      : "text-[1.05rem] leading-[1.14] lg:text-[1.125rem]"
                  }`}
                >
                  {item.name}
                </span>
                {active ? (
                  <span className="mt-3 block max-w-lg text-[15px] leading-relaxed text-ivory/85">
                    {item.line}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 border border-ink/15 bg-paper p-7 shadow-[0_24px_60px_-30px_rgba(11,31,22,0.14)] md:p-11">
        {industries.map((item, index) => (
          <div
            key={item.slug}
            id={`industry-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`industry-tab-${index}`}
            hidden={index !== selected}
            tabIndex={0}
            className="outline-none"
          >
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Selected sector</p>
                <h3 className="mt-2 font-display text-[clamp(2rem,1.5rem+1.4vw,2.75rem)] leading-[1.02] font-medium text-ink">
                  {item.name}
                </h3>
                <p className="mt-4 text-[1.1rem] leading-relaxed text-slate">{item.line}</p>

                <div className="mt-8 border-t border-ink/15 pt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Where the hours go</p>
                  <ul aria-label="Where the hours go" className="mt-4 divide-y divide-ink/12 border-b border-ink/12">
                    {item.hours.map((hour, hIdx) => (
                      <li key={hour} className="flex items-baseline gap-4 py-3 text-[15px] text-ink">
                        <span className="font-mono text-[11px] text-slate">0{hIdx + 1}</span>
                        <span>{hour}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-l-2 border-forest bg-ivory px-5 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Stays with people</p>
                  <p className="mt-1.5 text-[15px] text-ink">{item.stays}</p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Workflows that apply</p>
                <ul aria-label="Workflows that apply" className="mt-4 grid gap-4 sm:grid-cols-2">
                  {item.workflows.map((workflow, position) => {
                    const media = WORKFLOW_MEDIA[workflow.id];
                    return (
                      <li key={workflow.id} className={position === 0 ? "sm:col-span-2" : ""}>
                        <Link
                          href={`/workflows/${workflow.id}`}
                          data-surface="dark"
                          className="group relative flex h-full min-h-48 flex-col justify-between overflow-hidden bg-obsidian p-6"
                        >
                          {media ? (
                            <>
                              <Image
                                src={media.envSrc}
                                alt=""
                                fill
                                loading="eager"
                                sizes="(min-width: 1024px) 36vw, 100vw"
                                className="zoom object-cover opacity-65"
                                style={{ objectPosition: media.envPosition }}
                              />
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/65 to-obsidian/30"
                              />
                            </>
                          ) : null}
                          <div className="relative z-10 flex items-start justify-between gap-4">
                            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/75">
                              {media?.shortLabel ?? "Workflow"}
                            </span>
                            {media ? (
                              <div className="relative h-16 w-14 shrink-0">
                                <Image
                                  src={media.cutoutSrc}
                                  alt=""
                                  fill
                                  loading="eager"
                                  sizes="64px"
                                  className="object-contain drop-shadow-[0_12px_18px_rgba(11,31,22,0.65)] transition-transform duration-500 ease-[var(--ease-paper)] group-hover:-translate-y-1"
                                />
                              </div>
                            ) : null}
                          </div>
                          <span className="card-title arrow-link relative z-10 mt-6 font-display text-[1.45rem] leading-tight font-medium text-ivory">
                            {workflow.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
