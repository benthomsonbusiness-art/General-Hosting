import { WORKFLOWS_PAGE } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { WorkflowsView } from "./WorkflowsView";

export const metadata = pageMetadata({
  title: "Example workflows",
  description: WORKFLOWS_PAGE.metaDescription,
  path: "/workflows",
});

export default function WorkflowsPage() {
  return <WorkflowsView />;
}
