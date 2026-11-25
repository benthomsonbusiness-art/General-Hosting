"use client";

import { Confidence, Draft, Fact, From, Mark, reached, Rise, type SceneProps } from "../scene-parts";

/** A message arrives, its sender is looked up, and a reply opens under it. */
export function LeadScene({ state, scenario, draft, onDraft }: SceneProps) {
  const clear = scenario.id === "clear";
  const scored = reached(state, 2);
  return (
    <div>
      <From
        name={clear ? "A. Rivera" : "J. Park"}
        meta={clear ? "Harborline Supply (sample)" : "Personal address (sample)"}
      />
      <p className="mt-3 font-display text-[1.45rem] leading-[1.25] text-forest sm:text-[1.65rem]">
        {clear ? (
          <>
            Our <Mark on={scored}>quoting still runs through one inbox</Mark>. Twelve people, and we{" "}
            <Mark on={scored}>need it working by spring</Mark>.
          </>
        ) : (
          <>
            Hi, <Mark on={scored}>curious what you do</Mark>. Maybe we could talk sometime?
          </>
        )}
      </p>
      <div className="mt-4 flex min-h-9 flex-wrap gap-2">
        <Fact on={reached(state, 1)}>{clear ? "Company found" : "No company found"}</Fact>
        <Fact on={scored} tone={clear ? "stone" : "gold"}>
          {clear ? "Strong fit" : "Fit unclear"}
        </Fact>
        <Fact on={reached(state, 3)}>CRM updated</Fact>
        <Confidence value={scenario.confidence} on={scored} />
      </div>
      <Rise on={reached(state, 4)} className="mt-4 min-h-[9.6rem] sm:min-h-[7.6rem]">
        <Draft
          state={state}
          draft={draft}
          onDraft={onDraft}
          label="Reply draft. Edit it if you like."
          sent="Sent by you (sample)"
        />
      </Rise>
    </div>
  );
}
