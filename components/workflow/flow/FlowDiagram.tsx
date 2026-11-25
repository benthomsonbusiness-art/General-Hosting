import { UserCheck } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { NODE_KINDS, type Attachment } from "@/content/workflows";
import { appName } from "@/lib/logos";
import { AppMark } from "./AppMark";
import {
  fluidLeft,
  gateLine,
  layoutFlow,
  METRICS,
  monoLine,
  PORT_LABEL,
  SHOW_APP_LINE,
  spineColumns,
  type FlowLayout,
  type FlowNodeInput,
  type FlowVariant,
  type LaidNode,
} from "./layout";

type Vars = CSSProperties & Record<`--${string}`, string>;

const SIZES: Record<FlowVariant, { mark: number; glyph: number; toolMark: number; toolGlyph: number; key: number }> = {
  full: { mark: 32, glyph: 28, toolMark: 24, toolGlyph: 20, key: 24 },
  compact: { mark: 24, glyph: 20, toolMark: 18, toolGlyph: 16, key: 20 },
};

const pct = (f: number) => `${Math.round(f * 10000) / 100}%`;
const px = (value: number) => `${Math.round(value * 100) / 100}px`;

/** "App: Operation" as two unbreakable halves, so a narrow box can only wrap after the colon. */
function Mono({ line }: { line?: string }) {
  if (!line) return null;
  // Hidden from sight, kept for screen readers: the logo alone carries the app visually.
  if (!SHOW_APP_LINE) return <span className="sr-only">{`, ${line}`}</span>;
  const at = line.indexOf(": ");
  return (
    <span className="flow-mono">
      {at === -1 ? (
        <span>{line}</span>
      ) : (
        <>
          <span>{line.slice(0, at + 1)}</span> <span>{line.slice(at + 2)}</span>
        </>
      )}
    </span>
  );
}

type Align = "start" | "center" | "end";

/** Which way a hover card opens, so cards near the edges stay inside the drawing. */
function alignFor(f: number): Align {
  if (f < 0.22) return "start";
  if (f > 0.78) return "end";
  return "center";
}

/** The "App: Operation" app, said plainly. Undefined for house glyphs with no product behind them. */
function productName(ref?: { app: string }): string | undefined {
  if (!ref) return undefined;
  const name = appName(ref.app as Parameters<typeof appName>[0]);
  return name;
}

/**
 * Hover and focus card: what the step does, how it is kept safe, and which other tools can do
 * the same job. Hidden from screen readers; the step text on the workflow page says the same.
 */
function Tip({
  kind,
  title,
  app,
  does,
  safeguard,
  alternatives,
  extra,
  align,
  place,
  linked,
}: {
  kind: string;
  title: string;
  app?: string;
  does?: string;
  safeguard?: string;
  alternatives?: string[];
  extra?: { label: string; value: string };
  align: Align;
  place: "below" | "above";
  linked: boolean;
}) {
  return (
    <span className="flow-tip" data-align={align} data-place={place} aria-hidden="true">
      <span className="flow-tip-kicker">
        {kind}
        {app ? <span className="flow-tip-app">{app}</span> : null}
      </span>
      <span className="flow-tip-title">{title}</span>
      {does ? <span className="flow-tip-body">{does}</span> : null}
      {extra ? (
        <span className="flow-tip-row">
          <span className="flow-tip-label">{extra.label}</span>
          {extra.value}
        </span>
      ) : null}
      {safeguard ? (
        <span className="flow-tip-row">
          <span className="flow-tip-label">Safeguard</span>
          {safeguard}
        </span>
      ) : null}
      {alternatives?.length ? (
        <span className="flow-tip-row">
          <span className="flow-tip-label">Also works with</span>
          <span className="flow-tip-chips">
            {alternatives.map((alt) => (
              <span key={alt} className="flow-tip-chip">
                {alt}
              </span>
            ))}
          </span>
        </span>
      ) : null}
      {linked ? <span className="flow-tip-more">Click for the full step →</span> : null}
    </span>
  );
}

const PORT_KIND: Record<Attachment["port"], string> = {
  model: "AI model",
  memory: "Memory",
  tools: "Tool the AI can use",
  calls: "Connected app",
};

