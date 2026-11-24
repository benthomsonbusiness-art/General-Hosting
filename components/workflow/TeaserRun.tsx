"use client";

import { useEffect, useState } from "react";
import { MotionRoot } from "@/components/util/MotionRoot";
import type { Workflow } from "@/content/workflows";
import { GraphCanvas } from "./GraphCanvas";
import { useReducedMotion, useWorkflowRun } from "./hooks";

/** Plays up to the approval gate, then waits. It does not take focus from the reader. */
export default function TeaserRun({ workflow }: { workflow: Workflow }) {
  const reduced = useReducedMotion();
  const [state, dispatch] = useWorkflowRun(workflow, 1);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => dispatch({ type: "START", mode: "auto" }), 500);
    return () => window.clearTimeout(timer);
  }, [reduced, dispatch]);

  const awaiting = state.status === "awaiting";
  const current = state.index >= 0 ? workflow.nodes[state.index] : workflow.nodes[0];
  const shown = workflow.nodes.find((node) => node.id === picked) ?? current;
  // The teaser shows the main path only. Side branches live on the full page.
  const main: Workflow = { ...workflow, edges: workflow.edges.filter((edge) => !edge.to.startsWith("exit-")) };
  const button = "btn min-h-11 px-4 py-2 text-[14px]";

  return (
    <MotionRoot>
      <GraphCanvas
        workflow={main}
        state={state}
        selectedId={shown.id}
        onSelect={setPicked}
        speed={1}
        reduced={reduced}
      />
      <div className="mt-6 flex min-h-32 flex-wrap items-start justify-between gap-x-10 gap-y-4 border-t border-rule pt-5">
        <div className="max-w-[40rem] flex-1 basis-72">
          <p className="font-semibold">{shown.label}</p>
          <p className="mt-1 text-[15px] leading-6 text-muted">
            {shown.does} {shown.guardrail}
          </p>
          <p role="status" className="sr-only">
            {awaiting || state.status === "completed" || state.status === "rejected" ? state.message : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {awaiting ? (
            <>
              <button
                type="button"
                className={`${button} btn-primary`}
                onClick={() => {
                  setPicked(null);
                  dispatch({ type: "APPROVE" });
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className={`${button} btn-secondary`}
                onClick={() => {
                  setPicked(null);
                  dispatch({ type: "REJECT" });
                }}
              >
                Reject
              </button>
            </>
          ) : state.status === "running" ? null : (
            <button
              type="button"
              className={`${button} btn-secondary`}
              onClick={() => {
                setPicked(null);
                dispatch(reduced ? { type: "STEP" } : { type: "START", mode: "auto" });
              }}
            >
              {state.status === "ready" ? "Run simulation" : "Run again"}
            </button>
          )}
          {reduced && state.status === "running" ? (
            <button type="button" className={`${button} btn-secondary`} onClick={() => dispatch({ type: "STEP" })}>
              Next step
            </button>
          ) : null}
        </div>
      </div>
    </MotionRoot>
  );
}
