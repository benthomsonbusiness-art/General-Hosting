import { validateInquiry, type Inquiry } from "@/lib/inquiry";

const HONEYPOT_FIELD = "fax_number";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inquiryText(inquiry: Inquiry): string {
  return [
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Studio: ${inquiry.studioName}`,
    `City & State: ${inquiry.cityState}`,
    `Website or Instagram: ${inquiry.websiteOrInstagram ?? "—"}`,
    `Primary Focus: ${inquiry.primaryFocus}`,
    "",
    inquiry.note ?? "No note.",
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
      subject: `Inquiry — ${inquiry.studioName}`,
      text: inquiryText(inquiry),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
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
      console.info("[inquire] honeypot tripped");
    }
    return Response.json({ ok: true });
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
    console.info("[inquire]", parsed.value);
  }

  const jobs: Array<Promise<void>> = [];
  if (process.env.WEBHOOK_URL) jobs.push(postWebhook(parsed.value));
  if (process.env.RESEND_API_KEY) jobs.push(sendWithResend(parsed.value));

  if (jobs.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.info("[inquire] accepted with no delivery channel configured");
    } else {
      console.warn("[inquire] accepted with no delivery channel configured");
    }
    return Response.json({ ok: true });
  }

  const results = await Promise.allSettled(jobs);
  const rejected = results.filter((result) => result.status === "rejected");
  for (const result of rejected) {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : "Delivery failed";
      console.error("[inquire] delivery failed", reason);
    }
  }

  if (rejected.length === results.length) {
    return Response.json(
      { ok: false, error: "We could not send your inquiry. Please try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
