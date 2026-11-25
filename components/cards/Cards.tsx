import Link from "next/link";
import { formatDate, INSIGHT_TYPES, type Insight } from "@/content/insights";

export function insightMeta(insight: Insight) {
  return `${formatDate(insight.date)}. ${insight.readMinutes} min read`;
}

/** Title, one-line dek, and the type. Covers stay on the index and the article. */
export function InsightCard({ insight }: { insight: Insight; lead?: boolean; tall?: boolean }) {
  return (
    <Link href={`/insights/${insight.slug}`} className="group flex h-full flex-col py-2">
      <span className="text-[15px] text-slate">{INSIGHT_TYPES[insight.type]}</span>
      <h3 className="card-title h4 mt-2 text-ink">{insight.title}</h3>
      <span className="mt-2 block text-[15px] leading-relaxed text-slate">{insight.dek}</span>
      <span className="mt-3 block text-[15px] text-slate">{insightMeta(insight)}</span>
    </Link>
  );
}
