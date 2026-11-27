import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site.ts";

export const DEFAULT_SHARE_IMAGE = {
  url: "/images/og-share.jpg",
  width: 1200,
  height: 630,
  alt: "Temporant logo: a blue-to-pink voice waveform beside the temporant wordmark, with the line AI does the busywork. You stay in the loop.",
};

export function absolute(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** Page-level openGraph replaces the parent's, so images are always set here. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
  article,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
  article?: { publishedTime: string };
}): Metadata {
  const full = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const url = absolute(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...(article
        ? { type: "article" as const, publishedTime: article.publishedTime }
        : { type: "website" as const }),
      locale: "en_US",
      siteName: SITE_NAME,
      title: full,
      description,
      url,
      images: [DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [DEFAULT_SHARE_IMAGE],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absolute(path),
    provider: { "@type": "ProfessionalService", name: SITE_NAME, url: SITE_URL },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
