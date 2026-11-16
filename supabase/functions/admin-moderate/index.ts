// Supabase Edge Function: admin-moderate
// Server-verified admin moderation with audit logging and seller notifications

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AdminAction =
  | { action: "moderate_listing"; listingId: string; status: string; note?: string }
  | { action: "toggle_featured"; listingId: string; featured: boolean }
  | { action: "suspend_user"; userId: string; suspended: boolean; note?: string }
  | { action: "resolve_report"; reportId: string; status: string; note?: string };

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase credentials unavailable" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("id, role, is_suspended")
      .eq("id", user.id)
      .maybeSingle();

    if (!callerProfile || callerProfile.role !== "admin" || callerProfile.is_suspended) {
      return new Response(JSON.stringify({ error: "Administrator privileges required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as AdminAction;

    if (payload.action === "moderate_listing") {
      const { data: listing } = await adminClient
        .from("listings")
        .select("id, seller_id, title")
        .eq("id", payload.listingId)
        .maybeSingle();
      if (!listing) {
        return new Response(JSON.stringify({ error: "Listing not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient
        .from("listings")
        .update({ status: payload.status })
        .eq("id", payload.listingId);

      await adminClient.from("moderation_logs").insert({
        admin_id: user.id,
        action: `listing_status_${payload.status.toLowerCase()}`,
        target_type: "listing",
        target_id: payload.listingId,
        notes: payload.note ?? null,
      });

      await adminClient.from("notifications").insert({
        user_id: listing.seller_id,
        title: payload.status === "Active" ? "Listing approved" : "Listing status updated",
        message: `"${listing.title}" is now ${payload.status}.${payload.note ? ` Note: ${payload.note}` : ""}`,
        notification_type: payload.status === "Rejected" ? "listing_rejected" : "listing_approved",
      });
    } else if (payload.action === "toggle_featured") {
      await adminClient
        .from("listings")
        .update({ is_featured: payload.featured })
        .eq("id", payload.listingId);

      await adminClient.from("moderation_logs").insert({
        admin_id: user.id,
        action: payload.featured ? "feature_listing" : "unfeature_listing",
        target_type: "listing",
        target_id: payload.listingId,
      });
    } else if (payload.action === "suspend_user") {
      if (payload.userId === user.id) {
        return new Response(JSON.stringify({ error: "Cannot suspend your own admin account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await adminClient
        .from("profiles")
        .update({ is_suspended: payload.suspended })
        .eq("id", payload.userId);

      if (payload.suspended) {
        await adminClient
          .from("listings")
          .update({ status: "Paused" })
          .eq("seller_id", payload.userId)
          .eq("status", "Active");
      }

      await adminClient.from("moderation_logs").insert({
        admin_id: user.id,
        action: payload.suspended ? "suspend_user" : "restore_user",
        target_type: "profile",
        target_id: payload.userId,
        notes: payload.note ?? null,
      });
    } else if (payload.action === "resolve_report") {
      await adminClient
        .from("reports")
        .update({
          status: payload.status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          moderation_note: payload.note ?? null,
        })
        .eq("id", payload.reportId);

      await adminClient.from("moderation_logs").insert({
        admin_id: user.id,
        action: `report_${payload.status}`,
        target_type: "report",
        target_id: payload.reportId,
        notes: payload.note ?? null,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Moderation failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
