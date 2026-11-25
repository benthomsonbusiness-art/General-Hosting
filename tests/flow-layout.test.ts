import assert from "node:assert/strict";
import { test } from "node:test";
import {
  layoutFlow,
  MAX_STAGE,
  METRICS,
  textWidth,
  type FlowLayout,
  type FlowNodeInput,
  type FlowVariant,
  type Point,
  type Rect,
} from "../components/workflow/flow/layout.ts";
import { WORKFLOWS } from "../content/workflows.ts";
import { FIXTURES } from "./fixtures/flow-fixtures.ts";

type Source = { name: string; nodes: FlowNodeInput[] };

const APP_KINDS = new Set(["trigger", "deterministic", "output"]);
const ready = (nodes: FlowNodeInput[]) => nodes.every((node) => !APP_KINDS.has(node.kind) || node.app);

const SOURCES: Source[] = [
  ...FIXTURES.map((item) => ({ name: `fixture ${item.id}`, nodes: item.nodes })),
  ...WORKFLOWS.map((item) => ({ name: item.id, nodes: item.nodes })),
];

const EPS = 0.01;

function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w - EPS && b.x < a.x + a.w - EPS && a.y < b.y + b.h - EPS && b.y < a.y + a.h - EPS;
}

function inside(rect: Rect, layout: FlowLayout): boolean {
  return rect.x >= -EPS && rect.y >= -EPS && rect.x + rect.w <= layout.width + EPS && rect.y + rect.h <= layout.height + EPS;
}

function same(a: Point | undefined, b: Point | undefined): boolean {
  return Boolean(a && b && Math.abs(a.x - b.x) < EPS && Math.abs(a.y - b.y) < EPS);
}

/** Every box something is drawn in: cards, text under cards, exits, port labels, circles and their text. */
function drawnBoxes(layout: FlowLayout): { what: string; rect: Rect }[] {
  const boxes: { what: string; rect: Rect }[] = [];
  for (const node of layout.nodes) {
    boxes.push({ what: `${node.id} card`, rect: node.card });
    if (node.text) boxes.push({ what: `${node.id} label`, rect: node.text.rect });
    if (node.exit) boxes.push({ what: `${node.id} exit`, rect: node.exit.rect });
    for (const port of node.ports.bottom) {
      if (port.labelRect) boxes.push({ what: `${node.id} ${port.port} port label`, rect: port.labelRect });
    }
  }
  for (const tool of layout.tools) {
    boxes.push({ what: `${tool.id} circle`, rect: tool.circle });
    boxes.push({ what: `${tool.id} label`, rect: tool.text.rect });
  }
  return boxes;
}

