import {
  HONEYPOT_FIELD,
  INQUIRY_OFFLINE_ERROR,
  TURNSTILE_FIELD,
  isRecord,
  validateInquiry,
  type Inquiry,
} from "./inquiry-shared.ts";
import { markInquiry, storeInquiry, tooManyStored } from "./inquiry-store.ts";
import { PREVIEW_HOSTS, SITE_HOSTS } from "./site.ts";

const WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const RETRY_AFTER_SECONDS = "600";
const MAX_BUCKETS = 5_000;
const PRUNE_INTERVAL_MS = 60_000;
export const MAX_BODY_BYTES = 16_384;

// In-memory per-isolate sliding window, capped at MAX_BUCKETS to prevent memory exhaustion.
// With D1 bound, tooManyStored adds a durable cross-isolate check.
const hits = new Map<string, number[]>();
let lastPrune = 0;

const BASE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function clientIp(request: Request): string {
  const connecting = request.headers.get("cf-connecting-ip")?.trim();
  if (connecting) return connecting.slice(0, 64);
  if (process.env.NODE_ENV !== "production") {
    const forwarded = request.headers.get("x-forwarded-for");
    const first = forwarded?.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return "unknown";
}

function pruneBuckets(now: number) {
  if (now - lastPrune < PRUNE_INTERVAL_MS && hits.size < MAX_BUCKETS) return;
  lastPrune = now;
  for (const [key, stamps] of hits) {
    const recent = stamps.filter((stamp) => now - stamp < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneBuckets(now);
  const existing = hits.get(ip) ?? [];
  const recent = existing.filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  if (!hits.has(ip) && hits.size >= MAX_BUCKETS) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey !== undefined) hits.delete(oldestKey);
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/** Resets the in-memory rate-limit table (used in isolated unit tests). */
export function resetInquiryRateLimiter() {
  hits.clear();
  lastPrune = 0;
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

function isAllowedHost(host: string, request: Request): boolean {
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

function requestSourceAllowed(request: Request): boolean {
  // Browser Fetch Metadata: block cross-site form/fetch requests even when Origin is stripped.
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return isAllowedHost(url.hostname.toLowerCase(), request);
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      return isAllowedHost(url.hostname.toLowerCase(), request);
    } catch {
      return false;
    }
  }

  return true;
}

function redactSecrets(text: string): string {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/\bre_[A-Za-z0-9_]{8,}/g, "re_[REDACTED]")
    .replace(/(https?:\/\/[^\s?#]+)\?[^\s#]*/gi, "$1?[REDACTED]");
}

function safeWebhookUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("WEBHOOK_URL is not a valid URL");
  }
  const host = parsed.hostname.toLowerCase();
  const isLoopback = host === "127.0.0.1" || host === "localhost" || host === "[::1]";
  if (parsed.protocol !== "https:") {
    const allowLocalHttp =
      isLoopback && (process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_WEBHOOK === "1");
    if (!allowLocalHttp) {
      throw new Error("WEBHOOK_URL must use https");
    }
  }
  if (isLoopback && process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_WEBHOOK !== "1") {
    throw new Error("WEBHOOK_URL cannot target loopback in production");
  }
  return parsed;
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
  const raw = process.env.WEBHOOK_URL;
  if (!raw) return;
  const target = safeWebhookUrl(raw);

  const response = await fetch(target.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "error",
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
    redirect: "error",
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
    const detail = redactSecrets(await response.text());
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 240)}`);
  }
}

async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || token.trim().length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const body = new URLSearchParams({ secret, response: token.trim() });
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "error",
      signal: AbortSignal.timeout(5000),
      body: body.toString(),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { success?: unknown };
    return data.success === true;
  } catch {
    return false;
  }
}

type Outcome = {
  status: number;
  headers?: Record<string, string>;
  body: { ok: boolean; [key: string]: unknown };
};

const TOO_MANY: Outcome = {
  status: 429,
  headers: { "Retry-After": RETRY_AFTER_SECONDS },
  body: { ok: false, error: "Too many inquiries from this network. Try again shortly." },
};

const PAYLOAD_TOO_LARGE: Outcome = {
  status: 413,
  body: { ok: false, error: "Request body is too large." },
};

const JSON_TYPE = "application/json";
const FORM_TYPE = "application/x-www-form-urlencoded";

/** Where a form post without JavaScript lands. The contact page reads ?sent= and says what happened. */
export const SENT_PATH = "/contact?sent=1";
export const NOT_SENT_PATH = "/contact?sent=0";

export function methodNotAllowed(): Response {
  return Response.json(
    { ok: false, error: "Method not allowed." },
    {
      status: 405,
      headers: {
        ...BASE_HEADERS,
        Allow: "POST",
      },
    },
  );
}

/**
 * Accepts JSON from the form's script, and a plain form post when JavaScript is off. Both go
 * through the same origin check, rate limit, body-size cap, honeypot, optional Turnstile check
 * and Zod validation. A form post is answered with a 303 redirect to the contact page, so
 * personal details never end up in a URL.
 */
export async function handleInquiry(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  const form = contentType.startsWith(FORM_TYPE);
  if (!form && !contentType.startsWith(JSON_TYPE)) {
    return Response.json(
      { ok: false, error: "Content-Type must be application/json." },
      { status: 415, headers: BASE_HEADERS },
    );
  }

  const outcome = await processInquiry(request, form);
  const responseHeaders = { ...BASE_HEADERS, ...outcome.headers };
  if (form) {
    return new Response(null, {
      status: 303,
      headers: {
        ...responseHeaders,
        Location: outcome.body.ok ? SENT_PATH : NOT_SENT_PATH,
      },
    });
  }
  return Response.json(outcome.body, { status: outcome.status, headers: responseHeaders });
}

class PayloadTooLargeError extends Error {}

async function readBoundedText(request: Request, maxBytes: number): Promise<string> {
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    const length = Number.parseInt(declared, 10);
    if (Number.isFinite(length) && length > maxBytes) {
      throw new PayloadTooLargeError();
    }
  }

  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel().catch(() => undefined);
          throw new PayloadTooLargeError();
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

async function readPayload(request: Request, form: boolean): Promise<unknown> {
  const raw = await readBoundedText(request, MAX_BODY_BYTES);
  if (form) return Object.fromEntries(new URLSearchParams(raw));
  return JSON.parse(raw);
}

async function processInquiry(request: Request, form: boolean): Promise<Outcome> {
  if (!requestSourceAllowed(request)) {
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
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return PAYLOAD_TOO_LARGE;
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

  if (!(await verifyTurnstile(payload[TURNSTILE_FIELD], ip))) {
    return {
      status: 403,
      body: { ok: false, error: "Verification failed. Please reload the page and try again." },
    };
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[inquiry] validated", { practice: parsed.value.practice });
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
      const rawReason = result.reason instanceof Error ? result.reason.message : "Delivery failed";
      const safeReason = redactSecrets(rawReason);
      failures.push(safeReason);
      console.error("[inquiry] delivery failed", safeReason);
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
