import Image from "next/image";
import Link from "next/link";
import { formatDate, INSIGHT_TYPES, type Insight } from "@/content/insights";
import type { Workflow } from "@/content/workflows";
import { Thumb } from "@/components/workflow/Thumb";

export function insightMeta(insight: Insight) {
  return `${formatDate(insight.date)} | ${insight.readMinutes} min read`;
}

/** Order is fixed on every insight card: eyebrow, title, dek, meta. */
export function InsightCard({ insight, lead = false }: { insight: Insight; lead?: boolean }) {
  return (
    <Link href={`/insights/${insight.slug}`} className="group flex h-full flex-col">
      <span className={`relative block overflow-hidden bg-forest ${lead ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
        <Image
          src={insight.image.src}
          alt=""
          fill
          sizes={lead ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
          className="zoom object-cover"
          style={{ objectPosition: insight.image.position }}
        />
      </span>
      <span className="eyebrow mt-5 block">{INSIGHT_TYPES[insight.type]}</span>
      <h3
        className={`card-title mt-2 font-display font-medium ${lead ? "text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)] leading-[1.1]" : "text-[1.65rem] leading-[1.15]"}`}
      >
        {insight.title}
      </h3>
      <span className="mt-2 block text-muted">{insight.dek}</span>
      <span className="small mt-auto block pt-4 text-muted">{insightMeta(insight)}</span>
    </Link>
  );
}

/** A workflow as its picture. */
export function WorkflowTile({
  workflow,
  line,
  wide = false,
}: {
  workflow: Workflow;
  line?: string;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      data-surface="dark"
      className={`group flex h-full min-h-64 flex-col justify-between p-7 md:p-9 ${wide ? "bg-obsidian md:min-h-96" : "bg-forest"}`}
    >
      <Thumb id={workflow.id} className={`${wide ? "h-32 w-52 md:h-44 md:w-72" : "h-20 w-32"} text-ivory/80`} />
      <span className="mt-8 block">
        <span className={`card-title block font-display leading-[1.12] text-ivory ${wide ? "text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]" : "text-[1.75rem]"}`}>
          {line ?? workflow.title}
        </span>
        <span className="arrow-link mt-4 text-[15px]">{line ? workflow.title : "Try it"}</span>
      </span>
    </Link>
  );
}
