"use client";

import type { ComponentType, CSSProperties } from "react";
import {
  Draft,
  Fill,
  finished,
  Gauge,
  Label,
  Mark,
  Month,
  Paper,
  reached,
  Show,
  Stamp,
  Tick,
  type SceneProps,
} from "../scene-parts";
import { LeadScene } from "./Lead";

const BARS = [18, 34, 22, 46, 30, 58, 40, 26, 50, 36, 62, 28, 44, 20, 38, 54, 24, 32];

/** A call turns into a document that assembles itself, then gets signed. */
function ProposalScene({ state, scenario }: SceneProps) {
  const thin = scenario.id === "thin";
  const r = (n: number) => reached(state, n);
  return (
    <div className="grid h-full gap-4 md:grid-cols-12">
      <div className="flex flex-col justify-center md:col-span-4">
        <p className="text-[13px] text-ivory/75">Discovery call, 30 minutes</p>
        <svg viewBox="0 0 220 80" aria-hidden className="mt-3 w-full">
          {BARS.map((h, i) => {
            const cited = i === 5 || i === 10;
            return (
              <rect
                key={i}
                x={i * 12 + 2}
                y={40 - h / 2}
                width={5}
                height={h}
                className="scene-fade"
                fill={cited && r(1) ? "#C5A869" : "#F7F4EC"}
                opacity={cited && r(1) ? 1 : 0.35}
              />
            );
          })}
        </svg>
        <Show on={r(1)} className="mt-4 space-y-2 text-[15px]">
          <p>
            <span className="mr-2 text-gold">08:10</span>Monthly reporting pack
          </p>
          <p>
            <span className="mr-2 text-gold">19:40</span>Two review rounds
          </p>
        </Show>
      </div>
      <Paper className="relative md:col-span-8">
        <div className="grid h-full content-center gap-x-8 gap-y-3 sm:grid-cols-2">
          <div>
            <Show on={r(3)}>
              <p className="font-display text-[2rem] leading-none text-forest">Proposal</p>
              <Label>Northfield Studio (sample)</Label>
            </Show>
            <div className="mt-4">
              <Fill label="Reporting pack" value="60 units" on={r(2)} />
              <Fill label="Review rounds" value="40 units" on={r(2)} delay={150} />
              <Fill label="Total" value="100 units" on={r(2)} delay={300} />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5">
            <div>
              <Label>Margin</Label>
              <div className="relative mt-2 h-8 bg-ink/5">
                <div
                  className={`scene-grow h-full origin-left ${thin ? "bg-ink/40" : "bg-forest"}`}
                  style={{ transform: `scaleX(${r(2) ? (thin ? 0.28 : 0.72) : 0})` }}
                />
                <span aria-hidden className="absolute inset-y-[-4px] left-[42%] w-0.5 bg-gold-ink" />
              </div>
              <p className="mt-1.5 pl-[42%] text-[12px] text-slate">Floor</p>
            </div>
            <div>
              <svg viewBox="0 0 200 50" aria-hidden className="h-12 w-48">
                <path
                  d="M6 36C20 6 30 4 34 22S20 46 34 34 58 14 62 28s10 10 18-4 12 18 24 10 20-18 30-6 22 8 52-2"
                  fill="none"
                  stroke="#133224"
                  strokeWidth="2"
                  pathLength={1}
                  className={`scene-draw ${r(5) ? "scene-draw-on" : ""}`}
                />
              </svg>
              <div className="h-px w-48 bg-ink/30" />
              <Label>Client signature (sample)</Label>
            </div>
          </div>
        </div>
        <Stamp on={finished(state)}>Invoice matches</Stamp>
      </Paper>
    </div>
  );
}

