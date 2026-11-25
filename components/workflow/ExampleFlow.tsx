"use client";

import { useId, useState } from "react";
import type { FlowExample } from "./examples";
import { FlowFigure } from "./Flowchart";

/** One text control switches which example is drawn. There is nothing else to set. */
export function ExampleFlow({ examples }: { examples: FlowExample[] }) {
  const selectId = useId();
  const [id, setId] = useState(examples[0]?.id ?? "");
  const current = examples.find((item) => item.id === id) ?? examples[0];
  if (!current) return null;

  return (
    <FlowFigure
      title={current.title}
      sentence={current.sentence}
      nodes={current.nodes}
      control={
        <label htmlFor={selectId} className="mt-6 block max-w-[20rem] text-[15px]">
          <span className="text-muted">Example</span>
          <select
            id={selectId}
            value={current.id}
            onChange={(event) => {
              const next = examples.find((item) => item.id === event.target.value);
              if (next) setId(next.id);
            }}
            className="mt-1 block min-h-11 w-full border-b border-line bg-transparent text-ivory"
          >
            {examples.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      }
    />
  );
}
