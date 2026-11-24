import assert from "node:assert/strict";
import { test } from "node:test";
import { WORKFLOWS } from "../content/workflows.ts";
import { initialRun, livePayload, runReducer, type RunState } from "../lib/run-machine.ts";

function advance(workflow: (typeof WORKFLOWS)[number], state: RunState): RunState {
  const reduce = runReducer(workflow);
  let current = state;
  for (let guard = 0; guard < 100 && current.status === "running"; guard += 1) {
    current = current.traveling
      ? reduce(current, { type: "ARRIVE", token: current.token })
      : reduce(current, { type: "FINISH_NODE", token: current.token });
  }
  return current;
}

for (const workflow of WORKFLOWS) {
  const reduce = runReducer(workflow);
  const gates = workflow.nodes.filter((node) => node.kind === "human").length;

  test(`${workflow.id}: waits at each gate and completes only after approvals`, () => {
    let state = advance(workflow, reduce(initialRun(), { type: "START", mode: "auto" }));
    for (let gate = 0; gate < gates; gate += 1) {
      assert.equal(state.status, "awaiting");
      // Timers, steps and starts cannot pass a gate.
      for (let i = 0; i < 50; i += 1) {
        state = reduce(state, { type: "FINISH_NODE", token: state.token });
        state = reduce(state, { type: "ARRIVE", token: state.token });
        state = reduce(state, { type: "STEP" });
        state = reduce(state, { type: "START", mode: "auto" });
      }
      assert.equal(state.status, "awaiting");
      state = advance(workflow, reduce(state, { type: "APPROVE" }));
    }
    assert.equal(state.status, "completed");
    for (const node of workflow.nodes) assert.equal(state.nodes[node.id], "complete");
  });

  test(`${workflow.id}: step mode reaches the same end`, () => {
    let state = reduce(initialRun(), { type: "STEP" });
    for (let guard = 0; guard < 40 && state.status !== "completed"; guard += 1) {
      state = reduce(state, state.status === "awaiting" ? { type: "APPROVE" } : { type: "STEP" });
    }
    assert.equal(state.status, "completed");
  });

  if (gates > 0) {
    for (const [type, status] of [["REJECT", "rejected"], ["EXPIRE", "expired"]] as const) {
      test(`${workflow.id}: ${type} stops the run and skips the rest`, () => {
        let state = advance(workflow, reduce(initialRun(), { type: "START", mode: "auto" }));
        const at = state.index;
        state = reduce(state, { type });
        assert.equal(state.status, status);
        for (const node of workflow.nodes.slice(at + 1)) assert.equal(state.nodes[node.id], "skipped");
        assert.equal(reduce(state, { type: "APPROVE" }), state);
      });
    }
  }

  const ai = workflow.nodes.find((node) => node.kind === "ai");
  if (ai) {
    test(`${workflow.id}: low confidence goes to manual review before any send`, () => {
      const toggled = reduce(initialRun(), { type: "TOGGLE_LOW_CONFIDENCE", nodeId: ai.id });
      let state = advance(workflow, reduce(toggled, { type: "START", mode: "auto" }));
      while (state.status === "awaiting") state = advance(workflow, reduce(state, { type: "APPROVE" }));
      assert.equal(state.status, "manual");
      for (const node of workflow.nodes.filter((item) => item.kind === "output")) {
        assert.equal(state.nodes[node.id], "skipped");
      }
    });
  }
}

test("stale timers are ignored after reset", () => {
  const reduce = runReducer(WORKFLOWS[0]);
  const running = reduce(initialRun(), { type: "START", mode: "auto" });
  const reset = reduce(running, { type: "RESET" });
  assert.equal(reduce(reset, { type: "FINISH_NODE", token: running.token }), reset);
  const again = reduce(reset, { type: "START", mode: "auto" });
  assert.equal(reduce(again, { type: "FINISH_NODE", token: running.token }), again);
});

test("output payload flips to sent only when complete", () => {
  const output = WORKFLOWS[0].nodes[WORKFLOWS[0].nodes.length - 1];
  assert.match(livePayload(output.payload, "active"), /"sent": false/);
  assert.match(livePayload(output.payload, "complete"), /"sent": true/);
});
