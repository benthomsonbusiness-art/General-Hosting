"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { SearchDialog } from "@/components/nav/SearchDialog";
import { MotionSwitch } from "@/components/util/MotionSwitch";
import type { NavItem } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

const MOBILE_ART: Record<string, { src: string; alt: string }> = {
  "/workflows": { src: "/images/cut-envelope.png", alt: "Open correspondence envelope" },
  "/services": { src: "/images/cut-contract.png", alt: "Brass-fastened agreement bundle" },
  "/insights": { src: "/images/cut-notebook.png", alt: "Open ruled field notebook" },
  "/about": { src: "/images/cut-letter.png", alt: "Folded archival letter" },
};

export function SiteHeader({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [underSurface, setUnderSurface] = useState<"light" | "dark">("light");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string>("/workflows");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);

  // React to the section directly beneath the header bar.
  useEffect(() => {
    let raf = 0;
    const inspect = () => {
      raf = 0;
      setScrolled(window.scrollY > 18);
      const probeY = 76;
      const surfaces = [...document.querySelectorAll<HTMLElement>("main [data-surface]")];
      let found: "light" | "dark" = "light";
      for (const el of surfaces) {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          const val = el.dataset.surface;
          if (val === "dark" || val === "light") found = val;
        }
      }
      setUnderSurface(found);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(inspect);
    };
    inspect();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Drawer: inert page, trapped Tab, restored scroll, closes at desktop width.
  useEffect(() => {
    if (!drawer) return;
    const media = window.matchMedia("(min-width: 1024px)");
    const onMedia = () => {
      if (media.matches) setDrawer(false);
    };
    media.addEventListener("change", onMedia);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const outside = [...document.querySelectorAll<HTMLElement>("main, body > footer, .skip-link")];
    for (const node of outside) node.inert = true;
    drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !searchRef.current?.open) {
        setDrawer(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current || !toggleRef.current) return;
      const focusable = [toggleRef.current, ...drawerRef.current.querySelectorAll<HTMLElement>("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", onMedia);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      for (const node of outside) node.inert = false;
    };
  }, [drawer]);

  const close = () => setDrawer(false);
  const isCurrent = (item: NavItem) =>
    item.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  const activeArt = MOBILE_ART[hoveredMenu] ?? MOBILE_ART["/workflows"];

  return (
    <header
      data-surface="light"
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        underSurface === "dark"
          ? "border-ivory/25 bg-ivory shadow-[0_14px_34px_-18px_rgb(11_31_22_/_0.55)]"
          : scrolled
            ? "border-ink/15 bg-paper shadow-[0_10px_28px_-18px_rgb(19_50_36_/_0.18)]"
            : "border-ink/10 bg-paper"
      }`}
    >
      <div
        className={`wrap flex items-center justify-between gap-5 transition-[height] duration-200 ${
          scrolled ? "h-14 lg:h-[3.85rem]" : "h-(--header-h)"
        }`}
      >
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-3"
          aria-label="Valentini & Co. home"
          onClick={close}
        >
          <BrandMark tone="light" className="h-9 w-9 shrink-0" />
          <BrandWordmark tone="light" className="min-w-0 truncate text-[12px] sm:text-[14px]" />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <nav className="flex items-center gap-7" aria-label="Primary">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex min-h-11 items-center text-[15px] font-semibold underline-offset-8 transition-colors duration-150 hover:text-forest hover:underline ${
                  isCurrent(item) ? "text-forest underline decoration-forest decoration-2" : "text-ink decoration-1"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 border-l border-ink/12 pl-5">
            <MotionSwitch tone="light" compact />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-forest transition-colors duration-150 hover:bg-forest/8"
              aria-label="Search the site"
              onClick={() => searchRef.current?.showModal()}
            >
              <Search {...ICON} size={19} />
            </button>
            <Link href={CTA_HREF} className="btn btn-primary min-h-10 px-5 py-2 text-[14px] whitespace-nowrap">
              {CTA_LABEL}
            </Link>
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center text-forest lg:hidden"
          aria-expanded={drawer}
          aria-controls="mobile-menu"
          aria-label={drawer ? "Close menu" : "Open menu"}
          onClick={() => setDrawer((value) => !value)}
        >
          {drawer ? <X {...ICON} /> : <Menu {...ICON} />}
        </button>
      </div>

      {/* Full-screen tactile mobile menu with paper artifacts */}
      <div
        ref={drawerRef}
        id="mobile-menu"
        data-surface="dark"
        hidden={!drawer}
        className="menu-panel fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex-col justify-between overflow-y-auto bg-obsidian px-5 pt-6 pb-8 text-ivory md:px-8 [&:not([hidden])]:flex lg:[&:not([hidden])]:hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-repeat opacity-35"
          style={{ backgroundImage: "url(/images/sized/texture-green-1024.webp)", backgroundSize: "512px 512px" }}
        />

        <div className="relative z-10 grid gap-6 sm:grid-cols-12 sm:items-center">
          <nav aria-label="Mobile" className="sm:col-span-7">
            {items.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-14 items-baseline gap-4 border-b border-ivory/12 py-3"
                aria-current={pathname === item.href ? "page" : undefined}
                onMouseEnter={() => setHoveredMenu(item.href)}
                onFocus={() => setHoveredMenu(item.href)}
                onClick={close}
              >
                <span className="font-mono text-[12px] text-ivory/55">{`0${idx + 1}`}</span>
                <span className="font-display text-[2.35rem] leading-none font-semibold tracking-[-0.03em] text-ivory transition-colors duration-150 group-hover:text-paper">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                className="flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-ivory"
                onClick={() => searchRef.current?.showModal()}
              >
                <Search {...ICON} size={18} />
                Search the site
              </button>
              <MotionSwitch tone="dark" />
            </div>
          </nav>

          {/* Paper artifact preview inside the full-screen menu */}
          <div className="flex items-center justify-center gap-5 sm:col-span-5">
            <div className="relative w-36 sm:w-44">
              <Image
                src={activeArt.src}
                alt={activeArt.alt}
                width={960}
                height={1200}
                sizes="176px"
                className="paper-cutout h-auto w-full -rotate-3 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 border-t border-ivory/15 pt-5">
          <Link href={CTA_HREF} className="btn btn-primary w-full" onClick={close}>
            {CTA_LABEL}
          </Link>
        </div>
      </div>

      <SearchDialog dialogRef={searchRef} onNavigate={close} />
    </header>
  );
}
