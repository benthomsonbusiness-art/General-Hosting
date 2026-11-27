import { InquiryForm } from "@/components/forms/InquiryForm";
import { HardwareFrame } from "@/components/media/HardwareFrame";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { CONTACT } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { INQUIRY_EMAIL, SITE_LOCALITY } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: CONTACT.metaDescription,
  path: "/contact",
});

/** Set NEXT_PUBLIC_INQUIRY_LIVE=1 at build once a delivery channel (Resend or a webhook) is configured. */
const INQUIRY_LIVE = process.env.NEXT_PUBLIC_INQUIRY_LIVE === "1";

export default function ContactPage() {
  return (
    <section data-surface="dark" className="bg-obsidian">
      <div className="grid lg:grid-cols-12">
        <div className="px-5 py-10 sm:px-8 lg:col-span-5 lg:py-16 lg:pr-10 lg:pl-[max(1.25rem,calc((100vw-84rem)/2+1.25rem))]">
          <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
          <h1 id="contact-title" className="h1 mt-6">
            Tell us which process slows your week down.
          </h1>
          <p className="mt-4 text-muted">{CONTACT.dek}</p>
          <ul className="mt-8 space-y-3 text-[15px] text-muted">
            {CONTACT.next.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-muted">{SITE_LOCALITY}</p>
          <div className="mt-8 hidden lg:block">
            <HardwareFrame
              src="/images/key-hero.jpg"
              alt="A copper push key set into a dark machined panel."
              width={2400}
              height={1030}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
        <div data-surface="light" className="bg-ivory px-5 py-10 text-ink sm:px-8 lg:col-span-7 lg:px-16 lg:py-16">
          <h2 className="h3">Tell us what&apos;s going wrong</h2>
          {INQUIRY_LIVE ? null : (
            <div className="mt-4 max-w-[40rem] rounded-[8px] border border-[rgb(20_12_8_/_0.16)] bg-[#f3ece2] p-4">
              <p className="text-[15px] font-medium text-error">{CONTACT.offline}</p>
              <p className="mt-1.5 text-[15px] text-slate">
                Write directly to{" "}
                <a href={`mailto:${INQUIRY_EMAIL}?subject=Booking%20audit%20request`} className="font-semibold text-ink underline underline-offset-4">
                  {INQUIRY_EMAIL}
                </a>{" "}
                and Ben will reply personally.
              </p>
            </div>
          )}
          <div className="mt-6 max-w-[40rem]">
            <InquiryForm />
          </div>
          <p className="small mt-8 text-slate">{CONTACT.guidance}</p>
        </div>
      </div>
    </section>
  );
}
