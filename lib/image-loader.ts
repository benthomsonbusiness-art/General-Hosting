/**
 * next/image loader for Cloudflare Workers, where the default optimizer needs a paid
 * binding. It maps to files produced by scripts/resize-images.mjs and never upscales.
 */
const SIZED: Record<string, number[]> = {
  "/images/ind-finance.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-home.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-professional.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-realestate.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-retail.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-wellness.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ins-approval-gate.jpg": [480, 640, 800, 960, 1280, 1600, 1920],
  "/images/ins-audit-week-one.jpg": [480, 640, 800, 960, 1280, 1600, 1920],
  "/images/ins-daily-brief.jpg": [480, 640, 800, 960, 1280, 1600, 1920],
  "/images/ins-deterministic-first.jpg": [480, 640, 800, 960, 1280, 1600, 1920],
  "/images/key-hero.jpg": [480, 640, 800, 960, 1280, 1600, 1920, 2400],
  "/images/og-share.jpg": [480, 640, 800, 960, 1200],
  "/images/station-code.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/station-model.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/station-record.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/texture-console.jpg": [480, 640, 800, 960, 1024],
};

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const widths = SIZED[src];
  if (!widths) return `${src}?w=${width}`;
  const match = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  const name = src.replace("/images/", "").replace(/\.(jpe?g|png|webp)$/i, "");
  return `/images/sized/${name}-${match}.webp`;
}
