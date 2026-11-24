import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { strategy } from "@/lib/practices";
import { SITE_URL } from "@/lib/site";

const title = "Strategy";
const description = strategy.description;
const url = `${SITE_URL}/practices/strategy`;
const shareImage = {
  url: "/images/hero-architecture.jpg",
  width: 1280,
  height: 720,
  alt: "Green marble, walnut slats, and a city at twilight.",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/practices/strategy" },
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

export default function StrategyPage() {
  return <PracticeView practice={strategy} />;
}
