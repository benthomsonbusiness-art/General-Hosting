"use client";

import { useEffect, useRef, useState } from "react";
import type { SubService } from "@/content/services";

/** The five entry points as a readable sequence, without photographs. */
export function SubServiceScenes({ items }: { items: SubService[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nodes.indexOf(entry.target as HTMLLIElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0.1 },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <ol className="mt-10 divide-y divide-line border-y border-line">
      {items.map((item, index) => (
        <li
          key={item.slug}
          id={item.slug}
          ref={(el) => {
            refs.current[index] = el;
          }}
          tabIndex={-1}
          className="scroll-mt-28 py-8 outline-none"
        >
          <p className="text-muted">
            {index + 1} of {items.length}
            {activeIndex === index ? "" : ""}
          </p>
          <h3 className="h2 mt-2">{item.name}</h3>
          <p className="mt-4 max-w-[40rem] text-[1.15rem]">{item.question}</p>
          <p className="measure mt-3 text-muted">{item.answer}</p>
          <ul aria-label={`What you get from ${item.name}`} className="mt-5 grid gap-2 sm:grid-cols-2">
            {item.get.map((line) => (
              <li key={line} className="text-[15px]">
                {line}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
