import type {
  AudienceScope,
  ListingStatus,
  PriceType,
  VerificationStatus,
} from "@/lib/supabase/database.types";

export const BRAND = "CampusLoop";

export const TECHNICAL_ISSUE_MESSAGE =
  "Technical issue — it is being worked on. Please try again shortly.";

export class UserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserInputError";
  }
}

export function toUserSafeErrorMessage(err: unknown): string {
  if (err instanceof UserInputError && err.message.trim()) {
    return err.message;
  }

  const rawMessage =
    typeof err === "string"
      ? err
      : err instanceof Error
        ? err.message
        : err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message ?? "")
          : "";
  const rawCode =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: unknown }).code ?? "")
      : "";
  const normalized = rawMessage.toLowerCase();

  // Always mask PostgREST, SQL relation, JWT, and network transport failures behind generic copy
  const isTechnicalFault =
    rawCode.startsWith("PGRST") ||
    normalized.includes("pgrst") ||
    normalized.includes("relation ") ||
    normalized.includes("does not exist") ||
    normalized.includes("schema cache") ||
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("load failed") ||
    normalized.includes("supabase is not configured");

  if (!isTechnicalFault && rawMessage.trim()) {
    if (normalized.includes("invalid login credentials") || rawCode === "invalid_credentials") {
      return "Incorrect email or password. Please check your details and try again.";
    }
    if (normalized.includes("email not confirmed") || rawCode === "email_not_confirmed") {
      return "Please verify your email address using the confirmation link sent to your inbox before signing in.";
    }
    if (
      normalized.includes("user already registered") ||
      normalized.includes("already been registered") ||
      rawCode === "user_already_exists"
    ) {
      return "An account with this email already exists. Switch to Log In or reset your password.";
    }
    if (normalized.includes("password should be at least") || rawCode === "weak_password") {
      return "Choose a stronger password (at least 8 characters).";
    }
    if (
      normalized.includes("new password should be different") ||
      normalized.includes("same password")
    ) {
      return "Choose a new password that is different from your current password.";
    }
    if (
      normalized.includes("unable to validate email address") ||
      normalized.includes("invalid format") ||
      normalized.includes("valid email")
    ) {
      return "Enter a valid email address and try again.";
    }
    if (
      normalized.includes("rate limit") ||
      normalized.includes("too many requests") ||
      normalized.includes("only request this after") ||
      rawCode === "over_email_send_rate_limit" ||
      rawCode === "over_request_rate_limit"
    ) {
      return "Too many attempts right now. Please wait a minute and try again.";
    }
    if (
      normalized.includes("profiles_username_key") ||
      (rawCode === "23505" && normalized.includes("username"))
    ) {
      return "That username is already taken. Try adding a few numbers or initials.";
    }
    if (normalized.includes("listing_quota_reached")) {
      return "You have reached your current limit of 5 listings per account.";
    }
    if (normalized.includes("listing_subscription_required")) {
      return "An active seller plan (starting 1st December, 2026) is required before adding more listings.";
    }
    if (normalized.includes("listing_image_limit_reached")) {
      return "You have reached the maximum number of photos allowed per listing on your plan.";
    }
    if (
      normalized.includes("row-level security") ||
      normalized.includes("violates row-level") ||
      rawCode === "42501"
    ) {
      return "Your account is not allowed to do that yet. If you are publishing, finish seller verification first. If you are uploading a photo, sign out and back in, then try again.";
    }
    if (normalized.includes("bucket not found")) {
      return "Photo storage is not switched on yet. Please contact CampusLoop support so it can be fixed.";
    }
    if (
      normalized.includes("exceeded the maximum allowed size") ||
      normalized.includes("payload too large")
    ) {
      return "That photo is too large. Choose a smaller photo and try again.";
    }
    if (
      normalized.includes("mime type") ||
      normalized.includes("invalid mime") ||
      normalized.includes("not supported")
    ) {
      return "That photo format is not supported. Use a JPG, PNG or WebP photo.";
    }
    if (normalized.includes("auth session missing")) {
      return "Your session expired. Please sign in again to continue.";
    }
  }

  if (err !== undefined && err !== null) {
    console.error("[CampusLoop handled error]", err);
  }
  return TECHNICAL_ISSUE_MESSAGE;
}

export const universities = [
  "KNUST",
  "University of Ghana",
  "University of Cape Coast",
  "UPSA",
  "UEW",
  "UDS",
  "UMaT",
  "UENR",
  "GCTU",
  "UHAS",
  "UESD",
  "GIMPA",
  "ATU",
  "KsTU",
  "TTU",
  "Other institutions",
];

export const productCategories = [
  "Electronics",
  "Fashion",
  "Books & Academics",
  "Food & Groceries",
  "Beauty",
  "Hostel Essentials",
  "Sports",
  "Accessories",
  "Home and Living",
  "Others",
];

export const serviceCategories = [
  "Graphic Design",
  "Photography",
  "Hair & Beauty",
  "Technology & Repairs",
  "Tutoring",
  "Laundry",
  "Printing",
  "Food Services",
  "Transport",
  "Cleaning",
  "Events",
  "Others",
];

export const priceTypes: PriceType[] = [
  "Fixed",
  "Starting from",
  "Price range",
  "Negotiable",
  "Free",
];

