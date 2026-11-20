import {
  prepareImageForUpload,
  getSessionUser,
  getSupabaseClient,
  isSchemaMissingError,
  requireSupabase,
} from "@/lib/supabase/client";
import { UserInputError } from "@/lib/campus/data";
import {
  inspectVerificationImage,
  type ImageValidityResult,
  type LiveSelfieChecks,
  type VerificationChecksPayload,
} from "@/lib/campus/idVerification";
import type {
  AccountType,
  AffiliationType,
  IdDocumentType,
  ProfileRecord,
  PublicSellerProfileRecord,
  UserUniversityRecord,
} from "@/lib/supabase/database.types";

const PROFILE_COLUMNS_BASE =
  "id, full_name, username, email, phone_number, whatsapp_number, preferred_contact_method, show_public_contact, profile_image, bio, account_type, primary_university_id, verification_status, is_student, id_document_type, id_document_path, verification_photo_confirmed, verification_submitted_at, verification_note, role, is_suspended, notification_preferences, created_at, updated_at";
const PROFILE_COLUMNS = `${PROFILE_COLUMNS_BASE}, banner_image, verification_checks, subscription_tier, subscription_status, subscription_expires_at`;
const PUBLIC_SELLER_COLUMNS_BASE =
  "id, full_name, username, profile_image, bio, account_type, primary_university_id, verification_status, preferred_contact_method, public_contact_handle, is_suspended, created_at";
const PUBLIC_SELLER_COLUMNS = `${PUBLIC_SELLER_COLUMNS_BASE}, banner_image`;

export interface UpdateProfileInput {
  full_name?: string | undefined;
  username?: string | undefined;
  phone_number?: string | null | undefined;
  whatsapp_number?: string | null | undefined;
  preferred_contact_method?: string | undefined;
  show_public_contact?: boolean | undefined;
  profile_image?: string | null | undefined;
  banner_image?: string | null | undefined;
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

    if (error) {
      if (isSchemaMissingError(error)) {
        const fallback = await client
          .from("profiles")
          .select(PROFILE_COLUMNS_BASE)
          .eq("id", targetId)
          .maybeSingle();
        if (fallback.error) throw fallback.error;
        return fallback.data as ProfileRecord | null;
      }
      throw error;
    }
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
    if (error) {
      if (isSchemaMissingError(error)) {
        const fallback = await client
          .from("public_seller_profiles")
          .select(PUBLIC_SELLER_COLUMNS_BASE)
          .eq("id", sellerId)
          .maybeSingle();
        if (fallback.error) throw fallback.error;
        return fallback.data as PublicSellerProfileRecord | null;
      }
      throw error;
    }
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
    if (input.banner_image !== undefined) sanitized["banner_image"] = input.banner_image;
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

