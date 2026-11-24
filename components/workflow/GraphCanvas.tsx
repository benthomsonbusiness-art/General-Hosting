"use client";

import { Check, TriangleAlert } from "lucide-react";
import * as m from "framer-motion/m";
import type { ReactNode } from "react";
import { EXITS, NODE_KINDS, type ExitId, type Workflow } from "@/content/workflows";
import { canvasHeight, edgePoints, exitPoints, legTimes, toPath } from "@/lib/graph-geometry";
import type { NodeState, RunState } from "@/lib/run-machine";
import { travelMs } from "./hooks";
import { NodeGlyph, SHORT_KIND } from "./NodeGlyph";

const STATE_TEXT: Record<NodeState, string> = {
  idle: "",
  active: "Running",
  awaiting: "Waiting for you",
  complete: "Done",
  skipped: "Skipped",
  "low-confidence": "Low confidence",
};

const STATE_BOX: Record<NodeState, string> = {
  idle: "border-ivory/30",
  active: "border-gold outline outline-1 outline-gold bg-forest",
  awaiting: "border-dashed border-gold bg-forest",
  complete: "border-gold/60",
  skipped: "border-ivory/30 opacity-40",
  "low-confidence": "border-ivory bg-forest",
};

function exitOf(state: RunState): ExitId | null {
  if (state.status === "manual") return "exit-manual";
  if (state.status === "rejected") return "exit-rejected";
  if (state.status === "expired") return "exit-expired";
  return null;
}

export function GraphCanvas({
  workflow,
  state,
  selectedId,
  onSelect,
  speed,
  reduced,
  inlineId = null,
  inline = null,
  collapsible = false,
}: {
  workflow: Workflow;
  state: RunState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  speed: number;
  reduced: boolean;
  /** Mobile: the node whose inspector opens inside the stepper. */
  inlineId?: string | null;
  inline?: ReactNode;
  collapsible?: boolean;
}) {
  const count = workflow.nodes.length;
  const exits = (Object.keys(EXITS) as ExitId[]).filter((id) =>
    workflow.edges.some((edge) => edge.to === id),
  );
  const height = canvasHeight(count, exits.length > 0);
  const exit = exitOf(state);
  const exitIndex = exit ? exits.indexOf(exit) : -1;
  const trip = state.traveling ? edgePoints(state.index) : null;

  return (
    <div className="relative">
      <svg
        aria-hidden
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 hidden w-full lg:block"
        style={{ height }}
        fill="none"
      >
        {workflow.nodes.slice(0, -1).map((node, index) => {
          const passed = state.nodes[node.id] === "complete" && state.index > index;
          return (
            <path
              key={node.id}
              d={toPath(edgePoints(index))}
              vectorEffect="non-scaling-stroke"
              stroke={passed ? "#C5A869" : "#F7F4EC"}
              strokeOpacity={passed ? 1 : 0.3}
              strokeWidth={passed ? 1.5 : 1}
            />
          );
        })}
        {exitIndex >= 0 ? (
          <path
            d={toPath(exitPoints(state.index, exitIndex, count))}
            vectorEffect="non-scaling-stroke"
            stroke="#C5A869"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
        ) : null}
      </svg>

      {trip && !reduced ? (
        <m.span
          key={`${state.token}-${state.index}`}
          aria-hidden
          className="pointer-events-none absolute z-10 -mt-[5px] -ml-[5px] hidden h-2.5 w-2.5 rounded-full bg-gold lg:block"
          initial={{ left: `${trip[0].x}%`, top: trip[0].y }}
          animate={{ left: trip.map((point) => `${point.x}%`), top: trip.map((point) => point.y) }}
          transition={{
            duration: travelMs(workflow.nodes[state.index + 1]?.sampleMs ?? 500, speed) / 1000,
            times: legTimes(trip),
            ease: "linear",
          }}
        />
      ) : null}

      <ol className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[repeat(4,20.5%)] lg:gap-x-[6%] lg:gap-y-[60px]">
        {workflow.nodes.map((node, index) => {
          const nodeState = state.nodes[node.id] ?? "idle";
          const selected = node.id === selectedId;
          const status = STATE_TEXT[nodeState];
          const passed = nodeState === "complete" && state.index > index;
          return (
            <li key={node.id} className="relative pb-4 last:pb-0 lg:h-[124px] lg:pb-0">
              {index < count - 1 ? (
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-6 h-4 w-px lg:hidden ${passed ? "bg-gold" : "bg-ivory/30"}`}
                />
              ) : null}
              <button
                type="button"
                data-node={node.id}
                aria-current={nodeState === "active" || nodeState === "awaiting" ? "step" : undefined}
                aria-pressed={collapsible ? undefined : selected}
                aria-expanded={collapsible ? node.id === inlineId : undefined}
                className={`flex min-h-16 w-full flex-col justify-between gap-1.5 border px-3 py-2.5 text-left transition-[background-color,border-color] duration-150 hover:border-gold motion-reduce:transition-none lg:h-full ${STATE_BOX[nodeState]}`}
                onClick={() => onSelect(node.id)}
              >
                <span className="sr-only">
                  {`Step ${index + 1} of ${count}: ${node.label}, ${NODE_KINDS[node.kind]}${status ? `, ${status.toLowerCase()}` : ""}`}
                </span>
                <span aria-hidden className="flex w-full items-center justify-between gap-2 text-[12px] text-ivory/75">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <NodeGlyph kind={node.kind} size={15} />
                    <span className="truncate">{SHORT_KIND[node.kind]}</span>
                  </span>
                  <span className="tabular-nums">{index + 1}</span>
                </span>
                <span
                  aria-hidden
                  className={`text-[14px] leading-[1.28] font-semibold text-ivory ${
                    selected ? "underline decoration-gold decoration-2 underline-offset-4" : ""
                  }`}
                >
                  {node.label}
                </span>
                <span
                  aria-hidden
                  className={`flex min-h-4 items-center gap-1 text-[12px] leading-none ${
                    nodeState === "awaiting" || nodeState === "active" ? "text-gold" : "text-ivory/75"
                  }`}
                >
                  {nodeState === "complete" ? <Check size={13} strokeWidth={2} aria-hidden /> : null}
                  {nodeState === "low-confidence" ? <TriangleAlert size={13} strokeWidth={1.75} aria-hidden /> : null}
                  {status || node.timingLabel}
                </span>
              </button>
              {inlineId === node.id ? <div className="mt-3">{inline}</div> : null}
            </li>
          );
        })}
      </ol>

      {exits.length > 0 ? (
        <ul
          aria-label="Where a run can stop"
          className="mt-6 grid gap-2 lg:mt-16 lg:grid-cols-[repeat(3,29%)] lg:gap-x-[6.5%]"
        >
          {exits.map((id) => (
            <li
              key={id}
              className={`flex min-h-12 items-center justify-center border border-dashed px-3 text-center text-[13px] leading-tight ${
                exit === id ? "border-gold bg-forest font-semibold text-ivory" : "border-ivory/25 text-ivory/70"
              }`}
            >
              {EXITS[id]}
              {exit === id ? <span className="sr-only"> (this run ended here)</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
