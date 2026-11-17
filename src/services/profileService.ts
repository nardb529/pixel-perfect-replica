import {
  compressImageFile,
  getSessionUser,
  getSupabaseClient,
  requireSupabase,
} from "@/lib/supabase/client";
import type {
  AccountType,
  AffiliationType,
  ProfileRecord,
  PublicSellerProfileRecord,
  UserUniversityRecord,
} from "@/lib/supabase/database.types";

const PROFILE_COLUMNS =
  "id, full_name, username, email, phone_number, whatsapp_number, preferred_contact_method, show_public_contact, profile_image, bio, account_type, primary_university_id, verification_status, role, is_suspended, notification_preferences, created_at, updated_at";
const PUBLIC_SELLER_COLUMNS =
  "id, full_name, username, profile_image, bio, account_type, primary_university_id, verification_status, preferred_contact_method, public_contact_handle, is_suspended, created_at";

export interface UpdateProfileInput {
  full_name?: string | undefined;
  username?: string | undefined;
  phone_number?: string | null | undefined;
  whatsapp_number?: string | null | undefined;
  preferred_contact_method?: string | undefined;
  show_public_contact?: boolean | undefined;
  profile_image?: string | null | undefined;
  bio?: string | undefined;
  account_type?: AccountType | undefined;
  primary_university_id?: string | null | undefined;
}

export const profileService = {
  async getMyProfile(userId?: string): Promise<ProfileRecord | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    let targetId = userId;
    if (!targetId) {
      const sessionUser = await getSessionUser(client);
      targetId = sessionUser?.id;
    }
    if (!targetId) return null;

    const { data, error } = await client
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", targetId)
      .maybeSingle();

    if (error) throw error;
    return data as ProfileRecord | null;
  },

  async getPublicSellerProfile(sellerId: string): Promise<PublicSellerProfileRecord | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from("public_seller_profiles")
      .select(PUBLIC_SELLER_COLUMNS)
      .eq("id", sellerId)
      .maybeSingle();
    if (error) throw error;
    return data as PublicSellerProfileRecord | null;
  },

  async updateMyProfile(input: UpdateProfileInput): Promise<ProfileRecord> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const sanitized: Record<string, unknown> = {};
    if (input.full_name !== undefined) sanitized["full_name"] = input.full_name.trim().slice(0, 80);
    if (input.username !== undefined)
      sanitized["username"] = input.username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_.-]/g, "")
        .slice(0, 40);
    if (input.phone_number !== undefined)
      sanitized["phone_number"] = input.phone_number?.trim().slice(0, 40) || null;
    if (input.whatsapp_number !== undefined)
      sanitized["whatsapp_number"] = input.whatsapp_number?.trim().slice(0, 40) || null;
    if (input.preferred_contact_method !== undefined)
      sanitized["preferred_contact_method"] = input.preferred_contact_method;
    if (input.show_public_contact !== undefined)
      sanitized["show_public_contact"] = input.show_public_contact;
    if (input.profile_image !== undefined) sanitized["profile_image"] = input.profile_image;
    if (input.bio !== undefined) sanitized["bio"] = input.bio.trim().slice(0, 600);
    if (input.account_type !== undefined) sanitized["account_type"] = input.account_type;
    if (input.primary_university_id !== undefined)
      sanitized["primary_university_id"] = input.primary_university_id;

    const { data, error } = await supabase
      .from("profiles")
      .update(sanitized)
      .eq("id", user.id)
      .select(PROFILE_COLUMNS)
      .single();

    if (error) throw error;
    return data as ProfileRecord;
  },

  async listUserUniversities(userId: string): Promise<UserUniversityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("user_universities")
      .select(
        "id, user_id, university_id, affiliation_type, is_primary, created_at, university:universities(id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at)",
      )
      .eq("user_id", userId)
      .order("is_primary", { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as UserUniversityRecord[];
  },

  async saveUserUniversities(
    affiliations: Array<{
      university_id: string;
      affiliation_type: AffiliationType;
      is_primary: boolean;
    }>,
  ): Promise<void> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const { error: deleteErr } = await supabase
      .from("user_universities")
      .delete()
      .eq("user_id", user.id);
    if (deleteErr) throw deleteErr;

    if (affiliations.length > 0) {
      const { error: insertErr } = await supabase.from("user_universities").insert(
        affiliations.map((a) => ({
          user_id: user.id,
          university_id: a.university_id,
          affiliation_type: a.affiliation_type,
          is_primary: a.is_primary,
        })),
      );
      if (insertErr) throw insertErr;
    }
  },

  async uploadProfileImage(file: File): Promise<string> {
    const supabase = requireSupabase();
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      throw new Error("Choose a JPG, PNG, or WebP image file.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Profile images must be 5 MB or smaller.");
    }

    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const optimized = await compressImageFile(file, 720, 0.85);
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const ext = mimeToExt[optimized.type] || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("profile-images")
      .upload(path, optimized, {
        upsert: true,
        contentType: optimized.type,
        cacheControl: "2592000",
      });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    return data.publicUrl;
  },
};
