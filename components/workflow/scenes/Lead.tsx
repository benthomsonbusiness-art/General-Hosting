"use client";

import { Draft, Fill, finished, Gauge, Label, Mark, Paper, reached, Stamp, type SceneProps } from "../scene-parts";

/** A message becomes a record, then a reply. */
export function LeadScene({ state, scenario, draft, onDraft }: SceneProps) {
  const clear = scenario.id === "clear";
  const scored = reached(state, 2);
  return (
    <div className="grid h-full gap-4 md:grid-cols-12">
      <Paper className="relative flex flex-col justify-center md:col-span-7">
        {reached(state, 4) ? (
          <Draft state={state} draft={draft} onDraft={onDraft} label="Reply draft. Edit it if you like." />
        ) : (
          <div>
            <Label>From {clear ? "A. Rivera, Harborline Supply" : "J. Park"}</Label>
            <p className="mt-3 font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.3rem)] leading-[1.22] text-forest">
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
          </div>
        )}
        <Stamp on={finished(state)}>Sent</Stamp>
      </Paper>
      <Paper tone="stone" className="md:col-span-5">
        <p className="mb-2 font-semibold text-forest">Lead record</p>
        <Fill label="Company" value={clear ? "Harborline" : "Not found"} on={reached(state, 1)} />
        <Fill label="Domain" value={clear ? "Verified" : "Personal"} on={reached(state, 1)} delay={150} />
        <Fill label="Fit" value={clear ? "Strong" : "Unclear"} on={scored} />
        <Fill label="CRM" value="Updated" on={reached(state, 3)} />
        <Fill label="Approved by" value="You" on={reached(state, 5)} />
        <div className="mt-3">
          <Gauge value={scenario.confidence} on={scored} />
        </div>
      </Paper>
    </div>
  );
}
