import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const ProfilePage = lazy(() =>
  import("@/components/campus/profiles").then((m) => ({ default: m.ProfilePage })),
);

export const Route = createFileRoute("/seller/$id")({
  head: () =>
    pageHead(
      "Seller shop storefront",
      "Browse all campus products and services provided by this verified seller.",
    ),
  component: Seller,
});
function Seller() {
  const { id } = Route.useParams();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <ProfilePage sellerId={id} />
    </Suspense>
  );
}
