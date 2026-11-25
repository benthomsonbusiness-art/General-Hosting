import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HelpCta } from "@/components/layout/HelpCta";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { SERVICES_HUB } from "@/content/pages";
import { FLAGSHIP, SERVICES, serviceHref } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: SERVICES_HUB.metaDescription,
  path: "/services",
});

/** Rows after the services: the same work seen by industry, and how a project goes. */
const MORE = [
  {
    href: "/industries",
    title: "By industry",
  },
  {
    href: "/approach",
    title: "How we work",
  },
];

export default function ServicesPage() {
  const secondary = SERVICES.filter((item) => item.kind === "secondary");

  return (
    <>
      <Section labelledBy="services-title">
        <Container>
          <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
          <h1 id="services-title" className="h1 mt-6 max-w-[12ch]">
            Services
          </h1>
          <p className="lead mt-4 max-w-[36rem] text-muted">{SERVICES_HUB.dek}</p>
          <HelpCta />

          <Link
            href={serviceHref(FLAGSHIP.slug)}
            className="group mt-10 flex items-center justify-between gap-6 border-y border-line py-6"
          >
            <span className="card-title block h2">{FLAGSHIP.name}</span>
            <ArrowRight
              aria-hidden
              className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1"
              size={20}
              strokeWidth={1.5}
            />
          </Link>

          <ul className="divide-y divide-line border-b border-line">
            {secondary.map((item) => (
              <li key={item.slug}>
                <Link href={serviceHref(item.slug)} className="group flex items-center justify-between gap-6 py-6">
                  <span className="card-title block h4">{item.name}</span>
                  <ArrowRight
                    aria-hidden
                    className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1"
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
            {MORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-center justify-between gap-6 py-6">
                  <span className="card-title block h4">{item.title}</span>
                  <ArrowRight
                    aria-hidden
                    className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1"
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <ClosingCta />
    </>
  );
}
