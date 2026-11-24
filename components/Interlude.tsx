"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative h-[42vh] min-h-[320px] overflow-hidden bg-[#0B1F16]">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
        <Image
          src="/images/systems-geometry.jpg"
          alt="Vertical brass and dark stone fins crossed by sharp diagonal sunlight."
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#0B1F16]/45" />
      <div className="relative flex h-full items-center justify-center px-6">
        <p className="max-w-[18em] text-center font-display text-[clamp(1.85rem,3.5vw,3.15rem)] leading-[1.12] font-medium tracking-[-0.02em] text-[#F7F4EC] italic">
          The value is the contract around the model: what enters, what must be true, and who is
          allowed to let it leave.
        </p>
      </div>
    </section>
  );
}
