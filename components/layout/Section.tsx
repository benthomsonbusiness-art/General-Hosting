import type { ReactNode } from "react";

export type Surface = "paper" | "ivory" | "stone" | "forest" | "moss" | "obsidian" | "well";

const FILL: Record<Surface, string> = {
  paper: "bg-obsidian",
  ivory: "bg-ivory text-ink",
  stone: "bg-obsidian",
  forest: "bg-forest",
  moss: "bg-forest",
  obsidian: "bg-obsidian",
  well: "bg-well",
};

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`wrap ${className}`}>{children}</div>;
}

export function Section({
  surface = "paper",
  id,
  labelledBy,
  className = "",
  flush = false,
  children,
}: {
  surface?: Surface;
  id?: string;
  labelledBy?: string;
  className?: string;
  /** Drops the vertical band padding. */
  flush?: boolean;
  children: ReactNode;
}) {
  const dark = surface !== "ivory";
  return (
    <section
      id={id}
      tabIndex={id ? -1 : undefined}
      aria-labelledby={labelledBy}
      data-surface={dark ? "dark" : "light"}
      className={`${FILL[surface]} ${flush ? "" : "band"} outline-none ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  lede,
  action,
  className = "",
}: {
  id?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-12 gap-y-5 ${className}`}>
      <div className="max-w-[44rem]">
        <h2 id={id} className="h2">
          {title}
        </h2>
        {lede ? <p className="lead mt-4 text-muted">{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}
