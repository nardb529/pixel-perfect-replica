import { useEffect } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, ThemeToggle } from "@/components/campus/shared";
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

  function handleExplore() {
    triggerBuyerInstallPrompt();
    navigate({ to: "/discover" });
  }

  return (
    <div className="wel-screen">
      <div className="wel-photo">
        <img src="/banners/welcome.jpg" alt="" aria-hidden="true" fetchPriority="high" />
        <div className="wel-photo-shade" aria-hidden="true" />
        <div className="wel-topbar">
          <span className="wel-logo">
            <BrandMark size={34} />
            <b>{BRAND}</b>
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="wel-sheet">
        <p className="wel-kicker">Ghana’s university campus marketplace</p>
        <h1>WELCOME</h1>
        <p className="wel-tagline">
          Buy and sell student products and campus services. Buyers need no account.
        </p>

        <div className="wel-actions">
          <Button size="lg" className="wel-primary" asChild>
            <Link to="/auth" search={{ mode: "login" } as never}>
              Login
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="wel-secondary" asChild>
            <Link to="/auth" search={{ mode: "signup" } as never}>
              Sign Up
            </Link>
          </Button>
        </div>

        <button type="button" className="wel-guest" onClick={handleExplore}>
          Explore as guest
          <ArrowRight size={16} />
        </button>
        <Link to={sellDestination} className="wel-sell">
          Sell or offer a service
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
