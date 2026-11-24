import { SITE_DOMAIN, SITE_URL } from "@/lib/site";

export const PRACTICE_INTERESTS = [
  "AI Workflow Consulting",
  "Meta Ads Consulting",
  "Strategy",
] as const;

export type PracticeInterest = (typeof PRACTICE_INTERESTS)[number];

export const HONEYPOT_FIELD = "fax_number";

export const INQUIRY_OFFLINE_ERROR =
  "Inquiries are offline right now. Please email us directly.";

export type Inquiry = {
  fullName: string;
  email: string;
  companyRole: string;
  practice: PracticeInterest;
  note: string;
};

export type InquiryField = keyof Inquiry;

export type FieldErrors = Partial<Record<InquiryField, string>>;

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const hits = new Map<string, number[]>();

export function practiceFromQuery(value: string | null | undefined): PracticeInterest {
  const normalized = (value ?? "").trim().toLowerCase();
  if (
    normalized === "meta-ads" ||
    normalized === "meta ads" ||
    normalized === "meta ads consulting"
  ) {
    return "Meta Ads Consulting";
  }
  if (normalized === "strategy") return "Strategy";
  return "AI Workflow Consulting";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function isPractice(value: string): value is PracticeInterest {
  return (PRACTICE_INTERESTS as readonly string[]).includes(value);
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return true;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
  if (host === SITE_DOMAIN || host.endsWith(".workers.dev")) return true;
  try {
    return url.origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}

export function validateInquiry(
  input: unknown,
): { ok: true; value: Inquiry } | { ok: false; fieldErrors: FieldErrors } {
  if (!isRecord(input)) {
    return {
      ok: false,
      fieldErrors: { fullName: "Enter your name." },
    };
  }

  const fieldErrors: FieldErrors = {};
  const fullName = singleLine(readString(input, "fullName"));
  const email = singleLine(readString(input, "email"));
  const companyRole = singleLine(readString(input, "companyRole"));
  const practiceRaw = readString(input, "practice");
  const practice = isPractice(practiceRaw) ? practiceRaw : null;
  const note = readString(input, "note");

  if (fullName.length < 2 || fullName.length > 100) {
    fieldErrors.fullName = "Enter your name.";
  }
  if (!EMAIL.test(email) || email.length > 254) {
    fieldErrors.email = "Enter a valid work email.";
  }
  if (companyRole.length < 2 || companyRole.length > 140) {
    fieldErrors.companyRole = "Enter your company and role.";
  }
  if (!practice) {
    fieldErrors.practice = "Select a practice.";
  }
  if (note.length < 8 || note.length > 2000) {
    fieldErrors.note = "Describe the problem in a sentence or two.";
  }

  if (!practice || Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: { fullName, email, companyRole, practice, note },
  };
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

export async function handleInquiry(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json(
      { ok: false, error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  if (!originAllowed(request.headers.get("origin"))) {
    return Response.json(
      { ok: false, error: "This origin is not allowed to submit inquiries." },
      { status: 403 },
    );
  }

  if (isRateLimited(clientIp(request))) {
    return Response.json(
      { ok: false, error: "Too many inquiries from this network. Try again shortly." },
      { status: 429 },
    );
  }

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

  const jobs: Array<Promise<void>> = [];
  if (process.env.WEBHOOK_URL) jobs.push(postWebhook(parsed.value));
  if (process.env.RESEND_API_KEY) jobs.push(sendWithResend(parsed.value));

  if (jobs.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] accepted with no delivery channel configured");
      return Response.json({ ok: true, delivered: false });
    }
    console.error("[inquiry] no delivery channel configured");
    return Response.json({ ok: false, error: INQUIRY_OFFLINE_ERROR }, { status: 503 });
  }

  const results = await Promise.allSettled(jobs);
  const rejected = results.filter((result) => result.status === "rejected");
  for (const result of rejected) {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : "Delivery failed";
      console.error("[inquiry] delivery failed", reason);
    }
  }

  if (rejected.length === results.length) {
    return Response.json(
      { ok: false, error: "We could not send your inquiry. Please try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, delivered: true });
}
