import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PagePendingFallback } from "@/components/campus/shared";
import { pageHead } from "@/lib/campus/meta";

const TermsPage = lazy(() =>
  import("@/components/campus/legal").then((m) => ({ default: m.TermsPage })),
);

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead("Terms of Use", "Community rules and safe trading guidelines for CampusLoop."),
  component: TermsRouteComponent,
});

function TermsRouteComponent() {
  return (
    <Suspense fallback={<PagePendingFallback />}>
      <TermsPage />
    </Suspense>
  );
}
