import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Shield, Check, EyeOff, Eye, Plus, Ban, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCampus } from "./store";
import { Logo, PageIntro, Empty, ThemeToggle, HeroAmbient, PagePendingFallback } from "./shared";
import {
  universities as fallbackUniversities,
  productCategories as fallbackProductCategories,
  serviceCategories as fallbackServiceCategories,
} from "@/lib/campus/data";
import { adminService, categoryService, universityService } from "@/services";
import type {
  AdminDashboardSummary,
  CategoryRecord,
  CategoryType,
  ListingStatus,
  ProfileRecord,
  PromotionConfigRecord,
  ReportRecord,
  UniversityRecord,
} from "@/lib/supabase/database.types";

type AdminListingRow = {
  id: string;
  title: string;
  listing_type: string;
  status: ListingStatus;
  is_featured: boolean;
  seller_id: string;
  created_at: string;
};

export function AdminPage() {
  const {
    backendConfigured,
    authLoading,
    listings,
    setListings,
    reports,
    resolveReport,
    user,
    refreshMetadata,
    refreshListings,
  } = useCampus();

  const [tab, setTab] = useState("Moderation");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [adminListings, setAdminListings] = useState<AdminListingRow[]>([]);
  const [adminReports, setAdminReports] = useState<ReportRecord[]>([]);
  const [adminProfiles, setAdminProfiles] = useState<ProfileRecord[]>([]);
  const [adminUniversities, setAdminUniversities] = useState<UniversityRecord[]>([]);
  const [adminCategories, setAdminCategories] = useState<CategoryRecord[]>([]);
  const [promotionConfigs, setPromotionConfigs] = useState<PromotionConfigRecord[]>([]);

  const [newUniName, setNewUniName] = useState("");
  const [newUniShort, setNewUniShort] = useState("");
  const [newUniRegion, setNewUniRegion] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<CategoryType>("product");

  const isAdminUser = user?.role === "admin";

  const loadAdminWorkspace = useCallback(async () => {
    if (!backendConfigured || !isAdminUser) return;
    setLoadingAdmin(true);
    try {
      const [sum, listRows, reportRows, profileRows, uniRows, catRows, promoRows] =
        await Promise.all([
          adminService.getSummary(),
          adminService.listAllListings(60),
          adminService.listReports(),
          adminService.listAllProfiles(60),
          universityService.listAllUniversities(),
          categoryService.listAllCategories(),
          adminService.listPromotionConfigs(),
        ]);
      setSummary(sum);
      setAdminListings(listRows);
      setAdminReports(reportRows);
      setAdminProfiles(profileRows);
      setAdminUniversities(uniRows);
      setAdminCategories(catRows);
      setPromotionConfigs(promoRows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load admin records");
    } finally {
      setLoadingAdmin(false);
    }
  }, [backendConfigured, isAdminUser]);

  useEffect(() => {
    void loadAdminWorkspace();
  }, [loadAdminWorkspace]);

  if (authLoading) {
    return (
      <div className="market-main">
        <PagePendingFallback />
      </div>
    );
  }

  if (backendConfigured && !isAdminUser) {
    return (
      <div className="market-main">
        <section className="surface-panel hero-panel curve-accent">
          <HeroAmbient />
          <div className="dashboard-top">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle compact />
              <Button variant="outline" asChild>
                <Link to="/discover">Back to marketplace</Link>
              </Button>
            </div>
          </div>
          <Empty
            title="Admin authorization required"
            text="This moderation console is restricted to accounts granted the admin role in Supabase."
          >
            <Button asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Return to Dashboard" : "Sign in"}
              </Link>
            </Button>
          </Empty>
        </section>
      </div>
    );
  }

  async function handleAddUniversity(e: FormEvent) {
    e.preventDefault();
    if (!newUniName.trim() || !newUniShort.trim()) return;
    const slug = newUniShort
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    try {
      await adminService.upsertUniversity({
        university_name: newUniName,
        short_name: newUniShort,
        slug,
        location: newUniRegion || "Ghana",
        region: newUniRegion || "Ghana",
      });
      setNewUniName("");
      setNewUniShort("");
      setNewUniRegion("");
      toast.success("University saved");
      await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save university");
    }
  }

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = `${newCatType}-${newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    try {
      await adminService.upsertCategory({
        name: newCatName,
        slug,
        category_type: newCatType,
      });
      setNewCatName("");
      toast.success("Category saved");
      await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    }
  }

  const tabs = backendConfigured
    ? ["Moderation", "Reports", "Users", "Categories", "Universities", "Featured", "Promotions"]
    : ["Moderation", "Reports", "Users", "Categories", "Universities", "Featured"];

  const offlineRows =
    tab === "Reports"
      ? reports.map((r) => ({
          id: r.id,
          name: listings.find((l) => l.id === r.listingId)?.title || "Removed listing",
          detail: `${r.reason} · ${r.resolved ? "Resolved" : "Open"}`,
          resolved: Boolean(r.resolved),
        }))
      : tab === "Users"
        ? [
            ...new Map(
              listings.map((l) => [
                l.seller,
                { id: l.seller, name: l.seller, detail: l.university },
              ]),
            ).values(),
            ...(user
              ? [
                  {
                    id: user.email,
                    name: user.name,
                    detail: `${user.university} · Current session`,
                  },
                ]
              : []),
          ]
        : tab === "Categories"
          ? [...new Set([...fallbackProductCategories, ...fallbackServiceCategories])].map((c) => ({
              id: c,
              name: c,
              detail: fallbackProductCategories.includes(c)
                ? "Product category"
                : "Service category",
            }))
          : tab === "Universities"
            ? fallbackUniversities.map((u) => ({
                id: u,
                name: u,
                detail: "Participating campus",
              }))
            : listings.map((l) => ({
                id: l.id,
                name: l.title,
                detail: `${l.seller} · ${l.status}`,
                status: l.status,
                featured: Boolean(l.featured),
              }));

  return (
    <div className="market-main">
      <section className="surface-panel hero-panel curve-accent">
        <HeroAmbient />
        <div className="dashboard-top">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button variant="outline" asChild>
              <Link to="/discover">Back to marketplace</Link>
            </Button>
          </div>
        </div>

        <PageIntro
          title="Community moderation"
          text={
            backendConfigured
              ? "Live moderation, reports, universities, categories, and campus analytics."
              : "Internal moderation preview. Connect Supabase credentials for persistent admin controls."
          }
        />

        {backendConfigured && summary && (
          <div className="stats-grid mb-4">
            <article className="stat">
              <div className="stat-top">
                <span>Sellers</span>
              </div>
              <strong>{summary.total_sellers}</strong>
              <small>{summary.suspended_accounts} suspended</small>
            </article>
            <article className="stat">
              <div className="stat-top">
                <span>Active Listings</span>
              </div>
              <strong>{summary.active_listings}</strong>
              <small>
                {summary.total_products} products · {summary.total_services} services
              </small>
            </article>
            <article className="stat">
              <div className="stat-top">
                <span>Open Reports</span>
              </div>
              <strong>{summary.open_reports}</strong>
              <small>Moderation queue</small>
            </article>
            <article className="stat">
              <div className="stat-top">
                <span>Contact Clicks</span>
              </div>
              <strong>{summary.total_contact_clicks}</strong>
              <small>All campuses</small>
            </article>
          </div>
        )}

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {tabs.map((t) => (
            <Button key={t} variant={t === tab ? "default" : "outline"} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
        </div>
      </section>

      <section className="surface-panel section-panel">
        {backendConfigured ? (
          loadingAdmin ? (
            <PagePendingFallback />
          ) : tab === "Moderation" || tab === "Featured" ? (
            adminListings.length ? (
              <div className="admin-list">
                {adminListings.map((item) => (
                  <article className="admin-card-row" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <small>
                        {item.listing_type} · {item.status}
                        {item.is_featured ? " · Featured" : ""}
                      </small>
                    </div>
                    <div className="admin-card-action flex gap-2">
                      {tab === "Featured" ? (
                        <Button
                          variant={item.is_featured ? "default" : "outline"}
                          onClick={() =>
                            void adminService
                              .toggleFeaturedListing(item.id, !item.is_featured)
                              .then(() => {
                                toast.success(
                                  item.is_featured ? "Removed from featured" : "Marked featured",
                                );
                                return Promise.all([loadAdminWorkspace(), refreshListings()]);
                              })
                          }
                        >
                          <Star size={15} />
                          {item.is_featured ? "Featured" : "Feature"}
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() =>
                              void adminService
                                .moderateListing(
                                  item.id,
                                  item.status === "Active" ? "Paused" : "Active",
                                  "Updated by admin moderation",
                                )
                                .then(() => Promise.all([loadAdminWorkspace(), refreshListings()]))
                            }
                          >
                            {item.status === "Active" ? <EyeOff size={15} /> : <Eye size={15} />}
                            {item.status === "Active" ? "Pause" : "Approve"}
                          </Button>
                          {item.status !== "Rejected" && (
                            <Button
                              variant="destructive"
                              onClick={() =>
                                void adminService
                                  .moderateListing(item.id, "Rejected", "Policy violation")
                                  .then(() =>
                                    Promise.all([loadAdminWorkspace(), refreshListings()]),
                                  )
                              }
                            >
                              <Ban size={15} />
                              Reject
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty title="No listings found" text="Published listings will appear here." />
            )
          ) : tab === "Reports" ? (
            adminReports.length ? (
              <div className="admin-list">
                {adminReports.map((rep) => (
                  <article className="admin-card-row" key={rep.id}>
                    <div>
                      <strong>{rep.reason}</strong>
                      <small>
                        {rep.status} · {rep.description || "No additional details"}
                      </small>
                    </div>
                    <div className="admin-card-action flex gap-2">
                      <Button
                        variant={rep.status === "resolved" ? "secondary" : "outline"}
                        onClick={() =>
                          void adminService
                            .resolveReport(
                              rep.id,
                              rep.status === "resolved" ? "open" : "resolved",
                              "Reviewed in admin console",
                            )
                            .then(() => loadAdminWorkspace())
                        }
                      >
                        <Check size={15} />
                        {rep.status === "resolved" ? "Resolved" : "Resolve"}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty title="No open reports" text="Reported listings will appear here." />
            )
          ) : tab === "Users" ? (
            <div className="admin-list">
              {adminProfiles.map((prof) => (
                <article className="admin-card-row" key={prof.id}>
                  <div>
                    <strong>
                      {prof.full_name} (@{prof.username})
                    </strong>
                    <small>
                      {prof.account_type} · {prof.role} ·{" "}
                      {prof.is_suspended ? "Suspended" : "Active"}
                    </small>
                  </div>
                  <div className="admin-card-action">
                    <Button
                      variant={prof.is_suspended ? "outline" : "destructive"}
                      onClick={() =>
                        void adminService
                          .toggleUserSuspension(
                            prof.id,
                            !prof.is_suspended,
                            prof.is_suspended ? "Account restored" : "Suspended by moderator",
                          )
                          .then(() => loadAdminWorkspace())
                      }
                    >
                      {prof.is_suspended ? <RotateCcw size={15} /> : <Ban size={15} />}
                      {prof.is_suspended ? "Restore" : "Suspend"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : tab === "Universities" ? (
            <>
              <form className="form-grid mb-4" onSubmit={(e) => void handleAddUniversity(e)}>
                <label className="form-field">
                  <span>University full name</span>
                  <input
                    required
                    placeholder="University of Energy and Natural Resources"
                    value={newUniName}
                    onChange={(e) => setNewUniName(e.target.value)}
                  />
                </label>
                <div className="flex gap-2 items-end mb-4">
                  <label className="form-field flex-1 !mb-0">
                    <span>Short name</span>
                    <input
                      required
                      placeholder="UENR"
                      value={newUniShort}
                      onChange={(e) => setNewUniShort(e.target.value)}
                    />
                  </label>
                  <label className="form-field flex-1 !mb-0">
                    <span>Region</span>
                    <input
                      placeholder="Bono"
                      value={newUniRegion}
                      onChange={(e) => setNewUniRegion(e.target.value)}
                    />
                  </label>
                  <Button type="submit">
                    <Plus size={15} /> Add
                  </Button>
                </div>
              </form>
              <div className="admin-list">
                {adminUniversities.map((u) => (
                  <article className="admin-card-row" key={u.id}>
                    <div>
                      <strong>
                        {u.short_name} — {u.university_name}
                      </strong>
                      <small>
                        {u.region} · {u.is_active ? "Active" : "Disabled"}
                      </small>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        void adminService
                          .toggleUniversityActive(u.id, !u.is_active)
                          .then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()]))
                      }
                    >
                      {u.is_active ? "Disable" : "Enable"}
                    </Button>
                  </article>
                ))}
              </div>
            </>
          ) : tab === "Categories" ? (
            <>
              <form
                className="flex flex-wrap gap-2 items-end mb-4"
                onSubmit={(e) => void handleAddCategory(e)}
              >
                <label className="form-field flex-1 !mb-0">
                  <span>Category name</span>
                  <input
                    required
                    placeholder="Dorm Tech"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setNewCatType((prev) => (prev === "product" ? "service" : "product"))
                  }
                >
                  Type: {newCatType}
                </Button>
                <Button type="submit">
                  <Plus size={15} /> Add category
                </Button>
              </form>
              <div className="admin-list">
                {adminCategories.map((c) => (
                  <article className="admin-card-row" key={c.id}>
                    <div>
                      <strong>{c.name}</strong>
                      <small>
                        {c.category_type} · {c.is_active ? "Active" : "Hidden"}
                      </small>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        void adminService
                          .toggleCategoryActive(c.id, !c.is_active)
                          .then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()]))
                      }
                    >
                      {c.is_active ? "Hide" : "Show"}
                    </Button>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="admin-list">
              {promotionConfigs.map((promo) => (
                <article className="admin-card-row" key={promo.id}>
                  <div>
                    <strong>{promo.name}</strong>
                    <small>
                      {promo.target_scope} · {promo.duration_days} days · Reference GH₵{" "}
                      {promo.suggested_fee_ghs} (no checkout enabled)
                    </small>
                  </div>
                  <Button
                    variant={promo.is_active ? "default" : "outline"}
                    onClick={() =>
                      void adminService
                        .togglePromotionConfig(promo.id, !promo.is_active)
                        .then(() => loadAdminWorkspace())
                    }
                  >
                    {promo.is_active ? "Active" : "Disabled"}
                  </Button>
                </article>
              ))}
            </div>
          )
        ) : offlineRows.length ? (
          <div className="admin-list">
            {offlineRows.map((r) => (
              <article className="admin-card-row" key={r.id}>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.detail}</small>
                </div>
                <div className="admin-card-action">
                  {tab === "Featured" ? (
                    <Button
                      variant={"featured" in r && r.featured ? "default" : "outline"}
                      onClick={() =>
                        setListings((prev) =>
                          prev.map((l) => (l.id === r.id ? { ...l, featured: !l.featured } : l)),
                        )
                      }
                    >
                      {"featured" in r && r.featured ? <Check size={15} /> : <Shield size={15} />}
                      {"featured" in r && r.featured ? "Featured" : "Feature"}
                    </Button>
                  ) : tab === "Moderation" ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setListings((prev) =>
                          prev.map((l) =>
                            l.id === r.id
                              ? {
                                  ...l,
                                  status: l.status === "Active" ? "Paused" : "Active",
                                }
                              : l,
                          ),
                        )
                      }
                    >
                      {"status" in r && r.status === "Active" ? (
                        <>
                          <EyeOff size={15} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Eye size={15} />
                          Activate
                        </>
                      )}
                    </Button>
                  ) : tab === "Reports" ? (
                    <Button
                      variant={"resolved" in r && r.resolved ? "secondary" : "outline"}
                      onClick={() => resolveReport(r.id)}
                    >
                      <Check size={15} />
                      {"resolved" in r && r.resolved ? "Resolved" : "Resolve"}
                    </Button>
                  ) : (
                    <Button
                      variant={reviewed.includes(r.id) ? "secondary" : "ghost"}
                      onClick={() =>
                        setReviewed((prev) => (prev.includes(r.id) ? prev : [...prev, r.id]))
                      }
                    >
                      {reviewed.includes(r.id) ? "Reviewed" : "Mark reviewed"}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty title="No open reports" text="Reported listings will appear here." />
        )}

        <p className="admin-note">
          Separate administrative area hidden from buyer and non-admin navigation. CampusLoop never
          processes payments or order checkouts.
        </p>
      </section>
    </div>
  );
}
