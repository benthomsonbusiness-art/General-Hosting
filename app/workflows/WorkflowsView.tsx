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
      <section id="explorer" data-surface="light" aria-label="Workflow explorer" className="bg-paper">
        <WorkflowExplorer
          initialId={selected?.id ?? WORKFLOWS[0].id}
          heading={
            <>
              <Breadcrumbs items={crumbs} className="mb-2" />
              <h1 className="font-display text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-forest short:text-[2.15rem]">
                {WORKFLOWS_PAGE.title}
              </h1>
            </>
          }
        />
      </section>

      <Section surface="paper" labelledBy="text" className="border-t border-ink/12">
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
    </>
  );
}
