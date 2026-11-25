import Link from "next/link";
import { Stations } from "@/components/home/Stations";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { ExampleFlow } from "@/components/workflow/ExampleFlow";
import { flowExamples } from "@/components/workflow/examples";
import { ENGAGEMENTS } from "@/content/engagements";
import { HOME } from "@/content/pages";
import { getWorkflow, type Workflow } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} — AI Workflow Automation`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

const FIRST = ["lead-triage", "ap-intake", "daily-brief"] as const;

const TREE = `your-company/automations
  workflows/lead-triage/
  workflows/ap-intake/
  monitoring/
  audit-log/
  RUNBOOK.md`;

function facts(workflow: Workflow) {
  const gates = workflow.nodes.filter((node) => node.kind === "human").length;
  return `${workflow.nodes.length} steps. ${gates} approval ${gates === 1 ? "gate" : "gates"}.`;
}

export default function HomePage() {
  return (
    <>
      <section data-surface="dark" className="bg-obsidian">
        <div className="wrap py-8 lg:py-12">
          <h1 className="display max-w-[12ch]">Your back office runs on its own until it needs your approval.</h1>
          <p className="lead mt-5 max-w-[34rem] text-muted">
            We map how work moves through your company, then build the automations inside the tools you already use.
          </p>
          <div className="mt-6 flex flex-col items-start gap-1">
            <Link href={CTA_HREF} className="btn btn-primary">
              {CTA_LABEL}
            </Link>
            <Link href="/workflows" className="text-link inline-flex min-h-11 items-center">
              Read the workflows
            </Link>
          </div>
          <div className="mt-10">
            <ExampleFlow examples={flowExamples()} />
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
                  <Link href={`/workflows/${workflow.id}`} className="block py-5">
                    <span className="block text-[1.2rem] leading-snug">{problem.q}</span>
                    <span className="mt-1 block text-muted">
                      {workflow.title}. {facts(workflow)}
                    </span>
                  </Link>
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
              How a run is built
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
              Everything runs in your accounts.
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
            How an engagement runs
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
          <p className="mt-6">Scoped after the audit.</p>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
