"use client";

import { useEffect, useReducer, useSyncExternalStore } from "react";
import type { Workflow } from "@/content/workflows";
import { initialRun, runReducer } from "@/lib/run-machine";

const KEY = "valentini-motion";
const CHANGED = "valentini-motion-change";

function readMotion(): boolean {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "on") return true;
    if (saved === "off") return false;
  } catch {
    // Storage can be blocked. The system setting still applies.
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  window.addEventListener(CHANGED, notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener(CHANGED, notify);
  };
}

/** Follows the system setting until the visitor uses the switch. */
export function useMotion(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, readMotion, () => false);
  return [
    on,
    (next) => {
      try {
        window.localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        return;
      }
      window.dispatchEvent(new Event(CHANGED));
    },
  ];
}

export const TRAVEL_MS = 700;
const WORK_MS = 1150;

/**
 * Drives the pure reducer. Each timer is cleared on change and on unmount, and carries the run
 * token, so nothing continues in the background. No timer is ever set while a gate is waiting.
 */
export function useWorkflowRun(workflow: Workflow) {
  const [state, dispatch] = useReducer(runReducer(workflow), undefined, initialRun);

  useEffect(() => {
    if (state.status !== "running" || state.mode !== "auto") return;
    const token = state.token;
    const timer = state.traveling
      ? window.setTimeout(() => dispatch({ type: "ARRIVE", token }), TRAVEL_MS)
      : window.setTimeout(() => dispatch({ type: "FINISH_NODE", token }), WORK_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  return [state, dispatch] as const;
}
