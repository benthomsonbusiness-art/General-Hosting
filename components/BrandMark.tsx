type Tone = "dark" | "light";

const IVORY_V =
  "M 84 95 H 164 C 160 101, 152 109, 146 113 L 234 321 L 219 367 L 109 113 C 104 109, 94 101, 84 95 Z";
const GOLD_SERIF =
  "M 306 94 H 342 C 334 99, 324 108, 320 116 L 316 116 C 318 108, 312 99, 306 94 Z";

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
      <path fill="#C5A869" d={GOLD_SERIF} />
      <line
        x1="318"
        y1="114"
        x2="239"
        y2="312"
        stroke="#C5A869"
        strokeWidth="1.25"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
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
      className={`inline-block font-display leading-none font-medium tracking-[0.18em] uppercase sm:tracking-[0.22em] ${ink} ${className}`}
    >
      Valentini <span className="text-[#C5A869] italic">&amp;</span> Co.
    </span>
  );
}
