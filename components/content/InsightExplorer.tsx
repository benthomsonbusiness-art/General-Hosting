import Link from "next/link";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { INSIGHT_TYPES, type Insight } from "@/content/insights";

/** One list, newest first. No type chips. */
export function InsightExplorer({ insights }: { insights: Insight[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {insights.map((insight) => (
        <li key={insight.slug}>
          <Link href={`/insights/${insight.slug}`} className="grid items-center gap-6 py-6 lg:grid-cols-12">
            <span className="lg:col-span-4">
              <HardwareFrame
                src={insight.image.src}
                alt={insight.image.alt}
                width={1920}
                height={1080}
                sizes="(min-width: 1024px) 28vw, 100vw"
              />
            </span>
            <span className="lg:col-span-8">
              <span className="text-[15px] text-muted">{INSIGHT_TYPES[insight.type]}</span>
              <span className="card-title h3 mt-2 block">
                {insight.title}
              </span>
              <span className="mt-2 block text-muted">{insight.dek}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
