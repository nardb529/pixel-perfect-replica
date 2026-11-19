import { BRAND } from "./data";

export const DEFAULT_SITE_URL = "https://pixel-perfect-replica-five-psi.vercel.app";

export function getCanonicalSiteUrl(): string {
  const configured =
    typeof import.meta !== "undefined" && import.meta.env?.["VITE_SITE_URL"]
      ? String(import.meta.env["VITE_SITE_URL"]).trim()
      : "";
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return DEFAULT_SITE_URL;
}

export const SITE_URL = getCanonicalSiteUrl();

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
    noIndex?: boolean;
    imagePath?: string;
    imageAlt?: string;
    type?: "website" | "profile";
  },
) => {
  const fullTitle = `${title} · ${BRAND} Campus Marketplace`;
  const siteOrigin = getCanonicalSiteUrl();
  const canonicalUrl = options?.path
    ? `${siteOrigin}${options.path.startsWith("/") ? options.path : `/${options.path}`}`
    : undefined;
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
      ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      { property: "og:type", content: options?.type || "website" },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: options?.noIndex || !canonicalUrl ? [] : [{ rel: "canonical", href: canonicalUrl }],
  };
};
