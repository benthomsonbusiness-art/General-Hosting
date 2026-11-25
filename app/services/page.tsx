import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroPlain } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { SERVICES_HUB } from "@/content/pages";
import { FLAGSHIP, SERVICES, serviceHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: SERVICES_HUB.metaDescription,
  path: "/services",
});

export default function ServicesPage() {
  const secondary = SERVICES.filter((item) => item.kind === "secondary");
  return (
    <>
      <HeroPlain title="Services" dek={SERVICES_HUB.dek} crumbs={[{ name: "Services", path: "/services" }]} />

      <Section flush labelledBy="practices" className="pb-20 md:pb-28">
        <Container>
          <h2 id="practices" className="sr-only">
            Practices
          </h2>
          <Link
            href={serviceHref(FLAGSHIP.slug)}
            data-surface="dark"
            className="group relative flex min-h-[30rem] flex-col justify-end overflow-hidden bg-forest p-7 md:p-12"
          >
            <Image
              src={FLAGSHIP.photo.src}
              alt=""
              fill
              loading="eager"
              sizes="(min-width: 1280px) 1184px, 100vw"
              className="zoom object-cover opacity-45"
              style={{ objectPosition: "40% center" }}
            />
            <span className="relative block">
              <span className="h2 card-title block text-ivory">{FLAGSHIP.name}</span>
              <span className="lead mt-4 block max-w-[34rem] text-ivory">{FLAGSHIP.summary}</span>
              <span className="arrow-link mt-6">See the practice</span>
            </span>
          </Link>
          <ul className="mt-4 grid gap-4 md:grid-cols-12">
            {secondary.map((item, index) => (
              <li key={item.slug} className={index === 0 ? "md:col-span-7" : "md:col-span-5"}>
                <Link href={serviceHref(item.slug)} className="group flex h-full min-h-64 flex-col bg-stone p-7 md:p-10">
                  <span className="card-title block font-display text-[2.4rem] leading-none text-forest">{item.name}</span>
                  <span className="mt-4 block max-w-[28rem]">{item.summary}</span>
                  <span className="arrow-link mt-auto pt-6">See the practice</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <Link href="/industries" className="arrow-link min-h-11 items-center">
              Where these workflows apply
            </Link>
          </p>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
