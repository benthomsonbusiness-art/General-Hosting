"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { WORKFLOWS } from "@/content/workflows";
import { SITE_NAME } from "@/lib/site";
import { SCENES } from "./scenes/rest";
import { Thumb } from "./Thumb";
import { WorkflowPlayer } from "./WorkflowPlayer";

/** Eight pictures to choose from, one workflow on stage. */
export function WorkflowExplorer({ initialId }: { initialId: string }) {
  const [workflowId, setWorkflowId] = useState(initialId);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const workflow = WORKFLOWS.find((item) => item.id === workflowId) ?? WORKFLOWS[0];

  // The page title follows the tab, since the URL does.
  useEffect(() => {
    if (workflow.id !== initialId) document.title = `${workflow.title} workflow — ${SITE_NAME}`;
  }, [workflow, initialId]);

  function choose(index: number) {
    const next = WORKFLOWS[index];
    if (next.id !== workflowId) {
      setWorkflowId(next.id);
      window.history.replaceState(null, "", `/workflows/${next.id}`);
    }
    tabs.current[index]?.focus();
    tabs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function onKey(event: KeyboardEvent) {
    const index = WORKFLOWS.findIndex((item) => item.id === workflow.id);
    const last = WORKFLOWS.length - 1;
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    choose(next);
  }

  return (
    <div data-surface="dark" className="wrap pb-14 md:pb-16">
      <div
        role="tablist"
        aria-label="Workflows"
        className="scroll-none -mx-5 flex gap-1 overflow-x-auto px-5 py-1 md:mx-0 md:grid md:grid-cols-8 md:px-0"
        onKeyDown={onKey}
      >
        {WORKFLOWS.map((item, index) => {
          const active = item.id === workflow.id;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="workflow-panel"
              tabIndex={active ? 0 : -1}
              className={`scene-fade flex w-28 shrink-0 flex-col items-center px-2 pt-3 pb-3 text-center md:w-auto short:pt-1.5 short:pb-2 ${
                active ? "bg-forest text-ivory" : "text-ivory/75 hover:text-ivory"
              }`}
              onClick={() => choose(index)}
            >
              <Thumb id={item.id} className="h-9 w-15 short:h-7 short:w-12" />
              <span className={`mt-2 text-[13px] leading-tight short:mt-1 ${active ? "font-semibold" : ""}`}>{item.title}</span>
            </button>
          );
        })}
      </div>

      <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${workflow.id}`} className="pt-5 short:pt-2">
        <h2 className="sr-only">{workflow.title}</h2>
        {/* Keyed by workflow: switching unmounts the run, which clears its timers. */}
        <WorkflowPlayer key={workflow.id} workflow={workflow} Scene={SCENES[workflow.id]} />
      </div>
    </div>
  );
}
