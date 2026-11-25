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
                <span className="absolute top-0 left-5 h-16 w-0.5 rotate-[22deg] bg-gold" />
              ) : (
                <span className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ivory/70 bg-forest" />
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

/** The three engagement stages as widths, not a table. */
export function StageDiagram() {
  const widths = ["lg:col-span-3", "lg:col-span-5", "lg:col-span-4"];
  return (
    <ol className="grid gap-3 lg:grid-cols-12">
      {ENGAGEMENTS.stages.map((stage, index) => (
        <li
          key={stage.id}
          data-surface={index === 1 ? "dark" : "light"}
          className={`${widths[index]} ${index === 1 ? "bg-forest" : "bg-stone"} px-7 py-9 lg:px-12 lg:py-12 lg:[clip-path:polygon(2.5rem_0,100%_0,calc(100%-2.5rem)_100%,0_100%)]`}
        >
          <h3 className="font-display text-[2rem] leading-none font-medium">{stage.name}</h3>
          <p className="mt-3 text-[15px] font-semibold text-accent">{stage.shape}</p>
          <p className="mt-4">{stage.delivers}</p>
          <p className="small mt-4 text-muted">{stage.pricing}</p>
        </li>
      ))}
    </ol>
  );
}
