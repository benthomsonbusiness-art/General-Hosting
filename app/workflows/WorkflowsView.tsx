import { DefinitionRows } from "@/components/content/Blocks";
import { CtaBand } from "@/components/layout/CtaBand";
import { HeroBlock } from "@/components/layout/Heroes";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { WorkflowExplorer } from "@/components/workflow/WorkflowExplorer";
import { WorkflowText } from "@/components/workflow/WorkflowText";
import { PRINCIPLES } from "@/content/approach";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

export function WorkflowsView({ selected }: { selected?: Workflow }) {
  const crumbs = [
    { name: "Workflows", path: "/workflows" },
    ...(selected ? [{ name: selected.title, path: `/workflows/${selected.id}` }] : []),
  ];
  return (
    <>
      <HeroBlock
        title="Workflow blueprints"
        dek={WORKFLOWS_PAGE.dek}
        crumbs={crumbs}
        aside={<p className="border-l-2 border-gold pl-5 text-[15px] leading-6 font-medium">{WORKFLOWS_PAGE.note}</p>}
      />

      <section id="explorer" aria-label="Workflow explorer" data-surface="dark" className="bg-obsidian">
        <WorkflowExplorer initialId={selected?.id ?? WORKFLOWS[0].id} />
      </section>

      <Section labelledBy="text">
        <Container>
          <SectionHeading
            id="text"
            title="Every step, in text"
            lede="The same blueprints as plain lists, with the guardrail on each step."
          />
          <div className="mt-8">
            <WorkflowText workflows={WORKFLOWS} openId={selected?.id} />
          </div>
        </Container>
      </Section>

      <Section surface="stone" labelledBy="common">
        <Container>
          <SectionHeading id="common" title="What every blueprint has in common" />
          <div className="mt-8">
            <DefinitionRows rows={PRINCIPLES.map((item) => ({ title: item.title, body: item.short }))} />
          </div>
        </Container>
      </Section>

      <CtaBand
        headline={["Want one of these", "mapped to your tools?"]}
        body="Tell us which process it would replace and which systems it touches. The audit works out whether it is worth building."
      />
    </>
  );
}
