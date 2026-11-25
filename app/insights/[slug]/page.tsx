import { ViewTransition } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpCta } from "@/components/layout/HelpCta";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { InsightCard, insightMeta } from "@/components/cards/Cards";
import { Prose } from "@/components/content/Blocks";
import { ShareLinks } from "@/components/content/ShareLinks";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { InPageIndex } from "@/components/nav/InPageIndex";
import { JsonLd } from "@/components/util/JsonLd";
import { getInsight, INSIGHT_TYPES, INSIGHTS, relatedInsights } from "@/content/insights";
import { BODIES } from "@/content/insights/bodies";
import { absolute, pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

/** Byline on every article. */
const AUTHOR = "Ben Thomson";

export function generateStaticParams() {
  return INSIGHTS.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insight = getInsight((await params).slug);
  if (!insight) return {};
  return pageMetadata({
    title: insight.title,
    description: insight.metaDescription,
    path: `/insights/${insight.slug}`,
    article: { publishedTime: insight.date },
  });
}

export default async function InsightPage({ params }: Props) {
  const insight = getInsight((await params).slug);
  if (!insight) notFound();
  const blocks = BODIES[insight.slug];
  const path = `/insights/${insight.slug}`;
  const index = blocks.flatMap((block) => (block.type === "h2" ? [{ id: block.id, label: block.text }] : []));
  const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
  const author = { "@type": "Person", name: AUTHOR };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: insight.title,
          description: insight.metaDescription,
          datePublished: insight.date,
          dateModified: insight.date,
          url: absolute(path),
          mainEntityOfPage: absolute(path),
          image: absolute(insight.image.src),
          author,
          publisher,
        }}
      />
      <article data-surface="light" className="bg-ivory text-ink">
        <header className="wrap border-b border-ink/12 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs
            items={[
              { name: "Insights", path: "/insights" },
              { name: insight.title, path },
            ]}
          />
          <div className="mt-8 grid items-end gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-slate">{INSIGHT_TYPES[insight.type]}</p>
              <h1 className="h1 mt-3 text-ink">{insight.title}</h1>
              <p className="lead measure mt-5 text-slate">{insight.dek}</p>
              <p className="mt-6 text-slate">
                {AUTHOR}. {insightMeta(insight)}
              </p>
            </div>
            <div className="lg:col-span-5" data-print="hide">
              <ViewTransition name={`insight-${insight.slug}`} share="morph" default="none">
                <HardwareFrame
                  src={insight.image.src}
                  alt={insight.image.alt}
                  width={1920}
                  height={1080}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                />
              </ViewTransition>
            </div>
          </div>
          {insight.type === "blueprint" ? (
            <p className="mt-9 border-l-2 border-forest bg-ivory px-6 py-4 font-semibold text-forest">
              Illustrative scenario, not a client engagement.
            </p>
          ) : null}
        </header>

        <div data-surface="light" className="wrap pt-12 pb-20 md:pt-16 md:pb-28">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <InPageIndex items={index} />
            </div>
            <div className="min-w-0 lg:col-span-9">
              <Prose blocks={blocks} />
              <div className="max-w-[44rem]">
                <div className="mt-12 rounded-lg border border-line p-6">
                  <p className="h4">Want this mapped for your company?</p>
                  <HelpCta className="mt-4" line="We start with one process and a short audit." />
                </div>
                <ShareLinks url={absolute(path)} />
              </div>
            </div>
          </div>
        </div>
      </article>

      <Section surface="ivory" labelledBy="related">
        <Container>
          <SectionHeading id="related" title="Related insights" />
          <div className="mt-10">
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-12">
              {relatedInsights(
                (item) => item.topics.some((topic) => insight.topics.includes(topic)),
                3,
                insight.slug,
              ).map((item, idx) => (
                <li
                  key={item.slug}
                  className={idx === 0 ? "md:col-span-5" : idx === 1 ? "md:col-span-4" : "md:col-span-3"}
                >
                  <InsightCard insight={item} tall={idx === 0} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
