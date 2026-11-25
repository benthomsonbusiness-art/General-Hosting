import Link from "next/link";
import { InsightExplorer } from "@/components/content/InsightExplorer";
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
      <section data-surface="light" className="bg-paper pt-12 pb-6 md:pt-16 md:pb-8">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 font-mono text-[12px] text-slate">
            <Link href="/" className="hover:text-forest">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">Insights</span>
          </nav>

          <div className="grid items-end gap-8 lg:grid-cols-12">
            <h1 className="font-display text-[clamp(3.2rem,2rem+4.5vw,5.8rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ink lg:col-span-6">
              Field notes
            </h1>
            <p className="max-w-[34rem] text-[1.125rem] leading-relaxed text-slate lg:col-span-6">
              {INSIGHTS_HUB.dek}
            </p>
          </div>
        </Container>
      </section>

      <Section flush labelledBy="all" className="pt-4 pb-20 md:pb-28">
        <Container>
          <h2 id="all" className="sr-only">
            All insights
          </h2>
          <InsightExplorer insights={INSIGHTS} />
        </Container>
      </Section>
    </>
  );
}
