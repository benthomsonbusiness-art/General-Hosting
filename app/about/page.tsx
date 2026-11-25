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
        title="About the firm"
        dek={ABOUT.dek}
        photo={PHOTOS.room}
        crumbs={[{ name: "About the firm", path: "/about" }]}
        actions={
          <Link href="/approach" className="arrow-link min-h-11 items-center">
            How we work
          </Link>
        }
      />
      <Section surface="stone" labelledBy="beliefs">
        <Container>
          <h2 id="beliefs" className="sr-only">
            What we believe
          </h2>
          <ul className="grid gap-x-16 gap-y-16 md:grid-cols-2">
            {ABOUT.beliefs.map((item) => (
              <li key={item.title}>
                <h3 className="h2 max-w-[9em]">{item.title}</h3>
                <p className="lead mt-5 max-w-[26rem] text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
          {/* Founder section slot. Left empty until the owner supplies and approves the text. */}
        </Container>
      </Section>
      <Section>
        <Container>
          <p className="font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] leading-tight text-forest">
            {ABOUT.name} {ABOUT.where}
          </p>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
