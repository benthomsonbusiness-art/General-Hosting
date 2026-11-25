"use client";

import { Check, Pause, Play } from "lucide-react";
import Image from "next/image";
import type { ComponentType, CSSProperties } from "react";
import { EXITS, NODE_KINDS } from "@/content/workflows";
import { WINDOWS } from "@/content/windows";
import { STEP_MS, type Player } from "./hooks";
import { WORKFLOW_MEDIA } from "./media";
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

/** One segment per step. Automated steps fill in forest; human gates are gold diamonds. */
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
              className={`h-2.5 w-2.5 shrink-0 rotate-45 border-2 border-gold-ink ${
                at === "complete" ? "bg-gold-ink" : at === "awaiting" ? "bg-gold" : ""
              }`}
            />
          );
        }
        const filling = at === "active" && state.mode === "auto" && motion;
        return (
          <span key={node.id} className="h-[3px] flex-1 overflow-hidden bg-ink/15">
            <span
              className={`block h-full origin-left bg-forest ${filling ? "stage-fill" : ""}`}
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
  const media = WORKFLOW_MEDIA[workflow.id];
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
      data-field={look.field}
      data-surface="dark"
      className={`stage relative flex flex-col overflow-hidden bg-obsidian px-4 pb-4 sm:px-7 sm:pb-6 ${compact ? "" : "lg:px-10 short:pb-4"}`}
    >
      {/* Photographic environment specific to the active workflow */}
      {media ? (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={media.envSrc}
            alt={media.envAlt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover opacity-55"
            style={{ objectPosition: media.envPosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/45 to-obsidian/80" />
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-12 flex-wrap items-center justify-between gap-x-6 text-[13px] text-ivory/90 sm:min-h-14 sm:text-[14px]">
        <p className="font-mono text-[12px] tracking-[0.06em] uppercase">Simulation, sample data</p>
        <button
          type="button"
          role="switch"
          aria-checked={motion}
          className="flex min-h-11 items-center gap-3 font-semibold text-ivory"
          onClick={() => player.setMotion(!motion)}
        >
          Motion
          <span aria-hidden className="relative h-5 w-9 border-2 border-current">
            <span className={`absolute top-0.5 h-3 w-3 bg-current ${motion ? "right-0.5" : "left-0.5"}`} />
          </span>
        </button>
      </div>

      <div
        data-surface="light"
        className="stage-window relative z-10 mx-auto flex w-full max-w-[41rem] flex-1 flex-col bg-paper text-ink"
      >
        <div className="flex min-h-13 justify-between gap-x-4 gap-y-1 border-b border-ink/10 px-5 py-2 max-sm:flex-col max-sm:items-start sm:items-center sm:px-7">
          <div className="flex items-center gap-3">
            {media ? (
              <Image
                src={media.cutoutSrc}
                alt={media.cutoutAlt}
                width={960}
                height={1200}
                loading="eager"
                sizes="48px"
                className="paper-cutout-light h-9 w-auto shrink-0 object-contain"
              />
            ) : null}
            <p className="font-semibold text-forest">{look.place}</p>
          </div>
          <p
            className={`flex items-center gap-2 px-3 py-1 text-[14px] font-semibold ${
              awaiting ? "bg-gold text-obsidian" : over && state.status === "completed" ? "bg-forest text-paper" : "bg-ivory text-ink"
            }`}
          >
            {state.status === "completed" ? <Check size={14} strokeWidth={3} aria-hidden /> : null}
            {running && !paused ? <span aria-hidden className="stage-spin h-3 w-3 rounded-full border-2 border-forest border-t-transparent" /> : null}
            {awaiting ? <span aria-hidden className="h-2 w-2 rotate-45 bg-obsidian" /> : null}
            {pill}
          </p>
        </div>

        <div className={`relative flex flex-1 flex-col justify-center px-5 py-4 sm:px-7 ${compact ? "min-h-[19rem]" : "min-h-[20.5rem] short:min-h-[16.5rem] short:py-2.5"}`}>
          <Scene state={state} scenario={scenario} draft={player.draft} onDraft={player.setDraft} />
        </div>

        <div
          data-footer
          tabIndex={-1}
          role="group"
          aria-label="Playback and decision"
          className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-ink/10 px-5 py-2.5 sm:px-7 short:min-h-[4rem]"
        >
          <p className="text-[15px] leading-snug max-sm:w-full sm:max-w-[21rem] sm:flex-1 sm:basis-48">{line}</p>
          <div className="flex flex-wrap gap-2">
            {awaiting ? (
              <>
                <button
                  data-approve
                  type="button"
                  className={`${tool} btn-primary`}
                  onClick={() => player.decide("APPROVE")}
                >
                  {node.gate?.approveLabel ?? "Approve"}
                </button>
                <button type="button" className={`${tool} btn-secondary`} onClick={() => player.decide("REJECT")}>
                  {node.gate?.rejectLabel ?? "Reject"}
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
        </div>
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
