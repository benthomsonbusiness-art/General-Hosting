import { Reveal } from "@/components/Reveal";

const flow = [
  { index: "01", label: "Demand Capture" },
  { index: "02", label: "Instant AI Qualification & Booking" },
  { index: "03", label: "Unit-Economics Reporting" },
];

function Arrow() {
  return (
    <svg viewBox="0 0 36 12" className="h-3 w-9 text-gold" aria-hidden="true">
      <path
        d="M0 6h32M26 1.5 32.5 6 26 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function Thesis() {
  return (
    <section className="bg-ivory text-ink-body">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-12 md:gap-16 md:px-10 md:py-32 lg:py-40">
        <Reveal className="md:col-span-5">
          <div className="mb-5 h-px w-10 bg-gold" aria-hidden="true" />
          <p className="text-[11px] font-medium tracking-[0.24em] text-ink uppercase">
            The Premise
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.02em] text-ink">
            Most studios do not have a demand problem. They have a conversion gap.
          </h2>
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.08}>
          <div className="flex max-w-xl flex-col gap-6 text-[17px] leading-[1.7]">
            <p>
              Paid ads bring high-intent local prospects, yet front-desk teams
              miss inquiries for hours while spreadsheets hide true
              cost-per-member.
            </p>
            <p>
              Valentini & Co. treats growth as one closed loop: calibrated Meta
              campaigns, sub-minute automated follow-up and intro-class booking,
              and finance-grade KPI reporting.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
        <Reveal>
          <ol className="grid gap-4 md:grid-cols-[1fr_auto_1.2fr_auto_1fr] md:items-stretch">
            {flow.map((step, index) => (
              <li key={step.index} className="contents">
                <div className="flex flex-col justify-between border border-hairline px-5 py-6">
                  <span className="text-[11px] font-medium tracking-[0.24em] text-ink-muted">
                    {step.index}
                  </span>
                  <p className="mt-6 font-display text-[1.7rem] leading-tight text-ink">
                    {step.label}
                  </p>
                </div>
                {index < flow.length - 1 ? (
                  <div className="hidden items-center justify-center md:flex" aria-hidden="true">
                    <Arrow />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
