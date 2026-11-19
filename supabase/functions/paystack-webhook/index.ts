// Supabase Edge Function: paystack-webhook
// Verifies Paystack HMAC-SHA512 webhook signatures and activates seller subscription tiers.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

async function verifyPaystackSignature(rawBody: string, signatureHeader: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.toLowerCase() === signatureHeader.trim().toLowerCase();
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  const signature = req.headers.get("x-paystack-signature") || "";

  if (!supabaseUrl || !serviceRoleKey || !paystackSecretKey || !signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawBody = await req.text();
  const valid = await verifyPaystackSignature(rawBody, signature, paystackSecretKey);
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        customer?: { customer_code?: string };
        metadata?: { user_id?: string; plan_tier?: string };
      };
    };

    if (event.event === "charge.success") {
      const reference = event.data?.reference;
      const userId = event.data?.metadata?.user_id;
      const planTier = event.data?.metadata?.plan_tier;
      const customerCode = event.data?.customer?.customer_code || null;

      if (reference && userId && planTier && ["standard", "plus", "pro"].includes(planTier)) {
        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false },
        });
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await adminClient
          .from("seller_subscriptions")
          .update({
            status: "active",
            starts_at: now.toISOString(),
            expires_at: expiresAt,
          })
          .eq("paystack_reference", reference);

        await adminClient
          .from("profiles")
          .update({
            subscription_tier: planTier,
            subscription_status: "active",
            subscription_expires_at: expiresAt,
            paystack_customer_code: customerCode,
            paystack_reference: reference,
          })
          .eq("id", userId);

        await adminClient.from("notifications").insert({
          user_id: userId,
          title: `CampusLoop ${planTier.toUpperCase()} plan active`,
          message:
            "Your monthly seller subscription is active. Enjoy your expanded storefront quota.",
          notification_type: "account_update",
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("paystack-webhook error:", err);
    return new Response("Webhook handling failed", { status: 500 });
  }
});
