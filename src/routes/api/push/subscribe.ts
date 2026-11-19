import { createFileRoute } from "@tanstack/react-router";

interface SubscribePayload {
  endpoint?: unknown;
  p256dh?: unknown;
  auth?: unknown;
}

export const Route = createFileRoute("/api/push/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          authenticateBearerUser,
          getServerSupabaseAdmin,
          isValidPushEndpoint,
          jsonResponse,
        } = await import("@/lib/server/push");

        const adminClient = getServerSupabaseAdmin();
        if (!adminClient) {
          return jsonResponse({ error: "Push service is not configured on this server." }, 500);
        }

        const authResult = await authenticateBearerUser(request, adminClient);
        if (!authResult.user) {
          return jsonResponse({ error: authResult.error || "Unauthorized." }, 401);
        }

        let body: SubscribePayload;
        try {
          body = (await request.json()) as SubscribePayload;
        } catch {
          return jsonResponse({ error: "Invalid JSON request body." }, 400);
        }

        const endpoint = body.endpoint;
        const p256dh = typeof body.p256dh === "string" ? body.p256dh.trim() : "";
        const auth = typeof body.auth === "string" ? body.auth.trim() : "";

        if (!isValidPushEndpoint(endpoint) || !p256dh || !auth) {
          return jsonResponse({ error: "Valid push subscription keys are required." }, 400);
        }

        const { error } = await adminClient.from("push_subscriptions").upsert(
          {
            user_id: authResult.user.id,
            endpoint: endpoint.trim(),
            p256dh,
            auth,
          },
          { onConflict: "endpoint" },
        );

        if (error) {
          return jsonResponse({ error: "Failed to save device subscription." }, 500);
        }

        return jsonResponse({ ok: true, subscribed: true });
      },
    },
  },
});
