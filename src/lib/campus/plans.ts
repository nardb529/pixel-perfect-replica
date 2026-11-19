import type { SubscriptionTier } from "@/lib/supabase/database.types";

export const SUBSCRIPTION_LAUNCH_DATE_ISO = "2026-12-01T00:00:00.000Z";
export const SUBSCRIPTION_LAUNCH_LABEL = "1st December, 2026";

export const PRE_LAUNCH_LIMITS = {
  maxListings: 5,
  maxImagesPerListing: 3,
} as const;

export const SPECIAL_OFFER_PHONE = "0530311667";
export const SPECIAL_OFFER_TEL_HREF = "tel:+233530311667";
export const SPECIAL_OFFER_WHATSAPP_HREF =
  "https://wa.me/233530311667?text=Hi%20CampusLoop%2C%20I%27d%20like%20to%20enquire%20about%20a%20special%20seller%20subscription%20offer.";

export interface SellerSubscriptionPlan {
  id: Exclude<SubscriptionTier, "free_launch">;
  name: string;
  priceGhs: number;
  maxListings: number;
  maxImagesPerListing: number;
  summary: string;
  features: string[];
  recommended?: boolean | undefined;
}

export const SELLER_PLANS: SellerSubscriptionPlan[] = [
  {
    id: "standard",
    name: "Standard",
    priceGhs: 15,
    maxListings: 5,
    maxImagesPerListing: 2,
    summary: "All features and up to 5 product uploads",
    features: [
      "Full storefront shop link & verified badge",
      "Up to 5 product & service uploads",
      "Maximum of 2 photos per listing",
      "WhatsApp & direct buyer contact tracking",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    priceGhs: 25,
    maxListings: 10,
    maxImagesPerListing: 3,
    recommended: true,
    summary: "All features and up to 10 product uploads",
    features: [
      "Full storefront shop link & verified badge",
      "Up to 10 product & service uploads",
      "Maximum of 3 photos per listing",
      "Multi-campus targeting & priority discovery",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceGhs: 35,
    maxListings: 20,
    maxImagesPerListing: 5,
    summary: "All features and up to 20 product uploads",
    features: [
      "Full storefront shop link & verified badge",
      "Up to 20 product & service uploads",
      "Maximum of 5 photos per listing",
      "Highest catalog capacity for campus shops",
    ],
  },
];

export interface EffectiveSellerLimits {
  tier: SubscriptionTier | "admin";
  planLabel: string;
  maxListings: number;
  maxImagesPerListing: number;
  billingActive: boolean;
  requiresActivePlan: boolean;
}

export function isSubscriptionBillingLive(now: Date = new Date()): boolean {
  return now.getTime() >= Date.parse(SUBSCRIPTION_LAUNCH_DATE_ISO);
}

export function getSellerPlanById(
  tier?: SubscriptionTier | string | null,
): SellerSubscriptionPlan | undefined {
  return SELLER_PLANS.find((plan) => plan.id === tier);
}

export function getSellerEffectiveLimits(
  seller?: {
    role?: string | undefined;
    subscriptionTier?: SubscriptionTier | null | undefined;
    subscriptionStatus?: string | null | undefined;
    subscriptionExpiresAt?: string | null | undefined;
  } | null,
  now: Date = new Date(),
): EffectiveSellerLimits {
  if (seller?.role === "admin") {
    return {
      tier: "admin",
      planLabel: "Administrator",
      maxListings: 100,
      maxImagesPerListing: 5,
      billingActive: false,
      requiresActivePlan: false,
    };
  }

  const billingActive = isSubscriptionBillingLive(now);

  if (!billingActive) {
    return {
      tier: "free_launch",
      planLabel: "Launch Access (Free until 1 Dec 2026)",
      maxListings: PRE_LAUNCH_LIMITS.maxListings,
      maxImagesPerListing: PRE_LAUNCH_LIMITS.maxImagesPerListing,
      billingActive: false,
      requiresActivePlan: false,
    };
  }

  const expiresMs = seller?.subscriptionExpiresAt ? Date.parse(seller.subscriptionExpiresAt) : NaN;
  const hasPaidPlan =
    seller?.subscriptionStatus === "active" &&
    (!Number.isFinite(expiresMs) || expiresMs > now.getTime()) &&
    (seller?.subscriptionTier === "standard" ||
      seller?.subscriptionTier === "plus" ||
      seller?.subscriptionTier === "pro");

  if (hasPaidPlan) {
    const plan = getSellerPlanById(seller?.subscriptionTier)!;
    return {
      tier: plan.id,
      planLabel: `${plan.name} (GH₵ ${plan.priceGhs}/mo)`,
      maxListings: plan.maxListings,
      maxImagesPerListing: plan.maxImagesPerListing,
      billingActive: true,
      requiresActivePlan: false,
    };
  }

  return {
    tier: "free_launch",
    planLabel: "No active seller plan",
    maxListings: 0,
    maxImagesPerListing: 0,
    billingActive: true,
    requiresActivePlan: true,
  };
}
