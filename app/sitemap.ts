import type { MetadataRoute } from "next";
import { SERVICES, serviceHref } from "@/content/services";
import { WORKFLOWS } from "@/content/workflows";
import { absolute } from "@/lib/seo";

/** Date the page copy last changed. Update it when content files change. */
const CONTENT_DATE = "2026-11-27";

// /privacy, /terms and /search stay out: legal notices and search utility carry no landing content of their own.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...SERVICES.map((item) => serviceHref(item.slug)),
    "/how-it-works",
    "/workflows",
    ...WORKFLOWS.map((item) => `/workflows/${item.id}`),
    "/industries",
    "/testimonials",
    "/about",
    "/contact",
  ];
  return [
    ...paths.map((path) => ({ url: absolute(path), lastModified: CONTENT_DATE })),
  ];
}
