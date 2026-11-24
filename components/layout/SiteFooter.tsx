import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { BackToTop } from "@/components/nav/BackToTop";
import { FOOTER, LEGAL_LINKS } from "@/content/site-nav";
import { INQUIRY_EMAIL, SITE_LOCALITY } from "@/lib/site";

const link =
  "inline-flex min-h-11 items-center text-[15px] text-ivory/85 underline-offset-4 hover:text-ivory hover:underline";

export function SiteFooter() {
  return (
    <footer id="site-footer" tabIndex={-1} data-surface="dark" className="bg-obsidian outline-none">
      <div className="wrap pt-16 pb-8 md:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-x-16 gap-y-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Valentini & Co. home">
              <BrandMark className="h-12 w-12 shrink-0" />
              <BrandWordmark className="text-[15px]" />
            </Link>
            <p className="small mt-6 text-muted">{SITE_LOCALITY}</p>
            <a href={`mailto:${INQUIRY_EMAIL}`} className={link}>
              {INQUIRY_EMAIL}
            </a>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-14 sm:grid-flow-col sm:grid-rows-4">
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
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <p className="small text-muted">© 2026 Valentini &amp; Co.</p>
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
    </footer>
  );
}
