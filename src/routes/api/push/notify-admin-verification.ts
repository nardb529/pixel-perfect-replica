import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/push/notify-admin-verification")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          authenticateBearerUser,
          chunkArray,
          dispatchWebPushBatch,
          getServerSupabaseAdmin,
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

        const { data: applicant, error: applicantErr } = await adminClient
          .from("profiles")
          .select("id, full_name, username, account_type, verification_status, id_document_type")
          .eq("id", authResult.user.id)
          .maybeSingle();

        if (applicantErr || !applicant) {
          return jsonResponse({ error: "Seller profile not found." }, 404);
        }

        if (applicant.verification_status !== "pending") {
          return jsonResponse({
            ok: true,
            skipped: true,
            reason: "Verification status is not pending admin review.",
          });
        }

        const { data: adminRows, error: adminsErr } = await adminClient
          .from("profiles")
          .select("id")
          .eq("role", "admin")
          .eq("is_suspended", false);

        if (adminsErr) {
          return jsonResponse({ error: "Failed to resolve platform administrators." }, 500);
        }

        const adminIds = Array.from(
          new Set((adminRows || []).map((row) => String(row.id)).filter(Boolean)),
        );

        if (adminIds.length === 0) {
          return jsonResponse({
            ok: true,
            adminCount: 0,
            deliveredDevices: 0,
          });
        }

        const applicantName = String(applicant.full_name || "A seller").trim();
        const usernameHandle = applicant.username ? ` (@${String(applicant.username).trim()})` : "";
        const docLabel =
          applicant.id_document_type === "Live Selfie"
            ? "live selfie"
            : String(applicant.id_document_type || "verification info");
        const roleLabel =
          applicant.account_type === "Service Provider" ? "service provider" : "seller";

        const title = "New seller verification submitted";
        const message = `${applicantName}${usernameHandle} submitted a ${docLabel} for ${roleLabel} approval.`;
        const targetUrl = "/admin";

        const inAppRows = adminIds.map((adminId) => ({
          user_id: adminId,
          title,
          message,
          notification_type: "account_update",
          metadata: {
            scope: "admin_verification_alert",
            url: targetUrl,
            applicantId: applicant.id,
          },
        }));

        for (const part of chunkArray(inAppRows, 500)) {
          await adminClient.from("notifications").insert(part);
        }

        try {
          const dispatchResult = await dispatchWebPushBatch(adminClient, adminIds, {
            title,
            message,
            url: targetUrl,
            tag: `cl-verify-${applicant.id}`,
          });

          return jsonResponse({
            ok: true,
            adminCount: adminIds.length,
            ...dispatchResult,
          });
        } catch {
          return jsonResponse({ error: "Failed to notify administrator devices." }, 500);
        }
      },
    },
  },
});
