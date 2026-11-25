import Link from "next/link";
import { CTA } from "@/content/pages";
import { CTA_HREF, CTA_LABEL, INQUIRY_EMAIL } from "@/lib/site";
import { Section } from "./Section";

export function CtaBand({
  headline = CTA.headline,
  label = CTA_LABEL,
  href = CTA_HREF,
}: {
  headline?: string[];
  label?: string;
  href?: string;
}) {
  return (
    <Section surface="forest" labelledBy="cta-heading" className="relative overflow-hidden">
      <span
        aria-hidden
        className="absolute inset-y-0 right-[8%] hidden w-px rotate-[22deg] scale-y-150 bg-gold/60 lg:block"
      />
      <div className="wrap relative">
        <h2 id="cta-heading" className="h2">
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={href} className="btn btn-primary">
            {label}
          </Link>
          <a href={`mailto:${INQUIRY_EMAIL}`} className="arrow-link min-h-11 items-center">
            Email the firm
          </a>
        </div>
      </div>
    </Section>
  );
}
