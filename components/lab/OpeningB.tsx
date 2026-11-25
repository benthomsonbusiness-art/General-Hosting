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

export function OpeningB({ lead }: { lead: Workflow }) {
  const [motion] = useMotion();
  const [paused, setPaused] = useState(false);
  const [fanned, setFanned] = useState(false);
  const activeMotion = motion && !paused;

  return (
    <div data-motion={activeMotion ? "on" : "off"} className="lab-root bg-paper text-ink">
      <LabMotionBar active="b" paused={paused} onTogglePause={() => setPaused((p) => !p)} tone="light" />

      {/* Sunlit archival broadsheet opening */}
      <section data-surface="light" className="relative overflow-hidden bg-[#fcfbf7]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-repeat opacity-45"
          style={{ backgroundImage: "url(/images/sized/texture-paper-1024.webp)", backgroundSize: "512px 512px" }}
        />

        <div className="wrap relative pt-6 pb-12 lg:pt-8 lg:pb-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/15 pb-3">
            <p className="lab-mono text-[11px] tracking-[0.14em] text-slate uppercase sm:text-[12px]">
              Operations engineering · Owner-led firms
            </p>
            <p className="lab-mono text-[11px] tracking-[0.12em] uppercase sm:text-[12px]">
              <span className="text-slate">01 Code · 02 Model · </span>
              <span className="font-semibold text-gold-ink">03 Person</span>
              <span className="text-slate"> · 04 Record</span>
            </p>
          </div>

          <h1
            className={`lab-display mt-4 max-w-[17ch] text-[clamp(2.25rem,5.2vw,5.4rem)] text-forest ${
              fanned ? "lab-display-wide" : ""
            }`}
          >
            We build the AI systems your operations actually run on.
          </h1>

          {/* Asymmetric image window + tactile paper fan visible above the fold */}
          <div className="mt-7 grid items-center gap-8 lg:mt-8 lg:grid-cols-12">
            <div
              className="order-2 relative cursor-pointer lg:order-1 lg:col-span-5"
              onMouseEnter={() => setFanned(true)}
              onMouseLeave={() => setFanned(false)}
            >
              <div className="relative mx-auto h-[13.5rem] w-full max-w-[23rem] sm:h-[15rem]">
                <div
                  className="lab-cutout-light absolute top-2 left-2 w-36 sm:w-44"
                  style={{
                    transform: fanned
                      ? "translate3d(-16px, -8px, 0) rotate(-13deg)"
                      : "translate3d(0, 0, 0) rotate(-8deg)",
                  }}
                >
                  <Image src="/images/cut-contract.png" alt="Bound agreement" width={960} height={1200} sizes="180px" className="h-auto w-full" />
                </div>
                <div
                  className="lab-cutout-light absolute top-3 left-20 w-32 sm:left-24 sm:w-40"
                  style={{
                    transform: fanned
                      ? "translate3d(10px, -14px, 0) rotate(2deg)"
                      : "translate3d(0, 0, 0) rotate(1deg)",
                  }}
                >
                  <Image src="/images/cut-letter.png" alt="Folded letter sheet" width={960} height={1200} sizes="165px" className="h-auto w-full" />
                </div>
                <div
                  className="lab-cutout-light absolute top-5 right-3 w-24 sm:w-28"
                  style={{
                    transform: fanned
                      ? "translate3d(18px, 4px, 0) rotate(14deg)"
                      : "translate3d(0, 0, 0) rotate(9deg)",
                  }}
                >
                  <Image src="/images/cut-receipt.png" alt="Paper receipt" width={960} height={1200} sizes="120px" className="h-auto w-full" />
                </div>
              </div>
              <p className="mt-2 max-w-[26rem] text-[1rem] leading-relaxed text-ink">{HOME.dek}</p>
              <div className="mt-5 flex flex-wrap items-center gap-6">
                <Link
                  href={CTA_HREF}
                  className="inline-flex min-h-12 items-center bg-gold px-6 py-3 text-[15px] font-semibold text-obsidian transition-colors duration-150 hover:bg-forest hover:text-ivory"
                >
                  {CTA_LABEL}
                </Link>
                <Link href="/workflows" className="arrow-link min-h-12 items-center text-[15px] text-forest">
                  Try the workflows
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest shadow-[0_28px_60px_-24px_rgb(19_50_36_/_0.35)]">
                <Image
                  src="/images/hero-paper-fall.jpg"
                  alt="Paper invoices, letters, and envelopes suspended mid-fall above a dark forest-green desk."
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-2.5 flex items-center justify-between text-[13px] text-slate">
                <span>Raw work arrives unformatted on paper, in email, and across forms.</span>
                <span className="lab-mono text-terracotta">FIG. 01</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Macro rubber stamp pause banner bleeding into the live workflow stage */}
      <section data-surface="dark" className="relative bg-forest py-16 text-ivory lg:py-24">
        <div className="wrap">
          <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden bg-obsidian">
            <Image
              src="/images/gate-detail.jpg"
              alt="Macro view of a brass and walnut stamp hovering millimeters above cotton paper before a human decision."
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/85 via-obsidian/30 to-transparent p-6 sm:p-8">
              <p className="lab-mono text-[12px] tracking-[0.14em] text-gold uppercase">The pause is the rule</p>
              <p className="mt-1 max-w-[34rem] text-[1.0625rem] text-ivory sm:text-[1.125rem]">
                Everything runs on its own until a decision reaches a customer or moves money. Then it stops and waits.
              </p>
            </div>
          </div>

          <HeroPlayer workflow={lead} />
        </div>
      </section>
    </div>
  );
}
