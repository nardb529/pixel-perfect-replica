import { compressImageFile, requireSupabase } from "@/lib/supabase/client";
import type {
  AdminDashboardSummary,
  CategoryRecord,
  CategoryType,
  ListingStatus,
  ProfileRecord,
  PromotionConfigRecord,
  ReportRecord,
  ReportStatus,
  UniversityRecord,
} from "@/lib/supabase/database.types";

export const adminService = {
  async getSummary(): Promise<AdminDashboardSummary> {
    const supabase = requireSupabase();
    const { data, error } = await supabase.rpc("get_admin_dashboard_summary");
    if (error) throw error;
    return data as AdminDashboardSummary;
  },

  async listAllListings(limit = 50): Promise<
    Array<{
      id: string;
      title: string;
      listing_type: string;
      status: ListingStatus;
      is_featured: boolean;
      seller_id: string;
      created_at: string;
      seller?: { full_name?: string; email?: string } | null;
    }>
  > {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, listing_type, status, is_featured, seller_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as Array<{
      id: string;
      title: string;
      listing_type: string;
      status: ListingStatus;
      is_featured: boolean;
      seller_id: string;
      created_at: string;
    }>;
  },

  async listAllProfiles(limit = 50): Promise<ProfileRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as ProfileRecord[];
  },

  async listReports(): Promise<ReportRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data || []) as ReportRecord[];
  },

  async moderateListing(listingId: string, status: ListingStatus, note?: string): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase.rpc("admin_moderate_listing", {
      p_listing_id: listingId,
      p_next_status: status,
      p_note: note ?? null,
    });
    if (error) throw error;
  },

  async toggleFeaturedListing(listingId: string, isFeatured: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("listings")
      .update({ is_featured: isFeatured })
      .eq("id", listingId);
    if (error) throw error;
  },

  async toggleUserSuspension(userId: string, suspended: boolean, note?: string): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase.rpc("admin_toggle_user_suspension", {
      p_user_id: userId,
      p_suspended: suspended,
      p_note: note ?? null,
    });
    if (error) throw error;
  },

  async resolveReport(reportId: string, status: ReportStatus, note?: string): Promise<void> {
    const supabase = requireSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("reports")
      .update({
        status,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        moderation_note: note ?? null,
      })
      .eq("id", reportId);
    if (error) throw error;
  },

  async upsertUniversity(input: {
    id?: string | undefined;
    university_name: string;
    short_name: string;
    slug: string;
    location: string;
    region: string;
    description?: string | undefined;
    logo_url?: string | null | undefined;
    display_order?: number | undefined;
    is_active?: boolean | undefined;
  }): Promise<UniversityRecord> {
    const supabase = requireSupabase();
    const payload = {
      ...(input.id ? { id: input.id } : {}),
      university_name: input.university_name.trim(),
      short_name: input.short_name.trim(),
      slug: input.slug.trim().toLowerCase(),
      location: input.location.trim(),
      region: input.region.trim(),
      description: input.description?.trim() || "",
      logo_url: input.logo_url ?? null,
      display_order: input.display_order ?? 50,
      is_active: input.is_active ?? true,
    };
    const { data, error } = await supabase
      .from("universities")
      .upsert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as UniversityRecord;
  },

  async toggleUniversityActive(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("universities")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
  },

  async uploadUniversityLogo(file: File, slug: string): Promise<string> {
    const supabase = requireSupabase();
    if (!file.type.startsWith("image/")) {
      throw new Error("Choose an image or SVG logo.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("University logos must be 2 MB or smaller.");
    }
    const optimized = await compressImageFile(file, 512, 0.9);
    const ext = optimized.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("university-logos")
      .upload(path, optimized, { upsert: true, contentType: optimized.type });
    if (error) throw error;
    const { data } = supabase.storage.from("university-logos").getPublicUrl(path);
    return data.publicUrl;
  },

  async upsertCategory(input: {
    id?: string | undefined;
    name: string;
    slug: string;
    category_type: CategoryType;
    icon?: string | undefined;
    description?: string | undefined;
    display_order?: number | undefined;
    is_active?: boolean | undefined;
  }): Promise<CategoryRecord> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("categories")
      .upsert({
        ...(input.id ? { id: input.id } : {}),
        name: input.name.trim(),
        slug: input.slug.trim().toLowerCase(),
        category_type: input.category_type,
        icon: input.icon || "tag",
        description: input.description?.trim() || "",
        display_order: input.display_order ?? 50,
        is_active: input.is_active ?? true,
      })
      .select("*")
      .single();
    if (error) throw error;
    return data as CategoryRecord;
  },

  async toggleCategoryActive(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("categories")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
  },

  async listPromotionConfigs(): Promise<PromotionConfigRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("promotion_configs")
      .select("*")
      .order("duration_days", { ascending: true });
    if (error) throw error;
    return (data || []) as PromotionConfigRecord[];
  },

  async togglePromotionConfig(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("promotion_configs")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
  },
};
