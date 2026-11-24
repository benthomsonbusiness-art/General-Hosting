"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { NODE_KINDS, type WorkflowNode } from "@/content/workflows";
import { livePayload, type NodeState } from "@/lib/run-machine";
import { NodeGlyph } from "./NodeGlyph";

export function Inspector({
  node,
  position,
  nodeState,
  awaiting,
  lowConfidence,
  onToggleLowConfidence,
  onApprove,
  onReject,
  onExpire,
  approveRef,
}: {
  node: WorkflowNode;
  position: string;
  nodeState: NodeState | undefined;
  awaiting: boolean;
  lowConfidence: boolean;
  onToggleLowConfidence: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExpire: () => void;
  approveRef: RefObject<HTMLButtonElement | null>;
}) {
  const payload = livePayload(node.payload, nodeState);
  return (
    <div data-surface="light" className="bg-stone p-5 md:p-6">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-gold-ink">
        <NodeGlyph kind={node.kind} />
        {NODE_KINDS[node.kind]}
        <span className="ml-auto font-medium text-slate">{position}</span>
      </p>
      <h3 className="h3 mt-2">{node.label}</h3>

      {awaiting && node.gate ? (
        <div className="mt-4 border-2 border-dashed border-gold-ink bg-ivory p-4">
          <p className="font-semibold text-forest">Waiting for you</p>
          <p className="mt-1 text-[14px] leading-6">
            The run stays here until someone clicks. It never approves itself.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button ref={approveRef} type="button" className="btn btn-primary min-h-11 px-4 py-2" onClick={onApprove}>
              {node.gate.approveLabel ?? "Approve"}
            </button>
            <button type="button" className="btn btn-secondary min-h-11 px-4 py-2" onClick={onReject}>
              {node.gate.rejectLabel ?? "Reject"}
            </button>
          </div>
          <button type="button" className="text-link mt-2 min-h-11 text-[14px]" onClick={onExpire}>
            Simulate expiry
          </button>
        </div>
      ) : null}

      <p className="mt-4">{node.does}</p>

      <dl className="mt-5">
        <Row term="Input">{node.input}</Row>
        <Row term="Output">{node.output}</Row>
        <Row term="Tools (example integrations)">{node.tools.join(", ")}</Row>
        <Row term="Guardrail">{node.guardrail}</Row>
        <Row term="On failure">{node.failure}</Row>
        {node.confidence ? (
          <Row term="Confidence threshold">
            Continues at {node.confidence.threshold.toFixed(2)} or above. {node.confidence.belowThreshold}
            <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 font-semibold text-forest">
              <input
                type="checkbox"
                className="h-5 w-5 accent-forest"
                checked={lowConfidence}
                onChange={onToggleLowConfidence}
              />
              Simulate low confidence
            </label>
          </Row>
        ) : null}
        {node.gate ? (
          <Row term="Approval gate">
            {node.gate.approver}. {node.gate.channel}.
            {node.gate.expiresAfter ? ` Expires after: ${node.gate.expiresAfter.charAt(0).toLowerCase()}${node.gate.expiresAfter.slice(1)}.` : ""}
          </Row>
        ) : null}
      </dl>

      <figure className="mt-5">
        <figcaption className="flex items-center justify-between gap-3 text-[13px] font-semibold text-slate">
          Payload, sample data
          <CopyButton text={payload} />
        </figcaption>
        <pre
          tabIndex={0}
          aria-label="Sample payload"
          className="mt-1 max-h-64 overflow-auto border border-rule bg-ivory p-4 font-mono text-[13px] leading-[1.6] text-ink"
        >
          {payload}
        </pre>
      </figure>
    </div>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-t border-rule py-3">
      <dt className="text-[13px] font-semibold text-slate">{term}</dt>
      <dd className="mt-0.5 text-[15px] leading-6">{children}</dd>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" className="text-link min-h-11 text-[13px]" onClick={copy}>
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy payload"}
      </span>
    </button>
  );
}
