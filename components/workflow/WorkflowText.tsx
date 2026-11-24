import { EXITS, NODE_KINDS, type ExitId, type Workflow } from "@/content/workflows";

/** The same steps as plain HTML: indexable, printable, and readable without JavaScript. */
export function WorkflowText({ workflows, openId }: { workflows: Workflow[]; openId?: string }) {
  return (
    <div className="border-t border-rule">
      {workflows.map((workflow) => {
        const exits = (Object.keys(EXITS) as ExitId[]).filter((id) =>
          workflow.edges.some((edge) => edge.to === id),
        );
        return (
          <details key={workflow.id} open={workflow.id === openId} className="group/text border-b border-rule">
            <summary className="flex min-h-14 items-center justify-between gap-6 py-4">
              <h3 className="h4">{workflow.title}</h3>
              <span className="small shrink-0 text-muted">{workflow.nodes.length} steps</span>
            </summary>
            <div className="pb-8">
              <p className="max-w-[46rem]">{workflow.summary}</p>
              <ol className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
                {workflow.nodes.map((node, index) => (
                  <li key={node.id} className="border-l-2 border-rule pl-5">
                    <p className="font-semibold text-forest">
                      {index + 1}. {node.label}{" "}
                      <span className="small text-muted">({NODE_KINDS[node.kind].toLowerCase()})</span>
                    </p>
                    <p className="mt-1">{node.does}</p>
                    <p className="mt-1 text-muted">
                      <span className="font-semibold">Guardrail:</span> {node.guardrail}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="small mt-6 text-muted">
                A run can also stop at: {exits.map((id) => EXITS[id].toLowerCase()).join("; ")}.
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
