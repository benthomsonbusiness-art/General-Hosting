import Link from "next/link";
import { EngagementStrip, InsightCluster, ServiceLeadCard, ServiceTextCard } from "@/components/cards/Cards";
import { ProblemList } from "@/components/content/Blocks";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { Reveal } from "@/components/util/Reveal";
import { StaticGraph } from "@/components/workflow/StaticGraph";
import { WorkflowTeaser } from "@/components/workflow/WorkflowTeaser";
import { MECHANICS } from "@/content/approach";
import { ENGAGEMENTS } from "@/content/engagements";
import { INDUSTRIES } from "@/content/industries";
import { INSIGHTS } from "@/content/insights";
import { HOME } from "@/content/pages";
import { FLAGSHIP, PHOTOS, SERVICES, serviceHref } from "@/content/services";
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
  const teaser = getWorkflow("lead-triage") ?? WORKFLOWS[0];

  return (
    <>
      <HeroSplit
        display
        title={
          <>
            We build the AI systems your operations <em>actually run on</em>.
          </>
        }
        dek={HOME.dek}
        photo={PHOTOS.hero}
        actions={
          <>
            <Link href={CTA_HREF} className="btn btn-primary">
              {CTA_LABEL}
            </Link>
            <Link href="/workflows" className="arrow-link min-h-11 items-center">
              Explore the workflows
            </Link>
          </>
        }
      />

      <Section surface="stone" labelledBy="automate">
        <Container>
          <SectionHeading
            id="automate"
            title="What we automate"
            lede="Most manual work starts as one of these. Each link opens an illustrative workflow you can step through."
          />
          <Reveal className="mt-10">
            <ProblemList
              items={HOME.problems.map((item) => ({
                q: item.q,
                a: item.a,
                href: `/workflows/${item.workflowId}`,
                linkLabel: `See ${item.area.toLowerCase()}`,
              }))}
            />
          </Reveal>
        </Container>
      </Section>

      <Section surface="forest" labelledBy="teaser">
        <Container>
          <SectionHeading
            id="teaser"
            title={teaser.title}
            lede={teaser.summary}
            action={
              <Link href="/workflows" className="arrow-link min-h-11 items-center">
                Open the workflow explorer
              </Link>
            }
          />
          <p className="small mt-5 text-muted">Simulation with sample data. Timings are illustrative.</p>
          <div className="mt-10">
            <WorkflowTeaser workflow={teaser}>
              <StaticGraph workflow={teaser} />
            </WorkflowTeaser>
          </div>
        </Container>
      </Section>

      <Section labelledBy="mechanics">
        <Container className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <SectionHeading id="mechanics" title={HOME.mechanicsHeading} lede={HOME.mechanicsLede} />
              <Link href="/approach" className="arrow-link mt-6 min-h-11 items-center">
                How we work
              </Link>
            </div>
          </div>
          <ol className="border-t border-heading lg:col-span-8">
            {MECHANICS.map((item, index) => (
              <li key={item.title} className="grid gap-x-6 gap-y-1.5 border-b border-rule py-7 sm:grid-cols-[2.5rem_1fr]">
                <span className="h3 text-accent" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="h3">{item.title}</h3>
                  <p className="mt-2 max-w-[40rem]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="services">
        <Container>
          <SectionHeading
            id="services"
            title="Services"
            action={
              <Link href="/services" className="arrow-link min-h-11 items-center">
                Services overview
              </Link>
            }
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ServiceLeadCard
                name={FLAGSHIP.name}
                summary={FLAGSHIP.summary}
                href={serviceHref(FLAGSHIP.slug)}
                photo={PHOTOS.fins}
                linkLabel="See the practice"
              />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-4">
              {SERVICES.filter((item) => item.kind === "secondary").map((item) => (
                <ServiceTextCard key={item.slug} name={item.name} summary={item.summary} href={serviceHref(item.slug)} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="industries">
        <Container>
          <SectionHeading
            id="industries"
            title="Where these workflows apply"
            lede="The patterns carry across industries. The systems and the approvals differ."
            action={
              <Link href="/industries" className="arrow-link min-h-11 items-center">
                All industries
              </Link>
            }
          />
          <ul className="mt-10 grid gap-x-12 border-t border-rule md:grid-cols-2">
            {INDUSTRIES.map((item) => (
              <li key={item.slug} className="border-b border-rule">
                <Link href={`/industries/${item.slug}`} className="group block py-5">
                  <span className="h4 card-title arrow-after block text-heading after:ml-2 after:text-accent">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-muted">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="insights">
        <Container>
          <SectionHeading
            id="insights"
            title="Latest insights"
            action={
              <Link href="/insights" className="arrow-link min-h-11 items-center">
                All insights
              </Link>
            }
          />
          <div className="mt-10">
            <InsightCluster insights={INSIGHTS.slice(0, 3)} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="engagements">
        <Container>
          <SectionHeading
            id="engagements"
            title="How an engagement runs"
            lede="Three stages. You can stop after any of them and keep everything that was made."
            action={
              <Link href="/approach" className="arrow-link min-h-11 items-center">
                Read the approach
              </Link>
            }
          />
          <div className="mt-10">
            <EngagementStrip stages={ENGAGEMENTS.stages} />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
