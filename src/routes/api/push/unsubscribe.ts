import { createFileRoute } from "@tanstack/react-router";

interface UnsubscribePayload {
  endpoint?: unknown;
}

export const Route = createFileRoute("/api/push/unsubscribe")({
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

        let body: UnsubscribePayload;
        try {
          body = (await request.json()) as UnsubscribePayload;
        } catch {
          return jsonResponse({ error: "Invalid JSON request body." }, 400);
        }

        if (!isValidPushEndpoint(body.endpoint)) {
          return jsonResponse({ error: "Valid push endpoint is required." }, 400);
        }

        const { error } = await adminClient
          .from("push_subscriptions")
          .delete()
          .eq("user_id", authResult.user.id)
          .eq("endpoint", body.endpoint.trim());

        if (error) {
          return jsonResponse({ error: "Failed to remove device subscription." }, 500);
        }

        return jsonResponse({ ok: true, unsubscribed: true });
      },
    },
  },
});
