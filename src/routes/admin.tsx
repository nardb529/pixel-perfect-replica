import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead(
      "Community admin preview",
      "Explore the separate frontend moderation and campus management preview.",
    ),
  component: lazyRouteComponent(() => import("@/components/campus/admin"), "AdminPage"),
});
