export type WorkflowNode = {
  id: string;
  name: string;
  timing: string;
  simMs: number;
  gate?: boolean;
  mode: string;
  execution: string;
  stack: string[];
  guardrail: string;
  payload: string;
};

export type Workflow = {
  id: string;
  label: string;
  summary: string;
  nodes: WorkflowNode[];
};

export const WORKFLOWS: Workflow[] = [
  {
    id: "lead-triage",
    label: "Inbound Lead Triage & Qualification",
    summary:
      "A signed lead lands, gets enriched, and is scored into a schema. The CRM updates. A person approves before any reply leaves the building.",
    nodes: [
      {
        id: "webhook",
        name: "Webhook Capture",
        timing: "180ms",
        simMs: 620,
        mode: "Deterministic",
        execution:
          "A signed HTTP endpoint receives the lead and writes an immutable row before any later step runs. There is no model in this step.",
        stack: ["REST webhook", "HMAC signature check", "Postgres audit log"],
        guardrail:
          "Unsigned or malformed payloads return 400 and are stored as rejected. They are never retried into the CRM.",
        payload: `{
  "event": "lead.received",
  "source": "webform",
  "received_at": "2026-04-14T15:04:11Z",
  "signature": "valid",
  "lead": {
    "name": "A. Okonkwo",
    "email": "a.okonkwo@northline.example",
    "company": "Northline Logistics",
    "message": "Need the quoting desk off email."
  }
}`,
      },
      {
        id: "enrich",
        name: "Company & Domain Enrichment",
        timing: "640ms",
        simMs: 700,
        mode: "Deterministic",
        execution:
          "The domain is resolved, checked against the existing account table, and filled with firmographic fields. Missing data is marked partial. Nothing is guessed by a model.",
        stack: ["DNS and MX lookup", "Internal account match", "Company data API", "Postgres"],
        guardrail:
          "An unknown domain continues with enrichment_status partial. A lookup timeout does not block the queue and does not create a record.",
        payload: `{
  "domain": "northline.example",
  "mx_valid": true,
  "existing_account": false,
  "company": "Northline Logistics",
  "employee_band": "120-200",
  "enrichment_status": "complete"
}`,
      },
      {
        id: "score",
        name: "LLM Intent + Fit Scoring (JSON Schema)",
        timing: "1.2s",
        simMs: 880,
        mode: "Model, schema-bound",
        execution:
          "The model returns intent and fit as an object that must match the JSON schema. Temperature is fixed. Output that fails the schema is discarded.",
        stack: ["Structured output schema", "Low-temperature model call", "Schema validator", "Postgres"],
        guardrail:
          "Confidence below 0.85 routes to a manual queue. A schema failure retries once, then dead-letters. This step sends nothing externally.",
        payload: `{
  "intent": "workflow_implementation",
  "fit_score": 0.91,
  "confidence": 0.88,
  "segment": "operations",
  "needs_human": false,
  "rationale": "Asks for a quoting workflow and names the system of record."
}`,
      },
      {
        id: "crm",
        name: "CRM Sync (HubSpot/Salesforce)",
        timing: "420ms",
        simMs: 640,
        mode: "Deterministic",
        execution:
          "An idempotent upsert writes the contact, the company, and the score onto the CRM record. The model does not call the CRM.",
        stack: ["HubSpot API", "Salesforce REST", "Idempotency key", "Postgres audit log"],
        guardrail:
          "A duplicate email updates the open record. HTTP 429 backs off. A 5xx leaves the local row unsent and alerts the operator.",
        payload: `{
  "crm": "hubspot",
  "action": "upsert",
  "idempotency_key": "lead_1842",
  "contact_id": "51c0e2",
  "deal_stage": "new",
  "fit_score": 0.91
}`,
      },
      {
        id: "approval",
        name: "Human Approval Gate (Slack)",
        timing: "Human",
        simMs: 700,
        gate: true,
        mode: "Human gate",
        execution:
          "A person in a named Slack channel approves or rejects the draft before any message leaves. The model does not sit in this step.",
        stack: ["Slack interactive message", "Approval timeout", "Postgres audit log"],
        guardrail:
          "Zero unapproved external sends. If the gate expires, the lead returns to the queue as unapproved.",
        payload: `{
  "channel": "#lead-review",
  "approver_role": "ops.oncall",
  "draft_id": "dr_1842",
  "status": "pending",
  "expires_in": "4h"
}`,
      },
      {
        id: "response",
        name: "Approved First Response",
        timing: "860ms",
        simMs: 720,
        mode: "Draft by model, send by code",
        execution:
          "The draft was produced against the schema during scoring. This step sends it only when the approval record is present and the recipient domain matches the lead.",
        stack: ["Transactional email API", "Approval lookup", "Template renderer", "Postgres audit log"],
        guardrail:
          "The send refuses to run without approval.status approved and a recipient that matches the captured email. A mismatch dead-letters the draft.",
        payload: `{
  "to": "a.okonkwo@northline.example",
  "template": "first-response",
  "approval_id": "ap_992",
  "sent": true,
  "message_id": "msg_4401"
}`,
      },
    ],
  },
  {
    id: "proposals",
    label: "Scoping, Proposals & Contract Ops",
    summary:
      "A discovery transcript becomes structured requirements. Pricing is calculated in code. A partner approves the hash before anything is sent for signature.",
    nodes: [
      {
        id: "transcript",
        name: "Discovery Transcript",
        timing: "240ms",
        simMs: 560,
        mode: "Deterministic",
        execution:
          "The transcript file is stored with a checksum. Speaker labels are kept. No summary is generated in this step.",
        stack: ["Object storage", "Checksum", "Postgres audit log"],
        guardrail:
          "A failed upload does not start extraction. The raw file stays the source of record.",
        payload: `{
  "transcript_id": "tr_220",
  "duration_min": 46,
  "checksum": "sha256:9f3a…c1",
  "stored": true
}`,
      },
      {
        id: "extract",
        name: "Structured Requirements Extraction",
        timing: "2.1s",
        simMs: 920,
        mode: "Model, schema-bound",
        execution:
          "The model extracts requirements, constraints, and open questions into a schema, using only statements present in the transcript.",
        stack: ["Structured output schema", "Transcript windowing", "Schema validator"],
        guardrail:
          "If timeline, decision maker, or success measure is absent, the field is null and flagged. The model cannot invent a number the transcript does not contain.",
        payload: `{
  "decision_maker": "COO",
  "success_measure": "Quote cycle under one business day",
  "in_scope": ["intake form", "margin check", "draft quote"],
  "out_of_scope": ["ERP replacement"],
  "open_questions": ["Who signs exceptions under 20 percent margin?"],
  "invented_fields": 0
}`,
      },
      {
        id: "margin",
        name: "Pricing & Margin Check",
        timing: "310ms",
        simMs: 580,
        mode: "Deterministic",
        execution:
          "Hours and rates from the rate card are calculated in code. Margin is compared with the floor the partners set. The model does not price.",
        stack: ["Rate card", "Margin floor", "Postgres"],
        guardrail:
          "Margin under the floor blocks proposal assembly and notifies the partner. A missing rate fails closed.",
        payload: `{
  "hours": 80,
  "blended_rate": 185,
  "cost": 9600,
  "price": 14800,
  "margin": 0.35,
  "floor": 0.3,
  "status": "pass"
}`,
      },
      {
        id: "draft",
        name: "Draft Proposal Assembly",
        timing: "1.4s",
        simMs: 860,
        mode: "Narrative by model, figures by code",
        execution:
          "Narrative sections are drafted from the structured requirements. The pricing table is inserted by code from the margin check, then compared before the file is saved.",
        stack: ["Structured requirements", "Document template", "Figure lock", "Schema validator"],
        guardrail:
          "Any number in the draft that does not match the pricing object fails the build. The file does not reach partner review until the lock passes.",
        payload: `{
  "document_id": "pr_220",
  "sections": ["context", "scope", "timeline", "price", "assumptions"],
  "figure_lock": "pass",
  "price_cited": 14800
}`,
      },
      {
        id: "partner",
        name: "Partner Review Gate",
        timing: "Human",
        simMs: 700,
        gate: true,
        mode: "Human gate",
        execution:
          "A partner reviews the draft and approves the version hash. Comments return the document to assembly. No envelope is created here.",
        stack: ["Slack interactive approval", "Version hash", "Postgres audit log"],
        guardrail:
          "An e-sign packet cannot be created without partner approval on the current hash. A stale hash is rejected.",
        payload: `{
  "document_id": "pr_220",
  "version_hash": "b7e1…4a",
  "approver_role": "partner",
  "status": "pending"
}`,
      },
      {
        id: "esign",
        name: "E-Sign & Billing Kickoff",
        timing: "540ms",
        simMs: 680,
        mode: "Deterministic",
        execution:
          "The approved file is sent for signature. Billing starts only after the signed webhook arrives, matched to the same version hash.",
        stack: ["E-sign API", "Signed webhook", "Billing customer create", "Postgres audit log"],
        guardrail:
          "An unsigned envelope expires without an invoice. A signature on a different hash does not start billing.",
        payload: `{
  "envelope_id": "env_778",
  "version_hash": "b7e1…4a",
  "status": "sent",
  "billing": "held_for_signature"
}`,
      },
    ],
  },
  {
    id: "margin-brief",
    label: "Executive Operations & Margin Brief",
    summary:
      "A 6:30 a.m. run pulls Stripe, accounting, and the CRM. Variances are rule hits. The brief can cite every number, or it does not go to leadership.",
    nodes: [
      {
        id: "schedule",
        name: "Scheduled 6:30 AM Sync",
        timing: "40ms",
        simMs: 480,
        mode: "Deterministic",
        execution:
          "A scheduler opens the run at 06:30 local, writes a run id, and refuses to start a second run while the prior one is open.",
        stack: ["Scheduler", "Run lock", "Postgres audit log"],
        guardrail:
          "Overlapping runs are skipped and logged. A missed day is recorded as missed. It is not backfilled with guessed figures.",
        payload: `{
  "run_id": "br_2026-04-14",
  "scheduled_for": "06:30",
  "lock": "acquired"
}`,
      },
      {
        id: "pull",
        name: "Stripe + Accounting + CRM Pull",
        timing: "1.8s",
        simMs: 900,
        mode: "Deterministic",
        execution:
          "Three source pulls write raw rows. Each row keeps its source id. No figure is rewritten by a model.",
        stack: ["Stripe API", "Accounting export", "CRM report", "Postgres"],
        guardrail:
          "If any source fails, the brief is marked partial and the missing source is named. Missing numbers stay null.",
        payload: `{
  "run_id": "br_2026-04-14",
  "stripe": "ok",
  "accounting": "ok",
  "crm": "ok",
  "rows": 146,
  "partial": false
}`,
      },
      {
        id: "variance",
        name: "Variance & Exception Detection",
        timing: "220ms",
        simMs: 560,
        mode: "Deterministic",
        execution:
          "Variances are calculated against the trailing baseline and the thresholds operators set. Exceptions are rule hits.",
        stack: ["Baseline table", "Threshold rules", "Postgres"],
        guardrail:
          "A rule with a null input is skipped and listed. The step does not fill a gap with an estimate.",
        payload: `{
  "exceptions": [
    {
      "rule": "gross_margin_drop",
      "value": 0.41,
      "baseline": 0.48,
      "source_row": "acct_8841"
    }
  ],
  "skipped_rules": []
}`,
      },
      {
        id: "synthesis",
        name: "Cited Daily Synthesis",
        timing: "2.4s",
        simMs: 980,
        mode: "Model, citation-locked",
        execution:
          "The model writes the brief from the exception rows and must attach a source row id to every number. The checker removes any sentence whose number has no citation.",
        stack: ["Structured output schema", "Citation checker", "Exception rows"],
        guardrail:
          "Uncited numbers are removed. If that leaves the brief empty, delivery is blocked and the operator is notified.",
        payload: `{
  "headline": "Gross margin is 7 points under the 30-day baseline.",
  "claims": [
    {
      "text": "Gross margin printed at 41 percent against a 48 percent baseline.",
      "source_row": "acct_8841"
    }
  ],
  "stripped_uncited": 0,
  "status": "pass"
}`,
      },
      {
        id: "deliver",
        name: "Leadership Brief Delivery",
        timing: "360ms",
        simMs: 620,
        mode: "Deterministic",
        execution:
          "The checked brief is delivered to the leadership channel by code. A brief that failed the citation check is not delivered.",
        stack: ["Email API", "Citation status check", "Postgres audit log"],
        guardrail:
          "Delivery requires synthesis status pass. A failed check sends a short failure notice to the operator only.",
        payload: `{
  "run_id": "br_2026-04-14",
  "channel": "leadership-brief",
  "citation_status": "pass",
  "delivered": true
}`,
      },
    ],
  },
];
