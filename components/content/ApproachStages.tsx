"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/workflow/hooks";
import { METHOD } from "@/content/approach";

/**
 * Sticky 16:9 green-baize table whose four object states crossfade smoothly as the
 * visitor scrolls through the four one-idea-per-screen beats (or clicks a stage).
 */
export function ApproachStages() {
  const [active, setActive] = useState(0);
  const [motion] = useMotion();
  const beatRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const nodes = beatRefs.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nodes.indexOf(entry.target as HTMLLIElement);
          if (idx !== -1) setActive(idx);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0.1 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const fadeClass = motion ? "transition-opacity duration-700 ease-[var(--ease-paper)]" : "";

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div className="mb-8 flex flex-wrap gap-2 border-b border-ivory/15 pb-4" role="tablist" aria-label="Method stages">
          {METHOD.map((step, idx) => (
            <button
              key={step.title}
              type="button"
              role="tab"
              aria-selected={active === idx}
              onClick={() => {
                setActive(idx);
                beatRefs.current[idx]?.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "center" });
              }}
              className={`min-h-11 px-3 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors ${
                active === idx ? "bg-ivory text-obsidian font-semibold" : "text-ivory/75 hover:text-ivory"
              }`}
            >
              0{idx + 1} {step.title}
            </button>
          ))}
        </div>

        <ol className="space-y-12 lg:space-y-44 lg:py-10">
          {METHOD.map((step, idx) => {
            const isActive = active === idx;
            return (
              <li
                key={step.title}
                ref={(node) => {
                  beatRefs.current[idx] = node;
                }}
                onMouseEnter={() => setActive(idx)}
                className={`border-l-2 py-4 pr-4 pl-6 transition-colors duration-300 ${
                  isActive ? "border-ivory bg-forest/35" : "border-ivory/25 bg-transparent"
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ivory/75">
                  Stage 0{idx + 1} · {step.line}
                </p>
                <h3 className="mt-3 font-display text-[clamp(2.4rem,1.8rem+2.2vw,3.8rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ivory">
                  {step.title}
                </h3>
                <p className="mt-5 text-[1.125rem] leading-relaxed text-ivory/90">{step.happens}</p>
                <dl className="mt-7 grid gap-5 border-t border-ivory/15 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/70">You see</dt>
                    <dd className="mt-1.5 text-[15px] text-ivory/90">{step.see}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">You approve</dt>
                    <dd className="mt-1.5 text-[15px] text-ivory">{step.approve}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <div
            aria-label={`Table view: ${METHOD[active]?.title ?? "Map"}`}
            className="relative aspect-[16/9] w-full overflow-hidden border border-ivory/15 bg-obsidian shadow-[0_36px_90px_-30px_rgba(0,0,0,0.7)]"
          >
            {[
              {
                src: "/images/approach-map.jpg",
                alt: "High angle over a walnut workbench scattered with loose blank cream forms, envelopes, receipts, and tickets.",
              },
              {
                src: "/images/approach-design.jpg",
                alt: "The same walnut workbench with forms, envelopes, and cardstock tickets sorted into four parallel aligned lanes.",
              },
              {
                src: "/images/approach-build.jpg",
                alt: "The four arranged paper stacks connected across the walnut workbench by taut linen string and brass clips.",
              },
              {
                src: "/images/approach-handover.jpg",
                alt: "The walnut workbench cleared down to a single tidy forest-green clothbound manual book with brass corner rivets.",
              },
            ].map((frame, frameIdx) => (
              <div
                key={frame.src}
                aria-hidden={active !== frameIdx}
                className={`absolute inset-0 ${fadeClass} ${
                  active === frameIdx ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}

            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-obsidian/90 via-obsidian/45 to-transparent"
            />
            <div className="absolute right-5 bottom-4 left-5 z-20 flex items-center justify-between border-t border-ivory/20 pt-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/85">
                {METHOD[active]?.title} table
              </span>
              <span className="font-mono text-[11px] text-ivory/75 tabular-nums">0{active + 1} / 04</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
