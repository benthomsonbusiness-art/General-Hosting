/** Photographic environment and cutout paper object paired with each of the eight workflows. */
export type WorkflowMedia = {
  envSrc: string;
  envAlt: string;
  envPosition: string;
  cutoutSrc: string;
  cutoutAlt: string;
  shortLabel: string;
};

export const WORKFLOW_MEDIA: Record<string, WorkflowMedia> = {
  "lead-triage": {
    envSrc: "/images/wf-lead.jpg",
    envAlt: "An unsealed correspondence envelope on green wool baize with a folded sheet emerging in morning light.",
    envPosition: "center",
    cutoutSrc: "/images/cut-envelope.png",
    cutoutAlt: "Open cream correspondence envelope",
    shortLabel: "Envelope",
  },
  "proposal-ops": {
    envSrc: "/images/wf-proposal.jpg",
    envAlt: "A brushed-brass fountain pen resting diagonally across an unsigned cream proposal sheet on dark wood.",
    envPosition: "center",
    cutoutSrc: "/images/cut-contract.png",
    cutoutAlt: "Brass-fastened proposal bundle",
    shortLabel: "Contract",
  },
  "client-onboarding": {
    envSrc: "/images/wf-onboarding.jpg",
    envAlt: "Two heavy brass keys resting atop a green and manila client folder bound with cotton tape.",
    envPosition: "center",
    cutoutSrc: "/images/cut-notebook.png",
    cutoutAlt: "Open green clothbound client notebook",
    shortLabel: "Notebook",
  },
  "daily-brief": {
    envSrc: "/images/wf-brief.jpg",
    envAlt: "Early morning sunlight cutting diagonally across a folded cream brief sheet on an obsidian-green desk.",
    envPosition: "center",
    cutoutSrc: "/images/cut-letter.png",
    cutoutAlt: "Tri-folded cream brief sheet",
    shortLabel: "Brief",
  },
  "ap-intake": {
    envSrc: "/images/wf-invoice.jpg",
    envAlt: "A stack of ruled invoices on green wood with one sheet pulled halfway out.",
    envPosition: "center",
    cutoutSrc: "/images/cut-invoice.png",
    cutoutAlt: "Ruled ledger invoice with brass staple",
    shortLabel: "Invoice",
  },
  "support-routing": {
    envSrc: "/images/wf-support.jpg",
    envAlt: "A matte dark architectural desk telephone beside stacked cream routing tickets on green baize.",
    envPosition: "center",
    cutoutSrc: "/images/cut-ticket.png",
    cutoutAlt: "Perforated cardstock routing ticket",
    shortLabel: "Ticket",
  },
  "meta-ads-reporting": {
    envSrc: "/images/wf-ads.jpg",
    envAlt: "Overlapping torn matte poster paper layers in deep forest green, cream, and terracotta in raking daylight.",
    envPosition: "center",
    cutoutSrc: "/images/cut-receipt.png",
    cutoutAlt: "Serrated paper cost receipt strip",
    shortLabel: "Ledger",
  },
  "recruiting-screen": {
    envSrc: "/images/wf-recruiting.jpg",
    envAlt: "Stacked white cotton resume sheets on forest green with a strip of black masking tape across the header.",
    envPosition: "center",
    cutoutSrc: "/images/cut-resume.png",
    cutoutAlt: "Cotton resume page with black tape over personal header",
    shortLabel: "Resume",
  },
};
