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
      "Join the seller community",
      "Preview signing up or logging in to sell products and offer services on CampusLoop.",
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
