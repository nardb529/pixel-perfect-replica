import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const AuthPage = lazy(() =>
  import("@/components/campus/auth").then((m) => ({ default: m.AuthPage })),
);

export const Route = createFileRoute("/auth")({
  head: () =>
    pageHead(
      "Seller Sign In & Registration",
      "Create a verified seller account to list products and offer campus services across Ghanaian universities on CampusLoop.",
      { path: "/auth" },
    ),
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <AuthPage />
    </Suspense>
  );
}
