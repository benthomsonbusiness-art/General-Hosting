import Image from "next/image";
import { EXITS, NODE_KINDS, type ExitId, type Workflow } from "@/content/workflows";
import { WORKFLOW_MEDIA } from "./media";

/** The same steps as plain HTML: indexable, printable, and readable without JavaScript. */
export function WorkflowText({ workflows }: { workflows: Workflow[] }) {
  return (
    <div className="grid gap-x-12 lg:grid-cols-2">
      {workflows.map((workflow) => {
        const media = WORKFLOW_MEDIA[workflow.id];
        const exits = (Object.keys(EXITS) as ExitId[]).filter((id) =>
          workflow.edges.some((edge) => edge.to === id),
        );
        return (
          <details key={workflow.id} className="group/text open:lg:col-span-2">
            <summary className="flex min-h-16 items-center gap-5 py-2">
              {media ? (
                <span className="relative h-12 w-10 shrink-0">
                  <Image src={media.cutoutSrc} alt="" fill sizes="40px" className="object-contain" />
                </span>
              ) : null}
              <h3 className="font-display text-[1.6rem] leading-tight font-medium">{workflow.title}</h3>
              <span aria-hidden className="ml-auto text-[1.4rem] text-forest group-open/text:rotate-45">
                +
              </span>
            </summary>
            <div className="pt-3 pb-10">
              <p className="max-w-[46rem]">{workflow.summary}</p>
              <ol className="mt-6 grid gap-x-12 gap-y-6 md:grid-cols-2">
                {workflow.nodes.map((node, index) => (
                  <li key={node.id}>
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
                A run can also stop at: {exits.map((id) => EXITS[id].toLowerCase()).join("; ")}. {workflow.ownership}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
