import Link from "next/link";
import { RowLink } from "@/components/cards/RowLink";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { firstSentence, toFlowNodes } from "@/components/workflow/examples";
import { FlowDiagram } from "@/components/workflow/flow/FlowDiagram";
import { WorkflowText } from "@/components/workflow/WorkflowText";
import { INDUSTRIES } from "@/content/industries";
import { WORKFLOWS_PAGE } from "@/content/pages";
import { getService, serviceHref } from "@/content/services";
import { WORKFLOWS, type Workflow } from "@/content/workflows";

const COPY = WORKFLOWS_PAGE;

/** /workflows: all eight, each with its one-line summary and a compact drawing. No controls. */
export function WorkflowsIndex() {
  return (
    <section data-surface="dark" aria-labelledby="workflows-title" className="bg-obsidian">
      <div className="wrap pt-5 pb-16 lg:pb-24">
        <Breadcrumbs items={[{ name: "Workflows", path: "/workflows" }]} className="mb-2" />
        <h1 id="workflows-title" className="h1 mt-2 max-w-[16ch]">
          {COPY.title}
        </h1>
        <p className="lead mt-4 max-w-[36rem] text-muted">{COPY.dek}</p>
        <h2 className="h3 mt-14">{COPY.listHeading}</h2>
        <ul className="mt-4 border-t border-line">
          {WORKFLOWS.map((workflow, index) => {
            const titleId = `wf-${workflow.id}`;
            return (
              <li
                key={workflow.id}
                className="grid gap-x-8 gap-y-2 border-b border-line pb-10 min-[90rem]:grid-cols-12 min-[90rem]:pt-5"
              >
                <div className="min-[90rem]:col-span-4">
                  <RowLink
                    href={`/workflows/${workflow.id}`}
                    title={workflow.title}
                    line={firstSentence(workflow.summary)}
                    titleId={titleId}
                  />
                </div>
                <div className="min-w-0 min-[90rem]:col-span-8 min-[90rem]:pt-5">
                  <FlowDiagram
                    id={`flow-${workflow.id}`}
                    title={workflow.title}
                    nodes={toFlowNodes(workflow)}
                    variant="compact"
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
  );
}

function Fits({ workflow }: { workflow: Workflow }) {
  const industries = INDUSTRIES.filter((item) => workflow.industries.includes(item.slug));
  const services = workflow.services.map((slug) => getService(slug)).filter((item) => item !== undefined);
  return (
    <div className="mt-6 grid gap-1 text-muted">
      {industries.length ? (
        <p>
          <span className="font-semibold text-body">{COPY.fits}</span>{" "}
          {industries.map((item, index) => (
            <span key={item.slug}>
              <Link href={`/industries?industry=${item.slug}`} className="text-link inline-flex min-h-11 items-center underline">
                {item.name}
              </Link>
              {index < industries.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : null}
      {services.length ? (
        <p>
          <span className="font-semibold text-body">{COPY.service}</span>{" "}
          {services.map((service, index) => (
            <span key={service.slug}>
              <Link href={serviceHref(service.slug)} className="text-link inline-flex min-h-11 items-center underline">
                {service.name}
              </Link>
              {index < services.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : null}
    </div>
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
        <>
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
          <p className="mt-6">{COPY.decides.closing}</p>
        </>
      ) : (
        <p className="mt-4">{COPY.internalOnly}</p>
      )}
    </section>
  );
}

/** One sentence per way an item can stop, then who owns what. */
function Exits({ workflow }: { workflow: Workflow }) {
  const hasAi = workflow.nodes.some((node) => node.kind === "ai");
  const hasGate = workflow.nodes.some((node) => node.kind === "human");
  const lines = [
    ...(hasAi ? [COPY.exits.manual] : []),
    ...(hasGate ? [COPY.exits.rejected, COPY.exits.expired] : []),
  ];
  return (
    <p className="measure mt-8 text-muted">
      {lines.join(" ")} {workflow.ownership}
    </p>
  );
}

/** /workflows/[slug]: the drawing full width, where people decide, then every step in writing. */
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
          <div className="mt-10">
            <FlowDiagram
              id={`flow-${workflow.id}`}
              title={workflow.title}
              nodes={toFlowNodes(workflow)}
              linkSteps
              labelledBy="workflow-title"
              eager
            />
          </div>
          <Fits workflow={workflow} />
          <Decides workflow={workflow} />
          <section aria-labelledby="steps" className="mt-14">
            <h2 id="steps" className="h3">
              {COPY.steps.heading}
            </h2>
            <div className="mt-6">
              <WorkflowText nodes={workflow.nodes} />
            </div>
            <Exits workflow={workflow} />
          </section>
        </div>
      </section>
      <ClosingCta heading={COPY.closing} />
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
