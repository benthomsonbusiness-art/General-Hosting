import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { metaAds } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Meta Ads Consulting",
  description: metaAds.description,
  alternates: { canonical: "/practices/meta-ads" },
};

export default function MetaAdsPage() {
  return <PracticeView practice={metaAds} />;
}
