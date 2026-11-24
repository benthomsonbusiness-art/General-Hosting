import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { strategy } from "@/lib/practices";
import { SITE_URL } from "@/lib/site";

const title = "Strategy";
const description = strategy.description;
const url = `${SITE_URL}/practices/strategy`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/practices/strategy" },
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

export default function StrategyPage() {
  return <PracticeView practice={strategy} />;
}
