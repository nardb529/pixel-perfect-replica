import { useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { BRAND } from "@/lib/campus/data";
import { pageHead } from "@/lib/campus/meta";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Ghana University Campus Marketplace",
      "CampusLoop is Ghana's university campus marketplace. Buy and sell student products and campus services across KNUST, UG, UCC, UDS, UENR and more. Buyers need no account.",
      {
        path: "/",
        exactTitle: "CampusLoop — Buy & Sell on Ghana University Campuses",
        keywords:
          "CampusLoop, Ghana campus marketplace, KNUST marketplace, University of Ghana market, UCC student market, buy and sell Ghana campus, student laptops Ghana, campus services Ghana, hostel essentials Ghana",
      },
    ),
  component: Welcome,
});

function Welcome() {
  const { triggerBuyerInstallPrompt } = useCampus();
  const router = useRouter();

  useEffect(() => {
    void router.preloadRoute({ to: "/discover" }).catch(() => undefined);
    void router.preloadRoute({ to: "/auth" }).catch(() => undefined);
  }, [router]);

  return (
    <div className="wel-screen">
      <div className="wel-photo">
        <img
          src="/banners/welcome.jpg"
          alt="CampusLoop students buying and selling on campus"
          fetchPriority="high"
        />
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
        <p className="wel-kicker">Welcome to CampusLoop</p>
        <h1>Ghana’s university campus marketplace</h1>

        <div className="wel-buyer">
          <p className="wel-who">Looking to buy?</p>
          <Button size="lg" className="wel-primary" asChild>
            <Link to="/discover" onClick={() => triggerBuyerInstallPrompt()}>
              Start browsing
              <ArrowRight size={18} />
            </Link>
          </Button>
          <p className="wel-note">
            <Check size={14} />
            No account, no login. Just browse and message sellers.
          </p>
        </div>

        <div className="wel-divider" role="separator">
          <span>Selling or offering a service?</span>
        </div>

        <div className="wel-seller">
          <div className="wel-actions">
            <Button
              variant="outline"
              size="lg"
              className="wel-secondary"
              asChild
            >
              <Link to="/auth" search={{ mode: "login" } as never}>
                Login
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="wel-secondary"
              asChild
            >
              <Link to="/auth" search={{ mode: "signup" } as never}>
                Sign Up
              </Link>
            </Button>
          </div>
          <p className="wel-note">
            Sellers and service providers need an account to post.
          </p>
        </div>

        <nav
          className="wel-note"
          aria-label="Browse CampusLoop"
          style={{ justifyContent: "center", gap: 14, flexWrap: "wrap" }}
        >
          <Link to="/products">Products</Link>
          <Link to="/services">Services</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/manual">How it works</Link>
        </nav>
      </div>
    </div>
  );
}
