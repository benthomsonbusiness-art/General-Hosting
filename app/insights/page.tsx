import { InsightExplorer } from "@/components/content/InsightExplorer";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroPlain } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { INSIGHTS } from "@/content/insights";
import { INSIGHTS_HUB } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description: INSIGHTS_HUB.metaDescription,
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <HeroPlain title="Insights" dek={INSIGHTS_HUB.dek} crumbs={[{ name: "Insights", path: "/insights" }]} />
      <Section flush labelledBy="all" className="pb-20 md:pb-28">
        <Container>
          <h2 id="all" className="sr-only">
            All insights
          </h2>
          <InsightExplorer insights={INSIGHTS} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
