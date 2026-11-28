/**
 * next/image loader for Cloudflare Workers, where the default optimizer needs a paid
 * binding. It maps to files produced by scripts/resize-images.mjs and never upscales.
 */
const SIZED: Record<string, number[]> = {
  "/images/ind-home.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-retail.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ind-wellness.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/ins-daily-brief.jpg": [480, 640, 800, 960, 1280, 1600, 1920],
  "/images/key-hero.jpg": [480, 640, 800, 960, 1280, 1600, 1920, 2400],
  "/images/og-share.jpg": [480, 640, 800, 960, 1200],
  "/images/station-code.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/station-model.jpg": [480, 640, 800, 960, 1280, 1600],
  "/images/texture-console.jpg": [480, 640, 800, 960, 1024],
};

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("..")) {
    throw new Error("imageLoader only permits local / public paths.");
  }
  const safeWidth = Number.isFinite(width) ? Math.max(16, Math.min(4096, Math.trunc(width))) : 800;
  const widths = SIZED[src];
  if (!widths) return `${src}?w=${safeWidth}`;
  const match = widths.find((candidate) => candidate >= safeWidth) ?? widths[widths.length - 1];
  const name = src.replace("/images/", "").replace(/\.(jpe?g|png|webp)$/i, "");
  return `/images/sized/${name}-${match}.webp`;
}
