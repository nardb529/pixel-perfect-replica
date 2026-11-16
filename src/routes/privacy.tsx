import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead("Privacy Policy", "Learn how CampusLoop handles campus browsing and seller profiles."),
  component: lazyRouteComponent(() => import("@/components/campus/legal"), "PrivacyPage"),
});
