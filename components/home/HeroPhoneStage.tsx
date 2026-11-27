"use client";

import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";

const OPTIONS = [
  {
    window: "tomorrow at 6 a.m. or 5:30 p.m.",
    reply: "6 a.m. works, see you tomorrow.",
    booked: "Booked · Tomorrow 6:00 a.m. Strength Intro",
  },
  {
    window: "Thursday at 7 a.m. or 6 p.m.",
    reply: "Thursday at 6 p.m. please.",
    booked: "Booked · Thursday 6:00 p.m. Strength Intro",
  },
] as const;

const BARS = [8, 14, 20, 14, 8];

/**
 * Clean, restrained phone approval preview in the hero.
 */
export function HeroPhoneStage() {
  const [optionIndex, setOptionIndex] = useState(0);
  const [approved, setApproved] = useState(false);

  const option = OPTIONS[optionIndex];

  return (
    <div className="hero-phone" role="region" aria-label="Missed call text-back example">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[13px]">
        <span className="font-medium text-ivory">Missed call · 6:15 p.m.</span>
        <span className="font-mono text-muted">(973) 555-0148</span>
      </div>

      <div className="border-b border-line py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted">Voicemail left during 6 p.m. class</span>
          <span aria-hidden className="inline-flex items-center gap-[3px]">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-violet"
                style={{ height: `${h}px`, opacity: approved ? 0.4 : 0.85 }}
              />
            ))}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-snug text-ivory">
          “Hey, looking to try a morning strength class this week. Do you take drop-ins?”
        </p>
      </div>

      <div className="py-3.5">
        <p className="text-[13px] text-muted">{approved ? "Sent from your number" : "Draft reply"}</p>
        <p className="mt-2 rounded-[8px] border border-line bg-[#18100c] p-3.5 text-[15px] leading-relaxed text-ivory">
          Sorry we missed your call. Coach Maya has intro spots open {option.window} Reply 1 or 2 to grab a spot.
        </p>
      </div>

      <div aria-live="polite">
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
              className="min-h-11 rounded-[6px] border border-line px-3.5 text-[14px] font-medium text-ivory hover:border-ivory"
            >
              Other times
            </button>
          </div>
        ) : (
          <div className="space-y-3 border-t border-line pt-3.5">
            <p className="inline-block rounded-[8px] bg-[rgb(251_246_241_/_0.07)] px-3.5 py-2 text-[14px] text-ivory">
              “{option.reply}”
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ivory">
                <Check aria-hidden size={16} strokeWidth={2.25} className="text-gold" />
                {option.booked}
              </span>
              <button
                type="button"
                onClick={() => setApproved(false)}
                className="inline-flex min-h-9 items-center gap-1.5 text-[13px] text-muted hover:text-ivory"
              >
                <RotateCcw aria-hidden size={13} strokeWidth={1.75} />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
