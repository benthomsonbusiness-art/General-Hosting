"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroPlayer } from "@/components/workflow/HeroPlayer";
import { useMotion } from "@/components/workflow/hooks";
import { HOME } from "@/content/pages";
import type { Workflow } from "@/content/workflows";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

export function HomeOpening({ lead }: { lead: Workflow }) {
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
    <div data-motion={activeMotion ? "on" : "off"} className="bg-obsidian text-ivory">
      {/* Full-viewport opening: falling paper field with monumental type woven between layers */}
      <section
        ref={heroRef}
        data-surface="dark"
        className="relative min-h-[calc(100svh-var(--header-h))] overflow-hidden bg-obsidian"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-repeat opacity-35 mix-blend-soft-light"
          style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transform: `translate3d(0, ${offset * 30}px, 0) scale(${1 + offset * 0.04})`,
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
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/55 via-obsidian/22 to-obsidian/92" />
        </div>

        {/* Floating transparent paper cutouts crossing the headline plane */}
        <div className="pointer-events-none absolute inset-0 mx-auto max-w-[92rem]">
          <div
            className="paper-cutout lab-float-a absolute top-[15%] right-[-2%] z-20 w-24 sm:top-[8%] sm:right-[15%] sm:w-44 lg:w-56"
            style={{
              transform: `translate3d(${offset * -28}px, ${offset * -44}px, 0) rotate(${-7 + offset * 4}deg)`,
            }}
          >
            <Image
              src="/images/cut-envelope.png"
              alt=""
              width={960}
              height={1200}
              loading="eager"
              sizes="240px"
              className="h-auto w-full"
            />
          </div>
          <div
            className="paper-cutout lab-float-b absolute top-[34%] right-[2%] z-20 hidden w-44 sm:block lg:top-auto lg:right-[30%] lg:bottom-[18%] lg:w-52"
            style={{
              transform: `translate3d(${offset * 34}px, ${offset * 38}px, 0) rotate(${8 - offset * 5}deg)`,
            }}
          >
            <Image
              src="/images/cut-invoice.png"
              alt=""
              width={960}
              height={1200}
              loading="eager"
              sizes="220px"
              className="h-auto w-full"
            />
          </div>
          <div
            className="paper-cutout absolute top-[46%] right-[2%] z-20 hidden w-44 md:block lg:right-[5%] lg:w-48"
            style={{
              transform: `translate3d(0, ${offset * 52}px, 0) rotate(${-14 + offset * 6}deg)`,
            }}
          >
            <Image
              src="/images/cut-ticket.png"
              alt=""
              width={960}
              height={1200}
              loading="eager"
              sizes="200px"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="wrap relative flex min-h-[inherit] flex-col justify-between pt-6 pb-8 lg:pt-11 lg:pb-12">
          <div className="relative z-30 flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] tracking-[0.14em] text-ivory/75 uppercase sm:text-[12px]">
              Paper becomes motion — paused where a person decides
            </p>
            {motion ? (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-ivory/25 bg-obsidian/70 px-3 text-[12px] font-medium whitespace-nowrap text-ivory/90 transition-colors duration-150 hover:border-ivory/50 hover:text-ivory"
              >
                {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
                {paused ? "Resume drift" : "Pause drift"}
              </button>
            ) : null}
          </div>

          <div className="relative my-auto py-4 lg:py-6">
            <h1 className="display max-w-[14ch] text-ivory max-sm:text-[2.45rem]">
              <span className="relative z-10 block">We build the</span>
              <span className="relative z-10 block text-ivory/95">AI systems your</span>
              <span className="relative z-30 block">
                operations <span className="lab-display-wide italic text-paper">actually run on.</span>
              </span>
            </h1>
          </div>

          <div className="relative z-30 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-t border-ivory/20 pt-5 lg:pt-6">
            <p className="max-w-[36rem] text-[0.98rem] leading-relaxed text-ivory/90 sm:text-[1.0625rem]">
              {HOME.dek}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link href={CTA_HREF} className="btn btn-primary">
                {CTA_LABEL}
              </Link>
              <Link href="/workflows" className="arrow-link min-h-12 items-center text-[15px] text-ivory hover:text-ivory">
                See all eight workflows
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll transition: suspended sheets sort into operational lanes and land inside the live player */}
      <section data-surface="light" className="relative overflow-hidden bg-paper py-16 text-ink lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-repeat opacity-35"
          style={{ backgroundImage: "url(/images/sized/texture-paper-1024.webp)", backgroundSize: "512px 512px" }}
        />

        <div className="wrap relative grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[12px] tracking-[0.14em] text-slate uppercase">Sorted into lanes</p>
            <h2 className="h2 mt-3 text-forest">One sheet enters. The gate waits.</h2>
            <p className="mt-5 max-w-[29rem] text-slate">
              Incoming messages, supplier invoices, and daily numbers sort themselves by rule before a person checks the
              draft. Watch one lead arrive and pause for your decision.
            </p>

            {/* Three sorted physical lanes converging toward the stage */}
            <div className="mt-9 space-y-3 border-t border-ink/12 pt-6">
              {[
                {
                  lane: "01",
                  title: "Lead intake",
                  detail: "Domain checked, fit scored, reply drafted",
                  img: "/images/cut-envelope.png",
                  alt: "Open correspondence envelope",
                  shift: offset * 14,
                },
                {
                  lane: "02",
                  title: "Payables review",
                  detail: "Lines read, purchase order matched, exception flagged",
                  img: "/images/cut-invoice.png",
                  alt: "Ruled ledger invoice",
                  shift: offset * 8,
                },
                {
                  lane: "03",
                  title: "Morning brief",
                  detail: "Three systems pulled, variance cited by row",
                  img: "/images/cut-letter.png",
                  alt: "Folded archival brief",
                  shift: offset * 4,
                },
              ].map((item) => (
                <div
                  key={item.lane}
                  className="flex items-center gap-4 border border-ink/10 bg-ivory/60 px-4 py-3 transition-transform duration-300"
                  style={{
                    transform: activeMotion ? `translate3d(${item.shift}px, 0, 0)` : undefined,
                  }}
                >
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={960}
                    height={1200}
                    sizes="64px"
                    className="paper-cutout-light h-14 w-auto shrink-0 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] tracking-[0.12em] text-terracotta uppercase">
                      Lane {item.lane}
                    </p>
                    <p className="text-[16px] font-semibold text-forest">{item.title}</p>
                    <p className="text-[14px] text-slate">{item.detail}</p>
                  </div>
                </div>
              ))}
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
