"use client";

import { Check } from "lucide-react";
import * as m from "framer-motion/m";
import { EXITS, NODE_KINDS, type Workflow } from "@/content/workflows";
import type { RunState } from "@/lib/run-machine";
import { TRAVEL_MS } from "./hooks";

const STATUS: Record<string, string> = {
  active: "running",
  awaiting: "waiting for you",
  complete: "done",
  skipped: "skipped",
  "low-confidence": "handed to a person",
};

const ENDED: Partial<Record<RunState["status"], string>> = {
  manual: EXITS["exit-manual"],
  rejected: EXITS["exit-rejected"],
  expired: EXITS["exit-expired"],
};

/** The path, drawn at the angle of the mark: it leaves the line where a person takes over. */
export function Track({
  workflow,
  state,
  onSelect,
  compact = false,
}: {
  workflow: Workflow;
  state: RunState;
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  const count = workflow.nodes.length;
  const x = (i: number) => ((i + 0.5) / count) * 100;
  const ended = ENDED[state.status];
  const here = Math.max(state.index, 0);
  const next = Math.min(state.traveling ? here + 1 : here, count - 1);
  const lineY = compact ? 14 : 20;
  const exitY = lineY + (compact ? 34 : 66);

  return (
    <div className="relative" style={{ height: compact ? 62 : ended ? 112 : 84 }}>
      <svg
        aria-hidden
        viewBox="0 0 100 112"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[112px] w-full overflow-visible"
        fill="none"
      >
        <path d={`M${x(0)} ${lineY}H${x(count - 1)}`} stroke="#F7F4EC" strokeOpacity=".28" vectorEffect="non-scaling-stroke" />
        <path
          d={`M${x(0)} ${lineY}H${x(here)}`}
          stroke="#C5A869"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {ended ? (
          <path
            d={`M${x(here)} ${lineY}L${x(here) + 3} ${exitY}`}
            stroke="#C5A869"
            strokeWidth="2"
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      <ol className="absolute inset-x-0 top-0 grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {workflow.nodes.map((node, index) => {
          const nodeState = state.nodes[node.id] ?? "idle";
          const current = nodeState === "active" || nodeState === "awaiting";
          const human = node.kind === "human";
          const name = `Step ${index + 1} of ${count}: ${node.label}, ${NODE_KINDS[node.kind]}${STATUS[nodeState] ? `, ${STATUS[nodeState]}` : ""}`;
          const dot = (
            <span
              aria-hidden
              className={`scene-fade grid place-items-center border-2 ${human ? "h-5 w-5 rotate-45" : "h-4 w-4 rounded-full"} ${
                nodeState === "complete"
                  ? "border-gold bg-gold text-obsidian"
                  : current
                    ? human
                      ? "scale-125 border-gold bg-gold/30"
                      : "border-gold bg-obsidian"
                    : "border-ivory/50 bg-obsidian"
              } ${nodeState === "awaiting" ? "border-dashed" : ""}`}
            >
              {nodeState === "complete" ? (
                <Check size={10} strokeWidth={3} className={human ? "-rotate-45" : ""} />
              ) : null}
            </span>
          );
          const label = (
            <span
              aria-hidden
              className={`mt-2 block px-1 text-center text-[13px] leading-tight ${
                current ? "font-semibold text-gold" : nodeState === "skipped" ? "text-ivory/65" : "text-ivory/80"
              } ${compact || !current ? "max-md:hidden" : "max-md:absolute max-md:top-9 max-md:w-40"} ${compact ? "lg:hidden" : ""}`}
            >
              {node.label}
            </span>
          );
          return (
            <li key={node.id} aria-current={current ? "step" : undefined} className="flex flex-col items-center">
              {onSelect ? (
                <button
                  type="button"
                  data-node={node.id}
                  className="relative flex min-h-11 w-full flex-col items-center hover:[&>span]:border-gold"
                  onClick={() => onSelect(node.id)}
                >
                  <span className="sr-only">{name}. Open details.</span>
                  <span className="grid h-10 w-full place-items-center">{dot}</span>
                  {label}
                </button>
              ) : (
                <div className="grid h-7 w-full place-items-center">
                  <span className="sr-only">{name}</span>
                  {dot}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <m.span
        aria-hidden
        className="pointer-events-none absolute z-10 -mt-[7px] -ml-[7px] h-3.5 w-3.5 rounded-full bg-gold ring-4 ring-obsidian"
        initial={false}
        animate={{
          left: `${ended ? x(here) + 3 : x(next)}%`,
          top: ended ? exitY : lineY,
          opacity: state.index < 0 || state.status === "awaiting" || state.status === "completed" ? 0 : 1,
        }}
        transition={{ duration: TRAVEL_MS / 1000, ease: [0.5, 0, 0.2, 1] }}
      />
      {ended && !compact ? (
        <p
          className="absolute text-[14px] font-semibold whitespace-nowrap text-gold"
          style={
            x(here) > 60
              ? { right: `${100 - x(here) + 1}%`, top: exitY - 10 }
              : { left: `${x(here) + 5}%`, top: exitY - 10 }
          }
        >
          {ended}
        </p>
      ) : null}
    </div>
  );
}
