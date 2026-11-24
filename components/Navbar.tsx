"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/BrandMark";

const links = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#approach", label: "Approach" },
  { href: "#who-we-serve", label: "Who We Serve" },
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function scrollToId(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setOpen(false);
  }

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid
          ? "border-hairline-nav bg-forest/95"
          : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-ivory focus:px-3 focus:py-2 focus:text-forest"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#top"
          className="min-w-0"
          aria-label="Valentini and Company, back to top"
          onClick={(event) => {
            event.preventDefault();
            scrollToId("top");
          }}
        >
          <BrandWordmark />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium tracking-[0.18em] text-on-dark uppercase"
              onClick={(event) => {
                event.preventDefault();
                scrollToId(link.href.slice(1));
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inquire"
            className="border border-gold px-4 py-2.5 text-[11px] font-medium tracking-[0.24em] text-on-dark uppercase transition-colors hover:border-gold-hover hover:text-gold"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("inquire");
            }}
          >
            Inquire
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-on-dark lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X strokeWidth={1.25} aria-hidden />
          ) : (
            <Menu strokeWidth={1.25} aria-hidden />
          )}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 bg-forest lg:hidden"
        >
          <nav className="mx-auto flex h-full max-w-xs flex-col justify-center px-6" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-t border-hairline-dark py-5 text-center font-display text-[2rem] leading-none text-on-dark"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(link.href.slice(1));
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inquire"
              className="border-y border-hairline-dark py-5 text-center font-display text-[2rem] leading-none text-gold"
              onClick={(event) => {
                event.preventDefault();
                scrollToId("inquire");
              }}
            >
              Inquire
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
