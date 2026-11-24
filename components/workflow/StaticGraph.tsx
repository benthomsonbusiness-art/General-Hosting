import type { Workflow } from "@/content/workflows";
import { edgePoints, gridHeight, toPath } from "@/lib/graph-geometry";
import { NodeGlyph, SHORT_KIND } from "./NodeGlyph";

/** Server-rendered picture of a graph. The teaser replaces it once it scrolls into view. */
export function StaticGraph({ workflow }: { workflow: Workflow }) {
  const height = gridHeight(workflow.nodes.length);
  return (
    <div className="relative">
      <svg
        aria-hidden
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 hidden w-full lg:block"
        style={{ height }}
        fill="none"
      >
        {workflow.nodes.slice(0, -1).map((node, index) => (
          <path
            key={node.id}
            d={toPath(edgePoints(index))}
            vectorEffect="non-scaling-stroke"
            stroke="#F7F4EC"
            strokeOpacity={0.3}
          />
        ))}
      </svg>
      <ol className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[repeat(4,20.5%)] lg:gap-x-[6%] lg:gap-y-[60px]">
        {workflow.nodes.map((node, index) => (
          <li key={node.id} className="pb-4 last:pb-0 lg:h-[124px] lg:pb-0">
            <div className="flex min-h-16 flex-col justify-between gap-1.5 border border-ivory/30 px-3 py-2.5 lg:h-full">
              <span className="flex items-center justify-between gap-2 text-[12px] text-ivory/75">
                <span className="flex items-center gap-1.5">
                  <NodeGlyph kind={node.kind} size={15} />
                  {SHORT_KIND[node.kind]}
                </span>
                <span>{index + 1}</span>
              </span>
              <span className="text-[14px] leading-[1.28] font-semibold text-ivory">{node.label}</span>
              <span className="flex min-h-4 items-center text-[12px] leading-none text-ivory/75">
                {node.timingLabel}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