/** Lines and exit stubs. Spine lines run center to center under the opaque cards. */
function Edges({ layout }: { layout: FlowLayout }) {
  const spineY = (index: number) => layout.nodes[index].card.y + layout.nodes[index].card.h / 2;
  return (
    <svg className="flow-edges" aria-hidden="true" focusable="false" height={layout.height}>
      {layout.edges.map((edge, i) => {
        const k = edge.keys.map((key) => `s${key}`).join(" ");
        if (edge.kind === "spine") {
          const y = spineY(edge.keys[0]);
          return (
            <g key={i}>
              <line className="flow-edge" data-k={k} x1={pct(edge.fromF!)} y1={y} x2={pct(edge.toF!)} y2={y} />
              <line className="flow-edge-run" x1={pct(edge.fromF!)} y1={y} x2={pct(edge.toF!)} y2={y} />
            </g>
          );
        }
        if (edge.kind === "fork") {
          const mid = pct((edge.fromF! + edge.toF!) / 2);
          const y1 = spineY(edge.keys[0]);
          const y2 = spineY(edge.keys[1]);
          return (
            <g key={i}>
              <line className="flow-edge" data-k={k} x1={mid} y1={y1} x2={mid} y2={y2} />
              <line className="flow-edge" data-k={k} x1={mid} y1={y2} x2={pct(edge.toF!)} y2={y2} />
            </g>
          );
        }
        const base = edge.f * layout.minWidth;
        return (
          <svg key={i} x={pct(edge.f)} overflow="visible">
            {edge.kind === "tool" ? (
              <path className="flow-edge flow-edge-dash" data-k={k} d={edge.d} />
            ) : (
              <line
                className="flow-edge flow-edge-dash flow-stub"
                data-k={k}
                x1={edge.from.x - base}
                y1={edge.from.y}
                x2={edge.to.x - base}
                y2={edge.to.y}
              />
            )}
          </svg>
        );
      })}
    </svg>
  );
}

function Card({
  node,
  laid,
  variant,
  eager,
}: {
  node: FlowNodeInput;
  laid?: LaidNode;
  variant: FlowVariant;
  eager: boolean;
}) {
  const size = SIZES[variant];
  const ports = laid?.ports;
  const shared = {
    "data-in": ports?.left ? "" : undefined,
    "data-out": ports?.right ? "" : undefined,
  };
  const bottom = ports?.bottom.map((port) => (
    <span key={port.port} aria-hidden className="flow-port" style={{ "--p": px(port.at.x - laid!.card.x) } as Vars} />
  ));
  if (node.kind === "ai") {
    return (
      <span className="flow-card flow-card-ai" {...shared}>
        <span className="flow-ai-label">{node.label}</span>
        {bottom}
      </span>
    );
  }
  if (node.kind === "human") {
    return (
      <span className="flow-card flow-card-gold" {...shared}>
        <UserCheck aria-hidden focusable="false" size={size.key} strokeWidth={1.75} />
      </span>
    );
  }
  return (
    <span className="flow-card" {...shared}>
      <AppMark app={node.app?.app} kind={node.kind} mark={size.mark} glyph={size.glyph} eager={eager} />
      {bottom}
    </span>
  );
}

/**
 * One workflow, drawn. Server-rendered HTML nodes over one aria-hidden SVG of lines; no client
 * JavaScript. The nodes are the ordered list a screen reader reads. Container queries switch
 * between the horizontal stage and the vertical list (see the .flow rules in globals.css).
 */
