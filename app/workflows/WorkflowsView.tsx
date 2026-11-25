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
      <section id="explorer" aria-label="Workflow explorer">
        <WorkflowExplorer
          initialId={selected?.id ?? WORKFLOWS[0].id}
          heading={
            <>
              <Breadcrumbs items={crumbs} className="mb-2" />
              <h1 className="font-display text-[clamp(2.4rem,1.7rem+1.9vw,3.4rem)] leading-[1.02] font-medium short:text-[2.5rem]">
                {WORKFLOWS_PAGE.title}
              </h1>
            </>
          }
        />
      </section>

      <Section surface="stone" labelledBy="text">
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
