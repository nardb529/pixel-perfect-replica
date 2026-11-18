import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const ManualPage = lazy(() =>
  import("@/components/campus/legal").then((m) => ({ default: m.ManualPage })),
);

export const Route = createFileRoute("/manual")({
  head: () =>
    pageHead(
      "Marketplace Guide & FAQs",
      "Learn how to buy without an account, verify your seller ID, stay safe at campus meetups, and install CampusLoop in Ghana.",
      { path: "/manual" },
    ),
  component: ManualRouteComponent,
});

function ManualRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <ManualPage />
    </Suspense>
  );
}
