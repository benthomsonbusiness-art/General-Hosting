import { JsonLd } from "@/components/util/JsonLd";
import type { Faq as FaqItem } from "@/content/approach";
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
