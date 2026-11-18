import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const AdminPage = lazy(() =>
  import("@/components/campus/admin").then((m) => ({ default: m.AdminPage })),
);

export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead(
      "Community admin console",
      "Manage CampusLoop listings, sellers, reports, universities, categories, and announcements.",
      { path: "/admin", noIndex: true },
    ),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <AdminPage />
    </Suspense>
  );
}
