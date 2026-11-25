import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { ABOUT } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the firm",
  description: ABOUT.metaDescription,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section data-surface="light" className="bg-paper pt-12 pb-16 md:pt-20 md:pb-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 font-mono text-[12px] text-slate">
            <Link href="/" className="hover:text-forest">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">About the firm</span>
          </nav>

          <div className="max-w-5xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">Operating thesis</p>
            <h1 className="mt-4 font-display text-[clamp(3.1rem,2rem+4.5vw,6rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ink">
              About the firm
            </h1>
            <p className="mt-8 max-w-[42rem] text-[clamp(1.2rem,1.05rem+0.55vw,1.45rem)] leading-relaxed text-slate">
              {ABOUT.dek}
            </p>
            <div className="mt-8">
              <Link href="/approach" className="arrow-link min-h-11 items-center text-forest">
                Read how a project runs
              </Link>
            </div>
          </div>

          <figure className="mt-14 md:mt-20">
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-obsidian">
              <Image
                src="/images/gate-detail.jpg"
                alt="Macro view of a walnut and brass rubber stamp hovering millimeters above heavy cream cotton paper before the mark lands."
                fill
                loading="eager"
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[12px] text-slate">
              <span>The pause before commitment</span>
              <span>Human approval gate, macro detail</span>
            </figcaption>
          </figure>
        </Container>
      </section>

      <Section surface="ivory" labelledBy="beliefs">
        <Container>
          <h2 id="beliefs" className="sr-only">
            What we believe
          </h2>
          <ol className="divide-y divide-ink/15 border-y border-ink/15">
            {ABOUT.beliefs.map((item, index) => (
              <li key={item.title} className="grid gap-x-12 gap-y-4 py-10 md:grid-cols-12 md:items-baseline md:py-12">
                <span className="font-mono text-[12px] text-moss md:col-span-1">0{index + 1}</span>
                <h3 className="font-display text-[clamp(2rem,1.45rem+1.8vw,3rem)] leading-[1.02] font-medium tracking-[-0.025em] text-ink md:col-span-5">
                  {item.title}
                </h3>
                <p className="max-w-[34rem] text-[1.125rem] leading-relaxed text-slate md:col-span-6">{item.body}</p>
              </li>
            ))}
          </ol>
          {/* Founder section slot. Left empty until the owner supplies and approves the text. */}
        </Container>
      </Section>

      <Section labelledBy="location">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p id="location" className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">
              Registered practice
            </p>
            <p className="mt-2 font-display text-[clamp(1.75rem,1.3rem+1.5vw,2.6rem)] leading-tight font-medium text-forest">
              {ABOUT.name} {ABOUT.where}
            </p>
          </div>
          <Link href="/workflows" className="arrow-link min-h-11 shrink-0 items-center whitespace-nowrap text-forest">
            Watch the eight workflows
          </Link>
        </Container>
      </Section>
    </>
  );
}
