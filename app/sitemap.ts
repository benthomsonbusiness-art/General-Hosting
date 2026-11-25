import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/content/insights";
import { SERVICES, serviceHref } from "@/content/services";
import { WORKFLOWS } from "@/content/workflows";
import { absolute } from "@/lib/seo";

/** Date the page copy last changed. Update it when content files change. */
const CONTENT_DATE = "2026-11-25";

// /privacy, /terms and /search stay out: the first two are noindex, the last has no content of its own.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...SERVICES.map((item) => serviceHref(item.slug)),
    "/how-it-works",
    "/workflows",
    ...WORKFLOWS.map((item) => `/workflows/${item.id}`),
    "/industries",
    "/insights",
    "/testimonials",
    "/about",
    "/contact",
  ];
  return [
    ...paths.map((path) => ({ url: absolute(path), lastModified: CONTENT_DATE })),
    ...INSIGHTS.map((item) => ({ url: absolute(`/insights/${item.slug}`), lastModified: item.date })),
  ];
}