/** A signature opens a workspace piece by piece. */
function OnboardingScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const missing = scenario.id === "missing";
  const tiles = ["Folder", "Project", "Tasks", "Access", "Channel", "Calendar"];
  return (
    <div className="grid h-full gap-4 md:grid-cols-12">
      <Paper tone="stone" className="md:col-span-4">
        <p className="mb-2 font-semibold text-forest">Cedar Row (sample)</p>
        <Tick on={r(0)}>Contract signed</Tick>
        <Tick on={r(1)}>Contacts</Tick>
        <Tick on={r(1)}>Goals</Tick>
        <Tick on={r(1) && !missing}>Billing details</Tick>
        <Tick on={r(2)}>Workspace ready</Tick>
        <Tick on={r(5)}>Kickoff booked</Tick>
      </Paper>
      <div className="relative md:col-span-8">
        {r(3) ? (
          <Paper className="grid h-full content-center gap-8 sm:grid-cols-[1.4fr_1fr]">
            <Draft state={state} draft={draft} onDraft={onDraft} label="Welcome draft. Edit it if you like." />
            <Month on={r(5)} />
          </Paper>
        ) : (
          <div className="grid h-full grid-cols-2 gap-3 sm:grid-cols-3">
            {tiles.map((tile, i) => (
              <div
                key={tile}
                className={`scene-tile grid min-h-28 place-items-center text-[17px] font-semibold ${r(2) ? "scene-tile-on" : ""}`}
                style={{ "--delay": `${r(2) ? i * 90 : 0}ms` } as CSSProperties}
              >
                {tile}
              </div>
            ))}
          </div>
        )}
        <Stamp on={finished(state)}>Invited</Stamp>
      </div>
    </div>
  );
}

