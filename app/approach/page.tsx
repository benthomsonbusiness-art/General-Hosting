import { ApproachStages } from "@/components/content/ApproachStages";
import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { APPROACH_FAQ, PRINCIPLES, STAGES_NOTE } from "@/content/approach";
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
      <section data-surface="dark" aria-labelledby="approach-title" className="bg-obsidian pt-12 pb-20 md:pt-16 md:pb-28">
        <Container>
          <Breadcrumbs items={[{ name: "How we work", path: "/approach" }]} />

          <div className="mt-6 grid items-end gap-8 pb-12 lg:grid-cols-12">
            <h1 id="approach-title" className="h1 lg:col-span-7">
              How we work
            </h1>
            <p className="lead text-muted lg:col-span-5">{APPROACH_PAGE.dek}</p>
          </div>

          <ApproachStages />
        </Container>
      </section>

      <Section labelledBy="principles">
        <Container>
          <h2 id="principles" className="h2">
            How we build
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="grid gap-x-12 gap-y-2 py-8 lg:grid-cols-12 lg:items-baseline">
                <h3 className="h4 lg:col-span-7">{item.title}</h3>
                <p className="text-muted lg:col-span-5">{item.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="ivory" labelledBy="stages">
        <Container>
          <h2 id="stages" className="h2">
            How the work is scoped
          </h2>
          <p className="measure mt-4 text-muted">{STAGES_NOTE}</p>
          <div className="mt-10">
            <StageDiagram />
          </div>
        </Container>
      </Section>

      <Section labelledBy="questions">
        <Container className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <h2 id="questions" className="h2 lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-8">
            <Faq items={APPROACH_FAQ} />
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
