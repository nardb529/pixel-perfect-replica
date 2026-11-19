import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  BellRing,
  BookmarkCheck,
  CheckCircle2,
  Download,
  Laptop,
  Maximize2,
  MessageCircle,
  PlusSquare,
  Share,
  Smartphone,
  WifiOff,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BRAND } from "@/lib/campus/data";
import { useCampus } from "./store";

type DeviceTab = "ios" | "android" | "desktop";

export function OnboardingPrompts() {
  const {
    user,
    isStandalone,
    isIOS,
    isMacSafari,
    canNativeInstall,
    triggerNativeInstall,
    buyerInstallOpen,
    closeBuyerInstallPrompt,
    sellerPostAuthStage,
    completeNotificationStep,
    dismissSellerPrompts,
    manualInstallOpen,
    closeInstallPrompt,
    requestAppNotifications,
  } = useCampus();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [deviceTab, setDeviceTab] = useState<DeviceTab>("android");
  const [installing, setInstalling] = useState(false);
  const isPhoneDevice =
    typeof navigator !== "undefined" &&
    /iPhone|iPod|Android.+Mobile|Mobile.+Android/i.test(navigator.userAgent || "");

  useEffect(() => {
    if (isIOS) {
      setDeviceTab("ios");
    } else if (typeof window !== "undefined" && window.innerWidth >= 900) {
      setDeviceTab("desktop");
    } else {
      setDeviceTab("android");
    }
  }, [isIOS]);

  const showSellerNotif =
    Boolean(user) && sellerPostAuthStage === "notifications" && pathname === "/dashboard";

  const showSellerInstall =
    Boolean(user) &&
    sellerPostAuthStage === "install" &&
    pathname === "/dashboard" &&
    !isStandalone;

  const showBuyerInstall = buyerInstallOpen && pathname === "/discover" && !isStandalone;

  const showInstallDialog = showSellerNotif
    ? false
    : showSellerInstall || showBuyerInstall || manualInstallOpen;

  function handleCloseInstall() {
    if (showBuyerInstall) closeBuyerInstallPrompt();
    if (showSellerInstall) dismissSellerPrompts();
    if (manualInstallOpen) closeInstallPrompt();
  }

  async function handleEnableNotifications() {
    const result = await requestAppNotifications();
    if (result === "granted") {
      toast.success("Notifications enabled for your seller account");
    } else if (result === "denied") {
      toast.info("Notifications blocked in browser settings");
    } else if (result === "unsupported") {
      toast.info("Notifications are not supported in this browser");
    }
    completeNotificationStep(result === "granted");
  }

  async function handleInstallClick() {
    if (canNativeInstall) {
      setInstalling(true);
      const outcome = await triggerNativeInstall();
      setInstalling(false);
      if (outcome === "accepted") {
        toast.success(`${BRAND} added to your device`);
        handleCloseInstall();
      } else if (outcome === "dismissed") {
        toast.info("You can install anytime from your Profile");
      }
      return;
    }

    toast.info(
      deviceTab === "ios"
        ? "Tap Safari's Share icon, then choose Add to Home Screen"
        : deviceTab === "desktop"
          ? isMacSafari
            ? "Use Safari File menu -> Add to Dock"
            : "Click the Install icon in your browser address bar or menu"
          : "Open browser menu and tap Install app or Add to Home screen",
    );
  }

  return (
    <>
      <Dialog
        open={showSellerNotif}
        onOpenChange={(open) => {
          if (!open) completeNotificationStep(false);
        }}
      >
        <DialogContent className="mobile-dialog onboarding-dialog">
          <div className="onboarding-scroll-body">
            <div className="onboarding-stage notif-stage" aria-hidden="true">
              <span className="stage-orb stage-orb-a" />
              <span className="stage-orb stage-orb-b" />
              <svg
                className="stage-waves"
                viewBox="0 0 360 120"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  className="stage-wave-path wave-one"
                  d="M-10 88 C 68 38, 146 112, 232 62 C 288 30, 330 48, 370 72"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  className="stage-wave-path wave-two"
                  d="M-10 56 C 72 98, 168 22, 256 76 C 306 106, 338 80, 370 46"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <div className="notif-float-pill notif-pill-left">
                <BookmarkCheck size={13} />
                <span>Item saved</span>
              </div>
              <div className="notif-float-pill notif-pill-right">
                <MessageCircle size={13} />
                <span>Buyer ping</span>
              </div>

              <div className="notif-centerpiece">
                <span className="notif-pulse-ring ring-one" />
                <span className="notif-pulse-ring ring-two" />
                <span className="notif-bell-core">
                  <BellRing size={28} className="notif-bell-glyph" />
                  <span className="notif-live-dot" />
                </span>
              </div>
            </div>

            <div className="onboarding-copy">
              <DialogTitle className="onboarding-title">Turn on seller alerts</DialogTitle>
              <DialogDescription className="onboarding-desc">
                Never miss a campus buyer — get instant alerts when students save your items or
                reach out on {BRAND}.
              </DialogDescription>
            </div>

            <div className="onboarding-perks">
              <div className="onboarding-perk-pill">
                <span className="perk-badge">
                  <CheckCircle2 size={15} />
                </span>
                <span>Instant enquiry alerts while browsing</span>
              </div>
              <div className="onboarding-perk-pill">
                <span className="perk-badge">
                  <CheckCircle2 size={15} />
                </span>
                <span>Real-time updates when listings trend</span>
              </div>
            </div>

            <div className="onboarding-actions">
              <Button className="onboarding-cta" onClick={handleEnableNotifications}>
                <BellRing size={17} />
                <span>Enable Notifications</span>
              </Button>
              <Button
                variant="ghost"
                className="onboarding-skip"
                onClick={() => completeNotificationStep(false)}
              >
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showInstallDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseInstall();
        }}
      >
        <DialogContent className="mobile-dialog onboarding-dialog">
          <div className="onboarding-scroll-body">
            <div className="onboarding-stage install-stage" aria-hidden="true">
              <span className="stage-orb stage-orb-a" />
              <span className="stage-orb stage-orb-c" />
              <svg
                className="stage-waves violet"
                viewBox="0 0 360 120"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  className="stage-wave-path wave-one"
                  d="M-10 46 C 78 96, 178 18, 266 66 C 310 90, 342 64, 370 38"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  className="stage-wave-path wave-two"
                  d="M-10 92 C 84 44, 186 106, 274 52 C 314 28, 344 42, 370 68"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <div className="notif-float-pill install-pill-left">
                <Zap size={12} />
                <span>1-tap launch</span>
              </div>
              <div className="notif-float-pill install-pill-right">
                <Maximize2 size={12} />
                <span>Full screen</span>
              </div>

              <div className="install-centerpiece">
                <span className="install-orbit-halo" />
                <div className="install-icon-shell">
                  <img
                    src="/pwa-192x192.png"
                    alt={`${BRAND} app icon`}
                    className="onboarding-app-icon"
                    width={66}
                    height={66}
                  />
                  <span className="install-corner-badge">
                    <Download size={13} />
                  </span>
                </div>
              </div>
            </div>

            <div className="onboarding-copy">
              <DialogTitle className="onboarding-title">Install {BRAND}</DialogTitle>
              <DialogDescription className="onboarding-desc">
                Pin {BRAND} directly to your home screen for one-tap campus access and a smooth
                full-screen app feel.
              </DialogDescription>
            </div>

            {canNativeInstall ? (
              <div className="install-ready-card">
                <span className="perk-badge">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <strong>Instant install ready</strong>
                  <small>Works offline with fast home-screen launch</small>
                </div>
              </div>
            ) : (
              <>
                <div className="device-switcher" role="tablist" aria-label="Device install guide">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={deviceTab === "ios"}
                    className={deviceTab === "ios" ? "active" : ""}
                    onClick={() => setDeviceTab("ios")}
                  >
                    <Smartphone size={13} />
                    <span>iPhone</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={deviceTab === "android"}
                    className={deviceTab === "android" ? "active" : ""}
                    onClick={() => setDeviceTab("android")}
                  >
                    <Smartphone size={13} />
                    <span>Android</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={deviceTab === "desktop"}
                    className={deviceTab === "desktop" ? "active" : ""}
                    onClick={() => setDeviceTab("desktop")}
                  >
                    <Laptop size={13} />
                    <span>Desktop</span>
                  </button>
                </div>

                <div className="install-steps-box" key={deviceTab}>
                  {deviceTab === "ios" ? (
                    <>
                      <div className="install-step">
                        <span className="step-num">1</span>
                        <p>
                          Tap <Share size={14} className="inline-icon" /> <strong>Share</strong> in
                          your Safari bar
                        </p>
                      </div>
                      <div className="install-step">
                        <span className="step-num">2</span>
                        <p>
                          Pick <PlusSquare size={14} className="inline-icon" />{" "}
                          <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>
                        </p>
                      </div>
                    </>
                  ) : deviceTab === "android" ? (
                    <>
                      <div className="install-step">
                        <span className="step-num">1</span>
                        <p>
                          Open your browser menu (<strong>⋮</strong>) in Chrome or Edge
                        </p>
                      </div>
                      <div className="install-step">
                        <span className="step-num">2</span>
                        <p>
                          Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="install-step">
                        <span className="step-num">1</span>
                        <p>
                          {isMacSafari
                            ? "Open Safari's File menu at the top of your screen"
                            : "Click the Install icon on the right side of your address bar"}
                        </p>
                      </div>
                      <div className="install-step">
                        <span className="step-num">2</span>
                        <p>
                          {isMacSafari ? (
                            <>
                              Select <strong>Add to Dock</strong> to launch {BRAND} like an app
                            </>
                          ) : (
                            <>
                              Confirm <strong>Install {BRAND}</strong> to pin it to your desktop
                            </>
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div className="onboarding-actions">
              <Button className="onboarding-cta" onClick={handleInstallClick} disabled={installing}>
                <Download size={17} />
                <span>
                  {canNativeInstall
                    ? installing
                      ? "Opening installer..."
                      : "Add to Home Screen"
                    : deviceTab === "desktop"
                      ? "Show Install Steps"
                      : "Got it, Add to Home Screen"}
                </span>
              </Button>
              {!canNativeInstall && !isPhoneDevice ? (
                <Button variant="ghost" className="onboarding-skip" onClick={handleCloseInstall}>
                  Continue in browser
                </Button>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="offline-banner" role="status">
      <WifiOff size={15} />
      <span>You are offline — showing cached campus listings</span>
    </div>
  );
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse/i;
const IN_APP_BROWSER_PATTERN = /FBAN|FBAV|Instagram|Snapchat|TikTok|Line\/|MicroMessenger|; wv\)/i;

/**
 * Phones only: if the site is opened in a normal browser tab (not from the
 * Home Screen icon), block the app behind an "Install to continue" screen.
 * Search engine bots, link-preview bots, desktops, tablets-as-desktop and the
 * admin area are never blocked.
 */
export function InstallGate() {
  const { isIOS, canNativeInstall, triggerNativeInstall } = useCampus();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [blocked, setBlocked] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || "";
    const isPhone = /iPhone|iPod|Android.+Mobile|Mobile.+Android/i.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInAppBrowser(IN_APP_BROWSER_PATTERN.test(ua));
    setBlocked(isPhone && !standalone && !BOT_PATTERN.test(ua));

    const onInstalled = () => setBlocked(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  if (!blocked || pathname.startsWith("/admin")) return null;

  async function handleInstall() {
    if (!canNativeInstall) return;
    setInstalling(true);
    const outcome = await triggerNativeInstall();
    setInstalling(false);
    if (outcome === "accepted") {
      toast.success(`${BRAND} added to your device`);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Install ${BRAND}`}
      className="fixed inset-0 z-[2147483000] flex items-center justify-center overflow-y-auto bg-background p-6"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <img
          src="/pwa-192x192.png"
          alt={`${BRAND} app icon`}
          width={84}
          height={84}
          className="rounded-2xl shadow-lg"
        />
        <h1 className="text-2xl font-bold">Install {BRAND} to continue</h1>
        <p className="text-sm text-muted-foreground">
          {BRAND} works as an app on your phone. Add it to your Home Screen, then open it from the
          icon. It is free and takes 10 seconds.
        </p>

        {inAppBrowser ? (
          <div className="install-steps-box w-full text-left">
            <div className="install-step">
              <span className="step-num">1</span>
              <p>
                You are inside another app's browser. Tap the <strong>⋯</strong> or Share menu and
                choose <strong>Open in {isIOS ? "Safari" : "Chrome"}</strong>.
              </p>
            </div>
            <div className="install-step">
              <span className="step-num">2</span>
              <p>Then {isIOS ? "tap Share, then Add to Home Screen" : "tap Install app"}.</p>
            </div>
          </div>
        ) : isIOS ? (
          <div className="install-steps-box w-full text-left">
            <div className="install-step">
              <span className="step-num">1</span>
              <p>
                Tap <Share size={14} className="inline-icon" /> <strong>Share</strong> at the bottom
                of Safari
              </p>
            </div>
            <div className="install-step">
              <span className="step-num">2</span>
              <p>
                Choose <PlusSquare size={14} className="inline-icon" />{" "}
                <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>
              </p>
            </div>
            <div className="install-step">
              <span className="step-num">3</span>
              <p>
                Open <strong>{BRAND}</strong> from your Home Screen
              </p>
            </div>
          </div>
        ) : (
          <>
            {canNativeInstall ? (
              <Button
                className="onboarding-cta w-full"
                onClick={handleInstall}
                disabled={installing}
              >
                <Download size={17} />
                <span>{installing ? "Opening installer..." : "Install app"}</span>
              </Button>
            ) : (
              <div className="install-steps-box w-full text-left">
                <div className="install-step">
                  <span className="step-num">1</span>
                  <p>
                    Open your browser menu (<strong>⋮</strong>) in Chrome
                  </p>
                </div>
                <div className="install-step">
                  <span className="step-num">2</span>
                  <p>
                    Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground">
          Already installed? Open {BRAND} from its icon on your Home Screen.
        </p>
      </div>
    </div>
  );
}
