"use client";

import { Check, Pause, Play } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { EXITS, NODE_KINDS } from "@/content/workflows";
import { WINDOWS } from "@/content/windows";
import { STEP_MS, type Player } from "./hooks";
import { RunLog } from "./RunLog";
import type { SceneProps } from "./scene-parts";

const ENDED: Record<string, string> = {
  completed: "Done",
  manual: "With a person",
  rejected: "Rejected",
  expired: "Back in the queue",
};

const STATUS: Record<string, string> = {
  active: "running",
  awaiting: "waiting for you",
  complete: "done",
  skipped: "skipped",
  "low-confidence": "handed to a person",
};

/** One segment per step. Human gates are a key outline. Gold stays on the Approve control. */
export function Progress({ player }: { player: Player }) {
  const { workflow, state, motion, paused } = player;
  return (
    <span aria-hidden className="flex items-center gap-1.5" style={{ "--step": `${STEP_MS}ms` } as CSSProperties}>
      {workflow.nodes.map((node) => {
        const at = state.nodes[node.id] ?? "idle";
        if (node.kind === "human") {
          return (
            <span
              key={node.id}
              className={`h-2.5 w-4 shrink-0 border border-current ${
                at === "complete" || at === "awaiting" ? "bg-current" : ""
              }`}
            />
          );
        }
        const filling = at === "active" && state.mode === "auto" && motion;
        return (
          <span key={node.id} className="h-[3px] flex-1 overflow-hidden bg-current/20">
            <span
              className={`block h-full origin-left bg-current ${filling ? "stage-fill" : ""}`}
              style={{
                transform: filling || at === "complete" || at === "active" || at === "low-confidence" ? undefined : "scaleX(0)",
                animationPlayState: paused ? "paused" : undefined,
              }}
            />
          </span>
        );
      })}
    </span>
  );
}

export function Stage({
  player,
  Scene,
  onNext,
  compact = false,
}: {
  player: Player;
  Scene: ComponentType<SceneProps>;
  onNext?: () => void;
  compact?: boolean;
}) {
  const { workflow, state, scenario, motion, paused, awaiting } = player;
  const look = WINDOWS[workflow.id];
  const node = workflow.nodes[Math.max(state.index, 0)];
  const running = state.status === "running";
  const over = state.status in ENDED;
  const auto = running && state.mode === "auto";
  const pill = awaiting
    ? "Waiting for you"
    : over
      ? ENDED[state.status]
      : running
        ? paused
          ? "Paused"
          : look.doing[state.index]
        : "Ready";
  const tool = "btn min-h-11 px-4 py-2 text-[15px]";
  const line = awaiting
    ? "It stops here until you decide."
    : state.status === "completed"
      ? "Finished. Every step was logged."
      : over
        ? state.message
        : running
          ? node.label
          : "Sample run";

  return (
    <div
      data-surface="dark"
      className={`stage console relative flex flex-col overflow-hidden ${compact ? "stage-compact" : ""}`}
    >
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 px-4 text-[14px] text-ivory sm:px-5">
        {compact ? <span /> : <p>Simulation, sample data</p>}
        <p className="text-muted">{look.place}</p>
      </div>

      <div data-surface="light" className="mx-3 mb-0 flex flex-1 flex-col bg-ivory text-ink sm:mx-4">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-ink/12 px-4 py-1 sm:px-5">
          <p className="font-semibold">{pill}</p>
          <p className="flex items-center gap-2 text-[14px] text-slate">
            {state.status === "completed" ? <Check size={14} strokeWidth={2} aria-hidden /> : null}
            {running && !paused ? (
              <span aria-hidden className="stage-spin h-3 w-3 rounded-full border-2 border-forest border-t-transparent" />
            ) : null}
            {line}
          </p>
        </div>
        <div
          className={`relative flex flex-1 flex-col justify-center px-4 py-3 sm:px-5 ${
            compact ? "" : "min-h-[16rem] short:min-h-[12.5rem] short:py-2"
          }`}
        >
          <Scene state={state} scenario={scenario} draft={player.draft} onDraft={player.setDraft} />
        </div>
      </div>

      <RunLog player={player} />

      <div
        data-footer
        tabIndex={-1}
        role="group"
        aria-label="Playback and decision"
        className="flex min-h-[4.25rem] flex-wrap items-center justify-end gap-2 px-4 py-2 sm:px-5 short:min-h-16"
      >
        {awaiting ? (
          <>
            <button type="button" className={`${tool} btn-secondary`} onClick={() => player.decide("REJECT")}>
              {node.gate?.rejectLabel ?? "Reject"}
            </button>
            <button data-approve type="button" className={`${tool} btn-approve`} onClick={() => player.decide("APPROVE")}>
              {node.gate?.approveLabel ?? "Approve"}
            </button>
          </>
        ) : auto ? (
          <button type="button" className={`${tool} btn-secondary`} onClick={() => player.setPaused(!paused)}>
            {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
            {paused ? "Resume" : "Pause"}
          </button>
        ) : running ? (
          <button type="button" className={`${tool} btn-primary`} onClick={player.step}>
            Next step
          </button>
        ) : (
          <>
            <button
              type="button"
              className={`${tool} ${state.status === "completed" && onNext ? "btn-secondary" : "btn-primary"}`}
              onClick={() => player.start(motion ? "auto" : "step")}
            >
              {over ? "Run again" : motion ? "Play" : "Start"}
            </button>
            {over && onNext ? (
              <button
                type="button"
                className={`${tool} ${state.status === "completed" ? "btn-primary" : "btn-secondary"}`}
                onClick={onNext}
              >
                Next workflow
              </button>
            ) : null}
          </>
        )}
      </div>

      <p role="status" className="sr-only">
        {state.status === "completed" ? "Finished. Every step was logged." : state.message}
      </p>
      <ol aria-label="Steps" className="sr-only">
        {workflow.nodes.map((item, index) => {
          const at = state.nodes[item.id] ?? "idle";
          const here = at === "active" || at === "awaiting";
          return (
            <li key={item.id} data-step={item.id} aria-current={here ? "step" : undefined}>
              {`Step ${index + 1} of ${workflow.nodes.length}: ${item.label}, ${NODE_KINDS[item.kind]}${STATUS[at] ? `, ${STATUS[at]}` : ""}`}
            </li>
          );
        })}
        {state.status === "manual" ? <li>{EXITS["exit-manual"]}</li> : null}
      </ol>
    </div>
  );
}
