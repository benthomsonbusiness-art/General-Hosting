import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/util/JsonLd";
import { InPageIndex, type IndexItem } from "@/components/nav/InPageIndex";
import type { Faq as FaqItem } from "@/content/approach";
import { getWorkflow } from "@/content/workflows";
import type { Block } from "@/content/insights";
import { faqJsonLd } from "@/lib/seo";

/** Long-page layout: the index on the left, sections on the right. */
export function IndexedBody({ items, children }: { items: IndexItem[]; children: ReactNode }) {
  return (
    <div data-surface="light" className="wrap py-10 md:py-14 lg:py-20">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <InPageIndex items={items} />
        </div>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}

export function BodySection({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="py-10 outline-none first:pt-0 last:pb-0 md:py-12"
    >
      <h2 id={`${id}-heading`} className="h2 max-w-[20em]">
        {title}
      </h2>
      {lede ? <p className="lead mt-4 max-w-[42rem] text-muted">{lede}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Hairline rows: a short heading on the left, the text on the right. */
export function DefinitionRows({ rows, level = 3 }: { rows: { title: string; body: string }[]; level?: 3 | 4 }) {
  const Heading = level === 4 ? "h4" : "h3";
  return (
    <div className="border-t border-rule">
      {rows.map((row) => (
        <div key={row.title} className="grid gap-x-8 gap-y-2 border-b border-rule py-6 md:grid-cols-12">
          <Heading className="h4 md:col-span-4">{row.title}</Heading>
          <p className="md:col-span-8">{row.body}</p>
        </div>
      ))}
    </div>
  );
}

export function ProblemList({
  items,
}: {
  items: { q: string; a: string; href: string; linkLabel: string }[];
}) {
  return (
    <ul className="grid gap-x-12 border-t border-rule lg:grid-cols-2">
      {items.map((item) => (
        <li key={item.href} className="border-b border-rule">
          <Link href={item.href} className="group flex h-full flex-col py-7">
            <span className="h3 card-title block text-heading">{item.q}</span>
            <span className="mt-2 block max-w-[34rem] text-muted">{item.a}</span>
            <span className="arrow-link mt-auto pt-4 text-[15px]">{item.linkLabel}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Faq({ items, jsonLd = true }: { items: FaqItem[]; jsonLd?: boolean }) {
  return (
    <div className="border-t border-rule">
      {jsonLd ? <JsonLd data={faqJsonLd(items)} /> : null}
      {items.map((item) => (
        <details key={item.q} className="group/faq border-b border-rule">
          <summary className="flex min-h-14 items-center justify-between gap-6 py-4">
            <h3 className="h4">{item.q}</h3>
            <span aria-hidden className="relative h-4 w-4 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-accent" />
              <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-accent group-open/faq:hidden" />
            </span>
          </summary>
          <p className="max-w-[44rem] pb-6">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-gold-ink bg-stone px-6 py-5">
      <p className="font-bold text-forest">{title}</p>
      <p className="mt-1.5">{children}</p>
    </aside>
  );
}

/** Quotes the article itself. Never attributed to a person. */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="my-10 border-y border-rule py-7 font-display-italic text-[clamp(1.6rem,1.3rem+1.2vw,2.15rem)] leading-[1.2] font-medium text-forest italic">
      {children}
    </p>
  );
}

export function WorkflowEmbed({ id }: { id: string }) {
  const workflow = getWorkflow(id);
  if (!workflow) return null;
  return (
    <aside data-surface="dark" className="my-10 bg-forest p-6 md:p-8">
      <p className="eyebrow">Workflow blueprint</p>
      <p className="h3 mt-2 text-heading">{workflow.title}</p>
      <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2.5 text-[14px]">
        {workflow.nodes.map((node, index) => (
          <li key={node.id} className="flex items-center gap-2">
            <span
              className={`border px-2.5 py-1 ${
                node.kind === "human" ? "border-dashed border-gold text-gold" : "border-rule"
              }`}
            >
              {node.label}
            </span>
            {index < workflow.nodes.length - 1 ? <span aria-hidden>→</span> : null}
          </li>
        ))}
      </ol>
      <p className="small mt-5 text-muted">Simulation with sample data.</p>
      <Link href={`/workflows/${workflow.id}`} className="arrow-link mt-2 min-h-11 items-center">
        Open this workflow
      </Link>
    </aside>
  );
}

/** Inline markup for article text: **bold** and [label](/path). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, index) => {
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={index} href={link[2]} className="text-link">
          {link[1]}
        </Link>
      );
    }
    return part;
  });
}

export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-[44rem] text-[1.0625rem] leading-[1.75]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return (
              <p key={index} className="mt-5 first:mt-0">
                {inline(block.text)}
              </p>
            );
          case "h2":
            return (
              <h2
                key={index}
                id={block.id}
                tabIndex={-1}
                className="mt-14 mb-4 text-[clamp(1.5rem,1.3rem+0.8vw,1.9rem)] leading-tight font-bold tracking-[-0.01em] outline-none first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="h4 mt-9 mb-1">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={index} className="mt-5 list-disc space-y-2.5 pl-5 marker:text-gold-ink">
                {block.items.map((item) => (
                  <li key={item}>{inline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="mt-5 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-gold-ink">
                {block.items.map((item) => (
                  <li key={item}>{inline(item)}</li>
                ))}
              </ol>
            );
          case "quote":
            return <PullQuote key={index}>{block.text}</PullQuote>;
          case "callout":
            return (
              <Callout key={index} title={block.title}>
                {inline(block.text)}
              </Callout>
            );
          case "workflow":
            return <WorkflowEmbed key={index} id={block.id} />;
          case "checklist":
            return (
              <div key={index} className="mt-6 border border-rule bg-stone/50 px-6 py-5 break-inside-avoid">
                <p className="font-bold text-forest">{block.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-3.5 w-3.5 shrink-0 border border-forest" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "table":
            return (
              <div
                key={index}
                className="mt-7 overflow-x-auto"
                role="region"
                aria-label={block.caption}
                tabIndex={0}
              >
                <table className="w-full min-w-[34rem] border-collapse text-left text-[15px] leading-snug">
                  <caption className="small pb-3 text-left text-slate">{block.caption}</caption>
                  <thead>
                    <tr className="border-y border-forest">
                      {block.head.map((cell) => (
                        <th key={cell} scope="col" className="py-2.5 pr-5 font-bold text-forest">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-rule align-top">
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th key={cell} scope="row" className="py-3 pr-5 font-semibold">
                              {cell}
                            </th>
                          ) : (
                            <td key={cell} className="py-3 pr-5">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
