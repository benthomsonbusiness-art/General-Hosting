import type { Workflow } from "../content/workflows.ts";

/**
 * Pure run state for the workflow visualizer. There is no timer in here: the only way past a
 * human gate is an explicit APPROVE, and EXPIRE always ends the run.
 */

export type RunStatus =
  | "ready"
  | "running"
  | "awaiting"
  | "completed"
  | "rejected"
  | "expired"
  | "manual";

export type NodeState = "idle" | "active" | "awaiting" | "complete" | "skipped" | "low-confidence";

export type RunState = {
  /** Increments on every start and reset, so a stale timer can be recognized and ignored. */
  token: number;
  status: RunStatus;
  /** Index of the current node, or -1 before the first step. */
  index: number;
  /** True while the marker is on the edge leading to `index + 1`. */
  traveling: boolean;
  mode: "auto" | "step";
  nodes: Record<string, NodeState>;
  /** AI node ids with the low-confidence simulation switched on. */
  lowConfidence: string[];
  message: string;
};

export type RunAction =
  | { type: "START"; mode: "auto" | "step" }
  /** Step mode: one node per click. */
  | { type: "STEP" }
  /** Auto mode: the current node finished its work. */
  | { type: "FINISH_NODE"; token: number }
  /** Auto mode: the marker reached the next node. */
  | { type: "ARRIVE"; token: number }
  | { type: "APPROVE" }
  | { type: "REJECT" }
  | { type: "EXPIRE" }
  | { type: "RESET" }
  | { type: "TOGGLE_LOW_CONFIDENCE"; nodeId: string };

export function initialRun(): RunState {
  return {
    token: 0,
    status: "ready",
    index: -1,
    traveling: false,
    mode: "auto",
    nodes: {},
    lowConfidence: [],
    message: "",
  };
}

function skipAfter(workflow: Workflow, state: RunState): Record<string, NodeState> {
  const nodes = { ...state.nodes };
  workflow.nodes.forEach((node, index) => {
    if (index > state.index) nodes[node.id] = "skipped";
  });
  return nodes;
}

function enter(workflow: Workflow, state: RunState, index: number): RunState {
  const node = workflow.nodes[index];
  const total = workflow.nodes.length;
  const gate = node.kind === "human";
  return {
    ...state,
    index,
    traveling: false,
    status: gate ? "awaiting" : "running",
    nodes: { ...state.nodes, [node.id]: gate ? "awaiting" : "active" },
    message: gate
      ? `Step ${index + 1} of ${total}: ${node.label}. Waiting for approval.`
      : `Step ${index + 1} of ${total} running: ${node.label}.`,
  };
}

/** Completes the current node. Ends the run on low confidence or after the last node. */
function finish(workflow: Workflow, state: RunState): RunState {
  const node = workflow.nodes[state.index];
  if (node.kind === "ai" && state.lowConfidence.includes(node.id)) {
    return {
      ...state,
      status: "manual",
      traveling: false,
      nodes: { ...skipAfter(workflow, state), [node.id]: "low-confidence" },
      message: `${node.label}: confidence below the threshold. ${node.confidence?.belowThreshold ?? ""} Nothing was sent.`,
    };
  }
  const nodes = { ...state.nodes, [node.id]: "complete" as const };
  if (state.index === workflow.nodes.length - 1) {
    return {
      ...state,
      status: "completed",
      traveling: false,
      nodes,
      message: `Step ${state.index + 1} complete. ${node.label} (sample). Run finished.`,
    };
  }
  return { ...state, nodes };
}

export function runReducer(workflow: Workflow) {
  return (state: RunState, action: RunAction): RunState => {
    switch (action.type) {
      case "START": {
        if (state.status === "running" || state.status === "awaiting") return state;
        const fresh: RunState = {
          ...initialRun(),
          token: state.token + 1,
          mode: action.mode,
          lowConfidence: state.lowConfidence,
        };
        return enter(workflow, fresh, 0);
      }
      case "STEP": {
        if (state.status === "awaiting" || state.traveling) return state;
        if (state.status !== "running") {
          return runReducer(workflow)(state, { type: "START", mode: "step" });
        }
        const done = finish(workflow, { ...state, mode: "step" });
        return done.status === "running" ? enter(workflow, done, done.index + 1) : done;
      }
      case "FINISH_NODE": {
        if (action.token !== state.token || state.status !== "running" || state.traveling) return state;
        if (state.mode !== "auto") return state;
        const done = finish(workflow, state);
        return done.status === "running" ? { ...done, traveling: true } : done;
      }
      case "ARRIVE": {
        if (action.token !== state.token || !state.traveling) return state;
        return enter(workflow, state, state.index + 1);
      }
      case "APPROVE": {
        if (state.status !== "awaiting") return state;
        const approved = finish(workflow, { ...state, status: "running" });
        if (approved.status !== "running") return approved;
        const message = `${workflow.nodes[state.index].gate?.approveLabel ? "Decision recorded" : "Approved"}.`;
        if (state.mode === "auto") return { ...approved, traveling: true, message };
        const next = enter(workflow, approved, approved.index + 1);
        return { ...next, message: `${message} ${next.message}` };
      }
      case "REJECT": {
        if (state.status !== "awaiting") return state;
        const gate = workflow.nodes[state.index].gate;
        return {
          ...state,
          status: "rejected",
          nodes: { ...skipAfter(workflow, state), [workflow.nodes[state.index].id]: "complete" },
          message: `Rejected — ${gate?.rejectOutcome ?? "nothing was sent"}.`,
        };
      }
      case "EXPIRE": {
        if (state.status !== "awaiting") return state;
        return {
          ...state,
          status: "expired",
          nodes: { ...skipAfter(workflow, state), [workflow.nodes[state.index].id]: "skipped" },
          message: "Expired — returned to queue. Nothing was sent.",
        };
      }
      case "RESET":
        return { ...initialRun(), token: state.token + 1, message: "Run reset." };
      case "TOGGLE_LOW_CONFIDENCE": {
        const on = state.lowConfidence.includes(action.nodeId);
        return {
          ...state,
          lowConfidence: on
            ? state.lowConfidence.filter((id) => id !== action.nodeId)
            : [...state.lowConfidence, action.nodeId],
        };
      }
    }
  };
}

/** Output payloads read "sent": false until the run completes that node. */
export function livePayload(payload: string, state: NodeState | undefined): string {
  return state === "complete" ? payload.replace('"sent": false', '"sent": true') : payload;
}
