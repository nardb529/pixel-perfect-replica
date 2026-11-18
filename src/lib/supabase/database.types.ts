import type { VerificationChecksPayload } from "@/lib/campus/idVerification";

export type AccountType = "Product Seller" | "Service Provider" | "Both";
export type VerificationStatus = "unverified" | "pending" | "verified";
export type IdDocumentType = "Student ID" | "Ghana Card" | "Voters ID";
export type UserRole = "user" | "admin";
export type AffiliationType = "Student" | "Alumni" | "Business" | "Service Provider" | "Other";
export type CategoryType = "product" | "service";
export type ListingType = "product" | "service";
export type PriceType = "Fixed" | "Starting from" | "Price range" | "Negotiable" | "Free";
export type ListingStatus =
  "Draft" | "Active" | "Paused" | "Sold" | "Unavailable" | "Rejected" | "Archived";
export type AudienceScope = "single" | "multiple" | "all";
export type ReportReason =
  | "Scam or suspicious activity"
  | "Misleading listing"
  | "Inappropriate content"
  | "Duplicate listing"
  | "Prohibited product or service"
  | "Other";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type NotificationType =
  | "listing_published"
  | "listing_rejected"
  | "listing_expiring_soon"
  | "listing_approved"
  | "account_update"
  | "platform_announcement";

export interface UniversityRecord {
  id: string;
  university_name: string;
  short_name: string;
  slug: string;
  logo_url: string | null;
  location: string;
  region: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  category_type: CategoryType;
  icon: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  listing_updates: boolean;
  announcements: boolean;
  enquiries: boolean;
}

export interface ProfileRecord {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string | null;
  whatsapp_number: string | null;
  preferred_contact_method: string;
  show_public_contact: boolean;
  profile_image: string | null;
  bio: string;
  account_type: AccountType;
  primary_university_id: string | null;
  verification_status: VerificationStatus;
  is_student: boolean;
  id_document_type: IdDocumentType | null;
  id_document_path: string | null;
  verification_photo_confirmed: boolean;
  verification_submitted_at: string | null;
  verification_note: string | null;
  verification_checks?: VerificationChecksPayload | null | undefined;
  role: UserRole;
  is_suspended: boolean;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface PublicSellerProfileRecord {
  id: string;
  full_name: string;
  username: string;
  profile_image: string | null;
  bio: string;
  account_type: AccountType;
  primary_university_id: string | null;
  verification_status: VerificationStatus;
  preferred_contact_method: string;
  public_contact_handle: string | null;
  is_suspended: boolean;
  created_at: string;
}

export interface UserUniversityRecord {
  id: string;
  user_id: string;
  university_id: string;
  affiliation_type: AffiliationType;
  is_primary: boolean;
  created_at: string;
  university?: UniversityRecord | undefined;
}

export interface SearchListingRow {
  id: string;
  seller_id: string;
  seller_name: string;
  seller_username: string;
  seller_verification: VerificationStatus;
  primary_university_name: string;
  listing_type: ListingType;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  price: number | null;
  price_type: PriceType;
  currency: string;
  status: ListingStatus;
  condition: string | null;
  location: string;
  contact_method: string;
  contact_value: string;
  audience_scope: AudienceScope;
  audience_universities: string[];
  images: Array<{ id: string; image_url: string; display_order: number }>;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  favorite_count: number;
  contact_click_count: number;
  published_at: string | null;
  created_at: string;
  total_count: number;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ReportRecord {
  id: string;
  reporter_id: string | null;
  listing_id: string | null;
  reported_user_id: string | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  moderation_note: string | null;
  created_at: string;
}

export interface PromotionConfigRecord {
  id: string;
  plan_key: string;
  name: string;
  description: string;
  target_scope: string;
  duration_days: number;
  suggested_fee_ghs: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SellerAnalyticsResponse {
  range: "today" | "7d" | "30d" | "all";
  active_listings: number;
  total_views: number;
  contact_clicks: number;
  saved_listings: number;
  top_listings: Array<{
    id: string;
    title: string;
    listing_type: ListingType;
    status: ListingStatus;
    views: number;
    clicks: number;
    saves: number;
  }>;
  recent_activity: Array<{
    id: string;
    listing_id: string;
    kind: "view" | "contact";
    text: string;
    occurred_at: string;
  }>;
}

export interface AdminDashboardSummary {
  total_sellers: number;
  active_listings: number;
  total_products: number;
  total_services: number;
  open_reports: number;
  suspended_accounts: number;
  total_contact_clicks: number;
  university_distribution: Array<{
    id: string;
    short_name: string;
    university_name: string;
    targeted_listings: number;
  }>;
}
