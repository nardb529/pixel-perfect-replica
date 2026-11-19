import { getSessionUser, getSupabaseClient } from "@/lib/supabase/client";

export type PushNotificationState = "on" | "off" | "blocked" | "unsupported";

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

async function getReadyServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    await navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing?.active) return existing;
    return await Promise.race<ServiceWorkerRegistration | null>([
      navigator.serviceWorker.ready,
      new Promise<ServiceWorkerRegistration | null>((resolve) =>
        setTimeout(() => resolve(existing ?? null), 4000),
      ),
    ]);
  } catch {
    return null;
  }
}

export async function getPushNotificationState(): Promise<PushNotificationState> {
  if (!isPushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  if (Notification.permission !== "granted") return "off";

  try {
    const reg = await getReadyServiceWorkerRegistration();
    if (!reg) return "off";
    const subscription = await reg.pushManager.getSubscription();
    return subscription ? "on" : "off";
  } catch {
    return "off";
  }
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
    const reg = await getReadyServiceWorkerRegistration();
    if (reg && typeof reg.showNotification === "function") {
      await reg.showNotification(input.title, options);
      return true;
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

let lastPushFailureReason = "";

export function describePushFailure(reason = lastPushFailureReason): string {
  switch (reason) {
    case "missing_vapid_key":
      return "Notifications are not set up yet (missing VITE_VAPID_PUBLIC_KEY). Tell the admin.";
    case "service_worker_unavailable":
      return "The app is still loading. Close it, reopen, and try again.";
    case "unauthenticated":
      return "Please sign in again, then turn on notifications.";
    case "subscribe_failed":
    case "subscription_error":
      return "This device could not be registered for notifications. Try again or use another browser.";
    default:
      return "Could not turn on notifications. Please try again.";
  }
}

export function getLastPushFailureReason(): string {
  return lastPushFailureReason;
}

export async function syncPushSubscriptionForCurrentUser(): Promise<{
  subscribed: boolean;
  reason?: string;
}> {
  const result = await syncPushSubscriptionInner();
  lastPushFailureReason = result.subscribed ? "" : result.reason || "";
  return result;
}

async function syncPushSubscriptionInner(): Promise<{
  subscribed: boolean;
  reason?: string;
}> {
  if (!isPushSupported()) {
    return { subscribed: false, reason: "unsupported" };
  }
  if (Notification.permission === "denied") {
    return { subscribed: false, reason: "blocked" };
  }
  if (Notification.permission !== "granted") {
    return { subscribed: false, reason: "permission_not_granted" };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { subscribed: false, reason: "backend_unconfigured" };
  }

  const user = await getSessionUser(client);
  const { data: sessionData } = await client.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!user || !accessToken) {
    return { subscribed: false, reason: "unauthenticated" };
  }

  try {
    const reg = await getReadyServiceWorkerRegistration();
    if (!reg) {
      return { subscribed: false, reason: "service_worker_unavailable" };
    }

    const vapidKey =
      typeof import.meta !== "undefined" && import.meta.env?.["VITE_VAPID_PUBLIC_KEY"]
        ? String(import.meta.env["VITE_VAPID_PUBLIC_KEY"]).trim()
        : "";

    if (!vapidKey) {
      return { subscribed: false, reason: "missing_vapid_key" };
    }

    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    if (!subscription) {
      return { subscribed: false, reason: "subscribe_failed" };
    }

    const json = subscription.toJSON();
    const endpoint = json.endpoint;
    const p256dh = json.keys?.["p256dh"];
    const auth = json.keys?.["auth"];
    if (!endpoint || !p256dh || !auth) {
      return { subscribed: false, reason: "invalid_keys" };
    }

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ endpoint, p256dh, auth }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      return { subscribed: false, reason: payload?.error || "server_subscribe_failed" };
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
    const reg = await getReadyServiceWorkerRegistration();
    if (!reg) return;
    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return;

    if (client) {
      const { data: sessionData } = await client.auth.getSession().catch(() => ({
        data: { session: null },
      }));
      const accessToken = sessionData.session?.access_token;
      if (accessToken) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => undefined);
      }
    }

    await subscription.unsubscribe().catch(() => undefined);
  } catch {
    // Best-effort cleanup
  }
}
