"use client";

import type { Workflow } from "@/content/workflows";
import { LeadScene } from "./scenes/Lead";
import { WorkflowPlayer } from "./WorkflowPlayer";

export function HeroPlayer({ workflow }: { workflow: Workflow }) {
  return (
    <section aria-label="Sample workflow: inbound lead">
      <WorkflowPlayer workflow={workflow} Scene={LeadScene} variant="hero" />
    </section>
  );
}
