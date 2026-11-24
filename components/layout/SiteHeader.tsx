"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand/BrandMark";
import { SearchDialog } from "@/components/nav/SearchDialog";
import type { NavPanel } from "@/content/site-nav";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

export function SiteHeader({ panels }: { panels: NavPanel[] }) {
  const pathname = usePathname();
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mega-menu: close on an outside press and on Escape.
  useEffect(() => {
    if (!openPanel) return;
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenPanel(null);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      triggers.current[openPanel]?.focus();
      setOpenPanel(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openPanel]);

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

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !searchRef.current?.open) {
        setDrawer(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current || !toggleRef.current) return;
      const items = [
        toggleRef.current,
        ...[...drawerRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
          (item) => item.offsetParent !== null,
        ),
      ];
      const first = items[0];
      const last = items[items.length - 1];
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

  function panelLinks(id: string) {
    return [...(panelRefs.current[id]?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
  }

  function openAndFocus(id: string, last = false) {
    setOpenPanel(id);
    window.requestAnimationFrame(() => {
      const links = panelLinks(id);
      links[last ? links.length - 1 : 0]?.focus();
    });
  }

  function onTriggerKey(event: KeyboardEvent, id: string) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocus(id);
    }
  }

  function onPanelKey(event: KeyboardEvent, id: string) {
    const links = panelLinks(id);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    let next = -1;
    if (event.key === "ArrowDown") next = (index + 1) % links.length;
    else if (event.key === "ArrowUp") next = (index - 1 + links.length) % links.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = links.length - 1;
    if (next < 0) return;
    event.preventDefault();
    links[next]?.focus();
  }

  function closeAll() {
    setOpenPanel(null);
    setDrawer(false);
  }

  function openSearch() {
    setOpenPanel(null);
    searchRef.current?.showModal();
  }

  const isCurrent = (panel: NavPanel) =>
    panel.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return (
    <header
      ref={headerRef}
      data-surface="light"
      className={`sticky top-0 z-50 border-b bg-ivory transition-colors duration-200 ${
        scrolled || openPanel || drawer ? "border-rule" : "border-transparent"
      }`}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next)) setOpenPanel(null);
      }}
    >
      <div className="wrap flex h-(--header-h) items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-3"
          aria-label="Valentini & Co. home"
          onClick={closeAll}
        >
          <BrandMark tone="light" className="h-9 w-9 shrink-0" />
          <BrandWordmark tone="light" className="min-w-0 truncate text-[12px] sm:text-[14px]" />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {panels.map((panel) => {
            const open = openPanel === panel.id;
            return (
              <button
                key={panel.id}
                ref={(node) => {
                  triggers.current[panel.id] = node;
                }}
                type="button"
                aria-expanded={open}
                aria-controls={`menu-${panel.id}`}
                className={`flex min-h-11 items-center gap-1.5 border-b-2 px-2.5 text-[15px] font-semibold xl:px-3.5 ${
                  isCurrent(panel) || open
                    ? "border-gold text-forest"
                    : "border-transparent text-ink hover:text-forest"
                }`}
                onClick={() => setOpenPanel(open ? null : panel.id)}
                onKeyDown={(event) => onTriggerKey(event, panel.id)}
              >
                {panel.label}
                <ChevronDown
                  {...ICON}
                  size={16}
                  className={`transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                />
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-forest"
            aria-label="Search the site"
            onClick={openSearch}
          >
            <Search {...ICON} size={20} />
          </button>
          <Link
            href={CTA_HREF}
            className="btn btn-secondary min-h-11 px-4 py-2 text-[14px] whitespace-nowrap"
            onClick={closeAll}
          >
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

      {panels.map((panel) => (
        <div
          key={panel.id}
          ref={(node) => {
            panelRefs.current[panel.id] = node;
          }}
          id={`menu-${panel.id}`}
          hidden={openPanel !== panel.id}
          className="menu-panel absolute inset-x-0 top-full hidden max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-rule bg-ivory [&:not([hidden])]:lg:block"
          onKeyDown={(event) => onPanelKey(event, panel.id)}
        >
          <div className="wrap grid grid-cols-12 gap-x-8 pt-8 pb-10">
            {panel.columns.map((column) => {
              const wide = column.links.length > 5;
              const span =
                panel.columns.length === 1 ? "col-span-8" : panel.feature ? "col-span-4" : "col-span-5";
              return (
                <div key={column.heading} className={span}>
                  <p className="flex items-baseline gap-3 border-b border-rule pb-3 text-[15px] font-bold text-forest">
                    {column.heading}
                    {column.tag ? <span className="eyebrow">{column.tag}</span> : null}
                  </p>
                  <ul className={`mt-2 ${wide ? "columns-2 gap-8" : ""}`}>
                    {column.links.map((link) => (
                      <li key={link.href} className="break-inside-avoid">
                        <MenuLink link={link} current={pathname === link.href} onNavigate={closeAll} />
                      </li>
                    ))}
                  </ul>
                  {column.more ? (
                    <Link
                      href={column.more.href}
                      className="arrow-link mt-3 min-h-11 items-center text-[15px]"
                      onClick={closeAll}
                    >
                      {column.more.label}
                    </Link>
                  ) : null}
                </div>
              );
            })}
            {panel.feature ? (
              <div className="col-span-4 grid grid-cols-5 bg-stone">
                <div className="relative col-span-2 min-h-44">
                  <Image
                    src={panel.feature.image}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                    style={{ objectPosition: "30% center" }}
                  />
                </div>
                <div className="col-span-3 p-5">
                  <p className="text-[15px] font-bold text-forest">{panel.feature.heading}</p>
                  <p className="mt-2 text-[14px] leading-6 text-ink">{panel.feature.body}</p>
                  <Link
                    href={panel.feature.link.href}
                    className="arrow-link mt-3 min-h-11 items-center text-[15px]"
                    onClick={closeAll}
                  >
                    {panel.feature.link.label}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div
        ref={drawerRef}
        id="mobile-menu"
        hidden={!drawer}
        className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex-col bg-ivory [&:not([hidden])]:flex lg:[&:not([hidden])]:hidden"
      >
        <nav className="flex-1 overflow-y-auto px-5 pb-8 md:px-8" aria-label="Mobile">
          <button
            type="button"
            className="mt-4 flex min-h-12 w-full items-center gap-3 border border-ink/40 px-4 text-left text-slate"
            onClick={openSearch}
          >
            <Search {...ICON} size={20} />
            Search the site
          </button>
          <div className="mt-4 border-t border-rule">
            {panels.map((panel) => (
              <details key={panel.id} name="mobile-menu" className="group/item border-b border-rule">
                <summary
                  className="flex min-h-14 items-center justify-between text-[18px] font-semibold text-forest"
                >
                  {panel.label}
                  <ChevronDown
                    {...ICON}
                    size={20}
                    className="transition-transform group-open/item:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <div className="pb-5">
                  {panel.columns.map((column) => (
                    <div key={column.heading} className="mt-2 first:mt-0">
                      {panel.columns.length > 1 ? (
                        <p className="small pt-2 text-slate">
                          {column.heading}
                          {column.tag ? ` (${column.tag.toLowerCase()})` : ""}
                        </p>
                      ) : null}
                      <ul>
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <MenuLink link={link} current={pathname === link.href} onNavigate={closeAll} />
                          </li>
                        ))}
                      </ul>
                      {column.more ? (
                        <Link
                          href={column.more.href}
                          className="arrow-link min-h-11 items-center"
                          onClick={closeAll}
                        >
                          {column.more.label}
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </nav>
        <div className="border-t border-rule bg-ivory px-5 py-4 md:px-8">
          <Link href={CTA_HREF} className="btn btn-primary w-full" onClick={closeAll}>
            {CTA_LABEL}
          </Link>
        </div>
      </div>

      <SearchDialog dialogRef={searchRef} onNavigate={closeAll} />
    </header>
  );
}

function MenuLink({
  link,
  current,
  onNavigate,
}: {
  link: { label: string; href: string; note?: string };
  current: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      aria-current={current ? "page" : undefined}
      className="flex min-h-11 flex-col justify-center py-1.5 text-[15px] leading-snug text-ink underline-offset-4 hover:text-forest hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-forest"
      onClick={onNavigate}
    >
      {link.note ? <span className="eyebrow mb-0.5 text-[11px]">{link.note}</span> : null}
      {link.label}
    </Link>
  );
}
