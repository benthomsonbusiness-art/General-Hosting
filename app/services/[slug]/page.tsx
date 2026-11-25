import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { SubServiceScenes } from "@/components/content/SubServiceScenes";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/util/JsonLd";
import { Thumb } from "@/components/workflow/Thumb";
import { getService, SERVICES, SUB_SERVICES, serviceHref } from "@/content/services";
import { workflowsById } from "@/content/workflows";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

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

  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.metaDescription, path)} />
      <Section labelledBy="service-title">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Services", path: "/services" },
              { name: service.name, path },
            ]}
          />
          <h1 id="service-title" className="h1 mt-6 max-w-[16ch]">
            {service.h1}
          </h1>
          <p className="lead measure mt-5 text-muted">{service.dek}</p>
          <Link href={service.cta.href} className="btn btn-primary mt-8">
            {service.cta.label}
          </Link>
        </Container>
      </Section>

      {flagship ? (
        <Section surface="forest" labelledBy="services">
          <Container>
            <h2 id="services" className="h2">
              Five ways in
            </h2>
            <p className="measure mt-4 text-ivory/80">
              Every workflow engagement starts from the documents and tools already in use, then isolates what can run
              without manual copying.
            </p>
            <SubServiceScenes items={SUB_SERVICES} />
          </Container>
        </Section>
      ) : (
        <Section surface="ivory" labelledBy="areas">
          <Container>
            <h2 id="areas" className="h2">
              Where we help
            </h2>
            <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/12">
              {service.areas.map((area) => (
                <div key={area.title} className="grid gap-2 py-6 md:grid-cols-12">
                  <dt className="h3 md:col-span-5">{area.title}</dt>
                  <dd className="text-slate md:col-span-7">{area.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      )}

      {workflows.length > 0 ? (
        <Section labelledBy="try">
          <Container>
            <h2 id="try" className="h2">
              Try one
            </h2>
            <p className="mt-3 text-muted">Simulations run in the browser with sample records.</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {workflows.map((workflow) => (
                <li key={workflow.id}>
                  <Link href={`/workflows/${workflow.id}`} className="flex min-h-16 items-center gap-4 py-3">
                    <Thumb id={workflow.id} className="h-8 w-14 shrink-0" />
                    <span>
                      <span className="card-title block text-[1.25rem]">{workflow.title}</span>
                      <span className="block text-muted">{workflow.summary.split(". ")[0]}.</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section surface="ivory" labelledBy="runs">
        <Container>
          <h2 id="runs" className="h2">
            How it runs
          </h2>
          <div className="mt-8">
            {flagship ? (
              <StageDiagram />
            ) : (
              <ul className="divide-y divide-ink/12 border-y border-ink/12">
                {service.steps?.map((step) => (
                  <li key={step.title} className="grid gap-2 py-6 md:grid-cols-12 md:items-baseline">
                    <h3 className="h3 md:col-span-4">{step.title}</h3>
                    <p className="text-slate md:col-span-8">{step.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </Section>

      {flagship ? (
        <Section labelledBy="hours">
          <Container>
            <h2 id="hours" className="h2 max-w-[16ch]">
              An illustrative reading of the hours
            </h2>
            <div className="mt-8">
              <Estimator />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="questions">
        <Container className="grid gap-8 lg:grid-cols-12">
          <h2 id="questions" className="h2 lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-8">
            <Faq items={service.faqs} />
          </div>
        </Container>
      </Section>
    </>
  );
}
