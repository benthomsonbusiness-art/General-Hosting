"use client";

import type { ComponentType, CSSProperties } from "react";
import {
  Confidence,
  Dots,
  Draft,
  during,
  Fact,
  finished,
  From,
  Label,
  Mark,
  reached,
  Rise,
  Show,
  Stamp,
  Tick,
  Typed,
  Week,
  type SceneProps,
} from "../scene-parts";
import { LeadScene } from "./Lead";

const BARS = [18, 34, 22, 46, 30, 58, 40, 26, 50, 36, 62, 28, 44, 20, 38, 54, 24, 32, 48, 30, 42, 22, 56, 34];

/** A call becomes priced lines, checked against a floor, then a signed page. */
function ProposalScene({ state, scenario }: SceneProps) {
  const thin = scenario.id === "thin";
  const r = (n: number) => reached(state, n);
  const lines = [
    { time: "08:10", item: "Monthly reporting pack", units: "60 units" },
    { time: "19:40", item: "Two review rounds", units: "40 units" },
  ];
  return (
    <div>
      <div className="flex items-center gap-5">
        <Label>Discovery call</Label>
        <svg viewBox="0 0 288 40" aria-hidden className="h-10 min-w-0 flex-1" preserveAspectRatio="none">
          {BARS.map((h, i) => (
            <rect
              key={i}
              x={i * 12 + 3}
              y={20 - h / 3.4}
              width={5}
              height={h / 1.7}
              className="scene-fade"
              fill={(i === 6 || i === 15) && r(1) ? "#7D6128" : r(0) ? "#133224" : "#C9C4B6"}
              style={{ "--delay": `${r(0) ? i * 25 : 0}ms` } as CSSProperties}
            />
          ))}
        </svg>
      </div>
      <div className="mt-4 border-t-2 border-forest pt-4">
        <div className="relative flex min-h-12 flex-wrap items-center gap-x-4">
          <div>
            <p className="font-display text-[1.9rem] leading-none text-forest">
              {r(3) ? "Proposal" : "What they asked for"}
            </p>
            <p className="mt-1 text-[14px] text-slate">Northfield Studio (sample)</p>
          </div>
          <Stamp on={finished(state)}>Invoice matches</Stamp>
        </div>
        <div className="mt-3">
          {lines.map((line, i) => (
            <Show key={line.item} on={r(1)} delay={i * 350} className="flex min-h-10 items-baseline gap-4 py-1.5">
              <span className="text-[14px] text-forest">{line.time}</span>
              <span className="text-[17px]">{line.item}</span>
              <Show on={r(2)} delay={i * 200} className="ml-auto shrink-0 font-semibold whitespace-nowrap text-forest">
                {line.units}
              </Show>
            </Show>
          ))}
        </div>
      </div>
      <div className="mt-3 grid items-end gap-x-8 gap-y-4 sm:grid-cols-2">
        <div>
          <Label>Margin</Label>
          <div className="relative mt-1.5 h-6 bg-ink/10">
            <div
              className={`scene-grow h-full origin-left ${thin ? "bg-forest" : "bg-forest"}`}
              style={{ transform: `scaleX(${r(2) ? (thin ? 0.28 : 0.72) : 0})` }}
            />
            <span aria-hidden className="absolute -inset-y-1 left-[42%] w-0.5 bg-forest" />
          </div>
          <p className="mt-1 pl-[42%] text-[13px] text-slate">Floor</p>
        </div>
        <div className="pb-1">
          <svg viewBox="0 0 200 50" aria-hidden className="h-11 w-44">
            <path
              d="M6 36C20 6 30 4 34 22S20 46 34 34 58 14 62 28s10 10 18-4 12 18 24 10 20-18 30-6 22 8 52-2"
              fill="none"
              stroke="#133224"
              strokeWidth="2"
              pathLength={1}
              className={`scene-draw ${r(5) ? "scene-draw-on" : ""}`}
            />
          </svg>
          <div className="h-px bg-ink/30" />
          <p className="mt-1 text-[13px] text-slate">Client signature (sample)</p>
        </div>
      </div>
    </div>
  );
}

