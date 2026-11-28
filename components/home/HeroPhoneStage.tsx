"use client";

import { CalendarCheck, Check, PhoneMissed, RotateCcw } from "lucide-react";
import { useId, useState } from "react";

const OPTIONS = [
  {
    slots: ["Tomorrow · 6:00 a.m.", "Tomorrow · 5:30 p.m."],
    window: "tomorrow at 6 a.m. or 5:30 p.m.",
    reply: "6 a.m. works, see you tomorrow.",
    booked: "Tomorrow · 6:00 a.m. Strength Intro",
    rosterMeta: "12 / 12 spots filled",
  },
  {
    slots: ["Thu · 7:00 a.m.", "Thu · 6:00 p.m."],
    window: "Thursday at 7 a.m. or 6 p.m.",
    reply: "Thursday at 6 p.m. please.",
    booked: "Thursday · 6:00 p.m. Strength Intro",
    rosterMeta: "11 / 12 spots filled",
  },
] as const;

const WAVE_HEIGHTS = [
  8, 14, 22, 12, 28, 34, 20, 14, 30, 38, 24, 16, 32, 26, 12, 22, 34, 28, 16, 24, 18, 10, 16, 10,
];

const ROSTER_SLOTS = Array.from({ length: 12 }, (_, idx) => idx);

/**
 * High-tech signal-to-booking console in the hero:
 * live voice waveform oscilloscope, matched calendar slots, and tactile approval switch.
 */
export function HeroPhoneStage() {
  const [optionIndex, setOptionIndex] = useState(0);
  const [approved, setApproved] = useState(false);
  const gradId = `hero-wave-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const option = OPTIONS[optionIndex];
  const filledCount = optionIndex === 0 ? 12 : 11;

  return (
    <div className="hero-phone" role="region" aria-label="Missed call text-back console">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3.5 text-[13px]">
        <span className="inline-flex items-center gap-2 font-medium text-ivory">
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full ${approved ? "bg-cyan" : "pulse-dot bg-gold shadow-[0_0_10px_#ff6b4a]"}`}
          />
          <PhoneMissed aria-hidden size={14} strokeWidth={2} className="text-gold" />
          <span>Missed call · 6:15 p.m.</span>
        </span>
        <span className="font-mono text-[12px] text-muted tabular-nums">(973) 555-0148</span>
      </div>

      <div className="mt-3.5 rounded-[10px] border border-[rgb(251_246_241_/_0.1)] bg-[#0b0604] p-3.5 shadow-[inset_0_1px_0_rgb(251_246_241_/_0.05)]">
        <div className="flex items-center justify-between gap-3 text-[12px]">
          <span className="text-muted">Voicemail · 6 p.m. class</span>
          <span className="font-mono text-muted tabular-nums">00:08</span>
        </div>

        <div className="mt-2.5 overflow-hidden rounded-[6px] border border-[rgb(251_246_241_/_0.07)] bg-[#120a07] px-3 py-2">
          <svg viewBox="0 0 288 42" className="h-9 w-full" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="288" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset={0} stopColor="#FDE047" />
                <stop offset={0.52} stopColor="#F97316" />
                <stop offset={1} stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <line x1="0" y1="21" x2="288" y2="21" stroke="rgb(251 246 241 / 0.08)" strokeDasharray="2 4" />
            {WAVE_HEIGHTS.map((h, i) => (
              <rect
                key={i}
                x={6 + i * 11.7}
                y={21 - h / 2}
                width="5"
                height={h}
                rx="2.5"
                fill={`url(#${gradId})`}
                opacity={approved ? 0.42 : 0.92}
                className="wave-bar"
                data-live={approved ? "false" : "true"}
                style={{ animationDelay: `${(i % 6) * 130}ms` }}
              />
            ))}
          </svg>
        </div>

        <p className="mt-2.5 text-[14.5px] leading-snug text-ivory">
          “Hey, looking to try a morning strength class this week. Do you take drop-ins?”
        </p>
      </div>

      <div className="mt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-muted">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${approved ? "bg-gold" : "bg-cyan"}`}
            />
            {approved ? "Sent from your number" : "Draft reply · Open spots matched"}
          </span>
          <span className="flex gap-1.5 font-mono text-[11px] text-ivory">
            {option.slots.map((slot) => (
              <span
                key={slot}
                className="rounded-[4px] border border-[rgb(253_224_71_/_0.28)] bg-[rgb(253_224_71_/_0.08)] px-1.5 py-0.5 text-cyan"
              >
                {slot.split(" · ")[1]}
              </span>
            ))}
          </span>
        </div>

        <div
          className={`mt-2 rounded-[10px] border p-3.5 text-[14.5px] leading-relaxed text-ivory transition-colors ${
            approved
              ? "border-[rgb(255_107_74_/_0.38)] bg-[linear-gradient(180deg,#25140d,#150b07)]"
              : "border-[rgb(253_224_71_/_0.32)] bg-[linear-gradient(180deg,#22170e,#130c08)] shadow-[inset_3px_0_0_#fde047]"
          }`}
        >
          Sorry we missed your call. Coach Maya has intro spots open {option.window} Reply 1 or 2 to grab a spot.
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        {!approved ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setApproved(true)}
              className="copper-key min-h-11 flex-1 px-4 py-2.5 text-[14px] font-semibold"
            >
              Approve text
            </button>
            <button
              type="button"
              onClick={() => setOptionIndex((current) => (current + 1) % OPTIONS.length)}
              className="tab-chip min-h-11 px-3.5 text-[13.5px] font-medium"
            >
              Other times
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 border-t border-line pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block rounded-[8px] border border-[rgb(251_246_241_/_0.12)] bg-[rgb(251_246_241_/_0.07)] px-3 py-1.5 text-[13.5px] text-ivory">
                “{option.reply}”
              </span>
              <button
                type="button"
                onClick={() => setApproved(false)}
                className="inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-muted hover:text-ivory"
              >
                <RotateCcw aria-hidden size={13} strokeWidth={1.75} />
                Reset
              </button>
            </div>

            <div className="rounded-[9px] border border-[rgb(255_107_74_/_0.38)] bg-[rgb(255_107_74_/_0.09)] p-3">
              <div className="flex items-center justify-between gap-2 text-[13px]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ivory">
                  <CalendarCheck aria-hidden size={15} strokeWidth={2} className="text-gold" />
                  {option.booked}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11.5px] text-gold-hi">
                  <Check aria-hidden size={13} strokeWidth={2.5} />
                  Booked
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="grid flex-1 grid-cols-12 gap-1" aria-hidden>
                  {ROSTER_SLOTS.map((idx) => {
                    const isNew = idx === filledCount - 1;
                    const isFilled = idx < filledCount;
                    return (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-[2px] ${
                          isNew
                            ? "bg-gold shadow-[0_0_8px_#ff6b4a]"
                            : isFilled
                              ? "bg-[rgb(253_224_71_/_0.65)]"
                              : "bg-[rgb(251_246_241_/_0.12)]"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] text-muted tabular-nums">{option.rosterMeta}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
