import assert from "node:assert/strict";
import { test } from "node:test";
import { WINDOWS } from "../content/windows.ts";
import { WORKFLOWS } from "../content/workflows.ts";

test("every workflow has a stage window with one status per step", () => {
  for (const workflow of WORKFLOWS) {
    const look = WINDOWS[workflow.id];
    assert.ok(look, workflow.id);
    assert.equal(look.doing.length, workflow.nodes.length, workflow.id);
    workflow.nodes.forEach((node, index) => {
      assert.equal(look.doing[index] === "", node.kind === "human", `${workflow.id} ${node.id}`);
    });
  }
  assert.equal(Object.keys(WINDOWS).length, WORKFLOWS.length);
});
