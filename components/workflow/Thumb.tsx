import { WORKFLOWS } from "@/content/workflows";

/** A small picture of the workflow's approval gate. Gold is the Approve key only. */
export function Thumb({ id, className = "" }: { id: string; className?: string }) {
  const workflow = WORKFLOWS.find((item) => item.id === id);
  const gate = workflow?.nodes.find((node) => node.kind === "human");
  const label = gate?.label ?? workflow?.nodes.at(-1)?.label ?? "Record";

  return (
    <span aria-hidden className={`console flex items-center justify-between gap-2 px-2 ${className}`}>
      <span className="min-w-0 truncate text-[11px] leading-tight text-ivory/80">{label}</span>
      {gate ? (
        <span className="shrink-0 rounded-[6px] bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-obsidian shadow-[inset_0_1px_0_rgb(247_244_236_/_0.55)]">
          {gate.gate?.approveLabel ?? "Approve"}
        </span>
      ) : null}
    </span>
  );
}
