import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CTA } from "@/content/pages";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

/** The closing band every page ends on: warm optical glow, one heading, one primary button. */
export function ClosingCta({
  heading = CTA.headline,
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
    <section
      data-surface="dark"
      aria-labelledby={id}
      className="relative overflow-hidden border-t border-line bg-[radial-gradient(ellipse_70%_75%_at_18%_0%,rgb(249_115_22_/_0.14),transparent_68%),var(--forest)]"
    >
      <div className="wrap relative z-10 py-16 lg:py-24">
        <h2 id={id} className="h2 max-w-[18ch]">
          {heading}
        </h2>
        <Link href={href} className="btn btn-primary mt-8">
          <span>{label}</span>
          <ArrowRight aria-hidden size={17} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
