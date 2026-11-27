import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { BackToTop } from "@/components/nav/BackToTop";
import { FOOTER, LEGAL_LINKS, TRADEMARK_NOTE } from "@/content/site-nav";
import { SITE_LOCALITY } from "@/lib/site";

const link = "inline-flex min-h-11 items-center text-[15px] underline-offset-4 hover:underline";

export function SiteFooter() {
  return (
    <footer id="site-footer" tabIndex={-1} data-surface="dark" className="border-t border-line bg-obsidian outline-none">
      <div className="wrap py-12">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3" aria-label="Temporant home">
            <BrandMark className="h-10 w-10 shrink-0" />
            <BrandWordmark className="text-[13px]" />
          </Link>
          <nav aria-label="Footer">
            <ul className="flex max-w-[40rem] flex-wrap gap-x-6">
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
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-6">
          <div>
            <p className="small text-muted">© 2026 Temporant</p>
            <p className="small text-muted">{SITE_LOCALITY}</p>
            <p className="small mt-2 max-w-[44rem] text-muted">{TRADEMARK_NOTE}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6">
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
