import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkflowCard } from "@/components/cards/Cards";
import { BodySection, DefinitionRows, IndexedBody } from "@/components/content/Blocks";
import { Estimator } from "@/components/content/Estimator";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { JsonLd } from "@/components/util/JsonLd";
import { getEngagement } from "@/content/engagements";
import { FLAGSHIP, getSubService, SUB_SERVICES, serviceHref, subServiceHref } from "@/content/services";
import { workflowsById } from "@/content/workflows";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUB_SERVICES.map((item) => ({ sub: item.slug }));
}

type Props = { params: Promise<{ sub: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getSubService((await params).sub);
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: service.metaDescription,
    path: subServiceHref(service.slug),
  });
}

export default async function SubServicePage({ params }: Props) {
  const service = getSubService((await params).sub);
  if (!service) notFound();
  const engagement = getEngagement(service.engagement);
  const audit = service.slug === "workflow-audit";
  const path = subServiceHref(service.slug);

  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.metaDescription, path)} />
      <HeroSplit
        surface="stone"
        title={service.name}
        dek={service.dek}
        photo={service.photo}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: FLAGSHIP.name, path: serviceHref(FLAGSHIP.slug) },
          { name: service.name, path },
        ]}
        actions={
          <Link href={CTA_HREF} className="btn btn-primary">
            {CTA_LABEL}
          </Link>
        }
      />

      <IndexedBody
        items={[
          { id: "what", label: "What this is" },
          { id: "get", label: "What you get" },
          { id: "runs", label: "How it runs" },
          { id: "week-one", label: "Questions in week one" },
          ...(audit ? [{ id: "hours", label: "Hours estimator" }] : []),
          { id: "workflows", label: "Related workflows" },
        ]}
      >
        <BodySection id="what" title="What this is">
          <div className="max-w-[44rem] space-y-5">
            {service.what.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </BodySection>

        <BodySection id="get" title="What you get">
          <DefinitionRows rows={service.deliverables} />
        </BodySection>

        <BodySection id="runs" title="How it runs" lede={service.runsNote}>
          <dl className="mb-8 flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="small text-muted">Shape</dt>
              <dd className="font-semibold text-heading">{engagement.shape}</dd>
            </div>
            <div>
              <dt className="small text-muted">Pricing</dt>
              <dd className="font-semibold text-heading">{engagement.pricing}</dd>
            </div>
          </dl>
          <ol className="ml-1.5 border-l-2 border-rule">
            {engagement.steps.map((step, index) => (
              <li key={step.title} className="relative pb-7 pl-8 last:pb-0">
                <span aria-hidden className="absolute top-2 -left-[7px] h-3 w-3 bg-gold-ink" />
                <h3 className="h4">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 max-w-[40rem]">{step.body}</p>
              </li>
            ))}
          </ol>
        </BodySection>

        <BodySection id="week-one" title="Questions we ask in week one">
          <ul className="max-w-[44rem] list-disc space-y-3 pl-5 marker:text-gold-ink">
            {service.weekOne.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </BodySection>

        {audit ? (
          <BodySection
            id="hours"
            title="An illustrative reading of the hours"
            lede="The audit does this for your own processes, with your figures and the assumptions written beside them."
          >
            <Estimator />
          </BodySection>
        ) : null}

        <BodySection id="workflows" title="Related workflows" lede="Illustrative blueprints with sample data.">
          <div className="border-b border-rule">
            {workflowsById(service.workflowIds).map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </BodySection>
      </IndexedBody>

      <CtaBand />
    </>
  );
}
