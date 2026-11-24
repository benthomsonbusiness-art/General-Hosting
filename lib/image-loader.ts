/**
 * next/image loader for Cloudflare Workers, where the default optimizer needs a paid
 * binding. It maps to files produced by scripts/resize-images.mjs and never upscales.
 */
const SIZED: Record<string, number[]> = {
  "/images/hero-architecture.jpg": [480, 640, 800, 960, 1280],
  "/images/systems-geometry.jpg": [480, 640, 800, 960, 1280],
  "/images/editorial-workspace.jpg": [480, 640, 800, 960, 1152],
  "/images/consultation-room.jpg": [480, 640, 800, 864],
};

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const widths = SIZED[src];
  if (!widths) return `${src}?w=${width}`;
  const match = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  const name = src.replace("/images/", "").replace(/\.jpg$/, "");
  return `/images/sized/${name}-${match}.webp`;
}
