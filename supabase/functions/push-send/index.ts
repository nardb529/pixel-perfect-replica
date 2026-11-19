// Supabase Edge Function: push-send
// Dispatches encrypted Web Push notifications to devices even when the PWA/browser is closed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import webpush from "npm:web-push@3.6.7";

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

interface PushRequestBody {
  userIds?: string[];
  title?: string;
  message?: string;
  url?: string;
  tag?: string;
}

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
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:support@campusloop.app";

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase credentials unavailable" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return new Response(
      JSON.stringify({ ok: false, skipped: true, reason: "VAPID keys not configured yet" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
    const token = authHeader.slice(7).trim();
    const isServiceCaller = token === serviceRoleKey;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let callerId: string | null = null;
    let isAdmin = isServiceCaller;

    if (!isServiceCaller) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      });
      const {
        data: { user },
        error: userErr,
      } = await userClient.auth.getUser();
      if (userErr || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      callerId = user.id;
      const { data: callerProfile } = await adminClient
        .from("profiles")
        .select("role, is_suspended")
        .eq("id", user.id)
        .maybeSingle();
      isAdmin = callerProfile?.role === "admin" && !callerProfile?.is_suspended;
    }

    const body = (await req.json()) as PushRequestBody;
    const requestedIds = Array.isArray(body.userIds) ? body.userIds.filter(Boolean) : [];
    const targetIds = isAdmin
      ? requestedIds
      : callerId
        ? requestedIds.filter((id) => id === callerId)
        : [];

    if (targetIds.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: subs, error: subErr } = await adminClient
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .in("user_id", targetIds);

    if (subErr) throw new Error(subErr.message);
    if (!subs?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const payloadJson = JSON.stringify({
      title: (body.title || "CampusLoop").slice(0, 120),
      message: (body.message || "You have a new marketplace alert.").slice(0, 320),
      url: body.url || "/dashboard",
      tag: body.tag || `cl-${Date.now()}`,
    });

    let sent = 0;
    const expiredIds: string[] = [];

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payloadJson,
          );
          sent += 1;
        } catch (pushErr: unknown) {
          const statusCode =
            pushErr && typeof pushErr === "object" && "statusCode" in pushErr
              ? Number((pushErr as { statusCode?: number }).statusCode)
              : 0;
          if (statusCode === 404 || statusCode === 410) {
            expiredIds.push(String(sub.id));
          }
        }
      }),
    );

    if (expiredIds.length > 0) {
      await adminClient.from("push_subscriptions").delete().in("id", expiredIds);
    }

    return new Response(JSON.stringify({ ok: true, sent, pruned: expiredIds.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("push-send unhandled error:", err);
    return new Response(JSON.stringify({ error: "Failed to dispatch notifications" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
