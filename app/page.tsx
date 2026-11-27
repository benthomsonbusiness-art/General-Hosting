import { Check, Clock, PhoneOff, UserCheck } from "lucide-react";
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
  title: `${SITE_NAME} | More Booked Jobs for Service Businesses`,
  absoluteTitle: true,
  description: HOME.metaDescription,
  path: "/",
});

const FIRST = ["missed-call-text-back", "web-lead-booking", "appointment-reminders"] as const;

const QUOTE = TESTIMONIALS[0];

/** Targets each workflow is designed to reach; the audit sets real numbers per client. */
const STATS = [
  { prefix: "Up to", value: "80%", label: "less time answering new leads" },
  { prefix: "Up to", value: "50%", label: "fewer no-shows" },
  { prefix: "Up to", value: "5 hrs", label: "a week back on scheduling" },
  { prefix: "", value: "100%", label: "of texts approved by you" },
];

const STATS_NOTE = "Goals we design each tool to hit. Your audit sets the real numbers for your business.";

const OWN_POINTS = [
  "Set up in your accounts, not ours",
  "Every text and setting is yours to keep",
  "Simple instructions your team can follow",
];

const TRADE_TOOLS = ["ServiceTitan", "Jobber", "Housecall Pro", "CallRail", "Google Calendar", "QuickBooks"];

const BEFORE_AFTER = {
  without: [
    "6:12 p.m. — Call rings out while you are under a sink or on a ladder.",
    "6:14 p.m. — Caller moves down Google and books the next shop that answers.",
    "8:20 p.m. — You call back from your truck to hear they found someone else.",
  ],
  withTemporant: [
    "6:12 p.m. — Voicemail lands; AI checks your area and open tech windows.",
    "6:13 p.m. — Your phone buzzes with a ready-to-send text and two real times.",
    "6:14 p.m. — One tap approves the text, and the job is on tomorrow's board.",
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
        <div className="wrap py-8 lg:py-12">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-[6px] border border-[rgb(249_115_22_/_0.4)] bg-[rgb(249_115_22_/_0.12)] px-3 py-1 text-[12px] font-semibold tracking-[0.06em] text-violet-hi uppercase sm:rounded-full">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                For HVAC, plumbing, electrical &amp; home services
              </p>
              <h1 className="display mt-4 max-w-[16ch]">
                AI does the busywork. <span className="text-gold">You stay in the loop.</span>
              </h1>
              <p className="lead mt-5 max-w-[38rem] text-muted">
                We help service businesses book more jobs. Missed calls get a text back, website leads get booked, and
                customers get reminded. You approve every text from your phone.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href={CTA_HREF} className="btn btn-primary">
                  {CTA_LABEL}
                </Link>
                <a href="#workflow-stage" className="btn btn-secondary">
                  Watch a live run
                </a>
              </div>
              <div className="mt-7 border-t border-line pt-4">
                <p className="text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">
                  Plugs into the software your trucks run today
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {TRADE_TOOLS.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-[6px] border border-line bg-[rgb(251_246_241_/_0.03)] px-2.5 py-1 text-[13px] text-ivory"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <HeroPhoneStage />
            </div>
          </div>

          <div className="mt-10 border-t border-line pt-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="small font-semibold tracking-[0.08em] text-violet-hi uppercase">Our goals for you</p>
              <p className="text-[13px] text-muted">{STATS_NOTE}</p>
            </div>
            <dl className="stats stats-compact mt-3">
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
                See how each one works
              </Link>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <QueuePanel />
            </div>
          </div>

          <div className="mt-14 border-t border-line pt-12">
            <h3 className="h3">What changes at 6:12 p.m.</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-[12px] border border-line bg-well p-6">
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-muted uppercase">
                  <PhoneOff aria-hidden size={15} strokeWidth={1.75} />
                  Typical evening without Temporant
                </p>
                <ol className="mt-4 space-y-3 text-[15px] text-muted">
                  {BEFORE_AFTER.without.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <Clock aria-hidden size={16} strokeWidth={1.5} className="mt-1 shrink-0 text-muted" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[12px] border border-[rgb(255_107_74_/_0.4)] bg-well p-6 shadow-[0_0_32px_-14px_rgb(255_107_74_/_0.35)]">
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-gold uppercase">
                  <UserCheck aria-hidden size={15} strokeWidth={1.75} />
                  Same call with Temporant
                </p>
                <ol className="mt-4 space-y-3 text-[15px] text-ivory">
                  {BEFORE_AFTER.withTemporant.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <Check aria-hidden size={16} strokeWidth={2.25} className="mt-1 shrink-0 text-gold" />
                      <span>{line}</span>
                    </li>
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
              <p className="small font-semibold tracking-[0.08em] text-gold-ink uppercase">No vendor lock-in</p>
              <h2 id="yours" className="h2 mt-2">
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
                <p id="client" className="small font-semibold tracking-[0.08em] text-slate uppercase">
                  Client story
                </p>
                <blockquote className="h3 mt-4 font-normal text-ink">“{QUOTE.quote}”</blockquote>
                <figcaption className="mt-6 text-slate">
                  <span className="font-semibold text-ink">{QUOTE.company}</span>
                  {QUOTE.location ? ` · ${QUOTE.location}` : ""}
                  {QUOTE.project ? <span className="mt-1 block">{QUOTE.project}</span> : null}
                </figcaption>
                <Link href="/testimonials" className="btn btn-secondary mt-8">
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
