"use client";

import { Check, PhoneMissed, RotateCcw, Sparkles, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SLOTS = [
  {
    window: "Tuesday 8 to 10 a.m. or 1 to 3 p.m.",
    tech: "Marco",
    booked: "Tuesday 8 to 10 a.m. with Marco",
  },
  {
    window: "Tuesday 10 to 12 p.m. or Wednesday 8 to 10 a.m.",
    tech: "Devon",
    booked: "Tuesday 10 to 12 p.m. with Devon",
  },
] as const;

const WAVE_HEIGHTS = [10, 15, 19, 24, 19, 15, 10];
const WAVE_COLORS = ["#FDE047", "#FCD34D", "#FB923C", "#F97316", "#FB7185", "#EF4444", "#EF4444"];
const WAVE_DELAYS = ["0ms", "120ms", "240ms", "360ms", "240ms", "120ms", "0ms"];

/**
 * Interactive missed-call-to-approved-SMS console on the home hero.
 * Visitors can swap the suggested tech window and press the tactile approval key.
 */
export function HeroPhoneStage() {
  const [slotIndex, setSlotIndex] = useState(0);
  const [approved, setApproved] = useState(false);
  const [pressing, setPressing] = useState(false);

  const slot = SLOTS[slotIndex];

  const approve = useCallback(() => {
    if (approved) return;
    setPressing(true);
    window.setTimeout(() => {
      setPressing(false);
      setApproved(true);
    }, 150);
  }, [approved]);

  function reset() {
    setApproved(false);
    setPressing(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (approved) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "a" || event.key === "A") {
        if (window.scrollY < 600) {
          approve();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [approved, approve]);

  return (
    <figure
      className={`hero-phone ${pressing ? "hero-phone-burst" : ""}`}
      aria-label="Interactive example: approve a missed-call text from your phone"
    >
      <div className="hero-phone-bar">
        <div className="flex items-center gap-1.5 text-[12px] sm:gap-2 sm:text-[13px]">
          <span className="font-mono text-muted">6:12 p.m.</span>
          <span aria-hidden className="text-muted/50">·</span>
          <span className="font-mono text-ivory">(973) 555-0148</span>
        </div>
        <span className="hero-phone-pill" data-approved={approved ? "" : undefined}>
          {approved ? (
            <>
              <Check aria-hidden size={12} strokeWidth={2.5} />
              Booked
            </>
          ) : (
            <>
              <UserCheck aria-hidden size={12} strokeWidth={2} />
              Waiting for you
            </>
          )}
        </span>
      </div>

      <div className="hero-phone-call">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ivory">
            <PhoneMissed aria-hidden size={15} strokeWidth={1.75} className="text-gold" />
            Missed call · Voicemail (0:06)
          </span>
          <span
            aria-hidden
            className={`hero-waveform ${approved ? "hero-waveform-still" : ""}`}
          >
            {WAVE_HEIGHTS.map((height, index) => (
              <span
                key={index}
                className="hero-wave-bar"
                style={{
                  height: `${height}px`,
                  backgroundColor: WAVE_COLORS[index],
                  animationDelay: WAVE_DELAYS[index],
                }}
              />
            ))}
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted italic">
          “Hi, our AC stopped blowing cold air upstairs. Can someone come out tomorrow morning?”
        </p>
      </div>

      <div className="hero-phone-draft">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-cyan">
            <Sparkles aria-hidden size={14} strokeWidth={1.75} />
            AI draft · Checked ServiceTitan
          </span>
          <span className="font-mono text-muted">00:14s</span>
        </div>
        <p className="mt-2.5 text-[14px] leading-relaxed text-ivory">
          “Sorry we missed your call. We serve Morristown, and our tech {slot.tech} has{" "}
          <span className="font-semibold underline decoration-[rgb(253_224_71_/_0.65)] underline-offset-3">
            {slot.window}
          </span>{" "}
          open. Reply 1 or 2 to pick a time.”
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
          <span className="rounded bg-[rgb(251_246_241_/_0.05)] px-2 py-0.5 border border-line">Zip 07960 in area</span>
          <span className="rounded bg-[rgb(251_246_241_/_0.05)] px-2 py-0.5 border border-line">{slot.tech} open</span>
        </div>
      </div>

      <div aria-live="polite" className="pt-1">
        {!approved ? (
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={approve}
                className={`copper-key flex-1 min-h-11 px-4 py-2.5 text-[14px] font-semibold ${
                  pressing ? "copper-key-pressed" : ""
                }`}
              >
                <UserCheck aria-hidden size={16} strokeWidth={2} />
                <span>Approve and send text</span>
                <kbd aria-hidden className="hidden sm:inline-block rounded bg-[rgb(20_12_8_/_0.18)] px-1.5 py-0.5 font-mono text-[11px]">
                  A
                </kbd>
              </button>
              <button
                type="button"
                onClick={() => setSlotIndex((current) => (current + 1) % SLOTS.length)}
                className="min-h-11 rounded-[6px] border border-line px-3 text-[13px] font-medium text-ivory hover:border-ivory"
              >
                Swap time
              </button>
            </div>
            <figcaption className="mt-2.5 text-center text-[12px] text-muted">
              Try tapping Approve. Nothing goes to a customer until you say yes.
            </figcaption>
          </div>
        ) : (
          <div className="hero-phone-booked">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold text-obsidian">
                  <Check aria-hidden size={13} strokeWidth={2.75} />
                </span>
                <div className="text-[13px]">
                  <p className="font-semibold text-ivory">Text sent · Caller replied “1”</p>
                  <p className="mt-0.5 text-muted">
                    Booked <span className="font-semibold text-ivory">{slot.booked}</span> and added to your board.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[6px] border border-line px-2.5 text-[12px] font-medium text-ivory hover:border-ivory"
              >
                <RotateCcw aria-hidden size={12} strokeWidth={2} />
                Replay
              </button>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}
