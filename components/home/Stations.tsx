"use client";

import { HardwareFrame } from "@/components/media/HardwareFrame";
import { useMotion } from "@/components/workflow/hooks";
import { HOME } from "@/content/pages";

const SHOTS: Record<string, { src: string; alt: string }> = {
  Code: {
    src: "/images/station-code.jpg",
    alt: "Eight identical toggles in a forest-green panel, all in the same position.",
  },
  Model: {
    src: "/images/station-model.jpg",
    alt: "A dark green rotary dial with fine tick marks and a knurled edge.",
  },
  Record: {
    src: "/images/station-record.jpg",
    alt: "Thin green and near-black metal plates stacked edge-on, one plate offset.",
  },
};

/** Four stations on one line. The packet moves only when motion is on, and stops at the person. */
export function Stations() {
  const [motion] = useMotion();
  const steps = HOME.how.steps;

  return (
    <div data-motion={motion ? "on" : "off"}>
      <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        <span aria-hidden className="absolute top-3 right-[12%] left-[12%] hidden h-px bg-line sm:block" />
        <span aria-hidden className="packet absolute top-3 hidden h-2 w-2 -translate-x-1/2 bg-ivory sm:block" />
        {steps.map((step, index) => {
          const person = step.title === "Person";
          return (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className={`mb-4 grid h-6 w-8 place-items-center ${
                  person ? "rounded-[3px] bg-gold shadow-[inset_0_1px_0_rgb(247_244_236_/_0.55)]" : "border border-line"
                }`}
              />
              <h3 className="h3">
                {index + 1} {step.title}
              </h3>
              <p className="mt-2 text-[15px] text-muted">{step.body}</p>
              {SHOTS[step.title] ? (
                <HardwareFrame
                  src={SHOTS[step.title].src}
                  alt={SHOTS[step.title].alt}
                  width={1600}
                  height={1200}
                  sizes="(min-width: 640px) 18vw, 40vw"
                  className="mt-4"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
