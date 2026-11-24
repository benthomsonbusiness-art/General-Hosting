import { Faq } from "@/components/content/Blocks";
import { StageDiagram } from "@/components/content/Diagrams";
import { Estimator } from "@/components/content/Estimator";
import { MethodStepper } from "@/components/content/Pickers";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { APPROACH_FAQ, OWNED_ITEMS, PRINCIPLES } from "@/content/approach";
import { APPROACH_PAGE } from "@/content/pages";
import { PHOTOS } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How we work",
  description: APPROACH_PAGE.metaDescription,
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <HeroSplit
        title="How we work"
        dek={APPROACH_PAGE.dek}
        photo={PHOTOS.desk}
        crumbs={[{ name: "How we work", path: "/approach" }]}
      />

      <Section surface="forest" labelledBy="method">
        <Container>
          <h2 id="method" className="sr-only">
            The method
          </h2>
          <MethodStepper />
        </Container>
      </Section>

      <Section labelledBy="principles">
        <Container>
          <h2 id="principles" className="sr-only">
            Build principles
          </h2>
          <ul className="space-y-9">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-x-12 gap-y-1">
                <h3 className="max-w-[17em] font-display text-[clamp(1.8rem,1.2rem+2vw,3rem)] leading-[1.08] font-medium">
                  {item.title}
                </h3>
                <p className="text-muted lg:w-72">{item.short}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="stages">
        <Container>
          <h2 id="stages" className="h2">
            Three stages
          </h2>
          <div className="mt-12 [&_[data-surface=light]]:bg-ivory">
            <StageDiagram />
          </div>
          <p className="mt-12 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] leading-tight text-forest">
            You own all of it: {OWNED_ITEMS.join(", ").toLowerCase()}.
          </p>
        </Container>
      </Section>

      <Section labelledBy="hours">
        <Container>
          <h2 id="hours" className="h2 max-w-[12em]">
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

      <CtaBand />
    </>
  );
}
