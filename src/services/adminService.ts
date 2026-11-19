import {
  compressImageFile,
  getSessionUser,
  isSchemaMissingError,
  requireSupabase,
} from "@/lib/supabase/client";
import { invalidateCategoryCache } from "@/services/categoryService";
import { invalidateUniversityCache } from "@/services/universityService";
import type {
  AdminDashboardSummary,
  CategoryRecord,
  CategoryType,
  ListingStatus,
  NotificationType,
  PriceType,
  ProfileRecord,
  PromotionConfigRecord,
  ReportRecord,
  ReportStatus,
  UniversityRecord,
  UserRole,
  VerificationStatus,
} from "@/lib/supabase/database.types";

export type AdminListingSummary = {
  id: string;
  title: string;
  listing_type: string;
  status: ListingStatus;
  is_featured: boolean;
  seller_id: string;
  category_id: string;
  price: number | null;
  price_type: PriceType;
  view_count: number;
  contact_click_count: number;
  location: string;
  created_at: string;
};

export type ModerationLogRecord = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  notes: string | null;
  created_at: string;
};

async function writeAuditLog(action: string, targetType: string, targetId: string, notes?: string) {
  const supabase = requireSupabase();
  const user = await getSessionUser(supabase);
  if (!user) return;
  const { error } = await supabase.from("moderation_logs").insert({
    admin_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId,
    notes: notes ?? null,
  });
  if (error) {
    console.warn("Audit log write failed:", error.message);
  }
}

