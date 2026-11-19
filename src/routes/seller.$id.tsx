import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const ProfilePage = lazy(() =>
  import("@/components/campus/profiles").then((m) => ({ default: m.ProfilePage })),
);

export const Route = createFileRoute("/seller/$id")({
  head: ({ params }) =>
    pageHead(
      "Seller Shop Storefront",
      "Explore all campus products and services from this verified CampusLoop seller shop. Contact directly on WhatsApp or phone — no buyer account required.",
      {
        path: `/seller/${params.id}`,
        imagePath: "/og-shop.jpg",
        imageAlt:
          "CampusLoop Seller Shop Storefront screenshot showing verified seller badge, products, and services in GH₵",
        type: "profile",
      },
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
