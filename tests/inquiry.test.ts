import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { handleInquiry } from "../lib/inquiry.ts";
import { practiceFromQuery, validateInquiry } from "../lib/inquiry-shared.ts";

const env = process.env as Record<string, string | undefined>;
const saved = { ...env };
let ip = 0;

const valid = {
  fullName: "A. Rivera",
  email: "rivera@harborline.example.com",
  companyRole: "Harborline, owner",
  practice: "AI Workflow Automation",
  note: "Quoting runs through one inbox.",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return handleInquiry(
    new Request("https://valentiniandco.com/api/inquiry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": `192.0.2.${ip}`,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

before(() => {
  env.NODE_ENV = "production";
  delete env.WEBHOOK_URL;
  delete env.RESEND_API_KEY;
  delete env.ALLOWED_ORIGINS;
});
beforeEach(() => {
  ip += 1;
});
after(() => {
  Object.assign(env, saved);
});

test("wrong content type is 415", async () => {
  assert.equal((await post("hi", { "content-type": "text/plain" })).status, 415);
});

test("unknown origin is 403", async () => {
  assert.equal((await post(valid, { origin: "https://evil.example" })).status, 403);
  assert.equal((await post(valid, { origin: "https://other.workers.dev" })).status, 403);
});

test("loopback origins are rejected in production, even on a loopback host", async () => {
  const headers = { origin: "http://localhost:3000", host: "localhost:3000" };
  assert.equal((await post(valid, headers)).status, 403);
});

test("X-Forwarded-Host cannot widen the origin check in production", async () => {
  const headers = { origin: "https://evil.example", "x-forwarded-host": "evil.example" };
  assert.equal((await post(valid, headers)).status, 403);
});

test("site, www and preview origins pass", async () => {
  for (const host of [
    "valentiniandco.com",
    "www.valentiniandco.com",
    "valentini-next.benthomsonbusiness.workers.dev",
  ]) {
    assert.equal((await post(valid, { origin: `https://${host}` })).status, 503);
  }
});

test("bad JSON is 400", async () => {
  assert.equal((await post("{")).status, 400);
  assert.equal((await post([])).status, 400);
});

test("invalid fields are 422 with fieldErrors", async () => {
  const response = await post({ ...valid, email: "nope", note: "x" });
  assert.equal(response.status, 422);
  const body = (await response.json()) as { fieldErrors: Record<string, string> };
  assert.deepEqual(Object.keys(body.fieldErrors).sort(), ["email", "note"]);
});

test("honeypot is a silent 200", async () => {
  const response = await post({ ...valid, fax_number: "1" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, delivered: false });
});

test("production without a channel is 503", async () => {
  const response = await post(valid);
  assert.equal(response.status, 503);
  assert.match(((await response.json()) as { error: string }).error, /offline/);
});

test("sixth request in the window is 429", async () => {
  for (let i = 0; i < 5; i += 1) assert.equal((await post(valid)).status, 503);
  assert.equal((await post(valid)).status, 429);
});

test("delivery: 200 on success, 502 when every channel fails", async () => {
  const original = globalThis.fetch;
  env.WEBHOOK_URL = "https://hook.example/in";
  try {
    globalThis.fetch = async () => new Response("ok");
    const ok = await post(valid);
    assert.deepEqual(await ok.json(), { ok: true, delivered: true });
    globalThis.fetch = async () => new Response("no", { status: 500 });
    assert.equal((await post(valid)).status, 502);
  } finally {
    globalThis.fetch = original;
    delete env.WEBHOOK_URL;
  }
});

test("header injection is collapsed to one line", () => {
  const parsed = validateInquiry({ ...valid, fullName: "A\r\nBcc: x@y.example" });
  assert.ok(parsed.ok);
  assert.equal(parsed.value.fullName, "A Bcc: x@y.example");
});

test("practice query still maps", () => {
  assert.equal(practiceFromQuery("meta-ads"), "Meta Ads Consulting");
  assert.equal(practiceFromQuery("strategy"), "Strategy");
  assert.equal(practiceFromQuery(null), "AI Workflow Automation");
});
