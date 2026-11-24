"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WORKFLOWS, type WorkflowNode } from "@/lib/workflows";

type Phase = "ready" | "running" | "awaiting" | "complete";
type StepState = "pending" | "active" | "done" | "awaiting" | "approved";

const PILL: Record<Phase, string> = {
  ready: "Ready",
  running: "Running",
  awaiting: "Awaiting Approval",
  complete: "Complete",
};

function timingFor(node: WorkflowNode, state: StepState | undefined) {
  if (state === "awaiting") return "Awaiting Approval";
  if (node.gate && (state === "approved" || state === "done")) return "Approved";
  return node.timing;
}

export function WorkflowExplorer() {
  const [workflowId, setWorkflowId] = useState(WORKFLOWS[0].id);
  const [phase, setPhase] = useState<Phase>("ready");
  const [cursor, setCursor] = useState(-1);
  const [steps, setSteps] = useState<Record<string, StepState>>({});
  const [pinned, setPinned] = useState<string | null>(null);
  const runToken = useRef(0);
  const approveRef = useRef<(() => void) | null>(null);
  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const rerunRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    return () => {
      runToken.current += 1;
      const finish = approveRef.current;
      approveRef.current = null;
      finish?.();
    };
  }, []);

  useEffect(() => {
    if (phase === "awaiting") approveButtonRef.current?.focus();
    if (phase === "complete") rerunRef.current?.focus();
  }, [phase]);

  const workflow = WORKFLOWS.find((item) => item.id === workflowId) ?? WORKFLOWS[0];
  const selectedId = pinned ?? (cursor >= 0 ? workflow.nodes[cursor]?.id : workflow.nodes[0].id);
  const selected = workflow.nodes.find((node) => node.id === selectedId) ?? workflow.nodes[0];

  function halt() {
    runToken.current += 1;
    approveRef.current = null;
  }

  function reset(nextId = workflowId) {
    halt();
    setWorkflowId(nextId);
    setPhase("ready");
    setCursor(-1);
    setSteps({});
    setPinned(null);
  }

  function sleep(ms: number, token: number) {
    return new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(runToken.current === token), ms);
    });
  }

  function waitApproval(token: number) {
    return new Promise<boolean>((resolve) => {
      approveRef.current = () => {
        approveRef.current = null;
        resolve(runToken.current === token);
      };
    });
  }

  function selectWorkflow(index: number) {
    const next = WORKFLOWS[index];
    if (!next) return;
    reset(next.id);
    tabRefs.current[index]?.focus();
  }

  function onTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = WORKFLOWS.findIndex((item) => item.id === workflow.id);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % WORKFLOWS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + WORKFLOWS.length) % WORKFLOWS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = WORKFLOWS.length - 1;
    else return;
    event.preventDefault();
    selectWorkflow(next);
  }

  async function simulate() {
    const token = ++runToken.current;
    approveRef.current = null;
    setPinned(null);
    setPhase("running");
    const initial: Record<string, StepState> = {};
    for (const node of workflow.nodes) initial[node.id] = "pending";
    setSteps(initial);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (let index = 0; index < workflow.nodes.length; index += 1) {
      if (runToken.current !== token) return;
      const node = workflow.nodes[index];
      setCursor(index);
      if (node.gate) {
        setSteps((current) => ({ ...current, [node.id]: "awaiting" }));
        setPhase("awaiting");
        const stillWaiting = await waitApproval(token);
        if (!stillWaiting) return;
        setSteps((current) => ({ ...current, [node.id]: "approved" }));
        setPhase("running");
        const paused = await sleep(reduce ? 120 : 420, token);
        if (!paused) return;
        setSteps((current) => ({ ...current, [node.id]: "done" }));
      } else {
        setSteps((current) => ({ ...current, [node.id]: "active" }));
        const still = await sleep(reduce ? 140 : node.simMs, token);
        if (!still) return;
        setSteps((current) => ({ ...current, [node.id]: "done" }));
      }
    }

    if (runToken.current !== token) return;
    setPhase("complete");
  }

  const running = phase === "running" || phase === "awaiting";

  return (
    <section id="architecture" tabIndex={-1} className="bg-[#0B1F16] text-[#F7F4EC] outline-none">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#C5A869] uppercase">
              Workflow blueprints
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,4.6vw,4.2rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              Three systems. The same discipline.
            </h2>
          </div>
          <p className="max-w-sm text-[17px] leading-7 text-[#F7F4EC]/70">
            Illustrative blueprints of patterns we build inside the tools a company already uses.
            Sample data. Run one. Open any step.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Workflow blueprints"
          aria-orientation="horizontal"
          className="mt-12 flex gap-6 overflow-x-auto border-b border-[rgba(197,168,105,0.25)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onKeyDown={onTabKey}
        >
          {WORKFLOWS.map((item, index) => {
            const selectedTab = item.id === workflow.id;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                aria-controls={`panel-${item.id}`}
                tabIndex={selectedTab ? 0 : -1}
                className={`relative shrink-0 pb-3 text-left text-[15px] tracking-[0.01em] ${
                  selectedTab ? "text-[#F7F4EC]" : "text-[#F7F4EC]/70 hover:text-[#F7F4EC]"
                }`}
                onClick={() => reset(item.id)}
              >
                {item.label}
                {selectedTab ? (
                  <motion.span
                    layoutId="workflow-underline"
                    className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-[#C5A869]"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[15px] leading-6 text-[#F7F4EC]/70">
          Simulation with sample data. Timings are illustrative.
        </p>

        <div
          role="tabpanel"
          id={`panel-${workflow.id}`}
          aria-labelledby={`tab-${workflow.id}`}
          className="mt-6"
        >
        <p className="max-w-3xl text-[17px] leading-7 text-[#F7F4EC]/70">{workflow.summary}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            ref={rerunRef}
            type="button"
            className={`border border-[#C5A869] px-4 py-2.5 font-mono text-[12px] tracking-[0.14em] text-[#F7F4EC] uppercase transition-colors hover:bg-[#C5A869] hover:text-[#0B1F16] ${
              running ? "cursor-not-allowed opacity-40" : ""
            }`}
            aria-disabled={running}
            onClick={() => {
              if (!running) void simulate();
            }}
          >
            {phase === "complete" ? "Re-run" : "Simulate Run"}
          </button>
          <button
            type="button"
            className="border border-[rgba(197,168,105,0.35)] px-4 py-2.5 font-mono text-[12px] tracking-[0.14em] text-[#F7F4EC]/80 uppercase hover:border-[#C5A869] hover:text-[#F7F4EC] disabled:opacity-40"
            disabled={phase === "ready" && cursor < 0}
            onClick={() => reset()}
          >
            Reset
          </button>
          {phase === "awaiting" ? (
            <button
              ref={approveButtonRef}
              type="button"
              className="bg-[#C5A869] px-4 py-2.5 font-mono text-[12px] tracking-[0.14em] text-[#0B1F16] uppercase hover:bg-[#F7F4EC]"
              onClick={() => approveRef.current?.()}
            >
              Approve Gate
            </button>
          ) : null}
          <p
            className="ml-auto border border-[rgba(197,168,105,0.4)] px-3 py-1.5 font-mono text-[12px] tracking-[0.14em] text-[#C5A869] uppercase"
            aria-live="polite"
          >
            {PILL[phase]}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="min-w-0 lg:col-span-7 lg:pr-10">
            <ol>
              {workflow.nodes.map((node) => {
                const state = steps[node.id];
                const isSelected = node.id === selected.id;
                const live = state === "active" || state === "awaiting";
                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 border-t border-[rgba(197,168,105,0.22)] py-4 text-left ${
                        isSelected ? "border-l border-l-[#C5A869] pl-4" : "pl-4"
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => setPinned(node.id)}
                    >
                      <span
                        className={`mt-2 h-1.5 w-1.5 ${
                          live
                            ? "gold-pulse bg-[#C5A869]"
                            : state === "done" || state === "approved"
                              ? "bg-[#C5A869]"
                              : "bg-[#F7F4EC]/25"
                        }`}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className="block text-[15px] leading-snug text-[#F7F4EC]">{node.name}</span>
                        <span className="mt-1 block font-mono text-[12px] tracking-[0.08em] text-[#F7F4EC]/60 uppercase">
                          {node.mode}
                        </span>
                      </span>
                      <span className="pt-0.5 font-mono text-[11px] whitespace-nowrap text-[#F7F4EC]/70">
                        {timingFor(node, state)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {pinned && running ? (
              <button
                type="button"
                className="mt-4 font-sans text-[12px] text-[#C5A869] underline underline-offset-4"
                onClick={() => setPinned(null)}
              >
                Follow the step
              </button>
            ) : null}
          </div>

          <aside className="min-w-0 border-t border-[rgba(197,168,105,0.25)] pt-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="font-mono text-[12px] tracking-[0.16em] text-[#C5A869] uppercase">Step inspector</p>
            <h3 className="mt-3 font-display text-[2rem] leading-tight font-medium">{selected.name}</h3>
            <dl className="mt-6">
              <div className="border-t border-[rgba(197,168,105,0.22)] py-4">
                <dt className="font-sans text-[12px] text-[#C5A869]">Execution</dt>
                <dd className="mt-2 text-[14.5px] leading-6 text-[#F7F4EC]/80">{selected.execution}</dd>
              </div>
              <div className="border-t border-[rgba(197,168,105,0.22)] py-4">
                <dt className="font-sans text-[12px] text-[#C5A869]">Stack</dt>
                <dd>
                  <ul className="mt-2">
                    {selected.stack.map((item) => (
                      <li
                        key={item}
                        className="border-t border-[rgba(197,168,105,0.14)] py-2 font-mono text-[12px] text-[#F7F4EC]/80 first:border-t-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="border-t border-[rgba(197,168,105,0.22)] py-4">
                <dt className="font-sans text-[12px] text-[#C5A869]">Guardrail</dt>
                <dd className="mt-2 text-[14.5px] leading-6 text-[#F7F4EC]/80">{selected.guardrail}</dd>
              </div>
              <div className="border-t border-[rgba(197,168,105,0.22)] py-4">
                <dt className="font-sans text-[12px] text-[#C5A869]">Payload</dt>
                <dd>
                  <pre className="mt-3 max-w-full overflow-x-auto font-mono text-[11.5px] leading-relaxed text-[#F7F4EC]/85">
                    {selected.payload}
                  </pre>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
        </div>
      </div>
    </section>
  );
}
