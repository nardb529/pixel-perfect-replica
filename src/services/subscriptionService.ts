import { getSessionUser, getSupabaseClient, requireSupabase } from "@/lib/supabase/client";
import { isSubscriptionBillingLive } from "@/lib/campus/plans";
import { UserInputError } from "@/lib/campus/data";
import type { SellerSubscriptionRecord, SubscriptionTier } from "@/lib/supabase/database.types";

export const subscriptionService = {
  async listMySubscriptions(): Promise<SellerSubscriptionRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const user = await getSessionUser(client);
    if (!user) return [];

    const { data, error } = await client
      .from("seller_subscriptions")
      .select(
        "id, user_id, plan_tier, amount_ghs, currency, status, paystack_reference, paystack_authorization_url, starts_at, expires_at, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) return [];
    return (data || []) as SellerSubscriptionRecord[];
  },

  async initializePaystackCheckout(planTier: Exclude<SubscriptionTier, "free_launch">): Promise<{
    authorizationUrl: string;
    reference: string;
  }> {
    if (!isSubscriptionBillingLive()) {
      throw new UserInputError(
        "Seller subscriptions launch on 1st December, 2026. Enjoy free access (up to 5 listings) until then, or call/WhatsApp 0530311667 for a special offer.",
      );
    }

    const supabase = requireSupabase();
    const callbackUrl =
      typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;

    const { data, error } = await supabase.functions.invoke("paystack-init", {
      body: {
        planTier,
        ...(callbackUrl ? { callbackUrl } : {}),
      },
    });

    if (error) {
      throw new UserInputError(
        "Online Paystack checkout is being finalized. Contact 0530311667 for immediate manual activation or a special offer.",
      );
    }

    const payload = data as {
      authorization_url?: string;
      reference?: string;
      error?: string;
    } | null;
    if (!payload?.authorization_url) {
      throw new UserInputError(
        payload?.error ||
          "Online Paystack checkout is being finalized. Contact 0530311667 for assistance.",
      );
    }

    return {
      authorizationUrl: payload.authorization_url,
      reference: payload.reference || "",
    };
  },
};
