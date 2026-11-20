import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { UserInputError } from "@/lib/campus/data";

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

export async function getSessionUser(client?: SupabaseClient | null) {
  const target = client ?? getSupabaseClient();
  if (!target) return null;
  const { data } = await target.auth.getSession();
  return data.session?.user ?? null;
}

export function isSchemaMissingError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const record = err as { code?: unknown; message?: unknown };
  const code = typeof record.code === "string" ? record.code : "";
  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  return (
    code === "PGRST202" ||
    code === "PGRST204" ||
    code === "PGRST205" ||
    code === "42P01" ||
    code === "42703" ||
    code === "42883" ||
    message.includes("schema cache") ||
    message.includes("could not find the table") ||
    message.includes("could not find the function") ||
    (message.includes("column") && message.includes("does not exist"))
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

export function resetVisitorSessionId(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(VISITOR_SESSION_KEY);
  } catch {
    // Ignore storage errors
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

    const webpBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    let targetType = "image/webp";
    let blob = webpBlob;
    if (!blob || blob.size === 0) {
      targetType = "image/jpeg";
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
    }
    if (!blob || blob.size >= file.size) return file;
    const ext = targetType === "image/webp" ? "webp" : "jpg";
    const cleanName = file.name.replace(/\.[^.]+$/, "") || "upload";
    return new File([blob], `${cleanName}.${ext}`, { type: targetType });
  } catch {
    return file;
  }
}

/** Phone cameras often produce 6-12 MB photos, so accept big originals and shrink them before upload. */
export const MAX_RAW_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024;

export async function prepareImageForUpload(
  file: File,
  maxDimension = 1400,
  quality = 0.84,
): Promise<File> {
  if (file.size > MAX_RAW_IMAGE_BYTES) {
    throw new UserInputError("That photo is larger than 25 MB. Choose a smaller photo.");
  }
  let output = await compressImageFile(file, maxDimension, quality);
  if (output.size > MAX_UPLOAD_IMAGE_BYTES) {
    output = await compressImageFile(output, Math.round(maxDimension * 0.7), 0.7);
  }
  if (output.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new UserInputError(
      "This photo is still over 5 MB after shrinking. Take a new photo or choose a smaller one.",
    );
  }
  return output;
}
