/**
 * Pure layout for the workflow diagram. No React, no DOM: the diagram component and the
 * layout test both call layoutFlow(), so what the test checks is what the page draws.
 *
 * Horizontal stage. Spine cards sit on one row; tools hang below on dashed curves; exits
 * rise above. Every x is computed at the smallest stage width the layout is allowed at
 * (minWidth) and anchored to its spine column's fraction of the stage. On a wider stage
 * each element moves right by fraction × (extra width), so gaps only grow and nothing that
 * fits at minWidth can collide or leave the stage at a larger width. The renderer turns
 * each x into `calc(fraction × 100% + px)`.
 *
 * This file is imported by node --test with type stripping: relative imports with .ts
 * extensions, type-only imports for types, no enums.
 */
import { WORKFLOWS_PAGE } from "../../../content/pages.ts";
import type { Attachment, NodeKind, WorkflowNode } from "../../../content/workflows.ts";
import { appName, type AppSlug, type Glyph } from "../../../lib/logos.ts";

/** What the diagram reads from a node. Real workflow nodes satisfy it structurally. */
export type FlowNodeInput = Pick<WorkflowNode, "id" | "label" | "kind"> &
  Partial<Pick<WorkflowNode, "app" | "attached" | "gate" | "confidence" | "stopLabel" | "audience">>;

export type FlowVariant = "full" | "compact";

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
/** An x position that follows the stage width: x = f × width + px. */
export type FluidX = { f: number; px: number };

type Metrics = {
  card: number;
  aiW: number;
  tool: number;
  labelLine: number;
  labelChar: number;
  monoLine: number;
  monoChar: number;
  smallLine: number;
  smallChar: number;
  aiChar: number;
  aiPad: number;
  textMin: number;
  toolTextMin: number;
  colGap: number;
  toolGap: number;
  cardTextGap: number;
  toolTextGap: number;
  stub: number;
  drop: number;
  minEdge: number;
  exitW: number;
  portLabels: boolean;
  monoWraps: boolean;
  maxLabelLines: number;
  hitMin: number;
  minWidth: { 5: number; 6: number };
};

export const METRICS: Record<FlowVariant, Metrics> = {
  full: {
    card: 64,
    aiW: 208,
    tool: 40,
    labelLine: 17,
    labelChar: 7,
    monoLine: 16,
    monoChar: 7.2,
    smallLine: 16,
    smallChar: 6.5,
    aiChar: 7.6,
    aiPad: 16,
    textMin: 136,
    toolTextMin: 120,
    colGap: 12,
    toolGap: 12,
    cardTextGap: 10,
    toolTextGap: 8,
    stub: 24,
    drop: 72,
    minEdge: 24,
    exitW: 170,
    portLabels: true,
    monoWraps: false,
    maxLabelLines: 2,
    hitMin: 100,
    minWidth: { 5: 880, 6: 1040 },
  },
  compact: {
    card: 48,
    aiW: 160,
    tool: 32,
    labelLine: 16,
    labelChar: 6.5,
    monoLine: 15,
    monoChar: 6.6,
    smallLine: 15,
    smallChar: 6,
    aiChar: 6.9,
    aiPad: 12,
    textMin: 104,
    toolTextMin: 96,
    colGap: 8,
    toolGap: 8,
    cardTextGap: 8,
    toolTextGap: 6,
    stub: 16,
    drop: 48,
    minEdge: 16,
    exitW: 130,
    portLabels: false,
    monoWraps: true,
    maxLabelLines: 3,
    hitMin: 0,
    minWidth: { 5: 680, 6: 680 },
  },
};

/** Widest stage the diagram grows to. */
export const MAX_STAGE = 1120;
/** At most this many spine columns. Two stacked outputs count as one. */
export const MAX_COLUMNS = 6;
/** At most this many circles under one card, the model included. */
export const MAX_ATTACHED = 5;

export const PORT_LABEL: Record<Attachment["port"], string> = {
  model: "Model",
  memory: "Memory",
  tools: "Tools",
  calls: "Calls",
};

