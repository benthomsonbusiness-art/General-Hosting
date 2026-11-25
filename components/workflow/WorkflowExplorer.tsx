"use client";

import { ViewTransition, startTransition, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { WORKFLOWS } from "@/content/workflows";
import { SITE_NAME } from "@/lib/site";
import { DetailsDialog } from "./DetailsDialog";
import { usePlayer, type Player } from "./hooks";
import { SCENES } from "./scenes/rest";
import { Progress, Stage } from "./Stage";
import { Thumb } from "./Thumb";
import { WorkflowText } from "./WorkflowText";

/** Tactile photographic image strips on the left, morphing photographic workflow stage on the right. */
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
      const apply = () => {
        setWorkflowId(target.id);
        player.load(target);
      };
      if (player.motion) startTransition(apply);
      else apply();
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
    <div ref={rootRef} data-motion={player.motion ? "on" : "off"} className="scene bg-obsidian">
      <div className="wrap grid gap-x-10 gap-y-5 pt-5 pb-10 lg:grid-cols-12 short:pt-3 short:pb-6">
        <div className="min-w-0 lg:col-span-5">
          {heading}
          <div
            role="tablist"
            aria-label="Workflows"
            aria-orientation="vertical"
            className="scroll-none mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0 short:mt-2.5 short:gap-1"
            onKeyDown={onKey}
          >
            {WORKFLOWS.map((item, at) => {
              const active = item.id === workflow.id;
              const gates = item.nodes.filter((node) => node.kind === "human").length;
              return (
                <div key={item.id} role="presentation" className="shrink-0 snap-start max-lg:w-[16rem]">
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
                    className={`group relative flex min-h-12 w-full items-center gap-3 overflow-hidden border px-3 py-2 text-left short:min-h-11 short:py-1 ${
                      active ? "border-forest bg-forest text-ivory" : "border-line text-ivory hover:border-ivory/30"
                    }`}
                    onClick={() => choose(at)}
                  >
                    <Thumb id={item.id} className="h-11 w-[7.5rem] shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] leading-tight font-semibold">{item.title}</span>
                      <span className={`mt-0.5 block truncate text-[13px] ${active ? "text-ivory/75" : "text-muted"}`}>
                        {item.nodes.length} steps, {gates} {gates === 1 ? "gate" : "gates"}
                      </span>
                    </span>
                  </button>
                  {active ? <Now player={player} label={node.label} does={node.does} className="max-lg:hidden" /> : null}
                </div>
              );
            })}
          </div>
          <Now player={player} label={node.label} does={node.does} className="mt-3 lg:hidden" />
        </div>

        <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${workflow.id}`} className="min-w-0 lg:col-span-7">
          <h2 className="sr-only">{workflow.title}</h2>
          <ViewTransition key={workflow.id} name="workflow-stage" share="auto" enter="auto" default="none">
            <Stage
              player={player}
              Scene={SCENES[workflow.id]}
              onNext={() => choose((index + 1) % WORKFLOWS.length)}
            />
          </ViewTransition>
          <TryIt player={player} onDetail={setDetail} />
          <details className="mt-3 border-t border-line">
            <summary className="flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">
              Every step, in writing
            </summary>
            <WorkflowText workflows={[workflow]} />
          </details>
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
    <div aria-hidden className={`border-x border-b border-line bg-well px-3.5 pt-2.5 pb-3 text-ivory short:pt-1.5 short:pb-2 ${className}`}>
      <p className="min-h-[3.2em] text-[14px] leading-snug short:min-h-[2.4em] short:text-[13px]">
        {started ? (
          <>
            <span className="font-semibold">{label}.</span> {does}
          </>
        ) : (
          player.workflow.summary.split(". ")[0] + "."
        )}
      </p>
      <div className="mt-2">
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
      <summary className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">
        Change the sample
      </summary>
      <div className="grid gap-x-12 gap-y-8 border border-line p-5 pt-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Sample input</h3>
          <div role="group" aria-label="Sample input" className="mt-3 flex flex-wrap gap-2">
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={index === choice}
                className={`min-h-11 rounded-[6px] px-4 text-[15px] font-semibold ${
                  index === choice ? "bg-ivory text-obsidian" : "border border-line text-ivory"
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
                    className={`h-2.5 shrink-0 border border-current ${
                      item.kind === "human" ? "w-4" : "w-2.5"
                    }`}
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
