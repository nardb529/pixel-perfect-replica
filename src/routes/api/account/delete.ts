import { createFileRoute } from "@tanstack/react-router";

const USER_BUCKETS = ["profile-images", "listing-images", "seller-verifications"] as const;

export const Route = createFileRoute("/api/account/delete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { authenticateBearerUser, getServerSupabaseAdmin, jsonResponse } =
          await import("@/lib/server/push");

        const adminClient = getServerSupabaseAdmin();
        if (!adminClient) {
          return jsonResponse({ error: "Account service is not configured on this server." }, 500);
        }

        const authResult = await authenticateBearerUser(request, adminClient);
        if (!authResult.user) {
          return jsonResponse({ error: authResult.error || "Unauthorized." }, 401);
        }
        const userId = authResult.user.id;

        let body: { confirm?: unknown } = {};
        try {
          body = (await request.json()) as { confirm?: unknown };
        } catch {
          return jsonResponse({ error: "Invalid request." }, 400);
        }
        if (body.confirm !== "DELETE") {
          return jsonResponse({ error: "Confirmation text is missing." }, 400);
        }

        // Admin accounts are protected: they own audit records and must be removed by hand.
        const { data: profile } = await adminClient
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        if (profile?.role === "admin") {
          return jsonResponse({ error: "Administrator accounts cannot be deleted here." }, 403);
        }

        // Remove the user's files first (best effort), then the account itself.
        for (const bucket of USER_BUCKETS) {
          try {
            for (let round = 0; round < 20; round += 1) {
              const { data: files } = await adminClient.storage
                .from(bucket)
                .list(userId, { limit: 100 });
              if (!files || files.length === 0) break;
              await adminClient.storage
                .from(bucket)
                .remove(files.map((f) => `${userId}/${f.name}`));
              if (files.length < 100) break;
            }
          } catch {
            // Ignore: leftover files must not block account deletion.
          }
        }

        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) {
          return jsonResponse(
            { error: "Could not delete the account right now. Please try again." },
            500,
          );
        }

        return jsonResponse({ ok: true, deleted: true });
      },
    },
  },
});
