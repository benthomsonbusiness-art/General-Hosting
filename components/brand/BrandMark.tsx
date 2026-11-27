type Tone = "dark" | "light";

const AMBER = "#FFB547";
const CYAN = "#38D6C4";

/* Temporant mark on a 420 grid: amber rounded-square frame, bold geometric T.
   The crossbar is ink (white on dark, navy on light); the cyan stem leans a few
   degrees like a clock hand and is notched off the crossbar. Every part is at
   least ~1.7px wide at the 28px header size. */
const FRAME = { x: 22, y: 22, size: 376, radius: 76, stroke: 28 };
const CROSSBAR = "M 102 104 H 318 A 12 12 0 0 1 330 116 V 152 A 12 12 0 0 1 318 164 H 102 A 12 12 0 0 1 90 152 V 116 A 12 12 0 0 1 102 104 Z";
const STEM = "M 181 182 H 239 L 252 318 H 196 Z";

export function BrandMark({
  tone = "dark",
  className,
  title,
}: {
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const ink = tone === "light" ? "#0E1024" : "#F4F5FA";
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      fill="none"
    >
      <rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.size}
        height={FRAME.size}
        rx={FRAME.radius}
        stroke={AMBER}
        strokeWidth={FRAME.stroke}
      />
      <path fill={ink} d={CROSSBAR} />
      <path fill={CYAN} d={STEM} />
    </svg>
  );
}

export function BrandWordmark({
  tone = "dark",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const ink = tone === "light" ? "text-[#0E1024]" : "text-[#F4F5FA]";
  /* Amber fails contrast on a light ground, so the light tone uses a deeper amber. */
  const accent = tone === "light" ? "text-[#9A5B00]" : "text-[#FFB547]";

  return (
    <span
      className={`inline-block font-sans leading-none font-semibold tracking-[0.2em] sm:tracking-[0.24em] ${ink} ${className}`}
    >
      TEMP<span className={accent}>O</span>RANT
    </span>
  );
}
