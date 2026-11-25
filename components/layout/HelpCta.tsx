import Link from "next/link";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

/** A request button placed high on a page, so nobody has to scroll to the closing band to ask for help. */
export function HelpCta({
  line = "Not sure where to start? We map one process with you first.",
  className = "mt-8",
}: {
  line?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      <Link href={CTA_HREF} className="btn btn-primary">
        {CTA_LABEL}
      </Link>
      {line ? <span className="text-muted">{line}</span> : null}
    </div>
  );
}
