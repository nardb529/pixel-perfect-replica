import { getSupabaseClient } from "@/lib/supabase/client";
import type { UniversityRecord } from "@/lib/supabase/database.types";

const UNIVERSITY_COLUMNS =
  "id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at";
const CACHE_KEY = "cl_active_universities_v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

let memoryCache: { expiresAt: number; data: UniversityRecord[] } | null = null;

function readCachedUniversities(): UniversityRecord[] | null {
  if (memoryCache && memoryCache.expiresAt > Date.now()) {
    return memoryCache.data;
  }
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt?: number; data?: UniversityRecord[] };
    if (
      typeof parsed?.expiresAt === "number" &&
      parsed.expiresAt > Date.now() &&
      Array.isArray(parsed.data)
    ) {
      memoryCache = { expiresAt: parsed.expiresAt, data: parsed.data };
      return parsed.data;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

function writeCachedUniversities(data: UniversityRecord[]): void {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  memoryCache = { expiresAt, data };
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ expiresAt, data }));
  } catch {
    // Ignore quota errors
  }
}

export function invalidateUniversityCache(): void {
  memoryCache = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export const universityService = {
  async listActiveUniversities(options?: { forceRefresh?: boolean }): Promise<UniversityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    if (!options?.forceRefresh) {
      const cached = readCachedUniversities();
      if (cached) return cached;
    }

    const { data, error } = await client
      .from("universities")
      .select(UNIVERSITY_COLUMNS)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("university_name", { ascending: true });
    if (error) throw error;
    const rows = (data || []) as UniversityRecord[];
    if (rows.length > 0) {
      writeCachedUniversities(rows);
    }
    return rows;
  },

  async listAllUniversities(): Promise<UniversityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("universities")
      .select(UNIVERSITY_COLUMNS)
      .order("display_order", { ascending: true })
      .order("university_name", { ascending: true });
    if (error) throw error;
    return (data || []) as UniversityRecord[];
  },
};
