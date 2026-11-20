import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  ChevronDown,
  Compass,
  ShoppingBag,
  Briefcase,
  Plus,
  UserRound,
  Bookmark,
  Search,
  Heart,
  X,
  LayoutDashboard,
  Shield,
  Sun,
  Moon,
  Check,
  Bell,
  BellRing,
  Globe,
  GraduationCap,
  MessageCircle,
  Phone,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCampus } from "./store";
import {
  BRAND,
  buildPhoneHref,
  buildWhatsAppUrl,
  formatListingPrice,
  isSafeMediaUrl,
  type Listing,
} from "@/lib/campus/data";

export function BrandMark({ size = 34, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={animated ? "brand-mark-animated" : undefined}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <path
        className="brand-loop-stroke"
        d="M22.5 41.5C17.25 41.5 13 37.25 13 32C13 26.75 17.25 22.5 22.5 22.5C27.2 22.5 30.2 25.9 32 32C33.8 38.1 36.8 41.5 41.5 41.5C46.75 41.5 51 37.25 51 32C51 26.75 46.75 22.5 41.5 22.5C37.9 22.5 35.3 24.5 33.7 28"
        stroke="#FFFFFF"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="brand-loop-node" cx="41.5" cy="32" r="2.8" fill="#FFFFFF" />
    </svg>
  );
}

export function HeroAmbient() {
  return (
    <div className="hero-ambient" aria-hidden="true">
      <span className="hero-orb hero-orb-a" />
      <span className="hero-orb hero-orb-b" />
      <span className="hero-orb hero-orb-c" />
      <svg
        className="panel-curve-line hero-wave-svg"
        viewBox="0 0 720 140"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          className="wave-primary"
          d="M0 96 C 140 24, 300 132, 480 56 C 580 14, 655 34, 720 62"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          className="wave-secondary"
          d="M0 54 C 165 118, 340 16, 520 88 C 605 120, 670 84, 720 44"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          className="wave-shimmer"
          d="M0 118 C 190 76, 360 128, 545 48 C 625 14, 682 28, 720 46"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export type SelectOption = {
  value: string;
  label: string;
  description?: string | undefined;
  tone?: "success" | "warning" | "muted" | "primary" | undefined;
};

export function AnimatedSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  placeholder = "Choose option",
  ariaLabel,
  icon,
  kicker,
  variant = "field",
  align = "start",
  className = "",
}: {
  options: ReadonlyArray<string | SelectOption>;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  ariaLabel?: string | undefined;
  icon?: ReactNode | undefined;
  kicker?: string | undefined;
  variant?: "field" | "filter" | "status" | undefined;
  align?: "start" | "center" | "end" | undefined;
  className?: string | undefined;
}) {
  const normalized: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? normalized[0]?.value ?? "",
  );
  const [open, setOpen] = useState(false);

  const currentValue = isControlled ? value : internalValue;
  const selectedOption = normalized.find((o) => o.value === currentValue);
  const displayLabel = selectedOption?.label || currentValue || placeholder;

  function choose(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
    setOpen(false);
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={currentValue} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`ui-dropdown-trigger variant-${variant} ${className}`}
            data-open={open}
            data-tone={selectedOption?.tone}
            aria-label={ariaLabel || placeholder}
            aria-expanded={open}
          >
            {icon && (
              <span className="ui-dropdown-lead-icon" aria-hidden="true">
                {icon}
              </span>
            )}
            {selectedOption?.tone && (
              <span
                className={`ui-dropdown-tone-dot tone-${selectedOption.tone}`}
                aria-hidden="true"
              />
            )}
            <span className="ui-dropdown-label">{displayLabel}</span>
            <ChevronDown size={14} className="ui-dropdown-chevron" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          sideOffset={8}
          className={`ui-dropdown-panel variant-${variant}`}
          aria-label={ariaLabel || kicker || "Options"}
        >
          {kicker && <span className="ui-dropdown-kicker">{kicker}</span>}
          <div className="ui-dropdown-list" role="listbox" aria-label={ariaLabel || kicker}>
            {normalized.map((opt, idx) => {
              const active = opt.value === currentValue;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  key={opt.value}
                  style={{ "--opt-index": idx } as CSSProperties}
                  className={`ui-dropdown-option ${active ? "active" : ""}`}
                  onClick={() => choose(opt.value)}
                >
                  {opt.tone && (
                    <span className={`ui-dropdown-tone-dot tone-${opt.tone}`} aria-hidden="true" />
                  )}
                  <span className="ui-dropdown-option-text">
                    <strong>{opt.label}</strong>
                    {opt.description && <small>{opt.description}</small>}
                  </span>
                  {active && (
                    <span className="ui-dropdown-check" aria-hidden="true">
                      <Check size={12} strokeWidth={2.7} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();

  function handleLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (path === "/discover") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("campusloop:discover-refresh"));
      }
      void router.invalidate();
    }
  }

  return (
    <Link
      to="/discover"
      onClick={handleLogoClick}
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <span className="brand-symbol">
        <BrandMark size={34} />
      </span>
      <span>
        {BRAND}
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useCampus();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${compact ? "compact" : ""}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-icon">{isDark ? <Sun size={17} /> : <Moon size={17} />}</span>
    </button>
  );
}

