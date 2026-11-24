"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const SCOPE = [
  "Process Audit",
  "Custom Automation",
  "API & CRM Orchestration",
  "Human-in-the-Loop Controls",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "10%"]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden bg-[#0B1F16] text-[#F7F4EC]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
          <Image
            src="/images/hero-architecture.jpg"
            alt="A twilight room: green marble, a walnut slat wall, a brass linear light, and a city beyond the window."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[22%_center] md:object-center"
          />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B1F16]/85 via-[#0B1F16]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1F16]/80 md:hidden" />

      <div className="relative z-10 flex min-h-[92vh] flex-col justify-end">
        <div className="mx-auto w-full max-w-[90rem] px-6 pt-32 pb-10 md:px-10 md:pb-14">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#C5A869] uppercase">
            AI Workflow Consulting
          </p>
          <h1 className="mt-5 max-w-[12em] font-display text-[clamp(3rem,6.2vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.02em]">
            We build the AI systems your operations <span className="italic">actually run on.</span>
          </h1>
          <p className="mt-7 max-w-[40rem] text-[17px] leading-[1.65] text-[#F7F4EC]/80 md:text-[18px]">
            Valentini &amp; Co. audits high-friction processes and engineers workflows around the
            tools a company already runs, pairing deterministic code with AI only where judgment is
            required. The handover is a system the team controls, monitors, and can change.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              href="#diagnostic"
              className="inline-flex bg-[#F7F4EC] px-5 py-3.5 text-[11px] font-medium tracking-[0.16em] text-[#133224] uppercase transition-colors hover:bg-[#C5A869]"
            >
              Request a Diagnostic
            </Link>
            <Link
              href="#architecture"
              className="text-[14px] text-[#F7F4EC]/85 underline decoration-[#C5A869]/80 underline-offset-[7px] hover:text-[#F7F4EC]"
            >
              Explore the blueprints <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-[rgba(197,168,105,0.25)] bg-[#0B1F16]/35">
          <ul className="mx-auto grid max-w-[90rem] grid-cols-2 gap-x-4 gap-y-2 px-6 py-4 sm:flex sm:flex-wrap sm:gap-x-5 md:px-10">
            {SCOPE.map((item, index) => (
              <li
                key={item}
                className="font-mono text-[11px] tracking-[0.14em] text-[#F7F4EC]/75 uppercase sm:text-[12px]"
              >
                {index > 0 ? (
                  <span className="mr-5 hidden text-[#C5A869]/80 sm:inline" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
