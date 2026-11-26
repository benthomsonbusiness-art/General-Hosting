import { Check } from "lucide-react";
import Link from "next/link";
import { ScopeSteps } from "@/components/graphics/Graphics";
import { BookingPanel } from "@/components/home/BookingPanel";
import { QueuePanel } from "@/components/home/QueuePanel";
import { RepoPanel } from "@/components/home/RepoPanel";
import { Stations } from "@/components/home/Stations";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { RowLink } from "@/components/cards/RowLink";
import { flowExample } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { HOME } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { getWorkflow } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Booking Automation for Home Services`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

const FIRST = ["missed-call-text-back", "appointment-reminders", "estimate-follow-up"] as const;

/** The one workflow drawn on the first screen. Browsing the rest happens on /workflows. */
const HERO_FLOW = flowExample("web-lead-booking");

const QUOTE = TESTIMONIALS[0];

/** Targets each workflow is designed to reach; the audit sets real numbers per client. */
const STATS = [
  { prefix: "Up to", value: "80%", label: "less time answering new leads" },
  { prefix: "Up to", value: "50%", label: "fewer no-shows" },
  { prefix: "", value: "5 hrs", label: "a week back on scheduling" },
  { prefix: "", value: "100%", label: "of texts approved by a person" },
];

const STATS_NOTE = "Design targets for each workflow. Your audit sets the numbers for your company.";

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
            AI does the busywork. <span className="text-gold">You stay in the loop.</span>
          </h1>
          <p className="lead mt-6 max-w-[62rem] text-muted">
            Booking automation for home service businesses. Every missed call and lead gets a fast reply with real open
            times, and your office approves each one from a phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={CTA_HREF} className="btn btn-primary">
              {CTA_LABEL}
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary">
              How it works
            </Link>
          </div>
          <dl className="stats mt-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <dt className="stat-label">{stat.label}</dt>
                <dd className="stat-value">
                  {stat.prefix ? <span className="stat-prefix">{stat.prefix}</span> : null}
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="small mt-3 text-muted">{STATS_NOTE}</p>
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
        <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <h2 id="helps" className="h2">
              Where it helps first
            </h2>
            <ul className="mt-6 border-t border-line">
              {HOME.problems.map((problem) => {
                const workflow = getWorkflow(problem.workflowId);
                if (!workflow || !FIRST.includes(problem.workflowId as (typeof FIRST)[number])) return null;
                return (
                  <li key={problem.workflowId} className="border-b border-line">
                    <RowLink href={`/workflows/${workflow.id}`} title={problem.q} />
                  </li>
                );
              })}
            </ul>
            <Link href="/workflows" className="btn btn-secondary mt-6">
              See all eight workflows
            </Link>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <QueuePanel />
          </div>
        </div>
      </section>

      {QUOTE ? (
        <section data-surface="dark" aria-labelledby="client" className="border-t border-line bg-forest">
          <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-12 lg:py-20">
            <figure className="lg:col-span-5">
              <p id="client" className="small font-semibold tracking-[0.08em] text-gold uppercase">
                Client story
              </p>
              <blockquote className="h3 mt-4 font-normal">“{QUOTE.quote}”</blockquote>
              <figcaption className="mt-6 text-muted">
                <span className="font-semibold text-body">{QUOTE.company}</span>
                {QUOTE.location ? ` · ${QUOTE.location}` : ""}
                {QUOTE.project ? <span className="mt-1 block">{QUOTE.project}</span> : null}
              </figcaption>
              <Link href="/testimonials" className="btn btn-secondary mt-8">
                Read testimonials
              </Link>
            </figure>
            <div className="min-w-0 lg:col-span-7">
              <BookingPanel />
            </div>
          </div>
        </section>
      ) : null}

      <section data-surface="dark" aria-labelledby="built" className="border-t border-line bg-forest">
        <div className="wrap py-14 text-center lg:py-20">
          <h2 id="built" className="h2">
            What happens to each item
          </h2>
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
          <div className="mt-10">
            <ScopeSteps />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
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
