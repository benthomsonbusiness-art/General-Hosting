"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeroPlayer } from "@/components/workflow/HeroPlayer";
import { useMotion } from "@/components/workflow/hooks";
import { HOME } from "@/content/pages";
import type { Workflow } from "@/content/workflows";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { LabMotionBar } from "./LabMotionBar";

export function OpeningC({ lead }: { lead: Workflow }) {
  const [motion] = useMotion();
  const [paused, setPaused] = useState(false);
  const activeMotion = motion && !paused;

  return (
    <div data-motion={activeMotion ? "on" : "off"} className="lab-root bg-paper text-ink">
      <LabMotionBar active="c" paused={paused} onTogglePause={() => setPaused((p) => !p)} tone="light" />

      {/* Split workbench: near-white paper editorial column on the left, green baize table & live stage on the right */}
      <section data-surface="light" className="grid lg:min-h-[calc(100svh-var(--header-h)-3.1rem)] lg:grid-cols-12">
        {/* Left light paper plane */}
        <div className="relative flex flex-col justify-between bg-[#fcfbf7] px-5 pt-7 pb-9 md:px-10 lg:col-span-5 lg:py-10 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-repeat opacity-40"
            style={{ backgroundImage: "url(/images/sized/texture-paper-1024.webp)", backgroundSize: "512px 512px" }}
          />

          <div className="relative z-10">
            <p className="lab-mono text-[11px] tracking-[0.14em] text-terracotta uppercase sm:text-[12px]">
              Bloomington · Remote advisory
            </p>
            <h1 className="lab-display mt-4 text-[clamp(2.35rem,3.6vw,4.15rem)] text-forest">
              We build the AI systems your{" "}
              <span className="lab-display-narrow block text-ink">operations actually run on.</span>
            </h1>
            <p className="mt-4 max-w-[27rem] text-[0.98rem] leading-relaxed text-slate sm:text-[1.0625rem]">{HOME.dek}</p>
          </div>

          {/* Tactile row of raw physical paper types */}
          <div className="relative z-10 my-5 grid grid-cols-3 items-end gap-3 border-y border-ink/12 py-4">
            <div className="text-center">
              <Image
                src="/images/cut-invoice.png"
                alt="Paper invoice"
                width={960}
                height={1200}
                sizes="120px"
                className="lab-cutout-light mx-auto h-20 w-auto object-contain"
              />
              <span className="lab-mono mt-1.5 block text-[11px] text-slate">INVOICE</span>
            </div>
            <div className="text-center">
              <Image
                src="/images/cut-envelope.png"
                alt="Open envelope"
                width={960}
                height={1200}
                sizes="120px"
                className="lab-cutout-light mx-auto h-20 w-auto object-contain"
              />
              <span className="lab-mono mt-1.5 block text-[11px] text-slate">LEAD</span>
            </div>
            <div className="text-center">
              <Image
                src="/images/cut-resume.png"
                alt="Redacted resume"
                width={960}
                height={1200}
                sizes="120px"
                className="lab-cutout-light mx-auto h-20 w-auto object-contain"
              />
              <span className="lab-mono mt-1.5 block text-[11px] text-slate">RECORD</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-6">
            <Link
              href={CTA_HREF}
              className="inline-flex min-h-12 items-center bg-gold px-6 py-3 text-[15px] font-semibold text-obsidian transition-colors duration-150 hover:bg-forest hover:text-ivory"
            >
              {CTA_LABEL}
            </Link>
            <Link href="/workflows" className="arrow-link min-h-12 items-center text-[15px] text-forest">
              All eight workflows
            </Link>
          </div>
        </div>

        {/* Right dark botanical baize stage with photo bleed + live workflow window */}
        <div
          data-surface="dark"
          className="relative flex flex-col justify-between overflow-hidden bg-forest px-5 py-7 md:px-10 lg:col-span-7 lg:py-8 xl:pr-[max(3rem,calc((100vw-80rem)/2+3rem))]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-repeat opacity-45"
            style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
          />

          <div className="relative z-10 mb-5 grid items-center gap-4 sm:grid-cols-12">
            <div className="relative aspect-[16/8] overflow-hidden bg-obsidian sm:col-span-8">
              <Image
                src="/images/hero-paper-fall.jpg"
                alt="Suspended paper sheets falling toward a green tabletop."
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/8] overflow-hidden bg-obsidian sm:col-span-4 sm:aspect-[4/3]">
              <Image
                src="/images/gate-detail.jpg"
                alt="Rubber stamp hovering above paper before contact."
                fill
                sizes="(min-width: 1024px) 18vw, 50vw"
                className="object-cover"
              />
              <span className="lab-mono absolute bottom-2 left-2 bg-obsidian/85 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold uppercase">
                Human gate
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <HeroPlayer workflow={lead} />
          </div>
        </div>
      </section>
    </div>
  );
}
