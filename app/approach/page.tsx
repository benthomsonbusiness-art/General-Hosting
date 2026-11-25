import { ApproachStages } from "@/components/content/ApproachStages";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
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
          <Breadcrumbs items={[{ name: "How we work", path: "/approach" }]} />

          <div className="mt-6 grid items-end gap-8 border-b border-line pb-12 lg:grid-cols-12">
            <h1 className="h1 lg:col-span-7">How a project runs</h1>
            <div className="lg:col-span-5">
              <p className="text-[1.05rem] leading-relaxed text-ivory/85">{APPROACH_PAGE.dek}</p>
              <p className="mt-4 text-ivory/80">
                A workflow audit ends with a written map of the process, the automation plan, and the points where a
                person approves.
              </p>
            </div>
          </div>

          <div className="mt-14">
            <ApproachStages />
          </div>
        </Container>
      </section>

      <Section labelledBy="principles">
        <Container>
          <h2 id="principles" className="h2">
            Build principles
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="grid gap-x-12 gap-y-2 py-8 lg:grid-cols-12 lg:items-baseline">
                <h3 className="h3 lg:col-span-7">{item.title}</h3>
                <p className="text-muted lg:col-span-5">{item.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="stages">
        <Container>
          <h2 id="stages" className="h2">
            Three stages
          </h2>
          <div className="mt-12">
            <StageDiagram />
          </div>
          <p className="mt-12 border-t border-ink/12 pt-7 text-[1.35rem] leading-snug">
            Everything built stays yours: {OWNED_ITEMS.join(", ").toLowerCase()}.
          </p>
        </Container>
      </Section>

      <Section labelledBy="hours">
        <Container>
          <h2 id="hours" className="h2 max-w-[16ch]">
            An illustrative reading of the hours
          </h2>
          <div className="mt-10">
            <Estimator />
          </div>
        </Container>
      </Section>

      <Section flush labelledBy="questions" className="pb-20 md:pb-28">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <h2 id="questions" className="h2 lg:col-span-4">
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
