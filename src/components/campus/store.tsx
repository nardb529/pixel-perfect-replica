import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  productCategories as defaultProductCategories,
  serviceCategories as defaultServiceCategories,
  toUserSafeErrorMessage,
  universities as defaultUniversities,
  type Listing,
} from "@/lib/campus/data";
import {
  isSchemaMissingError,
  isSupabaseConfigured,
  resetVisitorSessionId,
} from "@/lib/supabase/client";
import { clearAnalyticsSessionCache } from "@/services/analyticsService";
import type { LiveSelfieChecks, VerificationChecksPayload } from "@/lib/campus/idVerification";
import {
  getPushNotificationState,
  getStoredPushOptIn,
  removePushSubscriptionForCurrentUser,
  setStoredPushOptIn,
  showDeviceNotification,
  syncPushSubscriptionForCurrentUser,
  type PushNotificationState,
} from "@/lib/campus/push";
import type {
  CategoryRecord,
  IdDocumentType,
  NotificationPreferences,
  NotificationRecord,
  ProfileRecord,
  ReportReason,
  SubscriptionStatus,
  SubscriptionTier,
  UniversityRecord,
  UserRole,
  VerificationStatus,
} from "@/lib/supabase/database.types";
import {
  analyticsService,
  authenticationService,
  categoryService,
  favoriteService,
  listingService,
  notificationService,
  profileService,
  reportService,
  universityService,
} from "@/services";

export type CampusUser = {
  id?: string | undefined;
  name: string;
  username?: string | undefined;
  email: string;
  university: string;
  primaryUniversityId?: string | null | undefined;
  capability: string;
  bio: string;
  contact: string;
  contactDetails?: string | undefined;
  phoneNumber?: string | null | undefined;
  whatsappNumber?: string | null | undefined;
  avatar?: string | undefined;
  bannerImage?: string | undefined;
  role?: UserRole | undefined;
  verificationStatus?: VerificationStatus | undefined;
  isStudent?: boolean | undefined;
  idDocumentType?: IdDocumentType | null | undefined;
  idDocumentPath?: string | null | undefined;
  verificationPhotoConfirmed?: boolean | undefined;
  verificationSubmittedAt?: string | null | undefined;
  verificationNote?: string | null | undefined;
  verificationChecks?: VerificationChecksPayload | LiveSelfieChecks | null | undefined;
  isSuspended?: boolean | undefined;
  subscriptionTier?: SubscriptionTier | undefined;
  subscriptionStatus?: SubscriptionStatus | undefined;
  subscriptionExpiresAt?: string | null | undefined;
  notificationPreferences?: NotificationPreferences | undefined;
};

export type ThemeMode = "light" | "dark";
export type SellerPostAuthStage = "none" | "notifications" | "install";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const NOTIF_PROMPTED_KEY = "cl_notif_prompted_v1";
const THEME_STORAGE_KEY = "cl_theme_v1";
const LISTINGS_SWR_KEY = "cl_listings_swr_v1";
const LISTINGS_SWR_TTL_MS = 5 * 60 * 1000;

