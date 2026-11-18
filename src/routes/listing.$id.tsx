import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const DetailPage = lazy(() =>
  import("@/components/campus/details").then((m) => ({ default: m.DetailPage })),
);

export const Route = createFileRoute("/listing/$id")({
  head: () =>
    pageHead(
      "Campus listing",
      "Explore listing details and connect directly with a seller or service provider in your campus community.",
    ),
  component: ListingDetail,
});
function ListingDetail() {
  const { id } = Route.useParams();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <DetailPage id={id} />
    </Suspense>
  );
}
