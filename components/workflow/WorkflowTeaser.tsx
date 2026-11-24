"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { Workflow } from "@/content/workflows";

type Live = ComponentType<{ workflow: Workflow }>;

/** Shows the server-rendered graph, and loads the interactive one when it scrolls into view. */
export function WorkflowTeaser({ workflow, children }: { workflow: Workflow; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Live, setLive] = useState<Live | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let mounted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      import("./TeaserRun").then(
        (module) => {
          if (mounted) setLive(() => module.default);
        },
        () => undefined, // The static graph stays in place.
      );
    });
    observer.observe(node);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      {Live ? (
        <Live workflow={workflow} />
      ) : (
        <>
          {children}
          <div className="mt-6 min-h-32 border-t border-rule" />
        </>
      )}
    </div>
  );
}
