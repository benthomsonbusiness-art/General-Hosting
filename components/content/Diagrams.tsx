import Link from "next/link";
import { ENGAGEMENTS } from "@/content/engagements";
import { CTA_HREF } from "@/lib/site";

/**
 * The three engagement stages as widths, without decorative slants. Each stage carries its id
 * so links such as /services/ai-workflow-automation#workflow-audit land on it.
 */
export function StageDiagram() {
  const widths = ["lg:col-span-3", "lg:col-span-5", "lg:col-span-4"];
  const surfaces = [
    "bg-ivory border border-ink/15",
    "bg-forest text-ivory",
    "bg-obsidian text-ivory",
  ];
  return (
    <ol className="grid gap-4 lg:grid-cols-12">
      {ENGAGEMENTS.stages.map((stage, index) => (
        <li
          key={stage.id}
          id={stage.id}
          tabIndex={-1}
          data-surface={index === 0 ? "light" : "dark"}
          className={`${widths[index]} ${surfaces[index]} flex scroll-mt-28 flex-col justify-between px-7 py-8 outline-none lg:px-10 lg:py-11`}
        >
          <div>
            <p className="text-[15px] text-muted">
              {index + 1}. {stage.shape}
            </p>
            <h3 className="h4 mt-3">{stage.name}</h3>
            <p className="mt-4">{stage.delivers}</p>
          </div>
          <p className={`mt-6 border-t pt-4 text-[15px] text-muted ${index === 0 ? "border-ink/12" : "border-ivory/15"}`}>
            {stage.id === "workflow-audit" ? (
              <Link href={CTA_HREF} className="text-link inline-flex min-h-11 items-center text-body underline decoration-1 underline-offset-4">
                {stage.pricing}
              </Link>
            ) : (
              stage.pricing
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}
