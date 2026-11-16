import { getSupabaseClient, getVisitorSessionId, requireSupabase } from "@/lib/supabase/client";
import type { SellerAnalyticsResponse } from "@/lib/supabase/database.types";

export const analyticsService = {
  async recordView(
    listingId: string,
    universityId?: string | null,
    source = "marketplace",
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    const { data, error } = await client.rpc("record_listing_view", {
      p_listing_id: listingId,
      p_university_id: universityId ?? null,
      p_visitor_session_id: getVisitorSessionId(),
      p_source: source,
    });
    if (error) return false;
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