export const adminService = {
  async getSummary(): Promise<AdminDashboardSummary> {
    const supabase = requireSupabase();
    const { data, error } = await supabase.rpc("get_admin_dashboard_summary");
    if (error) throw error;
    return data as AdminDashboardSummary;
  },

  async listAllListings(limit = 120): Promise<AdminListingSummary[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select(
        "id, title, listing_type, status, is_featured, seller_id, category_id, price, price_type, view_count, contact_click_count, location, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as AdminListingSummary[];
  },

  async listAllProfiles(limit = 120): Promise<ProfileRecord[]> {
    const supabase = requireSupabase();
    const baseCols =
      "id, full_name, username, email, phone_number, whatsapp_number, preferred_contact_method, show_public_contact, profile_image, bio, account_type, primary_university_id, verification_status, is_student, id_document_type, id_document_path, verification_photo_confirmed, verification_submitted_at, verification_note, role, is_suspended, notification_preferences, created_at, updated_at";
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `${baseCols}, verification_checks, subscription_tier, subscription_status, subscription_expires_at`,
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      if (isSchemaMissingError(error)) {
        const fallback = await supabase
          .from("profiles")
          .select(baseCols)
          .order("created_at", { ascending: false })
          .limit(limit);
        if (fallback.error) throw fallback.error;
        return (fallback.data || []) as ProfileRecord[];
      }
      throw error;
    }
    return (data || []) as ProfileRecord[];
  },

  async listReports(): Promise<ReportRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("reports")
      .select(
        "id, reporter_id, listing_id, reported_user_id, reason, description, status, reviewed_by, reviewed_at, moderation_note, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(120);
    if (error) throw error;
    return (data || []) as ReportRecord[];
  },

  async listModerationLogs(limit = 80): Promise<ModerationLogRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("moderation_logs")
      .select("id, admin_id, action, target_type, target_id, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as ModerationLogRecord[];
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

  async deleteListing(listingId: string, note?: string): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase.from("listings").delete().eq("id", listingId);
    if (error) throw error;
    await writeAuditLog(
      "listing_deleted",
      "listing",
      listingId,
      note || "Deleted by administrator",
    );
  },

  async toggleFeaturedListing(listingId: string, isFeatured: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("listings")
      .update({ is_featured: isFeatured })
      .eq("id", listingId);
    if (error) throw error;
    await writeAuditLog(
      isFeatured ? "listing_featured" : "listing_unfeatured",
      "listing",
      listingId,
    );
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

  async updateUserVerification(
    userId: string,
    status: VerificationStatus,
    note?: string,
  ): Promise<void> {
    const supabase = requireSupabase();
    const cleanNote = note?.trim().slice(0, 500) || null;
    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: status,
        verification_note: status === "verified" ? null : cleanNote,
      })
      .eq("id", userId);
    if (error) throw error;

    await writeAuditLog(`user_verification_${status}`, "profile", userId, cleanNote ?? undefined);
    const title =
      status === "verified"
        ? "Seller account verified"
        : status === "pending"
          ? "Verification under review"
          : "Seller verification needs an update";
    const message =
      status === "verified"
        ? "Your CampusLoop seller verification is approved. You can now post products and services."
        : cleanNote || `Your seller verification status was updated to ${status}.`;
    const { error: notifErr } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      notification_type: "account_update" as NotificationType,
    });
    if (notifErr) throw notifErr;

    void supabase.functions
      .invoke("push-send", {
        body: { userIds: [userId], title, message, url: "/dashboard" },
      })
      .catch(() => undefined);
  },

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (user?.id === userId) {
      throw new Error("Administrators cannot change their own role.");
    }
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) throw error;

    await writeAuditLog(`user_role_${role}`, "profile", userId);
    const title =
      role === "admin" ? "Administrator access granted" : "Administrator access updated";
    const message =
      role === "admin"
        ? "You now have full access to the CampusLoop Admin Command Center."
        : "Your account role was changed to standard member.";
    const { error: notifErr } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      notification_type: "account_update" as NotificationType,
    });
    if (notifErr) throw notifErr;

    void supabase.functions
      .invoke("push-send", {
        body: {
          userIds: [userId],
          title,
          message,
          url: role === "admin" ? "/admin" : "/dashboard",
        },
      })
      .catch(() => undefined);
  },

  async sendBroadcastNotification(input: {
    title: string;
    message: string;
    targetUserIds: string[];
    notificationType?: NotificationType | undefined;
    scopeLabel?: string | undefined;
  }): Promise<number> {
    const supabase = requireSupabase();
    const uniqueIds = Array.from(new Set(input.targetUserIds.filter(Boolean)));
    if (uniqueIds.length === 0) return 0;

    const cleanTitle = input.title.trim();
    const cleanMessage = input.message.trim();
    const rows = uniqueIds.map((uid) => ({
      user_id: uid,
      title: cleanTitle,
      message: cleanMessage,
      notification_type: (input.notificationType ?? "platform_announcement") as NotificationType,
      metadata: { scope: input.scopeLabel ?? "broadcast" },
    }));

    const { error } = await supabase.from("notifications").insert(rows);
    if (error) throw error;

    void supabase.functions
      .invoke("push-send", {
        body: {
          userIds: uniqueIds,
          title: cleanTitle,
          message: cleanMessage,
          url: "/dashboard",
        },
      })
      .catch(() => undefined);

    const user = await getSessionUser(supabase);
    if (user) {
      await writeAuditLog(
        "platform_broadcast",
        "notifications",
        user.id,
        `${cleanTitle} → ${uniqueIds.length} recipient(s)`,
      );
    }
    return uniqueIds.length;
  },

  async resolveReport(reportId: string, status: ReportStatus, note?: string): Promise<void> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
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
    await writeAuditLog(`report_${status}`, "report", reportId, note);
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
      .select(
        "id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at",
      )
      .single();
    if (error) throw error;
    invalidateUniversityCache();
    await writeAuditLog(
      "university_saved",
      "university",
      (data as UniversityRecord).id,
      input.short_name,
    );
    return data as UniversityRecord;
  },

  async toggleUniversityActive(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("universities")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
    invalidateUniversityCache();
    await writeAuditLog(isActive ? "university_enabled" : "university_disabled", "university", id);
  },

  async uploadUniversityLogo(file: File, slug: string): Promise<string> {
    const supabase = requireSupabase();
    const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
    if (!allowedMimeTypes.has(file.type)) {
      throw new Error("Choose a JPG, PNG, WebP, or SVG logo.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("University logos must be 2 MB or smaller.");
    }
    const optimized = await compressImageFile(file, 512, 0.9);
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };
    const ext = mimeToExt[optimized.type] || "png";
    const safeSlug =
      slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "") || "campus";
    const path = `${safeSlug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("university-logos").upload(path, optimized, {
      upsert: true,
      contentType: optimized.type,
      cacheControl: "2592000",
    });
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
      .select(
        "id, name, slug, category_type, icon, description, display_order, is_active, created_at",
      )
      .single();
    if (error) throw error;
    invalidateCategoryCache();
    await writeAuditLog("category_saved", "category", (data as CategoryRecord).id, input.name);
    return data as CategoryRecord;
  },

  async toggleCategoryActive(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("categories")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
    invalidateCategoryCache();
    await writeAuditLog(isActive ? "category_shown" : "category_hidden", "category", id);
  },

  async listPromotionConfigs(): Promise<PromotionConfigRecord[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("promotion_configs")
      .select(
        "id, plan_key, name, description, target_scope, duration_days, suggested_fee_ghs, is_active, created_at, updated_at",
      )
      .order("duration_days", { ascending: true });
    if (error) throw error;
    return (data || []) as PromotionConfigRecord[];
  },

  async upsertPromotionConfig(input: {
    id?: string | undefined;
    plan_key: string;
    name: string;
    description: string;
    target_scope: string;
    duration_days: number;
    suggested_fee_ghs: number;
    is_active?: boolean | undefined;
  }): Promise<PromotionConfigRecord> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from("promotion_configs")
      .upsert({
        ...(input.id ? { id: input.id } : {}),
        plan_key: input.plan_key.trim().toLowerCase(),
        name: input.name.trim(),
        description: input.description.trim(),
        target_scope: input.target_scope.trim() || "listing",
        duration_days: Math.max(1, input.duration_days),
        suggested_fee_ghs: Math.max(0, input.suggested_fee_ghs),
        is_active: input.is_active ?? false,
      })
      .select("*")
      .single();
    if (error) throw error;
    return data as PromotionConfigRecord;
  },

  async togglePromotionConfig(id: string, isActive: boolean): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("promotion_configs")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
    await writeAuditLog(isActive ? "promotion_enabled" : "promotion_disabled", "promotion", id);
  },
};
