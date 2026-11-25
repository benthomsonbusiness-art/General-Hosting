import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { Section } from "./Section";

export function LegalFrame({
  title,
  path,
  lede,
  other,
  children,
}: {
  title: string;
  path: string;
  lede: string;
  other: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <Section>
      <article className="wrap max-w-[52rem]">
        <Breadcrumbs items={[{ name: title, path }]} className="mb-6" />
        <h1 className="h1">{title}</h1>
        <p className="lead mt-5 text-muted">{lede}</p>
        <p className="mt-8 border-l-2 border-forest bg-ivory px-6 py-4 font-medium">
          Placeholder. Counsel-approved text will replace this page before publication. Nothing on this page is in
          effect.
        </p>
        <div className="mt-10">{children}</div>
        <p className="mt-10 border-t border-rule pt-6">
          <Link href={other.href} className="text-link">
            {other.label}
          </Link>
        </p>
      </article>
    </Section>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule py-6">
      <h2 className="h3 mb-2">{heading}</h2>
      {children}
    </section>
  );
}
