import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InsightCard, insightMeta } from "@/components/cards/Cards";
import { Prose } from "@/components/content/Blocks";
import { ShareLinks } from "@/components/content/ShareLinks";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { InPageIndex } from "@/components/nav/InPageIndex";
import { JsonLd } from "@/components/util/JsonLd";
import { getInsight, INSIGHT_TYPES, INSIGHTS, relatedInsights } from "@/content/insights";
import { BODIES } from "@/content/insights/bodies";
import { absolute, pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

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
  const index = blocks.flatMap((block) =>
    block.type === "h2" ? [{ id: block.id, label: block.text }] : [],
  );
  const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

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
          author: publisher,
          publisher,
        }}
      />
      <article>
        <header data-surface="light" className="wrap pt-10 pb-10 md:pt-14">
          <Breadcrumbs
            items={[
              { name: "Insights", path: "/insights" },
              { name: insight.title, path },
            ]}
          />
          <div className="mt-8 grid items-end gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow">{INSIGHT_TYPES[insight.type]}</p>
              <h1 className="mt-3 text-[clamp(2.1rem,1.5rem+2.5vw,3.4rem)] leading-[1.1] font-bold tracking-[-0.02em]">
                {insight.title}
              </h1>
              <p className="lead mt-5 max-w-[42rem] text-muted">{insight.dek}</p>
              <p className="small mt-6 text-muted">
                {SITE_NAME} | {insightMeta(insight)}
              </p>
            </div>
            <div className="hidden lg:col-span-4 lg:block" data-print="hide">
              <ViewTransition name={`insight-${insight.slug}`} share="morph" default="none">
                <div className="relative aspect-[4/3] overflow-hidden bg-forest">
                  <Image
                    src={insight.image.src}
                    alt={insight.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: insight.image.position }}
                  />
                </div>
              </ViewTransition>
            </div>
          </div>
          {insight.type === "blueprint" ? (
            <p className="mt-9 border-l-4 border-gold-ink bg-stone px-6 py-4 font-semibold text-forest">
              Illustrative scenario — not a client engagement.
            </p>
          ) : null}
        </header>

        <div data-surface="light" className="wrap pb-20 md:pb-28">
          <div className="grid gap-x-12 gap-y-8 pt-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <InPageIndex items={index} />
            </div>
            <div className="min-w-0 lg:col-span-9">
              <Prose blocks={blocks} />
              <div className="max-w-[44rem]">
                <ShareLinks url={absolute(path)} title={insight.title} />
              </div>
            </div>
          </div>
        </div>
      </article>

      <Section surface="stone" labelledBy="related">
        <Container>
          <SectionHeading id="related" title="Related insights" />
          <div className="mt-8">
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              {relatedInsights(
                (item) => item.topics.some((topic) => insight.topics.includes(topic)),
                3,
                insight.slug,
              ).map((item) => (
                <li key={item.slug}>
                  <InsightCard insight={item} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
