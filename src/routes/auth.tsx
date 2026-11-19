import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const AuthPage = lazy(() =>
  import("@/components/campus/authPage").then((m) => ({ default: m.AuthPage })),
);

export const Route = createFileRoute("/auth")({
  head: () =>
    pageHead(
      "Seller Sign In & Verification",
      "Sign in or create a seller account to list products and offer verified services on the CampusLoop campus marketplace.",
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
