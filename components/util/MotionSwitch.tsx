"use client";

import { useEffect } from "react";
import { useMotion } from "@/components/workflow/hooks";

/**
 * The only Motion switch. An icon button; aria-checked carries the state. The choice is saved
 * in localStorage and mirrored to <html data-motion>, which the CSS reads: the home packet and
 * the diagram's hover animation run only when it is "on".
 */
export function MotionSwitch() {
  const [motion, setMotion] = useMotion();

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={motion}
      aria-label="Motion"
      onClick={() => setMotion(!motion)}
      className="flex h-11 w-11 items-center justify-center text-ivory"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden fill="none">
        <path
          d="M4 15.5c2.2-1.2 3.4-3.4 3.4-6.2S6.2 4.2 4 3"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={motion ? 0.45 : 1}
        />
        <path d="M8.2 17.5c2.8-1.6 4.4-4.4 4.4-8.2S11 2.6 8.2 1" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12.4 19c3.4-2 5.2-5.4 5.2-9.6S15.8 1.8 12.4 0"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={motion ? 1 : 0.35}
          transform="translate(0 1.5)"
        />
      </svg>
    </button>
  );
}
