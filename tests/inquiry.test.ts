import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, test } from "node:test";
import { MAX_BODY_BYTES, handleInquiry, methodNotAllowed, resetInquiryRateLimiter } from "../lib/inquiry.ts";
import { practiceFromQuery, validateInquiry } from "../lib/inquiry-shared.ts";

const env = process.env as Record<string, string | undefined>;
const saved = { ...env };
let ip = 0;

const valid = {
  fullName: "A. Rivera",
  email: "rivera@harborline.example.com",
  companyRole: "Harborline, owner",
  practice: "Instant Booking",
  note: "Quoting runs through one inbox.",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return handleInquiry(
    new Request("https://temporant.com/api/inquiry", {
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
  delete env.RESEND_FROM;
  delete env.INQUIRY_TO;
  delete env.RESEND_TO;
  delete env.ALLOWED_ORIGINS;
  delete env.TURNSTILE_SECRET_KEY;
  delete env.ALLOW_LOCAL_WEBHOOK;
});
beforeEach(() => {
  ip = (ip % 240) + 1;
  resetInquiryRateLimiter();
});
after(() => {
  Object.assign(env, saved);
});

test("non-POST methods return 405 with Allow: POST on both /api/inquiry and /api/inquire", async () => {
  for (const method of ["GET", "PUT", "DELETE", "PATCH"]) {
    const res = await handleInquiry(new Request("https://temporant.com/api/inquiry", { method }));
    assert.equal(res.status, 405);
    assert.equal(res.headers.get("allow"), "POST");
    assert.equal(res.headers.get("cache-control"), "no-store");
  }
  const direct = methodNotAllowed();
  assert.equal(direct.status, 405);
  assert.equal(direct.headers.get("allow"), "POST");

  for (const routeFile of ["app/api/inquiry/route.ts", "app/api/inquire/route.ts"]) {
    const src = readFileSync(routeFile, "utf8");
    for (const verb of ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
      assert.match(src, new RegExp(`export const ${verb}\\b`));
    }
  }
});

test("wrong content type is 415", async () => {
  const res = await post("hi", { "content-type": "text/plain" });
  assert.equal(res.status, 415);
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
});

test("unknown origin, cross-site Sec-Fetch-Site, and untrusted Referer are 403", async () => {
  assert.equal((await post(valid, { origin: "https://evil.example" })).status, 403);
  assert.equal((await post(valid, { origin: "https://other.workers.dev" })).status, 403);
  assert.equal((await post(valid, { "sec-fetch-site": "cross-site" })).status, 403);
  assert.equal((await post(valid, { referer: "https://evil.example/phish" })).status, 403);
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
    "temporant.com",
    "www.temporant.com",
    "valentini-next.benthomsonbusiness.workers.dev",
  ]) {
    resetInquiryRateLimiter();
    assert.equal((await post(valid, { origin: `https://${host}` })).status, 503);
  }
});

test("bad JSON is 400", async () => {
  assert.equal((await post("{")).status, 400);
  assert.equal((await post([])).status, 400);
});

test("oversized body returns 413 both via Content-Length and streaming chunks", async () => {
  const huge = JSON.stringify({ ...valid, note: "a".repeat(MAX_BODY_BYTES + 1024) });
  const withLength = await post(huge, { "content-length": String(Buffer.byteLength(huge)) });
  assert.equal(withLength.status, 413);

  // Chunked stream without Content-Length header
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('{"note":"'));
      controller.enqueue(encoder.encode("x".repeat(MAX_BODY_BYTES + 512)));
      controller.enqueue(encoder.encode('"}'));
      controller.close();
    },
  });
  const streamed = await handleInquiry(
    new Request("https://temporant.com/api/inquiry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": "192.0.2.99",
      },
      body: stream,
      // @ts-expect-error -- Node fetch duplex option for ReadableStream request bodies
      duplex: "half",
    }),
  );
  assert.equal(streamed.status, 413);
});

test("missing or oversized fields are 422 with Zod fieldErrors", async () => {
  const missing = await post({});
  assert.equal(missing.status, 422);
  const missingBody = (await missing.json()) as { fieldErrors: Record<string, string> };
  assert.deepEqual(Object.keys(missingBody.fieldErrors).sort(), [
    "companyRole",
    "email",
    "fullName",
    "note",
    "practice",
  ]);

  const invalid = await post({ ...valid, email: "nope", note: "x".repeat(2001) });
  assert.equal(invalid.status, 422);
  const invalidBody = (await invalid.json()) as { fieldErrors: Record<string, string> };
  assert.deepEqual(Object.keys(invalidBody.fieldErrors).sort(), ["email", "note"]);
});

