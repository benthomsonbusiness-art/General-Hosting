import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { WorkflowExplorer } from "@/components/workflow/WorkflowExplorer";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

export function WorkflowsView({ selected }: { selected?: Workflow }) {
  return (
    <section id="explorer" data-surface="dark" aria-label="Workflow explorer" className="bg-obsidian">
      <WorkflowExplorer
        initialId={selected?.id ?? WORKFLOWS[0].id}
        heading={
          <>
            <Breadcrumbs
              items={[
                { name: "Workflows", path: "/workflows" },
                ...(selected ? [{ name: selected.title, path: `/workflows/${selected.id}` }] : []),
              ]}
              className="mb-2"
            />
            <h1 className="h2 mt-2 max-w-[16ch] short:text-[2rem]">{WORKFLOWS_PAGE.title}</h1>
            <p className="mt-3 max-w-[36rem] text-muted">{WORKFLOWS_PAGE.dek}</p>
          </>
        }
      />
    </section>
  );
}
