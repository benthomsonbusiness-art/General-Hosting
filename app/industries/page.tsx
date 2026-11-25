import Link from "next/link";
import { IndustryPicker } from "@/components/content/Pickers";
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
      <section data-surface="light" className="bg-paper pt-8 pb-6 md:pt-10 md:pb-8">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 font-mono text-[12px] text-slate">
            <Link href="/" className="hover:text-forest">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">Industries</span>
          </nav>

          <div className="grid items-end gap-6 lg:grid-cols-12">
            <h1 className="font-display text-[clamp(2.7rem,1.8rem+3.4vw,4.6rem)] leading-[0.94] font-medium tracking-[-0.035em] text-ink lg:col-span-7">
              Where the work arrives on paper
            </h1>
            <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-slate lg:col-span-5">
              {INDUSTRIES_HUB.dek}
            </p>
          </div>
        </Container>
      </section>

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
    </>
  );
}
