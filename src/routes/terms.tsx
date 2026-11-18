import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const TermsPage = lazy(() =>
  import("@/components/campus/legal").then((m) => ({ default: m.TermsPage })),
);

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead(
      "Marketplace Rules & Terms",
      "Community guidelines and safe campus meetup rules for buying and selling on CampusLoop Ghana.",
      { path: "/terms" },
    ),
  component: TermsRouteComponent,
});

function TermsRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <TermsPage />
    </Suspense>
  );
}
