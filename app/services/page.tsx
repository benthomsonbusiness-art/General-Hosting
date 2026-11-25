import Link from "next/link";
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
    line: "Where the hours go in six kinds of company, and what stays with your team.",
  },
  {
    href: "/approach",
    title: "How we work",
    line: "From the first map of your process to handing you the code.",
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

          <Link href={serviceHref(FLAGSHIP.slug)} className="group mt-10 block border-y border-line py-6">
            <span className="card-title block h2">{FLAGSHIP.name}</span>
            <span className="mt-3 block max-w-[40rem] text-muted">{FLAGSHIP.summary}</span>
          </Link>

          <ul className="divide-y divide-line border-b border-line">
            {secondary.map((item) => (
              <li key={item.slug}>
                <Link href={serviceHref(item.slug)} className="group block py-6">
                  <span className="card-title block h4">{item.name}</span>
                  <span className="mt-2 block max-w-[40rem] text-muted">{item.summary}</span>
                </Link>
              </li>
            ))}
            {MORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block py-6">
                  <span className="card-title block h4">{item.title}</span>
                  <span className="mt-2 block max-w-[40rem] text-muted">{item.line}</span>
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
