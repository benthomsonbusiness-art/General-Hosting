import Link from "next/link";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { ExampleFlow } from "@/components/workflow/ExampleFlow";
import { flowExample, flowExamples } from "@/components/workflow/examples";
import { FlowFigure } from "@/components/workflow/Flowchart";
import { WorkflowText } from "@/components/workflow/WorkflowText";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

export function WorkflowsView({ selected }: { selected?: Workflow }) {
  const drawn = selected ? flowExample(selected.id) : null;

  return (
    <section data-surface="dark" aria-label="Workflow examples" className="bg-obsidian">
      <div className="wrap pt-5 pb-14">
        <Breadcrumbs
          items={[
            { name: "Workflows", path: "/workflows" },
            ...(selected ? [{ name: selected.title, path: `/workflows/${selected.id}` }] : []),
          ]}
          className="mb-2"
        />
        {drawn && selected ? (
          <>
            <h1 className="h2 mt-2 max-w-[18ch]">{selected.title}</h1>
            <div className="mt-8">
              <FlowFigure title={drawn.title} sentence={drawn.sentence} nodes={drawn.nodes} />
            </div>
            <div className="mt-12">
              <h2 className="h3">Every step, in writing</h2>
              <WorkflowText workflows={[selected]} />
            </div>
            <Link href="/workflows" className="text-link mt-4 inline-flex min-h-11 items-center">
              All workflows
            </Link>
          </>
        ) : (
          <>
            <h1 className="h2 mt-2 max-w-[16ch]">{WORKFLOWS_PAGE.title}</h1>
            <p className="mt-3 max-w-[36rem] text-muted">{WORKFLOWS_PAGE.dek}</p>
            <div className="mt-10">
              <ExampleFlow examples={flowExamples()} />
            </div>
            <h2 className="h3 mt-14">All eight</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {WORKFLOWS.map((workflow) => (
                <li key={workflow.id}>
                  <Link href={`/workflows/${workflow.id}`} className="block py-4">
                    <span className="block text-[1.2rem]">{workflow.title}</span>
                    <span className="mt-1 block text-muted">{`${workflow.summary.split(". ")[0]}.`}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
