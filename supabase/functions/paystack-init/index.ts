// Supabase Edge Function: paystack-init
// Initializes a seller subscription transaction with Paystack (live billing begins 1st Dec 2026)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

const PLAN_PRICES_GHS: Record<string, number> = {
  standard: 15,
  plus: 25,
  pro: 35,
};

const SUBSCRIPTION_LAUNCH_UTC = Date.parse("2026-12-01T00:00:00.000Z");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (Date.now() < SUBSCRIPTION_LAUNCH_UTC) {
    return new Response(
      JSON.stringify({
        error:
          "Seller subscription billing launches on 1st December, 2026. Contact 0530311667 for a special early offer.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase credentials unavailable" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!paystackSecretKey) {
    return new Response(
      JSON.stringify({
        error: "Paystack secret key is not configured yet. Contact 0530311667 for support.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing authorization token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const {
      data: { user },
      error: authErr,
    } = await userClient.auth.getUser();
    if (authErr || !user || !user.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as { planTier?: string; callbackUrl?: string };
    const planTier = String(body.planTier || "").toLowerCase();
    const amountGhs = PLAN_PRICES_GHS[planTier];
    if (!amountGhs) {
      return new Response(JSON.stringify({ error: "Unsupported subscription plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reference = `cl_${planTier}_${user.id.slice(0, 8)}_${Date.now()}`;
    const initResp = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountGhs * 100,
        currency: "GHS",
        reference,
        callback_url: body.callbackUrl,
        metadata: {
          user_id: user.id,
          plan_tier: planTier,
          amount_ghs: amountGhs,
        },
      }),
    });

    const initJson = (await initResp.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };

    if (!initResp.ok || !initJson.status || !initJson.data?.authorization_url) {
      return new Response(
        JSON.stringify({ error: initJson.message || "Unable to start Paystack payment" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    await adminClient.from("seller_subscriptions").insert({
      user_id: user.id,
      plan_tier: planTier,
      amount_ghs: amountGhs,
      currency: "GHS",
      status: "pending",
      paystack_reference: reference,
      paystack_authorization_url: initJson.data.authorization_url,
    });

    return new Response(
      JSON.stringify({
        authorization_url: initJson.data.authorization_url,
        reference,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("paystack-init error:", err);
    return new Response(JSON.stringify({ error: "Payment initialization failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
