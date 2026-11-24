import { Reveal } from "@/components/Reveal";

const disciplines = [
  {
    index: "01",
    title: "Paid Acquisition",
    detail: "Meta Ads",
    body: "Local studio positioning, luxury-aligned creative direction, Advantage+ architecture, Pixel and Conversions API, and a disciplined cost per booked intro.",
  },
  {
    index: "02",
    title: "AI Lead & Booking Automation",
    detail: "Response, qualification, booking",
    body: "Respond to every ad lead within seconds by SMS and email. Qualify, follow up with persistence and tact, and route the prospect into an intro-class booking and the studio CRM.",
  },
  {
    index: "03",
    title: "Executive Reporting & Unit Economics",
    detail: "Finance-grade KPIs",
    body: "Ad spend, lead-to-intro, intro-to-membership, retention, and ROAS. Weekly visibility. No vanity metrics.",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 bg-cream text-ink-body">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32 lg:py-40">
        <Reveal>
          <div className="mb-5 h-px w-10 bg-gold" aria-hidden="true" />
          <p className="text-[11px] font-medium tracking-[0.24em] text-ink uppercase">
            Capabilities
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.02em] text-ink">
            Three disciplines, one accountable growth system.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-hairline md:grid md:grid-cols-3 md:border-t-0">
          {disciplines.map((item, index) => (
            <Reveal key={item.index} delay={index * 0.06} className="md:h-full">
              <article
                className={`border-b border-hairline py-10 md:h-full md:border-b-0 md:px-8 md:py-2 ${
                  index === 0 ? "md:pl-0" : "md:border-l"
                } ${index === disciplines.length - 1 ? "border-b-0 md:pr-0" : ""}`}
              >
                <p className="font-display text-[1.75rem] tracking-[0.08em] text-ink">
                  {item.index}
                </p>
                <h3 className="mt-6 font-display text-[2rem] leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[11px] font-medium tracking-[0.2em] text-ink-muted uppercase">
                  {item.detail}
                </p>
                <p className="mt-5 max-w-sm text-[16px] leading-[1.7]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
