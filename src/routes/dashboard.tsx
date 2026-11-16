import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Your seller dashboard",
      "Manage your campus listings and see interest in your products and services.",
    ),
  component: lazyRouteComponent(() => import("@/components/campus/management"), "DashboardPage"),
});
