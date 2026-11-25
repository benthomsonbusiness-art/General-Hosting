import { getWorkflow, type Workflow } from "@/content/workflows";
import type { FlowNodeInput } from "./flow/layout";

/** What a drawing needs from a workflow: titles, one sentence, and the spine with its apps. */
export type FlowExample = {
  id: string;
  title: string;
  sentence: string;
  nodes: FlowNodeInput[];
};

/** The first sentence of a summary, ending in a period. */
export function firstSentence(text: string): string {
  const sentence = text.split(". ")[0];
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

/** Pass through everything the diagram draws, and nothing it does not. */
export function toFlowNodes(workflow: Pick<Workflow, "nodes">): FlowNodeInput[] {
  return workflow.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    kind: node.kind,
    app: node.app,
    attached: node.attached,
    gate: node.gate,
    confidence: node.confidence,
    stopLabel: node.stopLabel,
    audience: node.audience,
  }));
}

export function flowExample(id: string): FlowExample {
  const workflow = getWorkflow(id);
  if (!workflow) throw new Error(`Missing workflow ${id}`);
  return {
    id: workflow.id,
    title: workflow.title,
    sentence: firstSentence(workflow.summary),
    nodes: toFlowNodes(workflow),
  };
}
