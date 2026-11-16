import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/manual")({
  head: () =>
    pageHead("User Manual", "Step-by-step guide to buying, selling and installing CampusLoop."),
  component: lazyRouteComponent(() => import("@/components/campus/legal"), "ManualPage"),
});
