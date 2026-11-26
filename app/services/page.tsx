import { IconCards } from "@/components/graphics/Graphics";
import { ServiceCards } from "@/components/graphics/ServiceCards";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HelpCta } from "@/components/layout/HelpCta";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { SERVICES_HUB } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: SERVICES_HUB.metaDescription,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section labelledBy="services-title">
        <Container>
          <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
          <h1 id="services-title" className="h1 mt-6 max-w-[12ch]">
            Services
          </h1>
          <HelpCta />

          <div className="mt-12">
            <ServiceCards />
          </div>

          <div className="mt-6">
            <IconCards
              columns={2}
              items={[
                { title: "By industry", body: "What we automate in six kinds of company.", href: "/industries" },
                { title: "How it works", body: "Four steps, from first map to handover.", href: "/how-it-works" },
              ]}
            />
          </div>
        </Container>
      </Section>
      <ClosingCta />
    </>
  );
}
