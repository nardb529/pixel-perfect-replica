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
import { OnboardingPrompts, OfflineBanner, InstallGate } from "@/components/campus/pwa";
import { LaunchSplash } from "@/components/campus/splash";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { buildStructuredDataGraph, DEFAULT_SITE_URL } from "@/lib/campus/meta";

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "CampusLoop — Ghana University Campus Marketplace" },
      {
        name: "description",
        content:
          "CampusLoop is the Ghana university campus marketplace for student products, verified services, books, electronics, and hostelling essentials. Buyers need no account.",
      },
      {
        name: "keywords",
        content:
          "CampusLoop, Ghana university marketplace, KNUST buy and sell, University of Ghana Legon market, UCC campus market, UPSA market, student electronics Ghana, Ghana campus services",
      },
      { name: "author", content: "CampusLoop" },
      { name: "application-name", content: "CampusLoop" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#4965F5" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "CampusLoop" },
      { property: "og:site_name", content: "CampusLoop Marketplace" },
      { property: "og:locale", content: "en_GH" },
      { property: "og:title", content: "CampusLoop — Ghana University Campus Marketplace" },
      {
        property: "og:description",
        content:
          "Buy and sell student products and verified services across KNUST, UG, UCC, UDS, UENR, and Ghanaian campuses. Buyers shop freely without an account.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: `${DEFAULT_SITE_URL}/og-marketplace.jpg`,
      },
      { property: "og:url", content: DEFAULT_SITE_URL },
      { property: "og:image:secure_url", content: `${DEFAULT_SITE_URL}/og-marketplace.jpg` },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "CampusLoop Marketplace screenshot showing Ghana campus products and services",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CampusLoop — Ghana University Campus Marketplace" },
      {
        name: "twitter:description",
        content:
          "Buy and sell student products and verified services across Ghanaian university campuses. No buyer account needed.",
      },
      {
        name: "twitter:image",
        content: `${DEFAULT_SITE_URL}/og-marketplace.jpg`,
      },
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
      {
        rel: "alternate",
        type: "text/plain",
        title: "CampusLoop AI & LLM Marketplace Guide",
        href: "/llms.txt",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cl_theme_v1');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildStructuredDataGraph()),
          }}
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
          <InstallGate />
          <LaunchSplash />
          <Toaster position="top-center" />
        </CampusProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
