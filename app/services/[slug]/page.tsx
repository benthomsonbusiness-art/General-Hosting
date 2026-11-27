import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/content/Blocks";
import { IconCards, StepTrack } from "@/components/graphics/Graphics";
import { ServiceArt } from "@/components/graphics/ServiceArt";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/util/JsonLd";
import { toFlowNodes } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { FlowPlayer } from "@/components/workflow/FlowPlayer";
import { getService, INTEGRATIONS, SERVICES, serviceHref } from "@/content/services";
import { workflowsById } from "@/content/workflows";
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
  const workflows = workflowsById(service.workflowIds);
  const workflow = workflows[0];
  const path = serviceHref(service.slug);
  const tools = appsByCategory(usedAppSlugs(workflows));

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

      <Section surface="forest" labelledBy="get">
        <Container>
          <h2 id="get" className="h2">
            What you get
          </h2>
          <div className="mt-10">
            <IconCards items={service.areas} columns={4} />
          </div>
        </Container>
      </Section>

      {workflow ? (
        <Section labelledBy="see">
          <Container>
            <h2 id="see" className="h2">
              See it work
            </h2>
            <div className="mt-10">
              <FlowPlayer workflow={workflow}>
                <FlowDiagram
                  id={`service-${workflow.id}`}
                  title={workflow.title}
                  nodes={toFlowNodes(workflow)}
                  stepsHref={`/workflows/${workflow.id}`}
                  labelledBy="see"
                />
              </FlowPlayer>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="forest" labelledBy="setup">
        <Container>
          <h2 id="setup" className="h2">
            How we set it up
          </h2>
          <div className="mt-12">
            <StepTrack steps={service.steps.map((step) => ({ title: step.title, line: step.body }))} />
          </div>
        </Container>
      </Section>

      {tools.length > 0 ? (
        <Section labelledBy="tools">
          <Container>
            <h2 id="tools" className="h2 max-w-[18ch]">
              {INTEGRATIONS.heading}
            </h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {tools
                .flatMap((group) => group.apps)
                .map((app) => (
                  <li
                    key={app.slug}
                    className="flex min-h-12 items-center gap-3 rounded-[10px] border border-line px-4"
                  >
                    {showMark(app.slug) ? (
                      // eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, drawn as is
                      <img src={`/logos/${app.slug}.svg`} alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                    ) : null}
                    <span>{app.name}</span>
                  </li>
                ))}
            </ul>
            {INTEGRATIONS.note ? <p className="small mt-6 max-w-[44rem] text-muted">{INTEGRATIONS.note}</p> : null}
          </Container>
        </Section>
      ) : null}

      <Section surface="forest" labelledBy="questions">
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
