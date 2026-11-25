"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotion } from "@/components/workflow/hooks";

/**
 * Reveals content cleanly on scroll when motion is enabled without stranding sections
 * invisible if jumped to directly or rendered in a headless viewport.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [motion] = useMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !motion) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.1) return;

    node.classList.add("reveal-pending");
    const show = () => {
      node.classList.add("reveal-done");
      node.classList.remove("reveal-pending");
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -4% 0px" },
    );
    observer.observe(node);

    const onScroll = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 1.05) {
        show();
        observer.disconnect();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      node.classList.remove("reveal-pending");
    };
  }, [motion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