    if (error) {
      if (isSchemaMissingError(error)) {
        const baseSanitized = { ...sanitized };
        delete baseSanitized["banner_image"];
        const fallback = await supabase
          .from("profiles")
          .update(baseSanitized)
          .eq("id", user.id)
          .select(PROFILE_COLUMNS_BASE)
          .single();
        if (fallback.error) throw fallback.error;
        return fallback.data as ProfileRecord;
      }
      throw error;
    }
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
      throw new UserInputError("Choose a JPG, PNG, or WebP image file.");
    }
    const validity = await inspectVerificationImage(file, "profile");
    if (!validity.valid) {
      throw new UserInputError(validity.reason || "Profile photo failed image quality checks.");
    }

    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const optimized = await prepareImageForUpload(file, 720, 0.85);
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

  async uploadShopBanner(file: File): Promise<string> {
    const supabase = requireSupabase();
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      throw new UserInputError("Choose a JPG, PNG, or WebP image for your shop banner.");
    }
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const optimized = await prepareImageForUpload(file, 1440, 0.82);
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const ext = mimeToExt[optimized.type] || "webp";
    const path = `${user.id}/banner-${Date.now()}.${ext}`;

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

  async uploadVerificationId(
    file: File,
    expectedDocType?: IdDocumentType,
  ): Promise<{ path: string; signedUrl: string; validity: ImageValidityResult }> {
    const supabase = requireSupabase();
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      throw new UserInputError("Upload a clear JPG, PNG, or WebP photo of your ID card.");
    }
    const validity = await inspectVerificationImage(file, "id", expectedDocType);
    if (!validity.valid) {
      throw new UserInputError(
        validity.reason || "Uploaded ID image failed quality & validity checks.",
      );
    }

    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Sign in to upload verification documents.");

    const optimized = await prepareImageForUpload(file, 1400, 0.88);
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const ext = mimeToExt[optimized.type] || "jpg";
    const path = `${user.id}/id-doc-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("seller-verifications")
      .upload(path, optimized, {
        upsert: true,
        contentType: optimized.type,
        cacheControl: "3600",
      });

    if (uploadErr) throw uploadErr;

    const { data: signedData, error: signErr } = await supabase.storage
      .from("seller-verifications")
      .createSignedUrl(path, 600);

    if (signErr) throw signErr;
    return { path, signedUrl: signedData.signedUrl, validity };
  },

  async getSignedVerificationDocUrl(path?: string | null): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client || !path) return null;
    const { data, error } = await client.storage
      .from("seller-verifications")
      .createSignedUrl(path, 300);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  },

  async submitSellerVerification(input: {
    isStudent: boolean;
    idDocumentType: IdDocumentType;
    idDocumentPath: string;
    profileImageUrl: string;
    photoMatchConfirmed: boolean;
    verificationChecks?: VerificationChecksPayload | undefined;
  }): Promise<ProfileRecord> {
    if (input.isStudent && input.idDocumentType !== "Student ID") {
      throw new UserInputError("Students must upload a valid Student ID.");
    }
    if (!input.isStudent && !["Ghana Card", "Voters ID"].includes(input.idDocumentType)) {
      throw new UserInputError("Non-students must upload either a Ghana Card or Voter's ID.");
    }
    if (!input.idDocumentPath.trim()) {
      throw new UserInputError("Upload a clear photo of your required ID card.");
    }
    if (!input.profileImageUrl.trim()) {
      throw new UserInputError("Upload a real profile photo matching the person on your ID.");
    }
    if (!input.photoMatchConfirmed) {
      throw new UserInputError(
        "Confirm that your profile photo matches the person on your ID card.",
      );
    }

    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const basePayload = {
      is_student: input.isStudent,
      id_document_type: input.idDocumentType,
      id_document_path: input.idDocumentPath.trim(),
      profile_image: input.profileImageUrl.trim(),
      verification_photo_confirmed: true,
      verification_submitted_at: new Date().toISOString(),
      // Only an administrator may approve a seller account; submissions always enter pending review
      verification_status: "pending" as const,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(
        input.verificationChecks
          ? { ...basePayload, verification_checks: input.verificationChecks }
          : basePayload,
      )
      .eq("id", user.id)
      .select(PROFILE_COLUMNS)
      .single();

    const fallbackProfile = await (async (): Promise<ProfileRecord> => {
      if (error) {
        if (isSchemaMissingError(error)) {
          const fallback = await supabase
            .from("profiles")
            .update(basePayload)
            .eq("id", user.id)
            .select(PROFILE_COLUMNS_BASE)
            .single();
          if (fallback.error) throw fallback.error;
          return fallback.data as ProfileRecord;
        }
        throw error;
      }
      return data as ProfileRecord;
    })();

    void this.notifyAdminsOfVerificationSubmission();
    return fallbackProfile;
  },
  /**
   * Live-selfie verification. Stores ONE small private photo in the
   * seller-verifications bucket (same path each time, so retakes replace the old
   * file) and moves the account to "pending". Only an admin can approve.
   */
  async submitLiveSelfieVerification(blob: Blob, checks: LiveSelfieChecks): Promise<ProfileRecord> {
    if (!blob || blob.size === 0) {
      throw new UserInputError("Take a live selfie first.");
    }
    if (blob.size > 400 * 1024) {
      throw new UserInputError("The selfie is too large. Please retake it in better light.");
    }
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");

    const path = `${user.id}/selfie.jpg`;
    const { error: uploadErr } = await supabase.storage
      .from("seller-verifications")
      .upload(path, blob, {
        upsert: true,
        contentType: "image/jpeg",
        cacheControl: "60",
      });
    if (uploadErr) throw uploadErr;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        id_document_type: "Live Selfie",
        id_document_path: path,
        verification_photo_confirmed: true,
        verification_submitted_at: new Date().toISOString(),
        verification_checks: checks,
        verification_status: "pending" as const,
      })
      .eq("id", user.id)
      .select(PROFILE_COLUMNS)
      .single();
    if (error) throw error;

    void this.notifyAdminsOfVerificationSubmission();
    return data as ProfileRecord;
  },

  async notifyAdminsOfVerificationSubmission(): Promise<void> {
    if (typeof window === "undefined") return;
    const client = getSupabaseClient();
    if (!client) return;
    try {
      const { data: sessionData } = await client.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return;
      await fetch("/api/push/notify-admin-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      // Non-blocking best effort so verification submission succeeds even if push is unconfigured
    }
  },
};
