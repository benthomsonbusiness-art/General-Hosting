"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/workflow/hooks";
import { HOME } from "@/content/pages";

/**
 * Pinned sequence on one crisp cotton sheet: Code -> Model -> Person -> Record.
 * Gold illuminates ONLY at "Person" alongside the hovering rubber stamp photograph.
 */
export function HomePathSequence() {
  const [motion] = useMotion();
  const [active, setActive] = useState(2); // Default to Person when reduced-motion/initial so the gate thesis reads immediately
  const stationRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const steps = HOME.how.steps;

  useEffect(() => {
    if (!motion) return;
    const observers: IntersectionObserver[] = [];
    stationRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(idx);
        },
        { rootMargin: "-38% 0px -38% 0px", threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [motion]);

  const current = steps[active];
  const isPerson = current.title === "Person";

  return (
    <section data-surface="dark" aria-labelledby="how" className="relative bg-obsidian py-20 text-ivory lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-repeat opacity-35"
        style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
      />

      <div className="wrap relative">
        <div className="max-w-[44rem]">
          <p className="font-mono text-[12px] tracking-[0.14em] text-ivory/65 uppercase">Architecture</p>
          <h2 id="how" className="h2 mt-3 text-ivory">
            {HOME.how.heading}
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:mt-16 lg:grid-cols-12">
          {/* Pinned crisp cotton paper sheet showing the active station and gold gate */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-7">
            <div
              data-surface="light"
              className="relative overflow-hidden bg-paper p-7 text-ink shadow-[0_32px_70px_-24px_rgb(0_0_0_/_0.65)] sm:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-repeat opacity-35"
                style={{ backgroundImage: "url(/images/sized/texture-paper-1024.webp)", backgroundSize: "512px 512px" }}
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-4">
                  <span className="font-mono text-[12px] tracking-[0.14em] text-slate uppercase">
                    Station 0{active + 1} of 04
                  </span>
                  <span
                    className={`px-3 py-1 font-mono text-[12px] font-semibold uppercase ${
                      isPerson ? "bg-gold text-obsidian" : "bg-ivory text-forest"
                    }`}
                  >
                    {isPerson ? "Human gate — stops here" : "Runs automatically"}
                  </span>
                </div>

                {/* Horizontal progress ledger across the single sheet */}
                <ol className="mt-6 grid grid-cols-4 gap-2 border-b border-ink/12 pb-6">
                  {steps.map((step, idx) => {
                    const selected = idx === active;
                    const personNode = step.title === "Person";
                    return (
                      <li key={step.title}>
                        <button
                          type="button"
                          onClick={() => setActive(idx)}
                          className={`w-full border-t-2 pt-2.5 text-left transition-colors duration-150 ${
                            selected
                              ? personNode
                                ? "border-gold-ink text-gold-ink"
                                : "border-forest text-forest"
                              : "border-ink/15 text-slate hover:text-forest"
                          }`}
                        >
                          <span className="block font-mono text-[11px]">{`0${idx + 1}`}</span>
                          <span className="mt-0.5 block text-[15px] font-semibold">{step.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-7 grid items-center gap-6 sm:grid-cols-12">
                  <div className="sm:col-span-7">
                    <h3
                      className={`font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[0.95] font-semibold tracking-[-0.03em] ${
                        isPerson ? "text-gold-ink" : "text-forest"
                      }`}
                    >
                      {current.title}
                    </h3>
                    <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink">{current.body}</p>
                  </div>

                  <div className="sm:col-span-5">
                    {isPerson ? (
                      <div className="relative aspect-[16/11] overflow-hidden bg-obsidian">
                        <Image
                          src="/images/gate-detail.jpg"
                          alt="Macro view of a walnut and brass rubber stamp hovering millimeters above cotton paper."
                          fill
                          loading="eager"
                          sizes="280px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-ivory/70 p-4">
                        <Image
                          src={
                            active === 0
                              ? "/images/cut-ticket.png"
                              : active === 1
                                ? "/images/cut-letter.png"
                                : "/images/cut-contract.png"
                          }
                          alt=""
                          width={960}
                          height={1200}
                          sizes="120px"
                          className="paper-cutout-light h-28 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-5 text-[14px]">
                  <p className="max-w-[30rem] text-slate">{HOME.how.own}</p>
                  <Link href="/approach" className="arrow-link min-h-11 items-center text-forest">
                    How we work
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable station triggers on the right */}
          <div className="space-y-6 lg:col-span-5 lg:space-y-10">
            {steps.map((step, idx) => {
              const selected = idx === active;
              const personNode = step.title === "Person";
              return (
                <button
                  key={step.title}
                  ref={(el) => {
                    stationRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`block w-full border-l-2 px-6 py-6 text-left transition-colors duration-200 ${
                    selected
                      ? personNode
                        ? "border-gold bg-moss/60"
                        : "border-ivory bg-forest/70"
                      : "border-ivory/20 bg-obsidian/40 hover:border-ivory/45"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`font-mono text-[12px] tracking-[0.14em] uppercase ${
                        personNode ? "text-gold" : "text-ivory/65"
                      }`}
                    >
                      Station 0{idx + 1}
                    </span>
                    {personNode ? (
                      <span className="h-2.5 w-2.5 rotate-45 bg-gold" aria-hidden />
                    ) : null}
                  </div>
                  <p className="mt-2 font-display text-[2rem] leading-none font-semibold text-ivory">{step.title}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ivory/80">{step.body}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
