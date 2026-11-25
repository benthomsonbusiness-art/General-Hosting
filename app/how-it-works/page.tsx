import { Faq } from "@/components/content/Blocks";
import { IconCards, ScopeSteps, StepTrack } from "@/components/graphics/Graphics";
import { ServiceCards } from "@/components/graphics/ServiceCards";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { APPROACH_FAQ, METHOD, PRINCIPLES } from "@/content/approach";
import { HOW_IT_WORKS } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How it works",
  description: HOW_IT_WORKS.metaDescription,
  path: "/how-it-works",
});

/** What we offer and how a project runs, mostly in pictures. */
export default function HowItWorksPage() {
  return (
    <>
      <Section labelledBy="how-title">
        <Container>
          <Breadcrumbs items={[{ name: "How it works", path: "/how-it-works" }]} />
          <h1 id="how-title" className="h1 mt-6 max-w-[18ch]">
            How it works
          </h1>
          <p className="lead mt-5 max-w-[48rem] text-muted">{HOW_IT_WORKS.statement}</p>
          <HelpCta />
        </Container>
      </Section>

      <Section labelledBy="offer" surface="forest">
        <Container>
          <h2 id="offer" className="h2">
            What we offer
          </h2>
          <div className="mt-10">
            <ServiceCards />
          </div>
        </Container>
      </Section>

      <Section labelledBy="process">
        <Container>
          <h2 id="process" className="h2">
            The process
          </h2>
          <p className="mt-4 text-muted">You approve each step before we move on.</p>
          <div className="mt-12">
            <StepTrack steps={METHOD.map((step) => ({ title: step.title, line: step.line }))} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="scope" surface="forest">
        <Container>
          <h2 id="scope" className="h2">
            How it&rsquo;s scoped
          </h2>
          <p className="mt-4 text-muted">Start small. You only commit to the audit.</p>
          <div className="mt-10">
            <ScopeSteps />
          </div>
        </Container>
      </Section>

      <Section labelledBy="always">
        <Container>
          <h2 id="always" className="h2">
            On every project
          </h2>
          <div className="mt-10">
            <IconCards items={PRINCIPLES.map((item) => ({ title: item.title }))} columns={5} />
          </div>
        </Container>
      </Section>

      <Section labelledBy="questions" surface="forest">
        <Container className="grid gap-8 lg:grid-cols-12">
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
