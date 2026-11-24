import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { PracticePage } from "@/lib/practices";

export function PracticeView({ practice }: { practice: PracticePage }) {
  return (
    <>
      <Navbar overlay />
      <main id="top" className="flex-1">
        <section className="bg-[#0B1F16] px-6 pt-32 pb-20 text-[#F7F4EC] md:px-10 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[90rem]">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">
              {practice.kicker} · Active practice
            </p>
            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.8rem,5.4vw,4.8rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              {practice.title}
            </h1>
            <p className="mt-4 font-display text-[1.5rem] text-[#C5A869] italic">{practice.statement}</p>
            <p className="mt-8 max-w-[42rem] text-[17px] leading-7 text-[#F7F4EC]/78">{practice.lede}</p>
          </div>
        </section>

        <section className="bg-[#F7F4EC] text-[#1A1E1B]">
          <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">Where the work sits</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,3.6vw,3.2rem)] leading-tight font-medium tracking-[-0.02em] text-[#133224]">
              Areas of focus
            </h2>
            <div className="mt-10 border-t border-[rgba(19,50,36,0.14)]">
              {practice.areas.map((area) => (
                <div
                  key={area.title}
                  className="grid gap-3 border-b border-[rgba(19,50,36,0.14)] py-7 md:grid-cols-12 md:gap-10 md:py-8"
                >
                  <h3 className="font-display text-[1.7rem] leading-tight font-medium text-[#133224] md:col-span-4">
                    {area.title}
                  </h3>
                  <p className="text-[16px] leading-7 text-[#4F5752] md:col-span-8">{area.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-20 font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">
              How an engagement is structured
            </p>
            <div className="mt-8 border-t border-[rgba(19,50,36,0.14)]">
              {practice.engagement.map((step) => (
                <div
                  key={step.title}
                  className="grid gap-3 border-b border-[rgba(19,50,36,0.14)] py-7 md:grid-cols-12 md:gap-10"
                >
                  <h3 className="font-display text-[1.7rem] leading-tight font-medium text-[#133224] md:col-span-4">
                    {step.title}
                  </h3>
                  <p className="text-[16px] leading-7 text-[#1A1E1B] md:col-span-8">{step.body}</p>
                </div>
              ))}
            </div>

            <Link
              href={`/?practice=${practice.param}#diagnostic`}
              className="mt-12 inline-flex border border-[#133224] px-5 py-3.5 text-[11px] font-medium tracking-[0.16em] text-[#133224] uppercase transition-colors hover:bg-[#133224] hover:text-[#F7F4EC]"
            >
              Book a diagnostic for this practice
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
