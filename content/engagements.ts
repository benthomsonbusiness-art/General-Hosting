export type EngagementId = "workflow-audit" | "build-and-deploy" | "retained-operations";

export type Engagement = {
  id: EngagementId;
  name: string;
  shape: string;
  delivers: string;
  pricing: string;
  href: string;
};

/**
 * PROPOSED structure, not yet confirmed by the owner. Edit it here only; every page reads
 * from this file. Visitors do not see the status flag. Never add dollar figures.
 */
export const ENGAGEMENTS: { status: "proposed" | "confirmed"; stages: Engagement[] } = {
  status: "proposed",
  stages: [
    {
      id: "workflow-audit",
      name: "Workflow Audit",
      shape: "Fixed scope, 1–2 weeks",
      delivers:
        "A map of the work and a ranked roadmap.",
      pricing: "Request a proposal",
      href: "/services/ai-workflow-automation#workflow-audit",
    },
    {
      id: "build-and-deploy",
      name: "Build & Deploy",
      shape: "Fixed scope, 2–6 weeks",
      delivers:
        "Built in your accounts, tested beside the manual process, handed over.",
      pricing: "Scoped after the audit",
      href: "/services/ai-workflow-automation#build-and-deploy",
    },
    {
      id: "retained-operations",
      name: "Retained Operations",
      shape: "Monthly",
      delivers: "Monitoring, fixes, tested updates and new workflows.",
      pricing: "Scoped after the audit",
      href: "/services/ai-workflow-automation#retained-operations",
    },
  ],
};
