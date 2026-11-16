import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env["VITE_SUPABASE_URL"] as string | undefined)
    : undefined;

const supabaseAnonKey =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined)
    : undefined;

const cleanUrl = supabaseUrl?.trim() || "";
const cleanAnonKey = supabaseAnonKey?.trim() || "";

export const isSupabaseConfigured: boolean =
  cleanUrl.length > 0 &&
  cleanAnonKey.length > 0 &&
  !cleanUrl.includes("your-project-ref") &&
  !cleanAnonKey.includes("your-supabase-anon");

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(cleanUrl, cleanAnonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });
  }
  return cachedClient;
}

export function requireSupabase(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
    );
  }
  return client;
}

export function isSchemaMissingError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const record = err as { code?: unknown; message?: unknown };
  const code = typeof record.code === "string" ? record.code : "";
  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  return (
    code === "PGRST202" ||
    code === "PGRST205" ||
    code === "42P01" ||
    code === "42883" ||
    message.includes("schema cache") ||
    message.includes("could not find the table") ||
    message.includes("could not find the function")
  );
}

const VISITOR_SESSION_KEY = "cl_visitor_session_v1";

export function getVisitorSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    const existing = window.sessionStorage.getItem(VISITOR_SESSION_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(VISITOR_SESSION_KEY, generated);
    return generated;
  } catch {
    return "anon-browser";
  }
}

export async function compressImageFile(
  file: File,
  maxDimension = 1400,
  quality = 0.84,
): Promise<File> {
  if (
    typeof document === "undefined" ||
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml"
  ) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const targetType = file.type === "image/png" ? "image/webp" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetType, quality),
    );
    if (!blob || blob.size >= file.size) return file;
    const ext = targetType === "image/webp" ? "webp" : "jpg";
    const cleanName = file.name.replace(/\.[^.]+$/, "") || "upload";
    return new File([blob], `${cleanName}.${ext}`, { type: targetType });
  } catch {
    return file;
  }
}
