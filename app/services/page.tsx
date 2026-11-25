import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { Thumb } from "@/components/workflow/Thumb";
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
    <Section labelledBy="services-title">
      <Container>
        <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
        <h1 id="services-title" className="h1 mt-6 max-w-[12ch]">
          {FLAGSHIP.name}
        </h1>
        <p className="lead mt-4 max-w-[36rem] text-muted">{SERVICES_HUB.dek}</p>

        <Link
          href={serviceHref(FLAGSHIP.slug)}
          className="group mt-10 grid items-center gap-6 border-y border-line py-6 lg:grid-cols-12"
        >
          <span className="lg:col-span-8">
            <span className="card-title block h2">{FLAGSHIP.name}</span>
            <span className="mt-3 block max-w-[40rem] text-muted">{FLAGSHIP.summary}</span>
          </span>
          <span className="console hidden p-4 lg:col-span-4 lg:block" aria-hidden>
            <Thumb id="lead-triage" className="h-16 w-full" />
            <span className="mt-3 block text-[14px]">Lead triage, waiting at the gate</span>
          </span>
        </Link>

        <ul className="divide-y divide-line border-b border-line">
          {secondary.map((item) => (
            <li key={item.slug}>
              <Link href={serviceHref(item.slug)} className="block py-6">
                <span className="card-title block text-[1.5rem]">{item.name}</span>
                <span className="mt-2 block max-w-[40rem] text-muted">{item.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