/** Three sources rise into a morning page. Every line points back to one. */
function BriefScene({ state, scenario }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const down = scenario.id === "gap";
  const sources = [
    { name: "Billing", bars: [40, 62, 54, 78], flag: -1 },
    { name: "Accounting", bars: [66, 58, 62, 24], flag: 3 },
    { name: "CRM", bars: [30, 44, 52, 60], flag: -1 },
  ];
  return (
    <div className="grid h-full gap-5 md:grid-cols-12">
      <div className="grid grid-cols-3 gap-3 md:col-span-6">
        {sources.map((source, s) => {
          const off = down && s === 2;
          return (
            <div key={source.name} className="flex flex-col justify-end">
              <div className="flex h-52 items-end gap-1.5">
                {source.bars.map((height, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="scene-grow flex-1 origin-bottom"
                    style={{
                      height: `${height}%`,
                      transform: `scaleY(${r(1) && !off ? 1 : 0.04})`,
                      background: r(2) && i === source.flag ? "#C5A869" : "rgb(247 244 236 / 0.4)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-[15px]">{source.name}</p>
              <p className="text-[13px] text-ivory/75">{r(1) ? (off ? "Did not load" : "Loaded") : "Waiting"}</p>
            </div>
          );
        })}
      </div>
      <Paper className="relative flex flex-col justify-center md:col-span-6">
        <Label>6:30 a.m.</Label>
        <p className="mt-1 font-display text-[2.2rem] leading-none text-forest">This morning</p>
        <Show on={r(3)} className="mt-5 space-y-3 text-[16px]">
          <p className={down ? "font-semibold" : ""}>
            {down ? "CRM did not load. Pipeline was not checked." : "All three sources loaded."}
          </p>
          <p>
            <Mark on={r(3)}>One invoice passed its due date.</Mark>{" "}
            <span className="text-[13px] text-gold-ink">Accounting, row 41</span>
          </p>
        </Show>
        <Stamp on={finished(state)}>Delivered inside</Stamp>
      </Paper>
    </div>
  );
}

/** An invoice is read, matched and caught out by one line. */
function InvoiceScene({ state, scenario }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const poor = scenario.id === "scan";
  const lines = [
    { item: "Brackets", qty: "4", units: 100 },
    { item: "Panels", qty: "10", units: 150 },
    { item: "Fixings", qty: "2", units: 50 },
  ];
  const resolved = r(4);
  return (
    <div className="grid h-full gap-4 md:grid-cols-12">
      <Paper className="relative overflow-hidden md:col-span-7">
        {r(1) && !r(2) ? <span aria-hidden className="scene-scan" /> : null}
        <div className={poor && !r(2) ? "blur-[1.5px]" : ""}>
          <div className="flex items-baseline justify-between">
            <p className="font-display text-[2rem] leading-none text-forest">Invoice</p>
            <Label>Fieldstone Supply (sample)</Label>
          </div>
          <div className="mt-5">
            {lines.map((line, i) => {
              const bad = i === 1 && r(2) && !poor;
              return (
                <div
                  key={line.item}
                  className={`scene-fade flex items-baseline justify-between gap-3 px-2 py-2.5 text-[17px] ${
                    bad ? (resolved ? "bg-forest/10" : "bg-gold/40") : ""
                  }`}
                >
                  <Mark on={r(1) && !poor}>{line.item}</Mark>
                  <span className="ml-auto text-slate">{line.qty}</span>
                  <span className="w-16 text-right font-semibold">{line.units}</span>
                </div>
              );
            })}
            <div className="mt-2 flex justify-between border-t-2 border-forest px-2 pt-2.5 text-[17px] font-bold text-forest">
              <span>Total</span>
              <span>300</span>
            </div>
          </div>
        </div>
        <Stamp on={finished(state)}>Scheduled</Stamp>
      </Paper>
      <div className="flex flex-col gap-4 md:col-span-5">
        <Paper tone="stone" className="flex-1">
          <Fill label="Sum of lines" value="300, matches" on={r(1) && !poor} />
          <Fill label="Ordered" value="10 panels" on={r(2) && !poor} />
          <Fill label="Received" value="9 panels" on={r(2) && !poor} delay={200} />
          <Fill label="Exception" value="Resolved by you" on={resolved} />
          <Fill label="Batch" value="Approved by you" on={r(5)} />
          <div className="mt-3">
            <Gauge value={scenario.confidence} on={r(1)} />
          </div>
        </Paper>
      </div>
    </div>
  );
}

/** A ticket finds its lane, then its articles, then an agent. */
function SupportScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const unclear = scenario.id === "unclear";
  const lanes = ["Billing", "Exchanges", "Needs triage"];
  const target = unclear ? 2 : 1;
  if (r(3)) {
    return (
      <div className="grid h-full gap-4 md:grid-cols-12">
        <Paper className="relative flex flex-col justify-center md:col-span-8">
          <Draft state={state} draft={draft} onDraft={onDraft} label="Reply draft. Edit it if you like." />
          <Stamp on={finished(state)}>Sent by you</Stamp>
        </Paper>
        <div className="grid content-center gap-3 md:col-span-4">
          {["Exchange policy", "Size guide"].map((name) => (
            <Paper key={name} tone="stone">
              <Label>Cited article</Label>
              <p className="font-semibold text-forest">{name}</p>
            </Paper>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="relative grid h-full grid-cols-3 gap-3">
      {lanes.map((lane, i) => (
        <div
          key={lane}
          className={`scene-fade flex min-h-64 flex-col p-4 ${r(1) && i === target ? "bg-forest" : "bg-ivory/5"}`}
        >
          <p className="text-[15px] font-semibold md:text-[17px]">{lane}</p>
          <div className="mt-4 space-y-2" aria-hidden>
            {Array.from({ length: i === 1 ? 2 : 1 }, (_, k) => (
              <span key={k} className="block h-8 bg-ivory/10" />
            ))}
          </div>
          {i === target ? (
            <Show on={r(2)} className="mt-auto text-[13px] text-gold">
              2 help articles match
            </Show>
          ) : null}
        </div>
      ))}
      <div
        className="scene-move absolute top-[42%] w-[30%]"
        style={{ left: `${r(1) ? target * 34.3 + 1.5 : 35.8}%` }}
      >
        <Paper className="!p-4">
          <Label>L. Chen (sample)</Label>
          <p className="mt-1 text-[15px] leading-snug font-semibold text-forest md:text-[17px]">
            {unclear ? "It did the thing again" : "Arrived in the wrong size"}
          </p>
        </Paper>
      </div>
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
    <div className="grid h-full gap-5 md:grid-cols-12">
      <div className="flex flex-col justify-center md:col-span-8">
        <p className="text-[13px] text-ivory/75">Cost per result, sample account</p>
        <svg viewBox="0 0 480 170" aria-hidden className="mt-2 w-full">
          <path d="M0 134L480 118V82L0 98Z" fill="#F7F4EC" opacity={r(1) ? 0.12 : 0} className="scene-fade" />
          <path
            d={spike ? SPIKE : STEADY}
            fill="none"
            stroke="#C5A869"
            strokeWidth="3"
            strokeLinejoin="round"
            pathLength={1}
            className={`scene-draw ${r(0) ? "scene-draw-on" : ""}`}
          />
          {spike ? (
            <circle cx="420" cy="40" r={r(1) ? 14 : 0} fill="none" stroke="#F7F4EC" strokeWidth="2" className="scene-grow" />
          ) : null}
        </svg>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`scene-fade h-14 ${i === 2 && spike && r(2) ? "bg-gold" : "bg-ivory/15"}`}
              style={{ clipPath: "polygon(14% 0,100% 0,86% 100%,0 100%)" }}
            />
          ))}
        </div>
        <Show on={r(2)} className="mt-2 text-[14px] text-ivory/80">
          {spike ? "One ad is wearing out. Nothing was paused." : "No ad needs review."}
        </Show>
      </div>
      <Paper className="relative flex flex-col justify-center md:col-span-4">
        <Label>Weekly brief</Label>
        <Show on={r(3)} className="mt-2 font-display text-[1.6rem] leading-snug text-forest">
          {spike ? "Cost rose above its usual band on one day." : "Cost stayed inside its usual band."}
        </Show>
        <p className="mt-6 text-[15px]">
          <span className="text-slate">Budget changes</span>{" "}
          <span className="font-semibold text-forest">None, by design</span>
        </p>
        <Stamp on={finished(state)}>Posted inside</Stamp>
      </Paper>
    </div>
  );
}

/** Evidence is marked and private details are blacked out. People decide. */
function RecruitingScene({ state, scenario, draft, onDraft }: SceneProps) {
  const r = (n: number) => reached(state, n);
  const thin = scenario.id === "thin";
  return (
    <div className="grid h-full gap-4 md:grid-cols-12">
      <Paper className="relative flex flex-col justify-center md:col-span-7">
        {r(3) ? (
          <Draft state={state} draft={draft} onDraft={onDraft} label="Message draft. Edit it if you like." />
        ) : (
          <div className="text-[17px] leading-[1.9]">
            <p className="font-display text-[2rem] leading-none text-forest">Candidate 700</p>
            <p className="mt-4">
              Age <span className={`scene-redact ${r(0) ? "scene-redact-on" : ""}`}>hidden</span>, address{" "}
              <span className={`scene-redact ${r(0) ? "scene-redact-on" : ""}`}>hidden here</span>
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
        )}
        <Stamp on={finished(state)}>Invited by you</Stamp>
      </Paper>
      <Paper tone="stone" className="md:col-span-5">
        {r(4) ? (
          <Month on={r(4)} day={11} />
        ) : (
          <>
            <p className="mb-2 font-semibold text-forest">Job rubric</p>
            <Tick on={r(1) && !thin}>Scheduling</Tick>
            <Tick on={r(1) && !thin}>Process writing</Tick>
            <Tick on={false}>Vendor contact</Tick>
            <div className="mt-4">
              <Gauge value={scenario.confidence} on={r(1)} />
            </div>
            <p className="mt-4 text-[15px]">
              <span className="text-slate">Decision</span>{" "}
              <span className="font-semibold text-forest">{r(3) ? "Advanced by you" : "Waits for a person"}</span>
            </p>
          </>
        )}
      </Paper>
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
