import { BRAND } from "./data";

export const SITE_URL = "https://campusloop-gh.vercel.app";
export const SITE_TITLE = `${BRAND} – Ghana University Campus Marketplace`;
export const SITE_DESCRIPTION =
  "Buy, sell, and discover verified student products and campus services across Ghanaian universities on CampusLoop. Browse freely without an account.";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export type PageHeadOptions = {
  path?: string | undefined;
  noIndex?: boolean | undefined;
  ogImage?: string | undefined;
  ogType?: "website" | "article" | undefined;
};

export const pageHead = (title: string, description: string, options: PageHeadOptions = {}) => {
  const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND} Marketplace`;
  const cleanPath = options.path
    ? options.path === "/"
      ? ""
      : options.path.startsWith("/")
        ? options.path
        : `/${options.path}`
    : "";
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  const ogImage = options.ogImage || OG_IMAGE_URL;
  const robots = options.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { property: "og:site_name", content: SITE_TITLE },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: options.ogType || "website" },
      { property: "og:locale", content: "en_GH" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "CampusLoop – Ghana University Campus Marketplace",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: options.noIndex ? [] : [{ rel: "canonical", href: canonicalUrl }],
  };
};
