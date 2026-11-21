import { BRAND } from "./data";

export const DEFAULT_SITE_URL = "https://campusloop-gh.vercel.app";

// Older deployments used this address. Never let a stale setting point links or previews at it.
const STALE_SITE_HOSTS = ["pixel-perfect-replica-five-psi.vercel.app"];
export const SITE_URL = DEFAULT_SITE_URL;

export function getCanonicalSiteUrl(): string {
  const configured =
    typeof import.meta !== "undefined" && import.meta.env?.["VITE_SITE_URL"]
      ? String(import.meta.env["VITE_SITE_URL"]).trim()
      : "";
  if (
    configured &&
    !STALE_SITE_HOSTS.some((host) => configured.includes(host))
  ) {
    return configured.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_SITE_URL;
}

export function resolveAbsoluteOgImage(
  imagePath = "/og-marketplace.jpg",
): string {
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${getCanonicalSiteUrl()}${normalized}`;
}

export function buildStructuredDataGraph(): Record<string, unknown> {
  const siteUrl = DEFAULT_SITE_URL;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: BRAND,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/pwa-512x512.png`,
          width: 512,
          height: 512,
        },
        description:
          "CampusLoop is Ghana's verified university campus marketplace connecting students and campus communities to buy and sell products and book local campus services without a buyer account.",
        areaServed: {
          "@type": "Country",
          name: "Ghana",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${BRAND} — Ghana University Campus Marketplace`,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-GH",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/products?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#webapp`,
        name: `${BRAND} Campus Marketplace`,
        url: `${siteUrl}/discover`,
        applicationCategory: "ShoppingApplication",
        operatingSystem: "Android, iOS, Windows, macOS",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GHS",
          description: "Free for buyers across Ghanaian university campuses.",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Do buyers need an account to shop on CampusLoop Ghana?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Buyers can browse listings, filter by Ghanaian university, save favorites locally, and contact verified sellers directly on WhatsApp or phone call without creating an account.",
            },
          },
          {
            "@type": "Question",
            name: "How are sellers verified on CampusLoop?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Student sellers upload their Student ID alongside a matching real profile photo, while non-student campus sellers upload a Ghana Card or Voter's ID and matching real profile photo for admin approval.",
            },
          },
          {
            "@type": "Question",
            name: "Which Ghanaian universities are supported on CampusLoop?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "CampusLoop supports KNUST, University of Ghana (Legon), UCC, UPSA, UEW, UDS, UMaT, UENR, GCTU, UHAS, UESD, GIMPA, ATU, KsTU, TTU, and other accredited Ghanaian institutions.",
            },
          },
        ],
      },
    ],
  };
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
    keywords?: string;
    exactTitle?: string;
  },
) => {
  const fullTitle =
    options?.exactTitle || `${title} · ${BRAND} Campus Marketplace`;
  const canonicalBase = getCanonicalSiteUrl();
  const normalizedPath = options?.path
    ? options.path.startsWith("/")
      ? options.path
      : `/${options.path}`
    : undefined;
  const canonicalUrl = normalizedPath
    ? `${canonicalBase}${normalizedPath}`
    : undefined;
  const imageUrl = resolveAbsoluteOgImage(
    options?.imagePath || "/og-marketplace.jpg",
  );
  const imageAlt =
    options?.imageAlt ||
    `${BRAND} — Ghana University Campus Marketplace showing student products and services priced in GH₵`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          options?.keywords ||
          "CampusLoop, Ghana campus marketplace, KNUST marketplace, University of Ghana market, UCC student market, buy and sell Ghana campus, student laptops Ghana, Ghana campus services",
      },
      { name: "author", content: BRAND },
      ...(options?.noIndex
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : [
            {
              name: "robots",
              content: "index, follow, max-image-preview:large",
            },
          ]),
      { property: "og:site_name", content: `${BRAND} Marketplace` },
      { property: "og:locale", content: "en_GH" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: options?.type || "website" },
      ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      { property: "og:image", content: imageUrl },
      { property: "og:image:secure_url", content: imageUrl },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links:
      canonicalUrl && !options?.noIndex
        ? [{ rel: "canonical", href: canonicalUrl }]
        : [],
  };
};
