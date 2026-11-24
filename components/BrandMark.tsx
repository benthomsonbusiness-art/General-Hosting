type EmblemVariant = "dark" | "light";

const inkFor: Record<EmblemVariant, string> = {
  dark: "#F7F4EC",
  light: "#133224",
};

export function BrandEmblem({
  variant = "dark",
  className,
  title,
}: {
  variant?: EmblemVariant;
  className?: string;
  title?: string;
}) {
  const ink = inkFor[variant];
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      fill="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        stroke="#C5A869"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path fill={ink} d="M12 16.2h14.6v1.7H12z" />
      <path fill={ink} d="M14.8 17.8h8.4L35.4 51.2H27.6z" />
      <path fill="#C5A869" d="M42.4 15.6h12.4v1H42.4z" />
      <path fill="#C5A869" d="M50.2 16.7h1.25L36.15 51.2h-1.3z" />
    </svg>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`mr-[-0.22em] inline-block font-display text-[15px] leading-none font-medium tracking-[0.22em] text-on-dark uppercase sm:text-base ${className}`}
    >
      Valentini <span className="text-gold italic">&amp;</span> Co.
    </span>
  );
}
