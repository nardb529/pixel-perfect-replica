import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Pencil,
  LogOut,
  UserRound,
  Upload,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  FileText,
  Download,
  Moon,
  Sun,
  ChevronRight,
  Shield,
  Phone,
  Share2,
  ShoppingBag,
  Briefcase,
  Search,
  Store as StoreIcon,
  BellRing,
  BellOff,
  ImagePlus,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCampus } from "./store";
import { PageBanner } from "./banners";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Shell,
  SectionTitle,
  ListingCard,
  Empty,
  AnimatedSelect,
  PagePendingFallback,
  PageBackButton,
} from "./shared";
import {
  TECHNICAL_ISSUE_MESSAGE,
  buildPhoneHref,
  buildWhatsAppUrl,
  isSafeMediaUrl,
  ownsListing,
  toUserSafeErrorMessage,
  type Listing,
} from "@/lib/campus/data";
import { describePushFailure, getPushNotificationState } from "@/lib/campus/push";
import { listingService, profileService } from "@/services";
import type { PublicSellerProfileRecord } from "@/lib/supabase/database.types";
import { SellerStatusIndicator } from "./verification";

export function ProfilePage({ sellerId }: { sellerId?: string }) {
  const {
    backendConfigured,
    authLoading,
    user,
    signOutUser,
    refreshProfile,
    listings,
    myListings,
    saved,
    liked,
    university,
    universityNames,
    dbUniversities,
    theme,
    toggleTheme,
    openInstallPrompt,
    isStandalone,
    isIOS,
    pushState,
    requestAppNotifications,
    disableAppNotifications,
  } = useCampus();

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [collectionTab, setCollectionTab] = useState<"saved" | "liked">("saved");
  const [shopTab, setShopTab] = useState<"all" | "product" | "service">("all");
  const [shopQuery, setShopQuery] = useState("");
  const [remoteProfile, setRemoteProfile] = useState<PublicSellerProfileRecord | null>(null);
  const [remoteListings, setRemoteListings] = useState<Listing[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [selectedEditAffiliations, setSelectedEditAffiliations] = useState<string[]>([]);
  const [loadingSeller, setLoadingSeller] = useState<boolean>(
    Boolean(sellerId && backendConfigured),
  );
  const [updatingPush, setUpdatingPush] = useState(false);
  const [bannerOverride, setBannerOverride] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const dbUniversitiesRef = useRef(dbUniversities);
  dbUniversitiesRef.current = dbUniversities;

  useEffect(() => {
    if (!sellerId || !backendConfigured) {
      setLoadingSeller(false);
      return;
    }
    let active = true;
    setLoadingSeller(true);

    async function loadSeller() {
      try {
        let targetUserId = sellerId!;
        let pub = await profileService.getPublicSellerProfile(targetUserId);
        if (!pub) {
          const fallbackListing = await listingService.getListingById(sellerId!);
          if (fallbackListing?.sellerId) {
            targetUserId = fallbackListing.sellerId;
            pub = await profileService.getPublicSellerProfile(targetUserId);
          }
        }
        if (!active) return;
        setRemoteProfile(pub);
        if (pub) {
          const sellerItems = await listingService.getListingsBySeller(pub.id);
          if (!active) return;
          setRemoteListings(sellerItems);
          const matchedUni = dbUniversitiesRef.current.find(
            (u) => u.id === pub.primary_university_id,
          );
          const campusLabel =
            matchedUni?.short_name ||
            matchedUni?.university_name ||
            sellerItems[0]?.university ||
            "";
          setAffiliations(campusLabel ? [campusLabel] : []);
        }
      } catch {
        // Fallback to cached listing owner below
      } finally {
        if (active) setLoadingSeller(false);
      }
    }

    void loadSeller();
    return () => {
      active = false;
    };
  }, [sellerId, backendConfigured]);

  useEffect(() => {
    if (!backendConfigured || sellerId || !user?.id) return;
    void profileService
      .listUserUniversities(user.id)
      .then((rows) => {
        const names = rows
          .map((u) => u.university?.short_name || u.university?.university_name || "")
          .filter(Boolean);
        setAffiliations(names);
        setSelectedEditAffiliations(names.length ? names : [user.university]);
      })
      .catch(() => undefined);
  }, [backendConfigured, sellerId, user?.id, user?.university]);

  if (loadingSeller || (!sellerId && authLoading)) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }

  const listing = listings.find((l) => l.id === sellerId || l.sellerId === sellerId);
  if (sellerId && (backendConfigured ? !remoteProfile : !listing)) {
    return (
      <Shell>
        <Empty title="Profile unavailable" text="This seller’s profile is no longer available." />
      </Shell>
    );
  }

  const publicOwner = listing?.ownerEmail && user?.email === listing.ownerEmail ? user : undefined;

  const remoteUniName =
    dbUniversities.find((u) => u.id === remoteProfile?.primary_university_id)?.short_name ||
    dbUniversities.find((u) => u.id === remoteProfile?.primary_university_id)?.university_name ||
    affiliations[0] ||
    listing?.university ||
    "Ghana Campus";

  const profile = sellerId
    ? remoteProfile
      ? {
          name: remoteProfile.full_name,
          username: remoteProfile.username,
          university: remoteUniName,
          bio: remoteProfile.bio || "Sharing products and services across campus.",
          capability: remoteProfile.account_type,
          contact: remoteProfile.preferred_contact_method || "WhatsApp",
          contactDetails: remoteProfile.public_contact_handle || undefined,
          avatar: remoteProfile.profile_image || undefined,
          verificationStatus: remoteProfile.verification_status,
        }
      : publicOwner || {
          name: listing!.seller,
          university: listing!.university,
          bio: "Sharing products and services across campus.",
          capability: listing!.type === "product" ? "Product Seller" : "Service Provider",
          contact: listing!.contactMethod || "WhatsApp",
          contactDetails: listing!.contact,
          avatar: undefined,
          verificationStatus: listing!.verificationStatus,
        }
    : user;

  const safeProfileAvatar = isSafeMediaUrl(profile?.avatar) ? profile?.avatar : undefined;

  const active = sellerId
    ? remoteListings.length > 0
      ? remoteListings.map((item) => ({ ...item, seller: profile?.name || item.seller }))
      : listings.filter(
          (l) => l.status === "Active" && (l.sellerId === sellerId || l.seller === profile?.name),
        )
    : backendConfigured
      ? myListings.filter((l) => l.status === "Active")
      : listings.filter((l) => l.status === "Active" && ownsListing(l, user?.email));

  const trimmedShopQuery = shopQuery.trim().toLowerCase();
  const shopFiltered = active.filter((item) => {
    if (!trimmedShopQuery) return true;
    return (
      item.title.toLowerCase().includes(trimmedShopQuery) ||
      item.category.toLowerCase().includes(trimmedShopQuery) ||
      item.description.toLowerCase().includes(trimmedShopQuery)
    );
  });
  const shopProducts = shopFiltered.filter((l) => l.type === "product");
  const shopServices = shopFiltered.filter((l) => l.type === "service");

  const favourites = listings.filter((l) => saved.includes(l.id));
  const likedList = listings.filter((l) => liked.includes(l.id));
  const visibleCollection = collectionTab === "saved" ? favourites : likedList;
  const whatsappHref = buildWhatsAppUrl(
    profile?.contactDetails,
    `Hi ${profile?.name || ""}, I visited your shop on CampusLoop.`,
  );
  const phoneHref = buildPhoneHref(profile?.contactDetails);

  const shopOwnerId = remoteProfile?.id ?? (sellerId || undefined);
  const isShopOwner = Boolean(sellerId && user?.id && shopOwnerId === user.id);
  const shopBannerUrl =
    bannerOverride ??
    (sellerId && shopOwnerId ? profileService.getShopBannerUrl(shopOwnerId) : null);

  async function handleBannerSelect(file?: File) {
    if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml") {
      toast.error("Please choose a photo (JPG or PNG).");
      return;
    }
    setUploadingBanner(true);
    try {
      const url = await profileService.uploadShopBanner(file);
      setBannerOverride(url);
      toast.success("Shop banner updated");
    } catch (err) {
      toast.error(toUserSafeErrorMessage(err));
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  }

  async function deleteMyAccount() {
    if (deleteText.trim() !== "DELETE") return;
    setDeleting(true);
    try {
      const client = getSupabaseClient();
      const { data } = client ? await client.auth.getSession() : { data: { session: null } };
      const token = data.session?.access_token;
      if (!token) throw new Error("Please log in again, then try once more.");
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error || "Could not delete the account.");
      toast.success("Your account has been deleted.");
      setDeleteOpen(false);
      await signOutUser().catch(() => undefined);
      window.location.assign("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : toUserSafeErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  async function shareShop() {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.name || "Seller"} — CampusLoop Shop`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Shop link copied");
      }
    } catch {
      toast.info("Share cancelled");
    }
  }

  async function handleAvatarSelect(file?: File) {
    if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml") return;
    if (!backendConfigured) {
      toast.error(TECHNICAL_ISSUE_MESSAGE);
      return;
    }
    setUploadingAvatar(true);
    try {
      const publicUrl = await profileService.uploadProfileImage(file);
      setAvatar(publicUrl);
      toast.success("Profile photo uploaded");
    } catch (err) {
      toast.error(toUserSafeErrorMessage(err));
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleEnablePush() {
    setUpdatingPush(true);
    try {
      const permission = await requestAppNotifications();
      if (permission === "granted") {
        if ((await getPushNotificationState()) === "on") {
          toast.success("Notifications turned on for this device");
        } else {
          toast.error(describePushFailure());
        }
      } else if (permission === "denied") {
        toast.info("Notifications are blocked in your browser settings");
      } else if (permission === "unsupported") {
        toast.info(
          isIOS
            ? "On iPhone, add CampusLoop to your Home Screen first (iOS 16.4+ required)"
            : "Push notifications are not supported in this browser",
        );
      } else {
        toast.info("Notification prompt dismissed");
      }
    } finally {
      setUpdatingPush(false);
    }
  }

  async function handleDisablePush() {
    setUpdatingPush(true);
    try {
      await disableAppNotifications();
      toast.success("Notifications turned off on this device");
    } finally {
      setUpdatingPush(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!backendConfigured) {
      toast.error(TECHNICAL_ISSUE_MESSAGE);
      return;
    }
    const data = new FormData(e.currentTarget);
    const nextName = String(data.get("name")).trim() || user.name;
    const nextUsername = String(data.get("username") || user.username || "").trim();
    const nextUni = String(data.get("university") || user.university);
    const nextBio = String(data.get("bio") || "");
    const nextContact = String(data.get("contact") || user.contact);
    const nextDetails = String(data.get("contactDetails") || "").trim();

    setSavingProfile(true);
    try {
      const primaryUni = dbUniversities.find(
        (u) => u.short_name === nextUni || u.university_name === nextUni,
      );
      await profileService.updateMyProfile({
        full_name: nextName,
        username: nextUsername || undefined,
        primary_university_id: primaryUni?.id ?? null,
        bio: nextBio,
        preferred_contact_method: nextContact,
        whatsapp_number: nextContact === "WhatsApp" ? nextDetails || null : user.whatsappNumber,
        phone_number: nextContact !== "Email" ? nextDetails || null : user.phoneNumber,
        profile_image: avatar ?? user.avatar ?? null,
      });

      const affiliationNames = Array.from(new Set([nextUni, ...selectedEditAffiliations]));
      const rows = affiliationNames
        .map((name) => {
          const match = dbUniversities.find(
            (u) => u.short_name === name || u.university_name === name,
          );
          if (!match) return null;
          return {
            university_id: match.id,
            affiliation_type:
              user.capability === "Service Provider"
                ? ("Service Provider" as const)
                : ("Student" as const),
            is_primary: match.id === primaryUni?.id,
          };
        })
        .filter((r): r is NonNullable<typeof r> => Boolean(r));

      if (rows.length > 0) {
        await profileService.saveUserUniversities(rows);
      }

      await refreshProfile();
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(toUserSafeErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <Shell>
      <PageBackButton fallbackTo="/discover" label="Back" />

      {sellerId && (
        <PageBanner banner="shop" image={shopBannerUrl} className="shop-banner">
          <div className="shop-banner-top">
            {isShopOwner && (
              <>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={(e) => void handleBannerSelect(e.target.files?.[0])}
                />
                <button
                  type="button"
                  className="shop-banner-edit"
                  disabled={uploadingBanner}
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <ImagePlus size={15} />
                  {uploadingBanner ? "Uploading..." : "Change banner"}
                </button>
              </>
            )}
          </div>
        </PageBanner>
      )}

      {sellerId && (
        <section className="profile-hero-panel shop-hero">
          <div className="profile-top">
            <div className="profile-identity-row">
              {safeProfileAvatar ? (
                <img
                  className="profile-avatar"
                  src={safeProfileAvatar}
                  alt={profile?.name || "Profile photo"}
                  decoding="async"
                />
              ) : (
                <span className="profile-avatar">
                  {profile ? (
                    profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  ) : (
                    <UserRound size={30} />
                  )}
                </span>
              )}
              <div className="profile-heading">
                <p className="greeting">
                  {sellerId ? "Seller shop storefront" : user ? "Seller studio" : "Buyer pass"}
                </p>
                <h1 className="seller-name-inline">
                  {sellerId
                    ? `${profile?.name || "Seller"}’s Shop`
                    : profile?.name || "Guest buyer"}
                  {profile?.verificationStatus === "verified" && (
                    <BadgeCheck
                      size={18}
                      className="verified-inline-icon"
                      aria-label="Verified campus seller"
                    />
                  )}
                </h1>
                <p>
                  {profile?.username ? `@${profile.username} · ` : ""}
                  {affiliations.length > 1
                    ? affiliations.join(" · ")
                    : profile?.university || `Browsing ${university}`}
                </p>
                <small>
                  {profile?.capability || "Browse & contact sellers without an account"}
                  {profile?.verificationStatus === "verified" ? " · Verified seller" : ""}
                </small>
              </div>
            </div>
            {user && !sellerId && (
              <Button
                variant="outline"
                className="profile-edit-btn"
                onClick={() => {
                  setAvatar(user.avatar);
                  setEditing(true);
                }}
              >
                <Pencil size={15} />
                Edit profile
              </Button>
            )}
          </div>

          {profile?.bio && <p className="profile-bio">{profile.bio}</p>}

          {sellerId && profile && <SellerStatusIndicator status={profile.verificationStatus} />}

          {sellerId && profile && (
            <div className="shop-summary-bar">
              <div className="shop-metrics tabular-nums">
                <span>
                  <strong>{active.length}</strong>{" "}
                  <small>{active.length === 1 ? "Listing" : "Total items"}</small>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>{active.filter((i) => i.type === "product").length}</strong>{" "}
                  <small>Products</small>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>{active.filter((i) => i.type === "service").length}</strong>{" "}
                  <small>Services</small>
                </span>
              </div>

              <div className="shop-cta-row">
                {whatsappHref && (
                  <Button asChild>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={15} />
                      Message seller
                    </a>
                  </Button>
                )}
                {phoneHref && (
                  <Button variant="outline" asChild>
                    <a href={phoneHref}>
                      <Phone size={15} />
                      Call
                    </a>
                  </Button>
                )}
                <Button variant="outline" onClick={() => void shareShop()}>
                  <Share2 size={15} />
                  Share shop
                </Button>
              </div>
            </div>
          )}

          {profile && !sellerId && (
            <p className="profile-contact-note">
              <MessageCircle size={15} />
              <span>
                Preferred contact: <strong>{profile.contact}</strong>
                {profile.contactDetails ? ` · ${profile.contactDetails}` : ""}
              </span>
            </p>
          )}

          {!sellerId && user && (
            <div className="profile-stats-strip tabular-nums">
              <span>
                <strong>{active.length}</strong>
                <small>Listings</small>
              </span>
              <span>
                <strong>{favourites.length}</strong>
                <small>Saved</small>
              </span>
              <span>
                <strong>{likedList.length}</strong>
                <small>Liked</small>
              </span>
            </div>
          )}

          {!sellerId && (
            <div className="quick-actions profile-actions">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Button variant="outline" className="admin-launch-btn" asChild>
                      <Link to="/admin">
                        <Shield size={15} />
                        Admin Console
                      </Link>
                    </Button>
                  )}
                  {user.id && (
                    <Button variant="outline" asChild>
                      <Link to="/seller/$id" params={{ id: user.id }}>
                        <StoreIcon size={15} />
                        View my shop
                      </Link>
                    </Button>
                  )}
                  <Button className="dashboard-create-btn" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="profile-edit-btn"
                    onClick={() => void signOutUser()}
                  >
                    <LogOut size={16} />
                    Log out
                  </Button>
                  {user.role !== "admin" && (
                    <Button
                      variant="ghost"
                      className="delete-account-btn"
                      onClick={() => {
                        setDeleteText("");
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={15} />
                      Delete account
                    </Button>
                  )}
                </>
              ) : (
                <Button className="dashboard-create-btn" asChild>
                  <Link to="/auth">Verify &amp; Sell on CampusLoop</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      )}
      {!sellerId && (
        <section className="me-hero">
          <div className="me-cover" aria-hidden="true" />
          <div className="me-card">
            <div className="me-avatar-wrap">
              {safeProfileAvatar ? (
                <img
                  className="me-avatar"
                  src={safeProfileAvatar}
                  alt={profile?.name || "Profile photo"}
                  decoding="async"
                />
              ) : (
                <span className="me-avatar">
                  {profile ? (
                    profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  ) : (
                    <UserRound size={38} />
                  )}
                </span>
              )}
              {user && (
                <button
                  type="button"
                  className="me-avatar-edit"
                  aria-label="Edit profile photo"
                  onClick={() => {
                    setAvatar(user.avatar);
                    setEditing(true);
                  }}
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>

            <h1 className="me-name">
              {profile?.name || "Guest buyer"}
              {profile?.verificationStatus === "verified" && (
                <BadgeCheck
                  size={20}
                  className="verified-inline-icon"
                  aria-label="Verified campus seller"
                />
              )}
            </h1>
            <p className="me-sub">
              {profile?.username ? `@${profile.username} · ` : ""}
              {affiliations.length > 1
                ? affiliations.join(" · ")
                : profile?.university || `Browsing ${university}`}
            </p>
            <div className="me-chips">
              <span className="me-chip">
                {profile?.capability || "Browse & contact sellers without an account"}
              </span>
              {profile?.verificationStatus === "verified" && (
                <span className="me-chip me-chip-ok">
                  <ShieldCheck size={12} />
                  Verified seller
                </span>
              )}
            </div>
            {profile?.bio && <p className="me-bio">{profile.bio}</p>}

            {user && (
              <div className="me-stats tabular-nums">
                <span>
                  <strong>{active.length}</strong>
                  <small>Listings</small>
                </span>
                <span>
                  <strong>{favourites.length}</strong>
                  <small>Saved</small>
                </span>
                <span>
                  <strong>{likedList.length}</strong>
                  <small>Liked</small>
                </span>
              </div>
            )}
          </div>

          {user ? (
            <>
              <nav className="me-menu" aria-label="Account shortcuts">
                <Link to="/dashboard" className="me-row">
                  <span className="me-row-icon">
                    <LayoutDashboard size={18} />
                  </span>
                  <div>
                    <strong>Dashboard</strong>
                    <small>Manage your listings and activity</small>
                  </div>
                  <ChevronRight size={16} />
                </Link>
                {user.id && (
                  <Link to="/seller/$id" params={{ id: user.id }} className="me-row">
                    <span className="me-row-icon">
                      <StoreIcon size={18} />
                    </span>
                    <div>
                      <strong>View my shop</strong>
                      <small>See what buyers see and change your banner</small>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" className="me-row">
                    <span className="me-row-icon">
                      <Shield size={18} />
                    </span>
                    <div>
                      <strong>Admin Console</strong>
                      <small>Review sellers and send announcements</small>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                )}
                <button
                  type="button"
                  className="me-row"
                  onClick={() => {
                    setAvatar(user.avatar);
                    setEditing(true);
                  }}
                >
                  <span className="me-row-icon">
                    <Pencil size={18} />
                  </span>
                  <div>
                    <strong>Edit profile</strong>
                    <small>
                      Contact: {profile?.contact}
                      {profile?.contactDetails ? ` · ${profile.contactDetails}` : ""}
                    </small>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </nav>

              <div className="me-menu me-menu-quiet">
                <button type="button" className="me-row" onClick={() => void signOutUser()}>
                  <span className="me-row-icon">
                    <LogOut size={18} />
                  </span>
                  <div>
                    <strong>Log out</strong>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <Button className="dashboard-create-btn me-cta" asChild>
              <Link to="/auth">Verify &amp; Sell on CampusLoop</Link>
            </Button>
          )}
        </section>
      )}

      {sellerId && profile ? (
        <>
          <section className="surface-panel section-panel">
            <SectionTitle eyebrow="Storefront catalog" title="Products & services in this shop">
              <div className="segmented compact-tabs" role="tablist" aria-label="Filter shop items">
                <button
                  type="button"
                  role="tab"
                  aria-selected={shopTab === "all"}
                  className={shopTab === "all" ? "selected" : ""}
                  onClick={() => setShopTab("all")}
                >
                  All ({shopFiltered.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={shopTab === "product"}
                  className={shopTab === "product" ? "selected" : ""}
                  onClick={() => setShopTab("product")}
                >
                  Products ({shopProducts.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={shopTab === "service"}
                  className={shopTab === "service" ? "selected" : ""}
                  onClick={() => setShopTab("service")}
                >
                  Services ({shopServices.length})
                </button>
              </div>
            </SectionTitle>

            {active.length > 1 && (
              <div className="shop-search-row">
                <Search size={16} aria-hidden="true" />
                <input
                  aria-label="Search inside this seller shop"
                  placeholder={`Search products & services from ${profile.name}...`}
                  value={shopQuery}
                  onChange={(e) => setShopQuery(e.target.value)}
                />
              </div>
            )}

            {shopFiltered.length === 0 ? (
              <Empty
                title="No matching items in this shop"
                text={
                  active.length === 0
                    ? "This seller hasn't published active products or services yet."
                    : "Try clearing your search or switching between Products and Services."
                }
              />
            ) : shopTab === "all" && shopProducts.length > 0 && shopServices.length > 0 ? (
              <div className="shop-catalog-sections">
                <div className="shop-catalog-group">
                  <div className="shop-group-head">
                    <ShoppingBag size={16} />
                    <h3>Products ({shopProducts.length})</h3>
                  </div>
                  <div className="listing-grid">
                    {shopProducts.map((l) => (
                      <ListingCard listing={l} key={l.id} />
                    ))}
                  </div>
                </div>

                <div className="shop-catalog-group">
                  <div className="shop-group-head">
                    <Briefcase size={16} />
                    <h3>Services ({shopServices.length})</h3>
                  </div>
                  <div className="listing-grid">
                    {shopServices.map((l) => (
                      <ListingCard listing={l} key={l.id} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="listing-grid">
                {(shopTab === "product"
                  ? shopProducts
                  : shopTab === "service"
                    ? shopServices
                    : shopFiltered
                ).map((l) => (
                  <ListingCard listing={l} key={l.id} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        profile && (
          <section className="surface-panel section-panel">
            <SectionTitle title="Your public listings" />
            {active.length ? (
              <div className="listing-grid">
                {active.map((l) => (
                  <ListingCard listing={l} key={l.id} />
                ))}
              </div>
            ) : (
              <Empty title="No active listings" text="Published listings will appear here." />
            )}
          </section>
        )
      )}

      {!sellerId && user && (
        <section className="surface-panel section-panel">
          <SectionTitle eyebrow="Device Alerts" title="Phone & Browser Notifications">
            <span
              className={`status-pill ${
                pushState === "on"
                  ? "status-pill-verified"
                  : pushState === "blocked"
                    ? "status-pill-warning"
                    : "status-pill-muted"
              }`}
              data-testid="push-status-label"
            >
              {pushState === "on"
                ? "On"
                : pushState === "blocked"
                  ? "Blocked"
                  : pushState === "unsupported"
                    ? "Unsupported"
                    : "Off"}
            </span>
          </SectionTitle>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {pushState === "on"
                ? "Notifications are active on this device. CampusLoop announcements will arrive on your lock screen even when the app is closed."
                : pushState === "blocked"
                  ? "Notifications are currently blocked in your browser or phone settings. Allow notifications for CampusLoop in site settings, then tap Turn on notifications again."
                  : pushState === "unsupported"
                    ? "This browser context does not support Web Push notifications yet."
                    : "Receive important CampusLoop admin updates and seller verification alerts directly on your phone."}
            </p>

            {isIOS && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
                <strong>iPhone guide:</strong> Tap <strong>Share</strong>, choose{" "}
                <strong>Add to Home Screen</strong>, open CampusLoop from your Home Screen, and tap{" "}
                <strong>Turn on notifications</strong> (<strong>iOS 16.4 or later</strong> is
                required).
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {pushState === "on" ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatingPush}
                  onClick={() => void handleDisablePush()}
                >
                  <BellOff size={15} />
                  {updatingPush ? "Updating..." : "Turn off notifications"}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={updatingPush || pushState === "unsupported"}
                  onClick={() => void handleEnablePush()}
                >
                  <BellRing size={15} />
                  {updatingPush ? "Enabling..." : "Turn on notifications"}
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {!sellerId && (
        <section className="surface-panel section-panel">
          <SectionTitle title="Saved & liked">
            <div className="segmented compact-tabs">
              <button
                type="button"
                className={collectionTab === "saved" ? "selected" : ""}
                onClick={() => setCollectionTab("saved")}
              >
                Saved ({favourites.length})
              </button>
              <button
                type="button"
                className={collectionTab === "liked" ? "selected" : ""}
                onClick={() => setCollectionTab("liked")}
              >
                Liked ({likedList.length})
              </button>
            </div>
          </SectionTitle>
          {visibleCollection.length ? (
            <div className="listing-grid">
              {visibleCollection.map((l) => (
                <ListingCard listing={l} key={l.id} />
              ))}
            </div>
          ) : (
            <Empty
              title={collectionTab === "saved" ? "Nothing saved yet" : "No liked listings yet"}
              text={
                collectionTab === "saved"
                  ? "Tap the bookmark on any listing to keep it handy."
                  : "Tap Like on any product or service to save it here."
              }
            >
              <Button variant="outline" asChild>
                <Link to="/discover">Explore marketplace</Link>
              </Button>
            </Empty>
          )}
        </section>
      )}

      {!sellerId && (
        <section className="surface-panel section-panel">
          <SectionTitle title="App & guides" />
          <div className="utility-links-grid">
            <button type="button" className="utility-link-row" onClick={toggleTheme}>
              <span className="utility-icon">
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </span>
              <div>
                <strong>{theme === "dark" ? "Light appearance" : "Dark appearance"}</strong>
                <small>Currently using {theme} mode</small>
              </div>
              <ChevronRight size={16} />
            </button>

            {!isStandalone && (
              <button type="button" className="utility-link-row" onClick={openInstallPrompt}>
                <span className="utility-icon">
                  <Download size={17} />
                </span>
                <div>
                  <strong>Add to Home Screen</strong>
                  <small>Install on iPhone, Android or desktop</small>
                </div>
                <ChevronRight size={16} />
              </button>
            )}

            <Link to="/manual" className="utility-link-row">
              <span className="utility-icon">
                <BookOpen size={17} />
              </span>
              <div>
                <strong>User Manual</strong>
                <small>How to buy, sell &amp; stay safe</small>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link to="/privacy" className="utility-link-row">
              <span className="utility-icon">
                <ShieldCheck size={17} />
              </span>
              <div>
                <strong>Privacy Policy</strong>
                <small>Data &amp; permissions transparency</small>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link to="/terms" className="utility-link-row">
              <span className="utility-icon">
                <FileText size={17} />
              </span>
              <div>
                <strong>Terms of Use</strong>
                <small>Campus trading guidelines</small>
              </div>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {!sellerId && user && user.role !== "admin" && (
        <div className="me-menu me-menu-quiet me-danger-zone">
          <button
            type="button"
            className="me-row me-row-danger"
            onClick={() => {
              setDeleteText("");
              setDeleteOpen(true);
            }}
          >
            <span className="me-row-icon">
              <Trash2 size={18} />
            </span>
            <div>
              <strong>Delete account</strong>
              <small>Permanently remove your data</small>
            </div>
          </button>
        </div>
      )}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your storefront identity and campus contact details.
          </DialogDescription>
          <form onSubmit={(e) => void save(e)}>
            <label className="form-field">
              <span>Profile photo</span>
              <div className="profile-upload-row">
                <Upload size={15} />
                <span>{uploadingAvatar ? "Uploading photo..." : "Choose photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploadingAvatar}
                  onChange={(e) => void handleAvatarSelect(e.target.files?.[0])}
                />
              </div>
            </label>
            {isSafeMediaUrl(avatar) && (
              <img className="profile-avatar mb-3" src={avatar} alt="Your new profile photo" />
            )}
            <div className="form-grid">
              <label className="form-field">
                <span>Display name</span>
                <input name="name" defaultValue={user?.name} required />
              </label>
              <label className="form-field">
                <span>Username</span>
                <input
                  name="username"
                  defaultValue={user?.username || ""}
                  placeholder="campus_handle"
                />
              </label>
            </div>
            <div className="form-field">
              <span>Primary university</span>
              <AnimatedSelect
                name="university"
                ariaLabel="University"
                kicker="Your campus"
                defaultValue={user?.university}
                options={universityNames}
              />
            </div>

            {backendConfigured && (
              <fieldset className="audience-fieldset">
                <legend className="field-label">Campus affiliations</legend>
                <div className="university-checks">
                  {universityNames.slice(0, 8).map((u) => (
                    <label key={u} className="audience-check">
                      <input
                        type="checkbox"
                        checked={selectedEditAffiliations.includes(u)}
                        onChange={(e) =>
                          setSelectedEditAffiliations((prev) =>
                            e.target.checked ? [...prev, u] : prev.filter((item) => item !== u),
                          )
                        }
                      />
                      <span>{u}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <label className="form-field">
              <span>Short bio</span>
              <textarea name="bio" defaultValue={user?.bio} />
            </label>
            <div className="form-grid">
              <div className="form-field">
                <span>Contact preference</span>
                <AnimatedSelect
                  name="contact"
                  ariaLabel="Contact preference"
                  kicker="Preferred channel"
                  defaultValue={user?.contact}
                  options={["WhatsApp", "Phone call", "Email"]}
                />
              </div>
              <label className="form-field">
                <span>Contact details</span>
                <input
                  name="contactDetails"
                  placeholder="+233 XX XXX XXXX"
                  defaultValue={user?.contactDetails || ""}
                />
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={savingProfile || uploadingAvatar}>
              {savingProfile ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={(o) => !deleting && setDeleteOpen(o)}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently removes your profile, listings, photos and saved items. It cannot be
            undone.
          </DialogDescription>
          <div className="modal-body">
            <label className="delete-account-label">
              Type <strong>DELETE</strong> to confirm
              <input
                className="delete-account-input"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
              />
            </label>
            <div className="modal-actions">
              <Button variant="outline" disabled={deleting} onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleting || deleteText.trim() !== "DELETE"}
                onClick={() => void deleteMyAccount()}
              >
                {deleting ? "Deleting..." : "Delete forever"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
