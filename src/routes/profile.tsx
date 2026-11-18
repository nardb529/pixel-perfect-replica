import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const ProfilePage = lazy(() =>
  import("@/components/campus/profiles").then((m) => ({ default: m.ProfilePage })),
);

export const Route = createFileRoute("/profile")({
  head: () =>
    pageHead("Your campus profile", "Find your saved listings and manage your CampusLoop profile."),
  component: ProfileRouteComponent,
});

function ProfileRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <ProfilePage />
    </Suspense>
  );
}
