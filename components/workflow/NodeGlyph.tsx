import { Braces, CircleDot, ScanText, Send, UserRound } from "lucide-react";
import type { NodeKind } from "@/content/workflows";

const GLYPHS = {
  trigger: CircleDot,
  deterministic: Braces,
  ai: ScanText,
  human: UserRound,
  output: Send,
} as const;

export const SHORT_KIND: Record<NodeKind, string> = {
  trigger: "Trigger",
  deterministic: "Code",
  ai: "AI step",
  human: "Human",
  output: "Output",
};

export function NodeGlyph({ kind, size = 16 }: { kind: NodeKind; size?: number }) {
  const Glyph = GLYPHS[kind];
  return <Glyph size={size} strokeWidth={1.5} aria-hidden className="shrink-0" />;
}

/** Glyph and text together, so kind never depends on color. */
export function KindLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ivory/80" aria-label="Step types">
      {(Object.keys(SHORT_KIND) as NodeKind[]).map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <NodeGlyph kind={kind} />
          {kind === "deterministic" ? "Code (deterministic)" : SHORT_KIND[kind]}
        </li>
      ))}
    </ul>
  );
}
