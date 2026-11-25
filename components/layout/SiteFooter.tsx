import Image from "next/image";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { BackToTop } from "@/components/nav/BackToTop";
import { MotionSwitch } from "@/components/util/MotionSwitch";
import { CTA } from "@/content/pages";
import { FOOTER, LEGAL_LINKS } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL, INQUIRY_EMAIL, SITE_LOCALITY } from "@/lib/site";

const link =
  "inline-flex min-h-11 items-center text-[15px] text-ivory/85 underline-offset-4 hover:text-ivory hover:underline";

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      tabIndex={-1}
      data-surface="dark"
      className="relative overflow-hidden bg-obsidian text-ivory outline-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-repeat opacity-40"
        style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
      />

      <div className="wrap relative pt-16 pb-10 md:pt-24">
        {/* Closing architectural statement instead of a generic CTA box */}
        <div className="grid items-end gap-10 border-b border-ivory/15 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-[12px] tracking-[0.14em] text-ivory/65 uppercase">Next step</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,4.4vw,4.4rem)] leading-[0.96] font-semibold tracking-[-0.032em] text-ivory">
              {CTA.headline.join(" ")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={CTA_HREF} className="btn btn-primary">
                {CTA_LABEL}
              </Link>
              <a href={`mailto:${INQUIRY_EMAIL}`} className="arrow-link min-h-11 items-center">
                Email the firm
              </a>
            </div>
          </div>

          <div className="hidden justify-end lg:col-span-4 lg:flex">
            <div className="relative w-44 rotate-6 translate-y-4">
              <Image
                src="/images/cut-notebook.png"
                alt=""
                width={960}
                height={1200}
                sizes="176px"
                className="paper-cutout h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Colophon, navigation, and site-wide motion control */}
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8 pt-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Valentini & Co. home">
              <BrandMark className="h-11 w-11 shrink-0" />
              <BrandWordmark className="text-[14px]" />
            </Link>
            <p className="small mt-4 text-muted">
              {SITE_LOCALITY} ·{" "}
              <a href={`mailto:${INQUIRY_EMAIL}`} className="underline underline-offset-4 hover:text-ivory">
                {INQUIRY_EMAIL}
              </a>
            </p>
          </div>

          <nav aria-label="Footer" className="max-w-[36rem]">
            <ul className="flex flex-wrap gap-x-8 gap-y-1">
              {FOOTER.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ivory/12 pt-6">
          <p className="small text-muted">© 2026 Valentini &amp; Co.</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <MotionSwitch tone="dark" />
            <ul className="flex flex-wrap items-center gap-x-7">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${link} small`}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <BackToTop className={`${link} small`} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
