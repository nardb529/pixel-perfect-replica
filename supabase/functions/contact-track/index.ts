// Supabase Edge Function: contact-track
// Controlled contact action + click rate-limiting & analytics tracking (uses service-role server-side only)

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

function sanitizeWhatsAppDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) {
    return "233" + digits.slice(1);
  }
  return digits;
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
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase service credentials not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as {
      listingId?: string;
      contactMethod?: string;
      universityId?: string | null;
      visitorSessionId?: string;
    };

    const listingId = body.listingId?.trim();
    const contactMethod = body.contactMethod?.trim() || "WhatsApp";
    const universityId = body.universityId || null;
    const visitorSessionId = body.visitorSessionId?.trim() || "anon-session";

    if (!listingId) {
      return new Response(JSON.stringify({ error: "listingId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: listing, error: listingErr } = await adminClient
      .from("listings")
      .select("id, seller_id, title, status, contact_method, contact_value")
      .eq("id", listingId)
      .eq("status", "Active")
      .maybeSingle();

    if (listingErr || !listing) {
      return new Response(JSON.stringify({ error: "Active listing not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: recentClicks } = await adminClient
      .from("contact_clicks")
      .select("id")
      .eq("listing_id", listingId)
      .eq("visitor_session_id", visitorSessionId)
      .eq("contact_method", contactMethod)
      .gte("clicked_at", new Date(Date.now() - 60_000).toISOString())
      .limit(1);

    let recorded = false;
    if (!recentClicks || recentClicks.length === 0) {
      const { error: insertErr } = await adminClient.from("contact_clicks").insert({
        listing_id: listing.id,
        seller_id: listing.seller_id,
        contact_method: contactMethod,
        university_id: universityId,
        visitor_session_id: visitorSessionId,
      });

      if (!insertErr) {
        recorded = true;
        await adminClient.rpc("record_contact_click", {
          p_listing_id: listing.id,
          p_contact_method: contactMethod,
          p_university_id: universityId,
          p_visitor_session_id: `${visitorSessionId}:edge`,
        });
      }
    }

    const contactValue = String(listing.contact_value || "").trim();
    const digits = sanitizeWhatsAppDigits(contactValue);
    const enquiryText = `Hi, I saw "${listing.title}" on CampusLoop. Is it still available?`;

    return new Response(
      JSON.stringify({
        recorded,
        contactMethod: listing.contact_method,
        contactValue,
        whatsappUrl: digits
          ? `https://wa.me/${digits}?text=${encodeURIComponent(enquiryText)}`
          : null,
        phoneHref: digits ? `tel:+${digits}` : null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
