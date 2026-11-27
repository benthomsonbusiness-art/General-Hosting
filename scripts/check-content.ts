/**
 * Content checks. Runs before every build (npm prebuild) with plain Node type stripping.
 * Fails on broken references, future dates, sends without a gate, and banned copy.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import * as approach from "../content/approach.ts";
import * as engagements from "../content/engagements.ts";
import { INDUSTRIES } from "../content/industries.ts";
import * as scenarios from "../content/scenarios.ts";
import * as pages from "../content/pages.ts";
import { SERVICES } from "../content/services.ts";
import * as nav from "../content/site-nav.ts";
import { EXITS, WORKFLOWS, type Workflow, type WorkflowNode } from "../content/workflows.ts";
import { appName, isAppSlug, isGlyph } from "../lib/logos.ts";

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

// ---------- Banned copy ----------

const BANNED: [RegExp, string][] = [
  [/\bunlock\w*/i, "unlock"],
  [/\bsupercharg\w*/i, "supercharge"],
  [/\bseamless\w*/i, "seamless"],
  [/\belevat(e|es|ed|ing)\b/i, "elevate"],
  [/\brevolutioni\w*/i, "revolutionize"],
  [/\bcutting[- ]edge\b/i, "cutting-edge"],
  [/\bgame[- ]chang\w*/i, "game-changing"],
  [/\bdelv(e|es|ed|ing)\b/i, "delve"],
  [/\bsynerg\w*/i, "synergy"],
  [/\bleverag\w*/i, "leverage"],
  [/\bempower\w*/i, "empower"],
  [/\bharness\w*/i, "harness"],
  [/\btransform\w*/i, "transform"],
  [/\brobust\w*/i, "robust"],
  [/\bholistic\w*/i, "holistic"],
  [/\b(best-in-class|world-class|next-level|industry-leading)\b/i, "superlative"],
  [/\binnovativ\w*/i, "innovative"],
  [/\bstreamlin\w*/i, "streamline"],
  [/\beffortless\w*/i, "effortless"],
  [/\bfrictionless\b/i, "frictionless"],
  [/\bend-to-end\b/i, "end-to-end"],
  [/\bturnkey\b/i, "turnkey"],
  [/\bbespoke\b/i, "bespoke"],
  [/\btailored\b/i, "tailored"],
  [/\bjourneys?\b/i, "journey"],
  [/\blandscapes?\b/i, "landscape"],
  [/\brealms?\b/i, "realm"],
  [/\btapestry\b/i, "tapestry"],
  [/\bparadigm\w*/i, "paradigm"],
  [/fast-paced world|ever-evolving|imagine a world|say goodbye to|the future of/i, "stock phrase"],
  [/\bnot just\b.{1,60}\bit['’]s\b/i, "not just X, it's Y"],
  [/\bAI-powered\b/i, "AI-powered"],
  [/\bactually\b/i, "actually"],
  [/limited spots|act now/i, "fake urgency"],
  [/trusted by|clients include|years of experience|\bour (team of|partners|experts|clients)\b/i, "claim"],
  [/\bproven\b|\bcertified\b/i, "claim"],
  [/!(?!=)/, "exclamation mark"],
  [/\d\s?%/, "percentage"],
  [/\b\d+(\.\d+)?x\b/i, "multiplier"],
  [/\$\s?\d/, "dollar figure"],
];

const HERO_EXCEPTION = "actually run on";

function checkCopy(text: string, where: string) {
  const clean = text.replace(HERO_EXCEPTION, "");
  for (const [pattern, label] of BANNED) {
    const match = clean.match(pattern);
    if (match) fail(`${where}: banned copy (${label}): "${match[0]}" in "${clean.trim().slice(0, 90)}"`);
  }
  if ((clean.match(/—/g) ?? []).length > 1) fail(`${where}: more than one em dash in one paragraph`);
}

/** Every string in a content value. Keys that hold code or addresses are skipped. */
const SKIP_KEYS = new Set(["payload", "href", "src", "slug", "id", "position", "keywords", "match"]);
function walk(value: unknown, where: string) {
  if (typeof value === "string") checkCopy(value, where);
  else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${where}[${index}]`));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (!SKIP_KEYS.has(key)) walk(item, `${where}.${key}`);
    }
  }
}

walk(approach, "approach");
walk(engagements.ENGAGEMENTS, "engagements");
walk(INDUSTRIES, "industries");
walk(pages, "pages");
walk(SERVICES, "services");
walk(nav, "nav");
walk(scenarios.SCENARIOS, "scenarios");
walk(WORKFLOWS, "workflows");

/** Text written directly in components: JSX text plus string attributes a reader can see. */
const SKIP_ATTR =
  /^(className|style|href|src|id|type|key|d|viewBox|sizes|points|transform|rel|role|name|autoComplete|fill|stroke.*|preserveAspectRatio)$/;
function checkTsx(path: string) {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node) && node.text.trim()) checkCopy(node.text, path);
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText();
      if (SKIP_ATTR.test(name)) return;
      if (node.initializer && ts.isStringLiteral(node.initializer)) checkCopy(node.initializer.text, path);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}
for (const file of [...tsxFiles("app"), ...tsxFiles("components")]) checkTsx(file);

// ---------- Ids and references ----------

function unique(values: string[], what: string) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) fail(`${what}: duplicate "${value}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) fail(`${what}: "${value}" is not kebab-case`);
    seen.add(value);
  }
}

