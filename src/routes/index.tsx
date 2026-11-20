import { useEffect } from "react";
import { createFileRoute, Link, Navigate, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Camera, Laptop, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, PagePendingFallback, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { BRAND } from "@/lib/campus/data";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Ghana University Campus Marketplace",
      "Buy and sell student products and campus services across KNUST, UG, UCC, UDS, UENR, and every university in Ghana. Buyers need no account.",
      { path: "/" },
    ),
  component: Welcome,
});

function Welcome() {
  const { triggerBuyerInstallPrompt, user, authLoading } = useCampus();
  const navigate = useNavigate();
  const router = useRouter();
  const sellDestination =
    !authLoading && user ? (user.role === "admin" ? "/admin" : "/post") : "/auth";

  useEffect(() => {
    void router.preloadRoute({ to: "/discover" }).catch(() => undefined);
    void router.preloadRoute({ to: "/auth" }).catch(() => undefined);
  }, [router]);

  useEffect(() => {
    if (!authLoading && user) {
      void navigate({ to: "/discover", replace: true });
    }
  }, [authLoading, navigate, user]);

  if (authLoading) {
    return (
      <div className="launch-screen">
        <PagePendingFallback />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/discover" replace />;
  }

  function handleExplore() {
    triggerBuyerInstallPrompt();
    navigate({ to: "/discover" });
  }

  return (
    <div className="launch-screen">
      <div className="launch-ambient" aria-hidden="true">
        <span className="launch-orb launch-orb-one" />
        <span className="launch-orb launch-orb-two" />
        <span className="launch-orb launch-orb-three" />
        <svg
          className="launch-ribbon"
          viewBox="0 0 1200 500"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-40 310 C 210 110, 440 430, 720 220 C 930 60, 1080 280, 1260 170"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M-40 380 C 240 210, 510 490, 810 280 C 1020 130, 1120 330, 1260 250"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="10 10"
            strokeLinecap="round"
          />
          <path
            d="M-40 185 C 220 320, 480 40, 760 210 C 960 330, 1110 120, 1260 195"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.48"
          />
        </svg>
      </div>

      <div className="launch-topbar">
        <ThemeToggle />
      </div>

      <div className="launch-stage">
        <div className="launch-orbital" aria-hidden="true">
          <div className="launch-tile launch-tile-icon launch-tile-a">
            <ShoppingBag size={36} strokeWidth={1.7} />
          </div>
          <div className="launch-tile launch-tile-icon launch-tile-b">
            <BookOpen size={36} strokeWidth={1.7} />
          </div>
          <div className="launch-tile launch-tile-icon launch-tile-c">
            <Camera size={36} strokeWidth={1.7} />
          </div>
          <div className="launch-tile launch-tile-icon launch-tile-d">
            <Laptop size={36} strokeWidth={1.7} />
          </div>
        </div>

        <div className="launch-center-card">
          <div className="launch-emblem">
            <BrandMark size={64} animated />
          </div>
          <h1 className="launch-wordmark">
            {BRAND}
            <span>.</span>
          </h1>
          <p className="launch-tagline">Ghana’s university campus marketplace.</p>
        </div>
      </div>

      <div className="launch-dock">
        <Button size="lg" className="launch-primary" onClick={handleExplore}>
          Explore Marketplace
          <ArrowRight size={18} />
        </Button>
        <Button variant="outline" size="lg" className="launch-secondary" asChild>
          <Link to={sellDestination}>
            Sell or Offer a Service
            <ArrowUpRight size={17} />
          </Link>
        </Button>
        <div className="launch-hint-pill">
          <span>Buyers need no account — browse &amp; contact sellers free</span>
        </div>
      </div>
    </div>
  );
}
