import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const BrowsePage = lazy(() =>
  import("@/components/campus/discovery").then((m) => ({ default: m.BrowsePage })),
);

type BrowseSearch = {
  category?: string | undefined;
  maxPrice?: string | undefined;
  q?: string | undefined;
};

export const Route = createFileRoute("/services")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () =>
    pageHead(
      "Book Student Campus Services",
      "Find verified photographers, graphic designers, tutors, hair stylists, and tech repair providers across Ghanaian campuses.",
      { path: "/services" },
    ),
  component: Services,
});

function Services() {
  const { category, maxPrice, q } = Route.useSearch();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <BrowsePage
        type="service"
        initialCategory={category}
        initialMaxPrice={maxPrice}
        initialQuery={q}
      />
    </Suspense>
  );
}
