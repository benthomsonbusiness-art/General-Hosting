import { Reveal } from "@/components/Reveal";

const steps = [
  {
    numeral: "I",
    title: "Audit & Economics",
    body: "Class utilization, intro-offer economics, CRM and booking flow, and local positioning—before spending a dollar.",
  },
  {
    numeral: "II",
    title: "System Architecture",
    body: "Meta conversion infrastructure, creative angles, and automated lead-to-booking in the studio’s voice.",
  },
  {
    numeral: "III",
    title: "Launch & Calibration",
    body: "Live response monitoring. Refine targeting, messaging, and follow-up timing against booked intro classes.",
  },
  {
    numeral: "IV",
    title: "Compounding Optimization",
    body: "Weekly executive reporting, creative iteration, and workflow refinements that lower acquisition cost as membership compounds.",
  },
];

export function Approach() {
  return (
    <section id="approach" className="scroll-mt-24 bg-forest text-on-dark-body">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32 lg:py-40">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.24em] text-gold uppercase">
            The Approach
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.02em] text-on-dark">
            Structured like a private advisory engagement.
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-hairline-dark lg:grid lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.numeral}
              className={`border-b border-hairline-dark py-10 lg:border-b-0 lg:px-6 lg:py-8 ${
                index === 0 ? "lg:pl-0" : ""
              } ${index === steps.length - 1 ? "border-b-0 lg:pr-0" : "lg:border-r"}`}
            >
              <Reveal delay={index * 0.05}>
                <p className="font-display text-[2rem] leading-none text-gold italic">
                  {step.numeral}
                </p>
                <h3 className="mt-6 font-display text-[1.65rem] leading-tight text-on-dark">
                  {step.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7]">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