test("honeypot is a silent 200 and never triggers outbound delivery", async () => {
  const original = globalThis.fetch;
  let called = false;
  env.WEBHOOK_URL = "https://hook.example/in";
  try {
    globalThis.fetch = async () => {
      called = true;
      return new Response("ok");
    };
    const response = await post({ ...valid, fax_number: "1" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, delivered: false });
    assert.equal(called, false);
  } finally {
    globalThis.fetch = original;
    delete env.WEBHOOK_URL;
  }
});

test("production without a channel is 503", async () => {
  const response = await post(valid);
  assert.equal(response.status, 503);
  assert.match(((await response.json()) as { error: string }).error, /nothing was sent/);
});

function postForm(body: Record<string, string>, headers: Record<string, string> = {}) {
  return handleInquiry(
    new Request("https://temporant.com/api/inquiry", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cf-connecting-ip": `192.0.2.${ip}`,
        ...headers,
      },
      body: new URLSearchParams(body).toString(),
    }),
  );
}

test("form post without a channel redirects to sent=0", async () => {
  const response = await postForm(valid, { origin: "https://temporant.com" });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/contact?sent=0");
});

test("invalid form post redirects to sent=0 and never echoes fields", async () => {
  const response = await postForm({ ...valid, email: "nope" });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/contact?sent=0");
});

test("form post from an unknown origin redirects to sent=0", async () => {
  const response = await postForm(valid, { origin: "https://evil.example" });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/contact?sent=0");
});

test("form post honeypot redirects to sent=1 silently", async () => {
  const response = await postForm({ ...valid, fax_number: "1" });
  assert.equal(response.headers.get("location"), "/contact?sent=1");
});

test("delivered form post redirects to sent=1", async () => {
  const original = globalThis.fetch;
  env.WEBHOOK_URL = "https://hook.example/in";
  try {
    globalThis.fetch = async () => new Response("ok");
    const response = await postForm(valid);
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/contact?sent=1");
  } finally {
    globalThis.fetch = original;
    delete env.WEBHOOK_URL;
  }
});

test("sixth request in the window is 429 with Retry-After and X-Forwarded-For cannot spoof IP in production", async () => {
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await post(valid, { "x-forwarded-for": `203.0.113.${i}` })).status, 503);
  }
  const sixth = await post(valid, { "x-forwarded-for": "203.0.113.250" });
  assert.equal(sixth.status, 429);
  assert.equal(sixth.headers.get("retry-after"), "600");
});

test("delivery: 200 on valid submission, 502 with safe error when upstream fails or uses insecure http", async () => {
  const original = globalThis.fetch;
  env.WEBHOOK_URL = "https://hook.example/in";
  try {
    globalThis.fetch = async () => new Response("ok");
    const ok = await post(valid);
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { ok: true, delivered: true });

    globalThis.fetch = async () => new Response("Bearer secret_token_123", { status: 500 });
    const failed = await post(valid);
    assert.equal(failed.status, 502);
    const failedJson = (await failed.json()) as { error: string };
    assert.doesNotMatch(failedJson.error, /secret_token_123/);

    env.WEBHOOK_URL = "http://hook.example/insecure";
    const insecure = await post(valid);
    assert.equal(insecure.status, 502);
  } finally {
    globalThis.fetch = original;
    delete env.WEBHOOK_URL;
  }
});

test("optional Turnstile verification blocks missing or invalid tokens and accepts verified tokens", async () => {
  const original = globalThis.fetch;
  env.TURNSTILE_SECRET_KEY = "turnstile-test-secret";
  env.WEBHOOK_URL = "https://hook.example/in";
  try {
    const missingToken = await post(valid);
    assert.equal(missingToken.status, 403);

    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.includes("challenges.cloudflare.com")) {
        return Response.json({ success: true });
      }
      return new Response("ok");
    };
    const verified = await post({ ...valid, "cf-turnstile-response": "valid-token" });
    assert.equal(verified.status, 200);
    assert.deepEqual(await verified.json(), { ok: true, delivered: true });
  } finally {
    globalThis.fetch = original;
    delete env.TURNSTILE_SECRET_KEY;
    delete env.WEBHOOK_URL;
  }
});

test("header injection, Unicode line separators, BiDi overrides, and email delimiters are sanitized or rejected", () => {
  const parsed = validateInquiry({
    ...valid,
    fullName: "A\r\nBcc: x@y.example",
    companyRole: "Studio\u2028Owner\u202E",
  });
  assert.ok(parsed.ok);
  assert.equal(parsed.value.fullName, "A Bcc: x@y.example");
  assert.equal(parsed.value.companyRole, "Studio Owner");

  assert.equal(validateInquiry({ ...valid, email: "bad<x@y.example>@z.example" }).ok, false);
  assert.equal(validateInquiry({ ...valid, email: "a@b.example,c@d.example" }).ok, false);
});

test("practice query still maps", () => {
  assert.equal(practiceFromQuery("reminders"), "Appointment Reminders");
  assert.equal(practiceFromQuery("missed-calls"), "Missed Call Text-back");
  assert.equal(practiceFromQuery(null), "Instant Booking");
});
