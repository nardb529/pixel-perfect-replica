import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead("Terms of Use", "Community rules and safe trading guidelines for CampusLoop."),
  component: lazyRouteComponent(() => import("@/components/campus/legal"), "TermsPage"),
});
