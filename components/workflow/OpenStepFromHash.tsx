"use client";

import { useEffect } from "react";

/**
 * Opens the step row a "#step-…" link points at, on load and on every hash change, so a click
 * on a node in the drawing lands on that step already expanded.
 */
export function OpenStepFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith("step-")) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.scrollIntoView({ block: "center" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
