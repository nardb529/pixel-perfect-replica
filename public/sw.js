const CACHE_NAME = "campusloop-v4";
const PRECACHE_URLS = [
  "/manifest.webmanifest",
  "/favicon.svg",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/apple-touch-icon.png",
];
const PRIVATE_ROUTE_PREFIXES = [
  "/admin",
  "/dashboard",
  "/post",
  "/profile",
  "/auth",
  "/reset-password",
  "/api/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept Vite dev runtime, source modules, or dynamic style queries
  if (
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/node_modules/")
  ) {
    return;
  }

  // Immutable hashed bundle assets & static icons: cache-first for instant loads
  const isImmutableAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff2");

  if (isImmutableAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Private or authenticated routes: network-only, never store HTML in cache
  const isPrivateRoute = PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
  );
  if (isPrivateRoute) {
    event.respondWith(fetch(request));
    return;
  }

  // Public navigations & dynamic responses: network-first so updates appear immediately
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.headers.get("accept")?.includes("text/html")) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then(
            (cached) => cached || (request.mode === "navigate" ? caches.match("/") : undefined),
          ),
      ),
  );
});
