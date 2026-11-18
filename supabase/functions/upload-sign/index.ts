// Supabase Edge Function: upload-sign
// Validates image type/size and issues scoped signed upload URLs

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

const ALLOWED_BUCKETS = new Set([
  "listing-images",
  "profile-images",
  "university-logos",
  "seller-verifications",
]);
const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

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
    return new Response(JSON.stringify({ error: "Authentication required" }), {
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

    let body: {
      bucket?: string;
      mimeType?: string;
      fileSize?: number;
      extension?: string;
    };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bucket = body.bucket || "listing-images";
    const mimeType = body.mimeType || "";
    const fileSize = Number(body.fileSize || 0);

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return new Response(JSON.stringify({ error: "Invalid bucket" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (
      !IMAGE_MIME_TYPES.has(mimeType) ||
      (bucket !== "university-logos" && mimeType === "image/svg+xml")
    ) {
      return new Response(JSON.stringify({ error: "Unsupported image format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ext = MIME_TO_EXT[mimeType] || "jpg";

    const maxBytes = bucket === "university-logos" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > maxBytes) {
      return new Response(JSON.stringify({ error: "Image exceeds file size limit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role, is_suspended")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_suspended) {
      return new Response(JSON.stringify({ error: "Suspended accounts cannot upload media" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (bucket === "university-logos" && profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin role required for university logos" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const objectPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await adminClient.storage
      .from(bucket)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      console.error("upload-sign createSignedUploadUrl error:", error);
      return new Response(JSON.stringify({ error: "Failed to prepare image upload" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isPrivateBucket = bucket === "seller-verifications";
    const publicUrl = isPrivateBucket
      ? null
      : adminClient.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;

    return new Response(
      JSON.stringify({
        path: objectPath,
        token: data.token,
        signedUrl: data.signedUrl,
        publicUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("upload-sign unhandled error:", err);
    return new Response(JSON.stringify({ error: "Upload preparation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
