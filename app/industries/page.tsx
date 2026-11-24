import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroBlock } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { INDUSTRIES } from "@/content/industries";
import { INDUSTRIES_HUB } from "@/content/pages";
import { PHOTOS } from "@/content/services";
import { workflowsById } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description: INDUSTRIES_HUB.metaDescription,
  path: "/industries",
});

/** Two of the six carry a photo. The rest are text with hairlines. */
const PHOTO_BY_SLUG: Record<string, { src: string; position: string }> = {
  "professional-services": { src: PHOTOS.room.src, position: "center 42%" },
  "health-wellness-fitness": { src: PHOTOS.desk.src, position: "center 55%" },
};

export default function IndustriesPage() {
  return (
    <>
      <HeroBlock
        title="Industries"
        dek={INDUSTRIES_HUB.dek}
        crumbs={[{ name: "Industries", path: "/industries" }]}
      />

      <Section labelledBy="industry-list">
        <Container>
          <h2 id="industry-list" className="sr-only">
            Industries and typical workflows
          </h2>
          <ul className="grid gap-x-12 gap-y-12 lg:grid-cols-2">
            {INDUSTRIES.map((item) => {
              const photo = PHOTO_BY_SLUG[item.slug];
              return (
                <li key={item.slug} className="flex">
                  <Link href={`/industries/${item.slug}`} className="group flex w-full flex-col border-t border-heading pt-6">
                    {photo ? (
                      <span className="relative mb-6 block aspect-[16/7] overflow-hidden bg-forest">
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 46vw, 100vw"
                          className="zoom object-cover"
                          style={{ objectPosition: photo.position }}
                        />
                      </span>
                    ) : null}
                    <span className="h3 card-title block text-heading">{item.name}</span>
                    <span className="mt-2 block">{item.dek}</span>
                    <span className="small mt-4 block text-muted">
                      Typical workflows:{" "}
                      {workflowsById(item.workflowIds)
                        .map((workflow) => workflow.title)
                        .join(", ")}
                    </span>
                    <span className="arrow-link mt-auto pt-5 text-[15px]">See where it applies</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="other">
        <Container>
          <SectionHeading id="other" title="Don't see your industry?" lede={INDUSTRIES_HUB.other} />
          <Link href="/contact" className="arrow-link mt-6 min-h-11 items-center">
            Contact the firm
          </Link>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
