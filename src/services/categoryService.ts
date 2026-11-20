import { getSupabaseClient } from "@/lib/supabase/client";
import type { CategoryRecord, CategoryType } from "@/lib/supabase/database.types";

const CATEGORY_COLUMNS =
  "id, name, slug, category_type, icon, description, display_order, is_active, created_at";
const CACHE_KEY = "cl_active_categories_v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

let memoryCache: { expiresAt: number; data: CategoryRecord[] } | null = null;
let inflightActiveRequest: Promise<CategoryRecord[]> | null = null;

function readCachedCategories(): CategoryRecord[] | null {
  if (memoryCache && memoryCache.expiresAt > Date.now()) {
    return memoryCache.data;
  }
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt?: number; data?: CategoryRecord[] };
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

function writeCachedCategories(data: CategoryRecord[]): void {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  memoryCache = { expiresAt, data };
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ expiresAt, data }));
  } catch {
    // Ignore quota errors
  }
}

export function invalidateCategoryCache(): void {
  memoryCache = null;
  inflightActiveRequest = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export const categoryService = {
  async listActiveCategories(
    type?: CategoryType,
    options?: { forceRefresh?: boolean },
  ): Promise<CategoryRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    if (!options?.forceRefresh) {
      const cached = readCachedCategories();
      if (cached) {
        return type ? cached.filter((c) => c.category_type === type) : cached;
      }
      if (inflightActiveRequest) {
        const rows = await inflightActiveRequest;
        return type ? rows.filter((c) => c.category_type === type) : rows;
      }
    }

    const requestPromise = (async () => {
      const { data, error } = await client
        .from("categories")
        .select(CATEGORY_COLUMNS)
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      const rows = (data || []) as CategoryRecord[];
      if (rows.length > 0) {
        writeCachedCategories(rows);
      }
      return rows;
    })().finally(() => {
      inflightActiveRequest = null;
    });

    if (!options?.forceRefresh) {
      inflightActiveRequest = requestPromise;
    }

    const rows = await requestPromise;
    return type ? rows.filter((c) => c.category_type === type) : rows;
  },

  async listAllCategories(): Promise<CategoryRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .order("category_type", { ascending: true })
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data || []) as CategoryRecord[];
  },
};
