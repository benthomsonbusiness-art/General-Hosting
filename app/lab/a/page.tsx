import { OpeningA } from "@/components/lab/OpeningA";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab A — Suspended Field",
  description: "Opening study A for the Valentini & Co. homepage redesign, built with suspended paper photography and live workflow state.",
  path: "/lab/a",
  noindex: true,
});

export default function LabAPage() {
  const lead = getWorkflow("lead-triage") ?? WORKFLOWS[0];
  return <OpeningA lead={lead} />;
}
