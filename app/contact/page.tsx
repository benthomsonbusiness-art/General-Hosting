import { InquiryForm } from "@/components/forms/InquiryForm";
import { HeroBlock } from "@/components/layout/Heroes";
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
      <HeroBlock title={CTA_LABEL} dek={CONTACT.dek} crumbs={[{ name: "Contact", path: "/contact" }]} />
      <Section labelledBy="form-heading">
        <Container className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="form-heading" className="sr-only">
              Inquiry form
            </h2>
            <p className="mb-8 max-w-[42rem] text-muted">{CONTACT.guidance}</p>
            <InquiryForm />
          </div>
          <aside className="lg:col-span-5" aria-labelledby="talk">
            <div className="bg-stone p-7 md:p-9">
              <h2 id="talk" className="h3">
                Talk to the firm
              </h2>
              <p className="mt-3 font-semibold">Valentini &amp; Co.</p>
              <p>{SITE_LOCALITY}</p>
              <a href={`mailto:${INQUIRY_EMAIL}`} className="text-link inline-flex min-h-11 items-center">
                {INQUIRY_EMAIL}
              </a>
              <h3 className="h4 mt-7 border-t border-rule pt-6">What happens next</h3>
              <ol className="mt-4 space-y-5">
                {CONTACT.next.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2rem_1fr]">
                    <span className="font-bold text-accent" aria-hidden>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-heading">{step.title}</p>
                      <p className="mt-0.5">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
