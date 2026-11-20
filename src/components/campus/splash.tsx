import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "./shared";
import { useCampus } from "./store";
import { BRAND } from "@/lib/campus/data";

const MIN_SHOW_MS = 1900;
const REDUCED_MOTION_MS = 700;
const LEAVE_MS = 480;

/**
 * Animated launch screen. It plays every time the app is opened (a full page load),
 * and then sends people to the right place:
 *  - signed in  -> Discover (when they opened the app at "/")
 *  - signed out -> the Welcome / sign in screen at "/"
 * Links to other pages are left alone.
 */
export function LaunchSplash() {
  const { user, authLoading } = useCampus();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [minDone, setMinDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setMinDone(true), reduced ? REDUCED_MOTION_MS : MIN_SHOW_MS);
    // Safety net: never keep people waiting longer than 5 seconds.
    const hardStop = window.setTimeout(() => setMinDone(true), 5000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(hardStop);
    };
  }, []);

  useEffect(() => {
    if (doneRef.current || !minDone) return;
    if (authLoading) return;
    doneRef.current = true;
    if (path === "/" && user) {
      void navigate({ to: user.role === "admin" ? "/admin" : "/discover", replace: true });
    }
    setLeaving(true);
    const t = window.setTimeout(() => setVisible(false), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [minDone, authLoading, user, path, navigate]);

  // If the sign-in check hangs, leave anyway after 6 seconds.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setLeaving(true);
        window.setTimeout(() => setVisible(false), LEAVE_MS);
      }
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`launch-splash ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-label={`${BRAND} is loading`}
    >
      <div className="ls-glow ls-glow-a" aria-hidden="true" />
      <div className="ls-glow ls-glow-b" aria-hidden="true" />
      <div className="ls-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="ls-center">
        <div className="ls-emblem">
          <BrandMark size={72} animated />
        </div>
        <h1 className="ls-wordmark">
          {BRAND}
          <span>.</span>
        </h1>
        <p className="ls-tagline">Ghana&apos;s university campus marketplace</p>
        <div className="ls-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
