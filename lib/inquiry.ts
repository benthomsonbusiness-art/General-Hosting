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

function tooMany(): Response {
  return Response.json(
    { ok: false, error: "Too many inquiries from this network. Try again shortly." },
    { status: 429 },
  );
}

export async function handleInquiry(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json(
      { ok: false, error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  if (!originAllowed(request.headers.get("origin"), request)) {
    return Response.json(
      { ok: false, error: "This origin is not allowed to submit inquiries." },
      { status: 403 },
    );
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) return tooMany();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const honeypot = payload[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] honeypot tripped");
    }
    return Response.json({ ok: true, delivered: false });
  }

  const parsed = validateInquiry(payload);
  if (!parsed.ok) {
    return Response.json(
      {
        ok: false,
        error: "Please correct the highlighted fields.",
        fieldErrors: parsed.fieldErrors,
      },
      { status: 422 },
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[inquiry]", parsed.value);
  }

  if (await tooManyStored(ip, RATE_LIMIT, WINDOW_MS)) return tooMany();

  // Stored before delivery, so a failed email or webhook does not lose the lead.
  const storedId = await storeInquiry(parsed.value, ip);

  const jobs: Array<Promise<void>> = [];
  if (process.env.WEBHOOK_URL) jobs.push(postWebhook(parsed.value));
  if (process.env.RESEND_API_KEY) jobs.push(sendWithResend(parsed.value));

  if (jobs.length === 0) {
    await markInquiry(storedId, "no_channel");
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] accepted with no delivery channel configured");
      return Response.json({ ok: true, delivered: false });
    }
    // A stored row is not a reply. Without a channel nobody is notified, so say so.
    console.error("[inquiry] no delivery channel configured");
    return Response.json({ ok: false, error: INQUIRY_OFFLINE_ERROR }, { status: 503 });
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
    return Response.json(
      { ok: false, error: "We could not send your inquiry. Please try again shortly." },
      { status: 502 },
    );
  }

  await markInquiry(storedId, "delivered", detail);
  return Response.json({ ok: true, delivered: true });
}
