"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/workflow/hooks";
import type { SubService } from "@/content/services";

type SceneVisual = {
  backdrop: string;
  backdropAlt: string;
  backdropPosition: string;
  cutout: string;
  cutoutAlt: string;
  stageTag: string;
};

const SCENE_VISUALS: Record<string, SceneVisual> = {
  "workflow-audit": {
    backdrop: "/images/hero-paper-fall.jpg",
    backdropAlt: "Papers falling over green wool baize.",
    backdropPosition: "center",
    cutout: "/images/cut-letter.png",
    cutoutAlt: "Tri-folded cream brief sheet",
    stageTag: "Stage 01 · Diagnosis",
  },
  "build-and-deploy": {
    backdrop: "/images/wf-invoice.jpg",
    backdropAlt: "Stacked invoices on dark green wood in raking light.",
    backdropPosition: "center",
    cutout: "/images/cut-contract.png",
    cutoutAlt: "Brass-fastened workflow document bundle",
    stageTag: "Stage 02 · Construction",
  },
  "retained-operations": {
    backdrop: "/images/gate-detail.jpg",
    backdropAlt: "Walnut rubber stamp hovering over textured paper.",
    backdropPosition: "center",
    cutout: "/images/cut-ticket.png",
    cutoutAlt: "Perforated routing ticket",
    stageTag: "Stage 03 · Stewardship",
  },
  "ai-agents-and-integrations": {
    backdrop: "/images/wf-support.jpg",
    backdropAlt: "Matte dark desk telephone beside stacked cream routing tickets on green baize.",
    backdropPosition: "center",
    cutout: "/images/cut-envelope.png",
    cutoutAlt: "Open cream correspondence envelope",
    stageTag: "Stage 04 · Connection",
  },
  "reporting-and-data-pipelines": {
    backdrop: "/images/wf-brief.jpg",
    backdropAlt: "Morning light cutting across a folded editorial brief on dark green.",
    backdropPosition: "center",
    cutout: "/images/cut-receipt.png",
    cutoutAlt: "Serrated ledger receipt strip",
    stageTag: "Stage 05 · Evidence",
  },
};

export function SubServiceScenes({ items }: { items: SubService[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motion] = useMotion();
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nodes.indexOf(entry.target as HTMLLIElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0.1 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <div className="mt-14 space-y-12 md:space-y-20">
      <div className="hidden items-center justify-between border-y border-ink/15 py-3 lg:flex">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Five entry points</span>
        <ol className="flex items-center gap-6">
          {items.map((item, idx) => (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                className={`font-mono text-[12px] transition-colors ${
                  activeIndex === idx ? "font-semibold text-forest underline underline-offset-4" : "text-slate hover:text-forest"
                }`}
              >
                0{idx + 1} {item.name}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <ol className="space-y-12 md:space-y-16">
        {items.map((item, index) => {
          const visual = SCENE_VISUALS[item.slug] ?? SCENE_VISUALS["workflow-audit"];
          const isDark = index % 2 === 1;
          const isActive = activeIndex === index;

          return (
            <li
              key={item.slug}
              id={item.slug}
              ref={(el) => {
                refs.current[index] = el;
              }}
              tabIndex={-1}
              data-surface={isDark ? "dark" : "light"}
              className={`scroll-mt-24 outline-none ${
                isDark
                  ? "bg-obsidian text-ivory shadow-[0_32px_80px_-34px_rgba(11,31,22,0.55)]"
                  : "border border-ink/15 bg-paper text-ink shadow-[0_24px_60px_-30px_rgba(11,31,22,0.14)]"
              }`}
            >
              <div className="grid items-stretch lg:grid-cols-12">
                <div
                  className={`relative min-h-[19rem] overflow-hidden bg-forest lg:col-span-5 lg:min-h-[27rem] ${
                    isDark ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={visual.backdrop}
                    alt={visual.backdropAlt}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className={`object-cover transition-transform duration-700 ease-[var(--ease-paper)] ${
                      motion && isActive ? "scale-[1.03]" : "scale-100"
                    } opacity-75`}
                    style={{ objectPosition: visual.backdropPosition }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/25 to-obsidian/20"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-9">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/80">
                      {visual.stageTag}
                    </span>
                    <div
                      className={`relative mx-auto my-auto h-44 w-36 transition-transform duration-700 ease-[var(--ease-paper)] md:h-52 md:w-40 ${
                        motion && isActive ? "-translate-y-2 rotate-[-2deg]" : "translate-y-0 rotate-0"
                      }`}
                    >
                      <Image
                        src={visual.cutout}
                        alt={visual.cutoutAlt}
                        fill
                        sizes="180px"
                        className="object-contain drop-shadow-[0_24px_26px_rgba(11,31,22,0.72)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-7 md:p-12 lg:col-span-7">
                  <div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-current/15 pb-4">
                      <span
                        className={`font-mono text-[12px] uppercase tracking-[0.16em] ${
                          isDark ? "text-ivory/75" : "text-moss"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className={`font-mono text-[12px] ${isDark ? "text-ivory/60" : "text-slate"}`}>
                        0{index + 1} / 05
                      </span>
                    </div>

                    <h3 className="mt-7 font-display text-[clamp(2rem,1.45rem+1.8vw,3.1rem)] leading-[0.98] font-medium tracking-[-0.03em]">
                      {item.question}
                    </h3>
                    <p
                      className={`mt-5 max-w-[38rem] text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-relaxed ${
                        isDark ? "text-ivory/88" : "text-slate"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>

                  <div className="mt-10">
                    <p
                      className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
                        isDark ? "text-ivory/60" : "text-slate"
                      }`}
                    >
                      Deliverables
                    </p>
                    <ul
                      aria-label={`What you get from ${item.name}`}
                      className="mt-3 grid gap-x-8 gap-y-2.5 border-t border-current/15 pt-4 sm:grid-cols-2"
                    >
                      {item.get.map((line, lineIdx) => (
                        <li
                          key={line}
                          className={`flex items-baseline gap-3 text-[15px] ${
                            isDark ? "text-ivory/90" : "text-ink"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`font-mono text-[11px] ${isDark ? "text-ivory/50" : "text-moss"}`}
                          >
                            {index + 1}.{lineIdx + 1}
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
