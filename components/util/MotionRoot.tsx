"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps only the workflow player. Follows the system setting unless the visitor used the switch. */
export function MotionRoot({ motion, children }: { motion?: boolean; children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={motion === undefined ? "user" : motion ? "never" : "always"}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