function check(layout: FlowLayout, variant: FlowVariant) {
  const m = METRICS[variant];

  // Text fits the width it is drawn in, at the estimated widths.
  for (const node of layout.nodes) {
    if (node.text) {
      assert.ok(node.text.label.length <= m.maxLabelLines, `${node.id}: label takes ${node.text.label.length} lines`);
      for (const line of node.text.label) {
        assert.ok(textWidth(line, m.labelChar) <= node.text.rect.w + EPS, `${node.id}: "${line}" is wider than its box`);
      }
      for (const line of node.text.mono ?? []) {
        assert.ok(textWidth(line, m.monoChar) <= node.text.rect.w + EPS, `${node.id}: mono "${line}" is wider than its box`);
      }
      if (!m.monoWraps) assert.ok((node.text.mono?.length ?? 0) <= 1, `${node.id}: mono line wraps`);
    }
    for (const line of node.exit?.lines ?? []) {
      assert.ok(textWidth(line, m.smallChar) <= node.exit!.rect.w + EPS, `${node.id}: exit "${line}" is wider than its box`);
    }
    // Gold marks a person deciding, and nothing else.
    assert.equal(node.gold, node.kind === "human", `${node.id}: gold on a ${node.kind} step`);
  }
  for (const tool of layout.tools) {
    assert.ok(tool.text.label.length <= 2, `${tool.id}: tool label takes ${tool.text.label.length} lines`);
    for (const line of [...tool.text.label.map((l) => textWidth(l, m.labelChar)), ...(tool.text.mono ?? []).map((l) => textWidth(l, m.monoChar))]) {
      assert.ok(line <= tool.text.rect.w + EPS, `${tool.id}: text wider than its box`);
    }
  }

  // Nothing overlaps, and everything stays on the stage.
  const boxes = drawnBoxes(layout);
  for (const box of boxes) assert.ok(inside(box.rect, layout), `${box.what} leaves the ${layout.width}px stage`);
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      assert.ok(!overlaps(boxes[i].rect, boxes[j].rect), `${boxes[i].what} overlaps ${boxes[j].what}`);
    }
  }
  // Link hit areas on detail pages never overlap each other.
  for (let i = 0; i < layout.nodes.length; i += 1) {
    for (let j = i + 1; j < layout.nodes.length; j += 1) {
      assert.ok(!overlaps(layout.nodes[i].box, layout.nodes[j].box), `${layout.nodes[i].id} and ${layout.nodes[j].id} hit areas overlap`);
    }
  }

  // Every edge starts and ends on a port.
  const byIndex = (index: number) => layout.nodes[index];
  for (const edge of layout.edges) {
    if (edge.kind === "spine") {
      const [a, b] = edge.keys.map(byIndex);
      assert.ok(same(edge.from, a.ports.right), `spine edge leaves ${a.id} off its right port`);
      assert.ok(same(edge.to, b.ports.left), `spine edge reaches ${b.id} off its left port`);
      assert.ok(edge.to.x > edge.from.x, `spine edge ${a.id} to ${b.id} runs backwards`);
    } else if (edge.kind === "fork") {
      const [gate, out] = edge.keys.map(byIndex);
      assert.equal(gate.kind, "human", "a fork leaves an approval");
      assert.ok(out.stacked, "a fork reaches the stacked output");
      assert.ok(same(edge.from, gate.ports.right) && same(edge.to, out.ports.left), "fork ends on ports");
    } else if (edge.kind === "tool") {
      const parent = byIndex(edge.keys[0]);
      assert.ok(
        parent.ports.bottom.some((port) => same(port.at, edge.from)),
        `tool edge from ${parent.id} does not start on a bottom port`,
      );
      assert.ok(
        layout.tools.some((tool) => same({ x: tool.circle.x + tool.circle.w / 2, y: tool.circle.y }, edge.to)),
        `tool edge from ${parent.id} does not end on a circle`,
      );
    } else {
      const node = byIndex(edge.keys[0]);
      assert.ok(same(edge.from, { x: node.card.x + node.card.w / 2, y: node.card.y }), `${node.id} exit stub leaves the card top`);
      assert.ok(edge.to.y < edge.from.y, `${node.id} exit stub points up`);
    }
  }
  for (const tool of layout.tools) {
    assert.ok(
      layout.edges.some((edge) => edge.kind === "tool" && same(edge.to, { x: tool.circle.x + tool.circle.w / 2, y: tool.circle.y })),
      `${tool.id} has no line`,
    );
  }
}

for (const source of SOURCES) {
  if (!ready(source.nodes)) {
    test(`${source.name}: diagram layout`, { skip: "steps have no app yet, so this workflow is not drawn in the new style" }, () => {});
    continue;
  }
  for (const variant of ["full", "compact"] as const) {
    test(`${source.name}: ${variant} diagram has no overlaps at its minimum width and at the widest stage`, () => {
      const first = layoutFlow(source.nodes, { variant });
      assert.ok(first.ok, first.ok ? "" : first.reason);
      const expected = variant === "compact" ? 680 : first.columns >= 6 ? 1040 : 880;
      assert.equal(first.minWidth, expected, `${first.columns} columns lay out from ${expected}px`);
      assert.ok(first.columns <= 6, `${first.columns} columns`);
      check(first, variant);
      const wide = layoutFlow(source.nodes, { variant, width: MAX_STAGE });
      assert.ok(wide.ok);
      check(wide, variant);
    });
  }
}

test("a width below the minimum is lifted to the minimum", () => {
  const layout = layoutFlow(FIXTURES[0].nodes, { width: 400 });
  assert.ok(layout.ok);
  assert.equal(layout.width, 880);
});

test("two outputs right after an approval stack in one column", () => {
  const nodes = [
    ...FIXTURES[0].nodes.slice(0, 4),
    FIXTURES[0].nodes[4],
    { ...FIXTURES[0].nodes[4], id: "second-output", label: "Book the kickoff call" },
  ];
  const layout = layoutFlow(nodes);
  assert.ok(layout.ok, layout.ok ? "" : layout.reason);
  assert.equal(layout.columns, 5);
  const [a, b] = layout.nodes.slice(-2);
  assert.equal(a.column, b.column);
  assert.ok(b.stacked && b.card.y > a.card.y);
  assert.equal(layout.edges.filter((edge) => edge.kind === "fork").length, 1);
  check(layout, "full");
});

test("a node without an app still lays out", () => {
  const nodes: FlowNodeInput[] = FIXTURES[0].nodes.map((node) => ({ id: node.id, label: node.label, kind: node.kind }));
  const layout = layoutFlow(nodes);
  assert.ok(layout.ok, layout.ok ? "" : layout.reason);
  for (const node of layout.nodes) assert.equal(node.text?.mono, undefined);
});
