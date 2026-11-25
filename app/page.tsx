import Image from "next/image";
import Link from "next/link";
import { InsightCard, WorkflowTile } from "@/components/cards/Cards";
import { PathDiagram } from "@/components/content/Diagrams";
import { CtaBand } from "@/components/layout/CtaBand";
import { Container, Section } from "@/components/layout/Section";
import { Reveal } from "@/components/util/Reveal";
import { HeroPlayer } from "@/components/workflow/HeroPlayer";
import { INSIGHTS } from "@/content/insights";
import { HOME } from "@/content/pages";
import { PHOTOS, SERVICES, serviceHref } from "@/content/services";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} — AI Workflow Automation`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

export default function HomePage() {
  const lead = getWorkflow("lead-triage") ?? WORKFLOWS[0];

  return (
    <>
      <Section flush className="overflow-hidden">
        <div className="relative lg:min-h-[calc(100svh-var(--header-h))]">
          <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
            <div className="cut-left absolute inset-0 bg-obsidian">
              <Image
                src={PHOTOS.hero.src}
                alt={PHOTOS.hero.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 54vw, 1px"
                className="object-cover opacity-80"
                style={{ objectPosition: "58% center" }}
              />
            </div>
          </div>
          <div className="wrap relative grid items-center gap-x-10 gap-y-10 py-12 lg:min-h-[inherit] lg:grid-cols-12 lg:py-10">
            <div className="lg:col-span-5">
              <h1 className="display">
                We build the AI systems your operations <em>actually run on</em>.
              </h1>
              <p className="lead mt-7 max-w-[30rem] text-muted">{HOME.dek}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link href={CTA_HREF} className="btn btn-primary">
                  {CTA_LABEL}
                </Link>
                <Link href="/workflows" className="arrow-link min-h-11 items-center">
                  Try the workflows
                </Link>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <HeroPlayer workflow={lead} />
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="problems">
        <Container>
          <h2 id="problems" className="h2">
            Start with one of these
          </h2>
          <Reveal>
            <ul className="mt-12 grid gap-4 md:grid-cols-4">
              {HOME.problems.map((item, index) => {
                const workflow = getWorkflow(item.workflowId);
                return workflow ? (
                  <li key={item.workflowId} className={index === 0 ? "md:col-span-2" : ""}>
                    <WorkflowTile workflow={workflow} line={item.q} wide={index === 0} />
                  </li>
                ) : null;
              })}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section surface="forest" labelledBy="how">
        <Container>
          <h2 id="how" className="h2">
            {HOME.how.heading}
          </h2>
          <div className="mt-14">
            <PathDiagram />
          </div>
          <div className="mt-14 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
            <p className="max-w-[34rem]">{HOME.how.own}</p>
            <Link href="/approach" className="arrow-link min-h-11 items-center">
              How we work
            </Link>
          </div>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="insight">
        <Container className="grid items-end gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="insight" className="sr-only">
              Latest insight
            </h2>
            <InsightCard insight={INSIGHTS[0]} lead />
          </div>
          <div className="lg:col-span-4">
            <p className="text-muted">The firm also advises on</p>
            <ul className="mt-2">
              {SERVICES.filter((item) => item.kind === "secondary").map((item) => (
                <li key={item.slug}>
                  <Link
                    href={serviceHref(item.slug)}
                    className="block py-1.5 font-display text-[2.1rem] leading-tight text-forest decoration-1 underline-offset-8 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
