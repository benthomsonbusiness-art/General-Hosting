import { InsightCluster } from "@/components/cards/Cards";
import { InsightExplorer, type Facet } from "@/components/content/InsightExplorer";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroBlock } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { INDUSTRIES } from "@/content/industries";
import { INSIGHT_TYPES, INSIGHTS } from "@/content/insights";
import { INSIGHTS_HUB } from "@/content/pages";
import { SERVICES } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description: INSIGHTS_HUB.metaDescription,
  path: "/insights",
});

const FACETS: Facet[] = [
  {
    key: "type",
    label: "Content type",
    options: Object.entries(INSIGHT_TYPES).map(([value, label]) => ({ value, label })),
  },
  {
    key: "service",
    label: "Service",
    options: SERVICES.map((item) => ({ value: item.slug, label: item.name })),
  },
  {
    key: "industry",
    label: "Industry",
    options: INDUSTRIES.map((item) => ({ value: item.slug, label: item.name })),
  },
];

export default function InsightsPage() {
  return (
    <>
      <HeroBlock title="Insights" dek={INSIGHTS_HUB.dek} crumbs={[{ name: "Insights", path: "/insights" }]} />

      <Section labelledBy="featured">
        <Container>
          <SectionHeading id="featured" title="Featured" />
          <div className="mt-8">
            <InsightCluster insights={INSIGHTS.slice(0, 3)} />
          </div>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="all">
        <Container>
          <SectionHeading id="all" title="All insights" />
          <div className="mt-8">
            <InsightExplorer insights={INSIGHTS} facets={FACETS} />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
