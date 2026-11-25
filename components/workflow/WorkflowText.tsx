import { WORKFLOWS_PAGE } from "@/content/pages";
import { NODE_KINDS, type WorkflowNode } from "@/content/workflows";
import { appName } from "@/lib/logos";
import { OpenStepFromHash } from "./OpenStepFromHash";

type Step = Pick<
  WorkflowNode,
  "id" | "label" | "kind" | "does" | "guardrail" | "failure"
> &
  Partial<Pick<WorkflowNode, "app" | "attached">>;

function orList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

/**
 * The same steps as plain HTML: indexable, printable, and readable without JavaScript. One
 * collapsible row per step, each the target of its node in the drawing (#step-{id}).
 */
export function WorkflowText({ nodes }: { nodes: Step[] }) {
  const copy = WORKFLOWS_PAGE.steps;
  return (
    <>
      <OpenStepFromHash />
      <ol className="border-t border-line">
        {nodes.map((node) => {
          const alternatives = node.app?.alternatives ?? [];
          const attached = node.attached ?? [];
          return (
            <li key={node.id} className="border-b border-line">
              <details id={`step-${node.id}`} className="group/step">
                <summary className="flex min-h-14 items-center justify-between gap-4 py-3">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="row-title">{node.label}</span>
                    <span className="small border border-line px-2 py-0.5 text-muted">
                      {NODE_KINDS[node.kind]}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current group-open/step:after:hidden"
                  />
                </summary>
                <div className="measure grid gap-2 pb-6">
                  <p>{node.does}</p>
                  <p className="text-muted">
                    <span className="font-semibold text-body">
                      {copy.check}
                    </span>{" "}
                    {node.guardrail}
                  </p>
                  <p className="text-muted">{node.failure}</p>
                  {attached.length ? (
                    <div className="text-muted">
                      <p className="font-semibold text-body">{copy.uses}</p>
                      <ul className="mt-1 grid gap-1">
                        {attached.map((item) => (
                          <li key={item.id}>
                            {item.label}: {appName(item.app)}
                            {item.alternatives.length
                              ? ` (or ${orList(item.alternatives)})`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {alternatives.length ? (
                    <p className="text-muted">
                      <span className="font-semibold text-body">
                        {copy.alternatives}
                      </span>{" "}
                      {alternatives.join(", ")}
                    </p>
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </>
  );
}
