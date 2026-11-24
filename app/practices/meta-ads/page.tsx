import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { metaAds } from "@/lib/practices";
import { SITE_URL } from "@/lib/site";

const title = "Meta Ads Consulting";
const description = metaAds.description;
const url = `${SITE_URL}/practices/meta-ads`;
const shareImage = {
  url: "/images/hero-architecture.jpg",
  width: 1280,
  height: 720,
  alt: "Green marble, walnut slats, and a city at twilight.",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/practices/meta-ads" },
  openGraph: {
    title: `${title} — Valentini & Co.`,
    description,
    url,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Valentini & Co.`,
    description,
    images: [shareImage],
  },
};

export default function MetaAdsPage() {
  return <PracticeView practice={metaAds} />;
}
