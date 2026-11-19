import { getSessionUser, getSupabaseClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputBuffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(outputBuffer);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window
  );
}

export async function showDeviceNotification(input: {
  title: string;
  body: string;
  url?: string | undefined;
  tag?: string | undefined;
}): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  const options: NotificationOptions & { renotify?: boolean } = {
    body: input.body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    tag: input.tag || "campusloop-alert",
    renotify: true,
    data: { url: input.url || "/dashboard" },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && typeof reg.showNotification === "function") {
        await reg.showNotification(input.title, options);
        return true;
      }
    }
  } catch {
    // Fallback to window Notification below
  }

  try {
    new Notification(input.title, options);
    return true;
  } catch {
    return false;
  }
}

export async function syncPushSubscriptionForCurrentUser(): Promise<{
  subscribed: boolean;
  reason?: string;
}> {
  if (!isPushSupported()) {
    return { subscribed: false, reason: "unsupported" };
  }
  if (Notification.permission !== "granted") {
    return { subscribed: false, reason: "permission_not_granted" };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { subscribed: false, reason: "backend_unconfigured" };
  }

  const user = await getSessionUser(client);
  if (!user) {
    return { subscribed: false, reason: "unauthenticated" };
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    const vapidKey =
      typeof import.meta !== "undefined" && import.meta.env?.["VITE_VAPID_PUBLIC_KEY"]
        ? String(import.meta.env["VITE_VAPID_PUBLIC_KEY"]).trim()
        : "";

    let subscription = await reg.pushManager.getSubscription();
    if (!subscription && vapidKey) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    if (!subscription) {
      return { subscribed: false, reason: vapidKey ? "subscribe_failed" : "missing_vapid_key" };
    }

    const json = subscription.toJSON();
    const endpoint = json.endpoint;
    const p256dh = json.keys?.["p256dh"];
    const auth = json.keys?.["auth"];
    if (!endpoint || !p256dh || !auth) {
      return { subscribed: false, reason: "invalid_keys" };
    }

    const { error } = await client.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint,
        p256dh,
        auth,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,endpoint" },
    );

    if (error) {
      return { subscribed: false, reason: error.message };
    }

    return { subscribed: true };
  } catch {
    return { subscribed: false, reason: "subscription_error" };
  }
}

export async function removePushSubscriptionForCurrentUser(): Promise<void> {
  if (!isPushSupported()) return;
  const client = getSupabaseClient();
  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return;
    if (client) {
      const user = await getSessionUser(client).catch(() => null);
      if (user) {
        await client
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", subscription.endpoint);
      }
    }
    await subscription.unsubscribe().catch(() => undefined);
  } catch {
    // Best-effort cleanup
  }
}
