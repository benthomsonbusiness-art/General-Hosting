import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/util/JsonLd";
import type { Faq as FaqItem } from "@/content/approach";
import { getWorkflow } from "@/content/workflows";
import type { Block } from "@/content/insights";
import { faqJsonLd } from "@/lib/seo";

export function Faq({ items, jsonLd = true }: { items: FaqItem[]; jsonLd?: boolean }) {
  return (
    <div>
      {jsonLd ? <JsonLd data={faqJsonLd(items)} /> : null}
      {items.map((item) => (
        <details key={item.q} className="group/faq">
          <summary className="flex min-h-14 items-center justify-between gap-6 py-4">
            <span className="h4">{item.q}</span>
            <span aria-hidden className="relative h-4 w-4 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
              <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current group-open/faq:hidden" />
            </span>
          </summary>
          <p className="max-w-[44rem] pb-6 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-forest bg-ivory px-6 py-5">
      <p className="font-semibold text-forest">{title}</p>
      <p className="mt-1.5 text-ink">{children}</p>
    </aside>
  );
}

/** Quotes the article itself. Never attributed to a person. */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="h3 my-12 border-y border-ink/15 py-8 text-forest">
      {children}
    </p>
  );
}

export function WorkflowEmbed({ id }: { id: string }) {
  const workflow = getWorkflow(id);
  if (!workflow) return null;
  return (
    <aside data-surface="dark" className="console my-10 p-6 text-ivory">
      <p className="h4">{workflow.title}</p>
      <p className="small mt-1 text-muted">{`${workflow.summary.split(". ")[0]}.`}</p>
      <Link href={`/workflows/${workflow.id}`} className="text-link mt-2 inline-flex min-h-11 items-center">
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
    <div className="measure">
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
                className="h3 mt-14 mb-4 outline-none first:mt-0"
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
              <ul key={index} className="mt-5 list-disc space-y-2.5 pl-5 marker:text-forest">
                {block.items.map((item) => (
                  <li key={item}>{inline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="mt-5 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-forest">
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
              <div key={index} className="mt-6 border border-ink/15 bg-ivory px-6 py-5 break-inside-avoid">
                <p className="font-semibold text-forest">{block.title}</p>
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