/**
 * Whether the "App: Operation" line is drawn under each card and circle. Off: the logo and the
 * step label say enough, and the app name is still read out to screen readers.
 */
export const SHOW_APP_LINE = false;

const PORT_ORDER: Attachment["port"][] = ["model", "memory", "tools", "calls"];

/** The "App: Operation" line under a card, or undefined when the node names no app. */
export function monoLine(ref?: { app: AppSlug | Glyph; operation?: string }): string | undefined {
  if (!ref) return undefined;
  const name = appName(ref.app);
  return ref.operation ? `${name}: ${ref.operation}` : name;
}

/** The approval's mono line comes from the gate: where the person approves. */
export function gateLine(node: FlowNodeInput): string | undefined {
  const app = node.gate?.channelApp;
  if (!app) return undefined;
  return monoLine({ app, operation: node.gate?.operation });
}

/** Exit text drawn above a card: AI and approval steps always have one; rule steps when they can stop the item. */
export function exitText(node: FlowNodeInput): string | undefined {
  if (node.kind === "ai") return node.stopLabel ?? WORKFLOWS_PAGE.stubs.ai;
  if (node.kind === "human") return node.stopLabel ?? WORKFLOWS_PAGE.stubs.human;
  return node.stopLabel;
}

// ---------- Text measuring (estimates; the test uses the same numbers) ----------

export function textWidth(text: string, charWidth: number): number {
  return Math.ceil(text.length * charWidth);
}

