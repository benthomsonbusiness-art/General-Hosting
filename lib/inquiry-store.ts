import type { Inquiry } from "./inquiry-shared.ts";

/**
 * Optional D1 storage behind the INQUIRIES_DB binding. Every function is a no-op when the
 * binding is absent, and a storage failure never blocks delivery.
 */

type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<unknown>;
  first<T>(): Promise<T | null>;
};
type D1Like = { prepare(sql: string): D1Statement };

export type DeliveryStatus = "pending" | "delivered" | "failed" | "no_channel";

async function database(): Promise<D1Like | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const binding = (env as unknown as Record<string, unknown>).INQUIRIES_DB;
    return binding ? (binding as D1Like) : null;
  } catch {
    return null;
  }
}

async function runtimeDatabase(): Promise<D1Like | null> {
  // Outside the Workers runtime getCloudflareContext would start a local proxy. Skip it.
  if (typeof navigator === "undefined" || navigator.userAgent !== "Cloudflare-Workers") return null;
  return database();
}

/** SHA-256 of ip + secret + UTC day. Returns null without a secret, because a bare hash of an IP is reversible. */
async function hashIp(ip: string): Promise<string | null> {
  const secret = process.env.IP_HASH_SALT;
  if (!secret || ip === "unknown") return null;
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${ip}|${day}|${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function tooManyStored(ip: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    const db = await runtimeDatabase();
    const hash = db ? await hashIp(ip) : null;
    if (!db || !hash) return false;
    const since = new Date(Date.now() - windowMs).toISOString();
    const row = await db
      .prepare("SELECT COUNT(*) AS n FROM inquiries WHERE ip_hash = ? AND created_at > ?")
      .bind(hash, since)
      .first<{ n: number }>();
    return (row?.n ?? 0) >= limit;
  } catch (error) {
    console.error("[inquiry] rate lookup failed", error instanceof Error ? error.message : "");
    return false;
  }
}

export async function storeInquiry(inquiry: Inquiry, ip: string): Promise<string | null> {
  try {
    const db = await runtimeDatabase();
    if (!db) return null;
    const id = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO inquiries (id, created_at, full_name, email, company_role, practice, note, ip_hash, delivery_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
      )
      .bind(
        id,
        new Date().toISOString(),
        inquiry.fullName,
        inquiry.email,
        inquiry.companyRole,
        inquiry.practice,
        inquiry.note,
        await hashIp(ip),
      )
      .run();
    return id;
  } catch (error) {
    console.error("[inquiry] store failed", error instanceof Error ? error.message : "");
    return null;
  }
}

export async function markInquiry(
  id: string | null,
  status: DeliveryStatus,
  detail: string | null = null,
): Promise<void> {
  if (!id) return;
  try {
    const db = await runtimeDatabase();
    await db
      ?.prepare("UPDATE inquiries SET delivery_status = ?, delivery_detail = ? WHERE id = ?")
      .bind(status, detail, id)
      .run();
  } catch (error) {
    console.error("[inquiry] status update failed", error instanceof Error ? error.message : "");
  }
}
