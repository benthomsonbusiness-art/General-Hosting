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
    envSrc: "/images/editorial-workspace.jpg",
    envAlt: "A dark wood desk in window light with an open notebook and brass pen.",
    envPosition: "center",
    cutoutSrc: "/images/cut-contract.png",
    cutoutAlt: "Brass-fastened proposal bundle",
    shortLabel: "Contract",
  },
  "client-onboarding": {
    envSrc: "/images/consultation-room.jpg",
    envAlt: "A room with dark green paneling, a leather chair, and linen curtains.",
    envPosition: "center 30%",
    cutoutSrc: "/images/cut-notebook.png",
    cutoutAlt: "Open green clothbound client notebook",
    shortLabel: "Notebook",
  },
  "daily-brief": {
    envSrc: "/images/hero-paper-fall.jpg",
    envAlt: "Folded archival paper sheets suspended above a forest-green desk.",
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
    envSrc: "/images/systems-geometry.jpg",
    envAlt: "Dark stone and brass fins crossed by diagonal daylight.",
    envPosition: "25% center",
    cutoutSrc: "/images/cut-ticket.png",
    cutoutAlt: "Perforated cardstock routing ticket",
    shortLabel: "Ticket",
  },
  "meta-ads-reporting": {
    envSrc: "/images/hero-architecture.jpg",
    envAlt: "Dark green marble and walnut slats beside a city window at dusk.",
    envPosition: "60% center",
    cutoutSrc: "/images/cut-receipt.png",
    cutoutAlt: "Serrated paper cost receipt strip",
    shortLabel: "Ledger",
  },
  "recruiting-screen": {
    envSrc: "/images/gate-detail.jpg",
    envAlt: "A walnut and brass stamp hovering just above textured cotton paper.",
    envPosition: "center",
    cutoutSrc: "/images/cut-resume.png",
    cutoutAlt: "Cotton resume page with black tape over personal header",
    shortLabel: "Resume",
  },
};