const workflowIds = new Set(WORKFLOWS.map((item) => item.id));
const serviceSlugs = new Set(SERVICES.map((item) => item.slug));
const industrySlugs = new Set(INDUSTRIES.map((item) => item.slug));

unique([...workflowIds].concat(WORKFLOWS.length === workflowIds.size ? [] : ["duplicate-workflow"]), "workflows");
unique(
  WORKFLOWS.map((item) => item.id),
  "workflow ids",
);
unique(
  SERVICES.map((item) => item.slug),
  "service slugs",
);
unique(
  INDUSTRIES.map((item) => item.slug),
  "industry slugs",
);

function refs(ids: string[], valid: Set<string>, where: string) {
  for (const id of ids) if (!valid.has(id)) fail(`${where}: unknown reference "${id}"`);
}

for (const item of [...SERVICES, ...INDUSTRIES]) {
  refs(item.workflowIds, workflowIds, item.slug);
}
for (const item of INDUSTRIES) {
  for (const id of item.workflowIds) {
    const workflow = WORKFLOWS.find((candidate) => candidate.id === id);
    if (workflow && !workflow.industries.includes(item.slug)) {
      fail(`${item.slug}: workflow ${id} does not list this industry`);
    }
  }
}

// ---------- Descriptions ----------

const described: { where: string; text: string }[] = [
  ...SERVICES.map((item) => ({ where: item.slug, text: item.metaDescription })),
  ...WORKFLOWS.map((item) => ({ where: item.id, text: item.metaDescription })),
  ...Object.entries(pages).flatMap(([name, value]) =>
    typeof value === "object" && "metaDescription" in value ? [{ where: name, text: value.metaDescription }] : [],
  ),
];
for (const { where, text } of described) {
  if (text.length < 140 || text.length > 160) fail(`${where}: metaDescription is ${text.length} characters (140-160)`);
}
if (new Set(described.map((item) => item.text)).size !== described.length) fail("duplicate metaDescription");

// ---------- Diagram data ----------

const MONO_MAX = 22;
const DOMAIN = /\b[a-z0-9-]+\.[a-z]{2,}\b/gi;
const APP_KINDS = new Set(["trigger", "deterministic", "output"]);

/** The mono line under a card or circle: "App: Operation". */
function checkMono(app: string, operation: string, where: string) {
  if (!isAppSlug(app) && !isGlyph(app)) {
    fail(`${where}: "${app}" is not an app slug or glyph`);
    return;
  }
  const mono = `${appName(app)}: ${operation}`;
  if (mono.length > MONO_MAX) fail(`${where}: "${mono}" is longer than ${MONO_MAX} characters`);
  for (const domain of operation.match(DOMAIN) ?? []) {
    if (!domain.endsWith(".example")) fail(`${where}: operation names a real domain "${domain}"`);
  }
}

function checkDiagram(node: WorkflowNode, where: string) {
  if (APP_KINDS.has(node.kind)) {
    if (!node.app) fail(`${where}: ${node.kind} nodes need an app`);
    else checkMono(node.app.app, node.app.operation, where);
  } else if (node.app) {
    fail(`${where}: ${node.kind} nodes carry no app`);
  }
  if (node.gate) checkMono(node.gate.channelApp, node.gate.operation, `${where} gate`);
  if (node.stopLabel !== undefined) {
    if (node.kind !== "deterministic" && node.kind !== "ai") fail(`${where}: stopLabel only on rule or AI steps`);
    if (node.stopLabel.length > 40) fail(`${where}: stopLabel longer than 40 characters`);
  }
  const attached = node.attached ?? [];
  if (attached.length > 5) fail(`${where}: more than 5 attachments`);
  const models = attached.filter((item) => item.port === "model").length;
  if (node.kind === "ai" && models !== 1) fail(`${where}: AI steps need exactly one model attachment`);
  for (const item of attached) {
    const at = `${where}/${item.id}`;
    if (item.label.length > 24) fail(`${at}: attachment label longer than 24 characters`);
    checkMono(item.app, item.operation, at);
    if (item.port === "calls" && node.kind !== "trigger" && node.kind !== "deterministic") {
      fail(`${at}: calls only on trigger and rule steps`);
    }
    if (item.port !== "calls" && node.kind !== "ai") fail(`${at}: ${item.port} only on AI steps`);
    if (node.kind === "ai") {
      if (!item.readOnly) fail(`${at}: everything an AI step holds must be read-only`);
      if (/\d+\.\d+/.test(`${item.label} ${item.operation}`)) fail(`${at}: no version numbers`);
    }
    if (item.port === "model" && /\d/.test(`${item.label} ${item.operation}`)) {
      fail(`${at}: model labels carry no version number`);
    }
  }
}

