import { EngagementStrip } from "@/components/cards/Cards";
import { BodySection, DefinitionRows, Faq, IndexedBody } from "@/components/content/Blocks";
import { Estimator } from "@/components/content/Estimator";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { APPROACH_FAQ, METHOD, OWNED_ITEMS, PRINCIPLES } from "@/content/approach";
import { ENGAGEMENTS } from "@/content/engagements";
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
        surface="forest"
        title="How we work"
        dek={APPROACH_PAGE.dek}
        photo={PHOTOS.desk}
        crumbs={[{ name: "How we work", path: "/approach" }]}
      />

      <IndexedBody
        items={[
          { id: "method", label: "The method" },
          { id: "principles", label: "Build principles" },
          { id: "engagement", label: "Engagement model" },
          { id: "own", label: "What you own" },
          { id: "hours", label: "Hours estimator" },
          { id: "questions", label: "Questions" },
        ]}
      >
        <BodySection
          id="method"
          title="The method"
          lede="Four steps. Each one ends with something you can read and a decision that is yours."
        >
          <ol className="border-t border-heading">
            {METHOD.map((step, index) => (
              <li key={step.title} className="border-b border-rule py-8">
                <h3 className="h3">
                  <span className="mr-3 text-accent">{index + 1}</span>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[44rem]">{step.happens}</p>
                <dl className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
                  <div className="border-l-2 border-rule pl-5">
                    <dt className="font-semibold text-heading">What you see</dt>
                    <dd className="mt-1 text-muted">{step.see}</dd>
                  </div>
                  <div className="border-l-2 border-gold-ink pl-5">
                    <dt className="font-semibold text-heading">What you approve</dt>
                    <dd className="mt-1 text-muted">{step.approve}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </BodySection>

        <BodySection id="principles" title="Build principles">
          <DefinitionRows rows={PRINCIPLES} />
        </BodySection>

        <BodySection
          id="engagement"
          title="Engagement model"
          lede="Three stages. The audit stands alone, and build work is scoped after it."
        >
          <EngagementStrip stages={ENGAGEMENTS.stages} />
        </BodySection>

        <BodySection
          id="own"
          title="What you own"
          lede="All of it, from the first day. If we part ways, everything keeps working."
        >
          <DefinitionRows rows={OWNED_ITEMS} />
        </BodySection>

        <BodySection
          id="hours"
          title="An illustrative reading of the hours"
          lede="Set the sliders to the size of one process. This is arithmetic with a stated assumption."
        >
          <Estimator />
        </BodySection>

        <BodySection id="questions" title="Questions">
          <Faq items={APPROACH_FAQ} />
        </BodySection>
      </IndexedBody>

      <CtaBand />
    </>
  );
}
