import Image from "next/image";

const ROWS = [
  {
    label: "Reliability",
    toy: "A different answer each time the same prompt is run. No schema, no retry, no record of what was sent.",
    production:
      "Output checked against a schema. Failures retry or land in a dead-letter queue with the original payload attached.",
  },
  {
    label: "Approvals",
    toy: "The model sits one click away from emailing a customer, a vendor, or a candidate.",
    production:
      "A named person approves anything that leaves the company. Below the confidence line, the item never reaches that send step.",
  },
  {
    label: "Ownership",
    toy: "A shared login and a subscription someone else administers.",
    production: "The code, the infrastructure, and a runbook the team can edit without calling us.",
  },
];

export function Diagnosis() {
  return (
    <section data-surface="light" className="bg-[#F7F4EC] text-[#1A1E1B]">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <figure className="lg:col-span-5">
          <div className="relative">
            <Image
              src="/images/editorial-workspace.jpg"
              alt="A wood desk in window light, with a closed laptop, an open notebook, a brass pen, and a cup of coffee."
              width={1152}
              height={864}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[12px] text-[#4F5752]">Mapped before built.</figcaption>
        </figure>

        <div className="lg:col-span-7">
          <p className="font-mono text-[12px] tracking-[0.16em] text-gold-ink uppercase">
            Diagnosis before code
          </p>
          <h2 className="mt-4 max-w-[14em] text-balance font-display text-[clamp(2.6rem,4.6vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.02em] text-[#133224]">
            The problem with off-the-shelf AI
          </h2>
          <div className="mt-8 max-w-[46rem] space-y-5 text-[16.5px] leading-[1.7] text-[#1A1E1B]">
            <p>
              Most AI work inside a company stalls in a chat window or in a chain of triggers.
              Someone pastes a thread, copies a paragraph, and the next person does it differently.
              The chain breaks the first time a field is empty, and nobody owns the failure.
            </p>
            <p>
              Production work is more specific. Map where the data enters. Mark the step where
              a person has to judge it. Write the rest as ordinary code that either
              succeeds or fails in the open. A model belongs in the middle only when the output is
              a typed object the system can reject.
            </p>
            <p>
              We write that map before a line of workflow code. The audit names the data contract,
              the approval, and the log. The build follows the map.
            </p>
          </div>

          <div className="mt-12 border-t border-[rgba(19,50,36,0.14)]">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="grid gap-4 border-b border-[rgba(19,50,36,0.14)] py-7 md:grid-cols-12 md:gap-8"
              >
                <h3 className="font-display text-[1.7rem] leading-none font-medium text-[#133224] md:col-span-3">
                  {row.label}
                </h3>
                <div className="md:col-span-4">
                  <p className="font-sans text-[12px] text-[#4F5752]">Typical setup</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#4F5752]">{row.toy}</p>
                </div>
                <div className="md:col-span-5">
                  <p className="font-sans text-[12px] text-[#133224]">Production workflows</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#1A1E1B]">{row.production}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
