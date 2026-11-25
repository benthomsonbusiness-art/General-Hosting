import { OpeningB } from "@/components/lab/OpeningB";
import { getWorkflow, WORKFLOWS } from "@/content/workflows";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab B — Daylight Broadsheet",
  description: "Opening study B for the Valentini & Co. homepage redesign, built on near-white cotton paper with fanning paper cutouts.",
  path: "/lab/b",
  noindex: true,
});

export default function LabBPage() {
  const lead = getWorkflow("lead-triage") ?? WORKFLOWS[0];
  return <OpeningB lead={lead} />;
}
