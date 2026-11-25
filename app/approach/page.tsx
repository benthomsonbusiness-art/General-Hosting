import Link from "next/link";
import { ApproachStages } from "@/components/content/ApproachStages";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { Container, Section } from "@/components/layout/Section";
import { APPROACH_FAQ, OWNED_ITEMS, PRINCIPLES } from "@/content/approach";
import { APPROACH_PAGE } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How we work",
  description: APPROACH_PAGE.metaDescription,
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <section data-surface="dark" className="bg-obsidian pt-12 pb-20 text-ivory md:pt-16 md:pb-28">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-mono text-[12px] text-ivory/65">
            <Link href="/" className="hover:text-ivory">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ivory">How we work</span>
          </nav>

          <div className="grid items-end gap-8 border-b border-ivory/15 pb-12 lg:grid-cols-12">
            <h1 className="font-display text-[clamp(3rem,2rem+4.2vw,5.6rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ivory lg:col-span-7">
              Four moves on the table
            </h1>
            <p className="max-w-[34rem] text-[1.15rem] leading-relaxed text-ivory/85 lg:col-span-5">
              {APPROACH_PAGE.dek}
            </p>
          </div>

          <div className="mt-14">
            <ApproachStages />
          </div>
        </Container>
      </section>

      <Section labelledBy="principles">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Operating constraints</p>
          <h2 id="principles" className="sr-only">
            Build principles
          </h2>
          <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
            {PRINCIPLES.map((item, idx) => (
              <li key={item.title} className="grid gap-x-12 gap-y-2 py-9 lg:grid-cols-12 lg:items-baseline">
                <span className="font-mono text-[12px] text-moss lg:col-span-1">0{idx + 1}</span>
                <h3 className="font-display text-[clamp(1.85rem,1.3rem+1.8vw,2.9rem)] leading-[1.04] font-medium tracking-[-0.025em] lg:col-span-7">
                  {item.title}
                </h3>
                <p className="text-slate lg:col-span-4">{item.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="stages">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Commercial sequence</p>
          <h2
            id="stages"
            className="mt-2 font-display text-[clamp(2.2rem,1.6rem+2vw,3.3rem)] leading-[0.98] font-medium tracking-[-0.03em]"
          >
            Three stages
          </h2>
          <div className="mt-12">
            <StageDiagram />
          </div>
          <p className="mt-12 border-t border-ink/15 pt-7 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] leading-tight text-forest">
            Everything built stays yours: {OWNED_ITEMS.join(", ").toLowerCase()}.
          </p>
        </Container>
      </Section>

      <Section labelledBy="hours">
        <Container>
          <h2
            id="hours"
            className="max-w-[14em] font-display text-[clamp(2.1rem,1.5rem+1.8vw,3.1rem)] leading-[1] font-medium tracking-[-0.025em]"
          >
            An illustrative reading of the hours
          </h2>
          <div className="mt-10">
            <Estimator />
          </div>
        </Container>
      </Section>

      <Section flush labelledBy="questions" className="pb-20 md:pb-28">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <h2
            id="questions"
            className="font-display text-[clamp(2.1rem,1.5rem+1.8vw,3rem)] leading-[1] font-medium tracking-[-0.025em] lg:col-span-4"
          >
            Questions
          </h2>
          <div className="lg:col-span-8">
            <Faq items={APPROACH_FAQ} />
          </div>
        </Container>
      </Section>
    </>
  );
}
