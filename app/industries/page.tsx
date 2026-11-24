import { IndustryPicker } from "@/components/content/Pickers";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroPlain } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { INDUSTRIES } from "@/content/industries";
import { INDUSTRIES_HUB } from "@/content/pages";
import { workflowsById } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description: INDUSTRIES_HUB.metaDescription,
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <HeroPlain title="Where it applies" dek={INDUSTRIES_HUB.dek} crumbs={[{ name: "Industries", path: "/industries" }]} />
      <Section flush labelledBy="pick" className="pb-20 md:pb-28">
        <Container>
          <h2 id="pick" className="sr-only">
            Pick an industry
          </h2>
          <IndustryPicker
            industries={INDUSTRIES.map((item) => ({
              ...item,
              workflows: workflowsById(item.workflowIds).map(({ id, title }) => ({ id, title })),
            }))}
          />
        </Container>
      </Section>
      <CtaBand headline={["Not on the list?", "The method is the same."]} />
    </>
  );
}
