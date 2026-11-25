import { OpeningC } from "@/components/lab/OpeningC";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab C — Table & Gate",
  description: "Opening study C for the Valentini & Co. homepage redesign, pairing raw paper objects with the live workflow stage.",
  path: "/lab/c",
  noindex: true,
});

export default function LabCPage() {
  const lead = getWorkflow("lead-triage") ?? WORKFLOWS[0];
  return <OpeningC lead={lead} />;
}
