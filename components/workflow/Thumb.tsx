import type { ReactNode } from "react";

/** One small drawing per workflow. Stroke color is inherited. */
const ART: Record<string, ReactNode> = {
  "lead-triage": (
    <>
      <path d="M8 12h40v28H8z" />
      <path d="M8 12l20 16 20-16" />
      <path d="M58 26h24M74 18l8 8-8 8"  />
    </>
  ),
  "proposal-ops": (
    <>
      <path d="M20 6h34l10 10v32H20z" />
      <path d="M28 20h24M28 28h20" />
      <path d="M28 40c6-8 8 4 13-2s8 2 15-1"  />
    </>
  ),
  "client-onboarding": (
    <>
      <path d="M12 14h18l5 6h37v28H12z" />
      <path d="M34 34l6 6 12-12"  />
    </>
  ),
  "daily-brief": (
    <>
      <path d="M10 44h70" />
      <path d="M22 44V30M36 44V20M64 44V26" />
      <path d="M50 44V10"  strokeWidth="5" />
    </>
  ),
  "ap-intake": (
    <>
      <path d="M22 6h42v42l-7-5-7 5-7-5-7 5-7-5-7 5z" />
      <path d="M30 16h26M30 32h26" />
      <path d="M28 24h30"  strokeWidth="5" />
    </>
  ),
  "support-routing": (
    <>
      <path d="M10 12h26v20H22l-6 7v-7h-6z" />
      <path d="M44 22h14M58 12h24v8H58z" />
      <path d="M44 22c8 0 6 20 14 20M58 38h24v8H58z"  />
    </>
  ),
  "meta-ads-reporting": (
    <>
      <path d="M10 46h72" />
      <path d="M10 38l16-5 14 4 14-6 12-18 14 4" />
      <circle cx="66" cy="13" r="6"  />
    </>
  ),
  "recruiting-screen": (
    <>
      <path d="M20 6h44v42H20z" />
      <circle cx="33" cy="18" r="5" />
      <path d="M44 16h12M28 40h28" />
      <path d="M28 31h28"  strokeWidth="5" />
    </>
  ),
};

export function Thumb({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 90 54"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      className={className}
    >
      {ART[id]}
    </svg>
  );
}
