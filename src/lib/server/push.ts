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

export { sendNotification };
