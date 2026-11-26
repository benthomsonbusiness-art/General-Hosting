import Link from "next/link";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

/** A request button placed high on a page, so nobody has to scroll to the closing band to ask for help. */
export function HelpCta({ className = "mt-8" }: { className?: string }) {
  return (
    <div className={className}>
      <Link href={CTA_HREF} className="btn btn-primary">
        {CTA_LABEL}
      </Link>
    </div>
  );
}
