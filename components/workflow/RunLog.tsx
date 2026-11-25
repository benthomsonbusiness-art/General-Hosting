"use client";

import type { Player } from "./hooks";

function clock(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((part) => String(part).padStart(2, "0")).join(":");
}

/** Machine output under the scene. Not announced: the stage status covers it. */
export function RunLog({ player }: { player: Player }) {
  const { workflow, state } = player;
  const base = 10 * 3600 + 41 * 60 + 58;
  const lines: string[] = [];

  if (state.index < 0) lines.push(`${clock(base)}  Inbox item waiting`);

  workflow.nodes.forEach((node, index) => {
    const at = state.nodes[node.id];
    if (!at || at === "idle" || at === "skipped") return;
    const stamp = clock(base + index * 3);
    if (node.kind === "human" && at === "complete") lines.push(`${stamp}  Approved by you`);
    else if (node.kind === "human" && at === "awaiting") lines.push(`${stamp}  Waiting at the gate`);
    else if (at === "low-confidence") lines.push(`${stamp}  Handed to a person`);
    else lines.push(`${stamp}  ${node.label}`);
  });

  if (state.status === "rejected") lines.push(`${clock(base + Math.max(state.index, 0) * 3 + 1)}  Rejected. Nothing sent`);
  if (state.status === "expired") lines.push(`${clock(base + Math.max(state.index, 0) * 3 + 1)}  Expired. Nothing sent`);
  if (state.status === "completed") lines.push(`${clock(base + workflow.nodes.length * 3)}  Reply marked sent`);

  return (
    <ol aria-hidden className="max-h-[4.6rem] overflow-hidden border-t border-line px-5 py-2 font-mono text-[12px] leading-[1.45] text-ivory/70 short:max-h-[2.8rem]">
      {lines.slice(-4).map((line, index) => (
        <li key={`${index}-${line}`}>{line}</li>
      ))}
    </ol>
  );
}
