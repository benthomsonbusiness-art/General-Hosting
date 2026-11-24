/**
 * Graph layout as arithmetic. x is a percentage of the canvas width, y is pixels, so edges
 * need no DOM measurement and the server can draw them.
 */
export const COLUMNS = 4;
export const NODE_W = 20.5;
export const GAP_X = 6;
export const NODE_H = 124;
export const GAP_Y = 60;
export const EXIT_GAP = 64;
export const EXIT_H = 48;
const EXIT_W = 29;
const EXIT_STEP = 35.5;

export type Point = { x: number; y: number };

export function rowsFor(count: number): number {
  return Math.ceil(count / COLUMNS);
}

export function gridHeight(count: number): number {
  const rows = rowsFor(count);
  return rows * NODE_H + (rows - 1) * GAP_Y;
}

export function canvasHeight(count: number, withExits: boolean): number {
  return gridHeight(count) + (withExits ? EXIT_GAP + EXIT_H : 0);
}

function box(index: number) {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  return { column, row, left: column * (NODE_W + GAP_X), top: row * (NODE_H + GAP_Y) };
}

/** The edge from node `index` to node `index + 1`. Wraps to the next row with an elbow. */
export function edgePoints(index: number): Point[] {
  const from = box(index);
  const to = box(index + 1);
  if (from.row === to.row) {
    const y = from.top + NODE_H / 2;
    return [
      { x: from.left + NODE_W, y },
      { x: to.left, y },
    ];
  }
  const middle = from.top + NODE_H + GAP_Y / 2;
  return [
    { x: from.left + NODE_W / 2, y: from.top + NODE_H },
    { x: from.left + NODE_W / 2, y: middle },
    { x: to.left + NODE_W / 2, y: middle },
    { x: to.left + NODE_W / 2, y: to.top },
  ];
}

/** The branch from a node down to one of the exit boxes under the grid. */
export function exitPoints(index: number, exitIndex: number, count: number): Point[] {
  const from = box(index);
  const center = from.left + NODE_W / 2;
  const bottom = from.top + NODE_H;
  const exitX = exitIndex * EXIT_STEP + EXIT_W / 2;
  const exitTop = gridHeight(count) + EXIT_GAP;
  const lane = exitTop - EXIT_GAP / 2;
  if (from.row === rowsFor(count) - 1) {
    return [
      { x: center, y: bottom },
      { x: center, y: lane },
      { x: exitX, y: lane },
      { x: exitX, y: exitTop },
    ];
  }
  const gutter =
    from.column < COLUMNS - 1 ? from.left + NODE_W + GAP_X / 2 : from.left - GAP_X / 2;
  return [
    { x: center, y: bottom },
    { x: center, y: bottom + 14 },
    { x: gutter, y: bottom + 14 },
    { x: gutter, y: lane },
    { x: exitX, y: lane },
    { x: exitX, y: exitTop },
  ];
}

/** Path data for an SVG with viewBox "0 0 100 <height>" and preserveAspectRatio="none". */
export function toPath(points: Point[]): string {
  return points.map((point, i) => `${i === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
}

/** Share of the trip spent on each leg. 1% of width is treated as about 7px. */
export function legTimes(points: Point[]): number[] {
  const lengths = points.slice(1).map((point, i) => {
    const previous = points[i];
    return Math.abs(point.x - previous.x) * 7 + Math.abs(point.y - previous.y);
  });
  const total = lengths.reduce((sum, value) => sum + value, 0) || 1;
  let run = 0;
  return [0, ...lengths.map((value) => (run += value / total))];
}
