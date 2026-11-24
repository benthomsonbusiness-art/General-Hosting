import { BrandEmblem } from "@/components/BrandMark";
import { Reveal } from "@/components/Reveal";

const bar = [
  "Meta Ads & Attribution",
  "Instant AI Follow-Up",
  "Studio Unit Economics",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-forest text-on-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(197,168,105,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(197,168,105,0.16) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.85), transparent 64%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-6 hidden w-[min(42vw,28rem)] -translate-y-1/2 opacity-[0.08] lg:block"
      >
        <BrandEmblem className="h-auto w-full" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-32 pb-16 md:px-10 md:pt-36">
        <Reveal>
          <p className="max-w-xl text-[11px] font-medium tracking-[0.24em] text-gold uppercase">
            Boutique Fitness Advisory · Paid Acquisition & AI Systems
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.25rem,5.4vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-on-dark">
            Predictable member growth, engineered with restraint.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.7] font-light text-on-dark-body sm:text-[18px]">
            Valentini & Co. pairs precision Meta advertising with instant AI
            lead-to-booking systems for boutique fitness studios—turning local
            demand into filled classes without discounting your brand.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a
              href="#inquire"
              className="inline-flex w-full items-center justify-center border border-gold px-5 py-3.5 text-center text-[11px] font-medium tracking-[0.16em] text-on-dark uppercase transition-colors hover:bg-gold hover:text-forest sm:w-auto sm:px-6 sm:tracking-[0.2em]"
            >
              Request a Private Consultation
            </a>
            <a
              href="#capabilities"
              className="text-[15px] text-on-dark-body transition-colors hover:text-on-dark"
            >
              Our Capabilities <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>

      <div className="relative border-t border-hairline-dark">
        <ul className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0 sm:px-10">
          {bar.map((item, index) => (
            <li
              key={item}
              className="flex items-center text-[11px] font-medium tracking-[0.16em] text-gold uppercase sm:tracking-[0.14em]"
            >
              {index > 0 ? (
                <span className="mr-4 hidden text-gold/70 sm:inline" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
