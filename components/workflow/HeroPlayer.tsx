"use client";

import { useRef } from "react";
import type { Workflow } from "@/content/workflows";
import { usePlayer } from "./hooks";
import { LeadScene } from "./scenes/Lead";
import { Stage } from "./Stage";

/** The homepage stage. It plays by itself when motion is on, and waits at the gate. */
export function HeroPlayer({ workflow }: { workflow: Workflow }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const player = usePlayer(workflow, rootRef, { autoplay: true, openAtGate: true });
  return (
    <section aria-label="Sample workflow: inbound lead">
      <div ref={rootRef} data-motion={player.motion ? "on" : "off"} className="scene">
        <Stage player={player} Scene={LeadScene} compact />
      </div>
    </section>
  );
}
