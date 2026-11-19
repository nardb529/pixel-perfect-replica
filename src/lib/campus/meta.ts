import { BRAND } from "./data";

export const DEFAULT_SITE_URL = "https://pixel-perfect-replica-five-psi.vercel.app";
export const SITE_URL = DEFAULT_SITE_URL;

export function getCanonicalSiteUrl(): string {
  const configured =
    typeof import.meta !== "undefined" && import.meta.env?.["VITE_SITE_URL"]
      ? String(import.meta.env["VITE_SITE_URL"]).trim()
      : "";
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_SITE_URL;
}

export function resolveAbsoluteOgImage(imagePath = "/og-marketplace.jpg"): string {
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${getCanonicalSiteUrl()}${normalized}`;
}

export const pageHead = (
  title: string,
  description: string,
  options?: {
    path?: string;
    imagePath?: string;
    imageAlt?: string;
    type?: "website" | "profile";
    noIndex?: boolean;
  },
) => {
  const fullTitle = `${title} · ${BRAND} Campus Marketplace`;
  const canonicalBase = getCanonicalSiteUrl();
  const normalizedPath = options?.path
    ? options.path.startsWith("/")
      ? options.path
      : `/${options.path}`
    : undefined;
  const canonicalUrl = normalizedPath ? `${canonicalBase}${normalizedPath}` : undefined;
  const imageUrl = resolveAbsoluteOgImage(options?.imagePath || "/og-marketplace.jpg");
  const imageAlt =
    options?.imageAlt ||
    `${BRAND} — Ghana University Campus Marketplace for student products and services`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      ...(options?.noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { property: "og:site_name", content: `${BRAND} Marketplace` },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: options?.type || "website" },
      ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: canonicalUrl && !options?.noIndex ? [{ rel: "canonical", href: canonicalUrl }] : [],
  };
};
