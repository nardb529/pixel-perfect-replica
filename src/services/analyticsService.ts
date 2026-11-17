import { getSupabaseClient, getVisitorSessionId, requireSupabase } from "@/lib/supabase/client";
import type { SellerAnalyticsResponse } from "@/lib/supabase/database.types";

const VIEW_DEDUPE_KEY = "cl_viewed_listings_v1";
const VIEW_DEDUPE_MS = 15 * 60 * 1000;

function readViewedMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(VIEW_DEDUPE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function wasRecentlyViewed(listingId: string): boolean {
  const now = Date.now();
  const map = readViewedMap();
  const seenAt = map[listingId];
  return typeof seenAt === "number" && now - seenAt < VIEW_DEDUPE_MS;
}

function markListingViewed(listingId: string): void {
  if (typeof window === "undefined") return;
  try {
    const now = Date.now();
    const map = readViewedMap();
    const next: Record<string, number> = {};
    for (const [key, ts] of Object.entries(map)) {
      if (typeof ts === "number" && now - ts < VIEW_DEDUPE_MS) {
        next[key] = ts;
      }
    }
    next[listingId] = now;
    window.sessionStorage.setItem(VIEW_DEDUPE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

export function clearAnalyticsSessionCache(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(VIEW_DEDUPE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export const analyticsService = {
  async recordView(
    listingId: string,
    universityId?: string | null,
    source = "marketplace",
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    if (wasRecentlyViewed(listingId)) return false;

    const { data, error } = await client.rpc("record_listing_view", {
      p_listing_id: listingId,
      p_university_id: universityId ?? null,
      p_visitor_session_id: getVisitorSessionId(),
      p_source: source,
    });
    if (error) return false;
    markListingViewed(listingId);
    return Boolean(data);
  },

  async recordContactClick(
    listingId: string,
    contactMethod: string,
    universityId?: string | null,
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { data, error } = await client.rpc("record_contact_click", {
      p_listing_id: listingId,
      p_contact_method: contactMethod,
      p_university_id: universityId ?? null,
      p_visitor_session_id: getVisitorSessionId(),
    });
    if (error) return false;
    return Boolean(data);
  },

  async toggleLike(listingId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { data, error } = await client.rpc("toggle_listing_like", {
      p_listing_id: listingId,
      p_visitor_session_id: getVisitorSessionId(),
    });
    if (error) throw error;
    return Boolean(data);
  },

  async getSellerAnalytics(
    range: "today" | "7d" | "30d" | "all" = "all",
  ): Promise<SellerAnalyticsResponse> {
    const supabase = requireSupabase();
    const { data, error } = await supabase.rpc("get_seller_analytics", { p_range: range });
    if (error) throw error;
    return data as SellerAnalyticsResponse;
  },
};
