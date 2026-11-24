import Image from "next/image";
import Link from "next/link";
import { EngagementStrip, ServiceTextCard } from "@/components/cards/Cards";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroBlock } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { ENGAGEMENTS } from "@/content/engagements";
import { SERVICES_HUB } from "@/content/pages";
import { FLAGSHIP, PHOTOS, SERVICES, SUB_SERVICES, serviceHref, subServiceHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: SERVICES_HUB.metaDescription,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <HeroBlock
        title="Services"
        dek={SERVICES_HUB.dek}
        crumbs={[{ name: "Services", path: "/services" }]}
        aside={
          <ul className="border-t border-rule">
            {SERVICES.map((item) => (
              <li key={item.slug} className="border-b border-rule">
                <Link href={serviceHref(item.slug)} className="arrow-link min-h-12 w-full items-center justify-between">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        }
      />

      <Section labelledBy="flagship">
        <Container>
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
                <p className="eyebrow">Flagship practice</p>
                <h2 id="flagship" className="h2 mt-3">
                  {FLAGSHIP.name}
                </h2>
                <p className="lead mt-4 text-muted">{FLAGSHIP.summary}</p>
                <Link href={serviceHref(FLAGSHIP.slug)} className="arrow-link mt-5 min-h-11 items-center">
                  See the whole practice
                </Link>
                <div className="relative mt-8 aspect-[16/10] overflow-hidden bg-forest">
                  <Image
                    src={PHOTOS.fins.src}
                    alt={PHOTOS.fins.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "40% center" }}
                  />
                </div>
              </div>
            </div>
            <ul className="border-t border-heading lg:col-span-7">
              {SUB_SERVICES.map((item) => (
                <li key={item.slug} className="border-b border-rule">
                  <Link href={subServiceHref(item.slug)} className="group block py-7">
                    <span className="eyebrow">{item.name}</span>
                    <span className="h3 card-title mt-2 block text-heading">{item.question}</span>
                    <span className="mt-2 block text-muted">{item.answer}</span>
                    <span className="arrow-link mt-4 text-[15px]">Read about {item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="other">
        <Container>
          <SectionHeading id="other" title="Other practices" />
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {SERVICES.filter((item) => item.kind === "secondary").map((item, index) => (
              <div key={item.slug} className={`flex ${index === 0 ? "md:col-span-7" : "md:col-span-5"}`}>
                <ServiceTextCard name={item.name} summary={item.summary} href={serviceHref(item.slug)} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="engagements">
        <Container>
          <SectionHeading id="engagements" title="How engagements run" />
          <div className="mt-8">
            <EngagementStrip stages={ENGAGEMENTS.stages} />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
