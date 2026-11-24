import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/BrandMark";
import { NAV_PRACTICES } from "@/lib/practices";

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#0B1F16] text-[#F7F4EC]">
      <div className="mx-auto max-w-[90rem] border-t border-[rgba(197,168,105,0.25)] px-6 py-14 md:px-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Valentini and Company, home">
              <BrandMark className="h-11 w-11 shrink-0" title="Valentini & Co." />
              <BrandWordmark className="text-[13px]" />
            </Link>
            <a
              href="mailto:inquiries@valentiniandco.com"
              className="mt-8 block font-mono text-[12px] tracking-[0.06em] text-[#F7F4EC]/80"
            >
              inquiries@valentiniandco.com
            </a>
          </div>
          <nav className="md:col-span-4" aria-label="Practices">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#C5A869] uppercase">Practices</p>
            <ul className="mt-4 space-y-3">
              {NAV_PRACTICES.map((practice) => (
                <li key={practice.id}>
                  <Link href={practice.href} className="text-[14px] text-[#F7F4EC]/85 hover:text-[#F7F4EC]">
                    {practice.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="md:col-span-3" aria-label="Legal">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#C5A869] uppercase">Legal</p>
            <ul className="mt-4 space-y-3">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#F7F4EC]/85 hover:text-[#F7F4EC]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-14 font-mono text-[11px] tracking-[0.12em] text-[#F7F4EC]/45">
          © 2026 Valentini &amp; Co.
        </p>
      </div>
    </footer>
  );
}
