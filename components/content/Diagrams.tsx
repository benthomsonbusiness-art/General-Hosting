import { ENGAGEMENTS } from "@/content/engagements";
import { HOME } from "@/content/pages";

/** Code, model, person, record: one line, cut where the person stands. */
export function PathDiagram() {
  const steps = HOME.how.steps;
  return (
    <ol className="grid gap-y-10 md:grid-cols-4">
      {steps.map((step, index) => {
        const person = step.title === "Person";
        return (
          <li key={step.title} className="relative md:pr-8">
            <div aria-hidden className="relative mb-6 hidden h-16 md:block">
              <span className={`absolute top-1/2 left-0 h-px ${index === 3 ? "w-12" : "w-full"} bg-ivory/35`} />
              {person ? (
                <span className="absolute top-0 left-5 h-6 w-8 rounded-[6px] bg-gold shadow-[inset_0_1px_0_rgb(247_244_236_/_0.55)]" />
              ) : (
                <span className="absolute top-1/2 left-0 h-3 w-3 -translate-y-1/2 border border-ivory/70 bg-forest" />
              )}
            </div>
            <h3 className="font-display text-[2.1rem] leading-none font-medium">{step.title}</h3>
            <p className="mt-3 max-w-[16rem] text-muted">{step.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

/** The three engagement stages as widths, without decorative slants. */
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
          data-surface={index === 0 ? "light" : "dark"}
          className={`${widths[index]} ${surfaces[index]} flex flex-col justify-between px-7 py-8 lg:px-10 lg:py-11`}
        >
          <div>
            <p className={`text-[15px] ${index === 0 ? "text-slate" : "text-ivory/70"}`}>
              {index + 1}. {stage.shape}
            </p>
            <h3 className="mt-3 font-display text-[2.1rem] leading-none font-medium">{stage.name}</h3>
            <p className={`mt-4 ${index === 0 ? "text-ink" : "text-ivory/90"}`}>{stage.delivers}</p>
          </div>
          <p className={`mt-6 border-t pt-4 text-[15px] ${index === 0 ? "border-ink/12 text-slate" : "border-ivory/15 text-ivory/75"}`}>
            {stage.pricing}
          </p>
        </li>
      ))}
    </ol>
  );
}
