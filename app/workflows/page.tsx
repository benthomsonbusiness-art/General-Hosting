import { WORKFLOWS_PAGE } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { WorkflowsIndex } from "./WorkflowsView";

export const metadata = pageMetadata({
  title: "Example workflows",
  description: WORKFLOWS_PAGE.metaDescription,
  path: "/workflows",
});

export default function WorkflowsPage() {
  return <WorkflowsIndex />;
}
