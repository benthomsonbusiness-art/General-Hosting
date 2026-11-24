"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { SearchDialog } from "@/components/nav/SearchDialog";
import type { NavItem } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

export function SiteHeader({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);

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

  return (
    <header data-surface="light" className="sticky top-0 z-50 bg-ivory">
      <div className="wrap flex h-(--header-h) items-center justify-between gap-6">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-3"
          aria-label="Valentini & Co. home"
          onClick={close}
        >
          <BrandMark tone="light" className="h-9 w-9 shrink-0" />
          <BrandWordmark tone="light" className="min-w-0 truncate text-[12px] sm:text-[14px]" />
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          <nav className="flex items-center gap-9" aria-label="Primary">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex min-h-11 items-center text-[15px] font-semibold underline-offset-8 hover:underline ${
                  isCurrent(item) ? "text-forest underline decoration-gold decoration-2" : "text-ink decoration-1"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-forest"
            aria-label="Search the site"
            onClick={() => searchRef.current?.showModal()}
          >
            <Search {...ICON} size={20} />
          </button>
          <Link href={CTA_HREF} className="btn btn-primary min-h-11 px-5 py-2 text-[14px] whitespace-nowrap">
            {CTA_LABEL}
          </Link>
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

      <div
        ref={drawerRef}
        id="mobile-menu"
        hidden={!drawer}
        className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex-col justify-between overflow-y-auto bg-ivory px-5 pb-6 md:px-8 [&:not([hidden])]:flex lg:[&:not([hidden])]:hidden"
      >
        <nav aria-label="Mobile" className="pt-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 font-display text-[2.75rem] leading-tight text-forest"
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="mt-6 flex min-h-12 items-center gap-3 font-semibold text-forest"
            onClick={() => searchRef.current?.showModal()}
          >
            <Search {...ICON} size={20} />
            Search the site
          </button>
        </nav>
        <Link href={CTA_HREF} className="btn btn-primary mt-8 w-full" onClick={close}>
          {CTA_LABEL}
        </Link>
      </div>

      <SearchDialog dialogRef={searchRef} onNavigate={close} />
    </header>
  );
}
