import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const ManualPage = lazy(() =>
  import("@/components/campus/legal").then((m) => ({ default: m.ManualPage })),
);

export const Route = createFileRoute("/manual")({
  head: () =>
    pageHead("User Manual", "Step-by-step guide to buying, selling and installing CampusLoop."),
  component: ManualRouteComponent,
});

function ManualRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <ManualPage />
    </Suspense>
  );
}
