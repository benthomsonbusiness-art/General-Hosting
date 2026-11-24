import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/content/industries";
import { INSIGHTS } from "@/content/insights";
import { SERVICES, SUB_SERVICES, serviceHref, subServiceHref } from "@/content/services";
import { WORKFLOWS } from "@/content/workflows";
import { absolute } from "@/lib/seo";

/** Date the page copy last changed. Update it when content files change. */
const CONTENT_DATE = "2026-11-24";

// /privacy, /terms and /search stay out: the first two are noindex, the last has no content of its own.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...SERVICES.map((item) => serviceHref(item.slug)),
    ...SUB_SERVICES.map((item) => subServiceHref(item.slug)),
    "/workflows",
    ...WORKFLOWS.map((item) => `/workflows/${item.id}`),
    "/industries",
    ...INDUSTRIES.map((item) => `/industries/${item.slug}`),
    "/insights",
    "/approach",
    "/about",
    "/contact",
  ];
  return [
    ...paths.map((path) => ({ url: absolute(path), lastModified: CONTENT_DATE })),
    ...INSIGHTS.map((item) => ({ url: absolute(`/insights/${item.slug}`), lastModified: item.date })),
  ];
}
