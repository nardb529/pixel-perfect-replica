import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Shield,
  LayoutDashboard,
  ShoppingBag,
  Flag,
  Users,
  GraduationCap,
  Tag,
  Megaphone,
  Sparkles,
  History,
  Check,
  EyeOff,
  Eye,
  Plus,
  Ban,
  RotateCcw,
  Star,
  Trash2,
  BadgeCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Pencil,
  Send,
  Upload,
  UserCog,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCampus } from "./store";
import {
  Shell,
  Empty,
  HeroAmbient,
  PagePendingFallback,
  AnimatedSelect,
  SectionTitle,
} from "./shared";
import { isSchemaMissingError } from "@/lib/supabase/client";
import { adminService, categoryService, universityService } from "@/services";
import type { AdminListingSummary, ModerationLogRecord } from "@/services/adminService";
import type {
  AdminDashboardSummary,
  CategoryRecord,
  CategoryType,
  ListingStatus,
  NotificationType,
  ProfileRecord,
  PromotionConfigRecord,
  ReportRecord,
  ReportStatus,
  UniversityRecord,
  UserRole,
  VerificationStatus,
} from "@/lib/supabase/database.types";

type AdminSectionId =
  | "overview"
  | "listings"
  | "reports"
  | "users"
  | "universities"
  | "categories"
  | "broadcasts"
  | "promotions"
  | "audit";

type RejectTarget = {
  id: string;
  title: string;
};

type DeleteTarget = {
  id: string;
  title: string;
};

type RoleTarget = {
  id: string;
  name: string;
  nextRole: UserRole;
};

const NAV_ITEMS: Array<{ id: AdminSectionId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "Listings", icon: ShoppingBag },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "users", label: "Users", icon: Users },
  { id: "universities", label: "Universities", icon: GraduationCap },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "broadcasts", label: "Announcements", icon: Megaphone },
  { id: "promotions", label: "Promotions", icon: Sparkles },
  { id: "audit", label: "Audit Log", icon: History },
];

function formatShortDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-GH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString("en-GH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export function AdminPage() {
  const {
    backendConfigured,
    authLoading,
    user,
    refreshMetadata,
    refreshListings,
    refreshNotifications,
  } = useCampus();

  const [section, setSection] = useState<AdminSectionId>("overview");
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  // Live backend state
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [adminListings, setAdminListings] = useState<AdminListingSummary[]>([]);
  const [adminReports, setAdminReports] = useState<ReportRecord[]>([]);
  const [adminProfiles, setAdminProfiles] = useState<ProfileRecord[]>([]);
  const [adminUniversities, setAdminUniversities] = useState<UniversityRecord[]>([]);
  const [adminCategories, setAdminCategories] = useState<CategoryRecord[]>([]);
  const [promotionConfigs, setPromotionConfigs] = useState<PromotionConfigRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<ModerationLogRecord[]>([]);

  // Filters
  const [listingSearch, setListingSearch] = useState("");
  const [listingStatusFilter, setListingStatusFilter] = useState<string>("All");
  const [listingTypeFilter, setListingTypeFilter] = useState<string>("all");
  const [listingFeaturedOnly, setListingFeaturedOnly] = useState(false);
  const [reportFilter, setReportFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "product" | "service">("all");

  // Modals & forms
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [roleTarget, setRoleTarget] = useState<RoleTarget | null>(null);

  // University form
  const [editingUniId, setEditingUniId] = useState<string | undefined>(undefined);
  const [newUniName, setNewUniName] = useState("");
  const [newUniShort, setNewUniShort] = useState("");
  const [newUniLocation, setNewUniLocation] = useState("");
  const [newUniRegion, setNewUniRegion] = useState("");
  const [newUniDesc, setNewUniDesc] = useState("");
  const [newUniOrder, setNewUniOrder] = useState("20");
  const [newUniLogoUrl, setNewUniLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Category form
  const [editingCatId, setEditingCatId] = useState<string | undefined>(undefined);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<CategoryType>("product");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatOrder, setNewCatOrder] = useState("20");

  // Broadcast form
  const [broadcastScope, setBroadcastScope] = useState<string>("all");
  const [broadcastUniId, setBroadcastUniId] = useState<string>("");
  const [broadcastUserId, setBroadcastUserId] = useState<string>("");
  const [broadcastType, setBroadcastType] = useState<NotificationType>("platform_announcement");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // Promotion form
  const [newPromoName, setNewPromoName] = useState("");
  const [newPromoScope, setNewPromoScope] = useState("listing");
  const [newPromoDays, setNewPromoDays] = useState("7");
  const [newPromoFee, setNewPromoFee] = useState("25");
  const [newPromoDesc, setNewPromoDesc] = useState("");

  const isAdminUser = user?.role === "admin" && !user?.isSuspended;

  const loadAdminWorkspace = useCallback(async () => {
    if (!backendConfigured || !isAdminUser) return;
    setLoadingAdmin(true);
    setWorkspaceError(null);
    try {
      const [sum, listRows, reportRows, profileRows, uniRows, catRows, promoRows, logRows] =
        await Promise.all([
          adminService.getSummary(),
          adminService.listAllListings(120),
          adminService.listReports(),
          adminService.listAllProfiles(120),
          universityService.listAllUniversities(),
          categoryService.listAllCategories(),
          adminService.listPromotionConfigs(),
          adminService.listModerationLogs(80).catch(() => [] as ModerationLogRecord[]),
        ]);
      setSummary(sum);
      setAdminListings(listRows);
      setAdminReports(reportRows);
      setAdminProfiles(profileRows);
      setAdminUniversities(uniRows);
      setAdminCategories(catRows);
      setPromotionConfigs(promoRows);
      setAuditLogs(logRows);
    } catch (err) {
      if (isSchemaMissingError(err)) {
        setWorkspaceError(
          "Your Supabase database tables have not been created yet. Run the SQL setup script in Supabase SQL Editor to activate live administration.",
        );
      } else {
        const message = err instanceof Error ? err.message : "Failed to load admin records";
        setWorkspaceError(message);
        toast.error(message);
      }
    } finally {
      setLoadingAdmin(false);
    }
  }, [backendConfigured, isAdminUser]);

  useEffect(() => {
    void loadAdminWorkspace();
  }, [loadAdminWorkspace]);

  const profileMap = useMemo(() => new Map(adminProfiles.map((p) => [p.id, p])), [adminProfiles]);
  const categoryMap = useMemo(
    () => new Map(adminCategories.map((c) => [c.id, c])),
    [adminCategories],
  );
  const listingTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of adminListings) map.set(item.id, item.title);
    return map;
  }, [adminListings]);

  const filteredLiveListings = useMemo(() => {
    const q = listingSearch.trim().toLowerCase();
    return adminListings.filter((item) => {
      if (listingStatusFilter !== "All" && item.status !== listingStatusFilter) return false;
      if (listingTypeFilter !== "all" && item.listing_type !== listingTypeFilter) return false;
      if (listingFeaturedOnly && !item.is_featured) return false;
      if (!q) return true;
      const seller = profileMap.get(item.seller_id);
      const category = categoryMap.get(item.category_id);
      return (
        item.title.toLowerCase().includes(q) ||
        (seller?.full_name.toLowerCase().includes(q) ?? false) ||
        (seller?.username.toLowerCase().includes(q) ?? false) ||
        (category?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [
    adminListings,
    listingSearch,
    listingStatusFilter,
    listingTypeFilter,
    listingFeaturedOnly,
    profileMap,
    categoryMap,
  ]);

  const filteredReports = useMemo(() => {
    if (reportFilter === "all") return adminReports;
    return adminReports.filter((r) => r.status === reportFilter);
  }, [adminReports, reportFilter]);

  const filteredProfiles = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return adminProfiles.filter((prof) => {
      if (userFilter === "verified" && prof.verification_status !== "verified") return false;
      if (userFilter === "pending" && prof.verification_status !== "pending") return false;
      if (userFilter === "unverified" && prof.verification_status !== "unverified") return false;
      if (userFilter === "suspended" && !prof.is_suspended) return false;
      if (userFilter === "admin" && prof.role !== "admin") return false;
      if (!q) return true;
      return (
        prof.full_name.toLowerCase().includes(q) ||
        prof.username.toLowerCase().includes(q) ||
        prof.email.toLowerCase().includes(q)
      );
    });
  }, [adminProfiles, userSearch, userFilter]);

  const broadcastTargets = useMemo(() => {
    if (!backendConfigured) return [];
    if (broadcastScope === "all") {
      return adminProfiles.filter((p) => !p.is_suspended).map((p) => p.id);
    }
    if (broadcastScope === "verified") {
      return adminProfiles
        .filter((p) => !p.is_suspended && p.verification_status === "verified")
        .map((p) => p.id);
    }
    if (broadcastScope === "university" && broadcastUniId) {
      return adminProfiles
        .filter((p) => !p.is_suspended && p.primary_university_id === broadcastUniId)
        .map((p) => p.id);
    }
    if (broadcastScope === "single" && broadcastUserId) {
      return [broadcastUserId];
    }
    return [];
  }, [backendConfigured, broadcastScope, broadcastUniId, broadcastUserId, adminProfiles]);

  if (authLoading) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }

  if (!isAdminUser) {
    return (
      <Shell>
        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <div className="dashboard-top">
            <div className="page-intro">
              <span className="section-kicker">Restricted Console</span>
              <h1>Admin authorization required</h1>
              <p>
                This command center is reserved for active accounts assigned the platform
                administrator role.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/discover">Back to marketplace</Link>
            </Button>
          </div>
          <Empty
            title="Access restricted"
            text={
              user?.isSuspended
                ? `Signed in as ${user.email}. This account is currently suspended.`
                : user
                  ? `Signed in as ${user.email} (standard member). Return to your seller dashboard or sign in with an administrator account.`
                  : "Sign in with an administrator account to access CampusLoop platform controls."
            }
          >
            <Button asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Return to Dashboard" : "Sign in"}
              </Link>
            </Button>
          </Empty>
        </section>
      </Shell>
    );
  }

  if (!backendConfigured) {
    return (
      <Shell>
        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <Empty
            title="Live admin service unavailable"
            text="Administrator controls require an active backend connection."
          >
            <Button asChild>
              <Link to="/discover">Back to marketplace</Link>
            </Button>
          </Empty>
        </section>
      </Shell>
    );
  }

  // Derived overview counts
  const openReportCount =
    summary?.open_reports ??
    adminReports.filter((r) => r.status === "open" || r.status === "reviewing").length;

  const verifiedSellerCount = adminProfiles.filter(
    (p) => p.verification_status === "verified",
  ).length;

  const pendingVerificationCount = adminProfiles.filter(
    (p) => p.verification_status === "pending",
  ).length;

  const totalSellersCount = summary?.total_sellers ?? adminProfiles.length;

  const activeListingsCount =
    summary?.active_listings ?? adminListings.filter((l) => l.status === "Active").length;

  const productListingsCount =
    summary?.total_products ??
    adminListings.filter((l) => l.status === "Active" && l.listing_type === "product").length;

  const serviceListingsCount =
    summary?.total_services ??
    adminListings.filter((l) => l.status === "Active" && l.listing_type === "service").length;

  const totalClicksCount =
    summary?.total_contact_clicks ??
    adminListings.reduce((sum, l) => sum + (l.contact_click_count || 0), 0);

  const uniDistribution = summary?.university_distribution ?? [];
  const maxUniCount = Math.max(1, ...uniDistribution.map((u) => u.targeted_listings));

  // Action handlers
  async function handleListingStatus(
    id: string,
    title: string,
    nextStatus: ListingStatus,
    note?: string,
  ) {
    try {
      await adminService.moderateListing(id, nextStatus, note || "Updated by admin moderation");
      toast.success(`${title} marked as ${nextStatus}`);
      await Promise.all([loadAdminWorkspace(), refreshListings()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update listing");
    }
  }

  async function handleConfirmReject(e: FormEvent) {
    e.preventDefault();
    if (!rejectTarget) return;
    await handleListingStatus(
      rejectTarget.id,
      rejectTarget.title,
      "Rejected",
      rejectNote.trim() || "Policy review required",
    );
    setRejectTarget(null);
    setRejectNote("");
  }

  async function handleConfirmDeleteListing() {
    if (!deleteTarget) return;
    try {
      await adminService.deleteListing(deleteTarget.id, `Removed “${deleteTarget.title}”`);
      toast.success("Listing permanently removed");
      setDeleteTarget(null);
      await Promise.all([loadAdminWorkspace(), refreshListings()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove listing");
    }
  }

  async function handleToggleFeatured(id: string, title: string, nextFeatured: boolean) {
    try {
      await adminService.toggleFeaturedListing(id, nextFeatured);
      toast.success(nextFeatured ? "Marked as featured" : "Removed from featured");
      await Promise.all([loadAdminWorkspace(), refreshListings()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update featured state");
    }
  }

  async function handleReportAction(repId: string, nextStatus: ReportStatus, note?: string) {
    try {
      await adminService.resolveReport(repId, nextStatus, note || `Marked ${nextStatus} by admin`);
      toast.success(`Report marked ${nextStatus}`);
      await loadAdminWorkspace();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update report");
    }
  }

  async function handleUserVerification(prof: ProfileRecord, nextStatus: VerificationStatus) {
    try {
      await adminService.updateUserVerification(
        prof.id,
        nextStatus,
        nextStatus === "verified" ? "Verified by platform admin" : "Verification revoked",
      );
      toast.success(
        nextStatus === "verified"
          ? `${prof.full_name} is now verified`
          : `Verification updated for ${prof.full_name}`,
      );
      await loadAdminWorkspace();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update verification");
    }
  }

  async function handleConfirmRoleChange() {
    if (!roleTarget) return;
    try {
      await adminService.updateUserRole(roleTarget.id, roleTarget.nextRole);
      toast.success(`${roleTarget.name} is now ${roleTarget.nextRole}`);
      setRoleTarget(null);
      await loadAdminWorkspace();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change account role");
    }
  }

  async function handleUniversityLogoUpload(file?: File) {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const slug = (newUniShort || newUniName || "campus")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      const url = await adminService.uploadUniversityLogo(file, slug);
      setNewUniLogoUrl(url);
      toast.success("University logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  }

  function startEditUniversity(u: UniversityRecord) {
    setEditingUniId(u.id);
    setNewUniName(u.university_name);
    setNewUniShort(u.short_name);
    setNewUniLocation(u.location);
    setNewUniRegion(u.region);
    setNewUniDesc(u.description);
    setNewUniOrder(String(u.display_order));
    setNewUniLogoUrl(u.logo_url);
  }

  function resetUniversityForm() {
    setEditingUniId(undefined);
    setNewUniName("");
    setNewUniShort("");
    setNewUniLocation("");
    setNewUniRegion("");
    setNewUniDesc("");
    setNewUniOrder("20");
    setNewUniLogoUrl(null);
  }

  async function handleSaveUniversity(e: FormEvent) {
    e.preventDefault();
    if (!newUniName.trim() || !newUniShort.trim()) return;
    const slug = newUniShort
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    try {
      await adminService.upsertUniversity({
        id: editingUniId,
        university_name: newUniName,
        short_name: newUniShort,
        slug,
        location: newUniLocation || newUniRegion || "Ghana",
        region: newUniRegion || "Ghana",
        description: newUniDesc,
        display_order: Number(newUniOrder) || 50,
        logo_url: newUniLogoUrl,
      });
      resetUniversityForm();
      toast.success("University saved");
      await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save university");
    }
  }

  function startEditCategory(c: CategoryRecord) {
    setEditingCatId(c.id);
    setNewCatName(c.name);
    setNewCatType(c.category_type);
    setNewCatDesc(c.description);
    setNewCatOrder(String(c.display_order));
  }

  function resetCategoryForm() {
    setEditingCatId(undefined);
    setNewCatName("");
    setNewCatDesc("");
    setNewCatOrder("20");
  }

  async function handleSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = `${newCatType}-${newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    try {
      await adminService.upsertCategory({
        id: editingCatId,
        name: newCatName,
        slug,
        category_type: newCatType,
        description: newCatDesc,
        display_order: Number(newCatOrder) || 50,
      });
      resetCategoryForm();
      toast.success("Category saved");
      await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    }
  }

  async function handleSendBroadcast(e: FormEvent) {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    if (broadcastTargets.length === 0) {
      toast.error("No matching active recipients for this target scope.");
      return;
    }

    setSendingBroadcast(true);
    try {
      const sentCount = await adminService.sendBroadcastNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        notificationType: broadcastType,
        targetUserIds: broadcastTargets,
        scopeLabel: broadcastScope,
      });
      toast.success(`Announcement delivered to ${sentCount} account${sentCount === 1 ? "" : "s"}`);
      setBroadcastTitle("");
      setBroadcastMessage("");
      await Promise.all([loadAdminWorkspace(), refreshNotifications()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not deliver announcement");
    } finally {
      setSendingBroadcast(false);
    }
  }

  async function handleSavePromotion(e: FormEvent) {
    e.preventDefault();
    if (!newPromoName.trim()) return;
    const planKey = newPromoName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    try {
      await adminService.upsertPromotionConfig({
        plan_key: planKey,
        name: newPromoName,
        description: newPromoDesc,
        target_scope: newPromoScope,
        duration_days: Number(newPromoDays) || 7,
        suggested_fee_ghs: Number(newPromoFee) || 0,
        is_active: false,
      });
      setNewPromoName("");
      setNewPromoDesc("");
      toast.success("Promotion slot saved");
      await loadAdminWorkspace();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save promotion slot");
    }
  }

  return (
    <Shell>
      {/* Executive Command Header */}
      <section className="surface-panel hero-panel admin-command-hero curve-accent">
        <HeroAmbient />
        <div className="admin-hero-top">
          <div className="admin-identity">
            <span className="admin-crest" aria-hidden="true">
              <Shield size={24} strokeWidth={2.2} />
            </span>
            <div>
              <span className="admin-eyebrow">CampusLoop Command Center · Live Control</span>
              <h1>Platform Administration</h1>
              <p>
                Signed in as <strong>{user.email}</strong> — full oversight across listings,
                sellers, campuses, reports, and announcements.
              </p>
            </div>
          </div>
          <div className="admin-hero-actions">
            <Button
              variant="outline"
              className="whitespace-nowrap shrink-0"
              onClick={() => void loadAdminWorkspace()}
              disabled={loadingAdmin}
            >
              <RefreshCw size={15} className={loadingAdmin ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="whitespace-nowrap shrink-0"
              onClick={() => setSection("broadcasts")}
            >
              <Megaphone size={15} />
              Announce
            </Button>
            <Button className="dashboard-create-btn whitespace-nowrap shrink-0" asChild>
              <Link to="/discover">
                Marketplace
                <ArrowUpRight size={15} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Full-Width 4-Column Executive KPI Strip */}
        <div className="stats-grid admin-kpi-grid">
          <article className="stat">
            <div className="stat-top">
              <span>Accounts &amp; Sellers</span>
              <Users size={16} />
            </div>
            <strong className="tabular-nums">{totalSellersCount}</strong>
            <small className="tabular-nums">
              {verifiedSellerCount} verified · {summary?.suspended_accounts ?? 0} suspended
            </small>
          </article>
          <article className="stat">
            <div className="stat-top">
              <span>Active Listings</span>
              <ShoppingBag size={16} />
            </div>
            <strong className="tabular-nums">{activeListingsCount}</strong>
            <small className="tabular-nums">
              {productListingsCount} products · {serviceListingsCount} services
            </small>
          </article>
          <article className="stat">
            <div className="stat-top">
              <span>Reports Queue</span>
              <Flag size={16} />
            </div>
            <strong className="tabular-nums">{openReportCount}</strong>
            <small className="tabular-nums">{pendingVerificationCount} pending verifications</small>
          </article>
          <article className="stat">
            <div className="stat-top">
              <span>Contact Enquiries</span>
              <Megaphone size={16} />
            </div>
            <strong className="tabular-nums">{totalClicksCount}</strong>
            <small>Direct buyer-seller connections</small>
          </article>
        </div>
      </section>

      {workspaceError && (
        <section className="surface-panel section-panel admin-warning-panel" role="status">
          <strong>Database setup notice:</strong> {workspaceError}
        </section>
      )}

      {/* Command Center Sidebar + Workspace Viewport */}
      <div className="admin-workspace">
        <aside className="surface-panel admin-sidebar" aria-label="Admin navigation">
          <div className="admin-sidebar-kicker">Controls</div>
          <nav className="admin-sidebar-nav" role="tablist" aria-label="Admin sections">
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              const badgeCount =
                item.id === "reports"
                  ? openReportCount
                  : item.id === "users"
                    ? pendingVerificationCount
                    : item.id === "listings"
                      ? adminListings.filter((l) => l.status === "Paused").length
                      : 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`admin-nav-btn ${active ? "active" : ""}`}
                  onClick={() => setSection(item.id)}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {badgeCount > 0 && <b className="admin-nav-count tabular-nums">{badgeCount}</b>}
                </button>
              );
            })}
          </nav>

          <div className="admin-sidebar-foot">
            <Link to="/dashboard" className="admin-foot-link">
              <LayoutDashboard size={14} />
              <span>Seller Studio</span>
            </Link>
            <Link to="/post" className="admin-foot-link">
              <Plus size={14} />
              <span>Post Listing</span>
            </Link>
          </div>
        </aside>

        <section className="surface-panel admin-content-panel">
          {loadingAdmin && adminListings.length === 0 ? (
            <div className="py-8">
              <PagePendingFallback />
            </div>
          ) : section === "overview" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Platform Health" title="Campus Distribution & Action Queue" />

              <div className="admin-overview-grid">
                <div className="admin-subpanel">
                  <div className="admin-subpanel-head">
                    <h3>Listings by University</h3>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {uniDistribution.length} campuses
                    </span>
                  </div>
                  <div className="admin-bar-list">
                    {uniDistribution.slice(0, 10).map((uni) => {
                      const pct = Math.max(
                        4,
                        Math.round((uni.targeted_listings / maxUniCount) * 100),
                      );
                      return (
                        <div className="admin-bar-row" key={uni.id}>
                          <div className="admin-bar-label">
                            <span>{uni.short_name}</span>
                            <strong className="tabular-nums">{uni.targeted_listings}</strong>
                          </div>
                          <div className="admin-bar-track">
                            <div className="admin-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="admin-subpanel">
                  <div className="admin-subpanel-head">
                    <h3>Priority Actions</h3>
                    <span className="text-xs text-muted-foreground">Quick moderation</span>
                  </div>
                  <div className="admin-priority-list">
                    <button
                      type="button"
                      className="admin-priority-item"
                      onClick={() => {
                        setReportFilter("open");
                        setSection("reports");
                      }}
                    >
                      <div>
                        <strong>Review open reports</strong>
                        <small className="tabular-nums">
                          {openReportCount} report{openReportCount === 1 ? "" : "s"} awaiting action
                        </small>
                      </div>
                      <ArrowUpRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-priority-item"
                      onClick={() => {
                        setUserFilter("unverified");
                        setSection("users");
                      }}
                    >
                      <div>
                        <strong>Verify campus sellers</strong>
                        <small className="tabular-nums">
                          {verifiedSellerCount} verified · {totalSellersCount} total accounts
                        </small>
                      </div>
                      <ArrowUpRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-priority-item"
                      onClick={() => setSection("universities")}
                    >
                      <div>
                        <strong>Manage universities &amp; categories</strong>
                        <small className="tabular-nums">
                          {adminUniversities.length} campuses · {adminCategories.length} categories
                        </small>
                      </div>
                      <ArrowUpRight size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-priority-item"
                      onClick={() => setSection("broadcasts")}
                    >
                      <div>
                        <strong>Send platform announcement</strong>
                        <small>Broadcast campus notices straight to user notifications</small>
                      </div>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-subpanel">
                <div className="admin-subpanel-head">
                  <h3>Recent Moderation Activity</h3>
                  <button type="button" className="text-link" onClick={() => setSection("audit")}>
                    Full log
                  </button>
                </div>
                {auditLogs.length ? (
                  <div className="admin-log-list">
                    {auditLogs.slice(0, 6).map((log) => (
                      <div className="admin-log-row" key={log.id}>
                        <span className="admin-log-action">{log.action.replace(/_/g, " ")}</span>
                        <span className="admin-log-note">
                          {log.target_type} · {log.notes || log.target_id.slice(0, 8)}
                        </span>
                        <time className="tabular-nums">{formatDateTime(log.created_at)}</time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Actions you take across listings, users, reports, and broadcasts are recorded
                    here.
                  </p>
                )}
              </div>
            </div>
          ) : section === "listings" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Catalog Control" title="All Marketplace Listings">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {filteredLiveListings.length} shown
                </span>
              </SectionTitle>

              <div className="admin-toolbar">
                <div className="admin-search-input">
                  <Search size={15} />
                  <input
                    aria-label="Search listings"
                    placeholder="Search title, seller, or category..."
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                  />
                </div>
                <AnimatedSelect
                  variant="filter"
                  ariaLabel="Filter by status"
                  value={listingStatusFilter}
                  onValueChange={setListingStatusFilter}
                  options={["All", "Active", "Paused", "Draft", "Sold", "Unavailable", "Rejected"]}
                />
                <AnimatedSelect
                  variant="filter"
                  ariaLabel="Filter by listing type"
                  value={listingTypeFilter}
                  onValueChange={setListingTypeFilter}
                  options={[
                    { value: "all", label: "All types" },
                    { value: "product", label: "Products" },
                    { value: "service", label: "Services" },
                  ]}
                />
                <Button
                  type="button"
                  variant={listingFeaturedOnly ? "default" : "outline"}
                  className="whitespace-nowrap shrink-0"
                  onClick={() => setListingFeaturedOnly((prev) => !prev)}
                >
                  <Star size={14} />
                  Featured
                </Button>
              </div>

              {filteredLiveListings.length ? (
                <div className="admin-list">
                  {filteredLiveListings.map((item) => {
                    const seller = profileMap.get(item.seller_id);
                    const cat = categoryMap.get(item.category_id);
                    return (
                      <article className="admin-card-row" key={item.id}>
                        <div className="admin-row-main">
                          <div className="admin-row-title">
                            <Link to="/listing/$id" params={{ id: item.id }}>
                              <strong>{item.title}</strong>
                            </Link>
                            <Link
                              to="/listing/$id"
                              params={{ id: item.id }}
                              aria-label={`Open ${item.title}`}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink size={13} />
                            </Link>
                          </div>
                          <small className="tabular-nums">
                            {item.listing_type}
                            {cat ? ` · ${cat.name}` : ""}
                            {item.price !== null ? ` · GH₵ ${item.price}` : ""}
                            {seller ? ` · ${seller.full_name}` : ""}
                            {" · "}
                            <span
                              className={
                                item.status === "Active"
                                  ? "status-text-success"
                                  : item.status === "Rejected"
                                    ? "status-text-danger"
                                    : "status-text-warning"
                              }
                            >
                              {item.status}
                            </span>
                            {item.is_featured ? " · Featured" : ""}
                            {` · ${item.view_count} views · ${item.contact_click_count} clicks`}
                          </small>
                        </div>
                        <div className="admin-card-action">
                          <Button
                            variant={item.is_featured ? "default" : "outline"}
                            size="sm"
                            className="whitespace-nowrap shrink-0"
                            onClick={() =>
                              void handleToggleFeatured(item.id, item.title, !item.is_featured)
                            }
                          >
                            <Star size={14} />
                            {item.is_featured ? "Featured" : "Feature"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap shrink-0"
                            onClick={() =>
                              void handleListingStatus(
                                item.id,
                                item.title,
                                item.status === "Active" ? "Paused" : "Active",
                              )
                            }
                          >
                            {item.status === "Active" ? <EyeOff size={14} /> : <Eye size={14} />}
                            {item.status === "Active" ? "Pause" : "Approve"}
                          </Button>
                          {item.status !== "Rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="whitespace-nowrap shrink-0"
                              onClick={() => setRejectTarget({ id: item.id, title: item.title })}
                            >
                              <Ban size={14} />
                              Reject
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            aria-label={`Delete ${item.title}`}
                            onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty title="No matching listings" text="Adjust your search or status filter." />
              )}
            </div>
          ) : section === "reports" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Trust & Safety" title="Reported Listings & Moderation Queue">
                <AnimatedSelect
                  variant="filter"
                  ariaLabel="Filter reports"
                  value={reportFilter}
                  onValueChange={setReportFilter}
                  options={[
                    { value: "all", label: "All reports" },
                    { value: "open", label: "Open" },
                    { value: "reviewing", label: "Reviewing" },
                    { value: "resolved", label: "Resolved" },
                    { value: "dismissed", label: "Dismissed" },
                  ]}
                />
              </SectionTitle>

              {filteredReports.length ? (
                <div className="admin-list">
                  {filteredReports.map((rep) => {
                    const reportedTitle = rep.listing_id
                      ? listingTitleMap.get(rep.listing_id) || "Reported listing"
                      : "Account report";
                    return (
                      <article className="admin-card-row" key={rep.id}>
                        <div className="admin-row-main">
                          <div className="admin-row-title">
                            <strong>{rep.reason}</strong>
                            {rep.listing_id && (
                              <Link
                                to="/listing/$id"
                                params={{ id: rep.listing_id }}
                                className="text-link text-xs"
                              >
                                View listing <ExternalLink size={12} />
                              </Link>
                            )}
                          </div>
                          <small className="tabular-nums">
                            {reportedTitle} ·{" "}
                            <span
                              className={
                                rep.status === "resolved" || rep.status === "dismissed"
                                  ? "status-text-success"
                                  : "status-text-danger"
                              }
                            >
                              {rep.status}
                            </span>{" "}
                            · {formatShortDate(rep.created_at)}
                            {rep.description ? ` · ${rep.description}` : ""}
                          </small>
                        </div>
                        <div className="admin-card-action">
                          {rep.listing_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="whitespace-nowrap shrink-0"
                              onClick={() =>
                                void handleListingStatus(
                                  rep.listing_id!,
                                  reportedTitle,
                                  "Paused",
                                  `Paused due to report: ${rep.reason}`,
                                )
                              }
                            >
                              <EyeOff size={14} />
                              Pause listing
                            </Button>
                          )}
                          {rep.status === "open" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="whitespace-nowrap shrink-0"
                              onClick={() => void handleReportAction(rep.id, "reviewing")}
                            >
                              Reviewing
                            </Button>
                          )}
                          <Button
                            variant={rep.status === "resolved" ? "secondary" : "default"}
                            size="sm"
                            className="whitespace-nowrap shrink-0"
                            onClick={() =>
                              void handleReportAction(
                                rep.id,
                                rep.status === "resolved" ? "open" : "resolved",
                              )
                            }
                          >
                            <Check size={14} />
                            {rep.status === "resolved" ? "Reopen" : "Resolve"}
                          </Button>
                          {rep.status !== "dismissed" && rep.status !== "resolved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="whitespace-nowrap shrink-0"
                              onClick={() => void handleReportAction(rep.id, "dismissed")}
                            >
                              Dismiss
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty title="No matching reports" text="All clear in this queue." />
              )}
            </div>
          ) : section === "users" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Accounts & Trust" title="Users, Verification & Roles">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {filteredProfiles.length} accounts
                </span>
              </SectionTitle>

              <div className="admin-toolbar">
                <div className="admin-search-input">
                  <Search size={15} />
                  <input
                    aria-label="Search users"
                    placeholder="Search name, @username, or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <AnimatedSelect
                  variant="filter"
                  ariaLabel="Filter users"
                  value={userFilter}
                  onValueChange={setUserFilter}
                  options={[
                    { value: "all", label: "All accounts" },
                    { value: "verified", label: "Verified sellers" },
                    { value: "pending", label: "Pending review" },
                    { value: "unverified", label: "Unverified" },
                    { value: "suspended", label: "Suspended" },
                    { value: "admin", label: "Administrators" },
                  ]}
                />
              </div>

              {filteredProfiles.length ? (
                <div className="admin-list">
                  {filteredProfiles.map((prof) => {
                    const isSelf = prof.id === user.id;
                    const isVerified = prof.verification_status === "verified";
                    return (
                      <article className="admin-card-row" key={prof.id}>
                        <div className="admin-row-main">
                          <div className="admin-row-title">
                            <strong>
                              {prof.full_name} (@{prof.username})
                            </strong>
                            {isVerified && (
                              <BadgeCheck
                                size={15}
                                className="text-primary shrink-0"
                                aria-label="Verified"
                              />
                            )}
                          </div>
                          <small className="tabular-nums">
                            {prof.email} · {prof.account_type} ·{" "}
                            <span
                              className={
                                prof.role === "admin" ? "text-primary font-bold" : undefined
                              }
                            >
                              {prof.role}
                            </span>
                            {" · "}
                            <span
                              className={
                                prof.is_suspended
                                  ? "status-text-danger"
                                  : isVerified
                                    ? "status-text-success"
                                    : undefined
                              }
                            >
                              {prof.is_suspended
                                ? "Suspended"
                                : isVerified
                                  ? "Verified"
                                  : prof.verification_status}
                            </span>
                            {` · Joined ${formatShortDate(prof.created_at)}`}
                          </small>
                        </div>
                        <div className="admin-card-action">
                          <Button
                            variant={isVerified ? "secondary" : "outline"}
                            size="sm"
                            className="whitespace-nowrap shrink-0"
                            onClick={() =>
                              void handleUserVerification(
                                prof,
                                isVerified ? "unverified" : "verified",
                              )
                            }
                          >
                            <BadgeCheck size={14} />
                            {isVerified ? "Verified" : "Verify"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap shrink-0"
                            onClick={() => {
                              setBroadcastScope("single");
                              setBroadcastUserId(prof.id);
                              setSection("broadcasts");
                            }}
                          >
                            <Send size={14} />
                            Notify
                          </Button>
                          {!isSelf && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap shrink-0"
                                onClick={() =>
                                  setRoleTarget({
                                    id: prof.id,
                                    name: prof.full_name,
                                    nextRole: prof.role === "admin" ? "user" : "admin",
                                  })
                                }
                              >
                                <UserCog size={14} />
                                {prof.role === "admin" ? "Demote" : "Make Admin"}
                              </Button>
                              <Button
                                variant={prof.is_suspended ? "outline" : "destructive"}
                                size="sm"
                                className="whitespace-nowrap shrink-0"
                                onClick={() =>
                                  void adminService
                                    .toggleUserSuspension(
                                      prof.id,
                                      !prof.is_suspended,
                                      prof.is_suspended
                                        ? "Account restored"
                                        : "Suspended by administrator",
                                    )
                                    .then(() => {
                                      toast.success(
                                        prof.is_suspended
                                          ? `${prof.full_name} restored`
                                          : `${prof.full_name} suspended`,
                                      );
                                      return loadAdminWorkspace();
                                    })
                                    .catch((err) =>
                                      toast.error(
                                        err instanceof Error ? err.message : "Action failed",
                                      ),
                                    )
                                }
                              >
                                {prof.is_suspended ? <RotateCcw size={14} /> : <Ban size={14} />}
                                {prof.is_suspended ? "Restore" : "Suspend"}
                              </Button>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty title="No matching users" text="Try another search term or filter." />
              )}
            </div>
          ) : section === "universities" ? (
            <div className="admin-section-stack">
              <SectionTitle
                eyebrow="Campus Network"
                title={editingUniId ? "Edit University" : "Manage Universities"}
              >
                {editingUniId && (
                  <Button variant="ghost" size="sm" onClick={resetUniversityForm}>
                    Cancel edit
                  </Button>
                )}
              </SectionTitle>

              <form className="admin-form-panel" onSubmit={(e) => void handleSaveUniversity(e)}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>University full name</span>
                    <input
                      required
                      placeholder="Kwame Nkrumah University of Science and Technology"
                      value={newUniName}
                      onChange={(e) => setNewUniName(e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Short name</span>
                    <input
                      required
                      placeholder="KNUST"
                      value={newUniShort}
                      onChange={(e) => setNewUniShort(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-grid">
                  <label className="form-field">
                    <span>City / Campus location</span>
                    <input
                      placeholder="Kumasi"
                      value={newUniLocation}
                      onChange={(e) => setNewUniLocation(e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Region</span>
                    <input
                      placeholder="Ashanti"
                      value={newUniRegion}
                      onChange={(e) => setNewUniRegion(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Description</span>
                    <input
                      placeholder="Short campus summary..."
                      value={newUniDesc}
                      onChange={(e) => setNewUniDesc(e.target.value)}
                    />
                  </label>
                  <div className="flex flex-wrap items-end gap-2">
                    <label className="form-field w-24 !mb-0">
                      <span>Order</span>
                      <input
                        type="number"
                        min={1}
                        value={newUniOrder}
                        onChange={(e) => setNewUniOrder(e.target.value)}
                      />
                    </label>
                    <label className="admin-logo-upload">
                      <Upload size={14} />
                      <span>
                        {uploadingLogo ? "Uploading..." : newUniLogoUrl ? "Logo ready" : "Logo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploadingLogo}
                        onChange={(e) => {
                          void handleUniversityLogoUpload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <Button type="submit" className="whitespace-nowrap shrink-0">
                      <Plus size={15} />
                      {editingUniId ? "Save campus" : "Add campus"}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="admin-list">
                {adminUniversities.map((u) => (
                  <article className="admin-card-row" key={u.id}>
                    <div className="admin-row-main">
                      <strong>
                        {u.short_name} — {u.university_name}
                      </strong>
                      <small>
                        {u.location ? `${u.location} · ` : ""}
                        {u.region} ·{" "}
                        <span
                          className={u.is_active ? "status-text-success" : "status-text-warning"}
                        >
                          {u.is_active ? "Active" : "Disabled"}
                        </span>
                      </small>
                    </div>
                    <div className="admin-card-action">
                      <Button variant="ghost" size="sm" onClick={() => startEditUniversity(u)}>
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void adminService
                            .toggleUniversityActive(u.id, !u.is_active)
                            .then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()]))
                            .then(() => toast.success("University status updated"))
                            .catch((err) =>
                              toast.error(
                                err instanceof Error
                                  ? err.message
                                  : "Could not update university status",
                              ),
                            );
                        }}
                      >
                        {u.is_active ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : section === "categories" ? (
            <div className="admin-section-stack">
              <SectionTitle
                eyebrow="Taxonomy"
                title={editingCatId ? "Edit Category" : "Manage Categories"}
              >
                <div className="segmented compact-tabs">
                  {(["all", "product", "service"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={categoryFilter === t ? "selected" : ""}
                      onClick={() => setCategoryFilter(t)}
                    >
                      {t === "all" ? "All" : t === "product" ? "Products" : "Services"}
                    </button>
                  ))}
                </div>
              </SectionTitle>

              <form className="admin-form-panel" onSubmit={(e) => void handleSaveCategory(e)}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Category name</span>
                    <input
                      required
                      placeholder="Dorm Tech"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                  </label>
                  <div className="form-field">
                    <span>Category type</span>
                    <AnimatedSelect
                      ariaLabel="Category type"
                      value={newCatType}
                      onValueChange={(v) => setNewCatType(v as CategoryType)}
                      options={[
                        { value: "product", label: "Product category" },
                        { value: "service", label: "Service category" },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <label className="form-field flex-1 !mb-0">
                    <span>Description</span>
                    <input
                      placeholder="Short category description..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                    />
                  </label>
                  <label className="form-field w-24 !mb-0">
                    <span>Order</span>
                    <input
                      type="number"
                      min={1}
                      value={newCatOrder}
                      onChange={(e) => setNewCatOrder(e.target.value)}
                    />
                  </label>
                  {editingCatId && (
                    <Button type="button" variant="ghost" onClick={resetCategoryForm}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className="whitespace-nowrap shrink-0">
                    <Plus size={15} />
                    {editingCatId ? "Save category" : "Add category"}
                  </Button>
                </div>
              </form>

              <div className="admin-list">
                {adminCategories
                  .filter((c) => categoryFilter === "all" || c.category_type === categoryFilter)
                  .map((c) => (
                    <article className="admin-card-row" key={c.id}>
                      <div className="admin-row-main">
                        <strong>{c.name}</strong>
                        <small>
                          {c.category_type} ·{" "}
                          <span
                            className={c.is_active ? "status-text-success" : "status-text-warning"}
                          >
                            {c.is_active ? "Active" : "Hidden"}
                          </span>
                        </small>
                      </div>
                      <div className="admin-card-action">
                        <Button variant="ghost" size="sm" onClick={() => startEditCategory(c)}>
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            void adminService
                              .toggleCategoryActive(c.id, !c.is_active)
                              .then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()]))
                              .then(() => toast.success("Category updated"))
                              .catch((err) =>
                                toast.error(
                                  err instanceof Error ? err.message : "Could not update category",
                                ),
                              );
                          }}
                        >
                          {c.is_active ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ) : section === "broadcasts" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Communications" title="Announcements & User Notifications">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {broadcastTargets.length} recipient{broadcastTargets.length === 1 ? "" : "s"}
                </span>
              </SectionTitle>

              <form className="admin-form-panel" onSubmit={(e) => void handleSendBroadcast(e)}>
                <div className="form-grid">
                  <div className="form-field">
                    <span>Target audience</span>
                    <AnimatedSelect
                      ariaLabel="Target audience"
                      value={broadcastScope}
                      onValueChange={setBroadcastScope}
                      options={[
                        { value: "all", label: "All active users" },
                        { value: "verified", label: "Verified sellers only" },
                        { value: "university", label: "Specific university" },
                        { value: "single", label: "Single user account" },
                      ]}
                    />
                  </div>
                  <div className="form-field">
                    <span>Notification type</span>
                    <AnimatedSelect
                      ariaLabel="Notification type"
                      value={broadcastType}
                      onValueChange={(v) => setBroadcastType(v as NotificationType)}
                      options={[
                        { value: "platform_announcement", label: "Platform announcement" },
                        { value: "account_update", label: "Account update" },
                        { value: "listing_approved", label: "Marketplace highlight" },
                      ]}
                    />
                  </div>
                </div>

                {broadcastScope === "university" && (
                  <div className="form-field">
                    <span>Select university</span>
                    <AnimatedSelect
                      ariaLabel="Select university"
                      value={broadcastUniId}
                      onValueChange={setBroadcastUniId}
                      placeholder="Choose campus"
                      options={adminUniversities.map((u) => ({
                        value: u.id,
                        label: `${u.short_name} — ${u.university_name}`,
                      }))}
                    />
                  </div>
                )}

                {broadcastScope === "single" && (
                  <div className="form-field">
                    <span>Select user</span>
                    <AnimatedSelect
                      ariaLabel="Select recipient user"
                      value={broadcastUserId}
                      onValueChange={setBroadcastUserId}
                      placeholder="Choose user account"
                      options={adminProfiles.map((p) => ({
                        value: p.id,
                        label: `${p.full_name} (@${p.username})`,
                      }))}
                    />
                  </div>
                )}

                <label className="form-field">
                  <span>Announcement headline</span>
                  <input
                    required
                    placeholder="e.g. Semester move-in marketplace guidelines"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Message</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write the message users will see in their Dashboard notifications..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                </label>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="dashboard-create-btn whitespace-nowrap shrink-0"
                    disabled={sendingBroadcast}
                  >
                    <Send size={15} />
                    {sendingBroadcast ? "Sending..." : "Send announcement"}
                  </Button>
                </div>
              </form>
            </div>
          ) : section === "promotions" ? (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Featured Slots Prep" title="Promotion Slot Configurations" />
              <p className="text-sm text-muted-foreground mb-2">
                Configure featured slot durations and reference values. CampusLoop has zero payment
                gateways or in-app checkout.
              </p>

              <form className="admin-form-panel" onSubmit={(e) => void handleSavePromotion(e)}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Plan name</span>
                    <input
                      required
                      placeholder="Hall Week Spotlight (5 days)"
                      value={newPromoName}
                      onChange={(e) => setNewPromoName(e.target.value)}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="form-field flex-1 min-w-[120px] !mb-0">
                      <span>Scope</span>
                      <AnimatedSelect
                        ariaLabel="Promotion scope"
                        value={newPromoScope}
                        onValueChange={setNewPromoScope}
                        options={["listing", "service", "banner"]}
                      />
                    </div>
                    <label className="form-field w-24 !mb-0">
                      <span>Days</span>
                      <input
                        type="number"
                        min={1}
                        value={newPromoDays}
                        onChange={(e) => setNewPromoDays(e.target.value)}
                      />
                    </label>
                    <label className="form-field w-28 !mb-0">
                      <span>Ref. GH₵</span>
                      <input
                        type="number"
                        min={0}
                        value={newPromoFee}
                        onChange={(e) => setNewPromoFee(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <label className="form-field flex-1 min-w-[180px] !mb-0">
                    <span>Description</span>
                    <input
                      placeholder="Where and how this featured slot appears..."
                      value={newPromoDesc}
                      onChange={(e) => setNewPromoDesc(e.target.value)}
                    />
                  </label>
                  <Button type="submit" className="whitespace-nowrap shrink-0">
                    <Plus size={15} />
                    Add slot
                  </Button>
                </div>
              </form>

              {promotionConfigs.length ? (
                <div className="admin-list">
                  {promotionConfigs.map((promo) => (
                    <article className="admin-card-row" key={promo.id}>
                      <div className="admin-row-main">
                        <strong>{promo.name}</strong>
                        <small className="tabular-nums">
                          {promo.target_scope} · {promo.duration_days} days · Reference GH₵{" "}
                          {promo.suggested_fee_ghs} ·{" "}
                          <span
                            className={
                              promo.is_active ? "status-text-success" : "status-text-warning"
                            }
                          >
                            {promo.is_active ? "Active" : "Disabled"}
                          </span>
                        </small>
                      </div>
                      <div className="admin-card-action">
                        <Button
                          variant={promo.is_active ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            void adminService
                              .togglePromotionConfig(promo.id, !promo.is_active)
                              .then(() => loadAdminWorkspace())
                              .then(() => toast.success("Promotion slot updated"))
                              .catch((err) =>
                                toast.error(
                                  err instanceof Error
                                    ? err.message
                                    : "Could not update promotion slot",
                                ),
                              )
                          }
                        >
                          {promo.is_active ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title="No promotion configs"
                  text="Add a featured slot configuration above."
                />
              )}
            </div>
          ) : (
            <div className="admin-section-stack">
              <SectionTitle eyebrow="Accountability" title="Moderation & Admin Audit Log">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {auditLogs.length} entries
                </span>
              </SectionTitle>
              {auditLogs.length ? (
                <div className="admin-log-list">
                  {auditLogs.map((log) => {
                    const actor = profileMap.get(log.admin_id);
                    return (
                      <div className="admin-log-row" key={log.id}>
                        <span className="admin-log-action">{log.action.replace(/_/g, " ")}</span>
                        <span className="admin-log-note">
                          {actor ? `${actor.full_name} · ` : ""}
                          {log.target_type} · {log.notes || log.target_id.slice(0, 12)}
                        </span>
                        <time className="tabular-nums">{formatDateTime(log.created_at)}</time>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  title="No audit events yet"
                  text="Listing approvals, suspensions, verifications, and announcements will appear here."
                />
              )}
            </div>
          )}

          <p className="admin-note">
            CampusLoop Admin Command Center · Direct community oversight without order checkouts or
            payment processing.
          </p>
        </section>
      </div>

      {/* Reject Listing with Note Dialog */}
      <Dialog open={Boolean(rejectTarget)} onOpenChange={() => setRejectTarget(null)}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Reject listing</DialogTitle>
          <DialogDescription>
            Provide a short reason for rejecting “{rejectTarget?.title}”. The seller will receive
            this update in their notifications.
          </DialogDescription>
          <form className="modal-body" onSubmit={(e) => void handleConfirmReject(e)}>
            <label className="form-field">
              <span>Moderation note</span>
              <textarea
                rows={3}
                required
                placeholder="e.g. Prohibited item or misleading pricing"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            </label>
            <div className="form-bottom">
              <Button type="button" variant="outline" onClick={() => setRejectTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Reject listing
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Listing Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Delete listing permanently?</DialogTitle>
          <DialogDescription>
            “{deleteTarget?.title}” and its linked images and analytics will be permanently removed.
          </DialogDescription>
          <div className="form-bottom">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleConfirmDeleteListing()}>
              Delete permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Role Change Dialog */}
      <Dialog open={Boolean(roleTarget)} onOpenChange={() => setRoleTarget(null)}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>
            {roleTarget?.nextRole === "admin"
              ? "Grant administrator access?"
              : "Revoke administrator access?"}
          </DialogTitle>
          <DialogDescription>
            {roleTarget?.nextRole === "admin"
              ? `${roleTarget?.name} will gain full control over all CampusLoop listings, accounts, campuses, and moderation tools.`
              : `${roleTarget?.name} will be returned to standard seller/member permissions.`}
          </DialogDescription>
          <div className="form-bottom">
            <Button variant="outline" onClick={() => setRoleTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={roleTarget?.nextRole === "admin" ? "default" : "destructive"}
              onClick={() => void handleConfirmRoleChange()}
            >
              Confirm role change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
