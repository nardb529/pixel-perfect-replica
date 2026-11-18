import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const PostPage = lazy(() =>
  import("@/components/campus/management").then((m) => ({ default: m.PostPage })),
);

type PostSearch = {
  type?: "product" | "service" | undefined;
};

export const Route = createFileRoute("/post")({
  validateSearch: (search: Record<string, unknown>): PostSearch => ({
    type: search["type"] === "product" || search["type"] === "service" ? search["type"] : undefined,
  }),
  head: () =>
    pageHead(
      "Share a product or service",
      "Create and publish a campus product or service listing on CampusLoop.",
      { path: "/post", noIndex: true },
    ),
  component: PostRoute,
});

function PostRoute() {
  const { type } = Route.useSearch();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <PostPage initialType={type} />
    </Suspense>
  );
}
