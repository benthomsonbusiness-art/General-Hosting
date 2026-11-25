import { CodeXml, Database, Sparkles, UserCheck } from "lucide-react";
import { HOME } from "@/content/pages";

const ICON = { "aria-hidden": true, focusable: "false", strokeWidth: 1.5 } as const;

/**
 * The four kinds of step, drawn as the diagram draws them: a rule card, the wide AI card, the
 * gold approval key and the record card. Keyed by position, so the titles can change freely.
 */
const NODES = [
  <span key="rule" className="relative z-10 grid h-12 place-items-center border border-[rgb(247_244_236_/_0.16)] bg-obsidian text-ivory/64 w-12">
    <CodeXml {...ICON} size={22} />
  </span>,
  <span key="ai" className="relative z-10 flex h-12 w-28 items-center justify-center gap-2 border border-[rgb(247_244_236_/_0.16)] bg-forest text-ivory">
    <Sparkles {...ICON} size={18} />
    <span className="text-[13px] font-semibold">Draft</span>
  </span>,
  <span key="approval" className="relative z-10 grid h-12 w-12 place-items-center rounded-[6px] bg-gold text-obsidian shadow-[inset_0_1px_0_rgb(247_244_236_/_0.55)]">
    <UserCheck {...ICON} size={20} strokeWidth={1.75} />
  </span>,
  <span key="record" className="relative z-10 grid h-12 place-items-center border border-[rgb(247_244_236_/_0.16)] bg-obsidian text-ivory/64 w-12">
    <Database {...ICON} size={22} />
  </span>,
];

/** Four stations on one line. The packet moves only when motion is on, and stops at the person. */
export function Stations() {
  return (
    <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      <span aria-hidden className="absolute top-6 right-[12%] left-6 hidden h-px bg-[rgb(247_244_236_/_0.48)] sm:block" />
      <span aria-hidden className="packet-track top-5 left-0 hidden w-[calc(50%+0.5rem)] sm:block">
        <span className="packet absolute top-0 left-0 h-2 w-2 bg-ivory" />
      </span>
      {HOME.how.steps.map((step, index) => (
        <li key={step.title} className="relative">
          <span aria-hidden className="mb-4 flex">
            {NODES[index]}
          </span>
          <h3 className="h4">{step.title}</h3>
          <p className="mt-2 text-[15px] text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
