/** How each workflow looks on stage: the window it happens in, and what the window says it is doing. */
export type StageWindow = {
  place: string;
  /** Background of the stage. All four come from the brand palette. */
  field: "forest" | "gold" | "obsidian" | "stone";
  /** One short status per step. Human steps show "Waiting for you" instead. */
  doing: string[];
};

export const WINDOWS: Record<string, StageWindow> = {
  "lead-triage": {
    place: "Inbox",
    field: "forest",
    doing: ["Receiving", "Looking up the company", "Scoring the fit", "Updating the CRM", "", "Sending"],
  },
  "proposal-ops": {
    place: "Proposals",
    field: "gold",
    doing: [
      "Reading the call",
      "Listing requirements",
      "Checking the margin",
      "Writing the proposal",
      "",
      "Requesting the signature",
      "Creating the invoice",
    ],
  },
  "client-onboarding": {
    place: "Client workspace",
    field: "stone",
    doing: [
      "Contract signed",
      "Collecting answers",
      "Building the workspace",
      "Drafting the welcome",
      "",
      "Booking the kickoff",
    ],
  },
  "daily-brief": {
    place: "Leadership channel",
    field: "obsidian",
    doing: ["Starting", "Pulling the figures", "Finding exceptions", "Writing the brief", "Delivering"],
  },
  "ap-intake": {
    place: "Accounts payable",
    field: "gold",
    doing: ["Receiving", "Reading the invoice", "Matching the order", "", "", "Scheduling"],
  },
  "support-routing": {
    place: "Support desk",
    field: "forest",
    doing: ["Receiving", "Labeling", "Drafting from articles", "", "Logging"],
  },
  "meta-ads-reporting": {
    place: "Ad reporting",
    field: "stone",
    doing: ["Pulling the data", "Checking the baseline", "Checking each ad", "Writing the brief", "Posting"],
  },
  "recruiting-screen": {
    place: "Hiring",
    field: "obsidian",
    doing: ["Receiving", "Finding evidence", "", "", "Booking"],
  },
};
