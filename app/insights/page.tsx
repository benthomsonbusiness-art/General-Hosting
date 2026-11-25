import { InsightExplorer } from "@/components/content/InsightExplorer";
import { HelpCta } from "@/components/layout/HelpCta";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { INSIGHTS } from "@/content/insights";
import { INSIGHTS_HUB } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description: INSIGHTS_HUB.metaDescription,
  path: "/insights",
});

export default function InsightsPage() {
  const newest = [...INSIGHTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return (
    <>
      <Section labelledBy="insights-title">
        <Container>
          <Breadcrumbs items={[{ name: "Insights", path: "/insights" }]} />
          <h1 id="insights-title" className="h1 mt-6">
            Insights
          </h1>
          <p className="lead mt-4 max-w-[36rem] text-muted">{INSIGHTS_HUB.dek}</p>
          <HelpCta line="Rather talk it through? Tell us which process slows your week down." />
          <div className="mt-10">
            <h2 className="sr-only">All insights</h2>
            <InsightExplorer insights={newest} />
          </div>
        </Container>
      </Section>
      <ClosingCta />
    </>
  );
}
