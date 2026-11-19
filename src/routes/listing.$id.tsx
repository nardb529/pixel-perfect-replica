import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const DetailPage = lazy(() =>
  import("@/components/campus/details").then((m) => ({ default: m.DetailPage })),
);

export const Route = createFileRoute("/listing/$id")({
  head: ({ params }) =>
    pageHead(
      "Campus Marketplace Listing",
      "Explore product or service details, GH₵ pricing, and contact the campus seller directly on CampusLoop.",
      { path: `/listing/${params.id}` },
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
