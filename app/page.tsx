import Link from "next/link";
import { Stations } from "@/components/home/Stations";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { RowLink } from "@/components/cards/RowLink";
import { flowExample } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { ENGAGEMENTS } from "@/content/engagements";
import { HOME, WORKFLOWS_PAGE } from "@/content/pages";
import { getWorkflow } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | AI Workflow Automation`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

const FIRST = ["lead-triage", "ap-intake", "daily-brief"] as const;

/** The one workflow drawn on the first screen. Browsing the rest happens on /workflows. */
const HERO_FLOW = flowExample("lead-triage");

const TREE = `your-company/automations
  workflows/lead-triage/
  workflows/ap-intake/
  monitoring/
  audit-log/
  RUNBOOK.md`;

export default function HomePage() {
  return (
    <>
      <section data-surface="dark" className="bg-obsidian">
        <div className="wrap grid items-start gap-x-8 gap-y-10 py-8 lg:grid-cols-12 lg:py-12">
          <div className="lg:col-span-5">
            <h1 className="h1">Your back office runs on its own until it needs your approval.</h1>
            <p className="lead mt-5 max-w-[34rem] text-muted">
              We map how work moves through your company, then build the automations inside the tools you already use.
            </p>
            <div className="mt-6 flex flex-col items-start gap-1">
              <Link href={CTA_HREF} className="btn btn-primary">
                {CTA_LABEL}
              </Link>
              <Link href="/workflows" className="text-link inline-flex min-h-11 items-center">
                See example workflows
              </Link>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <p id="hero-flow" className="small mb-3 text-muted">
              {HERO_FLOW.title}
            </p>
            <FlowDiagram
              id="hero-flow-diagram"
              title={HERO_FLOW.title}
              nodes={HERO_FLOW.nodes}
              variant="compact"
              stepsHref={`/workflows/${HERO_FLOW.id}`}
              labelledBy="hero-flow"
              eager
              footer={
                <Link href={`/workflows/${HERO_FLOW.id}`} className="text-link inline-flex min-h-11 items-center">
                  {WORKFLOWS_PAGE.open}
                </Link>
              }
            />
          </div>
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="helps" className="border-t border-line bg-obsidian">
        <div className="wrap py-14 lg:py-20">
          <h2 id="helps" className="h2">
            Where it helps first
          </h2>
          <ul className="mt-8 border-t border-line">
            {HOME.problems.map((problem) => {
              const workflow = getWorkflow(problem.workflowId);
              if (!workflow || !FIRST.includes(problem.workflowId as (typeof FIRST)[number])) return null;
              return (
                <li key={problem.workflowId} className="border-b border-line">
                  <RowLink href={`/workflows/${workflow.id}`} title={problem.q} line={workflow.title} />
                </li>
              );
            })}
          </ul>
          <Link href="/workflows" className="text-link mt-4 inline-flex min-h-11 items-center">
            See all eight workflows
          </Link>
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="built" className="bg-forest">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="px-5 py-14 sm:px-8 lg:py-20 lg:pr-12 lg:pl-[max(3rem,calc((100vw-84rem)/2+3rem))]">
            <h2 id="built" className="h2">
              What happens to each item
            </h2>
            <div className="mt-10">
              <Stations />
            </div>
          </div>
          <HardwareFrame
            src="/images/key-hero.jpg"
            alt="A gold push key set into a forest-green machined panel, waiting to be pressed."
            width={2400}
            height={1030}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="yours" className="border-t border-line bg-obsidian">
        <div className="wrap grid items-start gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="yours" className="h2">
              You own what we build.
            </h2>
            <p className="mt-4 max-w-[36rem] text-muted">{HOME.how.own}</p>
          </div>
          <pre className="console col-span-1 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-ivory/80 lg:col-span-7">
            {TREE}
          </pre>
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="engagement" className="border-t border-line bg-obsidian">
        <div className="wrap py-14 lg:py-20">
          <h2 id="engagement" className="h2">
            How the work is scoped
          </h2>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {ENGAGEMENTS.stages.map((stage, index) => (
              <li key={stage.id} className="grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline">
                <h3 className="h3 sm:col-span-5">
                  {index + 1} {stage.name}
                </h3>
                <p className="text-muted sm:col-span-7">
                  {stage.shape}. {stage.delivers}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6">Build and operations are scoped after the audit.</p>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
