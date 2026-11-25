"use client";

import { useMotion } from "@/components/workflow/hooks";

/** Site-wide Motion switch persisted under valentini-motion. */
export function MotionSwitch({
  tone = "light",
  compact = false,
}: {
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  const [motion, setMotion] = useMotion();
  const dark = tone === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={motion}
      onClick={() => setMotion(!motion)}
      className={`inline-flex min-h-11 items-center gap-2.5 text-[14px] font-semibold transition-colors duration-150 ${
        dark ? "text-ivory/85 hover:text-ivory" : "text-forest hover:text-obsidian"
      }`}
    >
      <span>{compact ? "Motion" : "Motion"}</span>
      <span
        aria-hidden
        className={`relative h-5 w-9 border ${dark ? "border-ivory/70" : "border-forest"}`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 transition-transform duration-150 ${
            dark ? "bg-ivory" : "bg-forest"
          } ${motion ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}
