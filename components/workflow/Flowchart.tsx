import type { ReactNode } from "react";
import type { FlowNode } from "./examples";

/** A static drawing of one workflow. Approval is a labeled node, not a control. */
export function Flowchart({ title, nodes }: { title: string; nodes: FlowNode[] }) {
  return (
    <div className="flow-canvas">
      <ol aria-label={title} className="flex w-full max-w-[20rem] flex-col items-center">
        {nodes.map((node, index) => (
          <li key={node.id} className="flex w-full flex-col items-center">
            {index > 0 ? <span aria-hidden className="h-5 w-px bg-ivory/40" /> : null}
            <p className={node.kind === "human" ? "flow-node flow-approve" : "flow-node"}>{node.label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function FlowFigure({
  title,
  sentence,
  nodes,
  control,
}: {
  title: string;
  sentence: string;
  nodes: FlowNode[];
  control?: ReactNode;
}) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="max-w-[28rem] text-[1.2rem] leading-snug">{sentence}</p>
        {control}
      </div>
      <div className="lg:col-span-7">
        <Flowchart title={title} nodes={nodes} />
      </div>
    </div>
  );
}
