import type { Metadata } from "next";
import Link from "next/link";
import { IconCards, ScopeSteps, StepTrack } from "@/components/graphics/Graphics";
import { ServiceArt } from "@/components/graphics/ServiceArt";
import { notFound } from "next/navigation";
import { Faq } from "@/components/content/Blocks";
import { Estimator } from "@/components/content/Estimator";
import { SubServiceScenes } from "@/components/content/SubServiceScenes";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/util/JsonLd";
import { BUILD_TYPES, getService, INTEGRATIONS, SERVICES, SUB_SERVICES, serviceHref } from "@/content/services";
import { WORKFLOWS, workflowsById } from "@/content/workflows";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { appsByCategory, showMark, usedAppSlugs } from "@/lib/used-apps";

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
  const tools = flagship ? appsByCategory(usedAppSlugs(WORKFLOWS)) : [];

  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.metaDescription, path)} />
      <Section labelledBy="service-title">
        <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
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
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-line lg:col-span-5">
            <ServiceArt slug={service.slug} />
          </div>
        </Container>
      </Section>

      {flagship ? (
        <Section surface="forest" labelledBy="services">
          <Container>
            <h2 id="services" className="h2">
              What we build
            </h2>
            <SubServiceScenes items={SUB_SERVICES.filter((item) => BUILD_TYPES.includes(item.slug))} />
          </Container>
        </Section>
      ) : (
        <Section surface="forest" labelledBy="areas">
          <Container>
            <h2 id="areas" className="h2">
              Where we help
            </h2>
            <div className="mt-10">
              <IconCards items={service.areas} columns={5} />
            </div>
          </Container>
        </Section>
      )}

      {workflows.length > 0 ? (
        <Section labelledBy="try">
          <Container>
            <h2 id="try" className="h2">
              Example workflows
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {workflows.map((workflow) => (
                <li key={workflow.id}>
                  <Link href={`/workflows/${workflow.id}`} className="group block py-5">
                    <span className="card-title row-title block">{workflow.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {tools.length > 0 ? (
        <Section labelledBy="tools" className="border-t border-line">
          <Container>
            <h2 id="tools" className="h2 max-w-[18ch]">
              {INTEGRATIONS.heading}
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((group) => (
                <div key={group.category}>
                  <h3 className="small text-muted">{group.label}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.apps.map((app) => (
                      <li key={app.slug} className="flex min-h-8 items-center gap-3">
                        {showMark(app.slug) ? (
                          // eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, drawn as is
                          <img src={`/logos/${app.slug}.svg`} alt="" width={24} height={24} className="h-6 w-6" />
                        ) : null}
                        <span>{app.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="small mt-8 max-w-[44rem] text-muted">{INTEGRATIONS.note}</p>
          </Container>
        </Section>
      ) : null}

      <Section surface={flagship ? "forest" : "obsidian"} labelledBy="runs" className="border-t border-line">
        <Container>
          <h2 id="runs" className="h2">
            {flagship ? "How the work is scoped" : "How it runs"}
          </h2>
          <div className="mt-8">
            {flagship ? (
              <ScopeSteps />
            ) : (
              <StepTrack steps={(service.steps ?? []).map((step) => ({ title: step.title, line: step.body }))} />
            )}
          </div>
        </Container>
      </Section>

      {flagship ? (
        <Section labelledBy="hours">
          <Container>
            <h2 id="hours" className="h2 max-w-[16ch]">
              Hours this task takes a year
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

      <ClosingCta label={service.cta.label} href={service.cta.href} />
    </>
  );
}
