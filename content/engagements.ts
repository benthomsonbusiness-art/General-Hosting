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
      name: "Booking audit",
      shape: "1 to 2 weeks",
      delivers: "We find where calls and leads slip through.",
      pricing: "Request a booking audit",
      href: "/how-it-works",
    },
    {
      id: "build-and-deploy",
      name: "Setup",
      shape: "2 to 4 weeks",
      delivers: "We set it up in your tools and test it with your office.",
      pricing: "Priced after the audit",
      href: "/how-it-works",
    },
    {
      id: "retained-operations",
      name: "Ongoing care",
      shape: "Monthly",
      delivers: "We keep it running and make changes you ask for.",
      pricing: "Priced after the audit",
      href: "/how-it-works",
    },
  ],
};
