"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { WORKFLOWS } from "@/content/workflows";
import { SITE_NAME } from "@/lib/site";
import { DetailsDialog } from "./DetailsDialog";
import { usePlayer, type Player } from "./hooks";
import { SCENES } from "./scenes/rest";
import { Progress, Stage } from "./Stage";

/** A short list on the left, one workflow at work on the right. Controls wait until asked for. */
export function WorkflowExplorer({ initialId, heading }: { initialId: string; heading: ReactNode }) {
  const [workflowId, setWorkflowId] = useState(initialId);
  const [detail, setDetail] = useState<string | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const index = Math.max(
    0,
    WORKFLOWS.findIndex((item) => item.id === workflowId),
  );
  const workflow = WORKFLOWS[index];
  const player = usePlayer(workflow, rootRef);
  const { state } = player;
  const node = workflow.nodes[Math.max(state.index, 0)];

  // The page title follows the tab, since the URL does.
  useEffect(() => {
    if (workflow.id !== initialId) document.title = `${workflow.title} workflow — ${SITE_NAME}`;
  }, [workflow, initialId]);

  // ?step=node-id opens that step's details on load.
  useEffect(() => {
    const step = new URLSearchParams(window.location.search).get("step");
    const start = WORKFLOWS.find((item) => item.id === initialId);
    if (!step || !start?.nodes.some((item) => item.id === step)) return;
    const frame = window.requestAnimationFrame(() => setDetail(step));
    return () => window.cancelAnimationFrame(frame);
  }, [initialId]);

  function choose(next: number) {
    const target = WORKFLOWS[next];
    if (target.id !== workflowId) {
      setWorkflowId(target.id);
      player.load(target);
      window.history.replaceState(null, "", `/workflows/${target.id}`);
    }
    tabs.current[next]?.focus({ preventScroll: true });
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function onKey(event: KeyboardEvent) {
    const last = WORKFLOWS.length - 1;
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    choose(next);
  }

  return (
    <div ref={rootRef} data-motion={player.motion ? "on" : "off"} className="scene">
      <div className="wrap grid gap-x-12 gap-y-6 pt-5 pb-12 lg:grid-cols-12 short:pt-3 short:pb-8">
        <div className="min-w-0 lg:col-span-4">
          {heading}
          <div
            role="tablist"
            aria-label="Workflows"
            aria-orientation="vertical"
            className="scroll-none -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 py-1 md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:p-0 short:mt-3"
            onKeyDown={onKey}
          >
            {WORKFLOWS.map((item, at) => {
              const active = item.id === workflow.id;
              return (
                <div key={item.id} role="presentation" className="shrink-0">
                  <button
                    ref={(element) => {
                      tabs.current[at] = element;
                    }}
                    id={`tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="workflow-panel"
                    tabIndex={active ? 0 : -1}
                    className={`min-h-11 w-full px-4 text-left whitespace-nowrap max-lg:border max-lg:border-rule lg:px-0 lg:text-[1.125rem] ${
                      active
                        ? "font-semibold text-forest max-lg:border-forest max-lg:bg-forest max-lg:text-ivory"
                        : "text-slate hover:text-forest"
                    }`}
                    onClick={() => choose(at)}
                  >
                    {item.title}
                  </button>
                  {active ? <Now player={player} label={node.label} does={node.does} className="max-lg:hidden" /> : null}
                </div>
              );
            })}
          </div>
          <Now player={player} label={node.label} does={node.does} className="mt-4 lg:hidden" />
        </div>

        <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${workflow.id}`} className="min-w-0 lg:col-span-8">
          <h2 className="sr-only">{workflow.title}</h2>
          <Stage
            player={player}
            Scene={SCENES[workflow.id]}
            onNext={() => choose((index + 1) % WORKFLOWS.length)}
          />
          <TryIt player={player} onDetail={setDetail} />
        </div>
      </div>
      <DetailsDialog
        workflow={workflow}
        nodeId={detail}
        state={state}
        onSelect={setDetail}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}

/** The step on stage. Screen readers get the same thing from the stage's status and step list. */
function Now({ player, label, does, className }: { player: Player; label: string; does: string; className: string }) {
  const started = player.state.index >= 0;
  return (
    <div aria-hidden className={`pb-4 short:pb-2 ${className}`}>
      <p className="min-h-[4.5em] text-[15px] leading-normal text-slate short:text-[14px]">
        {started ? (
          <>
            <span className="font-semibold text-gold-ink">{label}.</span> {does}
          </>
        ) : (
          player.workflow.summary.split(". ")[0] + "."
        )}
      </p>
      <div className="mt-2.5">
        <Progress player={player} />
      </div>
    </div>
  );
}

/** Everything a curious visitor can change, behind one control. */
function TryIt({ player, onDetail }: { player: Player; onDetail: (id: string) => void }) {
  const { workflow, scenarios, choice, threshold, awaiting, state } = player;
  const tool = "btn btn-secondary min-h-11 px-4 py-2 text-[15px]";
  return (
    <details className="group/try mt-3">
      <summary className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline">
        Change the sample and inspect the steps
        <span aria-hidden className="group-open/try:rotate-180">
          ↓
        </span>
      </summary>
      <div className="grid gap-x-12 gap-y-8 pt-4 pb-2 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Sample input</h3>
          <div role="group" aria-label="Sample input" className="mt-3 flex flex-wrap gap-2">
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={index === choice}
                className={`min-h-11 px-4 text-[15px] font-semibold ${
                  index === choice ? "bg-forest text-ivory" : "bg-stone text-forest hover:bg-forest/15"
                }`}
                onClick={() => player.choose(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="mt-6 block">
            <span className="text-[15px]">Hand to a person below {threshold.toFixed(2)} confidence</span>
            <input
              type="range"
              min={0.5}
              max={0.95}
              step={0.05}
              value={threshold}
              aria-valuetext={threshold.toFixed(2)}
              onChange={(event) => player.setLine(Number(event.target.value))}
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.status === "running" || awaiting ? null : (
              <button type="button" className={tool} onClick={() => player.start("step")}>
                Step through
              </button>
            )}
            <button type="button" className={tool} onClick={player.reset}>
              Reset
            </button>
            {awaiting ? (
              <button type="button" className={tool} onClick={() => player.decide("EXPIRE")}>
                Let it expire
              </button>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Inspect a step</h3>
          <ol className="mt-2">
            {workflow.nodes.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-node={item.id}
                  className="flex min-h-11 w-full items-center gap-3 text-left text-[15px] underline-offset-4 hover:underline"
                  onClick={() => onDetail(item.id)}
                >
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 border-2 border-gold-ink ${item.kind === "human" ? "rotate-45" : "rounded-full"}`}
                  />
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </details>
  );
}
