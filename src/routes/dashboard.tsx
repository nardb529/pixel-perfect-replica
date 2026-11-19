import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const DashboardPage = lazy(() =>
  import("@/components/campus/management").then((m) => ({ default: m.DashboardPage })),
);

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Your seller dashboard",
      "Manage your campus listings and see interest in your products and services.",
      { path: "/dashboard", noIndex: true },
    ),
  component: DashboardRouteComponent,
});

function DashboardRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <DashboardPage />
    </Suspense>
  );
}
