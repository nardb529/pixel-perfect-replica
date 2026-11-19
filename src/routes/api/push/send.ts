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

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

// PostgREST returns at most 1000 rows per request, so read recipients page by page.
async function collectProfileIds(
  adminClient: import("@supabase/supabase-js").SupabaseClient,
  filters: { verifiedOnly?: boolean; universityId?: string },
): Promise<string[]> {
  const ids = new Set<string>();
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    let query = adminClient
      .from("profiles")
      .select("id")
      .eq("is_suspended", false)
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (filters.verifiedOnly) query = query.eq("verification_status", "verified");
    if (filters.universityId) query = query.eq("primary_university_id", filters.universityId);
    const { data, error } = await query;
    if (error) throw error;
    const rows = data || [];
    for (const row of rows) ids.add(String(row.id));
    if (rows.length < pageSize) break;
  }
  return Array.from(ids);
}

async function collectUniversityMemberIds(
  adminClient: import("@supabase/supabase-js").SupabaseClient,
  universityId: string,
): Promise<string[]> {
  const ids = new Set<string>(await collectProfileIds(adminClient, { universityId }));
  const pageSize = 1000;
  const affiliated: string[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await adminClient
      .from("user_universities")
      .select("user_id")
      .eq("university_id", universityId)
      .order("user_id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    const rows = data || [];
    for (const row of rows) affiliated.push(String(row.user_id));
    if (rows.length < pageSize) break;
  }
  for (const part of chunk(affiliated, 100)) {
    const { data, error } = await adminClient
      .from("profiles")
      .select("id")
      .eq("is_suspended", false)
      .in("id", part);
    if (error) throw error;
    for (const row of data || []) ids.add(String(row.id));
  }
  return Array.from(ids);
}

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

        try {
          if (audience === "all") {
            targetUserIds = await collectProfileIds(adminClient, {});
          } else if (audience === "verified") {
            targetUserIds = await collectProfileIds(adminClient, { verifiedOnly: true });
          } else if (audience === "university") {
            const uniId =
              typeof payload.universityId === "string" ? payload.universityId.trim() : "";
            if (!uniId) {
              return jsonResponse(
                { error: "University ID is required for university audience." },
                400,
              );
            }
            targetUserIds = await collectUniversityMemberIds(adminClient, uniId);
          }
        } catch {
          return jsonResponse({ error: "Failed to resolve recipients." }, 500);
        }

        if (audience === "single") {
          const singleId = typeof payload.userId === "string" ? payload.userId.trim() : "";
          if (!singleId) {
            return jsonResponse({ error: "User ID is required for single user audience." }, 400);
          }
          targetUserIds = [singleId];
        } else if (
          audience !== "all" &&
          audience !== "verified" &&
          audience !== "university" &&
          Array.isArray(payload.userIds)
        ) {
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
          for (const part of chunk(inAppRows, 500)) {
            const { error: notifErr } = await adminClient.from("notifications").insert(part);
            if (notifErr) {
              return jsonResponse({ error: "Failed to create in-app notifications." }, 500);
            }
          }
        }

        const subs: Array<{ id: string; endpoint: string; p256dh: string; auth: string }> = [];
        for (const part of chunk(targetUserIds, 100)) {
          const { data: subRows, error: subsErr } = await adminClient
            .from("push_subscriptions")
            .select("id, endpoint, p256dh, auth")
            .in("user_id", part);
          if (subsErr) {
            return jsonResponse({ error: "Failed to query device subscriptions." }, 500);
          }
          for (const row of subRows || []) {
            subs.push({
              id: String(row.id),
              endpoint: String(row.endpoint),
              p256dh: String(row.p256dh),
              auth: String(row.auth),
            });
          }
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

        if (subs.length === 0) {
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

        for (const batch of chunk(subs, 50)) {
          await Promise.all(
            batch.map(async (sub) => {
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
        }

        if (expiredIds.length > 0) {
          for (const part of chunk(expiredIds, 100)) {
            await adminClient.from("push_subscriptions").delete().in("id", part);
          }
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
