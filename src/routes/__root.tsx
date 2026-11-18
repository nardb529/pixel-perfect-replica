import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CampusProvider } from "@/components/campus/store";
import { OnboardingPrompts, OfflineBanner } from "@/components/campus/pwa";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="error-boundary-shell">
      <div className="surface-panel error-boundary-card">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="error-boundary-shell">
      <div className="surface-panel error-boundary-card">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Technical issue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re experiencing a brief technical issue, and it is being worked on. You can try
          refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

import { OG_IMAGE_URL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/campus/meta";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "CampusLoop",
      alternateName: "CampusLoop Ghana Campus Marketplace",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/pwa-512x512.png`,
        width: 512,
        height: 512,
      },
      areaServed: {
        "@type": "Country",
        name: "Ghana",
      },
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "en-GH",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_TITLE,
      url: SITE_URL,
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GHS",
      },
      areaServed: {
        "@type": "Country",
        name: "Ghana",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is CampusLoop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CampusLoop is Ghana's university campus marketplace where students and campus entrepreneurs buy, sell, and book products and services across Ghanaian universities.",
          },
        },
        {
          "@type": "Question",
          name: "Do buyers need an account to use CampusLoop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Buyers can browse listings, filter by university, bookmark items, and contact sellers directly via WhatsApp or phone call without creating an account.",
          },
        },
        {
          "@type": "Question",
          name: "Which Ghanaian universities are supported on CampusLoop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CampusLoop supports KNUST, University of Ghana (Legon), University of Cape Coast (UCC), Central University, UPSA, UEW, UDS, UMaT, UENR, GCTU, UHAS, UESD, GIMPA, ATU, KsTU, TTU, and other accredited Ghanaian institutions.",
          },
        },
        {
          "@type": "Question",
          name: "How are sellers verified on CampusLoop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Students verify with a Student ID and matching face photo, while non-student sellers verify with a Ghana Card or Voter's ID and matching face photo, all reviewed by platform admins before listing.",
          },
        },
        {
          "@type": "Question",
          name: "What currency and meetup safety rules apply on CampusLoop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All listings are priced in Ghanaian Cedis (GH₵). CampusLoop connects buyers and sellers directly and recommends meeting in busy, open public campus locations to inspect items before paying.",
          },
        },
      ],
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "CampusLoop, Ghana campus marketplace, Ghanaian university marketplace, student marketplace Ghana, KNUST marketplace, University of Ghana marketplace, UCC marketplace, Central University marketplace, UPSA marketplace, buy and sell campus Ghana, student services Ghana",
      },
      { name: "author", content: "CampusLoop" },
      { name: "geo.region", content: "GH" },
      { name: "geo.country", content: "Ghana" },
      { name: "theme-color", content: "#4965F5" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "CampusLoop Marketplace" },
      { property: "og:site_name", content: SITE_TITLE },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GH" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: SITE_TITLE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GH" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cl_theme_v1');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        onReset={() => {
          void router.invalidate();
        }}
      >
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <CampusProvider>
          <OfflineBanner />
          <Outlet />
          <OnboardingPrompts />
          <Toaster position="top-center" />
        </CampusProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
