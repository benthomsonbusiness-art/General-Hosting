type Tone = "dark" | "light";

const IVORY_V =
  "M 84 95 H 164 C 160 101, 152 109, 146 113 L 234 321 L 219 367 L 109 113 C 104 109, 94 101, 84 95 Z";
/* Filled, tapered right stroke. At a 28px header mark the narrow end is about 1.6px,
   so the split (ivory / gold) still reads. The large lockup keeps the hairline. */
const GOLD_STROKE =
  "M 296 88 H 352 L 344 104 L 331 119.2 L 250.1 316.4 L 227.9 307.6 L 305 108.8 L 300 104 Z";

export function BrandMark({
  tone = "dark",
  className,
  title,
}: {
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const ink = tone === "light" ? "#133224" : "#F7F4EC";
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
        x="1"
        y="1"
        width="418"
        height="418"
        stroke="#C5A869"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path fill={ink} d={IVORY_V} />
      <path fill="#C5A869" d={GOLD_STROKE} />
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
  const ink = tone === "light" ? "text-[#133224]" : "text-[#F7F4EC]";

  return (
    <span
      className={`inline-block font-wordmark leading-none font-medium tracking-[0.18em] sm:tracking-[0.22em] ${ink} ${className}`}
    >
      VALENTINI <span className="font-ampersand-face text-[#C5A869] italic">&amp;</span> CO.
    </span>
  );
}
