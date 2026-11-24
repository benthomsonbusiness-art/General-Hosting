"use client";

export function BackToTop({ className = "" }: { className?: string }) {
  return (
    <a
      href="#main"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      Back to top
    </a>
  );
}
