import Link from "next/link";
import { BrandEmblem, BrandWordmark } from "@/components/BrandMark";

const anchors = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#approach", label: "Approach" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#inquire", label: "Inquire" },
];

const pages = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-emerald text-on-dark-body">
      <div className="border-t border-hairline-dark">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14 md:flex-row md:items-start md:justify-between md:px-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-4">
              <BrandEmblem className="h-11 w-11 shrink-0" title="Valentini & Co." />
              <BrandWordmark />
            </div>
            <p className="mt-6 text-[14px] leading-[1.7] text-on-dark-muted">
              <a
                className="text-on-dark-body"
                href="mailto:inquiries@valentiniandco.com"
              >
                inquiries@valentiniandco.com
              </a>
              <span className="mt-1 block">New Jersey · Advising Studios Nationwide</span>
            </p>
          </div>
          <nav aria-label="Footer" className="flex max-w-md flex-wrap gap-x-6 gap-y-3">
            {anchors.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.18em] text-on-dark uppercase"
              >
                {link.label}
              </a>
            ))}
            {pages.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.18em] text-on-dark uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-6 pb-10 text-[13px] text-on-dark-muted md:px-10">
          © 2026 Valentini & Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
