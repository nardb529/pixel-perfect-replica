import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { sendNotification, setVapidDetails } from "web-push";

export function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function getServerSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = (
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    ""
  ).trim();
  const serviceRoleKey = (process.env["SUPABASE_SERVICE_ROLE_KEY"] || "").trim();
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function authenticateBearerUser(
  request: Request,
  adminClient: SupabaseClient,
): Promise<{ user: User | null; error?: string }> {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return { user: null, error: "Missing authorization token." };
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    return { user: null, error: "Empty authorization token." };
  }
  const { data, error } = await adminClient.auth.getUser(token);
  if (error || !data.user) {
    return { user: null, error: "Invalid or expired session." };
  }
  return { user: data.user };
}

export async function requireActiveAdmin(
  adminClient: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await adminClient
    .from("profiles")
    .select("role, is_suspended")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return false;
  return data.role === "admin" && !data.is_suspended;
}

export function normalizeSafePageUrl(rawUrl: unknown): string {
  const value = typeof rawUrl === "string" ? rawUrl.trim() : "";
  if (!value) return "/dashboard";
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value.slice(0, 240);
  }
  try {
    const parsed = new URL(value);
    const relative = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return relative.startsWith("/") ? relative.slice(0, 240) : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export function isValidPushEndpoint(rawEndpoint: unknown): rawEndpoint is string {
  if (typeof rawEndpoint !== "string") return false;
  const trimmed = rawEndpoint.trim();
  if (!trimmed || trimmed.length > 2048) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function configureVapid(): {
  ready: boolean;
  publicKey: string;
  privateKey: string;
  subject: string;
} {
  const publicKey = (
    process.env["VAPID_PUBLIC_KEY"] ||
    process.env["VITE_VAPID_PUBLIC_KEY"] ||
    ""
  ).trim();
  const privateKey = (process.env["VAPID_PRIVATE_KEY"] || "").trim();
  const subject = (process.env["VAPID_SUBJECT"] || "mailto:support@campusloop.app").trim();

  if (!publicKey || !privateKey) {
    return { ready: false, publicKey, privateKey, subject };
  }

  setVapidDetails(subject, publicKey, privateKey);
  return { ready: true, publicKey, privateKey, subject };
}

export interface WebPushSubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function dispatchWebPushBatch(
  adminClient: SupabaseClient,
  targetUserIds: string[],
  payload: {
    title: string;
    message: string;
    url?: string;
    tag?: string;
  },
): Promise<{
  vapidConfigured: boolean;
  deliveredDevices: number;
  failedDevices: number;
  pruned: number;
}> {
  const subs: WebPushSubscriptionRow[] = [];
  for (const part of chunkArray(targetUserIds, 100)) {
    const { data: subRows, error: subsErr } = await adminClient
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .in("user_id", part);
    if (subsErr) throw subsErr;
    for (const row of subRows || []) {
      subs.push({
        id: String(row.id),
        endpoint: String(row.endpoint),
        p256dh: String(row.p256dh),
        auth: String(row.auth),
      });
    }
  }

  const vapid = configureVapid();
  if (!vapid.ready) {
    return { vapidConfigured: false, deliveredDevices: 0, failedDevices: 0, pruned: 0 };
  }

  if (subs.length === 0) {
    return { vapidConfigured: true, deliveredDevices: 0, failedDevices: 0, pruned: 0 };
  }

  const pushBody = JSON.stringify({
    title: payload.title,
    body: payload.message,
    message: payload.message,
    url: normalizeSafePageUrl(payload.url),
    tag: payload.tag || `cl-${Date.now()}`,
  });

  let deliveredDevices = 0;
  let failedDevices = 0;
  const expiredIds: string[] = [];

  for (const batch of chunkArray(subs, 50)) {
    await Promise.all(
      batch.map(async (sub) => {
        try {
          await sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            pushBody,
          );
          deliveredDevices += 1;
        } catch (pushErr: unknown) {
          failedDevices += 1;
          const statusCode =
            pushErr && typeof pushErr === "object" && "statusCode" in pushErr
              ? Number((pushErr as { statusCode?: number }).statusCode)
              : 0;
          if (statusCode === 404 || statusCode === 410) {
            expiredIds.push(String(sub.id));
          }
        }
      }),
    );
  }

  if (expiredIds.length > 0) {
    for (const part of chunkArray(expiredIds, 100)) {
      await adminClient.from("push_subscriptions").delete().in("id", part);
    }
  }

  return {
    vapidConfigured: true,
    deliveredDevices,
    failedDevices,
    pruned: expiredIds.length,
  };
}

export { sendNotification };
