import Link from "next/link";
import { CTA } from "@/content/pages";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

/** The closing band every page ends on: one heading, one primary button. */
export function ClosingCta({
  heading = CTA.headline[0],
  label = CTA_LABEL,
  href = CTA_HREF,
  id = "close",
}: {
  heading?: string;
  label?: string;
  href?: string;
  id?: string;
}) {
  return (
    <section data-surface="dark" aria-labelledby={id} className="border-t border-line bg-forest">
      <div className="wrap py-16 lg:py-24">
        <h2 id={id} className="h2 max-w-[18ch]">
          {heading}
        </h2>
        <Link href={href} className="btn btn-primary mt-8">
          {label}
        </Link>
      </div>
    </section>
  );
}
