import { useEffect } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Camera, Laptop, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { BRAND } from "@/lib/campus/data";
import { pageHead, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/campus/meta";

export const Route = createFileRoute("/")({
  head: () => pageHead(SITE_TITLE, SITE_DESCRIPTION, { path: "/" }),
  component: Welcome,
});

function Welcome() {
  const { triggerBuyerInstallPrompt } = useCampus();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    void router.preloadRoute({ to: "/discover" }).catch(() => undefined);
    void router.preloadRoute({ to: "/auth" }).catch(() => undefined);
  }, [router]);

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
          <p className="launch-tagline">Ghana’s University Campus Marketplace</p>
          <p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
            Buy, sell &amp; book student products and campus services across KNUST, UG, UCC, Central
            University &amp; more.
          </p>
        </div>
      </div>

      <div className="launch-dock">
        <Button size="lg" className="launch-primary" onClick={handleExplore}>
          Explore Marketplace
          <ArrowRight size={18} />
        </Button>
        <Button variant="outline" size="lg" className="launch-secondary" asChild>
          <Link to="/auth">
            Sell or Offer a Service
            <ArrowUpRight size={17} />
          </Link>
        </Button>
        <div className="launch-hint-pill">
          <span>Browse freely without an account</span>
        </div>
      </div>
    </div>
  );
}
