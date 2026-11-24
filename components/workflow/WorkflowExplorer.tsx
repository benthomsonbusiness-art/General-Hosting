"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MotionRoot } from "@/components/util/MotionRoot";
import { WORKFLOWS, type Workflow } from "@/content/workflows";
import type { RunStatus } from "@/lib/run-machine";
import { SITE_NAME } from "@/lib/site";
import { GraphCanvas } from "./GraphCanvas";
import { useDesktop, useReducedMotion, useWorkflowRun } from "./hooks";
import { Inspector } from "./Inspector";
import { KindLegend } from "./NodeGlyph";

const PILL: Record<RunStatus, string> = {
  ready: "Ready",
  running: "Running",
  awaiting: "Awaiting approval",
  completed: "Completed",
  rejected: "Rejected",
  expired: "Expired",
  manual: "Manual review",
};

export function WorkflowExplorer({ initialId }: { initialId: string }) {
  const [workflowId, setWorkflowId] = useState(initialId);
  const desktop = useDesktop();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const workflow = WORKFLOWS.find((item) => item.id === workflowId) ?? WORKFLOWS[0];

  function choose(index: number, focus: boolean) {
    const next = WORKFLOWS[index];
    if (!next) return;
    if (next.id !== workflowId) {
      setWorkflowId(next.id);
      window.history.replaceState(null, "", `/workflows/${next.id}`);
      document.title = `${next.title} workflow — ${SITE_NAME}`;
    }
    if (focus) tabRefs.current[index]?.focus();
  }

  function onTabKey(event: KeyboardEvent) {
    const index = WORKFLOWS.findIndex((item) => item.id === workflow.id);
    const last = WORKFLOWS.length - 1;
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    choose(next, true);
  }

  return (
    <MotionRoot>
      <div className="mx-auto grid w-full max-w-[96rem] grid-cols-[minmax(0,1fr)] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <div data-surface="light" className="min-w-0 bg-stone">
          <div className="px-5 py-4 min-[480px]:hidden">
            <label htmlFor="workflow-select" className="mb-2 block text-[15px] font-semibold text-forest">
              Workflow
            </label>
            <select
              id="workflow-select"
              className="field"
              value={workflow.id}
              onChange={(event) =>
                choose(
                  WORKFLOWS.findIndex((item) => item.id === event.target.value),
                  false,
                )
              }
            >
              {WORKFLOWS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div
            role="tablist"
            aria-label="Workflows"
            aria-orientation={desktop ? "vertical" : "horizontal"}
            className="scroll-none hidden overflow-x-auto min-[480px]:flex lg:flex-col lg:overflow-visible"
            onKeyDown={onTabKey}
          >
            {WORKFLOWS.map((item, index) => {
              const active = item.id === workflow.id;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="workflow-panel"
                  tabIndex={active ? 0 : -1}
                  className={`w-56 shrink-0 border-rule px-5 py-3 text-left max-lg:border-r max-lg:border-b-4 lg:w-full lg:border-b lg:border-l-4 lg:border-b-rule ${
                    active
                      ? "bg-ivory max-lg:border-b-gold-ink lg:border-l-gold-ink"
                      : "hover:bg-ivory/60 max-lg:border-b-transparent lg:border-l-transparent"
                  }`}
                  onClick={() => choose(index, true)}
                >
                  <span className="block text-[15px] leading-snug font-semibold text-forest">{item.title}</span>
                  <span className="mt-1 block text-[13px] leading-[1.4] text-slate">
                    {item.trigger} → {item.outcome.charAt(0).toLowerCase() + item.outcome.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="workflow-panel"
          role="tabpanel"
          aria-labelledby={`tab-${workflow.id}`}
          className="min-w-0"
        >
          {/* Keyed by workflow: switching unmounts the run, which clears its timers. */}
          <RunView key={workflow.id} workflow={workflow} desktop={desktop} />
        </div>
      </div>
    </MotionRoot>
  );
}

type Pin = { id: string; atIndex: number } | null;

function RunView({ workflow, desktop }: { workflow: Workflow; desktop: boolean }) {
  const reduced = useReducedMotion();
  const [speed, setSpeed] = useState(1);
  const [state, dispatch] = useWorkflowRun(workflow, speed);
  const [pin, setPin] = useState<Pin>(null);


  const runRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);

  // ?step=node-id opens a step on load.
  useEffect(() => {
    const step = new URLSearchParams(window.location.search).get("step");
    if (!step || !workflow.nodes.some((node) => node.id === step)) return;
    const frame = window.requestAnimationFrame(() => setPin({ id: step, atIndex: -1 }));
    return () => window.cancelAnimationFrame(frame);
  }, [workflow]);

  const awaiting = state.status === "awaiting";
  const busy = state.status === "running" || awaiting;

  // A gate that has just been reached opens in the inspector, whatever was pinned before it.
  const livePin = pin && !(awaiting && pin.atIndex !== state.index) ? pin.id : null;
  const currentId = state.index >= 0 ? workflow.nodes[state.index].id : null;
  const selectedId = livePin ?? currentId ?? workflow.nodes[0].id;
  // On mobile nothing is open until the reader opens a step or a gate needs them.
  const inlineId = desktop ? null : (livePin ?? (awaiting ? currentId : null));
  const shownId = desktop ? selectedId : inlineId;
  const shownIndex = workflow.nodes.findIndex((node) => node.id === shownId);
  const shown = shownIndex >= 0 ? workflow.nodes[shownIndex] : null;

  // Reaching a gate moves focus to Approve, unless the reader is busy elsewhere on the page.
  useEffect(() => {
    if (!awaiting) return;
    const active = document.activeElement;
    if (active && active !== document.body && !active.closest("#explorer")) return;
    approveRef.current?.focus();
  }, [awaiting, state.index]);

  function select(id: string) {
    if (!desktop && inlineId === id) setPin(null);
    else setPin({ id, atIndex: state.index });
  }

  function approve() {
    setPin(null);
    dispatch({ type: "APPROVE" });
    resetRef.current?.focus();
  }

  function stop(type: "REJECT" | "EXPIRE") {
    setPin(null);
    dispatch({ type });
    runRef.current?.focus();
  }

  const inspector = shown ? (
    <Inspector
      key={shown.id}
      node={shown}
      position={`Step ${shownIndex + 1} of ${workflow.nodes.length}`}
      nodeState={state.nodes[shown.id]}
      awaiting={awaiting && shown.id === currentId}
      lowConfidence={state.lowConfidence.includes(shown.id)}
      onToggleLowConfidence={() => dispatch({ type: "TOGGLE_LOW_CONFIDENCE", nodeId: shown.id })}
      onApprove={approve}
      onReject={() => stop("REJECT")}
      onExpire={() => stop("EXPIRE")}
      approveRef={approveRef}
    />
  ) : null;

  const tool =
    "btn min-h-11 border-ivory/50 px-4 py-2 text-[14px] text-ivory hover:border-gold hover:text-gold";

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_22.5rem]">
      <div data-surface="dark" className="min-w-0 bg-obsidian px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="max-w-[40rem]">
            <h2 className="h3">{workflow.title}</h2>
            <p className="mt-1.5 text-[15px] leading-6 text-muted">{workflow.summary}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            ref={runRef}
            type="button"
            className="btn btn-primary min-h-11 px-4 py-2 text-[14px]"
            aria-disabled={busy}
            onClick={() => {
              if (busy) return;
              setPin(null);
              dispatch({ type: "START", mode: reduced ? "step" : "auto" });
            }}
          >
            {state.status === "ready" || busy ? "Run simulation" : "Run again"}
          </button>
          <button
            type="button"
            className={tool}
            aria-disabled={awaiting || state.traveling}
            onClick={() => {
              if (awaiting || state.traveling) return;
              setPin(null);
              dispatch({ type: "STEP" });
            }}
          >
            Step
          </button>
          <button
            ref={resetRef}
            type="button"
            className={tool}
            onClick={() => {
              setPin(null);
              dispatch({ type: "RESET" });
            }}
          >
            Reset
          </button>
          {!reduced ? (
            <div role="group" aria-label="Speed" className="flex">
              {[1, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={speed === value}
                  className={`min-h-11 min-w-11 border border-ivory/50 text-[14px] font-semibold first:border-r-0 ${
                    speed === value ? "bg-ivory text-obsidian" : "text-ivory hover:text-gold"
                  }`}
                  onClick={() => setSpeed(value)}
                >
                  {value}×
                </button>
              ))}
            </div>
          ) : null}
          <p
            className={`ml-auto border px-3 py-1.5 text-[14px] font-semibold ${
              awaiting ? "border-dashed border-gold text-gold" : "border-ivory/40 text-ivory"
            }`}
          >
            <span className="sr-only">Status: </span>
            {PILL[state.status]}
          </p>
        </div>

        <div className="mt-3 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule pt-3 text-[14px]">
          <p role="status" className="text-ivory">
            {state.message ||
              (reduced ? "Reduced motion is on. Use Step to move one node at a time." : "Run it, or open any step.")}
          </p>
          {awaiting && selectedId !== currentId && currentId ? (
            <button
              type="button"
              className="min-h-11 font-semibold text-gold underline underline-offset-4"
              onClick={() => setPin({ id: currentId, atIndex: state.index })}
            >
              Go to the waiting step
            </button>
          ) : null}
          <p className="ml-auto text-[13px] text-ivory/75">Simulation · sample data · illustrative timings</p>
        </div>

        <div className="mt-6">
          <GraphCanvas
            workflow={workflow}
            state={state}
            selectedId={desktop ? selectedId : inlineId}
            onSelect={select}
            speed={speed}
            reduced={reduced}
            collapsible={!desktop}
            inlineId={inlineId}
            inline={inspector}
          />
        </div>

        <div className="mt-7 border-t border-rule pt-5">
          <KindLegend />
          <p className="mt-4 text-[14px] leading-6 text-ivory/75">{workflow.ownership}</p>
        </div>
      </div>

      {desktop ? (
        <aside
          aria-label="Step inspector"
          data-surface="light"
          className="hidden bg-stone lg:block xl:relative"
        >
          <div className="xl:absolute xl:inset-0 xl:overflow-y-auto">{inspector}</div>
        </aside>
      ) : null}
    </div>
  );
}
