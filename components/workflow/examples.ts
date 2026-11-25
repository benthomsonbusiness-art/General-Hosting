import { getWorkflow, type NodeKind } from "@/content/workflows";

export const EXAMPLE_IDS = ["lead-triage", "ap-intake", "daily-brief"] as const;

export type FlowNode = { id: string; label: string; kind: NodeKind };

export type FlowExample = {
  id: string;
  title: string;
  sentence: string;
  nodes: FlowNode[];
};

export function flowExample(id: string): FlowExample {
  const workflow = getWorkflow(id);
  if (!workflow) throw new Error(`Missing workflow ${id}`);
  const sentence = workflow.summary.split(". ")[0];
  return {
    id: workflow.id,
    title: workflow.title,
    sentence: sentence.endsWith(".") ? sentence : `${sentence}.`,
    nodes: workflow.nodes.map((node) => ({ id: node.id, label: node.label, kind: node.kind })),
  };
}

export function flowExamples(): FlowExample[] {
  return EXAMPLE_IDS.map((id) => flowExample(id));
}
