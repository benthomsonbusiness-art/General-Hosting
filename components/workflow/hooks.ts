"use client";

import { useEffect, useLayoutEffect, useReducer, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { SCENARIOS, stopsFor } from "@/content/scenarios";
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

const TRAVEL_MS = 250;
const WORK_MS = 1650;
/** How long one step holds the stage. The progress bar fills over the same time. */
export const STEP_MS = TRAVEL_MS + WORK_MS;

/**
 * Drives the pure reducer. Each timer is cleared on change, on pause and on unmount, and carries
 * the run token, so nothing continues in the background. No timer is ever set while a gate waits.
 */
export function useWorkflowRun(workflow: Workflow, paused: boolean) {
  const [state, dispatch] = useReducer(runReducer(workflow), undefined, initialRun);

  useEffect(() => {
    if (paused || state.status !== "running" || state.mode !== "auto") return;
    const token = state.token;
    const timer = state.traveling
      ? window.setTimeout(() => dispatch({ type: "ARRIVE", token }), TRAVEL_MS)
      : window.setTimeout(() => dispatch({ type: "FINISH_NODE", token }), WORK_MS);
    return () => window.clearTimeout(timer);
  }, [state, paused]);

  return [state, dispatch] as const;
}

function gateAt(workflow: Workflow): number {
  return workflow.nodes.find((node) => node.confidence)?.confidence?.threshold ?? 0.8;
}

type PlayerOptions = {
  /** Home only. Starts the run when the stage is in view and motion is on. */
  autoplay?: boolean;
  /** Home only. With motion off, open already waiting at the approval gate. */
  openAtGate?: boolean;
};

/** Everything one stage needs: the run, the sample input, the draft, and playback. */
export function usePlayer(
  workflow: Workflow,
  rootRef: RefObject<HTMLDivElement | null>,
  options: PlayerOptions = {},
) {
  const scenarios = SCENARIOS[workflow.id];
  const [motion, setMotion] = useMotion();
  const [paused, setPaused] = useState(false);
  const [state, dispatch] = useWorkflowRun(workflow, paused);
  const [choice, setChoice] = useState(0);
  const [threshold, setThreshold] = useState(() => gateAt(workflow));
  const [draft, setDraft] = useState(scenarios[0].draft ?? "");
  /** True once the visitor acts on this run. A run that started itself never moves focus. */
  const acted = useRef(false);
  const scenario = scenarios[choice];
  const awaiting = state.status === "awaiting";

  const autoplay = options.autoplay ?? false;
  const openAtGate = options.openAtGate ?? false;

  // Home only. Other stages stay put until the visitor steps them.
  useEffect(() => {
    const root = rootRef.current;
    if (!autoplay || !motion || !root) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => dispatch({ type: "START", mode: "auto" }), 900);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [autoplay, motion, workflow, dispatch, rootRef]);

  // Motion off on the home console: land on the gate before paint, without moving focus.
  useLayoutEffect(() => {
    if (!openAtGate || motion || state.status !== "ready") return;
    const stops = stopsFor(workflow.nodes, scenarios[choice], threshold);
    const reduce = runReducer(workflow);
    let sim = reduce(initialRun(), { type: "SET_STOPS", ids: stops });
    sim = reduce(sim, { type: "START", mode: "step" });
    dispatch({ type: "SET_STOPS", ids: stops });
    dispatch({ type: "START", mode: "step" });
    let guard = 0;
    while (sim.status === "running" && !sim.traveling && guard < 24) {
      dispatch({ type: "STEP" });
      sim = reduce(sim, { type: "STEP" });
      guard += 1;
    }
  }, [openAtGate, motion, state.status, workflow, scenarios, choice, threshold, dispatch]);

  useEffect(() => {
    if (!awaiting || !acted.current) return;
    const active = document.activeElement;
    if (active && active !== document.body && !rootRef.current?.contains(active)) return;
    rootRef.current?.querySelector<HTMLElement>("[data-approve]")?.focus({ preventScroll: true });
  }, [awaiting, state.index, rootRef]);

  function setStops(target: Workflow, index: number, value: number) {
    dispatch({ type: "SET_STOPS", ids: stopsFor(target.nodes, SCENARIOS[target.id][index], value) });
  }

  return {
    workflow,
    scenarios,
    scenario,
    choice,
    threshold,
    draft,
    setDraft,
    state,
    motion,
    setMotion,
    paused,
    setPaused,
    awaiting,

    /** Call in the same event that changes the workflow. */
    load(next: Workflow) {
      acted.current = false;
      setPaused(false);
      setChoice(0);
      setThreshold(gateAt(next));
      setDraft(SCENARIOS[next.id][0].draft ?? "");
      dispatch({ type: "RESET" });
      setStops(next, 0, gateAt(next));
    },
    start(mode: "auto" | "step") {
      acted.current = true;
      setPaused(false);
      setDraft(scenario.draft ?? "");
      setStops(workflow, choice, threshold);
      dispatch({ type: "START", mode });
    },
    step() {
      acted.current = true;
      dispatch({ type: "STEP" });
    },
    reset() {
      setPaused(false);
      setDraft(scenario.draft ?? "");
      dispatch({ type: "RESET" });
    },
    choose(index: number) {
      acted.current = true;
      setPaused(false);
      setChoice(index);
      setDraft(scenarios[index].draft ?? "");
      dispatch({ type: "RESET" });
      setStops(workflow, index, threshold);
      if (motion) dispatch({ type: "START", mode: "auto" });
    },
    setLine(value: number) {
      setThreshold(value);
      setStops(workflow, choice, value);
    },
    decide(type: "APPROVE" | "REJECT" | "EXPIRE") {
      acted.current = true;
      dispatch({ type });
      rootRef.current?.querySelector<HTMLElement>("[data-footer]")?.focus({ preventScroll: true });
    },
  };
}

export type Player = ReturnType<typeof usePlayer>;
