export type EngagementId = "workflow-audit" | "build-and-deploy" | "retained-operations";

export type Engagement = {
  id: EngagementId;
  name: string;
  shape: string;
  delivers: string;
  pricing: string;
  href: string;
  steps: { title: string; body: string }[];
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
        "Maps the processes, systems and handoffs. Returns a prioritized automation roadmap with the hours arithmetic and its assumptions written out.",
      pricing: "Request a proposal",
      href: "/services/ai-workflow-automation/workflow-audit",
      steps: [
        {
          title: "Walk the work",
          body: "We sit with the people who do it and follow one item from arrival to finished record.",
        },
        {
          title: "Map the systems",
          body: "We list each tool, the field it owns, who holds access and where the same value is retyped.",
        },
        {
          title: "Rank the candidates",
          body: "Each candidate gets its hours, its risk and the reason it belongs where it does in the order.",
        },
        {
          title: "Read it back",
          body: "You receive the maps and the roadmap, and you decide what to build, if anything.",
        },
      ],
    },
    {
      id: "build-and-deploy",
      name: "Build & Deploy",
      shape: "Fixed scope, 2–6 weeks",
      delivers:
        "Builds the chosen workflows with guardrails, shadow testing beside the manual process, documentation and handover.",
      pricing: "Scoped after the audit",
      href: "/services/ai-workflow-automation/build-and-deploy",
      steps: [
        {
          title: "Agree the contract",
          body: "We write down the fields, the gates and the failure cases. You approve that document first.",
        },
        {
          title: "Build in your accounts",
          body: "The code goes in your repository and runs under credentials you can revoke.",
        },
        {
          title: "Run in shadow",
          body: "The workflow runs beside the manual process. Differences are reviewed before it sends anything.",
        },
        {
          title: "Cut over and hand over",
          body: "Your team takes the runbook and completes one run, one failure and one fix with us present.",
        },
      ],
    },
    {
      id: "retained-operations",
      name: "Retained Operations",
      shape: "Monthly",
      delivers: "Monitoring, fixes, model and prompt updates, and new workflows as you need them.",
      pricing: "Scoped after the audit",
      href: "/services/ai-workflow-automation/retained-operations",
      steps: [
        {
          title: "Watch the runs",
          body: "Failures, queue age and overrides are checked against limits agreed with the owner.",
        },
        {
          title: "Fix what broke",
          body: "Each failure gets a cause, a change and a note in the log that your team can read.",
        },
        {
          title: "Update with a test",
          body: "Model and prompt changes run against saved examples before they reach the workflow.",
        },
        {
          title: "Review the list",
          body: "A short monthly note covers what ran, what stopped and what is worth building next.",
        },
      ],
    },
  ],
};

export function getEngagement(id: EngagementId): Engagement {
  const found = ENGAGEMENTS.stages.find((stage) => stage.id === id);
  if (!found) throw new Error(`Unknown engagement ${id}`);
  return found;
}
