import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Download, Plus, Share } from "lucide-react";
import { toast } from "sonner";
import { useCampus } from "./store";
import { BRAND } from "@/lib/campus/data";

/**
 * Full-screen "add to Home Screen" gate for phones.
 * It is fully self-contained (inline styles, fixed to the screen) so no other stylesheet
 * change can ever push it down the page or let people scroll past it.
 */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|headless|prerender/i;
const IN_APP_BROWSER_PATTERN = /FBAN|FBAV|Instagram|Snapchat|TikTok|Line\/|MicroMessenger|; wv\)/i;

const overlay: CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2147483000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  background: "var(--background, #f8f8f5)",
  color: "var(--foreground, #111827)",
  padding: "max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom))",
};

const stepBox: CSSProperties = {
  width: "100%",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 16,
  borderRadius: 20,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e5e7eb)",
};

const stepRow: CSSProperties = { display: "flex", alignItems: "flex-start", gap: 12 };

const stepNum: CSSProperties = {
  flexShrink: 0,
  width: 26,
  height: 26,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  fontSize: 13,
  fontWeight: 800,
  color: "#fff",
  background: "#4965f5",
};

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div style={stepRow}>
      <span style={stepNum}>{n}</span>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45 }}>{children}</p>
    </div>
  );
}

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
    const check = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setBlocked(isPhone && !standalone && !BOT_PATTERN.test(ua));
    };
    setInAppBrowser(IN_APP_BROWSER_PATTERN.test(ua));
    check();
    const onInstalled = () => setBlocked(false);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("pageshow", check);
    return () => {
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("pageshow", check);
    };
  }, []);

  const visible = blocked && !pathname.startsWith("/admin");

  // Lock the page behind the gate so nothing can be scrolled or tapped underneath.
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [visible]);

  if (!visible) return null;

  async function handleInstall() {
    if (!canNativeInstall) return;
    setInstalling(true);
    const outcome = await triggerNativeInstall();
    setInstalling(false);
    if (outcome === "accepted") toast.success(`${BRAND} added to your device`);
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={`Install ${BRAND}`} style={overlay}>
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          textAlign: "center",
        }}
      >
        <img
          src="/pwa-192x192.png"
          alt={`${BRAND} app icon`}
          width={84}
          height={84}
          style={{ borderRadius: 22, boxShadow: "0 12px 30px rgba(30,50,120,0.25)" }}
        />
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Install {BRAND} to continue
        </h2>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, opacity: 0.75 }}>
          {BRAND} runs as a fast full-screen app on your phone. Add it to your Home Screen, then
          open it from the icon. It is free and takes 10 seconds.
        </p>

        {inAppBrowser ? (
          <div style={stepBox}>
            <Step n={1}>
              You are inside another app&apos;s browser. Tap the <strong>⋯</strong> or Share menu
              and choose <strong>Open in {isIOS ? "Safari" : "Chrome"}</strong>.
            </Step>
            <Step n={2}>
              Then {isIOS ? "tap Share, then Add to Home Screen" : "tap Install app"}.
            </Step>
          </div>
        ) : isIOS ? (
          <div style={stepBox}>
            <Step n={1}>
              Tap <Share size={14} style={{ display: "inline", verticalAlign: "-2px" }} />{" "}
              <strong>Share</strong> in Safari (the <strong>⋯</strong> menu on newer iPhones)
            </Step>
            <Step n={2}>
              Choose <Plus size={14} style={{ display: "inline", verticalAlign: "-2px" }} />{" "}
              <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>
            </Step>
            <Step n={3}>
              Open <strong>{BRAND}</strong> from your Home Screen
            </Step>
          </div>
        ) : canNativeInstall ? (
          <button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            style={{
              width: "100%",
              height: 52,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: 0,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(120deg,#4965f5,#7b61ff)",
              opacity: installing ? 0.7 : 1,
            }}
          >
            <Download size={17} />
            {installing ? "Opening installer..." : "Install app"}
          </button>
        ) : (
          <div style={stepBox}>
            <Step n={1}>
              Open your browser menu (<strong>⋮</strong>) in Chrome
            </Step>
            <Step n={2}>
              Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
            </Step>
          </div>
        )}

        <p style={{ margin: 0, fontSize: 12.5, opacity: 0.65 }}>
          Already installed? Open {BRAND} from its icon on your Home Screen.
        </p>
      </div>
    </div>
  );
}
