import Link from "next/link";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const hairline = "border-[rgba(197,168,105,0.35)]";

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
    <div
      className={`${sans.className} flex flex-1 flex-col bg-[#F7F4EC] text-[#133224]`}
    >
      <header className={`border-b bg-[#133224] text-[#F7F4EC] ${hairline}`}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-6">
          <Link
            href="/"
            className={`${display.className} text-[0.8rem] font-medium tracking-[0.28em] text-[#F7F4EC] outline-offset-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[rgba(197,168,105,0.95)]`}
          >
            VALENTINI & CO.
          </Link>
          <Link
            href="/"
            className={`border-b pb-0.5 text-[0.68rem] tracking-[0.18em] text-[#F7F4EC] uppercase outline-offset-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[rgba(197,168,105,0.95)] ${hairline}`}
          >
            Back
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[40rem] flex-1 px-6 pt-20 pb-24">
        <p className="mb-4 text-[0.72rem] tracking-[0.22em] uppercase">
          {kicker}
        </p>
        <h1
          className={`${display.className} mb-6 text-[clamp(3rem,7vw,4.25rem)] leading-[0.95] font-normal tracking-[-0.02em]`}
        >
          {title}
        </h1>
        <p className="mb-8 text-[1.05rem] leading-7">{lede}</p>
        <p
          className={`mb-12 rounded-[2px] border bg-[#133224] px-4 py-3.5 text-sm leading-6 text-[#F7F4EC] ${hairline}`}
        >
          Placeholder. Counsel-approved text will replace this page before
          publication. Nothing on this page is in effect.
        </p>
        <div className="flex flex-col">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className={`border-t py-6 ${hairline}`}>
      <h2
        className={`${display.className} mb-2 text-[1.75rem] leading-tight font-medium`}
      >
        {heading}
      </h2>
      <div className="text-[0.98rem] leading-7">{children}</div>
    </section>
  );
}

export function LegalLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Related"
      className={`mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6 text-[0.68rem] tracking-[0.18em] uppercase ${hairline}`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`border-b pb-0.5 outline-offset-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[rgba(197,168,105,0.95)] ${hairline}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
