import Image from "next/image";

/**
 * Holds a photograph at its final ratio. Until the file is wired, a coded panel
 * fills the same box so the layout does not shift.
 */
export function HardwareFrame({
  src,
  alt,
  width,
  height,
  sizes,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative w-full min-w-0 max-w-full overflow-hidden bg-forest ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0">
          <svg viewBox="0 0 240 103" className="h-full w-full" aria-hidden>
            <rect width="240" height="103" className="fill-forest" />
            <rect x="148" y="36" width="28" height="28" rx="2" className="fill-gold" />
            <rect x="151" y="33" width="22" height="4" rx="1" className="fill-ivory/55" />
          </svg>
        </div>
      )}
    </div>
  );
}
