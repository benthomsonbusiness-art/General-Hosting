import Link from "next/link";
import { CTA } from "@/content/pages";
import { CTA_HREF, CTA_LABEL, INQUIRY_EMAIL } from "@/lib/site";
import { Section } from "./Section";

export function CtaBand({
  headline = CTA.headline,
  body = CTA.body,
  label = CTA_LABEL,
  href = CTA_HREF,
}: {
  headline?: string[];
  body?: string;
  label?: string;
  href?: string;
}) {
  return (
    <Section surface="forest" labelledBy="cta-heading">
      <div className="wrap grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="cta-heading" className="h2">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-muted">{body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link href={href} className="btn btn-primary">
              {label}
            </Link>
            <a href={`mailto:${INQUIRY_EMAIL}`} className="arrow-link min-h-11 items-center">
              Email the firm
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
