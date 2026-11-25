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
import { BODIES, wordCount } from "../content/insights/bodies.ts";
import { INSIGHTS } from "../content/insights/index.ts";
import * as scenarios from "../content/scenarios.ts";
import * as pages from "../content/pages.ts";
import { SERVICES, SUB_SERVICES } from "../content/services.ts";
import * as nav from "../content/site-nav.ts";
import { EXITS, WORKFLOWS, type Workflow } from "../content/workflows.ts";

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
walk(INSIGHTS, "insights");
walk(BODIES, "bodies");
walk(pages, "pages");
walk(SERVICES, "services");
walk(SUB_SERVICES, "subservices");
walk(nav, "nav");
walk(scenarios.SCENARIOS, "scenarios");
walk(WORKFLOWS, "workflows");

/** Text written directly in components: JSX text plus string attributes a reader can see. */
const SKIP_ATTR = /^(className|style|href|src|id|type|key|d|viewBox|sizes|points|transform|rel|role|name|autoComplete|fill|stroke.*|preserveAspectRatio)$/;
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
unique(WORKFLOWS.map((item) => item.id), "workflow ids");
unique([...SERVICES, ...SUB_SERVICES].map((item) => item.slug), "service slugs");
unique(INDUSTRIES.map((item) => item.slug), "industry slugs");
unique(INSIGHTS.map((item) => item.slug), "insight slugs");

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
  ...INSIGHTS.map((item) => ({ where: item.slug, text: item.metaDescription })),
  ...WORKFLOWS.map((item) => ({ where: item.id, text: item.metaDescription })),
  ...Object.entries(pages).flatMap(([name, value]) =>
    "metaDescription" in value ? [{ where: name, text: value.metaDescription }] : [],
  ),
];
for (const { where, text } of described) {
  if (text.length < 140 || text.length > 160) fail(`${where}: metaDescription is ${text.length} characters (140-160)`);
}
if (new Set(described.map((item) => item.text)).size !== described.length) fail("duplicate metaDescription");

// ---------- Insights ----------

const today = new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10); // US Eastern, no DST
for (const insight of INSIGHTS) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(insight.date) || insight.date > today) {
    fail(`${insight.slug}: date ${insight.date} is later than ${today}`);
  }
  refs(insight.workflowIds, workflowIds, insight.slug);
  refs(insight.services, serviceSlugs, insight.slug);
  refs(insight.industries, industrySlugs, insight.slug);
  const body = BODIES[insight.slug];
  if (!body) {
    fail(`${insight.slug}: no body`);
    continue;
  }
  const words = wordCount(body);
  const minutes = Math.max(1, Math.round(words / 220));
  if (words < 900 || words > 1400) fail(`${insight.slug}: ${words} words (900-1400)`);
  if (minutes !== insight.readMinutes) fail(`${insight.slug}: readMinutes should be ${minutes}`);
  for (const block of body) {
    if (block.type === "workflow") refs([block.id], workflowIds, insight.slug);
  }
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
    if (node.label.length > 32) fail(`${where}: label longer than 32 characters`);
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
for (const workflow of WORKFLOWS) {
  const list = scenarios.SCENARIOS[workflow.id];
  if (!list) fail(`${workflow.id}: no scenarios`);
  for (const item of list ?? []) {
    const stop = workflow.nodes.find((node) => node.id === item.stopAt);
    if (item.stopAt && (!stop || stop.kind === "human")) fail(`${workflow.id}/${item.id}: bad stopAt`);
  }
}

const size = JSON.stringify(WORKFLOWS).length;
if (size > 44 * 1024) fail(`workflow data is ${Math.round(size / 1024)} KB`);

if (errors.length > 0) {
  console.error(`Content check failed with ${errors.length} problem(s):`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `Content check passed: ${WORKFLOWS.length} workflows, ${SERVICES.length + SUB_SERVICES.length} services, ${INDUSTRIES.length} industries, ${INSIGHTS.length} insights (${Math.round(size / 1024)} KB of workflow data).`,
);
