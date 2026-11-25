import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { markAllowed } from "../lib/logos.ts";
import type { Workflow, WorkflowNode } from "../content/workflows.ts";
import { appsByCategory, showMark, trademarkLines, usedAppSlugs } from "../lib/used-apps.ts";

function node(extra: Partial<WorkflowNode>): WorkflowNode {
  return {
    id: "n",
    label: "Step",
    kind: "deterministic",
    does: "",
    guardrail: "",
    failure: "",
    timingLabel: "",
    payload: "{}",
    ...extra,
  };
}

const sample = {
  id: "sample",
  nodes: [
    node({ kind: "trigger", app: { app: "typeform", operation: "New response", alternatives: [] } }),
    node({
      kind: "ai",
      attached: [
        { id: "m", label: "Read", port: "model", does: "", readOnly: true, app: "claude", operation: "Messages", alternatives: [] },
        { id: "t", label: "Look up", port: "tools", does: "", readOnly: true, app: "hubspot", operation: "Find", alternatives: [] },
      ],
    }),
    node({ kind: "human", gate: { approver: "Sales lead", channel: "Slack", channelApp: "slack", operation: "Approve button" } }),
    node({ kind: "output", app: { app: "gmail", operation: "Send", alternatives: [] } }),
    node({ kind: "deterministic", app: { app: "code", operation: "Match", alternatives: [] } }),
    node({ kind: "output", app: { app: "googlecalendar", operation: "Create event", alternatives: [] } }),
  ],
} as unknown as Workflow;

test("collects node apps, approval channels and attachments, skipping house glyphs", () => {
  assert.deepEqual(usedAppSlugs([sample]).sort(), ["claude", "gmail", "googlecalendar", "hubspot", "slack", "typeform"]);
});

test("no app data means nothing to list", () => {
  const bare = { id: "bare", nodes: [node({})] } as unknown as Workflow;
  assert.deepEqual(usedAppSlugs([bare]), []);
  assert.deepEqual(appsByCategory([]), []);
  assert.deepEqual(trademarkLines([]), []);
});

test("groups by category and writes one trademark line per owner", () => {
  const slugs = usedAppSlugs([sample]);
  const email = appsByCategory(slugs).find((group) => group.category === "email");
  assert.deepEqual(email?.apps.map((app) => app.name), ["Gmail", "Google Calendar"]);
  const lines = trademarkLines(slugs);
  assert.ok(lines.includes("Gmail and Google Calendar are trademarks of Google."));
  assert.ok(lines.includes("Claude is a trademark of Anthropic."));
});

test("a mark is drawn only when LOGO_MODE or its status allows it and the artwork file exists", () => {
  for (const slug of usedAppSlugs([sample])) {
    const file = existsSync(join(process.cwd(), "public", "logos", `${slug}.svg`));
    assert.equal(showMark(slug), markAllowed(slug) && file);
  }
});
