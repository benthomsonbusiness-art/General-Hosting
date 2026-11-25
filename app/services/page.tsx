import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { SERVICES_HUB } from "@/content/pages";
import { FLAGSHIP, SERVICES, SUB_SERVICES, serviceHref, subServiceHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: SERVICES_HUB.metaDescription,
  path: "/services",
});

const SECONDARY_MEDIA: Record<string, { cutout: string; cutoutAlt: string; tag: string }> = {
  "meta-ads-consulting": {
    cutout: "/images/cut-receipt.png",
    cutoutAlt: "Serrated advertising spend ledger strip",
    tag: "Measurement & reporting",
  },
  strategy: {
    cutout: "/images/cut-notebook.png",
    cutoutAlt: "Clothbound operating model notebook",
    tag: "Decision rights & priorities",
  },
};

export default function ServicesPage() {
  const secondary = SERVICES.filter((item) => item.kind === "secondary");

  return (
    <>
      <section data-surface="dark" className="relative overflow-hidden bg-obsidian text-ivory">
        <Image
          src="/images/hero-paper-fall.jpg"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/55 to-obsidian"
        />

        <Container className="relative z-10 pt-14 pb-20 md:pt-20 md:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-[12px] text-ivory/70">
            <Link href="/" className="hover:text-ivory">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ivory">Services</span>
          </nav>

          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ivory/70">
                Primary practice · Flagship
              </p>
              <h1 className="mt-4 font-display text-[clamp(3.2rem,2rem+4.8vw,6.2rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ivory">
                {FLAGSHIP.name}
              </h1>
              <p className="mt-6 max-w-[38rem] text-[clamp(1.125rem,1rem+0.45vw,1.35rem)] leading-relaxed text-ivory/88">
                {SERVICES_HUB.dek}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href={FLAGSHIP.cta.href} className="btn btn-primary">
                  {FLAGSHIP.cta.label}
                </Link>
                <Link href={serviceHref(FLAGSHIP.slug)} className="arrow-link text-ivory">
                  See how the flagship practice runs
                </Link>
              </div>
            </div>

            <div className="hidden justify-self-end lg:col-span-4 lg:block">
              <div className="relative h-72 w-56">
                <Image
                  src="/images/cut-contract.png"
                  alt=""
                  fill
                  loading="eager"
                  sizes="224px"
                  className="object-contain drop-shadow-[0_28px_36px_rgba(11,31,22,0.85)]"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-ivory/15 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/65">
              Five ways into AI Workflow Automation
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {SUB_SERVICES.map((sub, idx) => (
                <li key={sub.slug}>
                  <Link
                    href={subServiceHref(sub.slug)}
                    className="group flex h-full flex-col justify-between border border-ivory/15 bg-forest/45 p-4 transition-colors hover:border-ivory/40 hover:bg-forest/75"
                  >
                    <span className="font-mono text-[11px] text-ivory/60">0{idx + 1}</span>
                    <span className="mt-4 block font-display text-[1.25rem] leading-tight font-medium text-ivory">
                      {sub.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Section labelledBy="secondary-practices">
        <Container>
          <div className="flex flex-col justify-between gap-4 border-b border-ink/15 pb-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Focused mandates</p>
              <h2
                id="secondary-practices"
                className="mt-2 font-display text-[clamp(2.2rem,1.6rem+2vw,3.3rem)] leading-[0.98] font-medium tracking-[-0.03em]"
              >
                Two advisory practices alongside the engineering
              </h2>
            </div>
            <Link href="/industries" className="arrow-link min-h-11 items-center text-forest">
              Where these workflows apply
            </Link>
          </div>

          <div className="mt-12 space-y-10">
            {secondary.map((item, index) => {
              const extra = SECONDARY_MEDIA[item.slug] ?? {
                cutout: "/images/cut-notebook.png",
                cutoutAlt: "Clothbound ledger",
                tag: item.name,
              };
              const flip = index === 1;

              return (
                <Link
                  key={item.slug}
                  href={serviceHref(item.slug)}
                  className="group block border border-ink/15 bg-ivory transition-colors hover:border-forest"
                >
                  <div className="grid items-stretch lg:grid-cols-12">
                    <div
                      className={`relative min-h-[18rem] overflow-hidden bg-obsidian lg:col-span-5 lg:min-h-[24rem] ${
                        flip ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={item.photo.src}
                        alt={item.photo.alt}
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="zoom object-cover opacity-80"
                        style={{ objectPosition: item.photo.position }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent"
                      />
                      <div className="relative z-10 flex h-full items-end justify-between p-7">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ivory/80">
                          {extra.tag}
                        </span>
                        <div className="relative h-36 w-28 shrink-0 -rotate-2">
                          <Image
                            src={extra.cutout}
                            alt=""
                            fill
                            loading="eager"
                            sizes="112px"
                            className="object-contain drop-shadow-[0_14px_20px_rgba(11,31,22,0.75)] transition-transform duration-500 ease-[var(--ease-paper)] group-hover:-translate-y-1.5 group-hover:rotate-0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-7 md:p-12 lg:col-span-7">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">
                          Practice 0{index + 2}
                        </p>
                        <h3 className="card-title mt-3 font-display text-[clamp(2.1rem,1.6rem+1.6vw,3rem)] leading-[1] font-medium tracking-[-0.025em] text-forest">
                          {item.name}
                        </h3>
                        <p className="mt-4 max-w-[34rem] text-[1.125rem] leading-relaxed text-slate">{item.summary}</p>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-5">
                        <span className="font-mono text-[12px] text-slate">
                          {item.areas.map((a) => a.title).join(" · ")}
                        </span>
                        <span className="arrow-link text-forest">Open practice</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
