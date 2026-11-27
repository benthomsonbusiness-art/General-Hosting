import Link from "next/link";
import { RowLink } from "@/components/cards/RowLink";
import { HelpCta } from "@/components/layout/HelpCta";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { toFlowNodes } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { FlowPlayer } from "@/components/workflow/FlowPlayer";
import { WorkflowText } from "@/components/workflow/WorkflowText";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

const COPY = WORKFLOWS_PAGE;

/** /workflows: all three, each with its one-line summary and a compact drawing. */
export function WorkflowsIndex() {
  return (
    <>
      <section data-surface="dark" aria-labelledby="workflows-title" className="bg-obsidian">
        <div className="wrap pt-5 pb-16 lg:pb-24">
          <Breadcrumbs items={[{ name: "Workflows", path: "/workflows" }]} className="mb-2" />
          <h1 id="workflows-title" className="h1 mt-2 max-w-[16ch]">
            {COPY.title}
          </h1>
          <HelpCta />
          <h2 className="h3 mt-14">{COPY.listHeading}</h2>
          <ul className="mt-4 border-t border-line">
            {WORKFLOWS.map((workflow, index) => {
              const titleId = `wf-${workflow.id}`;
              return (
                <li key={workflow.id} className="grid gap-y-4 border-b border-line pb-10">
                  <div className="max-w-[44rem]">
                    <RowLink href={`/workflows/${workflow.id}`} title={workflow.title} titleId={titleId} />
                  </div>
                  <div className="min-w-0">
                    <FlowDiagram
                      id={`flow-${workflow.id}`}
                      title={workflow.title}
                      nodes={toFlowNodes(workflow)}
                      variant="compact"
                      stepsHref={`/workflows/${workflow.id}`}
                      labelledBy={titleId}
                      eager={index === 0}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}

function Decides({ workflow }: { workflow: Workflow }) {
  const gates = workflow.nodes.filter((node) => node.kind === "human" && node.gate);
  return (
    <section aria-labelledby="decides" className="mt-14">
      <h2 id="decides" className="h3">
        {COPY.decides.heading}
      </h2>
      {gates.length ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {gates.map((node) => (
            <li key={node.id} className="border-l-2 border-gold pl-4">
              <p className="font-semibold">{node.label}</p>
              <p className="mt-1 text-muted">
                {node.gate!.approver}. {node.gate!.channel}.
                {node.gate!.expiresAfter ? ` ${COPY.decides.expires} ${node.gate!.expiresAfter}.` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">{COPY.internalOnly}</p>
      )}
    </section>
  );
}

/** /workflows/[slug]: guided story + full diagram, human gate summary, then collapsible steps. */
export function WorkflowDetail({ workflow }: { workflow: Workflow }) {
  const index = WORKFLOWS.findIndex((item) => item.id === workflow.id);
  const previous = index > 0 ? WORKFLOWS[index - 1] : undefined;
  const next = index < WORKFLOWS.length - 1 ? WORKFLOWS[index + 1] : undefined;

  return (
    <>
      <section data-surface="dark" aria-labelledby="workflow-title" className="bg-obsidian">
        <div className="wrap pt-5 pb-16 lg:pb-20">
          <Breadcrumbs
            items={[
              { name: "Workflows", path: "/workflows" },
              { name: workflow.title, path: `/workflows/${workflow.id}` },
            ]}
            className="mb-2"
          />
          <h1 id="workflow-title" className="h1 mt-2 max-w-[18ch]">
            {workflow.title}
          </h1>
          <p className="lead measure mt-5 text-muted">{workflow.summary}</p>
          <HelpCta className="mt-6" />
          <div className="mt-10">
            <FlowPlayer workflow={workflow}>
              <FlowDiagram
                id={`flow-${workflow.id}`}
                title={workflow.title}
                nodes={toFlowNodes(workflow)}
                linkSteps
                labelledBy="workflow-title"
                eager
              />
            </FlowPlayer>
          </div>
          <Decides workflow={workflow} />
          <section aria-labelledby="steps" className="mt-14">
            <h2 id="steps" className="h3">
              {COPY.steps.heading}
            </h2>
            <div className="mt-6">
              <WorkflowText nodes={workflow.nodes} />
            </div>
          </section>
        </div>
      </section>
      <ClosingCta />
      <nav aria-label="More workflows" data-surface="dark" className="border-t border-line bg-obsidian">
        <div className="wrap grid gap-x-8 py-8 sm:grid-cols-2">
          {previous ? (
            <RowLink href={`/workflows/${previous.id}`} title={previous.title} line={COPY.previous} />
          ) : (
            <span />
          )}
          {next ? (
            <RowLink href={`/workflows/${next.id}`} title={next.title} line={COPY.next} className="sm:text-right" />
          ) : null}
          <Link href="/workflows" className="text-link inline-flex min-h-11 items-center sm:col-span-2">
            {COPY.all}
          </Link>
        </div>
      </nav>
    </>
  );
}
