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
  ExternalLink,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCampus } from "./store";
import {
  Shell,
  HeroAmbient,
  SectionTitle,
  ListingCard,
  Empty,
  AnimatedSelect,
  PagePendingFallback,
} from "./shared";
import { buildWhatsAppUrl, isSafeMediaUrl, ownsListing, type Listing } from "@/lib/campus/data";
import { listingService, profileService } from "@/services";
import type { PublicSellerProfileRecord } from "@/lib/supabase/database.types";

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
  } = useCampus();

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [collectionTab, setCollectionTab] = useState<"saved" | "liked">("saved");
  const [remoteProfile, setRemoteProfile] = useState<PublicSellerProfileRecord | null>(null);
  const [remoteListings, setRemoteListings] = useState<Listing[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [selectedEditAffiliations, setSelectedEditAffiliations] = useState<string[]>([]);
  const [loadingSeller, setLoadingSeller] = useState<boolean>(
    Boolean(sellerId && backendConfigured),
  );

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
      : listings.filter((l) => l.status === "Active" && l.seller === profile?.name)
    : backendConfigured
      ? myListings.filter((l) => l.status === "Active")
      : listings.filter((l) => l.status === "Active" && ownsListing(l, user?.email));

  const favourites = listings.filter((l) => saved.includes(l.id));
  const likedList = listings.filter((l) => liked.includes(l.id));
  const visibleCollection = collectionTab === "saved" ? favourites : likedList;
  const whatsappHref = buildWhatsAppUrl(
    profile?.contactDetails,
    `Hi ${profile?.name || ""}, I found your store on CampusLoop.`,
  );

  async function handleAvatarSelect(file?: File) {
    if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml") return;
    if (!backendConfigured) {
      toast.error("Backend storage is required to upload a profile photo.");
      return;
    }
    setUploadingAvatar(true);
    try {
      const publicUrl = await profileService.uploadProfileImage(file);
      setAvatar(publicUrl);
      toast.success("Profile photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload profile photo");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!backendConfigured) {
      toast.error("Profile updates require an active Supabase connection.");
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
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <Shell>
      <section className="surface-panel hero-panel profile-hero-panel curve-accent">
        <HeroAmbient />
        <div className="profile-top">
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
              <span className="greeting-pulse" aria-hidden="true" />
              {sellerId ? "Campus storefront" : user ? "Seller studio" : "Buyer pass"}
            </p>
            <h1 className="seller-name-inline">
              {profile?.name || "Guest buyer"}
              {profile?.verificationStatus === "verified" && (
                <BadgeCheck
                  size={18}
                  className="verified-inline-icon"
                  aria-label="Verified campus seller"
                />
              )}
            </h1>
            <p>
              {affiliations.length > 1
                ? affiliations.join(" · ")
                : profile?.university || `Browsing ${university}`}
            </p>
            <small>{profile?.capability || "No account required to browse"}</small>
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

        {profile && (
          <p className="profile-contact-note">
            <MessageCircle size={15} />
            <span>
              Preferred contact: <strong>{profile.contact}</strong>
              {profile.contactDetails ? ` · ${profile.contactDetails}` : ""}
            </span>
            {whatsappHref && sellerId && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link ml-2 inline-flex items-center gap-1"
              >
                Chat <ExternalLink size={12} />
              </a>
            )}
          </p>
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
              </>
            ) : (
              <Button className="dashboard-create-btn" asChild>
                <Link to="/auth">Sell or Offer a Service</Link>
              </Button>
            )}
          </div>
        )}
      </section>

      {profile && (
        <section className="surface-panel section-panel">
          <SectionTitle title={sellerId ? "Active listings" : "Your public listings"} />
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
    </Shell>
  );
}
