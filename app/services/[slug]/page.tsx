import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EngagementStrip, InsightRow, WorkflowCard } from "@/components/cards/Cards";
import { BodySection, DefinitionRows, Faq, IndexedBody } from "@/components/content/Blocks";
import { CapabilityTabs } from "@/components/content/CapabilityTabs";
import { Estimator } from "@/components/content/Estimator";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { JsonLd } from "@/components/util/JsonLd";
import { ENGAGEMENTS } from "@/content/engagements";
import { relatedInsights } from "@/content/insights";
import { getService, SERVICES, SUB_SERVICES, serviceHref, subServiceHref } from "@/content/services";
import { workflowsById } from "@/content/workflows";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { INQUIRY_EMAIL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: serviceHref(service.slug),
  });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const flagship = service.kind === "flagship";
  const workflows = workflowsById(service.workflowIds);
  const path = serviceHref(service.slug);

  const sections = [
    { id: "problem", label: service.introHeading },
    { id: "help", label: "How we can help" },
    ...(flagship ? [{ id: "sub-services", label: "Services in this practice" }] : []),
    ...(service.detail ? [{ id: "detail", label: service.detail.heading }] : []),
    ...(workflows.length > 0 ? [{ id: "workflows", label: "Example workflows" }] : []),
    ...(flagship
      ? [
          { id: "hours", label: "Hours estimator" },
          { id: "engagement", label: "Engagement model" },
        ]
      : []),
    { id: "questions", label: "Questions" },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.metaDescription, path)} />
      <HeroSplit
        surface={flagship ? "forest" : "stone"}
        title={service.h1}
        dek={service.dek}
        photo={service.photo}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ]}
        actions={
          <>
            <Link href={service.cta.href} className="btn btn-primary">
              {service.cta.label}
            </Link>
            {flagship ? (
              <Link href="/workflows" className="arrow-link min-h-11 items-center">
                See the workflows
              </Link>
            ) : (
              <a href={`mailto:${INQUIRY_EMAIL}`} className="arrow-link min-h-11 items-center">
                Email the firm
              </a>
            )}
          </>
        }
      />

      <IndexedBody items={sections}>
        <BodySection id="problem" title={service.introHeading}>
          <div className="max-w-[44rem] space-y-5">
            {service.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </BodySection>

        <BodySection id="help" title="How we can help">
          <CapabilityTabs items={service.capabilities} label={`${service.name} capabilities`} />
        </BodySection>

        {flagship ? (
          <BodySection id="sub-services" title="Services in this practice">
            <ul className="border-t border-heading">
              {SUB_SERVICES.map((item) => (
                <li key={item.slug} className="border-b border-rule">
                  <Link href={subServiceHref(item.slug)} className="group grid gap-x-8 gap-y-1.5 py-6 md:grid-cols-12">
                    <span className="h4 card-title arrow-after text-heading after:ml-2 after:text-accent md:col-span-4">
                      {item.name}
                    </span>
                    <span className="md:col-span-8">
                      <span className="block font-semibold">{item.question}</span>
                      <span className="mt-1 block text-muted">{item.answer}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </BodySection>
        ) : null}

        {service.detail ? (
          <BodySection id="detail" title={service.detail.heading} lede={service.detail.lede}>
            <DefinitionRows rows={service.detail.rows} />
          </BodySection>
        ) : null}

        {workflows.length > 0 ? (
          <BodySection
            id="workflows"
            title={workflows.length > 1 ? "Example workflows" : "The reporting workflow"}
            lede="Illustrative blueprints with sample data. Open one to step through it."
          >
            <div className="border-b border-rule">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </BodySection>
        ) : null}

        {flagship ? (
          <>
            <BodySection
              id="hours"
              title="An illustrative reading of the hours"
              lede="Set the sliders to the size of one process. This is arithmetic with a stated assumption, and it is the same arithmetic the audit uses."
            >
              <Estimator />
            </BodySection>
            <BodySection
              id="engagement"
              title="Engagement model"
              lede="The audit comes first. Build work is scoped once the size of each workflow is known."
            >
              <EngagementStrip stages={ENGAGEMENTS.stages} />
            </BodySection>
          </>
        ) : null}

        <BodySection id="questions" title="Questions">
          <Faq items={service.faqs} />
        </BodySection>
      </IndexedBody>

      <Section surface="stone" labelledBy="related">
        <Container>
          <SectionHeading id="related" title="Related insights" />
          <div className="mt-8">
            <InsightRow insights={relatedInsights((item) => item.services.includes(service.slug))} />
          </div>
        </Container>
      </Section>

      {flagship ? (
        <CtaBand />
      ) : (
        <CtaBand
          headline={["Bring the question you have.", "We'll tell you whether we can help."]}
          body="Describe the account or the decision in a few sentences. We reply by email to set up a first conversation."
          label={service.cta.label}
          href={service.cta.href}
        />
      )}
    </>
  );
}
