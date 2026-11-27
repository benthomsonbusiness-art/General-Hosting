import { Check } from "lucide-react";
import Link from "next/link";
import { RowLink } from "@/components/cards/RowLink";
import { ScopeSteps } from "@/components/graphics/Graphics";
import { BookingPanel } from "@/components/home/BookingPanel";
import { HeroPhoneStage } from "@/components/home/HeroPhoneStage";
import { HomeWorkflowStage } from "@/components/home/HomeWorkflowStage";
import { LeadLeakCalculator } from "@/components/home/LeadLeakCalculator";
import { QueuePanel } from "@/components/home/QueuePanel";
import { RepoPanel } from "@/components/home/RepoPanel";
import { Stations } from "@/components/home/Stations";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { toFlowNodes } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { FlowPlayer } from "@/components/workflow/FlowPlayer";
import { HOME } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { CTA_HREF, CTA_LABEL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | More Bookings for Gyms & Service Businesses`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

const FIRST = ["missed-call-text-back", "web-lead-booking", "appointment-reminders"] as const;

const QUOTE = TESTIMONIALS[0];

const STATS = [
  { prefix: "Up to", value: "80%", label: "less time chasing new leads" },
  { prefix: "Up to", value: "50%", label: "fewer class & appointment no-shows" },
  { prefix: "Up to", value: "5 hrs", label: "a week back on scheduling" },
  { prefix: "", value: "100%", label: "of texts approved by you" },
];

const OWN_POINTS = [
  "Set up in your accounts, not ours",
  "Every text and setting stays yours",
  "Clear instructions your team can follow",
];

const BEFORE_AFTER = {
  without: [
    "6:15 p.m. · Call rings out while you're coaching a class or with a client.",
    "6:18 p.m. · Caller moves down Google and books the next place that replies.",
    "8:30 p.m. · You call back after closing to hear they already booked elsewhere.",
  ],
  withTemporant: [
    "6:15 p.m. · Voicemail lands and open class or calendar times are checked.",
    "6:16 p.m. · Your phone shows a short reply with two real open spots.",
    "6:18 p.m. · One tap sends the text and locks them onto tomorrow's schedule.",
  ],
};

export default function HomePage() {
  const workflowSlots = WORKFLOWS.map((workflow, idx) => ({
    id: workflow.id,
    title: workflow.title,
    summary: workflow.summary,
    player: (
      <FlowPlayer key={workflow.id} workflow={workflow}>
        <FlowDiagram
          id={`home-flow-${workflow.id}`}
          title={workflow.title}
          nodes={toFlowNodes(workflow)}
          stepsHref={`/workflows/${workflow.id}`}
          labelledBy="hero-flow"
          eager={idx === 0}
        />
      </FlowPlayer>
    ),
  }));

  return (
    <>
      <section data-surface="dark" className="bg-obsidian">
        <div className="wrap py-10 lg:py-16">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h1 className="display max-w-[16ch]">
                AI does the busywork. <span className="text-gold">You stay in the loop.</span>
              </h1>
              <p className="lead mt-5 max-w-[38rem] text-muted">
                We help gyms, fitness studios, and service businesses book more clients. Missed calls get a text back,
                website leads get booked, and classes or appointments get reminded. You approve every text from your
                phone.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={CTA_HREF} className="btn btn-primary">
                  {CTA_LABEL}
                </Link>
                <a href="#workflow-stage" className="btn btn-secondary">
                  See how it works
                </a>
              </div>
              <p className="mt-6 text-[14px] text-muted">
                Built for gyms, niche studios, recruiting, entertainment, landscaping, and home services.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <HeroPhoneStage />
            </div>
          </div>

          <dl className="stats mt-12 border-t border-line pt-8">
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
        </div>
      </section>

      <section
        id="workflow-stage"
        data-surface="dark"
        aria-labelledby="hero-flow"
        className="border-t border-line bg-forest"
      >
        <div className="wrap py-14 lg:py-20">
          <HomeWorkflowStage items={workflowSlots} />
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="helps" className="border-t border-line bg-obsidian">
        <div className="wrap py-14 lg:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12">
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
                See all three workflows
              </Link>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <QueuePanel />
            </div>
          </div>

          <div className="mt-16 border-t border-line pt-12">
            <h3 className="h3">What changes at 6:15 p.m.</h3>
            <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="border-t border-line pt-5">
                <p className="font-semibold text-muted">Without Temporant</p>
                <ol className="mt-4 space-y-2.5 text-[15px] text-muted">
                  {BEFORE_AFTER.without.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>

              <div className="border-t-2 border-gold pt-5">
                <p className="font-semibold text-ivory">With Temporant</p>
                <ol className="mt-4 space-y-2.5 text-[15px] text-ivory">
                  {BEFORE_AFTER.withTemporant.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-surface="light" aria-labelledby="yours" className="border-t border-line bg-ivory text-ink">
        <div className="wrap py-14 lg:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="yours" className="h2">
                You own it.
              </h2>
              <ul className="mt-6 grid gap-3 text-ink">
                {OWN_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check aria-hidden size={18} strokeWidth={2.25} className="mt-1 shrink-0 text-gold-ink" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-surface="dark" className="min-w-0 lg:col-span-7">
              <RepoPanel />
            </div>
          </div>

          {QUOTE ? (
            <div className="mt-16 grid grid-cols-[minmax(0,1fr)] items-center gap-10 border-t border-[rgb(20_12_8_/_0.12)] pt-14 lg:grid-cols-12">
              <figure className="lg:col-span-5">
                <blockquote className="h3 font-normal text-ink">“{QUOTE.quote}”</blockquote>
                <figcaption className="mt-5 text-slate">
                  <span className="font-semibold text-ink">{QUOTE.company}</span>
                  {QUOTE.location ? ` · ${QUOTE.location}` : ""}
                </figcaption>
                <Link href="/testimonials" className="btn btn-secondary mt-7">
                  Read testimonials
                </Link>
              </figure>
              <div data-surface="dark" className="min-w-0 lg:col-span-7">
                <BookingPanel />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="calculator" className="border-t border-line bg-obsidian">
        <div className="wrap py-14 lg:py-20">
          <LeadLeakCalculator />
        </div>
      </section>

      <section data-surface="dark" aria-labelledby="built" className="border-t border-line bg-forest">
        <div className="wrap py-14 lg:py-20">
          <div className="text-center">
            <h2 id="built" className="h2">
              How every text works
            </h2>
            <div className="mx-auto mt-12 max-w-[64rem]">
              <Stations />
            </div>
          </div>

          <div className="mt-16 border-t border-line pt-14">
            <h2 id="engagement" className="h2">
              How we get started
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
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
