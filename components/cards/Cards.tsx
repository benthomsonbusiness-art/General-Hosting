import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatDate, INSIGHT_TYPES, type Insight } from "@/content/insights";
import type { Workflow } from "@/content/workflows";
import { WORKFLOW_MEDIA } from "@/components/workflow/media";

export function insightMeta(insight: Insight) {
  return `${formatDate(insight.date)} · ${insight.readMinutes} min read`;
}

/** Order is fixed on every insight card: cover, type label, title, dek, meta. */
export function InsightCard({
  insight,
  lead = false,
  tall = false,
}: {
  insight: Insight;
  lead?: boolean;
  tall?: boolean;
}) {
  const aspect = lead ? "aspect-[16/10]" : tall ? "aspect-[4/5]" : "aspect-[3/2]";
  return (
    <Link href={`/insights/${insight.slug}`} className="group flex h-full flex-col">
      <ViewTransition name={`insight-${insight.slug}`} share="morph" default="none">
        <span className={`relative block overflow-hidden bg-obsidian ${aspect}`}>
          <Image
            src={insight.image.src}
            alt=""
            fill
            loading="eager"
            sizes={lead ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 36vw, 100vw"}
            className="zoom object-cover"
            style={{ objectPosition: insight.image.position }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/35 to-transparent"
          />
        </span>
      </ViewTransition>
      <span className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-moss">
        {INSIGHT_TYPES[insight.type]}
      </span>
      <h3
        className={`card-title mt-2.5 font-display font-medium text-ink ${
          lead ? "text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)] leading-[1.04]" : "text-[1.55rem] leading-[1.12]"
        }`}
      >
        {insight.title}
      </h3>
      <span className="mt-2.5 block text-[15px] leading-relaxed text-slate">{insight.dek}</span>
      <span className="mt-auto block pt-4 font-mono text-[12px] text-slate">{insightMeta(insight)}</span>
    </Link>
  );
}

/** A workflow rendered inside its photographic environment with its cutout paper artifact. */
export function WorkflowTile({
  workflow,
  line,
  wide = false,
}: {
  workflow: Workflow;
  line?: string;
  wide?: boolean;
}) {
  const media = WORKFLOW_MEDIA[workflow.id];
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      data-surface="dark"
      className={`group relative flex h-full flex-col justify-between overflow-hidden bg-obsidian p-7 md:p-9 ${
        wide ? "min-h-[24rem] md:min-h-[28rem]" : "min-h-[19rem]"
      }`}
    >
      {media ? (
        <>
          <Image
            src={media.envSrc}
            alt=""
            fill
            loading="eager"
            sizes={wide ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 34vw, 100vw"}
            className="zoom object-cover opacity-70"
            style={{ objectPosition: media.envPosition }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/35"
          />
        </>
      ) : null}

      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/75">
          {media?.shortLabel ?? "Workflow"}
        </span>
        {media ? (
          <div className={`relative shrink-0 ${wide ? "h-28 w-24 md:h-36 md:w-28" : "h-20 w-16"}`}>
            <Image
              src={media.cutoutSrc}
              alt=""
              fill
              loading="eager"
              sizes="120px"
              className="object-contain drop-shadow-[0_14px_20px_rgba(11,31,22,0.65)] transition-transform duration-500 ease-[var(--ease-paper)] group-hover:-translate-y-1.5 group-hover:rotate-[-2deg]"
            />
          </div>
        ) : null}
      </div>

      <span className="relative z-10 mt-8 block">
        <span
          className={`card-title block font-display leading-[1.06] font-medium text-ivory ${
            wide ? "max-w-xl text-[clamp(1.85rem,1.2rem+2vw,2.85rem)]" : "text-[1.65rem]"
          }`}
        >
          {line ?? workflow.title}
        </span>
        <span className="arrow-link mt-4 text-[15px] text-ivory/90">{line ? workflow.title : "Open simulation"}</span>
      </span>
    </Link>
  );
}
