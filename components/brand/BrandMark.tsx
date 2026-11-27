import { useId } from "react";

type Tone = "dark" | "light";

/* Brand spectrum: blue to violet to pink. The same three stops are used for the
   waveform bars and the "o" in the wordmark. */
export const BRAND_STOPS = ["#3B82F6", "#8B5CF6", "#EC4899"] as const;

/* Temporant mark on a 200 grid: a seven-bar voice waveform (a phone call
   becoming a booking), filled with one diagonal gradient across all bars. */
const BARS = [40, 70, 110, 150, 110, 70, 40];

export function BrandMark({ className, title }: { tone?: Tone; className?: string; title?: string }) {
  const id = `tw-${useId().replace(/:/g, "")}`;
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="22" y1="25" x2="176" y2="175">
          {BRAND_STOPS.map((c, i) => (
            <stop key={c} offset={i / (BRAND_STOPS.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      {BARS.map((h, i) => (
        <rect key={i} x={22 + i * 23} y={100 - h / 2} width="16" height={h} rx="8" fill={`url(#${id})`} />
      ))}
    </svg>
  );
}

export function BrandWordmark({ tone = "dark", className = "" }: { tone?: Tone; className?: string }) {
  const ink = tone === "light" ? "text-[#0B0D1C]" : "text-[#F5F6FB]";

  return (
    <span className={`inline-block font-sans leading-none font-semibold tracking-[0.02em] ${ink} ${className}`}>
      temp<span className="brand-gradient-text">o</span>rant
    </span>
  );
}
