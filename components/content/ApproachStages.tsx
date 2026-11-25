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
            className="relative aspect-[16/10] w-full overflow-hidden border border-ivory/15 bg-obsidian shadow-[0_36px_90px_-30px_rgba(0,0,0,0.7)]"
          >
            <Image
              src="/images/texture-green.jpg"
              alt="Deep green wool baize worktable photographed from above."
              fill
              loading="eager"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover opacity-85"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,transparent_20%,rgba(11,31,22,0.7)_100%)]"
            />

            {/* State 0: Map — scattered physical cutouts across the green baize table */}
            <div
              aria-hidden={active !== 0}
              className={`absolute inset-0 ${fadeClass} ${active === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <div className="relative h-full w-full">
                <div className="absolute top-[10%] left-[8%] h-40 w-32 -rotate-12 sm:h-52 sm:w-40">
                  <Image src="/images/cut-envelope.png" alt="" fill sizes="180px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="absolute top-[18%] right-[14%] h-44 w-36 rotate-[14deg] sm:h-56 sm:w-44">
                  <Image src="/images/cut-invoice.png" alt="" fill sizes="180px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="absolute bottom-[10%] left-[28%] h-36 w-28 rotate-[24deg] sm:h-48 sm:w-36">
                  <Image src="/images/cut-receipt.png" alt="" fill sizes="160px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="absolute right-[26%] bottom-[8%] h-36 w-28 -rotate-[18deg] sm:h-44 sm:w-36">
                  <Image src="/images/cut-ticket.png" alt="" fill sizes="160px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.6)]" />
                </div>
              </div>
            </div>

            {/* State 1: Design — same papers aligned cleanly into lanes */}
            <div
              aria-hidden={active !== 1}
              className={`absolute inset-0 flex items-center justify-center px-6 ${fadeClass} ${
                active === 1 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="grid w-full max-w-2xl grid-cols-4 items-center gap-4 border-y border-ivory/20 py-6">
                {[
                  { src: "/images/cut-envelope.png", tag: "Intake" },
                  { src: "/images/cut-invoice.png", tag: "Schema" },
                  { src: "/images/cut-ticket.png", tag: "Gate" },
                  { src: "/images/cut-receipt.png", tag: "Ledger" },
                ].map((piece, pieceIdx) => (
                  <div key={piece.tag} className="flex flex-col items-center">
                    <div className="relative h-28 w-20 sm:h-36 sm:w-28">
                      <Image src={piece.src} alt="" fill sizes="120px" className="object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.6)]" />
                    </div>
                    <span
                      className={`mt-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        pieceIdx === 2 ? "border border-gold/60 bg-gold/15 px-2 py-0.5 text-gold" : "text-ivory/75"
                      }`}
                    >
                      {piece.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* State 2: Build — sheets joined sequentially with deterministic rules and brass/gold stop */}
            <div
              aria-hidden={active !== 2}
              className={`absolute inset-0 flex items-center justify-center px-8 ${fadeClass} ${
                active === 2 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="relative flex w-full max-w-2xl items-center justify-between gap-4">
                <span aria-hidden className="absolute top-1/2 right-10 left-10 h-px bg-ivory/45" />
                <span aria-hidden className="absolute top-1/2 left-[63%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 border-2 border-gold bg-obsidian" />
                <div className="relative z-10 h-36 w-28 sm:h-48 sm:w-36">
                  <Image src="/images/cut-letter.png" alt="" fill sizes="150px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.65)]" />
                </div>
                <div className="relative z-10 h-40 w-32 sm:h-52 sm:w-40">
                  <Image src="/images/cut-invoice.png" alt="" fill sizes="170px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.65)]" />
                </div>
                <div className="relative z-10 h-36 w-28 sm:h-48 sm:w-36">
                  <Image src="/images/cut-contract.png" alt="" fill sizes="150px" className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.65)]" />
                </div>
              </div>
            </div>

            {/* State 3: Hand over — resolved into one bound notebook and signed dossier */}
            <div
              aria-hidden={active !== 3}
              className={`absolute inset-0 flex items-center justify-center ${fadeClass} ${
                active === 3 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="relative flex items-center justify-center gap-5">
                <div className="relative h-48 w-36 -rotate-2 sm:h-64 sm:w-52">
                  <Image src="/images/cut-notebook.png" alt="" fill sizes="210px" className="object-contain drop-shadow-[0_26px_30px_rgba(0,0,0,0.72)]" />
                </div>
                <div className="relative -ml-10 h-44 w-32 rotate-2 sm:h-56 sm:w-44">
                  <Image src="/images/cut-contract.png" alt="" fill sizes="180px" className="object-contain drop-shadow-[0_22px_26px_rgba(0,0,0,0.7)]" />
                </div>
              </div>
            </div>

            <div className="absolute right-5 bottom-4 left-5 z-20 flex items-center justify-between border-t border-ivory/15 pt-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/75">
                {METHOD[active]?.title} table
              </span>
              <span className="font-mono text-[11px] text-ivory/65 tabular-nums">0{active + 1} / 04</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
