import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { metaAds } from "@/lib/practices";
import { SITE_URL } from "@/lib/site";

const title = "Meta Ads Consulting";
const description = metaAds.description;
const url = `${SITE_URL}/practices/meta-ads`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/practices/meta-ads" },
  openGraph: {
    title: `${title} — Valentini & Co.`,
    description,
    url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Valentini & Co.`,
    description,
  },
};

export default function MetaAdsPage() {
  return <PracticeView practice={metaAds} />;
}
