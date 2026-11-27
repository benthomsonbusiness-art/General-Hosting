import { Database, ListChecks, MessageSquare, UserCheck } from "lucide-react";
import { HOME } from "@/content/pages";

const ICON = { "aria-hidden": true, focusable: "false", strokeWidth: 1.5 } as const;

const NODES = [
  <span
    key="rule"
    className="relative z-10 grid h-12 w-12 place-items-center rounded-[6px] border border-[rgb(251_246_241_/_0.16)] bg-obsidian text-muted"
  >
    <ListChecks {...ICON} size={20} />
  </span>,
  <span
    key="ai"
    className="relative z-10 flex h-12 w-28 items-center justify-center gap-2 rounded-[6px] border border-[rgb(253_224_71_/_0.5)] bg-obsidian text-ivory"
  >
    <MessageSquare {...ICON} size={16} className="text-cyan" />
    <span className="text-[13px] font-semibold">Draft</span>
  </span>,
  <span
    key="approval"
    className="relative z-10 grid h-12 w-12 place-items-center rounded-[6px] bg-gold text-obsidian"
  >
    <UserCheck {...ICON} size={20} strokeWidth={1.75} />
  </span>,
  <span
    key="record"
    className="relative z-10 grid h-12 w-12 place-items-center rounded-[6px] border border-[rgb(251_246_241_/_0.16)] bg-obsidian text-muted"
  >
    <Database {...ICON} size={20} />
  </span>,
];

/** Four stations on one line. */
export function Stations() {
  return (
    <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      <span
        aria-hidden
        className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-[rgb(251_246_241_/_0.32)] sm:block"
      />
      <span aria-hidden className="packet-track top-5 left-[calc(12.5%-0.25rem)] hidden w-[calc(50%+0.5rem)] sm:block">
        <span className="packet absolute top-0 left-0 h-2 w-2 bg-ivory" />
      </span>
      {HOME.how.steps.map((step, index) => (
        <li key={step.title} className="relative flex flex-col items-center text-center">
          <span aria-hidden className="mb-4 flex justify-center">
            {NODES[index]}
          </span>
          <h3 className="h4">{step.title}</h3>
          <p className="mt-1.5 max-w-[15rem] text-[15px] text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
