import { EXITS, NODE_KINDS, type ExitId, type Workflow } from "@/content/workflows";

/** The same steps as plain HTML: indexable, printable, and readable without JavaScript. */
export function WorkflowText({ workflows }: { workflows: Workflow[] }) {
  return (
    <div>
      {workflows.map((workflow) => {
        const exits = (Object.keys(EXITS) as ExitId[]).filter((id) =>
          workflow.edges.some((edge) => edge.to === id),
        );
        return (
          <div key={workflow.id} className="pt-3 pb-6">
            <h3 className="h3">{workflow.title}</h3>
            <p className="measure mt-3">{workflow.summary}</p>
            <ol className="mt-6 grid gap-x-12 gap-y-6 md:grid-cols-2">
              {workflow.nodes.map((node, index) => (
                <li key={node.id}>
                  <p className="font-semibold">
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
              A run can also stop at: {exits.map((id) => EXITS[id].toLowerCase()).join("; ")}. {workflow.ownership}
            </p>
          </div>
        );
      })}
    </div>
  );
}
