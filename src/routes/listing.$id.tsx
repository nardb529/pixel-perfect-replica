import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";
import { initialListings } from "@/lib/campus/data";

const DetailPage = lazy(() =>
  import("@/components/campus/details").then((m) => ({ default: m.DetailPage })),
);

export const Route = createFileRoute("/listing/$id")({
  head: ({ params }) =>
    pageHead(
      initialListings.find((l) => l.id === params.id)?.title || "Campus listing",
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