export type Listing = {
  id: string;
  sellerId?: string | undefined;
  sellerUsername?: string | undefined;
  verificationStatus?: VerificationStatus | undefined;
  slug?: string | undefined;
  title: string;
  type: "product" | "service";
  category: string;
  categoryId?: string | undefined;
  price: number;
  priceType?: PriceType | undefined;
  currency?: string | undefined;
  image: string;
  images?: string[] | undefined;
  seller: string;
  university: string;
  audience: string[];
  audienceScope?: AudienceScope | undefined;
  description: string;
  condition?: string | undefined;
  brand?: string | undefined;
  stockStatus?: string | undefined;
  duration?: string | undefined;
  serviceArea?: string | undefined;
  deliveryMethod?: string | undefined;
  location?: string | undefined;
  time: string;
  status: "Active" | "Paused" | "Sold" | "Unavailable";
  rawStatus?: ListingStatus | undefined;
  views: number;
  likes: number;
  favoriteCount?: number | undefined;
  contactClicks?: number | undefined;
  featured?: boolean | undefined;
  ownerEmail?: string | undefined;
  contact?: string | undefined;
  contactMethod?: string | undefined;
  postedAt?: number | undefined;
};

export function isSafeMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("blob:")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function matchesCategoryFilter(listingCategory: string, selectedCategory: string): boolean {
  const target = selectedCategory.trim().toLowerCase();
  if (!target || target === "all") return true;
  const current = listingCategory.trim().toLowerCase();
  if (current === target) return true;
  if (target === "beauty" && current === "hair & beauty") return true;
  if (target === "hair & beauty" && current === "beauty") return true;
  return false;
}

export function filterListings(
  listings: Listing[],
  university: string,
  query = "",
  type?: string,
  category = "All",
  maxPrice = Infinity,
) {
  const q = query.trim().toLowerCase();
  return listings.filter(
    (l) =>
      l.status === "Active" &&
      (university === "All Universities" ||
        l.audience.includes("All Universities") ||
        l.audience.includes(university)) &&
      (!type || l.type === type) &&
      matchesCategoryFilter(l.category, category) &&
      l.price <= maxPrice &&
      (!q ||
        `${l.title} ${l.seller} ${l.category} ${l.description} ${l.university} ${l.audience.join(" ")}`
          .toLowerCase()
          .includes(q)),
  );
}

export function canManage(user: unknown) {
  return Boolean(user);
}

export function ownsListing(listing: Listing, identifier?: string) {
  if (!identifier) return false;
  return Boolean(
    (listing.ownerEmail && listing.ownerEmail === identifier) ||
    (listing.sellerId && listing.sellerId === identifier),
  );
}

export function validatePassword(password: string, confirm?: string) {
  if (password.length < 8) return "Use a password with at least 8 characters.";
  if (confirm !== undefined && password !== confirm)
    return "Your passwords don’t match. Please try again.";
  return "";
}

export function validateListing(values: {
  type: "product" | "service";
  title: string;
  description: string;
  price: string;
  priceType?: PriceType | undefined;
  images: string[];
  audience: string[];
  contact: string;
  maxImages?: number | undefined;
}) {
  const maxImages = values.maxImages ?? 3;
  if (!values.images.length) return "Add at least one image.";
  if (values.images.length > maxImages) {
    return `Upload up to ${maxImages} image${maxImages === 1 ? "" : "s"} per listing.`;
  }
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title || !description) return "Add a name and description.";
  if (title.length < 2 || title.length > 120) {
    return "Title must be between 2 and 120 characters.";
  }
  if (description.length < 10 || description.length > 3000) {
    return "Description must be between 10 and 3,000 characters.";
  }
  const isFree = values.priceType === "Free";
  const parsedPrice = Number(values.price);
  if (
    (!isFree && values.type === "product" && !values.price.trim()) ||
    (values.price.trim() &&
      (!Number.isFinite(parsedPrice) || parsedPrice < 0 || parsedPrice > 10_000_000))
  )
    return "Enter a valid price in GH₵.";
  if (!values.audience.length) return "Choose at least one university.";
  if (values.contact.trim().length < 5) return "Add valid contact details.";
  return "";
}

export const money = (amount: number) => `GH₵ ${amount.toLocaleString("en-GH")}`;

export function formatListingPrice(
  listing: Pick<Listing, "type" | "price"> & { priceType?: PriceType | undefined },
) {
  if (listing.priceType === "Free") {
    return "Free";
  }
  if (listing.type === "service" && (!listing.price || listing.price <= 0)) {
    return "Contact for pricing";
  }
  if (listing.priceType === "Negotiable") {
    return listing.price > 0 ? `${money(listing.price)} (Neg.)` : "Negotiable";
  }
  return money(listing.price);
}

export function normalizeGhanaPhoneDigits(raw?: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppUrl(contact?: string, message?: string): string | null {
  const digits = normalizeGhanaPhoneDigits(contact);
  if (digits.length < 9) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function buildPhoneHref(contact?: string): string | null {
  const digits = normalizeGhanaPhoneDigits(contact);
  if (digits.length < 9) return null;
  return `tel:+${digits}`;
}
