import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const hairline = "border-[rgba(19,50,36,0.14)]";

export function LegalFrame({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="top" data-surface="light" className="flex-1 bg-[#F7F4EC] pt-28 text-[#1A1E1B]">
        <article className="mx-auto w-full max-w-[42rem] px-6 pt-8 pb-24">
          <p className="font-mono text-[12px] tracking-[0.16em] text-gold-ink uppercase">{kicker}</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,4.5rem)] leading-[0.96] font-medium tracking-[-0.02em] text-[#133224]">
            {title}
          </h1>
          <p className="mt-6 text-[1.05rem] leading-7 text-[#4F5752]">{lede}</p>
          <p className="mt-8 border-l border-[#C5A869] pl-4 font-mono text-[12px] leading-6 text-[#4F5752]">
            Placeholder. Counsel-approved text will replace this page before publication. Nothing
            on this page is in effect.
          </p>
          <div className="mt-12">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className={`border-t py-6 ${hairline}`}>
      <h2 className="mb-2 font-display text-[1.7rem] leading-tight font-medium text-[#133224]">
        {heading}
      </h2>
      <div className="text-[0.98rem] leading-7 text-[#1A1E1B]">{children}</div>
    </section>
  );
}

export function LegalLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav
      aria-label="Related"
      className={`mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6 font-mono text-[11px] tracking-[0.16em] uppercase ${hairline}`}
    >
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="border-b border-[#C5A869] pb-0.5">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
