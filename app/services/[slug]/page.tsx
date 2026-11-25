import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkflowTile } from "@/components/cards/Cards";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { SubServiceScenes } from "@/components/content/SubServiceScenes";
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

const SECONDARY_CUTOUTS: Record<string, string> = {
  "meta-ads-consulting": "/images/cut-receipt.png",
  strategy: "/images/cut-letter.png",
};

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const flagship = service.kind === "flagship";
  const workflows = workflowsById(service.workflowIds);
  const path = serviceHref(service.slug);
  const secondaryCutout = SECONDARY_CUTOUTS[service.slug] ?? "/images/cut-notebook.png";

  return (
    <>
      <JsonLd data={serviceJsonLd(service.name, service.metaDescription, path)} />

      {flagship ? (
        <section data-surface="dark" className="relative overflow-hidden bg-obsidian text-ivory">
          <Image
            src={service.photo.src}
            alt={service.photo.alt}
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-55"
            style={{ objectPosition: service.photo.position }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/45"
          />

          <Container className="relative z-10 pt-14 pb-20 md:pt-20 md:pb-24">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-[12px] text-ivory/70">
              <Link href="/" className="hover:text-ivory">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/services" className="hover:text-ivory">
                Services
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ivory">{service.name}</span>
            </nav>

            <div className="grid items-end gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h1 className="font-display text-[clamp(2.9rem,1.8rem+4vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ivory">
                  {service.h1}
                </h1>
                <p className="mt-6 max-w-[38rem] text-[clamp(1.125rem,1rem+0.45vw,1.35rem)] leading-relaxed text-ivory/88">
                  {service.dek}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Link href={service.cta.href} className="btn btn-primary">
                    {service.cta.label}
                  </Link>
                  <Link href="#services" className="arrow-link text-ivory">
                    Read the five entry points
                  </Link>
                </div>
              </div>

              <div className="hidden items-end justify-end gap-4 lg:col-span-4 lg:flex">
                <div className="relative h-64 w-48 -rotate-3">
                  <Image
                    src="/images/cut-invoice.png"
                    alt=""
                    fill
                    loading="eager"
                    sizes="200px"
                    className="object-contain drop-shadow-[0_24px_30px_rgba(11,31,22,0.85)]"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <section data-surface="light" className="border-b border-ink/12 bg-paper pt-12 pb-16 md:pt-16 md:pb-24">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-[12px] text-slate">
              <Link href="/" className="hover:text-forest">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/services" className="hover:text-forest">
                Services
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink">{service.name}</span>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Advisory mandate</p>
                <h1 className="mt-4 font-display text-[clamp(2.8rem,1.8rem+3.4vw,4.6rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ink">
                  {service.h1}
                </h1>
                <p className="mt-6 max-w-[34rem] text-[1.15rem] leading-relaxed text-slate">{service.dek}</p>
                <div className="mt-8">
                  <Link href={service.cta.href} className="btn btn-primary">
                    {service.cta.label}
                  </Link>
                </div>
              </div>

              <div className="relative lg:col-span-6">
                <div className="relative aspect-[4/3] overflow-hidden bg-obsidian shadow-[0_28px_60px_-28px_rgba(11,31,22,0.35)]">
                  <Image
                    src={service.photo.src}
                    alt={service.photo.alt}
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: service.photo.position }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-obsidian/80 via-transparent to-transparent"
                  />
                  <div className="absolute right-5 bottom-4 h-36 w-28 -rotate-3 sm:right-6 sm:bottom-5 sm:h-44 sm:w-32">
                    <Image
                      src={secondaryCutout}
                      alt=""
                      fill
                      loading="eager"
                      sizes="144px"
                      className="object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {flagship ? (
        <Section labelledBy="services">
          <Container>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Scope of work</p>
                <h2
                  id="services"
                  className="mt-2 font-display text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] leading-[0.98] font-medium tracking-[-0.03em]"
                >
                  Five ways in
                </h2>
              </div>
              <p className="max-w-md text-slate">
                Every workflow engagement starts from the documents and tools already in use, then isolates what can run without manual copying.
              </p>
            </div>
            <SubServiceScenes items={SUB_SERVICES} />
          </Container>
        </Section>
      ) : (
        <Section labelledBy="areas">
          <Container className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">What gets reviewed</p>
              <h2
                id="areas"
                className="mt-2 font-display text-[clamp(2.1rem,1.5rem+1.8vw,3rem)] leading-[1] font-medium tracking-[-0.025em]"
              >
                Where we help
              </h2>
            </div>
            <dl className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
              {service.areas.map((area, index) => (
                <div key={area.title} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline">
                  <dt className="flex items-baseline gap-4 sm:col-span-5">
                    <span className="font-mono text-[12px] text-moss">0{index + 1}</span>
                    <span className="font-display text-[1.75rem] leading-none font-medium text-forest">
                      {area.title}
                    </span>
                  </dt>
                  <dd className="text-slate sm:col-span-7">{area.body}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      )}

      {workflows.length > 0 ? (
        <Section surface="ivory" labelledBy="try">
          <Container>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Live simulations</p>
                <h2
                  id="try"
                  className="mt-2 font-display text-[clamp(2.1rem,1.5rem+1.8vw,3rem)] leading-[1] font-medium tracking-[-0.025em]"
                >
                  Try one
                </h2>
              </div>
              <p className="font-mono text-[12px] text-slate">Simulations run locally with sample records.</p>
            </div>
            <ul className={`mt-10 grid gap-4 ${workflows.length > 1 ? "md:grid-cols-4" : "md:grid-cols-2"}`}>
              {workflows.map((workflow, index) => (
                <li key={workflow.id} className={index === 0 && workflows.length > 1 ? "md:col-span-2" : ""}>
                  <WorkflowTile workflow={workflow} wide={index === 0 && workflows.length > 1} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="runs" surface={workflows.length > 0 ? "paper" : "ivory"}>
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Engagement structure</p>
          <h2
            id="runs"
            className="mt-2 font-display text-[clamp(2.1rem,1.5rem+1.8vw,3rem)] leading-[1] font-medium tracking-[-0.025em]"
          >
            How it runs
          </h2>
          <div className="mt-12">
            {flagship ? (
              <StageDiagram />
            ) : (
              <ol className="grid gap-6 md:grid-cols-3">
                {service.steps?.map((step, index) => (
                  <li key={step.title} className="border border-ink/15 bg-paper p-7 md:p-8">
                    <span className="font-mono text-[12px] text-moss">Step 0{index + 1}</span>
                    <h3 className="mt-4 font-display text-[1.9rem] leading-tight font-medium text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-slate">{step.body}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Container>
      </Section>

      {flagship ? (
        <Section surface="ivory" labelledBy="hours">
          <Container>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Interactive arithmetic</p>
                <h2
                  id="hours"
                  className="mt-2 max-w-[14em] font-display text-[clamp(2.1rem,1.5rem+1.8vw,3.1rem)] leading-[1] font-medium tracking-[-0.025em]"
                >
                  An illustrative reading of the hours
                </h2>
              </div>
              <p className="max-w-sm text-slate">
                Move the sliders to watch the reclaimed workload grow alongside the yearly range.
              </p>
            </div>
            <div className="mt-10">
              <Estimator />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="questions">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Before starting</p>
            <h2
              id="questions"
              className="mt-2 font-display text-[clamp(2.1rem,1.5rem+1.8vw,3rem)] leading-[1] font-medium tracking-[-0.025em]"
            >
              Questions
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Faq items={service.faqs} />
          </div>
        </Container>
      </Section>
    </>
  );
}
