import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";
import { WorkflowsView } from "../WorkflowsView";

export const dynamicParams = false;

export function generateStaticParams() {
  return WORKFLOWS.map((item) => ({ slug: item.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workflow = getWorkflow((await params).slug);
  if (!workflow) return {};
  return pageMetadata({
    title: `${workflow.title} workflow`,
    description: workflow.metaDescription,
    path: `/workflows/${workflow.id}`,
  });
}

export default async function WorkflowPage({ params }: Props) {
  const workflow = getWorkflow((await params).slug);
  if (!workflow) notFound();
  return <WorkflowsView selected={workflow} />;
}
