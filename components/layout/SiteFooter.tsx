import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { BackToTop } from "@/components/nav/BackToTop";
import { FOOTER, LEGAL_LINKS, POSITIONING } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL, INQUIRY_EMAIL, SITE_LOCALITY } from "@/lib/site";

const link =
  "inline-flex min-h-9 items-center text-[15px] text-ivory/85 underline-offset-4 hover:text-ivory hover:underline";

export function SiteFooter() {
  return (
    <footer id="site-footer" tabIndex={-1} data-surface="dark" className="bg-obsidian outline-none">
      <div className="wrap pt-16 pb-8 md:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-8 border-b border-rule pb-10">
          <Link href="/" className="inline-flex items-center gap-4" aria-label="Valentini & Co. home">
            <BrandMark className="h-12 w-12 shrink-0" />
            <BrandWordmark className="text-[15px]" />
          </Link>
          <div className="max-w-[26rem]">
            <p>{POSITIONING}</p>
            <p className="small mt-2 text-muted">{SITE_LOCALITY}</p>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-[15px] font-bold text-gold">{column.heading}</p>
              <ul className="mt-3">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3 border-y border-rule py-5">
          <a href={`mailto:${INQUIRY_EMAIL}`} className={`${link} min-h-11`}>
            {INQUIRY_EMAIL}
          </a>
          <Link href={CTA_HREF} className="arrow-link min-h-11 items-center">
            {CTA_LABEL}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pt-6">
          <p className="small text-muted">© 2026 Valentini &amp; Co.</p>
          <ul className="flex flex-wrap items-center gap-x-7">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`${link} small min-h-11`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <BackToTop className={`${link} small min-h-11`} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
