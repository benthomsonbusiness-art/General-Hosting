"use client";

import { Check, Clock, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { SCENARIOS, stopsFor, type Scenario } from "@/content/scenarios";
import type { Workflow } from "@/content/workflows";
import { initialRun, runReducer } from "@/lib/run-machine";

/**
 * Interactive workflow simulator wrapping a server-rendered FlowDiagram ({children}).
 * Syncs live node states via data-run-state attributes and intercepts clicks on an awaiting
 * human gate, keeping FlowDiagram and AppMark 100% server-rendered.
 */
export function FlowPlayer({
  workflow,
  children,
}: {
  workflow: Workflow;
  children: ReactNode;
}) {
  const scenarios = SCENARIOS[workflow.id] ?? [];
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario: Scenario | undefined = scenarios[scenarioIndex];
  const stageRef = useRef<HTMLDivElement>(null);

  const aiThreshold = useMemo(() => {
    const aiNode = workflow.nodes.find((n) => n.kind === "ai" && n.confidence);
    return aiNode?.confidence?.threshold ?? 0.75;
  }, [workflow]);

  const reducer = useMemo(() => runReducer(workflow), [workflow]);
  const [state, dispatch] = useReducer(reducer, undefined, initialRun);

  useEffect(() => {
    if (!scenario) return;
    const stops = stopsFor(workflow.nodes, scenario, aiThreshold);
    dispatch({ type: "RESET" });
    dispatch({ type: "SET_STOPS", ids: stops });
  }, [workflow, scenario, aiThreshold]);

  useEffect(() => {
    if (state.status !== "running") return;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 200 : state.traveling ? 320 : 620;
    const timer = window.setTimeout(() => {
      if (state.traveling) {
        dispatch({ type: "ARRIVE", token: state.token });
      } else {
        dispatch({ type: "FINISH_NODE", token: state.token });
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [state.status, state.traveling, state.index, state.token]);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>(".flow-item[data-node-id]");
    items.forEach((item) => {
      const nodeId = item.dataset.nodeId;
      const runState = nodeId ? state.nodes[nodeId] : undefined;
      if (runState) {
        item.dataset.runState = runState;
      } else {
        delete item.dataset.runState;
      }
    });
  }, [state.nodes]);

  const isIdle = state.status === "ready";
  const isAwaiting = state.status === "awaiting";
  const isDone =
    state.status === "completed" ||
    state.status === "rejected" ||
    state.status === "expired" ||
    state.status === "manual";

  function startRun() {
    if (scenario) {
      dispatch({ type: "SET_STOPS", ids: stopsFor(workflow.nodes, scenario, aiThreshold) });
    }
    dispatch({ type: "START", mode: "auto" });
  }

  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    if (!isAwaiting) return;
    const target = event.target as HTMLElement | null;
    const humanItem = target?.closest<HTMLElement>('.flow-item[data-kind="human"][data-run-state="awaiting"]');
    if (humanItem) {
      event.preventDefault();
      dispatch({ type: "APPROVE" });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flow-player-bar">
        <div className="flex flex-wrap items-center gap-2">
          {isIdle ? (
            <button
              type="button"
              onClick={startRun}
              className="copper-key min-h-10 px-3.5 py-1.5 text-[13px] font-semibold"
            >
              <Play aria-hidden size={14} strokeWidth={2.25} fill="currentColor" />
              <span>Run sample lead</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET" })}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-[6px] border border-line bg-well px-3.5 py-1.5 text-[13px] font-semibold text-ivory hover:border-ivory"
            >
              <RotateCcw aria-hidden size={14} strokeWidth={2} />
              <span>{isDone ? "Run again" : "Reset"}</span>
            </button>
          )}

          {scenarios.length > 1 ? (
            <div className="flex flex-wrap items-center gap-1.5 pl-1" role="group" aria-label="Sample scenario">
              <span className="mr-1 hidden text-[12px] text-muted sm:inline">Sample:</span>
              {scenarios.map((item, idx) => {
                const active = idx === scenarioIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScenarioIndex(idx)}
                    aria-pressed={active}
                    className={`min-h-9 rounded-full px-3 text-[12px] font-medium transition ${
                      active
                        ? "bg-ivory font-semibold text-obsidian"
                        : "border border-line text-muted hover:text-ivory"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div aria-live="polite" className="flex flex-wrap items-center gap-2.5 text-[13px]">
          {state.message ? (
            <span className={isAwaiting ? "font-semibold text-gold" : "text-muted"}>{state.message}</span>
          ) : (
            <span className="text-muted">Click Run sample lead to watch how each step behaves.</span>
          )}

          {isAwaiting ? (
            <span className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "APPROVE" })}
                className="copper-key min-h-9 px-3 py-1 text-[12px] font-semibold"
              >
                <Check aria-hidden size={14} strokeWidth={2.5} />
                <span>Approve text</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "REJECT" })}
                className="inline-flex min-h-9 items-center gap-1 rounded-[6px] border border-line bg-obsidian px-2.5 py-1 text-[12px] font-medium text-ivory hover:border-ivory"
              >
                <X aria-hidden size={13} strokeWidth={2} />
                <span>Say no</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "EXPIRE" })}
                className="inline-flex min-h-9 items-center gap-1 rounded-[6px] border border-line bg-obsidian px-2.5 py-1 text-[12px] font-medium text-muted hover:text-ivory"
              >
                <Clock aria-hidden size={13} strokeWidth={2} />
                <span>No answer</span>
              </button>
            </span>
          ) : null}
        </div>
      </div>

      {isAwaiting && scenario?.draft ? (
        <div className="rounded-[10px] border border-[rgb(255_107_74_/_0.45)] bg-[#1e120d] px-4 py-3 text-[14px]">
          <span className="font-mono text-[12px] font-semibold tracking-wider text-gold uppercase">
            Ready on your phone:{" "}
          </span>
          <span className="text-ivory">“{scenario.draft}”</span>
        </div>
      ) : null}

      <div ref={stageRef} onClick={onStageClick}>
        {children}
      </div>
    </div>
  );
}
