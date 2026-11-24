const PHASES = [
  {
    when: "Week 1",
    title: "Operational Audit & Architecture",
    body: "We sit with the people who do the work and write down the path the data actually takes. The week ends with a data contract, the failure cases, and a short list of hours worth taking back. Production code waits until that document exists.",
  },
  {
    when: "Weeks 2–4",
    title: "Build, Guardrails & Shadow Testing",
    body: "The workflow is built inside the stack you already pay for. Validation is deterministic. Alerts fire when a run fails. For a defined window the new path runs in shadow beside the live work, so differences show up before a customer, a vendor, or a candidate ever sees them.",
  },
  {
    when: "Ongoing",
    title: "Handoff, Telemetry & Expansion",
    body: "We walk the team through the runbook. Monitoring stays on. When a step fails, the log says which contract broke. Further workflows are optional, scoped the same way, and still yours when they ship.",
  },
];

export function Engagement() {
  return (
    <section id="how-we-work" className="scroll-mt-24 bg-[#F7F4EC] text-[#1A1E1B]">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">How we work</p>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,4.2vw,3.8rem)] leading-[1.02] font-medium tracking-[-0.02em] text-[#133224]">
              Three phases. Built to own.
            </h2>
            <p className="mt-6 max-w-sm text-[16px] leading-7 text-[#4F5752]">
              Every build ships with documentation, monitoring, and full client ownership of the
              code and the infrastructure it runs on.
            </p>
          </div>
        </div>
        <ol className="border-t border-[rgba(19,50,36,0.14)] lg:col-span-8">
          {PHASES.map((phase) => (
            <li key={phase.when} className="border-b border-[rgba(19,50,36,0.14)] py-10 md:py-12">
              <p className="font-mono text-[11px] tracking-[0.18em] text-[#C5A869] uppercase">{phase.when}</p>
              <h3 className="mt-3 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight font-medium text-[#133224]">
                {phase.title}
              </h3>
              <p className="mt-4 max-w-[48rem] text-[16px] leading-7 text-[#1A1E1B]">{phase.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
