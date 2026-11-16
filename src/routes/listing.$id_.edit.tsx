import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const PostPage = lazy(() =>
  import("@/components/campus/management").then((m) => ({ default: m.PostPage })),
);

export const Route = createFileRoute("/listing/$id_/edit")({
  head: () =>
    pageHead(
      "Edit your campus listing",
      "Update the details of your own CampusLoop product or service.",
    ),
  component: Edit,
});
function Edit() {
  const { id } = Route.useParams();
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <PostPage editId={id} />
    </Suspense>
  );
}
