import { Database, ListChecks, MessageSquare, UserCheck } from "lucide-react";
import { HOME } from "@/content/pages";

const ICON = { "aria-hidden": true, focusable: "false", strokeWidth: 1.6 } as const;

const NODES = [
  <span
    key="rule"
    className="relative z-10 grid h-14 w-14 place-items-center rounded-[10px] border border-[rgb(251_246_241_/_0.2)] bg-[linear-gradient(180deg,#271912,#120a07)] text-ivory shadow-[0_12px_24px_-10px_rgb(0_0_0_/_0.85),inset_0_1px_0_rgb(251_246_241_/_0.12)]"
  >
    <ListChecks {...ICON} size={22} />
  </span>,
  <span
    key="ai"
    className="relative z-10 flex h-14 w-32 items-center justify-center gap-2 rounded-[10px] border border-[rgb(253_224_71_/_0.58)] bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,rgb(253_224_71_/_0.14),transparent_70%),linear-gradient(180deg,#2b1d11,#140c08)] text-ivory shadow-[0_0_24px_-6px_rgb(253_224_71_/_0.28),inset_0_1px_0_rgb(253_224_71_/_0.25)]"
  >
    <MessageSquare {...ICON} size={17} className="text-cyan" />
    <span className="text-[13.5px] font-semibold">Draft</span>
  </span>,
  <span
    key="approval"
    className="relative z-10 grid h-14 w-14 place-items-center rounded-[10px] border border-[rgb(255_198_184_/_0.5)] bg-[linear-gradient(180deg,#ff8468,#ff6b4a)] text-obsidian shadow-[inset_0_1px_0_rgb(255_245_240_/_0.75),0_2px_0_#992c15,0_0_28px_-4px_rgb(255_107_74_/_0.55)]"
  >
    <UserCheck {...ICON} size={22} strokeWidth={2} />
  </span>,
  <span
    key="record"
    className="relative z-10 grid h-14 w-14 place-items-center rounded-[10px] border border-[rgb(251_246_241_/_0.2)] bg-[linear-gradient(180deg,#271912,#120a07)] text-ivory shadow-[0_12px_24px_-10px_rgb(0_0_0_/_0.85),inset_0_1px_0_rgb(251_246_241_/_0.12)]"
  >
    <Database {...ICON} size={22} />
  </span>,
];

/** Four illuminated hardware stations connected by an active signal rail. */
export function Stations() {
  return (
    <div className="repo-panel px-6 py-8 sm:px-10 sm:py-10">
      <ol className="relative grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-[2px] bg-[linear-gradient(90deg,rgb(251_246_241_/_0.22),rgb(253_224_71_/_0.55),rgb(255_107_74_/_0.65),rgb(251_246_241_/_0.22))] lg:block"
        />
        <span aria-hidden className="packet-track top-[24px] left-[calc(12.5%-0.25rem)] hidden w-[calc(50%+0.5rem)] lg:block">
          <span className="packet absolute top-0 left-0 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_#fde047]" />
        </span>
        {HOME.how.steps.map((step, index) => (
          <li key={step.title} className="relative flex flex-col items-center text-center">
            <span aria-hidden className="mb-3 flex justify-center">
              {NODES[index]}
            </span>
            <span className="font-mono text-[11.5px] text-gold">0{index + 1}</span>
            <h3 className="h4 mt-1">{step.title}</h3>
            <p className="mt-1.5 max-w-[15rem] text-[15px] text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
