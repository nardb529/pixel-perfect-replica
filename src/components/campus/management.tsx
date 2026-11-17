import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  ShoppingBag,
  Briefcase,
  Eye,
  Bookmark,
  MessageCircle,
  Pencil,
  Trash2,
  LogOut,
  Upload,
  Check,
  ArrowLeft,
  ArrowRight,
  Bell,
  TrendingUp,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCampus } from "./store";
import {
  Shell,
  HeroAmbient,
  PageIntro,
  SectionTitle,
  Empty,
  AnimatedSelect,
  PagePendingFallback,
} from "./shared";
import {
  ownsListing,
  validateListing,
  formatListingPrice,
  priceTypes,
  type Listing,
} from "@/lib/campus/data";
import { analyticsService, listingService, profileService } from "@/services";
import type {
  AccountType,
  ListingStatus,
  PriceType,
  SellerAnalyticsResponse,
} from "@/lib/supabase/database.types";

export function SellerOnly({ children }: { children: ReactNode }) {
  const { user, authLoading } = useCampus();
  if (authLoading) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

const RANGE_OPTIONS: Array<{ value: "today" | "7d" | "30d" | "all"; label: string }> = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

export function DashboardPage() {
  const {
    backendConfigured,
    authLoading,
    user,
    myListings,
    refreshMyListings,
    refreshListings,
    refreshProfile,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    universityNames,
    dbUniversities,
    signOutUser,
  } = useCampus();

  const [tab, setTab] = useState("Overview");
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("all");
  const [analytics, setAnalytics] = useState<SellerAnalyticsResponse | null>(null);
  const [deleting, setDeleting] = useState<Listing | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!backendConfigured || !user?.id) return;
    let active = true;
    void analyticsService
      .getSellerAnalytics(range)
      .then((res) => {
        if (active) setAnalytics(res);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [backendConfigured, user?.id, range, myListings.length]);

  useEffect(() => {
    if (!backendConfigured || !user?.id) return;
    void profileService
      .listUserUniversities(user.id)
      .then((rows) => {
        const names = rows
          .map((r) => r.university?.short_name || r.university?.university_name || "")
          .filter(Boolean);
        setSelectedAffiliations(names.length ? names : [user.university]);
      })
      .catch(() => setSelectedAffiliations([user.university]));
  }, [backendConfigured, user?.id, user?.university]);

  if (authLoading) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const isSuspended = Boolean(user.isSuspended);
  const mine = backendConfigured ? myListings : [];

  const activeCount =
    analytics?.active_listings ?? mine.filter((l) => l.status === "Active").length;
  const viewCount = analytics?.total_views ?? mine.reduce((s, l) => s + l.views, 0);
  const clickCount =
    analytics?.contact_clicks ?? mine.reduce((s, l) => s + (l.contactClicks || 0), 0);
  const favCount =
    analytics?.saved_listings ?? mine.reduce((s, l) => s + (l.favoriteCount || 0), 0);

  const topListings = analytics?.top_listings?.length
    ? analytics.top_listings
    : mine
        .slice()
        .sort((a, b) => b.views + (b.contactClicks || 0) - (a.views + (a.contactClicks || 0)))
        .slice(0, 4)
        .map((l) => ({
          id: l.id,
          title: l.title,
          listing_type: l.type,
          status: l.status as ListingStatus,
          views: l.views,
          clicks: l.contactClicks || 0,
          saves: l.favoriteCount || 0,
        }));

  async function updateSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!backendConfigured) {
      toast.error("Live service is currently unavailable. Please try again shortly.");
      return;
    }

    const data = new FormData(e.currentTarget);
    const nextUni = String(data.get("university") || user.university);
    const nextCapability = String(data.get("capability") || user.capability) as AccountType;
    const nextContact = String(data.get("contact") || user.contact);
    const nextContactDetails = String(data.get("contactDetails") || "").trim();

    setSavingSettings(true);
    try {
      const primaryUni = dbUniversities.find(
        (u) => u.short_name === nextUni || u.university_name === nextUni,
      );
      await profileService.updateMyProfile({
        primary_university_id: primaryUni?.id ?? null,
        account_type: nextCapability,
        preferred_contact_method: nextContact,
        whatsapp_number:
          nextContact === "WhatsApp" ? nextContactDetails || null : user.whatsappNumber,
        phone_number: nextContact !== "Email" ? nextContactDetails || null : user.phoneNumber,
      });

      const affiliationNames = Array.from(new Set([nextUni, ...selectedAffiliations]));
      const affiliationRows = affiliationNames
        .map((name) => {
          const match = dbUniversities.find(
            (u) => u.short_name === name || u.university_name === name,
          );
          if (!match) return null;
          return {
            university_id: match.id,
            affiliation_type:
              nextCapability === "Service Provider"
                ? ("Service Provider" as const)
                : ("Student" as const),
            is_primary: match.id === primaryUni?.id,
          };
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row));

      if (affiliationRows.length > 0) {
        await profileService.saveUserUniversities(affiliationRows);
      }

      await refreshProfile();
      toast.success("Settings saved to your CampusLoop account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleStatusChange(listing: Listing, nextStatus: Listing["status"]) {
    if (!backendConfigured) {
      toast.error("Live service is currently unavailable. Please try again shortly.");
      return;
    }
    if (isSuspended && nextStatus === "Active") {
      toast.error("Suspended accounts cannot reactivate listings.");
      return;
    }

    try {
      await listingService.updateListingStatus(listing.id, nextStatus as ListingStatus);
      await Promise.all([refreshMyListings(), refreshListings()]);
      toast.success(`${listing.title} marked as ${nextStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update listing status");
    }
  }

  async function handleDeleteListing(target: Listing) {
    if (!backendConfigured) {
      toast.error("Live service is currently unavailable. Please try again shortly.");
      return;
    }
    try {
      await listingService.archiveListing(target.id);
      await Promise.all([refreshMyListings(), refreshListings()]);
      setDeleting(null);
      toast.success("Listing removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete listing");
    }
  }

  async function toggleNotificationPref(
    key: "listing_updates" | "enquiries" | "announcements",
    checked: boolean,
  ) {
    if (!user) return;
    if (!backendConfigured) {
      toast.error("Live service is currently unavailable. Please try again shortly.");
      return;
    }
    const nextPrefs = {
      listing_updates: user.notificationPreferences?.listing_updates ?? true,
      enquiries: user.notificationPreferences?.enquiries ?? true,
      announcements: user.notificationPreferences?.announcements ?? true,
      [key]: checked,
    };
    try {
      const supabase = (await import("@/lib/supabase/client")).requireSupabase();
      const { error: prefError } = await supabase
        .from("profiles")
        .update({ notification_preferences: nextPrefs })
        .eq("id", user.id);
      if (prefError) throw prefError;
      await refreshProfile();
      toast.success("Notification preferences updated");
    } catch {
      toast.error("Could not update notification preferences");
    }
  }

  return (
    <Shell>
      <section className="surface-panel hero-panel dashboard-hero-panel curve-accent">
        <HeroAmbient />

        <div className="dashboard-top">
          <PageIntro
            eyebrow={user.role === "admin" ? "Administrator & Seller studio" : "Seller studio"}
            title={`Welcome back, ${user.name.split(" ")[0]}`}
            text="Manage your products, services, performance and enquiries."
          />
          <div className="flex flex-wrap items-center gap-2">
            {user.role === "admin" && !isSuspended && (
              <Button variant="outline" className="admin-launch-btn" asChild>
                <Link to="/admin">
                  <Shield size={15} />
                  Admin Command Center
                </Link>
              </Button>
            )}
            {!isSuspended && (
              <Button className="dashboard-create-btn" asChild>
                <Link to="/post">
                  <Plus size={16} />
                  Create listing
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="dashboard-nav" role="tablist" aria-label="Dashboard sections">
          {["Overview", "My Listings"].map((t) => (
            <Button key={t} variant={tab === t ? "default" : "ghost"} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
          <Button
            variant={tab === "Notifications" ? "default" : "ghost"}
            onClick={() => setTab("Notifications")}
          >
            <Bell size={15} />
            Notifications{unreadNotificationCount > 0 ? ` (${unreadNotificationCount})` : ""}
          </Button>
          {!isSuspended && (
            <Button variant="ghost" asChild>
              <Link to="/post">Create Listing</Link>
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button
            variant={tab === "Settings" ? "default" : "ghost"}
            onClick={() => setTab("Settings")}
          >
            Settings
          </Button>
        </div>
      </section>

      {isSuspended && (
        <section className="surface-panel section-panel" role="alert">
          <SectionTitle eyebrow="Account status" title="Your seller account is suspended" />
          <p className="profile-bio">
            Posting new listings and reactivating listings is disabled while your account is
            suspended. Contact CampusLoop support if you believe this is an error.
          </p>
        </section>
      )}

      {tab === "Settings" ? (
        <section className="surface-panel section-panel">
          <SectionTitle title="Account settings" />
          <p className="profile-bio">
            Signed in as <strong>{user.email}</strong>.
          </p>
          <form className="settings-form" onSubmit={updateSettings}>
            <div className="form-grid">
              <div className="form-field">
                <span>Primary University</span>
                <AnimatedSelect
                  name="university"
                  ariaLabel="University"
                  kicker="Home university"
                  defaultValue={user.university}
                  options={universityNames}
                />
              </div>
              <div className="form-field">
                <span>Account type</span>
                <AnimatedSelect
                  name="capability"
                  ariaLabel="Account type"
                  kicker="Seller capability"
                  defaultValue={user.capability}
                  options={[
                    { value: "Both", label: "Products & Services" },
                    { value: "Product Seller", label: "Product Seller" },
                    { value: "Service Provider", label: "Service Provider" },
                  ]}
                />
              </div>
            </div>

            {backendConfigured && (
              <fieldset className="audience-fieldset">
                <legend className="field-label">Additional university affiliations</legend>
                <div className="university-checks">
                  {universityNames.slice(0, 12).map((uniName) => (
                    <label key={uniName} className="audience-check">
                      <input
                        type="checkbox"
                        checked={selectedAffiliations.includes(uniName)}
                        onChange={(e) =>
                          setSelectedAffiliations((prev) =>
                            e.target.checked
                              ? [...prev, uniName]
                              : prev.filter((item) => item !== uniName),
                          )
                        }
                      />
                      <span>{uniName}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="form-grid">
              <div className="form-field">
                <span>Preferred contact method</span>
                <AnimatedSelect
                  name="contact"
                  ariaLabel="Preferred contact method"
                  kicker="Primary channel"
                  defaultValue={user.contact}
                  options={["WhatsApp", "Phone call", "Email"]}
                />
              </div>
              <label className="form-field">
                <span>Contact details</span>
                <input
                  name="contactDetails"
                  placeholder="+233 XX XXX XXXX"
                  defaultValue={user.contactDetails || ""}
                />
              </label>
            </div>
            <div className="settings-actions">
              <Button type="submit" disabled={savingSettings}>
                {savingSettings ? "Saving..." : "Save settings"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void signOutUser().then(() => navigate({ to: "/discover" }));
                }}
              >
                <LogOut size={16} />
                Log out
              </Button>
            </div>
          </form>
        </section>
      ) : tab === "Notifications" ? (
        <section className="surface-panel section-panel">
          <SectionTitle title="Notifications">
            {notifications.length > 0 && unreadNotificationCount > 0 && (
              <Button variant="outline" onClick={() => void markAllNotificationsRead()}>
                Mark all read
              </Button>
            )}
          </SectionTitle>

          <div className="university-checks mb-4">
            <label className="audience-check">
              <input
                type="checkbox"
                checked={user.notificationPreferences?.listing_updates ?? true}
                onChange={(e) => void toggleNotificationPref("listing_updates", e.target.checked)}
              />
              <span>Listing approvals &amp; status updates</span>
            </label>
            <label className="audience-check">
              <input
                type="checkbox"
                checked={user.notificationPreferences?.enquiries ?? true}
                onChange={(e) => void toggleNotificationPref("enquiries", e.target.checked)}
              />
              <span>Buyer contact alerts</span>
            </label>
            <label className="audience-check">
              <input
                type="checkbox"
                checked={user.notificationPreferences?.announcements ?? true}
                onChange={(e) => void toggleNotificationPref("announcements", e.target.checked)}
              />
              <span>Platform announcements</span>
            </label>
          </div>

          {notifications.length ? (
            <div className="activity-list">
              {notifications.map((n) => (
                <div className="activity-row" key={n.id}>
                  <Bell size={16} />
                  <div className="flex-1 min-w-0">
                    <strong>
                      {n.title}
                      {!n.is_read && " · New"}
                    </strong>
                    <div className="text-xs text-muted-foreground">{n.message}</div>
                  </div>
                  {!n.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void markNotificationRead(n.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="All caught up"
              text="Listing approvals, moderation updates, and campus announcements will appear here."
            />
          )}
        </section>
      ) : (
        <>
          {tab === "Overview" && (
            <section className="surface-panel section-panel">
              <SectionTitle title="Performance">
                <div className="segmented compact-tabs">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={range === opt.value ? "selected" : ""}
                      onClick={() => setRange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </SectionTitle>

              <div className="stats-grid">
                {[
                  {
                    label: "Active Listings",
                    value: activeCount,
                    icon: ShoppingBag,
                  },
                  {
                    label: "Total Views",
                    value: viewCount,
                    icon: Eye,
                  },
                  {
                    label: "Contact Clicks",
                    value: clickCount,
                    icon: MessageCircle,
                  },
                  {
                    label: "Saved",
                    value: favCount,
                    icon: Bookmark,
                  },
                ].map((s) => (
                  <article className="stat" key={s.label}>
                    <div className="stat-top">
                      <span>{s.label}</span>
                      <s.icon size={16} />
                    </div>
                    <strong className="tabular-nums">{s.value}</strong>
                    <small>{RANGE_OPTIONS.find((r) => r.value === range)?.label}</small>
                  </article>
                ))}
              </div>

              {topListings.length > 0 && (
                <div className="mb-4">
                  <div className="detail-kicker mb-2">
                    <TrendingUp size={14} />
                    <span>Best performing &amp; most viewed</span>
                  </div>
                  <div className="activity-list">
                    {topListings.map((item) => (
                      <Link
                        key={item.id}
                        to="/listing/$id"
                        params={{ id: item.id }}
                        className="activity-row"
                      >
                        <Eye size={15} />
                        <span>{item.title}</span>
                        <small>
                          {item.views} views · {item.clicks} clicks · {item.saves} saves
                        </small>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isSuspended && (
                <div className="quick-actions">
                  <Button variant="outline" asChild>
                    <Link to="/post" search={{ type: "product" }}>
                      <ShoppingBag size={16} />
                      Post a Product
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/post" search={{ type: "service" }}>
                      <Briefcase size={16} />
                      Offer a Service
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setTab("My Listings")}>
                    Manage Listings
                    <ArrowRight size={15} />
                  </Button>
                </div>
              )}
            </section>
          )}

          <section className="surface-panel section-panel">
            <SectionTitle title="Your listings" />
            {mine.length ? (
              <div className="manage-list">
                {mine.map((l) => (
                  <article className="manage-row" key={l.id}>
                    {l.image ? (
                      <img src={l.image} alt={l.title} />
                    ) : (
                      <span className="avatar">{l.title.slice(0, 2).toUpperCase()}</span>
                    )}
                    <div className="manage-row-info">
                      <Link to="/listing/$id" params={{ id: l.id }}>
                        <strong>{l.title}</strong>
                      </Link>
                      <small>
                        {formatListingPrice(l)} · {l.views} views
                        {l.contactClicks ? ` · ${l.contactClicks} enquiries` : ""}
                      </small>
                    </div>
                    <div className="manage-row-actions">
                      <AnimatedSelect
                        variant="status"
                        align="end"
                        kicker="Listing visibility"
                        ariaLabel={`Status of ${l.title}`}
                        value={l.status}
                        onValueChange={(nextStatus) =>
                          void handleStatusChange(l, nextStatus as Listing["status"])
                        }
                        options={
                          isSuspended
                            ? [
                                {
                                  value: "Paused",
                                  label: "Paused",
                                  description: "Temporarily hidden",
                                  tone: "warning",
                                },
                                {
                                  value: l.type === "product" ? "Sold" : "Unavailable",
                                  label: l.type === "product" ? "Sold" : "Unavailable",
                                  description: "No longer accepting requests",
                                  tone: "muted",
                                },
                              ]
                            : [
                                {
                                  value: "Active",
                                  label: "Active",
                                  description: "Visible to campus buyers",
                                  tone: "success",
                                },
                                {
                                  value: "Paused",
                                  label: "Paused",
                                  description: "Temporarily hidden",
                                  tone: "warning",
                                },
                                {
                                  value: l.type === "product" ? "Sold" : "Unavailable",
                                  label: l.type === "product" ? "Sold" : "Unavailable",
                                  description: "No longer accepting requests",
                                  tone: "muted",
                                },
                              ]
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit listing"
                        aria-label={`Edit ${l.title}`}
                        asChild
                      >
                        <Link to="/listing/$id/edit" params={{ id: l.id }}>
                          <Pencil size={16} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete listing"
                        aria-label={`Delete ${l.title}`}
                        onClick={() => setDeleting(l)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title="No listings yet"
                text="Post a product or service to reach students on campus."
              >
                {!isSuspended && (
                  <Button asChild>
                    <Link to="/post">
                      <Plus size={16} />
                      Create listing
                    </Link>
                  </Button>
                )}
              </Empty>
            )}
          </section>

          {tab === "Overview" && (
            <section className="surface-panel section-panel">
              <SectionTitle title="Recent activity" />
              <div className="activity-list">
                {analytics?.recent_activity?.length ? (
                  analytics.recent_activity.map((act) => (
                    <div className="activity-row" key={act.id}>
                      {act.kind === "contact" ? <MessageCircle size={16} /> : <Eye size={16} />}
                      <span>{act.text}</span>
                      <small>{new Date(act.occurred_at).toLocaleDateString("en-GH")}</small>
                    </div>
                  ))
                ) : mine.length > 0 ? (
                  mine.slice(0, 4).map((l) => (
                    <div className="activity-row" key={l.id}>
                      <Check size={16} />
                      <span>
                        “{l.title}” is {l.status.toLowerCase()} in {l.audience.join(", ")}
                      </span>
                      <small>{l.time}</small>
                    </div>
                  ))
                ) : (
                  <p className="profile-bio">
                    Views, saves and contact clicks on your listings will appear here.
                  </p>
                )}
              </div>
            </section>
          )}
        </>
      )}

      <Dialog open={Boolean(deleting)} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Delete listing?</DialogTitle>
          <DialogDescription>
            {deleting?.title} will be removed from your active listings.
          </DialogDescription>
          <div className="form-bottom">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) void handleDeleteListing(deleting);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}

type DraftImage = {
  imageUrl: string;
  storagePath?: string | null | undefined;
};

type Draft = {
  type: "product" | "service";
  title: string;
  description: string;
  category: string;
  price: string;
  priceType: PriceType;
  condition: string;
  brand: string;
  stockStatus: string;
  duration: string;
  serviceArea: string;
  deliveryMethod: string;
  location: string;
  images: DraftImage[];
  audience: string[];
  contact: string;
  contactMethod: string;
};

export function PostPage({
  editId,
  initialType,
}: {
  editId?: string;
  initialType?: "product" | "service" | undefined;
}) {
  const {
    backendConfigured,
    authLoading,
    user,
    listings,
    myListings,
    refreshMyListings,
    refreshListings,
    universityNames,
    productCategoryNames,
    serviceCategoryNames,
    dbUniversities,
    dbCategories,
  } = useCampus();

  const defaultProductCategory = productCategoryNames[0] ?? "Electronics";
  const defaultServiceCategory = serviceCategoryNames[0] ?? "Graphic Design";

  const localExisting = editId
    ? [...myListings, ...listings].find(
        (l) => l.id === editId && (ownsListing(l, user?.email) || ownsListing(l, user?.id)),
      )
    : undefined;
  const [loadedExisting, setLoadedExisting] = useState<Listing | undefined>(localExisting);

  useEffect(() => {
    if (!editId || localExisting || !backendConfigured) return;
    void listingService
      .getListingById(editId)
      .then((item) => {
        if (item && (ownsListing(item, user?.email) || ownsListing(item, user?.id))) {
          setLoadedExisting(item);
        }
      })
      .catch(() => undefined);
  }, [editId, localExisting, backendConfigured, user?.email, user?.id]);

  const existing = localExisting || loadedExisting;
  const startType = existing?.type || initialType || "product";
  const [step, setStep] = useState(editId || initialType ? 1 : 0);
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState("");

  const [draft, setDraft] = useState<Draft>(() => ({
    type: startType,
    title: existing?.title || "",
    description: existing?.description || "",
    category:
      existing?.category ||
      (startType === "service" ? defaultServiceCategory : defaultProductCategory),
    price: existing && existing.price > 0 ? String(existing.price) : "",
    priceType: existing?.priceType || (startType === "service" ? "Starting from" : "Fixed"),
    condition: existing?.condition || "New",
    brand: existing?.brand || "",
    stockStatus: existing?.stockStatus || "In stock",
    duration: existing?.duration || "",
    serviceArea: existing?.serviceArea || "",
    deliveryMethod: existing?.deliveryMethod || "",
    location: existing?.location || "",
    images:
      existing?.images?.map((imageUrl) => ({ imageUrl })) ||
      (existing?.image ? [{ imageUrl: existing.image }] : []),
    audience: existing?.audience || [user?.university || universityNames[0] || "KNUST"],
    contact: existing?.contact || user?.contactDetails || "",
    contactMethod: existing?.contactMethod || user?.contact || "WhatsApp",
  }));

  useEffect(() => {
    if (!existing) return;
    setDraft({
      type: existing.type,
      title: existing.title,
      description: existing.description,
      category: existing.category,
      price: existing.price > 0 ? String(existing.price) : "",
      priceType: existing.priceType || (existing.type === "service" ? "Starting from" : "Fixed"),
      condition: existing.condition || "New",
      brand: existing.brand || "",
      stockStatus: existing.stockStatus || "In stock",
      duration: existing.duration || "",
      serviceArea: existing.serviceArea || "",
      deliveryMethod: existing.deliveryMethod || "",
      location: existing.location || "",
      images:
        existing.images?.map((imageUrl) => ({ imageUrl })) ||
        (existing.image ? [{ imageUrl: existing.image }] : []),
      audience: existing.audience,
      contact: existing.contact || user?.contactDetails || "",
      contactMethod: existing.contactMethod || user?.contact || "WhatsApp",
    });
  }, [existing, user?.contactDetails, user?.contact]);

  if (authLoading) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (user.isSuspended) {
    return (
      <Shell>
        <Empty
          title="Account suspended"
          text="Suspended accounts cannot create or edit listings. Contact CampusLoop support if you need assistance."
        >
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </Empty>
      </Shell>
    );
  }

  if (editId && !existing) {
    return (
      <Shell>
        <Empty title="Listing unavailable" text="Only your own listings can be edited.">
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </Empty>
      </Shell>
    );
  }

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const imageUrls = draft.images.map((i) => i.imageUrl);

  const preview: Listing = {
    id: existing?.id || "preview",
    sellerId: user.id,
    type: draft.type,
    title: draft.title,
    description: draft.description,
    category: draft.category,
    price: draft.priceType === "Free" ? 0 : draft.price.trim() ? Number(draft.price) : 0,
    priceType: draft.priceType,
    condition: draft.type === "product" ? draft.condition : undefined,
    brand: draft.type === "product" ? draft.brand || undefined : undefined,
    stockStatus: draft.type === "product" ? draft.stockStatus : undefined,
    duration: draft.type === "service" ? draft.duration || undefined : undefined,
    serviceArea: draft.type === "service" ? draft.serviceArea || undefined : undefined,
    deliveryMethod: draft.type === "service" ? draft.deliveryMethod || undefined : undefined,
    location: draft.location || undefined,
    image: imageUrls[0] || "",
    images: imageUrls,
    audience: draft.audience,
    contact: draft.contact,
    contactMethod: draft.contactMethod,
    seller: user.name,
    university: user.university,
    time: existing?.time || "Just now",
    status: existing?.status || "Active",
    views: existing?.views || 0,
    likes: existing?.likes || 0,
    ownerEmail: user.email,
  };

  async function upload(files: FileList | null) {
    if (!files || !files.length) return;
    if (!backendConfigured) {
      setError("Live media storage is currently unavailable. Please try again later.");
      return;
    }
    const selected = Array.from(files);
    if (draft.images.length + selected.length > 8) {
      setError("You can attach up to 8 photos per listing.");
      return;
    }
    if (selected.some((f) => !f.type.startsWith("image/") || f.type === "image/svg+xml")) {
      setError("Choose JPG, PNG, or WebP image files only.");
      return;
    }

    setUploadingImages(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        selected.map((file) => listingService.uploadListingImage(file)),
      );
      setDraft((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "This image could not be uploaded. Try another photo.",
      );
    } finally {
      setUploadingImages(false);
    }
  }

  function validateCurrentDraft() {
    return validateListing({
      type: draft.type,
      title: draft.title,
      description: draft.description,
      price: draft.price,
      priceType: draft.priceType,
      images: imageUrls,
      audience: draft.audience,
      contact: draft.contact,
    });
  }

  function review(e: FormEvent) {
    e.preventDefault();
    const validation = validateCurrentDraft();
    setError(validation);
    if (!validation) setStep(2);
  }

  async function publish() {
    const validation = validateCurrentDraft();
    if (validation) {
      setError(validation);
      setStep(1);
      return;
    }

    if (!backendConfigured) {
      setError("Live marketplace service is currently unavailable. Please try again later.");
      return;
    }

    const matchedCategory =
      dbCategories.find((c) => c.category_type === draft.type && c.name === draft.category) ||
      dbCategories.find((c) => c.category_type === draft.type);

    if (!matchedCategory) {
      setError("Category catalog is still loading. Try again in a moment.");
      return;
    }

    const { scope, universityIds } = listingService.resolveUniversityIdsFromNames(
      draft.audience,
      dbUniversities,
    );

    if (scope !== "all" && universityIds.length === 0) {
      setError("Select at least one valid university.");
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        listingType: draft.type,
        title: draft.title,
        description: draft.description,
        categoryId: matchedCategory.id,
        price: draft.priceType === "Free" ? 0 : draft.price.trim() ? Number(draft.price) : null,
        priceType: draft.priceType,
        condition: draft.type === "product" ? draft.condition : undefined,
        brand: draft.type === "product" ? draft.brand : undefined,
        stockStatus: draft.type === "product" ? draft.stockStatus : undefined,
        duration: draft.type === "service" ? draft.duration : undefined,
        serviceArea: draft.type === "service" ? draft.serviceArea : undefined,
        deliveryMethod: draft.type === "service" ? draft.deliveryMethod : undefined,
        location: draft.location,
        contactMethod: draft.contactMethod,
        contactValue: draft.contact,
        status: existing?.rawStatus || ("Active" as const),
        audienceScope: scope,
        universityIds,
        images: draft.images,
      };

      const savedListing = existing
        ? await listingService.updateListing(existing.id, payload)
        : await listingService.createListing(payload);

      await Promise.all([refreshMyListings(), refreshListings()]);
      setPublished(savedListing.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish listing.");
    } finally {
      setSubmitting(false);
    }
  }

  if (published) {
    return (
      <Shell>
        <div className="surface-panel success-screen curve-accent">
          <span className="success-icon">
            <Check size={34} />
          </span>
          <h1>{editId ? "Listing updated" : "Listing published"}</h1>
          <p>{draft.title} is now live on the marketplace.</p>
          <div className="success-actions">
            <Button asChild>
              <Link to="/listing/$id" params={{ id: published }}>
                View listing
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  const categoryList = draft.type === "product" ? productCategoryNames : serviceCategoryNames;

  return (
    <Shell>
      <div className="post-wrap">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={15} />
          Dashboard
        </Link>

        <section className="surface-panel curve-accent">
          <PageIntro
            title={editId ? "Edit listing" : "What would you like to post?"}
            text="Fill in a few details so campus buyers can find and contact you."
          />

          <div className="post-steps">
            {["Choose", "Details", "Preview"].map((s, i) => (
              <span className={step === i ? "current" : ""} key={s}>
                <b>{i + 1}</b>
                {s}
              </span>
            ))}
          </div>

          {step === 0 ? (
            <div className="type-options">
              {(["product", "service"] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  className="type-option"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      type,
                      priceType: type === "product" ? "Fixed" : "Starting from",
                      category:
                        type === "product" ? defaultProductCategory : defaultServiceCategory,
                    }));
                    setStep(1);
                  }}
                >
                  {type === "product" ? <ShoppingBag size={28} /> : <Briefcase size={28} />}
                  <strong>{type === "product" ? "A Product" : "A Service"}</strong>
                  <small>
                    {type === "product"
                      ? "Electronics, fashion, books, hostel items."
                      : "Design, hair, photography, tutoring, repairs."}
                  </small>
                </button>
              ))}
            </div>
          ) : step === 1 ? (
            <form onSubmit={review}>
              <label className="upload-area">
                <Upload size={22} />
                <strong>
                  {uploadingImages
                    ? "Uploading optimized images..."
                    : `Add ${draft.type === "product" ? "product" : "portfolio"} photos`}
                </strong>
                <small>Tap to upload from your device (up to 5 MB each)</small>
                <input
                  aria-label="Listing images"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingImages}
                  onChange={(e) => {
                    void upload(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {draft.images.length > 0 && (
                <div className="upload-previews">
                  {draft.images.map((image, i) => (
                    <div key={i}>
                      <img src={image.imageUrl} alt={`Uploaded image ${i + 1}`} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove image ${i + 1}`}
                        title="Remove image"
                        onClick={() => {
                          if (backendConfigured && image.storagePath) {
                            void listingService.removeListingStorageObject(image.storagePath);
                          }
                          update(
                            "images",
                            draft.images.filter((_, index) => i !== index),
                          );
                        }}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <label className="form-field">
                <span>{draft.type === "product" ? "Product name" : "Service name"}</span>
                <input
                  required
                  placeholder={
                    draft.type === "product" ? "HP EliteBook 840 G5" : "Knotless braids & styling"
                  }
                  value={draft.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </label>

              <label className="form-field">
                <span>Description</span>
                <textarea
                  required
                  placeholder="Share condition, pickup location or what is included..."
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </label>

              <div className="form-grid">
                <div className="form-field">
                  <span>Category</span>
                  <AnimatedSelect
                    ariaLabel="Category"
                    kicker={draft.type === "product" ? "Product category" : "Service category"}
                    value={draft.category}
                    onValueChange={(val) => update("category", val)}
                    options={categoryList}
                  />
                </div>

                <div className="form-field">
                  <span>Pricing style</span>
                  <AnimatedSelect
                    ariaLabel="Pricing style"
                    kicker="How pricing works"
                    value={draft.priceType}
                    onValueChange={(val) => update("priceType", val as PriceType)}
                    options={priceTypes}
                  />
                </div>
              </div>

              <div className="form-grid">
                <label className="form-field">
                  <span>
                    {draft.priceType === "Free"
                      ? "Price (Free)"
                      : draft.type === "product"
                        ? "Price in GH₵"
                        : "Starting price in GH₵ (optional)"}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={draft.priceType === "Free"}
                    placeholder={
                      draft.priceType === "Free"
                        ? "0"
                        : draft.type === "product"
                          ? "150"
                          : "Optional"
                    }
                    required={draft.type === "product" && draft.priceType !== "Free"}
                    value={draft.priceType === "Free" ? "0" : draft.price}
                    onChange={(e) => update("price", e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Campus pickup / meetup area</span>
                  <input
                    placeholder="e.g. Republic Hall, Pent Hostel"
                    value={draft.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </label>
              </div>

              {draft.type === "product" ? (
                <div className="form-grid">
                  <div className="form-field">
                    <span>Condition</span>
                    <AnimatedSelect
                      ariaLabel="Condition"
                      kicker="Item condition"
                      value={draft.condition}
                      onValueChange={(val) => update("condition", val)}
                      options={[
                        { value: "New", label: "New", description: "Unused or sealed" },
                        {
                          value: "Like New",
                          label: "Like New",
                          description: "Barely used, mint shape",
                        },
                        { value: "Used", label: "Used", description: "Pre-owned & working" },
                      ]}
                    />
                  </div>
                  <label className="form-field">
                    <span>Brand (optional)</span>
                    <input
                      placeholder="HP, Apple, Nike..."
                      value={draft.brand}
                      onChange={(e) => update("brand", e.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <div className="form-grid">
                  <label className="form-field">
                    <span>Typical turnaround / duration</span>
                    <input
                      placeholder="e.g. 45 mins, Same day"
                      value={draft.duration}
                      onChange={(e) => update("duration", e.target.value)}
                    />
                  </label>
                  <div className="form-field">
                    <span>Delivery mode</span>
                    <AnimatedSelect
                      ariaLabel="Delivery mode"
                      kicker="How you serve students"
                      value={draft.deliveryMethod || "In-person on campus"}
                      onValueChange={(val) => update("deliveryMethod", val)}
                      options={[
                        "In-person on campus",
                        "Hostel visit",
                        "Online / Remote",
                        "Campus & Remote",
                      ]}
                    />
                  </div>
                </div>
              )}

              <fieldset className="audience-fieldset">
                <legend className="field-label">University audience</legend>
                <div className="audience-options">
                  <label className="audience-check">
                    <input
                      type="checkbox"
                      checked={draft.audience.includes("All Universities")}
                      onChange={(e) =>
                        update(
                          "audience",
                          e.target.checked ? ["All Universities"] : [user.university],
                        )
                      }
                    />
                    <span>All Universities</span>
                  </label>
                </div>
                {!draft.audience.includes("All Universities") && (
                  <div className="university-checks">
                    {universityNames.map((u) => (
                      <label key={u} className="audience-check">
                        <input
                          type="checkbox"
                          checked={draft.audience.includes(u)}
                          onChange={(e) =>
                            update(
                              "audience",
                              e.target.checked
                                ? [...draft.audience, u]
                                : draft.audience.filter((v) => v !== u),
                            )
                          }
                        />
                        <span>{u}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>

              <div className="form-grid">
                <div className="form-field">
                  <span>Contact method</span>
                  <AnimatedSelect
                    ariaLabel="Contact method"
                    kicker="How buyers reach you"
                    value={draft.contactMethod}
                    onValueChange={(val) => update("contactMethod", val)}
                    options={["WhatsApp", "Phone call", "Email"]}
                  />
                </div>
                <label className="form-field">
                  <span>Contact details</span>
                  <input
                    required
                    placeholder={
                      draft.contactMethod === "Email" ? "you@example.com" : "+233 XX XXX XXXX"
                    }
                    value={draft.contact}
                    onChange={(e) => update("contact", e.target.value)}
                  />
                </label>
              </div>

              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}

              <div className="form-bottom">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (editId ? setStep(1) : setStep(0))}
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                <Button type="submit" disabled={uploadingImages}>
                  Preview listing
                  <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="post-preview">
                {preview.image && <img src={preview.image} alt={draft.title} />}
                <span className="section-kicker">
                  {draft.category} · {draft.priceType}
                </span>
                <h2>{draft.title}</h2>
                <p className="detail-price">{formatListingPrice(preview)}</p>
                <p className="profile-bio">{draft.description}</p>
                <p className="profile-bio">
                  {draft.audience.join(" · ")}
                  {draft.location ? ` · ${draft.location}` : ""}
                  <br />
                  {draft.contactMethod} · {draft.contact}
                </p>
              </div>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <div className="form-bottom">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <Pencil size={15} />
                  Edit details
                </Button>
                <Button disabled={submitting} onClick={() => void publish()}>
                  <Check size={16} />
                  {submitting ? "Publishing..." : editId ? "Save changes" : "Publish listing"}
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </Shell>
  );
}