/** Greedy word wrap. A word wider than the box takes a line of its own. */
export function wrapLines(text: string, width: number, charWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(next, charWidth) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function longestWord(text: string, charWidth: number): number {
  return Math.max(0, ...text.split(/\s+/).map((word) => textWidth(word, charWidth)));
}

/** Mono lines wrap only after the colon, and only in the compact variant. */
function monoParts(line: string, wraps: boolean): string[] {
  if (!wraps) return [line];
  const at = line.indexOf(": ");
  return at === -1 ? [line] : [line.slice(0, at + 1), line.slice(at + 2)];
}

// ---------- Output ----------

export type LaidText = {
  label: string[];
  /** Width the text wraps in when drawn; rect is what it covers. */
  wrap?: number;
  mono?: string[];
  /** Third line on approval cards: who decides. Or the internal-only tag on a result. */
  note?: string[];
  rect: Rect;
};

export type LaidPort = { port: Attachment["port"]; at: Point; label?: string; labelRect?: Rect };

export type LaidNode = {
  id: string;
  /** Position in the spine list, which is also the hover key s{index}. */
  index: number;
  kind: NodeKind;
  label: string;
  app?: AppSlug | Glyph;
  /** Column fraction this node is anchored to. */
  f: number;
  column: number;
  /** Second of two outputs stacked in the last column. */
  stacked: boolean;
  gold: boolean;
  /** The positioned box: card plus its text, also the link hit area on detail pages. */
  box: Rect;
  card: Rect;
  text?: LaidText;
  exit?: { lines: string[]; wrap: number; rect: Rect };
  ports: { left?: Point; right?: Point; bottom: LaidPort[] };
};

export type LaidTool = {
  id: string;
  parentId: string;
  parentIndex: number;
  port: Attachment["port"];
  label: string;
  app: AppSlug | Glyph;
  f: number;
  circle: Rect;
  text: LaidText;
  box: Rect;
};

export type LaidEdge = {
  kind: "spine" | "fork" | "tool" | "exit";
  /** Spine indexes this edge belongs to, for the hover rule. */
  keys: number[];
  from: Point;
  to: Point;
  /** Fraction the edge's px coordinates are anchored to (tool and exit edges). */
  f: number;
  /** Fraction pair for spine and fork lines, drawn center to center under the cards. */
  fromF?: number;
  toF?: number;
  /** SVG path in px relative to f × width (tool edges). */
  d?: string;
};

export type FlowLayout = {
  ok: true;
  variant: FlowVariant;
  columns: number;
  /** The smallest stage width this layout is valid at. */
  minWidth: number;
  /** The stage width the boxes below are evaluated at. */
  width: number;
  height: number;
  nodes: LaidNode[];
  tools: LaidTool[];
  edges: LaidEdge[];
};

export type FlowLayoutFailure = { ok: false; variant: FlowVariant; columns: number; minWidth: number; reason: string };

/** Spine columns after stacking: two outputs right after one approval share the last column. */
export function spineColumns(nodes: FlowNodeInput[]): { columns: number; stackLast: boolean } {
  const n = nodes.length;
  const stackLast =
    n >= 3 && nodes[n - 1].kind === "output" && nodes[n - 2].kind === "output" && nodes[n - 3].kind === "human";
  return { columns: stackLast ? n - 1 : n, stackLast };
}

export function minStageWidth(variant: FlowVariant, columns: number): number {
  return columns >= 6 ? METRICS[variant].minWidth[6] : METRICS[variant].minWidth[5];
}

function attachmentsOf(node: FlowNodeInput): Attachment[] {
  return node.attached ?? [];
}

/** Bottom ports in drawing order: model, memory, tools, then calls. Only ports that are used. */
function portsOf(node: FlowNodeInput): Attachment["port"][] {
  const used = new Set(attachmentsOf(node).map((item) => item.port));
  return PORT_ORDER.filter((port) => used.has(port));
}

/** Attachments sorted by port so circles line up under their port, left to right. */
function sortedAttachments(node: FlowNodeInput): Attachment[] {
  return [...attachmentsOf(node)].sort((a, b) => PORT_ORDER.indexOf(a.port) - PORT_ORDER.indexOf(b.port));
}

function noteFor(node: FlowNodeInput, internalOnly: boolean): string | undefined {
  if (node.kind === "human") {
    // Approval labels usually lead with the role ("Controller approves batch"); print it only when they don't.
    const role = node.gate?.approver;
    return role && !node.label.toLowerCase().startsWith(role.toLowerCase()) ? role : undefined;
  }
  if (internalOnly) return WORKFLOWS_PAGE.internalOnly;
  return undefined;
}


/**
 * Lay out one workflow. `width` is the stage width to evaluate positions at; it defaults to
 * the minimum width for the column count and must not be smaller than it.
 */
export function layoutFlow(
  nodes: FlowNodeInput[],
  options: { variant?: FlowVariant; width?: number } = {},
): FlowLayout | FlowLayoutFailure {
  const variant = options.variant ?? "full";
  const m = METRICS[variant];
  const { columns, stackLast } = spineColumns(nodes);
  const minWidth = minStageWidth(variant, columns);
  const fail = (reason: string): FlowLayoutFailure => ({ ok: false, variant, columns, minWidth, reason });

  if (nodes.length === 0) return fail("no steps");
  if (columns > MAX_COLUMNS) return fail(`${columns} columns, at most ${MAX_COLUMNS}`);
  const width = Math.min(Math.max(options.width ?? minWidth, minWidth), MAX_STAGE);
  const W = minWidth;

  const hasHuman = nodes.some((node) => node.kind === "human");
  const lastIndex = nodes.length - 1;

  for (const node of nodes) {
    if (attachmentsOf(node).length > MAX_ATTACHED) return fail(`${node.id}: more than ${MAX_ATTACHED} attachments`);
  }

  // ----- Measure each node -----
  const monoOf = (node: FlowNodeInput) => (node.kind === "human" ? gateLine(node) : monoLine(node.app));
  const widest = (lines: string[] | undefined, charWidth: number) =>
    Math.max(0, ...(lines ?? []).map((line) => textWidth(line, charWidth)));

  type Measured = {
    cardW: number;
    /** Width the label wraps in. The rendered text box uses it too. */
    wrapW: number;
    label: string[];
    mono?: string[];
    note?: string[];
    /** Left and right reach of whatever sits below the card at text height. */
    textL: number;
    textR: number;
    exit?: string[];
    exitW: number;
    ports: Attachment["port"][];
    shares: number[];
  };

  const measured: Measured[] = nodes.map((node, index) => {
    const isAi = node.kind === "ai";
    const cardW = isAi ? m.aiW : m.card;
    const ports = portsOf(node);
    const shares = ports.length === 1 ? [0.5] : ports.length === 2 ? [0.3, 0.7] : [0.2, 0.5, 0.8];
    const exitString = exitText(node);
    const exit = exitString ? wrapLines(exitString, m.exitW, m.smallChar) : undefined;
    const exitW = widest(exit, m.smallChar);
    if (isAi) {
      // Under the AI card: only its port trunks and port labels.
      const offsets = ports.map((_, k) => cardW * shares[k] - cardW / 2);
      const reach = (k: number) => offsets[k] + (m.portLabels ? 6 + textWidth(PORT_LABEL[ports[k]], m.smallChar) : 1);
      const textL = offsets.length ? Math.max(0, -Math.min(...offsets)) + 1 : 0;
      const textR = offsets.length ? Math.max(0, ...offsets.map((_, k) => reach(k))) : 0;
      return { cardW, wrapW: cardW, label: [], textL, textR, exit, exitW, ports, shares };
    }
    const mono = SHOW_APP_LINE ? monoOf(node) : undefined;
    const monoLines = mono ? monoParts(mono, m.monoWraps) : undefined;
    const noteText = noteFor(node, !hasHuman && index === lastIndex);
    const wrapW = Math.max(
      m.textMin,
      longestWord(node.label, m.labelChar),
      widest(monoLines, m.monoChar),
      noteText ? longestWord(noteText, m.smallChar) : 0,
    );
    const label = wrapLines(node.label, wrapW, m.labelChar);
    const note = noteText ? wrapLines(noteText, wrapW, m.smallChar) : undefined;
    const occupied = Math.max(
      cardW,
      widest(label, m.labelChar),
      widest(monoLines, m.monoChar),
      widest(note, m.smallChar),
    );
    return { cardW, wrapW, label, mono: monoLines, note, textL: occupied / 2, textR: occupied / 2, exit, exitW, ports, shares };
  });

  // ----- Columns -----
  type Column = { items: number[]; card: number; textL: number; textR: number; exit: number };
  const cols: Column[] = [];
  nodes.forEach((_, index) => {
    const own = measured[index];
    const stackInto = stackLast && index === lastIndex ? cols[cols.length - 1] : undefined;
    const col = stackInto ?? { items: [], card: 0, textL: 0, textR: 0, exit: 0 };
    col.items.push(index);
    col.card = Math.max(col.card, own.cardW / 2);
    col.textL = Math.max(col.textL, own.textL);
    col.textR = Math.max(col.textR, own.textR);
    col.exit = Math.max(col.exit, own.exitW / 2);
    if (!stackInto) cols.push(col);
  });
  const columnOf = (index: number) => cols.findIndex((col) => col.items.includes(index));

  // Each pair of neighbours keeps a visible line between cards, and clear space between the
  // text under the cards and between the exits above them. The rows are checked separately.
  const distances = cols.slice(1).map((col, i) => {
    const prev = cols[i];
    return Math.max(prev.card + col.card + m.minEdge, prev.textR + col.textL + m.colGap, prev.exit + col.exit + m.colGap);
  });
  const reachLeft = Math.max(cols[0].card, cols[0].textL, cols[0].exit);
  const lastColumn = cols[cols.length - 1];
  const reachRight = Math.max(lastColumn.card, lastColumn.textR, lastColumn.exit);
  const required = reachLeft + distances.reduce((sum, d) => sum + d, 0) + reachRight;
  if (required > W) return fail(`columns need ${Math.ceil(required)}px, stage is ${W}px`);
  const spare = distances.length ? (W - required) / distances.length : 0;
  const centers: number[] = [];
  if (cols.length === 1) centers.push(W / 2);
  else {
    centers.push(reachLeft);
    distances.forEach((d, i) => centers.push(centers[i] + d + spare));
  }
  const fractions = centers.map((center) => center / W);

  // ----- Exits (above the spine) -----
  const exitRows = Math.max(0, ...measured.map((item) => item.exit?.length ?? 0));
  const exitArea = exitRows * m.smallLine;
  const spineTop = exitRows > 0 ? exitArea + 4 + m.stub : 0;

  // ----- Spine nodes -----
  const laid: LaidNode[] = [];
  let textBand = spineTop + m.card;
  let stackBottom = 0;

  nodes.forEach((node, index) => {
    const own = measured[index];
    const column = columnOf(index);
    const f = fractions[column];
    const cx = centers[column];
    const stacked = stackLast && index === lastIndex;
    const top = stacked ? stackBottom + 16 : spineTop;
    const isAi = node.kind === "ai";
    const card: Rect = { x: cx - own.cardW / 2, y: top, w: own.cardW, h: m.card };
    const cy = top + m.card / 2;

    let text: LaidText | undefined;
    let bottom = top + m.card;
    if (!isAi) {
      const h =
        own.label.length * m.labelLine +
        (own.mono?.length ?? 0) * m.monoLine +
        (own.note ? own.note.length * m.smallLine + 2 : 0);
      const occupied = own.textL + own.textR;
      text = {
        label: own.label,
        mono: own.mono,
        note: own.note,
        wrap: own.wrapW,
        rect: { x: cx - occupied / 2, y: top + m.card + m.cardTextGap, w: occupied, h },
      };
      bottom = text.rect.y + h;
    }

    const ports: LaidNode["ports"] = { bottom: [] };
    if (index > 0) ports.left = { x: cx - own.cardW / 2, y: cy };
    const feedsNext = index < lastIndex && !(stackLast && index === lastIndex - 1);
    if (feedsNext) ports.right = { x: cx + own.cardW / 2, y: cy };
    own.ports.forEach((port, k) => {
      const at: Point = isAi ? { x: card.x + card.w * own.shares[k], y: card.y + card.h } : { x: cx, y: card.y + card.h };
      ports.bottom.push({ port, at });
    });

    const exit = own.exit
      ? {
          lines: own.exit,
          wrap: m.exitW,
          rect: { x: cx - own.exitW / 2, y: exitArea - own.exit.length * m.smallLine, w: own.exitW, h: own.exit.length * m.smallLine },
        }
      : undefined;

    // The link hit area on detail pages: the card and its text, at least hitMin tall, kept
    // clear of the neighbouring cards. The AI card's box is the card alone.
    let box: Rect = { ...card };
    if (!isAi && text) {
      const prev = column > 0 ? centers[column - 1] + cols[column - 1].card + 4 : 0;
      const next = column < cols.length - 1 ? centers[column + 1] - cols[column + 1].card - 4 : W;
      const left = Math.max(Math.min(card.x, text.rect.x), prev);
      const right = Math.min(Math.max(card.x + card.w, text.rect.x + text.rect.w), next);
      box = { x: left, y: top, w: right - left, h: Math.max(bottom - top, m.hitMin) };
    }

    laid.push({
      id: node.id,
      index,
      kind: node.kind,
      label: node.label,
      app: node.app?.app,
      f,
      column,
      stacked,
      gold: node.kind === "human",
      box,
      card,
      text,
      exit,
      ports,
    });

    if (stacked || (stackLast && index === lastIndex - 1)) stackBottom = bottom;
    if (!stacked) textBand = Math.max(textBand, bottom);
  });

  // ----- Port labels -----
  const portLabelTop = textBand + 4;
  for (const node of laid) {
    for (const port of node.ports.bottom) {
      if (!m.portLabels) continue;
      const label = PORT_LABEL[port.port];
      const isAi = node.kind === "ai";
      const y = isAi ? node.card.y + node.card.h + 4 : portLabelTop;
      port.label = label;
      port.labelRect = { x: port.at.x + 6, y, w: textWidth(label, m.smallChar), h: m.smallLine };
    }
  }
  const trunkEnd = textBand + (m.portLabels ? m.smallLine + 12 : 10);
  const toolTop = trunkEnd + m.drop;

  // ----- Tool row -----
  type Pending = { node: FlowNodeInput; parent: LaidNode; item: Attachment; w: number; ideal: number; port: Point };
  const pending: Pending[] = [];
  nodes.forEach((node, index) => {
    const parent = laid[index];
    const items = sortedAttachments(node);
    const widths = items.map((item) =>
      Math.max(
        m.tool,
        m.toolTextMin,
        longestWord(item.label, m.labelChar),
        ...(SHOW_APP_LINE ? monoParts(monoLine(item) ?? "", m.monoWraps) : []).map((part) => textWidth(part, m.monoChar)),
      ),
    );
    const span = widths.reduce((sum, w) => sum + w, 0) + m.toolGap * Math.max(0, items.length - 1);
    let x = centers[parent.column] - span / 2;
    items.forEach((item, k) => {
      const port = parent.ports.bottom.find((candidate) => candidate.port === item.port)?.at ?? {
        x: centers[parent.column],
        y: parent.card.y + parent.card.h,
      };
      pending.push({ node, parent, item, w: widths[k], ideal: x + widths[k] / 2, port });
      x += widths[k] + m.toolGap;
    });
  });

  // Keep clear of a stacked output that reaches down into the tool row.
  const lastCol = cols.length - 1;
  const rightBound = stackLast && stackBottom > toolTop ? centers[lastCol] - Math.max(cols[lastCol].card, cols[lastCol].textL) - m.toolGap : W;
  const xs = pending.map((item) => item.ideal);
  for (let i = 0; i < xs.length; i += 1) {
    const min = i === 0 ? pending[0].w / 2 : xs[i - 1] + (pending[i - 1].w + pending[i].w) / 2 + m.toolGap;
    xs[i] = Math.max(xs[i], min);
  }
  for (let i = xs.length - 1; i >= 0; i -= 1) {
    const max =
      i === xs.length - 1 ? rightBound - pending[i].w / 2 : xs[i + 1] - (pending[i].w + pending[i + 1].w) / 2 - m.toolGap;
    xs[i] = Math.min(xs[i], max);
  }
  if (xs.length > 0 && xs[0] - pending[0].w / 2 < -0.5) {
    const need = pending.reduce((sum, item) => sum + item.w, 0) + m.toolGap * (pending.length - 1);
    return fail(`tool row needs ${Math.ceil(need)}px, has ${Math.floor(rightBound)}px`);
  }

  const tools: LaidTool[] = pending.map((entry, i) => {
    const cx = xs[i];
    const label = wrapLines(entry.item.label, entry.w, m.labelChar);
    const mono = SHOW_APP_LINE ? monoParts(monoLine(entry.item) ?? "", m.monoWraps) : [];
    const circle: Rect = { x: cx - m.tool / 2, y: toolTop, w: m.tool, h: m.tool };
    const textRect: Rect = {
      x: cx - entry.w / 2,
      y: toolTop + m.tool + m.toolTextGap,
      w: entry.w,
      h: label.length * m.labelLine + mono.length * m.monoLine,
    };
    return {
      id: entry.item.id,
      parentId: entry.parent.id,
      parentIndex: entry.parent.index,
      port: entry.item.port,
      label: entry.item.label,
      app: entry.item.app,
      f: entry.parent.f,
      circle,
      text: { label, mono, rect: textRect },
      box: { x: textRect.x, y: toolTop, w: entry.w, h: textRect.y + textRect.h - toolTop },
    };
  });

  // ----- Edges -----
  const edges: LaidEdge[] = [];
  for (let i = 0; i < laid.length; i += 1) {
    const node = laid[i];
    const next = laid[i + 1];
    if (next && !next.stacked && node.ports.right && next.ports.left) {
      edges.push({
        kind: "spine",
        keys: [i, i + 1],
        from: node.ports.right,
        to: next.ports.left,
        f: node.f,
        fromF: node.f,
        toF: next.f,
      });
    }
    if (next?.stacked && next.ports.left) {
      const gate = laid[i - 1];
      if (gate?.ports.right) {
        edges.push({
          kind: "fork",
          keys: [i - 1, i + 1],
          from: gate.ports.right,
          to: next.ports.left,
          f: gate.f,
          fromF: gate.f,
          toF: next.f,
        });
      }
    }
    if (node.exit) {
      edges.push({
        kind: "exit",
        keys: [i],
        from: { x: node.card.x + node.card.w / 2, y: node.card.y },
        to: { x: node.card.x + node.card.w / 2, y: node.exit.rect.y + node.exit.rect.h + 4 },
        f: node.f,
      });
    }
  }
  for (const tool of tools) {
    const parent = laid[tool.parentIndex];
    const port = parent.ports.bottom.find((candidate) => candidate.port === tool.port);
    if (!port) continue;
    const to: Point = { x: tool.circle.x + tool.circle.w / 2, y: tool.circle.y };
    const base = parent.f * W;
    const px = port.at.x - base;
    const tx = to.x - base;
    const mid = (trunkEnd + to.y) / 2;
    edges.push({
      kind: "tool",
      keys: [tool.parentIndex],
      from: port.at,
      to,
      f: parent.f,
      d: `M ${r(px)} ${r(port.at.y)} L ${r(px)} ${r(trunkEnd)} C ${r(px)} ${r(mid)}, ${r(tx)} ${r(mid)}, ${r(tx)} ${r(to.y)}`,
    });
  }

  const height = Math.ceil(
    Math.max(
      textBand,
      stackBottom,
      ...tools.map((tool) => tool.box.y + tool.box.h),
      ...laid.map((node) => node.box.y + node.box.h),
    ) + 4,
  );

  const result: FlowLayout = {
    ok: true,
    variant,
    columns,
    minWidth,
    width: W,
    height,
    nodes: laid,
    tools,
    edges,
  };
  return width === W ? result : atWidth(result, width);
}

function r(value: number): number {
  return Math.round(value * 100) / 100;
}

function shift(rect: Rect, dx: number): Rect {
  return { ...rect, x: rect.x + dx };
}

function shiftPoint(point: Point, dx: number): Point {
  return { ...point, x: point.x + dx };
}

/** Evaluate a layout made at its minimum width on a wider stage. */
export function atWidth(layout: FlowLayout, width: number): FlowLayout {
  const extra = width - layout.minWidth;
  const dx = (f: number) => f * extra;
  return {
    ...layout,
    width,
    nodes: layout.nodes.map((node) => {
      const d = dx(node.f);
      return {
        ...node,
        box: shift(node.box, d),
        card: shift(node.card, d),
        text: node.text ? { ...node.text, rect: shift(node.text.rect, d) } : undefined,
        exit: node.exit ? { ...node.exit, rect: shift(node.exit.rect, d) } : undefined,
        ports: {
          left: node.ports.left ? shiftPoint(node.ports.left, d) : undefined,
          right: node.ports.right ? shiftPoint(node.ports.right, d) : undefined,
          bottom: node.ports.bottom.map((port) => ({
            ...port,
            at: shiftPoint(port.at, d),
            labelRect: port.labelRect ? shift(port.labelRect, d) : undefined,
          })),
        },
      };
    }),
    tools: layout.tools.map((tool) => {
      const d = dx(tool.f);
      return {
        ...tool,
        circle: shift(tool.circle, d),
        box: shift(tool.box, d),
        text: { ...tool.text, rect: shift(tool.text.rect, d) },
      };
    }),
    edges: layout.edges.map((edge) => ({
      ...edge,
      from: shiftPoint(edge.from, dx(edge.fromF ?? edge.f)),
      to: shiftPoint(edge.to, dx(edge.toF ?? edge.f)),
    })),
  };
}

/** CSS left for a box laid out at minWidth: calc(f × 100% + px). */
export function fluidLeft(layout: FlowLayout, f: number, x: number): string {
  const px = r(x - f * layout.minWidth);
  const pct = r(f * 100);
  return `calc(${pct}% ${px < 0 ? "-" : "+"} ${Math.abs(px)}px)`;
}
