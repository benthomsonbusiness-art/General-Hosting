import type { Block } from "./index.ts";
import approvalGate from "./where-the-approval-gate-goes.ts";
import deterministicFirst from "./deterministic-first.ts";
import auditMaps from "./what-a-workflow-audit-maps.ts";
import dailyBrief from "./daily-brief-for-a-services-company.ts";

export const BODIES: Record<string, Block[]> = {
  "where-the-approval-gate-goes": approvalGate,
  "deterministic-first": deterministicFirst,
  "what-a-workflow-audit-maps": auditMaps,
  "daily-brief-for-a-services-company": dailyBrief,
};

export function blockText(block: Block): string {
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "checklist":
      return `${block.title} ${block.items.join(" ")}`;
    case "callout":
      return `${block.title} ${block.text}`;
    case "table":
      return [block.caption, ...block.head, ...block.rows.flat()].join(" ");
    case "workflow":
      return "";
    default:
      return block.text;
  }
}

export function wordCount(blocks: Block[]): number {
  return blocks.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
}
