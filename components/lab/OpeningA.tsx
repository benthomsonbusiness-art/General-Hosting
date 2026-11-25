"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroPlayer } from "@/components/workflow/HeroPlayer";
import { useMotion } from "@/components/workflow/hooks";
import { HOME } from "@/content/pages";
import type { Workflow } from "@/content/workflows";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { LabMotionBar } from "./LabMotionBar";

export function OpeningA({ lead }: { lead: Workflow }) {
  const [motion] = useMotion();
  const [paused, setPaused] = useState(false);
  const [scrollP, setScrollP] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const activeMotion = motion && !paused;

  useEffect(() => {
    if (!activeMotion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const h = heroRef.current?.offsetHeight || 760;
      setScrollP(Math.min(1, Math.max(0, y / h)));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [activeMotion]);

  const offset = activeMotion ? scrollP : 0;

  return (
    <div data-motion={activeMotion ? "on" : "off"} className="lab-root bg-obsidian text-ivory">
      <LabMotionBar active="a" paused={paused} onTogglePause={() => setPaused((p) => !p)} tone="dark" />

      {/* Full-viewport opening: falling paper field with monumental type layered behind & in front of sheets */}
      <section
        ref={heroRef}
        data-surface="dark"
        className="relative min-h-[calc(100svh-var(--header-h)-3.1rem)] overflow-hidden bg-obsidian"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-repeat opacity-35 mix-blend-soft-light"
          style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform: `translate3d(0, ${offset * 28}px, 0) scale(${1 + offset * 0.04})`,
          }}
        >
          <Image
            src="/images/hero-paper-fall.jpg"
            alt="Archival cotton sheets, envelopes, and ruled forms suspended above a dark forest-green desk."
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/20 to-obsidian/92" />
        </div>

        {/* Floating paper cutouts crossing the headline plane */}
        <div className="pointer-events-none absolute inset-0 mx-auto max-w-[92rem]">
          <div
            className="lab-cutout lab-float-a absolute top-[7%] right-[3%] z-20 w-28 sm:w-44 lg:top-[8%] lg:right-[15%] lg:w-56"
            style={{
              transform: `translate3d(${offset * -24}px, ${offset * -42}px, 0) rotate(${-7 + offset * 4}deg)`,
            }}
          >
            <Image
              src="/images/cut-envelope.png"
              alt=""
              width={960}
              height={1200}
              sizes="240px"
              className="h-auto w-full"
            />
          </div>
          <div
            className="lab-cutout lab-float-b absolute top-[34%] right-[2%] z-20 hidden w-44 sm:block lg:top-auto lg:right-[30%] lg:bottom-[18%] lg:w-52"
            style={{
              transform: `translate3d(${offset * 30}px, ${offset * 36}px, 0) rotate(${8 - offset * 5}deg)`,
            }}
          >
            <Image
              src="/images/cut-invoice.png"
              alt=""
              width={960}
              height={1200}
              sizes="220px"
              className="h-auto w-full"
            />
          </div>
          <div
            className="lab-cutout absolute top-[46%] right-[2%] z-20 hidden w-44 md:block lg:right-[5%] lg:w-48"
            style={{
              transform: `translate3d(0, ${offset * 52}px, 0) rotate(${-14 + offset * 6}deg)`,
            }}
          >
            <Image
              src="/images/cut-ticket.png"
              alt=""
              width={960}
              height={1200}
              sizes="200px"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* Display type woven between layers */}
        <div className="wrap relative flex min-h-[inherit] flex-col justify-between pt-7 pb-8 lg:pt-10 lg:pb-10">
          <p className="lab-mono text-[11px] tracking-[0.16em] text-ivory/75 uppercase sm:text-[12px]">
            Paper becomes motion — paused where a person decides
          </p>

          <div className="relative my-auto py-4 lg:py-6">
            <h1 className="lab-display max-w-[14ch] text-[clamp(2.55rem,5.8vw,6.15rem)] text-ivory">
              <span className="relative z-10 block">We build the</span>
              <span className="relative z-10 block text-ivory/95">AI systems your</span>
              <span className="relative z-30 block">
                operations <span className="lab-display-wide italic text-paper">actually run on.</span>
              </span>
            </h1>
          </div>

          <div className="relative z-30 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-t border-ivory/20 pt-5 lg:pt-6">
            <p className="max-w-[34rem] text-[0.98rem] leading-relaxed text-ivory/90 sm:text-[1.0625rem]">{HOME.dek}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href={CTA_HREF}
                className="inline-flex min-h-12 items-center bg-gold px-6 py-3 text-[15px] font-semibold text-obsidian transition-colors duration-150 hover:bg-ivory"
              >
                {CTA_LABEL}
              </Link>
              <Link
                href="/workflows"
                className="arrow-link min-h-12 items-center text-[15px] text-ivory hover:text-ivory"
              >
                See all eight workflows
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transition from falling paper into sorted operational lanes + live player */}
      <section data-surface="light" className="relative bg-[#fcfbf7] py-16 text-ink lg:py-24">
        <div className="wrap grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="lab-mono text-[12px] tracking-[0.14em] text-slate uppercase">Sorted into lanes</p>
            <h2 className="lab-display mt-3 text-[clamp(2.2rem,3.8vw,3.5rem)] text-forest">
              One sheet enters. The gate waits.
            </h2>
            <p className="mt-5 max-w-[28rem] text-slate">
              Every step before the customer sees a reply runs in code and schema-checked models. Watch one lead arrive
              and pause for your click.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/15 pt-6">
              <div>
                <Image
                  src="/images/cut-envelope.png"
                  alt="Inbound envelope"
                  width={960}
                  height={1200}
                  sizes="140px"
                  className="lab-cutout-light mx-auto h-24 w-auto object-contain"
                />
                <p className="mt-3 text-center text-[13px] font-semibold text-forest">Lead intake</p>
              </div>
              <div>
                <Image
                  src="/images/cut-invoice.png"
                  alt="Ledger invoice"
                  width={960}
                  height={1200}
                  sizes="140px"
                  className="lab-cutout-light mx-auto h-24 w-auto object-contain"
                />
                <p className="mt-3 text-center text-[13px] font-semibold text-forest">Payables</p>
              </div>
              <div>
                <Image
                  src="/images/cut-letter.png"
                  alt="Folded brief"
                  width={960}
                  height={1200}
                  sizes="140px"
                  className="lab-cutout-light mx-auto h-24 w-auto object-contain"
                />
                <p className="mt-3 text-center text-[13px] font-semibold text-forest">Daily brief</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <HeroPlayer workflow={lead} />
          </div>
        </div>
      </section>
    </div>
  );
}