export function FlowDiagram({
  id,
  title,
  nodes,
  variant = "full",
  linkSteps = false,
  stepsHref,
  labelledBy,
  eager = false,
  footer,
}: {
  /** Unique on the page; prefixes element ids. */
  id: string;
  title: string;
  nodes: FlowNodeInput[];
  variant?: FlowVariant;
  /** Detail pages: each spine node links to its step in the text version (#step-{id}). */
  linkSteps?: boolean;
  /**
   * Page that holds the step text, e.g. "/workflows/lead-triage". Every node and tool circle
   * links to `${stepsHref}#step-{id}`. linkSteps is the same with the current page.
   */
  stepsHref?: string;
  /** Id of a visible heading that names the figure. Without it a hidden title is rendered. */
  labelledBy?: string;
  /** Load the marks of this figure right away (the first figure on the home page). */
  eager?: boolean;
  /** Rendered after the caption, inside the figure. */
  footer?: ReactNode;
}) {
  const result = layoutFlow(nodes, { variant });
  const layout = result.ok ? result : undefined;
  const m = METRICS[variant];
  const size = SIZES[variant];
  const { columns } = spineColumns(nodes);
  const titleId = labelledBy ?? `${id}-title`;
  const base = stepsHref ?? (linkSteps ? "" : undefined);
  const stepHref = (nodeId: string) => (base === undefined ? undefined : `${base}#step-${nodeId}`);

  const stageStyle: Vars | undefined = layout ? { "--stage-h": px(layout.height) } : undefined;

  return (
    <figure
      className="flow"
      data-variant={variant}
      data-cols={columns >= 6 ? "6" : "5"}
      data-layout={layout ? "auto" : "vertical"}
      aria-labelledby={titleId}
    >
      {labelledBy ? null : (
        <span id={titleId} className="sr-only">
          {title}
        </span>
      )}
      <div className="flow-canvas">
        <div className="flow-q">
          <div className="flow-frame">
            <div className="flow-stage" style={stageStyle}>
              {layout ? <Edges layout={layout} /> : null}
              <ol className="flow-spine" aria-label={`${title}, step by step`}>
                {nodes.map((node, index) => {
                  const laid = layout?.nodes[index];
                  const box = laid?.box;
                  const cardX = laid ? laid.card.x + laid.card.w / 2 : 0;
                  const boxStyle: Vars | undefined =
                    laid && layout && box
                      ? {
                          "--x": fluidLeft(layout, laid.f, box.x),
                          "--y": px(box.y),
                          "--w": px(box.w),
                          "--h": px(box.h),
                          "--card-l": px(laid.card.x - box.x),
                        }
                      : undefined;
                  const mono = node.kind === "human" ? gateLine(node) : monoLine(node.app);
                  const note = laid?.text?.note ? laid.text.note.join(" ") : undefined;
                  const exit = laid?.exit;
                  const inner = (
                    <>
                      <span className="sr-only">{`${NODE_KINDS[node.kind]}: `}</span>
                      <Card node={node} laid={laid} variant={variant} eager={eager && index === 0} />
                      {node.kind === "ai" ? null : (
                        <span
                          className="flow-text"
                          style={
                            laid?.text && box
                              ? ({
                                  "--l": px(cardX - box.x - (laid.text.wrap ?? laid.text.rect.w) / 2),
                                  "--t": px(laid.text.rect.y - box.y),
                                  "--tw": px(laid.text.wrap ?? laid.text.rect.w),
                                } as Vars)
                              : undefined
                          }
                        >
                          <span className="flow-label">{node.label}</span>
                          <Mono line={mono} />
                          {note ? <span className="flow-note">{note}</span> : null}
                        </span>
                      )}
                      {exit && box ? (
                        <span
                          className="flow-exit"
                          style={
                            {
                              "--l": px(cardX - box.x - exit.wrap / 2),
                              "--t": px(exit.rect.y - box.y),
                              "--tw": px(exit.wrap),
                            } as Vars
                          }
                        >
                          {exit.lines.join(" ")}
                        </span>
                      ) : null}
                      {laid && box && m.portLabels
                        ? laid.ports.bottom.map((port) =>
                            port.labelRect ? (
                              <span
                                key={port.port}
                                aria-hidden
                                className="flow-port-label"
                                style={
                                  { "--l": px(port.labelRect.x - box.x), "--t": px(port.labelRect.y - box.y) } as Vars
                                }
                              >
                                {PORT_LABEL[port.port]}
                              </span>
                            ) : null,
                          )
                        : null}
                      {laid ? (
                        <Tip
                          kind={NODE_KINDS[node.kind]}
                          title={node.label}
                          app={
                            node.kind === "human"
                              ? productName(node.gate ? { app: node.gate.channelApp } : undefined)
                              : productName(node.app)
                          }
                          does={node.does}
                          safeguard={node.guardrail}
                          alternatives={node.kind === "human" ? undefined : node.app?.alternatives}
                          extra={
                            node.kind === "human" && node.gate
                              ? { label: "Who approves", value: `${node.gate.approver}. ${node.gate.channel}.` }
                              : undefined
                          }
                          align={alignFor(laid.f)}
                          place="below"
                          linked={base !== undefined}
                        />
                      ) : null}
                    </>
                  );
                  const attached = layout?.tools.filter((tool) => tool.parentIndex === index) ?? [];
                  const items = node.attached ?? [];
                  return (
                    <li key={node.id} className="flow-item" data-k={`s${index}`} data-kind={node.kind}>
                      {base !== undefined ? (
                        <a className="flow-node" data-link="" href={stepHref(node.id)} style={boxStyle}>
                          {inner}
                        </a>
                      ) : (
                        <div className="flow-node" style={boxStyle}>
                          {inner}
                        </div>
                      )}
                      {items.length ? (
                        <ul className="flow-tools" aria-label={node.kind === "ai" ? "Model and tools" : "Calls"}>
                          {items.map((item, k) => {
                            const tool = attached.find((candidate) => candidate.id === item.id) ?? attached[k];
                            const toolStyle: Vars | undefined =
                              tool && layout
                                ? {
                                    "--x": fluidLeft(layout, tool.f, tool.box.x),
                                    "--y": px(tool.box.y),
                                    "--w": px(tool.box.w),
                                  }
                                : undefined;
                            const content = (
                              <>
                                <span className="flow-disc">
                                  <AppMark app={item.app} mark={size.toolMark} glyph={size.toolGlyph} eager={eager} />
                                </span>
                                <span className="flow-tool-text">
                                  <span className="sr-only">{`${PORT_LABEL[item.port]}: `}</span>
                                  <span className="flow-label">{item.label}</span>
                                  <Mono line={monoLine(item)} />
                                </span>
                                {tool && layout ? (
                                  <Tip
                                    kind={PORT_KIND[item.port]}
                                    title={item.label}
                                    app={productName(item)}
                                    does={item.does}
                                    safeguard={
                                      item.readOnly
                                        ? "Read-only. The AI can look things up here but never change anything."
                                        : undefined
                                    }
                                    alternatives={item.alternatives}
                                    align={alignFor((tool.circle.x + tool.circle.w / 2) / layout.minWidth)}
                                    place="above"
                                    linked={base !== undefined}
                                  />
                                ) : null}
                              </>
                            );
                            return (
                              <li key={item.id} className="flow-tool" style={toolStyle}>
                                {base !== undefined ? (
                                  <a className="flow-tool-link" data-link="" href={stepHref(node.id)}>
                                    {content}
                                  </a>
                                ) : (
                                  content
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {footer}
    </figure>
  );
}
