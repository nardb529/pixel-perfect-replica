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

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () =>
    pageHead(
      "Buy & Sell Campus Products",
      "Shop laptops, phones, textbooks, fashion, food, and hostel essentials from verified student sellers across Ghanaian universities.",
      { path: "/products" },
    ),
  component: Products,
});

function Products() {
  const { category, maxPrice, q } = Route.useSearch();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <BrowsePage
        type="product"
        initialCategory={category}
        initialMaxPrice={maxPrice}
        initialQuery={q}
      />
    </Suspense>
  );
}
