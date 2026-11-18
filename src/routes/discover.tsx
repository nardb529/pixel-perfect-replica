import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const DiscoverPage = lazy(() =>
  import("@/components/campus/discovery").then((m) => ({ default: m.DiscoverPage })),
);

export const Route = createFileRoute("/discover")({
  head: () =>
    pageHead(
      "Discover Campus Marketplace",
      "Explore verified student products, campus services, electronics, books, and hostel essentials across Ghanaian university campuses.",
      { path: "/discover" },
    ),
  component: DiscoverRouteComponent,
});

function DiscoverRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <DiscoverPage />
    </Suspense>
  );
}
