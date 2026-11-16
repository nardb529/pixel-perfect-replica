import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { BRAND } from "@/lib/campus/data";
import { pageHead } from "@/lib/campus/meta";
import laptop from "@/assets/laptop.jpg";
import sneakers from "@/assets/sneakers.jpg";
import photographer from "@/assets/photographer.jpg";
import headphones from "@/assets/headphones.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Your campus. Your loop.",
      "Discover products, services and student talent across Ghanaian university communities.",
    ),
  component: Welcome,
});

type LaunchPhase = "splash" | "exiting" | "ready";

function Welcome() {
  const { triggerBuyerInstallPrompt } = useCampus();
  const navigate = useNavigate();
  const router = useRouter();
  const [phase, setPhase] = useState<LaunchPhase>("splash");

  useEffect(() => {
    void router.preloadRoute({ to: "/discover" }).catch(() => undefined);
    void router.preloadRoute({ to: "/auth" }).catch(() => undefined);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = reduced ? 350 : 950;
    const exitMs = reduced ? 100 : 220;

    let exitTimer: number | undefined;
    const holdTimer = window.setTimeout(() => {
      setPhase("exiting");
      exitTimer = window.setTimeout(() => setPhase("ready"), exitMs);
    }, holdMs);

    return () => {
      window.clearTimeout(holdTimer);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
    };
  }, [router]);

  function skipSplash() {
    if (phase !== "splash") return;
    setPhase("exiting");
    window.setTimeout(() => setPhase("ready"), 180);
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

      {phase !== "ready" ? (
        <div
          className={`splash-intro ${phase === "exiting" ? "is-exiting" : ""}`}
          onClick={skipSplash}
          role="button"
          tabIndex={0}
          aria-label={`${BRAND} launching`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") skipSplash();
          }}
        >
          <h1 className="sr-only">{BRAND}</h1>

          <div className="launch-orbital" aria-hidden="true">
            <figure className="launch-tile launch-tile-a">
              <img src={sneakers} alt="" width={400} height={400} decoding="async" />
            </figure>
            <figure className="launch-tile launch-tile-b">
              <img src={headphones} alt="" width={400} height={400} decoding="async" />
            </figure>
            <figure className="launch-tile launch-tile-c">
              <img src={photographer} alt="" width={400} height={400} decoding="async" />
            </figure>
            <figure className="launch-tile launch-tile-d">
              <img src={laptop} alt="" width={400} height={400} decoding="async" />
            </figure>
          </div>

          <div className="splash-center">
            <span className="splash-aura" aria-hidden="true" />
            <span className="splash-ring-outer" aria-hidden="true" />
            <span className="splash-ring-inner" aria-hidden="true" />
            <span className="splash-sonar" aria-hidden="true" />
            <div className="splash-emblem-core">
              <BrandMark size={84} animated />
            </div>
            <div className="splash-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="launch-topbar">
            <ThemeToggle />
          </div>

          <div className="launch-stage">
            <div className="launch-orbital" aria-hidden="true">
              <figure className="launch-tile launch-tile-a">
                <img src={sneakers} alt="" width={400} height={400} />
              </figure>
              <figure className="launch-tile launch-tile-b">
                <img src={headphones} alt="" width={400} height={400} />
              </figure>
              <figure className="launch-tile launch-tile-c">
                <img src={photographer} alt="" width={400} height={400} />
              </figure>
              <figure className="launch-tile launch-tile-d">
                <img src={laptop} alt="" width={400} height={400} />
              </figure>
            </div>

            <div className="launch-center-card">
              <div className="launch-emblem">
                <BrandMark size={64} animated />
              </div>
              <h1 className="launch-wordmark">
                {BRAND}
                <span>.</span>
              </h1>
              <p className="launch-tagline">Your campus. Your loop.</p>
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
        </>
      )}
    </div>
  );
}
