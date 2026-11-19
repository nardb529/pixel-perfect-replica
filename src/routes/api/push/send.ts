import { createFileRoute } from "@tanstack/react-router";

type AudienceScope = "all" | "verified" | "university" | "single";
type NotificationKind = "platform_announcement" | "account_update" | "listing_approved";

interface SendPushPayload {
  title?: unknown;
  message?: unknown;
  body?: unknown;
  url?: unknown;
  audience?: unknown;
  universityId?: unknown;
  userId?: unknown;
  userIds?: unknown;
  notificationType?: unknown;
  scopeLabel?: unknown;
  skipInAppInsert?: unknown;
  tag?: unknown;
}

const VALID_NOTIFICATION_TYPES = new Set<NotificationKind>([
  "platform_announcement",
  "account_update",
  "listing_approved",
]);

export const Route = createFileRoute("/api/push/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          authenticateBearerUser,
          configureVapid,
          getServerSupabaseAdmin,
          jsonResponse,
          normalizeSafePageUrl,
          requireActiveAdmin,
          sendNotification,
        } = await import("@/lib/server/push");

        const adminClient = getServerSupabaseAdmin();
        if (!adminClient) {
          return jsonResponse({ error: "Push service is not configured on this server." }, 500);
        }

        const authResult = await authenticateBearerUser(request, adminClient);
        if (!authResult.user) {
          return jsonResponse({ error: authResult.error || "Unauthorized." }, 401);
        }

        const isAdmin = await requireActiveAdmin(adminClient, authResult.user.id);
        if (!isAdmin) {
          return jsonResponse({ error: "Administrator permission required." }, 403);
        }

        let payload: SendPushPayload;
        try {
          payload = (await request.json()) as SendPushPayload;
        } catch {
          return jsonResponse({ error: "Invalid JSON request body." }, 400);
        }

        const title = typeof payload.title === "string" ? payload.title.trim() : "";
        const messageRaw =
          typeof payload.message === "string"
            ? payload.message
            : typeof payload.body === "string"
              ? payload.body
              : "";
        const message = messageRaw.trim();
        const url = normalizeSafePageUrl(payload.url);

        if (!title || !message) {
          return jsonResponse({ error: "Title and message are required." }, 400);
        }
        if (title.length > 120 || message.length > 500) {
          return jsonResponse(
            { error: "Title must be <= 120 chars and message <= 500 chars." },
            400,
          );
        }

        const rawType =
          typeof payload.notificationType === "string" ? payload.notificationType : "";
        const notificationType: NotificationKind = VALID_NOTIFICATION_TYPES.has(
          rawType as NotificationKind,
        )
          ? (rawType as NotificationKind)
          : "platform_announcement";

        const audience =
          typeof payload.audience === "string" ? (payload.audience as AudienceScope) : undefined;
        let targetUserIds: string[] = [];

        if (audience === "all") {
          const { data, error } = await adminClient
            .from("profiles")
            .select("id")
            .eq("is_suspended", false);
          if (error) return jsonResponse({ error: "Failed to resolve recipients." }, 500);
          targetUserIds = (data || []).map((r) => String(r.id));
        } else if (audience === "verified") {
          const { data, error } = await adminClient
            .from("profiles")
            .select("id")
            .eq("is_suspended", false)
            .eq("verification_status", "verified");
          if (error) return jsonResponse({ error: "Failed to resolve verified recipients." }, 500);
          targetUserIds = (data || []).map((r) => String(r.id));
        } else if (audience === "university") {
          const uniId = typeof payload.universityId === "string" ? payload.universityId.trim() : "";
          if (!uniId) {
            return jsonResponse(
              { error: "University ID is required for university audience." },
              400,
            );
          }
          const { data, error } = await adminClient
            .from("profiles")
            .select("id")
            .eq("is_suspended", false)
            .eq("primary_university_id", uniId);
          if (error) return jsonResponse({ error: "Failed to resolve campus recipients." }, 500);
          targetUserIds = (data || []).map((r) => String(r.id));
        } else if (audience === "single") {
          const singleId = typeof payload.userId === "string" ? payload.userId.trim() : "";
          if (!singleId) {
            return jsonResponse({ error: "User ID is required for single user audience." }, 400);
          }
          targetUserIds = [singleId];
        } else if (Array.isArray(payload.userIds)) {
          targetUserIds = Array.from(
            new Set(
              payload.userIds
                .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
                .map((id) => id.trim()),
            ),
          );
        }

        if (targetUserIds.length === 0) {
          return jsonResponse({
            ok: true,
            recipientCount: 0,
            deliveredDevices: 0,
            failedDevices: 0,
            pruned: 0,
            url,
          });
        }

        if (payload.skipInAppInsert !== true) {
          const scopeLabel =
            typeof payload.scopeLabel === "string" && payload.scopeLabel.trim()
              ? payload.scopeLabel.trim()
              : audience || "broadcast";
          const inAppRows = targetUserIds.map((uid) => ({
            user_id: uid,
            title,
            message,
            notification_type: notificationType,
            metadata: { scope: scopeLabel, url },
          }));
          const { error: notifErr } = await adminClient.from("notifications").insert(inAppRows);
          if (notifErr) {
            return jsonResponse({ error: "Failed to create in-app notifications." }, 500);
          }
        }

        const { data: subs, error: subsErr } = await adminClient
          .from("push_subscriptions")
          .select("id, endpoint, p256dh, auth")
          .in("user_id", targetUserIds);

        if (subsErr) {
          return jsonResponse({ error: "Failed to query device subscriptions." }, 500);
        }

        const vapid = configureVapid();
        if (!vapid.ready) {
          return jsonResponse({
            ok: true,
            recipientCount: targetUserIds.length,
            deliveredDevices: 0,
            failedDevices: 0,
            pruned: 0,
            vapidConfigured: false,
            url,
          });
        }

        if (!subs || subs.length === 0) {
          return jsonResponse({
            ok: true,
            recipientCount: targetUserIds.length,
            deliveredDevices: 0,
            failedDevices: 0,
            pruned: 0,
            vapidConfigured: true,
            url,
          });
        }

        const pushBody = JSON.stringify({
          title,
          body: message,
          url,
          tag:
            typeof payload.tag === "string" && payload.tag.trim()
              ? payload.tag.trim()
              : `cl-${Date.now()}`,
        });

        let deliveredDevices = 0;
        let failedDevices = 0;
        const expiredIds: string[] = [];

        await Promise.all(
          subs.map(async (sub) => {
            try {
              await sendNotification(
                {
                  endpoint: sub.endpoint,
                  keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                  },
                },
                pushBody,
              );
              deliveredDevices += 1;
            } catch (pushErr: unknown) {
              failedDevices += 1;
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

        await adminClient.from("moderation_logs").insert({
          admin_id: authResult.user.id,
          action: "platform_broadcast",
          target_type: "notifications",
          target_id: authResult.user.id,
          notes: `${title} → ${targetUserIds.length} recipient(s), ${deliveredDevices} device(s)`,
        });

        return jsonResponse({
          ok: true,
          recipientCount: targetUserIds.length,
          deliveredDevices,
          failedDevices,
          pruned: expiredIds.length,
          vapidConfigured: true,
          url,
        });
      },
    },
  },
});
