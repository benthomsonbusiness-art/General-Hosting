import assert from "node:assert/strict";
import { test } from "node:test";
import { WORKFLOWS, type Workflow, type WorkflowNode } from "../content/workflows.ts";
import { appName } from "../lib/logos.ts";

/** The mono line drawn under a card or circle. */
function mono(app: Parameters<typeof appName>[0], operation: string): string {
  return `${appName(app)}: ${operation}`;
}

/** Spine columns as drawn: two outputs directly after one approval stack in one column. */
function columns(workflow: Workflow): number {
  return workflow.nodes.filter(
    (node, index, nodes) =>
      !(node.kind === "output" && nodes[index - 1]?.kind === "output" && nodes[index - 2]?.kind === "human"),
  ).length;
}

function operations(node: WorkflowNode): string[] {
  return [
    ...(node.app ? [node.app.operation] : []),
    ...(node.gate ? [node.gate.operation] : []),
    ...(node.attached ?? []).map((item) => item.operation),
  ];
}

/** Visible copy of a workflow, without payloads, ids and edges. */
function copy(workflow: Workflow): string {
  const hidden = new Set(["payload", "id", "edges"]);
  return JSON.stringify(workflow, (key, value) => (hidden.has(key) ? undefined : value));
}

for (const workflow of WORKFLOWS) {
  test(`${workflow.id}: spine fits the canvas`, () => {
    assert.ok(columns(workflow) <= 6, `${columns(workflow)} columns`);
    assert.equal(workflow.nodes[0].kind, "trigger", "the first step is the trigger");
    assert.equal(workflow.nodes.filter((node) => node.kind === "trigger").length, 1, "one trigger");
  });

  test(`${workflow.id}: labels and mono lines are short enough to draw`, () => {
    for (const node of workflow.nodes) {
      assert.ok(node.label.length <= 28, `${node.id}: "${node.label}"`);
      assert.match(node.label, /^[A-Z0-9#]/, `${node.id}: label starts with a capital`);
      if (node.app) assert.ok(mono(node.app.app, node.app.operation).length <= 22, `${node.id}: mono line`);
      if (node.gate) assert.ok(mono(node.gate.channelApp, node.gate.operation).length <= 22, `${node.id}: gate mono line`);
      if (node.stopLabel !== undefined) assert.ok(node.stopLabel.length <= 40, `${node.id}: stopLabel`);
      for (const item of node.attached ?? []) {
        assert.ok(item.label.length <= 24, `${node.id}/${item.id}: "${item.label}"`);
        assert.ok(mono(item.app, item.operation).length <= 22, `${node.id}/${item.id}: mono line`);
      }
    }
  });

  test(`${workflow.id}: every card names an app in the right place`, () => {
    for (const node of workflow.nodes) {
      const drawsApp = node.kind === "trigger" || node.kind === "deterministic" || node.kind === "output";
      assert.equal(Boolean(node.app), drawsApp, `${node.id}: app on ${node.kind}`);
      assert.equal(Boolean(node.gate), node.kind === "human", `${node.id}: gate only on approvals`);
      if (node.gate) assert.ok(node.gate.approver.trim(), `${node.id}: approver role`);
      if (node.stopLabel !== undefined) {
        assert.ok(node.kind === "deterministic" || node.kind === "ai", `${node.id}: stopLabel on ${node.kind}`);
      }
    }
  });

  test(`${workflow.id}: attachments follow the port rules`, () => {
    const ids = new Set<string>();
    for (const node of workflow.nodes) {
      ids.add(node.id);
      const attached = node.attached ?? [];
      assert.ok(attached.length <= 5, `${node.id}: ${attached.length} attachments`);
      if (node.kind === "ai") {
        const models = attached.filter((item) => item.port === "model");
        assert.equal(models.length, 1, `${node.id}: one model`);
        assert.equal(models[0].app, "claude", `${node.id}: model app`);
        assert.equal(models[0].label, "Claude", `${node.id}: model label`);
        assert.equal(models[0].operation, "Messages", `${node.id}: model operation`);
      }
      for (const item of attached) {
        const where = `${node.id}/${item.id}`;
        assert.ok(!ids.has(item.id), `${where}: duplicate id`);
        ids.add(item.id);
        if (item.port === "calls") {
          assert.ok(node.kind === "trigger" || node.kind === "deterministic", `${where}: calls on ${node.kind}`);
        } else {
          assert.equal(node.kind, "ai", `${where}: ${item.port} port on ${node.kind}`);
        }
        if (node.kind === "ai") {
          assert.equal(item.readOnly, true, `${where}: the AI step never holds a write`);
          assert.doesNotMatch(`${item.label} ${item.operation}`, /\d+\.\d+/, `${where}: version number`);
        }
        if (item.port === "model") assert.doesNotMatch(`${item.label} ${item.operation}`, /\d/, `${where}: version`);
      }
    }
  });

  test(`${workflow.id}: operations name no real domains`, () => {
    for (const node of workflow.nodes) {
      for (const operation of operations(node)) {
        for (const domain of operation.match(/\b[a-z0-9-]+\.[a-z]{2,}\b/gi) ?? []) {
          assert.ok(domain.endsWith(".example"), `${node.id}: "${domain}"`);
        }
      }
    }
  });

  test(`${workflow.id}: anything sent outside comes after an approval`, () => {
    let approved = false;
    for (const node of workflow.nodes) {
      if (node.kind === "human") approved = true;
      if (node.kind === "output") assert.ok(node.audience, `${node.id}: audience`);
      if (node.audience === "external") assert.ok(approved, `${node.id}: external before any approval`);
    }
  });

  test(`${workflow.id}: no compliance claims and no version numbers in copy`, () => {
    assert.doesNotMatch(copy(workflow), /\bcomplian(t|ce)\b|\bbias[- ]audit/i);
    assert.doesNotMatch(copy(workflow), /\b(sonnet|haiku|opus|gpt-?\d)/i);
  });
}

function find(id: string): Workflow {
  const workflow = WORKFLOWS.find((item) => item.id === id);
  assert.ok(workflow, id);
  return workflow;
}

function node(workflow: Workflow, id: string): WorkflowNode {
  const found = workflow.nodes.find((item) => item.id === id);
  assert.ok(found, `${workflow.id}/${id}`);
  return found;
}

test("lead triage: the AI step writes the draft and the CRM step only saves it", () => {
  const workflow = find("lead-triage");
  assert.match(node(workflow, "scoring").payload, /"draft":/);
  assert.match(node(workflow, "crm-sync").does, /saves/);
  assert.doesNotMatch(node(workflow, "crm-sync").does, /draft(s|ed)? a/i);
});

test("proposal ops: the first invoice is an internal draft", () => {
  const invoice = node(find("proposal-ops"), "invoice-created");
  assert.equal(invoice.audience, "internal");
  assert.match(invoice.payload, /"status": "draft"/);
  assert.doesNotMatch(invoice.payload, /"sent":/);
  assert.equal(node(find("proposal-ops"), "margin-check").stopLabel, "Below your margin floor: nothing sent");
});

test("client onboarding: the welcome send and the kickoff booking are separate results", () => {
  const workflow = find("client-onboarding");
  const ids = workflow.nodes.map((item) => item.id);
  assert.deepEqual(ids.slice(-3), ["lead-approves", "welcome-sent", "kickoff"]);
  assert.ok(node(workflow, "intake").stopLabel);
});

test("daily brief and Meta Ads: an unsure AI step posts nothing", () => {
  for (const [id, step] of [["daily-brief", "cited-summary"], ["meta-ads-reporting", "weekly-brief"]] as const) {
    const ai = node(find(id), step);
    assert.match(ai.confidence?.belowThreshold ?? "", /Nothing is posted\./, id);
    assert.match(ai.failure, /nothing is posted/, id);
    assert.doesNotMatch(`${ai.confidence?.belowThreshold} ${ai.failure}`, /instead|without it|only the/i, id);
  }
  assert.ok(find("daily-brief").nodes.every((item) => item.kind !== "human"), "internal only, no approval");
});

test("ap intake: the reading step has no tools and two people approve", () => {
  const workflow = find("ap-intake");
  assert.deepEqual(node(workflow, "extraction").attached?.map((item) => item.port), ["model"]);
  assert.deepEqual(
    workflow.nodes.filter((item) => item.gate).map((item) => item.gate?.channelApp),
    ["slack", "billcom"],
  );
});

test("support routing: a support rep approves, never an agent", () => {
  const workflow = find("support-routing");
  assert.doesNotMatch(copy(workflow), /\bagents?\b/i);
  assert.equal(node(workflow, "agent-approves").gate?.approver, "Support rep");
});

test("meta ads: daily flags and a Monday brief", () => {
  const workflow = find("meta-ads-reporting");
  assert.match(workflow.outcome, /Daily flags and a Monday brief/);
  assert.ok(node(workflow, "weekly-brief").attached?.some((item) => item.port === "memory"));
});

test("applicant screening: masking runs before the AI, which quotes and never scores", () => {
  const workflow = find("recruiting-screen");
  const ids = workflow.nodes.map((item) => item.id);
  assert.ok(ids.indexOf("redaction") < ids.indexOf("rubric-extraction"), "masking comes first");
  assert.equal(node(workflow, "redaction").kind, "deterministic");
  assert.match(node(workflow, "application").guardrail, /person-only review/);
  assert.match(node(workflow, "rubric-extraction").guardrail, /no score, rank or pass or fail/);
  assert.match(workflow.ownership, /Your counsel decides whether notice or an audit applies\.$/);
  assert.doesNotMatch(copy(workflow), /shortlist|rubric|protected attributes/i);
});
