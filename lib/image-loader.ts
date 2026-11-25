/**
 * next/image loader for Cloudflare Workers, where the default optimizer needs a paid
 * binding. It maps to files produced by scripts/resize-images.mjs and never upscales.
 */
const SIZED: Record<string, number[]> = {
  "/images/approach-build.jpg": [480, 640, 800, 960, 1280],
  "/images/approach-design.jpg": [480, 640, 800, 960, 1280],
  "/images/approach-handover.jpg": [480, 640, 800, 960, 1280],
  "/images/approach-map.jpg": [480, 640, 800, 960, 1280],
  "/images/consultation-room.jpg": [480, 640, 800, 864],
  "/images/cut-contract.png": [480, 640, 800, 960],
  "/images/cut-envelope.png": [480, 640, 800, 960],
  "/images/cut-invoice.png": [480, 640, 800, 960],
  "/images/cut-letter.png": [480, 640, 800, 960],
  "/images/cut-notebook.png": [480, 640, 800, 960],
  "/images/cut-receipt.png": [480, 640, 800, 960],
  "/images/cut-resume.png": [480, 640, 800, 960],
  "/images/cut-ticket.png": [480, 640, 800, 960],
  "/images/editorial-workspace.jpg": [480, 640, 800, 960, 1152],
  "/images/gate-detail.jpg": [480, 640, 800, 960, 1280, 1376],
  "/images/hero-architecture.jpg": [480, 640, 800, 960, 1280],
  "/images/hero-paper-fall.jpg": [480, 640, 800, 960, 1280, 1376],
  "/images/ind-finance.jpg": [480, 640, 800, 864],
  "/images/ind-home.jpg": [480, 640, 800, 864],
  "/images/ind-professional.jpg": [480, 640, 800, 864],
  "/images/ind-realestate.jpg": [480, 640, 800, 864],
  "/images/ind-retail.jpg": [480, 640, 800, 864],
  "/images/ind-wellness.jpg": [480, 640, 800, 864],
  "/images/systems-geometry.jpg": [480, 640, 800, 960, 1280],
  "/images/texture-green.jpg": [480, 640, 800, 960, 1024],
  "/images/texture-paper.jpg": [480, 640, 800, 960, 1024],
  "/images/wf-ads.jpg": [480, 640, 800, 960, 1152],
  "/images/wf-brief.jpg": [480, 640, 800, 960, 1152],
  "/images/wf-invoice.jpg": [480, 640, 800, 960, 1264],
  "/images/wf-lead.jpg": [480, 640, 800, 960, 1264],
  "/images/wf-onboarding.jpg": [480, 640, 800, 960, 1152],
  "/images/wf-proposal.jpg": [480, 640, 800, 960, 1152],
  "/images/wf-recruiting.jpg": [480, 640, 800, 960, 1152],
  "/images/wf-support.jpg": [480, 640, 800, 960, 1152],
};

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const widths = SIZED[src];
  if (!widths) return `${src}?w=${width}`;
  const match = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];
  const name = src.replace("/images/", "").replace(/\.(jpe?g|png|webp)$/i, "");
  return `/images/sized/${name}-${match}.webp`;
}
