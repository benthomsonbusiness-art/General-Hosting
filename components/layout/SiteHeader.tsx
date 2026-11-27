"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { SearchDialog } from "@/components/nav/SearchDialog";
import { DRAWER_LINKS, type NavItem } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

export function SiteHeader({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let raf = 0;
    const inspect = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(inspect);
    };
    inspect();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname]);

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
  /** "page" on the item's own page, "true" inside its section (a workflow, a service), so the underline and the state agree. */
  const current = (item: NavItem) => (pathname === item.href ? "page" : isCurrent(item) ? "true" : undefined);

  return (
    <header
      data-surface="dark"
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 border-b ${scrolled ? "border-line bg-forest" : "border-transparent bg-obsidian"}`}
    >
      <div className="wrap flex h-(--header-h) items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-3"
          aria-label="Temporant home"
          onClick={close}
        >
          <BrandMark tone="dark" className="h-9 w-9 shrink-0" />
          <span className="inline lg:max-xl:hidden">
            <BrandWordmark tone="dark" className="min-w-0 truncate text-[12px] sm:text-[14px]" />
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-6" aria-label="Primary">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current(item)}
                className={`flex min-h-11 items-center text-[15px] underline-offset-4 hover:underline ${
                  isCurrent(item) ? "underline" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 border-l border-line pl-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ivory"
              aria-label="Search the site"
              onClick={() => searchRef.current?.showModal()}
            >
              <Search {...ICON} size={19} />
            </button>
            <Link href={CTA_HREF} className="btn btn-primary ml-2 min-h-11 px-4 text-[15px]">
              {CTA_LABEL}
            </Link>
          </div>
        </div>

        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-ivory"
            aria-label="Search the site"
            onClick={() => searchRef.current?.showModal()}
          >
            <Search {...ICON} size={19} />
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center text-ivory"
            aria-expanded={drawer}
            aria-controls="mobile-menu"
            aria-label={drawer ? "Close menu" : "Open menu"}
            onClick={() => setDrawer((value) => !value)}
          >
            {drawer ? <X {...ICON} /> : <Menu {...ICON} />}
          </button>
        </div>
      </div>

      <div
        ref={drawerRef}
        id="mobile-menu"
        data-surface="dark"
        hidden={!drawer}
        className="menu-panel fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex-col overflow-y-auto bg-obsidian px-5 pt-4 pb-8 [&:not([hidden])]:flex lg:[&:not([hidden])]:hidden"
      >
        <nav aria-label="Mobile">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="h3 flex min-h-14 items-center border-b border-line"
              aria-current={current(item)}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <ul className="mt-4">
            {DRAWER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-muted underline-offset-4 hover:underline"
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={CTA_HREF} className="btn btn-primary mt-8 w-full" onClick={close}>
          {CTA_LABEL}
        </Link>
      </div>

      <SearchDialog dialogRef={searchRef} onNavigate={close} />
    </header>
  );
}
