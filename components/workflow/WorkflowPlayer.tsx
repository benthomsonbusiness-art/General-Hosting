"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { MotionRoot } from "@/components/util/MotionRoot";
import { SCENARIOS, stopsFor } from "@/content/scenarios";
import type { Workflow } from "@/content/workflows";
import { DetailsDialog } from "./DetailsDialog";
import { useMotion, useWorkflowRun } from "./hooks";
import type { SceneProps } from "./scene-parts";
import { Track } from "./Track";

/**
 * One workflow, shown as one thing changing. `hero` is the small homepage version: it plays by
 * itself when motion is on, never takes focus, and leaves the full controls to /workflows.
 */
export function WorkflowPlayer({
  workflow,
  Scene,
  variant = "full",
}: {
  workflow: Workflow;
  Scene: ComponentType<SceneProps>;
  variant?: "full" | "hero";
}) {
  const hero = variant === "hero";
  const scenarios = SCENARIOS[workflow.id];
  const gateAt = workflow.nodes.find((node) => node.confidence)?.confidence?.threshold ?? 0.8;
  const [motion, setMotion] = useMotion();
  const [state, dispatch] = useWorkflowRun(workflow);
  const [choice, setChoice] = useState(0);
  const [threshold, setThreshold] = useState(gateAt);
  const [draft, setDraft] = useState(scenarios[0].draft ?? "");
  const [detail, setDetail] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);

  const scenario = scenarios[choice];
  const awaiting = state.status === "awaiting";
  const busy = state.status === "running" || awaiting;
  const node = workflow.nodes[Math.max(state.index, 0)];
  const ended = state.status === "manual" || state.status === "rejected" || state.status === "expired";

  // ?step=node-id opens that step's details on load.
  useEffect(() => {
    if (hero) return;
    const step = new URLSearchParams(window.location.search).get("step");
    if (!step || !workflow.nodes.some((item) => item.id === step)) return;
    const frame = window.requestAnimationFrame(() => setDetail(step));
    return () => window.cancelAnimationFrame(frame);
  }, [hero, workflow]);

  // The homepage copy starts once, when it is on screen and motion is on.
  useEffect(() => {
    const root = rootRef.current;
    if (!hero || !motion || !root) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(() => dispatch({ type: "START", mode: "auto" }), 900);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [hero, motion, dispatch]);

  // Reaching a gate moves focus to Approve, unless the reader is busy elsewhere on the page.
  useEffect(() => {
    if (!awaiting || hero) return;
    const active = document.activeElement;
    if (active && active !== document.body && !active.closest("#explorer")) return;
    approveRef.current?.focus();
  }, [awaiting, hero, state.index]);

  function setStops(index: number, value: number) {
    dispatch({ type: "SET_STOPS", ids: stopsFor(workflow.nodes, scenarios[index], value) });
  }

  function choose(index: number) {
    setChoice(index);
    setDraft(scenarios[index].draft ?? "");
    dispatch({ type: "RESET" });
    setStops(index, threshold);
  }

  function start(mode: "auto" | "step") {
    setDraft(scenario.draft ?? "");
    setStops(choice, threshold);
    dispatch({ type: "START", mode });
  }

  function approve() {
    dispatch({ type: "APPROVE" });
    if (!hero) resetRef.current?.focus();
  }

  function stop(type: "REJECT" | "EXPIRE") {
    dispatch({ type });
    if (!hero) runRef.current?.focus();
  }

  const caption =
    ended || state.status === "completed"
      ? state.status === "completed"
        ? "Finished. Every step was logged."
        : state.message
      : state.index < 0
        ? workflow.summary.split(". ")[0] + "."
        : node.does;

  const tool = "btn min-h-11 px-4 py-2 text-[15px]";

  return (
    <MotionRoot motion={motion}>
      <div ref={rootRef} data-motion={motion ? "on" : "off"} data-surface="dark" className="scene">
        {hero ? null : (
          <div className="mb-5 short:mb-2 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <div role="group" aria-label="Sample input" className="flex flex-wrap gap-2">
              {scenarios.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={index === choice}
                  className={`min-h-11 px-4 text-[15px] font-semibold ${
                    index === choice ? "bg-ivory text-obsidian" : "bg-ivory/10 text-ivory hover:bg-ivory/20"
                  }`}
                  onClick={() => choose(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-8 text-[15px]">
              <p className="text-[14px] text-ivory/75">Simulation · sample data · illustrative timings</p>
              <button
                type="button"
                role="switch"
                aria-checked={motion}
                className="flex min-h-11 items-center gap-3"
                onClick={() => setMotion(!motion)}
              >
                Motion
                <span aria-hidden className={`relative h-5 w-9 ${motion ? "bg-gold" : "bg-ivory/30"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 bg-obsidian ${motion ? "right-0.5" : "left-0.5"}`} />
                </span>
              </button>
            </div>
          </div>
        )}

        <Track workflow={workflow} state={state} compact={hero} onSelect={hero ? undefined : setDetail} />

        <div className={`relative ${hero ? "min-h-[21rem]" : "mt-2 min-h-[21.5rem] short:mt-0 short:min-h-[17.5rem]"}`}>
          <div className={hero ? "h-full" : "h-full min-h-[inherit] [&>*]:min-h-[inherit]"}>
            <Scene state={state} scenario={scenario} draft={draft} onDraft={setDraft} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 short:mt-3">
          <p
            role="status"
            className={`min-h-12 flex-1 basis-64 ${hero ? "text-[15px]" : "font-display text-[1.45rem] leading-snug"}`}
          >
            {caption}
            {awaiting ? <span className="sr-only"> Waiting for approval.</span> : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {awaiting ? (
              <>
                <button ref={approveRef} type="button" className={`${tool} btn-primary`} onClick={approve}>
                  {node.gate?.approveLabel ?? "Approve"}
                </button>
                <button type="button" className={`${tool} btn-secondary`} onClick={() => stop("REJECT")}>
                  {node.gate?.rejectLabel ?? "Reject"}
                </button>
                {hero ? null : (
                  <button
                    type="button"
                    className="min-h-11 px-2 text-[14px] text-ivory/80 underline underline-offset-4 hover:text-gold"
                    onClick={() => stop("EXPIRE")}
                  >
                    Let it expire
                  </button>
                )}
              </>
            ) : null}
            {!busy || !hero ? (
              <button
                ref={runRef}
                type="button"
                className={`${tool} ${awaiting ? "sr-only" : "btn-primary"}`}
                aria-disabled={busy}
                tabIndex={awaiting ? -1 : undefined}
                onClick={() => {
                  if (!busy) start(motion ? "auto" : "step");
                }}
              >
                {state.status === "ready" || busy ? "Run" : "Run again"}
              </button>
            ) : null}
            {hero ? (
              !motion && state.status === "running" ? (
                <button type="button" className={`${tool} btn-secondary`} onClick={() => dispatch({ type: "STEP" })}>
                  Next
                </button>
              ) : null
            ) : (
              <>
                <button
                  type="button"
                  className={`${tool} btn-secondary ${awaiting ? "max-sm:hidden" : ""}`}
                  aria-disabled={awaiting || state.traveling}
                  onClick={() => {
                    if (awaiting || state.traveling) return;
                    if (state.status === "running") dispatch({ type: "STEP" });
                    else start("step");
                  }}
                >
                  Step
                </button>
                <button
                  ref={resetRef}
                  type="button"
                  className={`${tool} btn-secondary`}
                  onClick={() => {
                    setDraft(scenario.draft ?? "");
                    dispatch({ type: "RESET" });
                  }}
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {hero ? (
          <p className="mt-2 text-[13px] text-ivory/75">Simulation, sample data</p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3 text-[15px]">
            <label className="flex flex-1 basis-80 flex-wrap items-center gap-x-4">
              <span>Hand to a person below {threshold.toFixed(2)} confidence</span>
              <input
                type="range"
                className="range-dark max-w-64 flex-1 basis-40"
                min={0.5}
                max={0.95}
                step={0.05}
                value={threshold}
                aria-valuetext={threshold.toFixed(2)}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setThreshold(value);
                  setStops(choice, value);
                }}
              />
            </label>
            <button
              type="button"
              className="min-h-11 font-semibold text-gold underline-offset-4 hover:underline"
              onClick={() => setDetail(node.id)}
            >
              Details of this step
            </button>
          </div>
        )}

        {hero ? null : (
          <DetailsDialog
            workflow={workflow}
            nodeId={detail}
            state={state}
            onSelect={setDetail}
            onClose={() => setDetail(null)}
          />
        )}
      </div>
    </MotionRoot>
  );
}