/** A signature opens a workspace piece by piece. */
function OnboardingScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const missing = scenario.id === "missing";
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <From name="Cedar Row" meta="New client (sample)" />
        <Fact on={r(0)}>Contract signed</Fact>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
        <Tick on={r(1)}>Contacts</Tick>
        <Tick on={r(1)} delay={200}>
          Goals
        </Tick>
        <Tick on={r(1) && !missing} delay={400}>
          Billing details
        </Tick>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["Folder", "Project", "Tasks", "Calendar"].map((tile, i) => (
          <div
            key={tile}
            className={`scene-tile grid h-14 place-items-center text-[15px] font-semibold ${r(2) ? "scene-tile-on" : ""}`}
            style={{ "--delay": `${r(2) ? i * 180 : 0}ms` } as CSSProperties}
          >
            {tile}
          </div>
        ))}
      </div>
      <Rise on={r(3)} className="mt-4 min-h-[9.6rem] sm:min-h-[7.6rem]">
        <Draft
          state={state}
          draft={draft}
          onDraft={onDraft}
          label="Welcome draft. Edit it if you like."
          sent="Sent by you (sample)"
        />
      </Rise>
      <Show on={r(5)} className="mt-3">
        <Week on={r(5)} day={2} />
      </Show>
    </div>
  );
}

