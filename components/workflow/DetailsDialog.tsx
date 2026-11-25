"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NODE_KINDS, type Workflow } from "@/content/workflows";
import { livePayload, type RunState } from "@/lib/run-machine";

/** Everything about one step, out of the way until someone asks for it. */
export function DetailsDialog({
  workflow,
  nodeId,
  state,
  onSelect,
  onClose,
}: {
  workflow: Workflow;
  nodeId: string | null;
  state: RunState;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const index = workflow.nodes.findIndex((node) => node.id === nodeId);
  const node = index >= 0 ? workflow.nodes[index] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (nodeId && !dialog.open) dialog.showModal();
    if (!nodeId && dialog.open) dialog.close();
  }, [nodeId]);

  const rows = node
    ? [
        { term: "In", text: node.input },
        { term: "Out", text: node.output },
        { term: "Guardrail", text: node.guardrail },
        { term: "If it fails", text: node.failure },
        ...(node.gate ? [{ term: "Who decides", text: `${node.gate.approver}. ${node.gate.channel}.` }] : []),
        { term: "Example tools", text: node.tools.join(", ") },
      ]
    : [];

  return (
    <dialog
      ref={ref}
      aria-label="Step details"
      data-surface="light"
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-[32rem] overflow-y-auto bg-ivory p-0 text-ink backdrop:bg-obsidian/70"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {node ? (
        <div className="p-7 md:p-10">
          <div className="flex items-center justify-between">
            <p className="text-[15px] text-slate">
              {NODE_KINDS[node.kind]}
            </p>
            <button
              type="button"
              aria-label="Close details"
              className="grid h-11 w-11 place-items-center text-forest"
              onClick={onClose}
            >
              <X strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <h3 className="mt-3 font-display text-[2.4rem] leading-[1.05] font-medium">{node.label}</h3>
          <dl className="mt-7 space-y-5">
            {rows.map((row) => (
              <div key={row.term}>
                <dt className="text-[14px] font-semibold text-slate">{row.term}</dt>
                <dd className="mt-0.5">{row.text}</dd>
              </div>
            ))}
          </dl>
          <details className="mt-7">
            <summary className="flex min-h-11 items-center font-semibold text-forest underline underline-offset-4">
              Sample data
            </summary>
            <pre
              tabIndex={0}
              aria-label="Sample payload"
              className="mt-2 max-h-72 overflow-auto bg-well p-4 font-mono text-[13px] leading-[1.6] text-ivory"
            >
              {livePayload(node.payload, state.nodes[node.id])}
            </pre>
          </details>
          <div className="mt-8 flex justify-between gap-4">
            {index > 0 ? (
              <button type="button" className="btn btn-secondary" onClick={() => onSelect(workflow.nodes[index - 1].id)}>
                Previous
              </button>
            ) : (
              <span />
            )}
            {index < workflow.nodes.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => onSelect(workflow.nodes[index + 1].id)}>
                Next step
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
