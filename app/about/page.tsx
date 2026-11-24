import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroSplit } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { ABOUT } from "@/content/pages";
import { PHOTOS } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the firm",
  description: ABOUT.metaDescription,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <HeroSplit
        surface="stone"
        title="About the firm"
        dek={ABOUT.dek}
        photo={PHOTOS.room}
        crumbs={[{ name: "About the firm", path: "/about" }]}
      />

      <Section>
        <Container className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {ABOUT.sections.map((item) => (
              <section
                key={item.id}
                aria-labelledby={item.id}
                className="py-8 first:pt-0 last:pb-0"
              >
                <h2 id={item.id} className="h2">
                  {item.title}
                </h2>
                <div className="mt-4 max-w-[42rem] space-y-4">
                  {item.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>
            ))}
            {/* Founder section slot. Left empty until the owner supplies and approves the text. */}
          </div>
          <aside className="lg:col-span-4" aria-label="Firm details">
            <div className="border-t-2 border-forest pt-6 lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <h2 className="h4">The name</h2>
              <p className="mt-1">{ABOUT.name}</p>
              <h2 className="h4 mt-7">Where we are</h2>
              <p className="mt-1">{ABOUT.where}</p>
              <Link href="/approach" className="arrow-link mt-7 min-h-11 items-center">
                How we work
              </Link>
            </div>
          </aside>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
