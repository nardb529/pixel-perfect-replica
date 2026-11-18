import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Compass,
  Download,
  FileText,
  Lock,
  Moon,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/campus/data";
import { HeroAmbient, PageIntro, Shell } from "./shared";
import { useCampus } from "./store";

export function PrivacyPage() {
  return (
    <Shell>
      <div className="legal-wrap">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={15} />
          Back to profile
        </Link>

        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <PageIntro
            eyebrow="Privacy Policy"
            title={`How ${BRAND} handles your data`}
            text="Built for Ghanaian university students with simple, transparent data practices."
          />
        </section>

        <div className="legal-grid">
          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <Compass size={18} />
              </span>
              <h2>1. Browse without an account</h2>
            </div>
            <p>
              Buyers can explore listings, filter by university, save bookmarks, and contact sellers
              directly without signing up or submitting personal details. Saved items and theme
              preferences remain on your device.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <UserCheck size={18} />
              </span>
              <h2>2. Seller &amp; provider info</h2>
            </div>
            <p>
              When you register as a seller or service provider, you choose which campus, category,
              and contact channel (such as WhatsApp, Phone call, or Email) appears on your public
              listings so interested students can reach you.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <Bell size={18} />
              </span>
              <h2>3. Notifications &amp; device storage</h2>
            </div>
            <p>
              Browser alerts are strictly opt-in. We prompt sellers once on first sign-in when
              notifications are not yet active, and never spam buyers with permission popups. You
              can revoke permission anytime in your browser settings.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <Lock size={18} />
              </span>
              <h2>4. Media storage &amp; deletion</h2>
            </div>
            <p>
              Listing photos and profile avatars are securely hosted for public marketplace display.
              You can replace or archive your listings and media anytime from your dashboard, and we
              never sell your data to third-party advertisers.
            </p>
          </article>
        </div>

        <section className="surface-panel legal-footer-card">
          <div>
            <strong>Questions or content removal?</strong>
            <p>Use the report button on any listing or review our Terms &amp; User Manual.</p>
          </div>
          <div className="legal-footer-links">
            <Button variant="outline" asChild>
              <Link to="/terms">Terms of Use</Link>
            </Button>
            <Button asChild>
              <Link to="/manual">User Manual</Link>
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell>
      <div className="legal-wrap">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={15} />
          Back to profile
        </Link>

        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <PageIntro
            eyebrow="Terms of Use"
            title={`${BRAND} community rules`}
            text="Clear guidelines to keep trading fast, honest, and safe across every campus."
          />
        </section>

        <div className="legal-grid">
          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <ShoppingBag size={18} />
              </span>
              <h2>1. Accurate listings</h2>
            </div>
            <p>
              Every product or service posted on {BRAND} must include clear, truthful pricing in
              GH₵, honest condition descriptions, and authentic photos. Misleading listings may be
              paused or removed.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <ShieldCheck size={18} />
              </span>
              <h2>2. Safe campus meetups</h2>
            </div>
            <p>
              {BRAND} connects students directly — we do not process in-app escrow or payments.
              Always meet in busy, well-lit public campus spaces (such as library forecourts,
              lecture halls, or central commercial areas) and inspect items before paying.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <FileText size={18} />
              </span>
              <h2>3. Prohibited items &amp; services</h2>
            </div>
            <p>
              Counterfeit goods, illegal substances, weapons, stolen property, and academic fraud
              are strictly prohibited across all participating university communities.
            </p>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <BookOpen size={18} />
              </span>
              <h2>4. Direct responsibility</h2>
            </div>
            <p>
              Sellers and service providers are responsible for fulfilling bookings, warranties, and
              agreements arranged with buyers. Please report suspicious behaviour using the Report
              option on any listing.
            </p>
          </article>
        </div>

        <section className="surface-panel legal-footer-card">
          <div>
            <strong>Need help getting started?</strong>
            <p>Check the step-by-step User Manual or review our Privacy Policy.</p>
          </div>
          <div className="legal-footer-links">
            <Button variant="outline" asChild>
              <Link to="/privacy">Privacy Policy</Link>
            </Button>
            <Button asChild>
              <Link to="/manual">Read User Manual</Link>
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

export function ManualPage() {
  const { openInstallPrompt, toggleTheme, theme, isStandalone } = useCampus();

  return (
    <Shell>
      <div className="legal-wrap">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={15} />
          Back to profile
        </Link>

        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <PageIntro
            eyebrow="User Manual"
            title={`Getting the most out of ${BRAND}`}
            text="A quick visual guide for buying, selling, installing the app, and staying safe on campus."
          />
          <div className="manual-quick-bar">
            {!isStandalone && (
              <Button onClick={openInstallPrompt}>
                <Download size={16} />
                Add to Home Screen
              </Button>
            )}
            <Button variant="outline" onClick={toggleTheme}>
              <Moon size={16} />
              Switch to {theme === "dark" ? "Light" : "Dark"} mode
            </Button>
          </div>
        </section>

        <div className="legal-grid">
          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <Compass size={18} />
              </span>
              <h2>For Buyers</h2>
            </div>
            <ol className="manual-steps">
              <li>
                Tap <strong>Explore Marketplace</strong> on the welcome screen — no sign-up needed.
              </li>
              <li>
                Switch your campus anytime using the university selector in the top bar (KNUST, UG,
                UCC, UPSA, UMaT, Ashesi, and more).
              </li>
              <li>
                Tap the bookmark icon to save items or open any listing to message the seller via
                WhatsApp or phone.
              </li>
            </ol>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <ShoppingBag size={18} />
              </span>
              <h2>For Sellers &amp; Providers</h2>
            </div>
            <ol className="manual-steps">
              <li>
                Tap <strong>Sell or Offer a Service</strong> or the center <strong>+</strong> button
                in the floating dock.
              </li>
              <li>
                Choose whether you sell products, offer services, or both, then access your personal
                dashboard.
              </li>
              <li>
                Create a listing in 3 quick steps: pick type, add photos + price in GH₵ + campus
                audience, and publish.
              </li>
            </ol>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <Smartphone size={18} />
              </span>
              <h2>Install on Your Phone or PC</h2>
            </div>
            <ol className="manual-steps">
              <li>
                <strong>iPhone / iPad (Safari):</strong> Tap Share, then tap{" "}
                <strong>Add to Home Screen</strong>.
              </li>
              <li>
                <strong>Android (Chrome / Edge):</strong> Tap <strong>Add to Home Screen</strong>{" "}
                when prompted, or open browser menu &rarr; Install app.
              </li>
              <li>
                <strong>Desktop:</strong> Click the install icon in the address bar or use Safari
                File &rarr; Add to Dock.
              </li>
            </ol>
          </article>

          <article className="surface-panel">
            <div className="legal-card-head">
              <span className="legal-icon">
                <ShieldCheck size={18} />
              </span>
              <h2>Campus Safety Checklist</h2>
            </div>
            <ol className="manual-steps">
              <li>Meet during daytime in open, busy campus spots near halls or faculty blocks.</li>
              <li>Test electronics, check textbook editions, and confirm sizes before paying.</li>
              <li>Avoid sending advance deposits to unfamiliar contacts without meeting first.</li>
            </ol>
          </article>
        </div>
      </div>
    </Shell>
  );
}