/** Spine columns as drawn: two outputs directly after one approval stack in one column. */
function spineColumns(workflow: Workflow): number {
  return workflow.nodes.filter((node, index, nodes) => {
    const stacked = node.kind === "output" && nodes[index - 1]?.kind === "output" && nodes[index - 2]?.kind === "human";
    return !stacked;
  }).length;
}

// ---------- Workflows ----------

function checkWorkflow(workflow: Workflow) {
  const ids = workflow.nodes.map((node) => node.id);
  unique(ids, `${workflow.id} nodes`);
  const valid = new Set([...ids, ...Object.keys(EXITS)]);
  refs(workflow.services, serviceSlugs, workflow.id);
  refs(workflow.industries, industrySlugs, workflow.id);
  for (const edge of workflow.edges) refs([edge.from, edge.to], valid, `${workflow.id} edges`);
  if (workflow.nodes.filter((node) => node.kind === "trigger").length !== 1) {
    fail(`${workflow.id}: needs exactly one trigger`);
  }

  const parents = (id: string) => workflow.edges.filter((edge) => edge.to === id).map((edge) => edge.from);
  const ancestors = (id: string, seen = new Set<string>()): Set<string> => {
    for (const parent of parents(id)) {
      if (!seen.has(parent)) {
        seen.add(parent);
        ancestors(parent, seen);
      }
    }
    return seen;
  };

  for (const node of workflow.nodes) {
    const where = `${workflow.id}/${node.id}`;
    if (node.label.length > 28) fail(`${where}: label longer than 28 characters`);
    checkDiagram(node, where);
    if (/\d\s?ms\b/.test(node.timingLabel)) fail(`${where}: timingLabel must not be a precise time`);
    if (node.kind === "human" && !node.gate) fail(`${where}: human nodes need a gate`);
    if (node.kind !== "human" && node.gate) fail(`${where}: only human nodes have gates`);
    if (node.kind === "ai" && !node.confidence) fail(`${where}: AI nodes need a confidence threshold`);
    if (node.kind === "output" && !node.audience) fail(`${where}: outputs need an audience`);
    if (node.kind === "output" && node.audience === "external") {
      const gated = [...ancestors(node.id)].some(
        (id) => workflow.nodes.find((candidate) => candidate.id === id)?.kind === "human",
      );
      if (!gated) fail(`${where}: external output without a human step before it`);
    }
    try {
      const payload = JSON.parse(node.payload) as Record<string, unknown>;
      if (payload._sample !== true) fail(`${where}: payload needs "_sample": true`);
      for (const address of node.payload.match(/[\w.]+@[\w.]+/g) ?? []) {
        if (!address.endsWith(".example")) fail(`${where}: ${address} must use a .example domain`);
      }
    } catch {
      fail(`${where}: payload is not valid JSON`);
    }
  }
}
WORKFLOWS.forEach(checkWorkflow);

const COMPLIANCE = /\bcomplian(t|ce)\b|\bbias[- ]audit/i;
for (const workflow of WORKFLOWS) {
  const columns = spineColumns(workflow);
  if (columns > 6) fail(`${workflow.id}: ${columns} spine columns (at most 6)`);
  const ids = workflow.nodes.flatMap((node) => [node.id, ...(node.attached ?? []).map((item) => item.id)]);
  unique(ids, `${workflow.id} node and attachment ids`);
  const copy = JSON.stringify(workflow, (key, value) => (key === "payload" ? undefined : value));
  const claim = copy.match(COMPLIANCE);
  if (claim) fail(`${workflow.id}: no compliance claims ("${claim[0]}")`);
}
for (const workflow of WORKFLOWS) {
  const list = scenarios.SCENARIOS[workflow.id];
  if (!list) fail(`${workflow.id}: no scenarios`);
  for (const item of list ?? []) {
    const stop = workflow.nodes.find((node) => node.id === item.stopAt);
    if (item.stopAt && (!stop || stop.kind === "human")) fail(`${workflow.id}/${item.id}: bad stopAt`);
  }
}

const size = JSON.stringify(WORKFLOWS).length;
if (size > 52 * 1024) fail(`workflow data is ${Math.round(size / 1024)} KB`);

if (errors.length > 0) {
  console.error(`Content check failed with ${errors.length} problem(s):`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `Content check passed: ${WORKFLOWS.length} workflows, ${SERVICES.length} services, ${INDUSTRIES.length} industries (${Math.round(size / 1024)} KB of workflow data).`,
);
