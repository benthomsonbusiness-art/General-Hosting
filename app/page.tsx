import { Check } from "lucide-react";
import Link from "next/link";
import { RepoPanel } from "@/components/home/RepoPanel";
import { Stations } from "@/components/home/Stations";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { RowLink } from "@/components/cards/RowLink";
import { flowExample } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { ENGAGEMENTS } from "@/content/engagements";
import { HOME } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
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

const QUOTE = TESTIMONIALS[0];

const OWN_POINTS = [
  "Built in your accounts, not ours",
  "Code, AI instructions and logs live in your repository",
  "A written runbook so your team can run it without us",
];

export default function HomePage() {
  return (
    <>
      <section data-surface="dark" className="bg-obsidian">
        <div className="wrap py-10 lg:py-16">
          <h1 className="h1 max-w-[22ch]">
            Automate the busywork. <span className="text-gold">Approve what matters.</span>
          </h1>
          <p className="lead mt-6 max-w-[62rem] text-muted">
            We map how work moves through your company, then build the automations inside the tools you already use.
            Routine steps run on their own, and nothing goes out until you approve it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={CTA_HREF} className="btn btn-primary">
              {CTA_LABEL}
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary">
              How it works
            </Link>
          </div>
          <div className="mt-12 min-w-0">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <p id="hero-flow" className="small text-muted">
                Example: {HERO_FLOW.title}
              </p>
              <Link href="/workflows" className="text-link small inline-flex min-h-11 items-center">
                See all eight workflows
              </Link>
            </div>
            <FlowDiagram
              id="hero-flow-diagram"
              title={HERO_FLOW.title}
              nodes={HERO_FLOW.nodes}
              stepsHref={`/workflows/${HERO_FLOW.id}`}
              labelledBy="hero-flow"
              eager
            />
          </div>
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="yours" className="border-t border-line bg-obsidian">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="yours" className="h2">
              You own what we build.
            </h2>
            <p className="mt-4 max-w-[36rem] text-muted">{HOME.how.own}</p>
            <ul className="mt-6 grid gap-3">
              {OWN_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <Check aria-hidden size={18} strokeWidth={2} className="mt-1 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <RepoPanel />
          </div>
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="helps" className="border-t border-line bg-obsidian">
        <div className="wrap grid items-center gap-x-12 gap-y-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
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
            <Link href="/workflows" className="btn btn-secondary mt-6">
              See all eight workflows
            </Link>
          </div>
          <div className="lg:col-span-5">
            <HardwareFrame
              src="/images/ind-professional.jpg"
              alt="A quiet office after hours, a closed laptop on a dark green desk under a lamp."
              width={4}
              height={5}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      {QUOTE ? (
        <section data-surface="dark" aria-label="Client testimonial" className="border-t border-line bg-forest">
          <figure className="wrap mx-auto max-w-[60rem] py-14 text-center lg:py-20">
            <blockquote className="h3 font-normal">“{QUOTE.quote}”</blockquote>
            <figcaption className="mt-6 text-muted">
              <span className="font-semibold text-body">{QUOTE.company}</span>
              {QUOTE.location ? ` · ${QUOTE.location}` : ""}
            </figcaption>
            <Link href="/testimonials" className="btn btn-secondary mt-8">
              Read testimonials
            </Link>
          </figure>
        </section>
      ) : null}

      <section data-surface="dark" aria-labelledby="built" className="border-t border-line bg-forest">
        <div className="wrap py-14 text-center lg:py-20">
          <h2 id="built" className="h2">
            What happens to each item
          </h2>
          <p className="mx-auto mt-4 max-w-[40rem] text-muted">
            Every item passes the same four stations. Only the approval waits for a person.
          </p>
          <div className="mx-auto mt-12 max-w-[64rem]">
            <Stations />
          </div>
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
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p>Build and operations are scoped after the audit.</p>
            <Link href="/how-it-works" className="btn btn-secondary">
              See the full process
            </Link>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
