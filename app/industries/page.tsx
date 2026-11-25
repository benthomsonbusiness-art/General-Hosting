import { IndustryPicker } from "@/components/content/Pickers";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
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
      <Section labelledBy="industries-title">
        <Container>
          <Breadcrumbs items={[{ name: "Industries", path: "/industries" }]} />
          <h1 id="industries-title" className="h1 mt-6 max-w-[16ch]">
            What we automate, by industry
          </h1>
          <p className="lead mt-4 max-w-[36rem] text-muted">{INDUSTRIES_HUB.dek}</p>
          <div className="mt-10">
            <IndustryPicker
              industries={INDUSTRIES.map((item) => ({
                ...item,
                workflows: workflowsById(item.workflowIds).map(({ id, title }) => ({ id, title })),
              }))}
            />
          </div>
        </Container>
      </Section>
      <ClosingCta />
    </>
  );
}
