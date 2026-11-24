"use client";

import { useEffect, useReducer, useSyncExternalStore } from "react";
import type { Workflow } from "@/content/workflows";
import { initialRun, runReducer } from "@/lib/run-machine";

function useMedia(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function useReducedMotion(): boolean {
  return useMedia("(prefers-reduced-motion: reduce)", false);
}

export function useDesktop(): boolean {
  return useMedia("(min-width: 1024px)", true);
}

/** Time the marker spends on an edge. Illustrative pacing, not a measured latency. */
export function travelMs(sampleMs: number, speed: number): number {
  return Math.min(900, Math.max(400, sampleMs)) / speed;
}

/**
 * Drives the pure reducer. Each timer is cleared on change and on unmount, and carries the run
 * token, so nothing continues in the background. No timer is ever set while a gate is waiting.
 */
export function useWorkflowRun(workflow: Workflow, speed: number) {
  const [state, dispatch] = useReducer(runReducer(workflow), undefined, initialRun);

  useEffect(() => {
    if (state.status !== "running" || state.mode !== "auto") return;
    const token = state.token;
    const next = workflow.nodes[state.index + 1];
    const timer = state.traveling
      ? window.setTimeout(
          () => dispatch({ type: "ARRIVE", token }),
          travelMs(next?.sampleMs ?? 500, speed),
        )
      : window.setTimeout(() => dispatch({ type: "FINISH_NODE", token }), 700 / speed);
    return () => window.clearTimeout(timer);
  }, [state, speed, workflow]);

  return [state, dispatch] as const;
}
