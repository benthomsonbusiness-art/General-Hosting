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
  { prefix: "Up to", value: "80%", label: "less time chasing new leads", graphic: "signal" as const },
  { prefix: "Up to", value: "50%", label: "fewer class & appointment no-shows", graphic: "roster" as const },
  { prefix: "Up to", value: "5 hrs", label: "a week back on scheduling", graphic: "dial" as const },
  { prefix: "", value: "100%", label: "of texts approved by you", graphic: "gate" as const },
];

const OWN_POINTS = [
  "Set up in your accounts, not ours",
  "Every text and setting stays yours",
  "Clear instructions your team can follow",
];

const BEFORE_AFTER = {
  without: [
    { time: "6:15 p.m.", text: "Call rings out while you're coaching a class or with a client." },
    { time: "6:18 p.m.", text: "Caller moves down Google and books the next place that replies." },
    { time: "8:30 p.m.", text: "You call back after closing to hear they already booked elsewhere." },
  ],
  withTemporant: [
    { time: "6:15 p.m.", text: "Voicemail lands and open class or calendar times are checked." },
    { time: "6:16 p.m.", text: "Your phone shows a short reply with two real open spots." },
    { time: "6:18 p.m.", text: "One tap sends the text and locks them onto tomorrow's schedule." },
  ],
};

function StatMicroGraphic({ kind }: { kind: (typeof STATS)[number]["graphic"] }) {
  if (kind === "signal") {
    return (
      <svg viewBox="0 0 88 28" className="h-6 w-20" aria-hidden>
        <path
          d="M2 22 L18 22 L26 6 L34 24 L42 12 L52 16 L86 8"
          fill="none"
          stroke="#FDE047"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="84" cy="8" r="3" fill="#FF6B4A" />
      </svg>
    );
  }
  if (kind === "roster") {
    return (
      <svg viewBox="0 0 88 28" className="h-6 w-20" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={4 + i * 14}
            y={i % 2 === 0 ? 6 : 9}
            width="10"
            height={i % 2 === 0 ? 16 : 13}
            rx="2"
            fill={i === 5 ? "#FF6B4A" : "#F97316"}
            opacity={i === 5 ? 1 : 0.72}
          />
        ))}
      </svg>
    );
  }
  if (kind === "dial") {
    return (
      <svg viewBox="0 0 88 28" className="h-6 w-20" aria-hidden>
        <path
          d="M48 24 A 16 16 0 0 1 80 24"
          fill="none"
          stroke="rgb(251 246 241 / 0.16)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M48 24 A 16 16 0 0 1 75 13"
          fill="none"
          stroke="#FDE047"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line x1="64" y1="24" x2="73" y2="14" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="64" cy="24" r="2.5" fill="#FBF6F1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 88 28" className="h-6 w-20" aria-hidden>
      <rect x="46" y="4" width="38" height="20" rx="5" fill="rgb(255 107 74 / 0.18)" stroke="#FF6B4A" strokeWidth="1.5" />
      <path
        d="M59 14 L63 18 L71 10"
        fill="none"
        stroke="#FF6B4A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <section data-surface="dark" className="hero-stage">
        <div className="hero-grid" aria-hidden />
        <div className="wrap relative z-10 py-10 lg:py-16">
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

          <dl className="stats mt-12 pt-2">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <dt className="stat-label">{stat.label}</dt>
                <dd className="flex items-end justify-between gap-2">
                  <span className="stat-value">
                    {stat.prefix ? <span className="stat-prefix">{stat.prefix}</span> : null}
                    {stat.value}
                  </span>
                  <StatMicroGraphic kind={stat.graphic} />
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
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
              <div className="timeline-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-muted">Without Temporant</p>
                  <span className="rounded-full border border-[rgb(251_246_241_/_0.14)] bg-[rgb(251_246_241_/_0.04)] px-2.5 py-0.5 font-mono text-[11.5px] text-muted">
                    Missed booking
                  </span>
                </div>

                <div className="mt-4 rounded-[8px] border border-[rgb(251_246_241_/_0.08)] bg-[#0a0503] px-3 py-2" aria-hidden>
                  <svg viewBox="0 0 360 36" className="h-8 w-full">
                    <path
                      d="M4 26 L44 26 L56 8 L68 28 L82 26"
                      fill="none"
                      stroke="rgb(251 246 241 / 0.48)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="86"
                      y1="26"
                      x2="354"
                      y2="26"
                      stroke="rgb(251 246 241 / 0.24)"
                      strokeWidth="1.75"
                      strokeDasharray="4 6"
                    />
                    <circle cx="56" cy="8" r="3" fill="rgb(251 246 241 / 0.55)" />
                  </svg>
                </div>

                <ol className="mt-5 space-y-3.5 text-[15px] text-muted">
                  {BEFORE_AFTER.without.map((item) => (
                    <li key={item.time} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-3">
                      <span className="font-mono text-[12px] text-muted tabular-nums">{item.time}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="timeline-card" data-lit="true">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ivory">With Temporant</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(255_107_74_/_0.45)] bg-[rgb(255_107_74_/_0.14)] px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-ivory">
                    <Check aria-hidden size={12} strokeWidth={2.5} className="text-gold" />
                    Booked 6:18 p.m.
                  </span>
                </div>

                <div className="mt-4 rounded-[8px] border border-[rgb(255_107_74_/_0.24)] bg-[#0b0604] px-3 py-2" aria-hidden>
                  <svg viewBox="0 0 360 36" className="h-8 w-full">
                    <defs>
                      <linearGradient id="tl-signal" x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset={0} stopColor="#FDE047" />
                        <stop offset={0.55} stopColor="#F97316" />
                        <stop offset={1} stopColor="#FF6B4A" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4 26 L44 26 L56 9 L70 22 L150 18 L178 12 L270 12 L352 8"
                      fill="none"
                      stroke="url(#tl-signal)"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="56" cy="9" r="3" fill="#FDE047" />
                    <circle cx="178" cy="12" r="3" fill="#F97316" />
                    <circle cx="352" cy="8" r="4" fill="#FF6B4A" />
                  </svg>
                </div>

                <ol className="mt-5 space-y-3.5 text-[15px] text-ivory">
                  {BEFORE_AFTER.withTemporant.map((item, idx) => (
                    <li key={item.time} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-3">
                      <span
                        className={`font-mono text-[12px] tabular-nums ${
                          idx === 2 ? "font-semibold text-gold" : "text-cyan"
                        }`}
                      >
                        {item.time}
                      </span>
                      <span>{item.text}</span>
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
            <div className="mx-auto mt-10 max-w-[68rem]">
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
