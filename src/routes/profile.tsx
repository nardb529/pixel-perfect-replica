import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/profile")({
  head: () =>
    pageHead("Your campus profile", "Find your saved listings and manage your CampusLoop profile."),
  component: lazyRouteComponent(() => import("@/components/campus/profiles"), "ProfilePage"),
});
