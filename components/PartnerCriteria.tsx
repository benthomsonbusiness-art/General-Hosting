import { Reveal } from "@/components/Reveal";

const criteria = [
  "Boutique Pilates, barre, strength, cycling, or wellness studios",
  "Strong class product and member retention ready to scale cleanly",
  "Owners who want luxury-grade creative, not discount-driven “free challenge” ads",
  "Readiness to automate lead follow-up and measure real unit economics",
];

export function PartnerCriteria() {
  return (
    <section id="who-we-serve" className="scroll-mt-24 bg-ivory text-ink-body">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-12 md:px-10 md:py-32 lg:py-40">
        <Reveal className="md:col-span-5">
          <div className="mb-5 h-px w-10 bg-gold" aria-hidden="true" />
          <p className="text-[11px] font-medium tracking-[0.24em] text-ink uppercase">
            Who We Serve
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.02em] text-ink">
            Built for studios that protect their brand.
          </h2>
          <p className="mt-6 max-w-sm text-[17px] leading-[1.7]">
            A limited roster, so every account receives direct principal attention.
          </p>
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.08}>
          <ul className="border-b border-gold">
            {criteria.map((item) => (
              <li
                key={item}
                className="border-t border-gold py-5 text-[17px] leading-[1.7]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
