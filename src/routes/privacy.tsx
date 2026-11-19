import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const PrivacyPage = lazy(() =>
  import("@/components/campus/legal").then((m) => ({ default: m.PrivacyPage })),
);

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead(
      "Privacy Policy",
      "Learn how CampusLoop protects buyer privacy and seller verification records across Ghana's campus marketplace.",
      { path: "/privacy" },
    ),
  component: PrivacyRouteComponent,
});

function PrivacyRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <PrivacyPage />
    </Suspense>
  );
}
