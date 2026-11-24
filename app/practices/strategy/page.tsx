import type { Metadata } from "next";
import { PracticeView } from "@/components/PracticeView";
import { strategy } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Strategy",
  description: strategy.description,
  alternates: { canonical: "/practices/strategy" },
};

export default function StrategyPage() {
  return <PracticeView practice={strategy} />;
}
