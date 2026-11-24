"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/BrandMark";
import { NAV_PRACTICES, type PracticeId } from "@/lib/practices";

const ANCHORS = [
  { href: "/#architecture", id: "architecture", label: "Architecture" },
  { href: "/#how-we-work", id: "how-we-work", label: "How We Work" },
  { href: "/#diagnostic", id: "diagnostic", label: "Diagnostic" },
];

function currentPractice(pathname: string): PracticeId | null {
  if (pathname.startsWith("/practices/meta-ads")) return "meta";
  if (pathname.startsWith("/practices/strategy")) return "strategy";
  if (pathname === "/") return "ai";
  return null;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const active = currentPractice(pathname);
  const menuId = useId();
  const practicesId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [practicesOpen, setPracticesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!practicesOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setPracticesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPracticesOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [practicesOpen]);

  function goToHash(id: string) {
    setOpen(false);
    setPracticesOpen(false);
    if (pathname !== "/") return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  function onPracticeKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPracticesOpen(true);
      window.setTimeout(() => itemRefs.current[0]?.focus(), 0);
    }
    if (event.key === "Escape") setPracticesOpen(false);
  }

  function onMenuKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter(Boolean);
    const index = items.findIndex((item) => item === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    }
  }

  const solid = !overlay || scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:bg-[#F7F4EC] focus:px-3 focus:py-2 focus:text-[#133224]"
      >
        Skip to content
      </a>
      <div
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-[#C5A869]/15 bg-[#0B1F16]/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-5 md:px-10">
        <Link
          href="/#top"
          className="flex min-w-0 items-center gap-3"
          aria-label="Valentini and Company, home"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
              setOpen(false);
            }
          }}
        >
          <BrandMark className="h-9 w-9 shrink-0" title="Valentini & Co. monogram" />
          <BrandWordmark className="min-w-0 truncate text-[11px] sm:text-[13px]" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <div
            ref={wrapRef}
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setPracticesOpen(false);
              }
            }}
          >
            <button
              ref={buttonRef}
              type="button"
              className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-[#F7F4EC] uppercase"
              aria-expanded={practicesOpen}
              aria-controls={practicesId}
              aria-haspopup="menu"
              onClick={() => setPracticesOpen((value) => !value)}
              onKeyDown={onPracticeKey}
            >
              Practices
              <span
                aria-hidden
                className={`inline-block h-1.5 w-1.5 border-r border-b border-[#C5A869] transition-transform ${
                  practicesOpen ? "-translate-y-px rotate-[225deg]" : "translate-y-px rotate-45"
                }`}
              />
            </button>
            {practicesOpen ? (
              <div
                id={practicesId}
                role="menu"
                aria-label="Practices"
                className="absolute top-[calc(100%+0.85rem)] left-1/2 w-72 -translate-x-1/2 border border-[rgba(197,168,105,0.25)] bg-[#0B1F16]"
                onKeyDown={onMenuKey}
              >
                {NAV_PRACTICES.map((practice, index) => {
                  const current = active === practice.id;
                  return (
                    <Link
                      key={practice.id}
                      ref={(node) => {
                        itemRefs.current[index] = node;
                      }}
                      href={practice.href}
                      role="menuitem"
                      aria-current={current ? "page" : undefined}
                      className="flex items-baseline justify-between gap-4 border-b border-[rgba(197,168,105,0.18)] px-4 py-3 text-[13px] text-[#F7F4EC] last:border-b-0 hover:bg-[#133224]"
                      onClick={() => setPracticesOpen(false)}
                    >
                      <span>{practice.label}</span>
                      {current ? (
                        <span className="font-mono text-[10px] tracking-[0.16em] text-[#C5A869] uppercase">
                          Current
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] tracking-[0.16em] text-[#F7F4EC]/45 uppercase">
                          {practice.mark === "Active" ? "Active" : ""}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
          {ANCHORS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-[11px] font-medium tracking-[0.18em] text-[#F7F4EC] uppercase"
              onClick={(event) => {
                if (pathname === "/") {
                  event.preventDefault();
                  goToHash(link.id);
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#diagnostic"
          className="hidden border border-[#C5A869] px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-[#F7F4EC] uppercase transition-colors hover:bg-[#C5A869] hover:text-[#0B1F16] lg:inline-flex"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              goToHash("diagnostic");
            }
          }}
        >
          Book a Diagnostic
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-[#F7F4EC] lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X strokeWidth={1.25} aria-hidden /> : <Menu strokeWidth={1.25} aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      </div>

      {open ? (
        <div id={menuId} className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[#0B1F16] lg:hidden">
          <nav className="mx-auto flex max-w-md flex-col px-6 pt-8 pb-16" aria-label="Mobile">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#C5A869] uppercase">Practices</p>
            {NAV_PRACTICES.map((practice) => (
              <Link
                key={practice.id}
                href={practice.href}
                className="border-b border-[rgba(197,168,105,0.2)] py-4 font-display text-[1.7rem] leading-none text-[#F7F4EC]"
                aria-current={active === practice.id ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {practice.label}
                {active === practice.id ? (
                  <span className="ml-3 align-middle font-mono text-[10px] tracking-[0.16em] text-[#C5A869] uppercase">
                    Current
                  </span>
                ) : null}
              </Link>
            ))}
            {ANCHORS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="border-b border-[rgba(197,168,105,0.2)] py-4 font-display text-[1.7rem] leading-none text-[#F7F4EC]"
                onClick={(event) => {
                  if (pathname === "/") {
                    event.preventDefault();
                    goToHash(link.id);
                  } else {
                    setOpen(false);
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#diagnostic"
              className="mt-8 border border-[#C5A869] px-4 py-3 text-center text-[11px] tracking-[0.18em] text-[#F7F4EC] uppercase"
              onClick={(event) => {
                if (pathname === "/") {
                  event.preventDefault();
                  goToHash("diagnostic");
                } else {
                  setOpen(false);
                }
              }}
            >
              Book a Diagnostic
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