function readCachedAllListings(): Listing[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LISTINGS_SWR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt?: number; items?: Listing[] };
    if (
      typeof parsed?.expiresAt === "number" &&
      parsed.expiresAt > Date.now() &&
      Array.isArray(parsed.items) &&
      parsed.items.length > 0
    ) {
      return parsed.items;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

function writeCachedAllListings(items: Listing[]): void {
  if (typeof window === "undefined" || items.length === 0) return;
  try {
    window.sessionStorage.setItem(
      LISTINGS_SWR_KEY,
      JSON.stringify({ expiresAt: Date.now() + LISTINGS_SWR_TTL_MS, items }),
    );
  } catch {
    // Ignore storage quota errors
  }
}

function mapProfileToUser(profile: ProfileRecord, uniList: UniversityRecord[]): CampusUser {
  const matchedUni = uniList.find((u) => u.id === profile.primary_university_id);
  const universityName = matchedUni?.short_name || matchedUni?.university_name || "Ghana Campus";
  return {
    id: profile.id,
    name: profile.full_name,
    username: profile.username,
    email: profile.email,
    university: universityName,
    primaryUniversityId: profile.primary_university_id,
    capability: profile.account_type,
    bio: profile.bio || "",
    contact: profile.preferred_contact_method || "WhatsApp",
    contactDetails: profile.whatsapp_number || profile.phone_number || undefined,
    phoneNumber: profile.phone_number,
    whatsappNumber: profile.whatsapp_number,
    avatar: profile.profile_image || undefined,
    bannerImage: profile.banner_image || undefined,
    role: profile.role,
    verificationStatus: profile.verification_status,
    isStudent: profile.is_student,
    idDocumentType: profile.id_document_type,
    idDocumentPath: profile.id_document_path,
    verificationPhotoConfirmed: profile.verification_photo_confirmed,
    verificationSubmittedAt: profile.verification_submitted_at,
    verificationNote: profile.verification_note,
    verificationChecks: profile.verification_checks ?? null,
    isSuspended: profile.is_suspended,
    subscriptionTier: profile.subscription_tier ?? "free_launch",
    subscriptionStatus: profile.subscription_status ?? "active",
    subscriptionExpiresAt: profile.subscription_expires_at ?? null,
    notificationPreferences: profile.notification_preferences,
  };
}

type Store = {
  backendConfigured: boolean;
  schemaReady: boolean;
  listingsLoading: boolean;
  listingsError: string | null;
  authLoading: boolean;
  university: string;
  setUniversity: (v: string) => void;
  myUniversity: string;
  setMyUniversity: (v: string) => void;
  dbUniversities: UniversityRecord[];
  universityNames: string[];
  dbCategories: CategoryRecord[];
  productCategoryNames: string[];
  serviceCategoryNames: string[];
  refreshMetadata: () => Promise<void>;
  refreshListings: () => Promise<void>;
  user: CampusUser | null;
  setUser: (v: CampusUser | null) => void;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<CampusUser | null>;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  myListings: Listing[];
  refreshMyListings: () => Promise<void>;
  saved: string[];
  toggleSave: (id: string) => void;
  liked: string[];
  toggleLike: (id: string) => void;
  contacts: string[];
  recordContact: (id: string, method?: string) => void;
  recordView: (id: string, source?: string) => void;
  reportListing: (id: string, reason: string, description?: string) => Promise<boolean>;
  notifications: NotificationRecord[];
  unreadNotificationCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  theme: ThemeMode;
  toggleTheme: () => void;
  isStandalone: boolean;
  isIOS: boolean;
  isMacSafari: boolean;
  canNativeInstall: boolean;
  triggerNativeInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  buyerInstallOpen: boolean;
  triggerBuyerInstallPrompt: () => void;
  closeBuyerInstallPrompt: () => void;
  sellerPostAuthStage: SellerPostAuthStage;
  triggerSellerPostAuth: () => void;
  completeNotificationStep: (enabled: boolean) => void;
  dismissSellerPrompts: () => void;
  manualInstallOpen: boolean;
  openInstallPrompt: () => void;
  closeInstallPrompt: () => void;
  notifPromptOpen: boolean;
  openNotifPrompt: () => void;
  closeNotifPrompt: () => void;
  notificationsEnabled: boolean;
  pushState: PushNotificationState;
  pushChecked: boolean;
  refreshPushState: () => Promise<PushNotificationState>;
  requestAppNotifications: () => Promise<"granted" | "denied" | "default" | "unsupported">;
  disableAppNotifications: () => Promise<PushNotificationState>;
};

const CampusContext = createContext<Store | null>(null);

function detectStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export function CampusProvider({ children }: { children: ReactNode }) {
  const [backendConfigured] = useState<boolean>(isSupabaseConfigured);
  const [schemaReady, setSchemaReady] = useState<boolean>(isSupabaseConfigured);
  const [listingsLoading, setListingsLoading] = useState<boolean>(isSupabaseConfigured);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(isSupabaseConfigured);
  const [myUniversity, setMyUniversity] = useState("KNUST");
  const [university, setUniversity] = useState("All Universities");
  const [dbUniversities, setDbUniversities] = useState<UniversityRecord[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryRecord[]>([]);
  const [user, setUserState] = useState<CampusUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [saved, setSaved] = useState<string[]>(() =>
    typeof window !== "undefined" ? favoriteService.getAnonymousFavorites() : [],
  );
  const [liked, setLiked] = useState<string[]>([]);
  const [contacts, setContacts] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMacSafari, setIsMacSafari] = useState(false);
  const [canNativeInstall, setCanNativeInstall] = useState(false);
  const [buyerInstallOpen, setBuyerInstallOpen] = useState(false);
  const [sellerPostAuthStage, setSellerPostAuthStage] = useState<SellerPostAuthStage>("none");
  const [manualInstallOpen, setManualInstallOpen] = useState(false);
  const [notifPromptOpen, setNotifPromptOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushState, setPushState] = useState<PushNotificationState>("off");
  const [pushChecked, setPushChecked] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const dbUniversitiesRef = useRef<UniversityRecord[]>([]);
  dbUniversitiesRef.current = dbUniversities;

  const universityNames = useMemo(
    () =>
      dbUniversities.length > 0
        ? dbUniversities.filter((u) => u.is_active).map((u) => u.short_name || u.university_name)
        : defaultUniversities,
    [dbUniversities],
  );

  const productCategoryNames = useMemo(() => {
    const active = dbCategories.filter((c) => c.is_active && c.category_type === "product");
    return active.length > 0 ? active.map((c) => c.name) : defaultProductCategories;
  }, [dbCategories]);

  const serviceCategoryNames = useMemo(() => {
    const active = dbCategories.filter((c) => c.is_active && c.category_type === "service");
    return active.length > 0 ? active.map((c) => c.name) : defaultServiceCategories;
  }, [dbCategories]);

  const refreshMetadata = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [unis, cats] = await Promise.all([
        universityService.listActiveUniversities(),
        categoryService.listActiveCategories(),
      ]);
      setSchemaReady(true);
      setDbUniversities(unis);
      setDbCategories(cats);
    } catch (err) {
      if (isSchemaMissingError(err)) {
        setSchemaReady(false);
      }
    }
  }, []);

  const refreshListings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setListingsLoading(false);
      setListings([]);
      return;
    }
    const cached = university === "All Universities" ? readCachedAllListings() : null;
    if (cached && listingsRef.current.length === 0) {
      setListings(cached);
      setListingsLoading(false);
    } else {
      setListingsLoading(true);
    }
    setListingsError(null);
    try {
      const { items } = await listingService.searchListings({
        universityFilter: university === "All Universities" ? null : university,
        limit: 24,
        offset: 0,
      });
      setSchemaReady(true);
      setListings(items);
      if (university === "All Universities") {
        writeCachedAllListings(items);
      }
    } catch (err) {
      if (isSchemaMissingError(err)) {
        setSchemaReady(false);
      }
      if (!cached) {
        setListingsError(toUserSafeErrorMessage(err));
        setListings([]);
      }
    } finally {
      setListingsLoading(false);
    }
  }, [university]);

  const refreshMyListings = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const mine = await listingService.getMyListings();
      setMyListings(mine);
    } catch {
      setMyListings([]);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const items = await notificationService.listNotifications(25);
      setNotifications(items);
    } catch {
      setNotifications([]);
    }
  }, []);

  const activeUserIdRef = useRef<string | null>(null);

  const resetPrivateUserState = useCallback((clearVisitorCaches = false) => {
    setUserState(null);
    setMyListings([]);
    setNotifications([]);
    setLiked([]);
    setContacts([]);
    setSellerPostAuthStage("none");
    setSaved(favoriteService.getAnonymousFavorites());
    if (clearVisitorCaches) {
      clearAnalyticsSessionCache();
      resetVisitorSessionId();
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<CampusUser | null> => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return null;
    }
    try {
      const session = await authenticationService.getSession();
      const nextUid = session?.user?.id ?? null;

      if (!nextUid || !session?.user) {
        const hadPrevUser = activeUserIdRef.current !== null;
        activeUserIdRef.current = null;
        resetPrivateUserState(hadPrevUser);
        setAuthLoading(false);
        return null;
      }

      if (activeUserIdRef.current && activeUserIdRef.current !== nextUid) {
        // Different account signed in on the same device: wipe prior user's transient state
        resetPrivateUserState(true);
      }
      activeUserIdRef.current = nextUid;

      const [profile, unis] = await Promise.all([
        profileService.getMyProfile(session.user.id).catch((err) => {
          if (isSchemaMissingError(err)) setSchemaReady(false);
          return null;
        }),
        dbUniversitiesRef.current.length > 0
          ? Promise.resolve(dbUniversitiesRef.current)
          : universityService.listActiveUniversities().catch((err) => {
              if (isSchemaMissingError(err)) setSchemaReady(false);
              return [] as UniversityRecord[];
            }),
      ]);

      if (unis.length > 0 && dbUniversitiesRef.current.length === 0) {
        setDbUniversities(unis);
      }

      let resolvedUser: CampusUser;
      if (profile) {
        resolvedUser = mapProfileToUser(profile, unis);
        setUserState(resolvedUser);
        setMyUniversity(resolvedUser.university);
      } else {
        resolvedUser = {
          id: session.user.id,
          name: String(session.user.user_metadata?.["full_name"] || "Campus Seller"),
          email: session.user.email || "",
          university: String(session.user.user_metadata?.["university_name"] || "Ghana Campus"),
          capability: String(session.user.user_metadata?.["account_type"] || "Both"),
          isStudent: session.user.user_metadata?.["is_student"] !== false,
          verificationStatus: "unverified",
          subscriptionTier: "free_launch",
          subscriptionStatus: "active",
          subscriptionExpiresAt: null,
          bio: "",
          contact: "WhatsApp",
        };
        setUserState(resolvedUser);
      }

      const [favIds, mine, notifs] = await Promise.all([
        favoriteService.listFavorites().catch(() => favoriteService.getAnonymousFavorites()),
        listingService.getMyListings().catch(() => []),
        notificationService.listNotifications(25).catch(() => []),
      ]);
      setSaved(favIds);
      setMyListings(mine);
      setNotifications(notifs);
      return resolvedUser;
    } catch {
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [resetPrivateUserState]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme: ThemeMode = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(resolvedTheme);
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;

    setIsStandalone(detectStandalone());

    const ua = navigator.userAgent;
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iosDevice);
    setIsMacSafari(
      /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua),
    );

    if ("Notification" in window) {
      const preGranted = Notification.permission === "granted" && getStoredPushOptIn() !== "0";
      setNotificationsEnabled(preGranted);
      if (preGranted) {
        setPushState("on");
      } else if (Notification.permission === "denied") {
        setPushState("blocked");
      }
    }

    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      };
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW, { once: true });
      }
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setCanNativeInstall(true);
    };

    const onAppInstalled = () => {
      deferredPromptRef.current = null;
      setCanNativeInstall(false);
      setIsStandalone(true);
      setBuyerInstallOpen(false);
      setManualInstallOpen(false);
      setSellerPostAuthStage((prev) => (prev === "install" ? "none" : prev));
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void Promise.all([refreshMetadata(), refreshProfile()]);
    const sub = authenticationService.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      if (event === "SIGNED_OUT") {
        activeUserIdRef.current = null;
        resetPrivateUserState(true);
        setAuthLoading(false);
        return;
      }
      const nextUid = session?.user?.id ?? null;
      if (event === "TOKEN_REFRESHED" && nextUid === activeUserIdRef.current) return;
      void refreshProfile();
    });
    return () => sub.unsubscribe();
  }, [refreshMetadata, refreshProfile, resetPrivateUserState]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void refreshListings();
  }, [refreshListings]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return;
    if (notificationsEnabled) {
      void syncPushSubscriptionForCurrentUser();
    }
    return notificationService.subscribeToRealtimeNotifications(user.id, (row) => {
      setNotifications((prev) => (prev.some((n) => n.id === row.id) ? prev : [row, ...prev]));
      void showDeviceNotification({
        title: row.title,
        body: row.message,
        url: "/dashboard",
        tag: row.id,
      });
    });
  }, [notificationsEnabled, user?.id]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      return next;
    });
  }, []);

  const triggerNativeInstall = useCallback(async (): Promise<
    "accepted" | "dismissed" | "unavailable"
  > => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) return "unavailable";
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        deferredPromptRef.current = null;
        setCanNativeInstall(false);
      }
      return outcome;
    } catch {
      return "unavailable";
    }
  }, []);

  const triggerBuyerInstallPrompt = useCallback(() => {
    if (detectStandalone()) return;
    setBuyerInstallOpen(true);
  }, []);

  const closeBuyerInstallPrompt = useCallback(() => {
    setBuyerInstallOpen(false);
  }, []);

  const refreshPushState = useCallback(async (): Promise<PushNotificationState> => {
    const next = await getPushNotificationState();
    setPushState(next);
    setNotificationsEnabled(next === "on");
    setPushChecked(true);
    return next;
  }, []);

  useEffect(() => {
    void refreshPushState();
    const onFocusOrVisible = () => {
      if (document.visibilityState === "hidden") return;
      void refreshPushState().then((next) => {
        if (next === "on" && user?.id) {
          void syncPushSubscriptionForCurrentUser();
        }
      });
    };
    window.addEventListener("focus", onFocusOrVisible);
    document.addEventListener("visibilitychange", onFocusOrVisible);
    return () => {
      window.removeEventListener("focus", onFocusOrVisible);
      document.removeEventListener("visibilitychange", onFocusOrVisible);
    };
  }, [refreshPushState, user?.id]);

  const requestAppNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushState("unsupported");
      setPushChecked(true);
      return "unsupported" as const;
    }
    try {
      const permission =
        Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
      if (permission === "granted") {
        setStoredPushOptIn(true);
        setPushState("on");
        setNotificationsEnabled(true);
        setNotifPromptOpen(false);
        void syncPushSubscriptionForCurrentUser();
      } else if (permission === "denied") {
        setPushState("blocked");
        setNotificationsEnabled(false);
      } else {
        setPushState("off");
        setNotificationsEnabled(false);
      }
      setPushChecked(true);
      return permission;
    } catch {
      localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
      setPushState("blocked");
      setNotificationsEnabled(false);
      setPushChecked(true);
      return "denied" as const;
    }
  }, []);

  const disableAppNotifications = useCallback(async (): Promise<PushNotificationState> => {
    setStoredPushOptIn(false);
    await removePushSubscriptionForCurrentUser();
    const next = await getPushNotificationState();
    setPushState(next);
    setNotificationsEnabled(next === "on");
    setPushChecked(true);
    return next;
  }, []);

  const triggerSellerPostAuth = useCallback(() => {
    const hasNotificationApi = typeof window !== "undefined" && "Notification" in window;
    const isNotOn =
      hasNotificationApi && (Notification.permission !== "granted" || getStoredPushOptIn() === "0");

    if (isNotOn) {
      setSellerPostAuthStage("notifications");
      return;
    }

    if (!detectStandalone()) {
      setSellerPostAuthStage("install");
    } else {
      setSellerPostAuthStage("none");
    }
  }, []);

  const completeNotificationStep = useCallback((_enabled: boolean) => {
    localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
    if (!detectStandalone()) {
      setSellerPostAuthStage("install");
    } else {
      setSellerPostAuthStage("none");
    }
  }, []);

  const dismissSellerPrompts = useCallback(() => {
    setSellerPostAuthStage("none");
  }, []);

  const openInstallPrompt = useCallback(() => {
    setManualInstallOpen(true);
  }, []);

  const closeInstallPrompt = useCallback(() => {
    setManualInstallOpen(false);
  }, []);

  const openNotifPrompt = useCallback(() => {
    setNotifPromptOpen(true);
  }, []);

  const closeNotifPrompt = useCallback(() => {
    setNotifPromptOpen(false);
  }, []);

  const listingsRef = useRef(listings);
  listingsRef.current = listings;

  const setUser = useCallback((next: CampusUser | null) => {
    setUserState(next);
    if (next) {
      setMyUniversity(next.university);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await removePushSubscriptionForCurrentUser();
    if (isSupabaseConfigured) {
      await authenticationService.signOut();
    }
    activeUserIdRef.current = null;
    resetPrivateUserState(true);
  }, [resetPrivateUserState]);

  const selectedUniversityId = useMemo(
    () =>
      dbUniversities.find((u) => u.short_name === university || u.university_name === university)
        ?.id ?? null,
    [dbUniversities, university],
  );

  const recordView = useCallback(
    (id: string, source = "marketplace") => {
      if (!isSupabaseConfigured) return;
      void analyticsService.recordView(id, selectedUniversityId, source).then((recorded) => {
        if (recorded) {
          setListings((prev) => prev.map((l) => (l.id === id ? { ...l, views: l.views + 1 } : l)));
        }
      });
    },
    [selectedUniversityId],
  );

  const recordContact = useCallback(
    (id: string, method = "WhatsApp") => {
      setContacts((prev) => (prev.includes(id) ? prev : [...prev, id]));
      if (!isSupabaseConfigured) return;
      void analyticsService.recordContactClick(id, method, selectedUniversityId);
    },
    [selectedUniversityId],
  );

  const reportListing = useCallback(
    async (listingId: string, reason: string, description = ""): Promise<boolean> => {
      if (!isSupabaseConfigured) return false;
      const target = listingsRef.current.find((l) => l.id === listingId);
      await reportService.submitReport({
        listingId,
        reportedUserId: target?.sellerId ?? null,
        reason: reason as ReportReason,
        description,
      });
      return true;
    },
    [],
  );

  const toggleSave = useCallback(
    (id: string) => {
      setSaved((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((v) => v !== id) : [...prev, id];
        if (isSupabaseConfigured && user?.id) {
          void (
            exists ? favoriteService.removeFavorite(id) : favoriteService.saveFavorite(id)
          ).catch(() => undefined);
        } else {
          favoriteService.setAnonymousFavorites(next);
        }
        return next;
      });
    },
    [user?.id],
  );

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const exists = prev.includes(id);
      setListings((list) =>
        list.map((l) =>
          l.id === id ? { ...l, likes: Math.max(0, l.likes + (exists ? -1 : 1)) } : l,
        ),
      );
      if (isSupabaseConfigured) {
        void analyticsService.toggleLike(id).catch(() => undefined);
      }
      return exists ? prev.filter((v) => v !== id) : [...prev, id];
    });
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    if (isSupabaseConfigured) {
      await notificationService.markAsRead(id);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (isSupabaseConfigured) {
      await notificationService.markAllAsRead();
    }
  }, []);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const contextValue = useMemo<Store>(
    () => ({
      backendConfigured,
      schemaReady,
      listingsLoading,
      listingsError,
      authLoading,
      university,
      setUniversity,
      myUniversity,
      setMyUniversity,
      dbUniversities,
      universityNames,
      dbCategories,
      productCategoryNames,
      serviceCategoryNames,
      refreshMetadata,
      refreshListings,
      user,
      setUser,
      signOutUser,
      refreshProfile,
      listings,
      setListings,
      myListings,
      refreshMyListings,
      saved,
      toggleSave,
      liked,
      toggleLike,
      contacts,
      recordContact,
      recordView,
      reportListing,
      notifications,
      unreadNotificationCount,
      refreshNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      theme,
      toggleTheme,
      isStandalone,
      isIOS,
      isMacSafari,
      canNativeInstall,
      triggerNativeInstall,
      buyerInstallOpen,
      triggerBuyerInstallPrompt,
      closeBuyerInstallPrompt,
      sellerPostAuthStage,
      triggerSellerPostAuth,
      completeNotificationStep,
      dismissSellerPrompts,
      manualInstallOpen,
      openInstallPrompt,
      closeInstallPrompt,
      notifPromptOpen,
      openNotifPrompt,
      closeNotifPrompt,
      notificationsEnabled,
      pushState,
      pushChecked,
      refreshPushState,
      requestAppNotifications,
      disableAppNotifications,
    }),
    [
      backendConfigured,
      schemaReady,
      listingsLoading,
      listingsError,
      authLoading,
      university,
      myUniversity,
      dbUniversities,
      universityNames,
      dbCategories,
      productCategoryNames,
      serviceCategoryNames,
      refreshMetadata,
      refreshListings,
      user,
      setUser,
      signOutUser,
      refreshProfile,
      listings,
      myListings,
      refreshMyListings,
      saved,
      toggleSave,
      liked,
      toggleLike,
      contacts,
      recordContact,
      recordView,
      reportListing,
      notifications,
      unreadNotificationCount,
      refreshNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      theme,
      toggleTheme,
      isStandalone,
      isIOS,
      isMacSafari,
      canNativeInstall,
      triggerNativeInstall,
      buyerInstallOpen,
      triggerBuyerInstallPrompt,
      closeBuyerInstallPrompt,
      sellerPostAuthStage,
      triggerSellerPostAuth,
      completeNotificationStep,
      dismissSellerPrompts,
      manualInstallOpen,
      openInstallPrompt,
      closeInstallPrompt,
      notifPromptOpen,
      openNotifPrompt,
      closeNotifPrompt,
      notificationsEnabled,
      pushState,
      pushChecked,
      refreshPushState,
      requestAppNotifications,
      disableAppNotifications,
    ],
  );

  return <CampusContext.Provider value={contextValue}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const value = useContext(CampusContext);
  if (!value) throw new Error("CampusProvider is required");
  return value;
}
