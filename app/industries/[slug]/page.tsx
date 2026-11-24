import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InsightRow, WorkflowCard } from "@/components/cards/Cards";
import { BodySection, DefinitionRows, IndexedBody } from "@/components/content/Blocks";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroBlock } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { getIndustry, INDUSTRIES } from "@/content/industries";
import { relatedInsights } from "@/content/insights";
import { workflowsById } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getIndustry((await params).slug);
  if (!industry) return {};
  return pageMetadata({
    title: industry.name,
    description: industry.metaDescription,
    path: `/industries/${industry.slug}`,
  });
}

/** One template, one section order, for all six industries. */
export default async function IndustryPage({ params }: Props) {
  const industry = getIndustry((await params).slug);
  if (!industry) notFound();
  const workflows = workflowsById(industry.workflowIds);

  return (
    <>
      <HeroBlock
        title={industry.name}
        dek={industry.dek}
        crumbs={[
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ]}
        aside={
          <div>
            <p className="font-semibold text-gold">Workflows that apply</p>
            <ul className="mt-3 border-t border-rule">
              {workflows.map((workflow) => (
                <li key={workflow.id} className="border-b border-rule">
                  <Link
                    href={`/workflows/${workflow.id}`}
                    className="arrow-link min-h-12 w-full items-center justify-between"
                  >
                    {workflow.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <IndexedBody
        items={[
          { id: "hours", label: "Where the hours go" },
          { id: "workflows", label: "Workflows that apply" },
          { id: "systems", label: "Systems we typically connect" },
          { id: "wont", label: "What we won't automate" },
        ]}
      >
        <BodySection id="hours" title="Where the hours go">
          <DefinitionRows rows={industry.hours} />
        </BodySection>

        <BodySection id="workflows" title="Workflows that apply" lede={industry.applyNote}>
          <div className="border-b border-rule">
            {workflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </BodySection>

        <BodySection
          id="systems"
          title="Systems we typically connect"
          lede="These are example integrations, not partnerships. If a system has an API or a reliable export, it can usually be connected."
        >
          <dl className="border-t border-rule">
            {industry.systems.map((row) => (
              <div key={row.group} className="grid gap-x-8 gap-y-1 border-b border-rule py-5 md:grid-cols-12">
                <dt className="font-semibold text-heading md:col-span-4">{row.group}</dt>
                <dd className="md:col-span-8">{row.tools}</dd>
              </div>
            ))}
          </dl>
        </BodySection>

        <BodySection
          id="wont"
          title="What we won't automate"
          lede="Some steps stay with people, whatever the software can do."
        >
          <DefinitionRows rows={industry.wont} />
        </BodySection>
      </IndexedBody>

      <Section surface="stone" labelledBy="related">
        <Container>
          <SectionHeading id="related" title="Related insights" />
          <div className="mt-8">
            <InsightRow insights={relatedInsights((item) => item.industries.includes(industry.slug))} />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
