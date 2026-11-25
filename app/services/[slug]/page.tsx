import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkflowTile } from "@/components/cards/Cards";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/util/JsonLd";
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
          <Link href={service.cta.href} className="btn btn-primary">
            {service.cta.label}
          </Link>
        }
      />

      {flagship ? (
        <Section labelledBy="services">
          <Container>
            <h2 id="services" className="h2">
              Five ways in
            </h2>
            <ul className="mt-14 space-y-14">
              {SUB_SERVICES.map((item) => (
                <li key={item.slug} id={item.slug} tabIndex={-1} className="grid gap-x-12 gap-y-4 outline-none lg:grid-cols-12">
                  <h3 className="lg:col-span-5">
                    <span className="block text-[15px] font-semibold text-gold-ink">{item.name}</span>
                    <span className="mt-1 block font-display text-[clamp(1.7rem,1.3rem+1.3vw,2.4rem)] leading-[1.1] font-medium">
                      {item.question}
                    </span>
                  </h3>
                  <div className="lg:col-span-7">
                    <p className="lead">{item.answer}</p>
                    <ul aria-label={`What you get from ${item.name}`} className="mt-5 flex flex-wrap gap-2">
                      {item.get.map((line) => (
                        <li key={line} className="bg-stone px-3.5 py-1.5 text-[15px]">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : (
        <Section labelledBy="areas">
          <Container>
            <h2 id="areas" className="h2">
              Where we help
            </h2>
            <dl className="mt-14 grid gap-x-16 gap-y-11 md:grid-cols-2">
              {service.areas.map((area) => (
                <div key={area.title}>
                  <dt className="font-display text-[2rem] leading-none text-forest">{area.title}</dt>
                  <dd className="mt-3 max-w-[28rem]">{area.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      )}

      {workflows.length > 0 ? (
        <Section surface="stone" labelledBy="try">
          <Container>
            <h2 id="try" className="h2">
              Try one
            </h2>
            <ul className={`mt-12 grid gap-4 ${workflows.length > 1 ? "md:grid-cols-4" : "md:grid-cols-2"}`}>
              {workflows.map((workflow, index) => (
                <li key={workflow.id} className={index === 0 && workflows.length > 1 ? "md:col-span-2" : ""}>
                  <WorkflowTile workflow={workflow} wide={index === 0 && workflows.length > 1} />
                </li>
              ))}
            </ul>
            <p className="small mt-5 text-muted">Simulations with sample data.</p>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="runs" surface={workflows.length > 0 ? "ivory" : "stone"}>
        <Container>
          <h2 id="runs" className="h2">
            How it runs
          </h2>
          <div className="mt-12">
            {flagship ? (
              <StageDiagram />
            ) : (
              <ol className="grid gap-x-12 gap-y-8 md:grid-cols-3">
                {service.steps?.map((step) => (
                  <li key={step.title}>
                    <h3 className="font-display text-[2rem] leading-none font-medium">{step.title}</h3>
                    <p className="mt-3">{step.body}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Container>
      </Section>

      {flagship ? (
        <Section surface="stone" labelledBy="hours">
          <Container>
            <h2 id="hours" className="h2 max-w-[12em]">
              An illustrative reading of the hours
            </h2>
            <div className="mt-10">
              <Estimator />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="questions">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <h2 id="questions" className="h2 lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-8">
            <Faq items={service.faqs} />
          </div>
        </Container>
      </Section>

      {flagship ? (
        <CtaBand />
      ) : (
        <CtaBand
          headline={["Bring the question you have.", "We'll tell you whether we can help."]}
          label={service.cta.label}
          href={service.cta.href}
        />
      )}
    </>
  );
}
