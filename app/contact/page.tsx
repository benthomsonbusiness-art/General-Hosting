import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";
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
    <section className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
      <div
        data-surface="dark"
        className="relative overflow-hidden bg-obsidian px-6 pt-10 pb-10 text-ivory sm:px-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:px-12 lg:pt-16 lg:pb-8"
      >
        <Image
          src="/images/wf-lead.jpg"
          alt="Unsealed cream envelope resting on deep green baize in natural window light."
          fill
          loading="eager"
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover opacity-50"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/70 to-obsidian/95"
        />

        <div className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[12px] text-ivory/70">
            <Link href="/" className="hover:text-ivory">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ivory">Contact</span>
          </nav>

          <h1
            id="contact-title"
            className="font-display text-[clamp(2.4rem,1.8rem+2.8vw,4rem)] leading-[0.96] font-medium tracking-[-0.03em] text-ivory"
          >
            {CTA_LABEL}
          </h1>
          <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-relaxed text-ivory/85">{CONTACT.dek}</p>

          <div className="relative mt-8 hidden h-40 w-32 lg:block">
            <Image
              src="/images/cut-envelope.png"
              alt=""
              fill
              loading="eager"
              sizes="140px"
              className="object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.75)]"
            />
          </div>
        </div>
      </div>

      <div
        data-surface="light"
        className="flex flex-col justify-center bg-paper px-6 py-10 sm:px-10 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:px-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-[40rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">Direct note</p>
          <h2 id="form-heading" className="mt-2 font-display text-[2rem] leading-tight font-medium text-ink">
            Describe the workflow
          </h2>
          <div className="mt-7">
            <InquiryForm />
          </div>
          <p className="small mt-8 border-t border-ink/12 pt-5 text-slate">{CONTACT.guidance}</p>
        </div>
      </div>

      <aside
        data-surface="dark"
        aria-labelledby="talk"
        className="relative flex flex-col justify-end overflow-hidden bg-obsidian px-6 py-10 text-ivory sm:px-10 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:px-12 lg:pb-16"
      >
        <div className="relative z-10 border-t border-ivory/15 pt-8">
          <h2 id="talk" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ivory/70">
            What happens next
          </h2>
          <ol className="mt-5 space-y-4">
            {CONTACT.next.map((step, index) => (
              <li key={step} className="flex items-baseline gap-4 text-[15px] text-ivory/90">
                <span aria-hidden className="font-mono text-[12px] text-ivory/60">
                  0{index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-9 border-t border-ivory/15 pt-6 text-[14px] text-ivory/80">
            <p className="font-semibold text-ivory">Valentini &amp; Co.</p>
            <p className="mt-0.5">{SITE_LOCALITY}</p>
            <a
              href={`mailto:${INQUIRY_EMAIL}`}
              className="mt-2 inline-flex min-h-11 items-center font-mono text-[13px] text-ivory underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory"
            >
              {INQUIRY_EMAIL}
            </a>
          </div>
        </div>
      </aside>
    </section>
  );
}
