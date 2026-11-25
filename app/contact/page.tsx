import { InquiryForm } from "@/components/forms/InquiryForm";
import { HeroPlain } from "@/components/layout/Heroes";
import { Container, Section } from "@/components/layout/Section";
import { CONTACT } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { CTA_LABEL, INQUIRY_EMAIL, SITE_LOCALITY } from "@/lib/site";

export const metadata = pageMetadata({
  title: CTA_LABEL,
  description: CONTACT.metaDescription,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <HeroPlain title={CTA_LABEL} dek={CONTACT.dek} crumbs={[{ name: "Contact", path: "/contact" }]} />
      <Section flush labelledBy="form-heading" className="pb-20 md:pb-28">
        <Container className="grid gap-x-20 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="form-heading" className="sr-only">
              Inquiry form
            </h2>
            <InquiryForm />
            <p className="small mt-6 text-muted">{CONTACT.guidance}</p>
          </div>
          <aside className="lg:col-span-5" aria-labelledby="talk">
            <h2 id="talk" className="font-display text-[2rem] leading-none font-medium">
              What happens next
            </h2>
            <ol className="mt-6 space-y-4">
              {CONTACT.next.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span aria-hidden className="font-display text-[1.6rem] leading-none text-accent">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-10 font-semibold">Valentini &amp; Co.</p>
            <p>{SITE_LOCALITY}</p>
            <a href={`mailto:${INQUIRY_EMAIL}`} className="text-link inline-flex min-h-11 items-center">
              {INQUIRY_EMAIL}
            </a>
          </aside>
        </Container>
      </Section>
    </>
  );
}
