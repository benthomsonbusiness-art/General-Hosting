import {
  HONEYPOT_FIELD,
  INQUIRY_OFFLINE_ERROR,
  isRecord,
  validateInquiry,
  type Inquiry,
} from "./inquiry-shared.ts";
import { markInquiry, storeInquiry, tooManyStored } from "./inquiry-store.ts";
import { PREVIEW_HOSTS, SITE_HOSTS } from "./site.ts";

const WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
// In-memory only, and keyed per isolate. With D1 bound, tooManyStored adds a durable check.
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const connecting = request.headers.get("cf-connecting-ip")?.trim();
  if (connecting) return connecting;
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  return "unknown";
}

function pruneBuckets(now: number) {
  for (const [key, stamps] of hits) {
    const recent = stamps.filter((stamp) => now - stamp < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneBuckets(now);
  const recent = hits.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function extraHosts(): string[] {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return [];
  const hosts: string[] = [];
  for (const part of raw.split(",")) {
    const token = part.trim();
    if (!token) continue;
    try {
      const host = token.includes("://") ? new URL(token).hostname : token;
      hosts.push(host.toLowerCase());
    } catch {
      continue;
    }
  }
  return hosts;
}

function requestHost(request: Request): string {
  // X-Forwarded-Host is client-controlled, so it is read outside production only.
  const forwarded =
    process.env.NODE_ENV !== "production" ? request.headers.get("x-forwarded-host") : null;
  const source = forwarded ?? request.headers.get("host") ?? "";
  const raw = source.split(",")[0]?.trim().toLowerCase() ?? "";
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]");
    return end === -1 ? raw : raw.slice(0, end + 1);
  }
  return raw.split(":")[0] ?? "";
}

function originAllowed(origin: string | null, request: Request): boolean {
  if (!origin) return true;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  if ((SITE_HOSTS as readonly string[]).includes(host)) return true;
  if ((PREVIEW_HOSTS as readonly string[]).includes(host)) return true;
  if (extraHosts().includes(host)) return true;
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
    // Loopback is a development origin. To test a local production build, set ALLOWED_ORIGINS.
    return process.env.NODE_ENV !== "production";
  }
  const current = requestHost(request);
  return current !== "" && current === host;
}

function inquiryText(inquiry: Inquiry): string {
  return [
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Company / Role: ${inquiry.companyRole}`,
    `Practice: ${inquiry.practice}`,
    "",
    inquiry.note,
  ].join("\n");
}

async function postWebhook(inquiry: Inquiry): Promise<void> {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      source: "valentini-inquiry",
      submittedAt: new Date().toISOString(),
      ...inquiry,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded ${response.status}`);
  }
}

async function sendWithResend(inquiry: Inquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM;
  const to = process.env.INQUIRY_TO ?? process.env.RESEND_TO;
  if (!from || !to) {
    throw new Error("RESEND_FROM and INQUIRY_TO are required when RESEND_API_KEY is set.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: `Inquiry — ${inquiry.practice} — ${inquiry.companyRole}`,
      text: inquiryText(inquiry),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

type Outcome = { status: number; body: { ok: boolean; [key: string]: unknown } };

const TOO_MANY: Outcome = {
  status: 429,
  body: { ok: false, error: "Too many inquiries from this network. Try again shortly." },
};

const JSON_TYPE = "application/json";
const FORM_TYPE = "application/x-www-form-urlencoded";

/** Where a form post without JavaScript lands. The contact page reads ?sent= and says what happened. */
export const SENT_PATH = "/contact?sent=1";
export const NOT_SENT_PATH = "/contact?sent=0";

/**
 * Accepts JSON from the form's script, and a plain form post when JavaScript is off. Both go
 * through the same origin check, rate limit, honeypot and validation. A form post is answered
 * with a 303 redirect to the contact page, so personal details never end up in a URL.
 */
export async function handleInquiry(request: Request): Promise<Response> {
  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  const form = contentType.startsWith(FORM_TYPE);
  if (!form && !contentType.startsWith(JSON_TYPE)) {
    return Response.json(
      { ok: false, error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const outcome = await processInquiry(request, form);
  if (form) {
    return new Response(null, {
      status: 303,
      headers: { Location: outcome.body.ok ? SENT_PATH : NOT_SENT_PATH },
    });
  }
  return Response.json(outcome.body, { status: outcome.status });
}

async function readPayload(request: Request, form: boolean): Promise<unknown> {
  if (form) return Object.fromEntries(new URLSearchParams(await request.text()));
  return request.json();
}

async function processInquiry(request: Request, form: boolean): Promise<Outcome> {
  if (!originAllowed(request.headers.get("origin"), request)) {
    return {
      status: 403,
      body: { ok: false, error: "This form could not be sent from here. Please use the contact page." },
    };
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) return TOO_MANY;

  let payload: unknown;
  try {
    payload = await readPayload(request, form);
  } catch {
    return { status: 400, body: { ok: false, error: "Invalid request." } };
  }

  if (!isRecord(payload)) {
    return { status: 400, body: { ok: false, error: "Invalid request." } };
  }

  const honeypot = payload[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] honeypot tripped");
    }
    return { status: 200, body: { ok: true, delivered: false } };
  }

  const parsed = validateInquiry(payload);
  if (!parsed.ok) {
    return {
      status: 422,
      body: {
        ok: false,
        error: "Please correct the highlighted fields.",
        fieldErrors: parsed.fieldErrors,
      },
    };
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[inquiry]", parsed.value);
  }

  if (await tooManyStored(ip, RATE_LIMIT, WINDOW_MS)) return TOO_MANY;

  // Stored before delivery, so a failed email or webhook does not lose the lead.
  const storedId = await storeInquiry(parsed.value, ip);

  const jobs: Array<Promise<void>> = [];
  if (process.env.WEBHOOK_URL) jobs.push(postWebhook(parsed.value));
  if (process.env.RESEND_API_KEY) jobs.push(sendWithResend(parsed.value));

  if (jobs.length === 0) {
    await markInquiry(storedId, "no_channel");
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] accepted with no delivery channel configured");
      return { status: 200, body: { ok: true, delivered: false } };
    }
    // A stored row is not a reply. Without a channel nobody is notified, so say so.
    console.error("[inquiry] no delivery channel configured");
    return { status: 503, body: { ok: false, error: INQUIRY_OFFLINE_ERROR } };
  }

  const results = await Promise.allSettled(jobs);
  const failures: string[] = [];
  for (const result of results) {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : "Delivery failed";
      failures.push(reason);
      console.error("[inquiry] delivery failed", reason);
    }
  }
  const detail = failures.length > 0 ? failures.join("; ").slice(0, 500) : null;

  if (failures.length === results.length) {
    await markInquiry(storedId, "failed", detail);
    return {
      status: 502,
      body: { ok: false, error: "We could not send your inquiry. Please try again shortly." },
    };
  }

  await markInquiry(storedId, "delivered", detail);
  return { status: 200, body: { ok: true, delivered: true } };
}