/** Three sources rise into one morning message. Every line points back to a row. */
function BriefScene({ state, scenario }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const down = scenario.id === "gap";
  const sources = [
    { name: "Billing", bars: [40, 62, 54, 78], flag: -1 },
    { name: "Accounting", bars: [66, 58, 62, 24], flag: 3 },
    { name: "CRM", bars: [30, 44, 52, 60], flag: -1 },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {sources.map((source, s) => {
          const off = down && s === 2;
          return (
            <div key={source.name}>
              <div className="flex h-20 items-end gap-1 border-b border-ink/30">
                {source.bars.map((height, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="scene-grow flex-1 origin-bottom"
                    style={{
                      height: `${height}%`,
                      transform: `scaleY(${r(1) && !off ? 1 : 0.04})`,
                      background: r(2) && i === source.flag ? "#1A1E1B" : "#133224",
                    }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[15px] font-semibold text-forest">{source.name}</p>
              <p className="text-[14px] text-slate">{r(1) ? (off ? "Did not load" : "Loaded") : "Waiting"}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 min-h-[11rem]">
        <div className="relative">
          <From name="Daily Brief" meta="6:30 a.m. (sample)" />
          <Stamp on={finished(state)}>Delivered inside</Stamp>
        </div>
        <div className="mt-3 sm:pl-14">
          {during(state, 1) || during(state, 2) ? <Dots /> : null}
          {r(3) ? (
            <div className="space-y-2 bg-ink/5 px-4 py-3">
              <Typed
                on
                text={down ? "CRM did not load. Pipeline was not checked." : "All three sources loaded."}
                className={down ? "font-semibold text-ink" : ""}
              />
              <p>
                <Mark on>One invoice passed its due date.</Mark>{" "}
                <span className="text-[14px] text-forest">Accounting, row 41</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** One invoice stays on screen while it is read, matched and caught out by a line. */
function InvoiceScene({ state, scenario }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const poor = scenario.id === "scan";
  const resolved = r(4);
  const lines = [
    { item: "Brackets", qty: "4", units: 100 },
    { item: "Panels", qty: "10", units: 150 },
    { item: "Fixings", qty: "2", units: 50 },
  ];
  const caught = r(2) && !poor;
  return (
    <div className="relative">
      {during(state, 1) ? <span aria-hidden className="scene-scan" /> : null}
      <div className={poor && !r(2) ? "blur-[1.5px]" : ""}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b-2 border-forest pb-3">
          <p className="font-display text-[1.9rem] leading-none text-forest">Invoice</p>
          <Label>Fieldstone Supply (sample)</Label>
        </div>
        {lines.map((line, i) => {
          const bad = i === 1 && caught;
          return (
            <div key={line.item}>
              <div
                className={`scene-fade flex min-h-11 items-center justify-between gap-3 px-3 text-[17px] ${
                  bad ? (resolved ? "bg-forest/10" : "bg-ink/10") : ""
                }`}
              >
                <Mark on={r(1) && !poor && !bad}>{line.item}</Mark>
                <span className="ml-auto text-slate">{line.qty}</span>
                <span className="w-16 text-right font-semibold">{line.units}</span>
              </div>
              {i === 1 ? (
                <div aria-hidden={!caught} className={`scene-open ${caught ? "scene-open-on" : ""}`}>
                  <p className={`px-3 text-[15px] font-semibold ${resolved ? "bg-forest/10 text-forest" : "bg-ink/10 text-obsidian"}`}>
                    {resolved ? "Exception resolved by you" : "Ordered 10, received 9"}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
        <div className="flex min-h-11 items-center justify-between border-t border-ink/30 px-3 text-[17px] font-bold text-forest">
          <span>Total</span>
          <span>300</span>
        </div>
      </div>
      <div className="mt-3 flex min-h-9 flex-wrap gap-2">
        <Fact on={r(1)} tone={poor ? "gold" : "stone"}>
          {poor ? "Hard to read" : "Lines add up"}
        </Fact>
        <Confidence value={scenario.confidence} on={r(1)} />
        <Fact on={r(5)}>Batch approved by you</Fact>
      </div>
      <Stamp on={finished(state)}>Scheduled</Stamp>
    </div>
  );
}

/** A ticket gets its labels, its articles, and a reply an agent sends. */
function SupportScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const unclear = scenario.id === "unclear";
  const lanes = ["Billing", "Exchanges", "Needs triage"];
  const target = unclear ? 2 : 1;
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {lanes.map((lane, i) => (
          <p
            key={lane}
            className={`scene-fade flex min-h-11 items-center justify-center px-1 text-center text-[14px] font-semibold sm:text-[15px] ${
              r(1) && i === target ? "bg-forest text-ivory" : "bg-ink/5 text-slate"
            }`}
          >
            {lane}
          </p>
        ))}
      </div>
      <div className="mt-4">
        <From name="L. Chen" meta="Customer (sample)" />
        <p className="mt-2.5 font-display text-[1.5rem] leading-snug text-forest sm:pl-14">
          {unclear ? (
            "It did the thing again."
          ) : (
            <>
              My order <Mark on={r(1)}>arrived in the wrong size</Mark>. Can I swap it?
            </>
          )}
        </p>
      </div>
      <div className="mt-3 flex min-h-9 flex-wrap gap-2 sm:pl-14">
        <Fact on={r(2)}>Exchange policy</Fact>
        <Fact on={r(2)} delay={250}>
          Size guide
        </Fact>
        <Confidence value={scenario.confidence} on={r(1)} />
      </div>
      <Rise on={r(2)} className="mt-4 min-h-[9.6rem] sm:min-h-[7.6rem]">
        <Draft
          state={state}
          draft={draft}
          onDraft={onDraft}
          label="Reply draft. Edit it if you like."
          sent="Sent by you (sample)"
        />
      </Rise>
    </div>
  );
}

const SPIKE = "M0 120L60 112L120 118L180 104L240 110L300 100L360 106L420 40L480 52";
const STEADY = "M0 120L60 112L120 118L180 104L240 110L300 100L360 106L420 98L480 102";

/** A week of cost against its usual band. Budgets never move. */
function AdsScene({ state, scenario }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const spike = scenario.id === "spike";
  return (
    <div className="relative">
      <Label>Cost per result, sample account</Label>
      <svg viewBox="0 20 480 120" aria-hidden className="mt-1 w-full">
        <path d="M0 134L480 118V82L0 98Z" fill="#133224" opacity={r(1) ? 0.18 : 0} className="scene-fade" />
        <path
          d={spike ? SPIKE : STEADY}
          fill="none"
          stroke="#133224"
          strokeWidth="3"
          strokeLinejoin="round"
          pathLength={1}
          className={`scene-draw ${r(0) ? "scene-draw-on" : ""}`}
        />
        {spike ? (
          <circle
            cx="420"
            cy="40"
            r="15"
            fill="none"
            stroke="#7D6128"
            strokeWidth="3"
            className="scene-fade"
            opacity={r(1) ? 1 : 0}
          />
        ) : null}
      </svg>
      <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`scene-fade h-9 ${i === 2 && spike && r(2) ? "bg-forest" : "bg-ink/5"}`}
            style={{ clipPath: "polygon(12% 0,100% 0,88% 100%,0 100%)" }}
          />
        ))}
      </div>
      <Show on={r(2)} className="mt-1.5 text-[14px] text-slate">
        {spike ? "One ad is wearing out. Nothing was paused." : "No ad needs review."}
      </Show>
      <div className="mt-3 min-h-[5.5rem] border-l-4 border-forest bg-ink/5 px-4 py-3">
        <p className="text-[14px] font-semibold text-forest">Weekly brief</p>
        <Typed
          on={r(3)}
          text={
            spike
              ? "Cost rose above its usual band on one day. Budgets were not changed."
              : "Cost stayed inside its usual band. Budgets were not changed."
          }
          className="mt-1 font-display sm:pr-36 text-[1.3rem] leading-snug text-forest"
        />
      </div>
      <Stamp on={finished(state)}>Posted inside</Stamp>
    </div>
  );
}

/** Evidence is marked and private details are blacked out. People decide. */
function RecruitingScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const thin = scenario.id === "thin";
  const hidden = `scene-redact ${r(0) ? "scene-redact-on" : ""}`;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b-2 border-forest pb-3">
        <p className="font-display text-[1.9rem] leading-none text-forest">Candidate 700</p>
        <Label>Application (sample)</Label>
      </div>
      <div className="mt-3 text-[16px] leading-[1.75]">
        <p>
          Age: <span className={hidden}>on file</span> Address: <span className={hidden}>on file here</span>
        </p>
        {thin ? (
          <p>Worked in operations.</p>
        ) : (
          <>
            <p>
              <Mark on={r(1)}>Scheduled crews across four sites</Mark> for two seasons.
            </p>
            <p>
              Built the <Mark on={r(1)}>weekly handover checklist</Mark>.
            </p>
          </>
        )}
      </div>
      <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-3">
        <Tick on={r(1) && !thin}>Scheduling</Tick>
        <Tick on={r(1) && !thin} delay={250}>
          Process writing
        </Tick>
        <Tick on={false}>Vendor contact</Tick>
      </div>
      <div className="mt-2 flex min-h-9 flex-wrap gap-2">
        <Confidence value={scenario.confidence} on={r(1)} />
        <Fact on={r(3)}>Advanced by you</Fact>
      </div>
      <Rise on={r(3)} className="mt-3 min-h-[9.6rem] sm:min-h-[7.6rem]">
        {r(4) ? (
          <Week on day={3} />
        ) : (
          <Draft
            state={state}
            draft={draft}
            onDraft={onDraft}
            label="Message draft. Edit it if you like."
            sent="Sent by you (sample)"
          />
        )}
        {r(4) ? <p className="mt-2 text-[15px] font-semibold text-forest">Interview booked, invited by you</p> : null}
      </Rise>
    </div>
  );
}

export const SCENES: Record<string, ComponentType<SceneProps>> = {
  "lead-triage": LeadScene,
  "proposal-ops": ProposalScene,
  "client-onboarding": OnboardingScene,
  "daily-brief": BriefScene,
  "ap-intake": InvoiceScene,
  "support-routing": SupportScene,
  "meta-ads-reporting": AdsScene,
  "recruiting-screen": RecruitingScene,
};
