import { CtaBand } from "@/components/layout/CtaBand";
import { Container, Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { WorkflowExplorer } from "@/components/workflow/WorkflowExplorer";
import { WorkflowText } from "@/components/workflow/WorkflowText";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

export function WorkflowsView({ selected }: { selected?: Workflow }) {
  const crumbs = [
    { name: "Workflows", path: "/workflows" },
    ...(selected ? [{ name: selected.title, path: `/workflows/${selected.id}` }] : []),
  ];
  return (
    <>
      <section id="explorer" aria-label="Workflow explorer" data-surface="dark" className="bg-obsidian">
        <div className="wrap flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 pt-5 pb-3">
          <div>
            <Breadcrumbs items={crumbs} className="mb-1" />
            <h1 className="font-display text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] leading-none font-medium">
              Watch one thing change
            </h1>
          </div>
          <p className="text-muted">{WORKFLOWS_PAGE.dek}</p>
        </div>
        <WorkflowExplorer initialId={selected?.id ?? WORKFLOWS[0].id} />
      </section>

      <Section labelledBy="text">
        <Container>
          <h2 id="text" className="h2">
            Every step, in writing
          </h2>
          <p className="mt-4 max-w-[40rem] text-muted">{WORKFLOWS_PAGE.note}</p>
          <div className="mt-8">
            <WorkflowText workflows={WORKFLOWS} />
          </div>
        </Container>
      </Section>

      <CtaBand headline={["Want one of these", "mapped to your tools?"]} />
    </>
  );
}
