import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { PracticePage } from "@/lib/practices";

export function PracticeView({ practice }: { practice: PracticePage }) {
  const copy = (
    <div
      className={`flex flex-col justify-end px-6 pb-14 md:px-10 lg:col-span-7 lg:px-14 lg:py-36 ${
        practice.image.side === "left" ? "pt-12" : "pt-32"
      }`}
    >
      <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">
        {practice.kicker}
      </p>
      <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(2.8rem,5vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.02em]">
        {practice.title}
      </h1>
      <p className="mt-4 font-display text-[1.5rem] text-[#C5A869] italic">{practice.statement}</p>
      <p className="mt-8 max-w-[40rem] text-[17px] leading-7 text-[#F7F4EC]/78">{practice.lede}</p>
    </div>
  );
  const photo = (
    <div className="relative min-h-[46vh] lg:col-span-5 lg:min-h-full">
      <Image
        src={practice.image.src}
        alt={practice.image.alt}
        fill
        sizes="(min-width: 1024px) 42vw, 100vw"
        className={`object-cover ${practice.image.position}`}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <main id="top" className="flex-1">
        <section className="bg-[#0B1F16] text-[#F7F4EC]">
          <div className="mx-auto grid max-w-[90rem] lg:min-h-[86vh] lg:grid-cols-12">
            {practice.image.side === "left" ? (
              <>
                {photo}
                {copy}
              </>
            ) : (
              <>
                {copy}
                {photo}
              </>
            )}
          </div>
        </section>

        <section data-surface="light" className="bg-[#F7F4EC] text-[#1A1E1B]">
          <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28">
            <p className="font-mono text-[12px] tracking-[0.16em] text-gold-ink uppercase">Where the work sits</p>
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

            <p className="mt-20 font-mono text-[12px] tracking-[0.16em] text-gold-ink uppercase">
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
              Request a Diagnostic
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
