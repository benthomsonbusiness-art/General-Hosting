"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/workflow/hooks";
import { METHOD } from "@/content/approach";

/** Sticky sequence. The panel is a coded diagram of the active stage, not a photograph. */
export function ApproachStages() {
  const [active, setActive] = useState(0);
  const [motion] = useMotion();
  const beatRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const nodes = beatRefs.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = nodes.indexOf(entry.target as HTMLLIElement);
          if (idx !== -1) setActive(idx);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0.1 },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Method stages">
          {METHOD.map((step, idx) => (
            <button
              key={step.title}
              type="button"
              role="tab"
              aria-selected={active === idx}
              onClick={() => {
                setActive(idx);
                beatRefs.current[idx]?.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "center" });
              }}
              className={`min-h-11 rounded-[6px] px-3 text-[15px] ${
                active === idx ? "bg-ivory text-obsidian" : "text-ivory/80"
              }`}
            >
              {idx + 1} {step.title}
            </button>
          ))}
        </div>
        <ol className="space-y-10 lg:space-y-28">
          {METHOD.map((step, idx) => {
            const isActive = active === idx;
            return (
              <li
                key={step.title}
                ref={(node) => {
                  beatRefs.current[idx] = node;
                }}
                onMouseEnter={() => setActive(idx)}
                className={`border-l py-3 pl-5 ${isActive ? "border-ivory" : "border-line"}`}
              >
                <h3 className="h2">
                  {idx + 1} {step.title}
                </h3>
                <p className="mt-3 text-ivory/80">{step.line}</p>
                <p className="mt-4 text-[1.05rem] leading-relaxed">{step.happens}</p>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[15px] text-ivory/70">You see</dt>
                    <dd className="mt-1">{step.see}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-ivory/70">You approve</dt>
                    <dd className="mt-1">{step.approve}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="order-1 lg:order-2 lg:col-span-7">
        <div className="lg:sticky lg:top-28">
          <div className="console p-6" aria-label={METHOD[active]?.title}>
            <ol className="grid grid-cols-4 gap-3">
              {METHOD.map((step, idx) => (
                <li key={step.title} className={`border px-2 py-4 text-[14px] ${idx === active ? "border-ivory" : "border-line text-ivory/60"}`}>
                  {idx + 1} {step.title}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] text-ivory/75">{METHOD[active]?.see}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
