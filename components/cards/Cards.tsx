import Image from "next/image";
import Link from "next/link";
import type { Engagement } from "@/content/engagements";
import { formatDate, INSIGHT_TYPES, type Insight } from "@/content/insights";
import type { Photo } from "@/content/services";
import type { Workflow } from "@/content/workflows";

export function insightMeta(insight: Insight) {
  return `${formatDate(insight.date)} | ${insight.readMinutes} min read`;
}

/** Order is fixed on every insight card: eyebrow, title, dek, meta. */
export function InsightCard({
  insight,
  variant = "standard",
  headingLevel = 3,
}: {
  insight: Insight;
  variant?: "lead" | "standard" | "compact";
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const lead = variant === "lead";
  return (
    <Link href={`/insights/${insight.slug}`} className="group flex h-full flex-col">
      {variant !== "compact" ? (
        <span className={`relative block overflow-hidden bg-forest ${lead ? "aspect-[3/2]" : "aspect-video"}`}>
          <Image
            src={insight.image.src}
            alt=""
            fill
            sizes={lead ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            className="zoom object-cover"
            style={{ objectPosition: insight.image.position }}
          />
        </span>
      ) : null}
      <div className={`flex flex-1 flex-col ${variant === "compact" ? "border-t border-rule pt-5" : "pt-5"}`}>
        <span className="eyebrow">{INSIGHT_TYPES[insight.type]}</span>
        <Heading className={`card-title mt-2 ${lead ? "h3" : "h4"}`}>{insight.title}</Heading>
        <span className="mt-2 block text-muted">{insight.dek}</span>
        <span className="small mt-auto block pt-3 text-muted">{insightMeta(insight)}</span>
      </div>
    </Link>
  );
}

export function InsightCluster({ insights }: { insights: Insight[] }) {
  const [lead, ...rest] = insights;
  if (!lead) return null;
  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <InsightCard insight={lead} variant="lead" />
      </div>
      <div className="grid content-start gap-10 lg:col-span-5">
        {rest.slice(0, 2).map((insight) => (
          <InsightCard key={insight.slug} insight={insight} variant="compact" />
        ))}
      </div>
    </div>
  );
}

export function InsightRow({ insights }: { insights: Insight[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
      {insights.map((insight) => (
        <li key={insight.slug}>
          <InsightCard insight={insight} />
        </li>
      ))}
    </ul>
  );
}

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const gated = workflow.nodes.some((node) => node.kind === "human");
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className="group grid gap-x-8 gap-y-2 border-t border-rule py-6 sm:grid-cols-[minmax(0,1fr)_auto]"
    >
      <span>
        <span className="h4 card-title arrow-after block text-heading after:ml-2 after:text-accent">
          {workflow.title}
        </span>
        <span className="mt-1.5 block text-muted">
          {workflow.trigger} → {workflow.outcome.charAt(0).toLowerCase() + workflow.outcome.slice(1)}
        </span>
      </span>
      <span className="small text-muted sm:text-right">
        {workflow.nodes.length} steps
        <span className="block">{gated ? "Includes an approval gate" : "Internal, read-only"}</span>
      </span>
    </Link>
  );
}

/** Large image card for the flagship, so the weighting of the practices is visible. */
export function ServiceLeadCard({
  name,
  summary,
  href,
  photo,
  linkLabel,
}: {
  name: string;
  summary: string;
  href: string;
  photo: Photo;
  linkLabel: string;
}) {
  return (
    <Link href={href} data-surface="dark" className="group flex h-full flex-col bg-forest">
      <span className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="zoom object-cover"
          style={{ objectPosition: photo.position }}
        />
      </span>
      <span className="flex flex-1 flex-col p-6 md:p-8">
        <span className="eyebrow">Flagship practice</span>
        <span className="h3 card-title mt-2 block text-heading">{name}</span>
        <span className="mt-3 block max-w-[38rem] text-muted">{summary}</span>
        <span className="arrow-link mt-auto pt-5">{linkLabel}</span>
      </span>
    </Link>
  );
}

export function ServiceTextCard({ name, summary, href }: { name: string; summary: string; href: string }) {
  return (
    <Link href={href} className="group flex flex-1 flex-col border border-rule p-6 md:p-8">
      <span className="h4 card-title block text-heading">{name}</span>
      <span className="mt-3 block text-muted">{summary}</span>
      <span className="arrow-link mt-auto pt-5">See the practice</span>
    </Link>
  );
}

export function EngagementStrip({ stages, heading = 3 }: { stages: Engagement[]; heading?: 2 | 3 }) {
  const Heading = heading === 2 ? "h2" : "h3";
  return (
    <ol className="border-t border-heading">
      {stages.map((stage, index) => (
        <li
          key={stage.id}
          className="grid gap-x-8 gap-y-2 border-b border-rule py-7 md:grid-cols-12 md:items-baseline"
        >
          <Heading className="h3 md:col-span-4">
            <span className="mr-3 text-accent">{index + 1}</span>
            <Link href={stage.href} className="decoration-1 underline-offset-4 hover:underline">
              {stage.name}
            </Link>
          </Heading>
          <p className="small text-accent md:col-span-2">{stage.shape}</p>
          <p className="md:col-span-4">{stage.delivers}</p>
          <p className="small text-muted md:col-span-2 md:text-right">{stage.pricing}</p>
        </li>
      ))}
    </ol>
  );
}
