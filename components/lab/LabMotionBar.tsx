"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { useMotion } from "@/components/workflow/hooks";

const OPTIONS = [
  { id: "a", href: "/lab/a", label: "A · Suspended Field" },
  { id: "b", href: "/lab/b", label: "B · Daylight Broadsheet" },
  { id: "c", href: "/lab/c", label: "C · Table & Gate" },
] as const;

export function LabMotionBar({
  active,
  paused,
  onTogglePause,
  tone = "light",
}: {
  active: "a" | "b" | "c";
  paused: boolean;
  onTogglePause: () => void;
  tone?: "light" | "dark";
}) {
  const [motion, setMotion] = useMotion();
  const dark = tone === "dark";

  return (
    <div
      className={`border-b ${
        dark ? "border-ivory/15 bg-obsidian text-ivory" : "border-ink/12 bg-paper text-ink"
      }`}
    >
      <div className="wrap flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 text-[13px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`lab-mono mr-2 text-[11px] uppercase tracking-[0.14em] ${dark ? "text-ivory/65" : "text-slate"}`}>
            Opening studies
          </span>
          {OPTIONS.map((opt) => {
            const current = opt.id === active;
            return (
              <Link
                key={opt.id}
                href={opt.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-9 items-center px-3 font-medium transition-colors duration-150 ${
                  current
                    ? dark
                      ? "bg-ivory text-obsidian"
                      : "bg-forest text-ivory"
                    : dark
                      ? "text-ivory/75 hover:bg-ivory/10 hover:text-ivory"
                      : "text-slate hover:bg-forest/10 hover:text-forest"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {motion ? (
            <button
              type="button"
              onClick={onTogglePause}
              className={`inline-flex min-h-9 items-center gap-1.5 px-2.5 font-medium ${
                dark ? "text-ivory/80 hover:text-ivory" : "text-slate hover:text-forest"
              }`}
            >
              {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
              {paused ? "Resume drift" : "Pause drift"}
            </button>
          ) : null}
          <button
            type="button"
            role="switch"
            aria-checked={motion}
            onClick={() => setMotion(!motion)}
            className="inline-flex min-h-9 items-center gap-2.5 font-semibold"
          >
            <span>Motion</span>
            <span
              aria-hidden
              className={`relative h-5 w-9 border ${dark ? "border-ivory/70" : "border-forest"}`}
            >
              <span
                className={`absolute top-0.5 h-3.5 w-3.5 transition-transform duration-150 ${
                  dark ? "bg-ivory" : "bg-forest"
                } ${motion ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