export function UniversitySelect({ compact = false }: { compact?: boolean }) {
  const { university, setUniversity, myUniversity, universityNames } = useCampus();
  const [open, setOpen] = useState(false);

  const label = university === "All Universities" ? "All Campuses" : university;

  function choose(value: string) {
    setUniversity(value);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`university-select-trigger ${compact ? "compact" : ""}`}
          data-open={open}
          aria-label="Choose campus location"
          aria-expanded={open}
        >
          <span className="uni-pin-orb" aria-hidden="true">
            <MapPin size={13} strokeWidth={2.25} />
          </span>
          <span className="uni-trigger-label">{label}</span>
          <ChevronDown size={13} className="uni-trigger-chevron" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="university-popover-panel"
        aria-label="Campus locations"
      >
        <div className="uni-pop-section">
          <span className="uni-pop-kicker">My Campus</span>
          <button
            type="button"
            className={`uni-option-btn ${university === myUniversity ? "active" : ""}`}
            onClick={() => choose(myUniversity)}
          >
            <span className="uni-option-icon">
              <GraduationCap size={15} />
            </span>
            <span className="uni-option-text">
              <strong>{myUniversity}</strong>
              <small>Home university</small>
            </span>
            {university === myUniversity && (
              <span className="uni-option-check">
                <Check size={13} strokeWidth={2.6} />
              </span>
            )}
          </button>
        </div>

        <div className="uni-pop-section">
          <span className="uni-pop-kicker">Browse Scope</span>
          <button
            type="button"
            className={`uni-option-btn ${university === "All Universities" ? "active" : ""}`}
            onClick={() => choose("All Universities")}
          >
            <span className="uni-option-icon globe">
              <Globe size={15} />
            </span>
            <span className="uni-option-text">
              <strong>All Universities</strong>
              <small>Every campus in Ghana</small>
            </span>
            {university === "All Universities" && (
              <span className="uni-option-check">
                <Check size={13} strokeWidth={2.6} />
              </span>
            )}
          </button>
        </div>

        <div className="uni-pop-section">
          <span className="uni-pop-kicker">Switch Campus</span>
          <div className="uni-pop-list">
            {universityNames
              .filter((u) => u !== myUniversity)
              .map((u) => {
                const isSelected = university === u;
                return (
                  <button
                    type="button"
                    key={u}
                    className={`uni-option-pill ${isSelected ? "active" : ""}`}
                    onClick={() => choose(u)}
                  >
                    <MapPin size={12} />
                    <span>{u}</span>
                    {isSelected && <Check size={12} strokeWidth={2.6} />}
                  </button>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const {
    user,
    saved,
    pushState,
    pushChecked,
    unreadNotificationCount,
    openNotifPrompt,
    requestAppNotifications,
    openInstallPrompt,
    isStandalone,
  } = useCampus();
  const navigate = useNavigate();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });

  function handleHeaderNotifClick() {
    if (pushState === "on") {
      if (user) {
        void navigate({ to: "/dashboard" });
      } else {
        toast.success("Notifications are active on this device");
      }
      return;
    }
    openNotifPrompt();
  }

  async function handleQuickEnablePush() {
    const result = await requestAppNotifications();
    if (result === "granted") {
      toast.success("Notifications turned on for this device");
    } else if (result === "denied") {
      openNotifPrompt();
    } else if (result === "unsupported") {
      openNotifPrompt();
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || typeof router.preloadRoute !== "function") return;
    const warmRoutes = () => {
      const targets = [
        "/discover",
        "/products",
        "/services",
        "/profile",
        ...(user ? ["/dashboard"] : []),
      ];
      for (const to of targets) {
        if (to !== path) {
          void router.preloadRoute({ to }).catch(() => undefined);
        }
      }
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(warmRoutes, { timeout: 600 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(warmRoutes, 150);
    return () => window.clearTimeout(t);
  }, [path, router, user]);

  const nav = [
    { to: "/discover" as const, label: "Discover", icon: Compass },
    { to: "/products" as const, label: "Products", icon: ShoppingBag },
    { to: "/services" as const, label: "Services", icon: Briefcase },
  ];

  const leftDock = [
    { to: "/discover" as const, label: "Discover", icon: Compass },
    { to: "/products" as const, label: "Products", icon: ShoppingBag },
  ];

  const rightDock = [
    { to: "/services" as const, label: "Services", icon: Briefcase },
    { to: "/profile" as const, label: "Profile", icon: UserRound },
  ];

  return (
    <div className="app-shell">
      <header className="app-header-wrap">
        <div className="app-header">
          <div className="header-inner">
            <Logo />

            <nav className="desktop-nav" aria-label="Main navigation">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={path === n.to ? "nav-link active" : "nav-link"}
                >
                  <n.icon size={15} />
                  <span>{n.label}</span>
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  className={path === "/dashboard" ? "nav-link active" : "nav-link"}
                >
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" className={path === "/admin" ? "nav-link active" : "nav-link"}>
                  <Shield size={15} />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            <div className="header-actions">
              <UniversitySelect />
              <ThemeToggle compact />
              <button
                type="button"
                onClick={handleHeaderNotifClick}
                className={`header-icon-btn header-notif-btn ${
                  pushChecked && pushState !== "on" ? "needs-attention" : ""
                }`}
                title={
                  pushState === "on"
                    ? unreadNotificationCount > 0
                      ? `Notifications · ${unreadNotificationCount} unread`
                      : "Notifications are on"
                    : "Turn on your notifications"
                }
                aria-label={pushState === "on" ? "Notifications" : "Turn on your notifications"}
              >
                {pushChecked && pushState !== "on" ? <BellRing size={17} /> : <Bell size={17} />}
                {pushState === "on" && unreadNotificationCount > 0 && (
                  <span className="save-count">{unreadNotificationCount}</span>
                )}
                {pushChecked && pushState !== "on" && (
                  <span className="header-notif-dot" aria-hidden="true" />
                )}
              </button>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="header-icon-btn header-admin-btn"
                  title="Admin Command Center"
                  aria-label="Admin Command Center"
                >
                  <Shield size={16} />
                </Link>
              )}
              <Button
                className="desktop-post"
                onClick={() => navigate({ to: user ? "/post" : "/auth" })}
              >
                <Plus size={15} />
                <span>Post</span>
              </Button>
              <Link
                to="/profile"
                className="header-icon-btn header-profile-btn"
                title={saved.length > 0 ? `Profile · ${saved.length} saved` : "Your profile"}
                aria-label="Your profile"
              >
                <UserRound size={17} />
                {saved.length > 0 && <span className="save-count">{saved.length}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="market-main">
        {pushChecked && pushState !== "on" && (
          <div className="notif-persistent-bar" role="region" aria-label="Turn on notifications">
            <span className="notif-persistent-icon" aria-hidden="true">
              <BellRing size={16} />
            </span>
            <div className="notif-persistent-copy">
              <strong>
                {pushState === "blocked"
                  ? "Notifications are blocked in device settings"
                  : pushState === "unsupported" && !isStandalone
                    ? "Add CampusLoop to Home Screen for alerts"
                    : "Turn on your notifications"}
              </strong>
              <span>
                {pushState === "blocked"
                  ? "Allow CampusLoop notifications in site settings so updates reach your phone."
                  : pushState === "unsupported" && !isStandalone
                    ? "Open from your Home Screen icon to turn on phone notifications."
                    : "Get CampusLoop messages and updates on your device even when closed."}
              </span>
            </div>
            <button
              type="button"
              className="notif-persistent-btn"
              onClick={() => {
                if (pushState === "off") {
                  void handleQuickEnablePush();
                } else if (pushState === "unsupported" && !isStandalone) {
                  openInstallPrompt();
                } else {
                  openNotifPrompt();
                }
              }}
            >
              {pushState === "blocked"
                ? "Fix"
                : pushState === "unsupported" && !isStandalone
                  ? "Install app"
                  : "Turn on"}
            </button>
          </div>
        )}
        {children}
      </main>

      <footer className="market-footer-wrap">
        <div className="market-footer surface-panel">
          <Logo />
          <div className="footer-links">
            <Link to="/manual">User Manual</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <span className="footer-copy">
            © {new Date().getFullYear()} {BRAND} · Ghana Campus Marketplace
          </span>
        </div>
      </footer>

      <nav className="floating-bottom-nav" aria-label="Mobile navigation">
        <div className="floating-dock-inner">
          {leftDock.map((n) => {
            const active = path === n.to;
            return (
              <Link
                to={n.to}
                key={n.to}
                className={active ? "dock-item active" : "dock-item"}
                aria-label={n.label}
                title={n.label}
                aria-current={active ? "page" : undefined}
              >
                <span className="dock-icon-wrap">
                  <n.icon size={23} strokeWidth={active ? 2.85 : 2.35} />
                </span>
                {active && <span className="dock-active-dot" aria-hidden="true" />}
              </Link>
            );
          })}

          <button
            type="button"
            className="dock-post"
            onClick={() => navigate({ to: user ? "/post" : "/auth" })}
            aria-label="Post a listing"
            title="Post a listing"
          >
            <span className="dock-post-orb">
              <Plus size={26} strokeWidth={2.9} />
            </span>
          </button>

          {rightDock.map((n) => {
            const active = path === n.to;
            const showSavedDot = n.to === "/profile" && saved.length > 0;
            return (
              <Link
                to={n.to}
                key={n.to}
                className={active ? "dock-item active" : "dock-item"}
                aria-label={n.label}
                title={n.label}
                aria-current={active ? "page" : undefined}
              >
                <span className="dock-icon-wrap">
                  <n.icon size={23} strokeWidth={active ? 2.85 : 2.35} />
                  {showSavedDot && <span className="dock-badge" aria-hidden="true" />}
                </span>
                {active && <span className="dock-active-dot" aria-hidden="true" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageBackButton({
  fallbackTo = "/discover",
  label = "Back",
  className = "",
}: {
  fallbackTo?: "/discover" | "/products" | "/services" | "/profile" | "/dashboard" | "/auth" | "/";
  label?: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      const historyApi = (router as { history?: { back?: () => void } }).history;
      if (typeof historyApi?.back === "function") {
        historyApi.back();
        return;
      }
      window.history.back();
      return;
    }
    navigate({ to: fallbackTo });
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`page-back-btn ${className}`.trim()}
      aria-label={label}
    >
      <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export function ListingCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const { saved, toggleSave, recordContact } = useCampus();
  const [imgFailed, setImgFailed] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const isSaved = saved.includes(listing.id);
  const hasPrice = listing.type === "product" || listing.price > 0;
  const isService = listing.type === "service";
  const enquiryText = `Hi ${listing.seller}, I saw “${listing.title}” on CampusLoop. Is it still available?`;
  const whatsappUrl = buildWhatsAppUrl(listing.contact, enquiryText);
  const phoneHref = buildPhoneHref(listing.contact);

  const safeImage = isSafeMediaUrl(listing.image) ? listing.image : "";

  function handleQuickAction() {
    recordContact(listing.id, listing.contactMethod || "WhatsApp");
    setQuickOpen(true);
  }

  return (
    <>
      <article className={`listing-card ${compact ? "compact" : ""}`}>
        <div className="listing-image">
          <Link to="/listing/$id" params={{ id: listing.id }} aria-label={`View ${listing.title}`}>
            {!imgFailed && safeImage ? (
              <img
                src={safeImage}
                alt={listing.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                width={1024}
                height={1024}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="listing-image-fallback">
                {isService ? <Briefcase size={26} /> : <ShoppingBag size={26} />}
                <span>{listing.category}</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            className={`save-button ${isSaved ? "saved" : ""}`}
            onClick={() => toggleSave(listing.id)}
            aria-label={`${isSaved ? "Unsave" : "Save"} ${listing.title}`}
            title="Save listing"
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="listing-info">
          <Link to="/listing/$id" params={{ id: listing.id }}>
            <h3>{listing.title}</h3>
          </Link>
          <p className={`listing-price ${!hasPrice ? "on-request" : ""}`}>
            {isService && hasPrice && listing.priceType !== "Free" && <small>From </small>}
            {formatListingPrice(listing)}
            {isService && <ArrowUpRight size={15} />}
          </p>
          <p className="listing-location">
            <MapPin size={12} />
            <span>
              {listing.audience.includes("All Universities")
                ? "All Universities"
                : listing.audience.length > 1
                  ? `${listing.audience.length} Campuses`
                  : listing.university}
            </span>
          </p>
          <button
            type="button"
            className={`listing-cta-btn ${isService ? "is-service" : "is-product"}`}
            onClick={handleQuickAction}
          >
            {isService ? (
              <>
                <MessageCircle size={13} strokeWidth={2.2} />
                <span>Contact</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} strokeWidth={2.2} />
                <span>Get now</span>
              </>
            )}
          </button>
        </div>
      </article>

      {quickOpen && (
        <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
          <DialogContent className="mobile-dialog onboarding-dialog">
            <DialogTitle>
              {isService ? `Contact ${listing.seller}` : `Get ${listing.title}`}
            </DialogTitle>
            <DialogDescription>
              {isService
                ? "Reach out directly on campus to discuss availability and booking."
                : "Connect directly with the seller to inspect and pick up on campus."}
            </DialogDescription>
            <div className="modal-body">
              <div className="quick-listing-preview">
                {!imgFailed && safeImage ? (
                  <img src={safeImage} alt={listing.title} />
                ) : (
                  <span className="quick-listing-thumb-fallback">
                    {isService ? <Briefcase size={18} /> : <ShoppingBag size={18} />}
                  </span>
                )}
                <div className="quick-listing-meta">
                  <small>
                    {listing.category} · {listing.university}
                  </small>
                  <strong>{listing.title}</strong>
                  <span>{formatListingPrice(listing)}</span>
                </div>
              </div>

              <div className="contact-method">
                <MessageCircle size={20} />
                <div>
                  <strong>{listing.contactMethod || "WhatsApp"}</strong>
                  <small>{listing.contact || "Contact available via seller"}</small>
                </div>
                <Check className="ml-auto" size={16} />
              </div>

              {phoneHref && (
                <a href={phoneHref} className="contact-method">
                  <Phone size={20} />
                  <div>
                    <strong>Call directly</strong>
                    <small>{listing.contact}</small>
                  </div>
                  <ExternalLink className="ml-auto" size={15} />
                </a>
              )}

              <div className="modal-actions">
                {whatsappUrl ? (
                  <Button asChild className="onboarding-cta">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        toast.success(`Opening WhatsApp chat with ${listing.seller}`);
                        setQuickOpen(false);
                      }}
                    >
                      <ExternalLink size={16} />
                      Message on WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button
                    className="onboarding-cta"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(enquiryText);
                        toast.success("Enquiry copied — reach out via seller contact");
                      } catch {
                        toast.error("Copy failed — reach out using the contact details above");
                      }
                      setQuickOpen(false);
                    }}
                  >
                    <ExternalLink size={16} />
                    Message on WhatsApp
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(enquiryText);
                      toast.success("Enquiry message copied");
                    } catch {
                      toast.error("Could not copy message automatically");
                    }
                  }}
                >
                  <Copy size={16} />
                  Copy enquiry message
                </Button>
                <Button
                  variant="ghost"
                  className="onboarding-skip"
                  asChild
                  onClick={() => setQuickOpen(false)}
                >
                  <Link to="/listing/$id" params={{ id: listing.id }}>
                    View full listing details
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products, services, sellers...",
  suggestions = [],
  onSelectSuggestion,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suggestions?: Array<{ id: string; title: string; type: "product" | "service" }>;
  onSelectSuggestion?: ((item: { id: string; title: string }) => void) | undefined;
}) {
  const [focused, setFocused] = useState(false);
  const blurTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current !== undefined) {
        window.clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative z-10">
      <div className="search-bar">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label="Search marketplace"
          placeholder={placeholder}
          value={value}
          onFocus={() => {
            if (blurTimerRef.current !== undefined) {
              window.clearTimeout(blurTimerRef.current);
            }
            setFocused(true);
          }}
          onBlur={() => {
            blurTimerRef.current = window.setTimeout(() => setFocused(false), 140);
          }}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={() => onChange("")}
          >
            <X size={17} />
          </Button>
        )}
      </div>
      {focused && value.trim().length >= 2 && suggestions.length > 0 && (
        <div
          className="surface-panel mt-2 p-2 flex flex-col gap-1"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              role="option"
              aria-selected={false}
              className="ui-dropdown-option"
              onMouseDown={(e) => {
                e.preventDefault();
                if (onSelectSuggestion) {
                  onSelectSuggestion(s);
                } else {
                  onChange(s.title);
                }
                setFocused(false);
              }}
            >
              <span className="ui-dropdown-option-text">
                <strong>{s.title}</strong>
                <small>{s.type === "service" ? "Service" : "Product"}</small>
              </span>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="section-kicker">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function Empty({
  title = "No matches found",
  text = "Try another campus, category or search.",
  children,
}: {
  title?: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state surface-panel">
      <span className="empty-orb">
        <Search size={24} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}

export function BrowseLink({ service = false }: { service?: boolean }) {
  return (
    <Link className="text-link" to={service ? "/services" : "/products"}>
      See all <ArrowRight size={15} />
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-intro">
      {eyebrow && <span className="section-kicker">{eyebrow}</span>}
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export function Likes({ id }: { id: string }) {
  const { liked, toggleLike } = useCampus();
  const isLiked = liked.includes(id);
  return (
    <Button variant="outline" onClick={() => toggleLike(id)}>
      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      {isLiked ? "Liked" : "Like"}
    </Button>
  );
}

export function SaveButton({ id }: { id: string }) {
  const { saved, toggleSave } = useCampus();
  const isSaved = saved.includes(id);
  return (
    <Button variant={isSaved ? "secondary" : "outline"} onClick={() => toggleSave(id)}>
      <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}

export function PagePendingFallback() {
  return (
    <Shell>
      <section
        className="surface-panel hero-panel curve-accent route-skeleton-hero"
        aria-busy="true"
      >
        <HeroAmbient />
        <div className="route-skeleton-bar w-28 h-3" />
        <div className="route-skeleton-bar w-64 h-7 mt-3" />
        <div className="route-skeleton-bar w-full h-12 mt-4 rounded-full" />
      </section>
      <section className="surface-panel section-panel" aria-hidden="true">
        <div className="listing-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="route-skeleton-card" />
          ))}
        </div>
      </section>
    </Shell>
  );
}
