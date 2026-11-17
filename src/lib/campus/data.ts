import type {
  AudienceScope,
  ListingStatus,
  PriceType,
  VerificationStatus,
} from "@/lib/supabase/database.types";

export const BRAND = "CampusLoop";

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

export function filterListings(
  listings: Listing[],
  university: string,
  query = "",
  type?: string,
  category = "All",
  maxPrice = Infinity,
) {
  return listings.filter(
    (l) =>
      l.status === "Active" &&
      (university === "All Universities" ||
        l.audience.includes("All Universities") ||
        l.audience.includes(university)) &&
      (!type || l.type === type) &&
      (category === "All" || l.category === category) &&
      l.price <= maxPrice &&
      `${l.title} ${l.seller} ${l.category} ${l.description} ${l.university} ${l.audience.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
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
}) {
  if (!values.images.length) return "Add at least one image.";
  if (values.images.length > 8) return "Upload up to 8 images per listing.";
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
