import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { $ as FileCheckCorner, A as RotateCcw, Ct as ArrowUpRight, D as Send, L as Megaphone, M as Plus, O as Search, P as Pencil, S as Shield, St as BadgeCheck, W as LayoutDashboard, Y as GraduationCap, Z as Flag, _ as Sparkles, c as Upload, d as Trash2, et as Eye, f as Tag, h as Star, i as Users, it as CreditCard, j as RefreshCw, nt as ExternalLink, o as UserCog, pt as Check, q as History, tt as EyeOff, x as ShoppingBag, xt as Ban } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { A as requireSupabase, C as isSafeMediaUrl, M as universityService, N as useCampus, S as invalidateUniversityCache, a as DialogContent, c as TECHNICAL_ISSUE_MESSAGE, g as compressImageFile, i as Dialog, j as toUserSafeErrorMessage, k as profileService, n as Button, o as DialogDescription, p as categoryService, s as DialogTitle, w as isSchemaMissingError, x as invalidateCategoryCache, y as getSessionUser } from "./store-BHsliIVM.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as HeroAmbient, i as Empty, m as Shell, p as SectionTitle, t as AnimatedSelect, u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DsEz2uz8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
async function writeAuditLog(action, targetType, targetId, notes) {
	const supabase = requireSupabase();
	const user = await getSessionUser(supabase);
	if (!user) return;
	const { error } = await supabase.from("moderation_logs").insert({
		admin_id: user.id,
		action,
		target_type: targetType,
		target_id: targetId,
		notes: notes ?? null
	});
	if (error) console.warn("Audit log write failed:", error.message);
}
var adminService = {
	async getSummary() {
		const { data, error } = await requireSupabase().rpc("get_admin_dashboard_summary");
		if (error) throw error;
		return data;
	},
	async listAllListings(limit = 120) {
		const { data, error } = await requireSupabase().from("listings").select("id, title, listing_type, status, is_featured, seller_id, category_id, price, price_type, view_count, contact_click_count, location, created_at").order("created_at", { ascending: false }).limit(limit);
		if (error) throw error;
		return data || [];
	},
	async listAllProfiles(limit = 120) {
		const supabase = requireSupabase();
		const baseCols = "id, full_name, username, email, phone_number, whatsapp_number, preferred_contact_method, show_public_contact, profile_image, bio, account_type, primary_university_id, verification_status, is_student, id_document_type, id_document_path, verification_photo_confirmed, verification_submitted_at, verification_note, role, is_suspended, notification_preferences, created_at, updated_at";
		const { data, error } = await supabase.from("profiles").select(`${baseCols}, verification_checks`).order("created_at", { ascending: false }).limit(limit);
		if (error) {
			if (isSchemaMissingError(error)) {
				const fallback = await supabase.from("profiles").select(baseCols).order("created_at", { ascending: false }).limit(limit);
				if (fallback.error) throw fallback.error;
				return fallback.data || [];
			}
			throw error;
		}
		return data || [];
	},
	async listReports() {
		const { data, error } = await requireSupabase().from("reports").select("id, reporter_id, listing_id, reported_user_id, reason, description, status, reviewed_by, reviewed_at, moderation_note, created_at").order("created_at", { ascending: false }).limit(120);
		if (error) throw error;
		return data || [];
	},
	async listModerationLogs(limit = 80) {
		const { data, error } = await requireSupabase().from("moderation_logs").select("id, admin_id, action, target_type, target_id, notes, created_at").order("created_at", { ascending: false }).limit(limit);
		if (error) throw error;
		return data || [];
	},
	async moderateListing(listingId, status, note) {
		const { error } = await requireSupabase().rpc("admin_moderate_listing", {
			p_listing_id: listingId,
			p_next_status: status,
			p_note: note ?? null
		});
		if (error) throw error;
	},
	async deleteListing(listingId, note) {
		const { error } = await requireSupabase().from("listings").delete().eq("id", listingId);
		if (error) throw error;
		await writeAuditLog("listing_deleted", "listing", listingId, note || "Deleted by administrator");
	},
	async toggleFeaturedListing(listingId, isFeatured) {
		const { error } = await requireSupabase().from("listings").update({ is_featured: isFeatured }).eq("id", listingId);
		if (error) throw error;
		await writeAuditLog(isFeatured ? "listing_featured" : "listing_unfeatured", "listing", listingId);
	},
	async toggleUserSuspension(userId, suspended, note) {
		const { error } = await requireSupabase().rpc("admin_toggle_user_suspension", {
			p_user_id: userId,
			p_suspended: suspended,
			p_note: note ?? null
		});
		if (error) throw error;
	},
	async updateUserVerification(userId, status, note) {
		const supabase = requireSupabase();
		const cleanNote = note?.trim().slice(0, 500) || null;
		const { error } = await supabase.from("profiles").update({
			verification_status: status,
			verification_note: status === "verified" ? null : cleanNote
		}).eq("id", userId);
		if (error) throw error;
		await writeAuditLog(`user_verification_${status}`, "profile", userId, cleanNote ?? void 0);
		const { error: notifErr } = await supabase.from("notifications").insert({
			user_id: userId,
			title: status === "verified" ? "Seller account verified" : status === "pending" ? "Verification under review" : "Seller verification needs an update",
			message: status === "verified" ? "Your CampusLoop seller verification is approved. You can now post products and services." : cleanNote || `Your seller verification status was updated to ${status}.`,
			notification_type: "account_update"
		});
		if (notifErr) throw notifErr;
	},
	async updateUserRole(userId, role) {
		const supabase = requireSupabase();
		if ((await getSessionUser(supabase))?.id === userId) throw new Error("Administrators cannot change their own role.");
		const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
		if (error) throw error;
		await writeAuditLog(`user_role_${role}`, "profile", userId);
		const { error: notifErr } = await supabase.from("notifications").insert({
			user_id: userId,
			title: role === "admin" ? "Administrator access granted" : "Administrator access updated",
			message: role === "admin" ? "You now have full access to the CampusLoop Admin Command Center." : "Your account role was changed to standard member.",
			notification_type: "account_update"
		});
		if (notifErr) throw notifErr;
	},
	async sendBroadcastNotification(input) {
		const supabase = requireSupabase();
		const uniqueIds = Array.from(new Set(input.targetUserIds.filter(Boolean)));
		if (uniqueIds.length === 0) return 0;
		const rows = uniqueIds.map((uid) => ({
			user_id: uid,
			title: input.title.trim(),
			message: input.message.trim(),
			notification_type: input.notificationType ?? "platform_announcement",
			metadata: { scope: input.scopeLabel ?? "broadcast" }
		}));
		const { error } = await supabase.from("notifications").insert(rows);
		if (error) throw error;
		const user = await getSessionUser(supabase);
		if (user) await writeAuditLog("platform_broadcast", "notifications", user.id, `${input.title.trim()} → ${uniqueIds.length} recipient(s)`);
		return uniqueIds.length;
	},
	async resolveReport(reportId, status, note) {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		const { error } = await supabase.from("reports").update({
			status,
			reviewed_by: user?.id ?? null,
			reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
			moderation_note: note ?? null
		}).eq("id", reportId);
		if (error) throw error;
		await writeAuditLog(`report_${status}`, "report", reportId, note);
	},
	async upsertUniversity(input) {
		const supabase = requireSupabase();
		const payload = {
			...input.id ? { id: input.id } : {},
			university_name: input.university_name.trim(),
			short_name: input.short_name.trim(),
			slug: input.slug.trim().toLowerCase(),
			location: input.location.trim(),
			region: input.region.trim(),
			description: input.description?.trim() || "",
			logo_url: input.logo_url ?? null,
			display_order: input.display_order ?? 50,
			is_active: input.is_active ?? true
		};
		const { data, error } = await supabase.from("universities").upsert(payload).select("id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at").single();
		if (error) throw error;
		invalidateUniversityCache();
		await writeAuditLog("university_saved", "university", data.id, input.short_name);
		return data;
	},
	async toggleUniversityActive(id, isActive) {
		const { error } = await requireSupabase().from("universities").update({ is_active: isActive }).eq("id", id);
		if (error) throw error;
		invalidateUniversityCache();
		await writeAuditLog(isActive ? "university_enabled" : "university_disabled", "university", id);
	},
	async uploadUniversityLogo(file, slug) {
		const supabase = requireSupabase();
		if (!(/* @__PURE__ */ new Set([
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/svg+xml"
		])).has(file.type)) throw new Error("Choose a JPG, PNG, WebP, or SVG logo.");
		if (file.size > 2097152) throw new Error("University logos must be 2 MB or smaller.");
		const optimized = await compressImageFile(file, 512, .9);
		const ext = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"image/webp": "webp",
			"image/svg+xml": "svg"
		}[optimized.type] || "png";
		const path = `${slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") || "campus"}-${Date.now()}.${ext}`;
		const { error } = await supabase.storage.from("university-logos").upload(path, optimized, {
			upsert: true,
			contentType: optimized.type,
			cacheControl: "2592000"
		});
		if (error) throw error;
		const { data } = supabase.storage.from("university-logos").getPublicUrl(path);
		return data.publicUrl;
	},
	async upsertCategory(input) {
		const { data, error } = await requireSupabase().from("categories").upsert({
			...input.id ? { id: input.id } : {},
			name: input.name.trim(),
			slug: input.slug.trim().toLowerCase(),
			category_type: input.category_type,
			icon: input.icon || "tag",
			description: input.description?.trim() || "",
			display_order: input.display_order ?? 50,
			is_active: input.is_active ?? true
		}).select("id, name, slug, category_type, icon, description, display_order, is_active, created_at").single();
		if (error) throw error;
		invalidateCategoryCache();
		await writeAuditLog("category_saved", "category", data.id, input.name);
		return data;
	},
	async toggleCategoryActive(id, isActive) {
		const { error } = await requireSupabase().from("categories").update({ is_active: isActive }).eq("id", id);
		if (error) throw error;
		invalidateCategoryCache();
		await writeAuditLog(isActive ? "category_shown" : "category_hidden", "category", id);
	},
	async listPromotionConfigs() {
		const { data, error } = await requireSupabase().from("promotion_configs").select("id, plan_key, name, description, target_scope, duration_days, suggested_fee_ghs, is_active, created_at, updated_at").order("duration_days", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async upsertPromotionConfig(input) {
		const { data, error } = await requireSupabase().from("promotion_configs").upsert({
			...input.id ? { id: input.id } : {},
			plan_key: input.plan_key.trim().toLowerCase(),
			name: input.name.trim(),
			description: input.description.trim(),
			target_scope: input.target_scope.trim() || "listing",
			duration_days: Math.max(1, input.duration_days),
			suggested_fee_ghs: Math.max(0, input.suggested_fee_ghs),
			is_active: input.is_active ?? false
		}).select("*").single();
		if (error) throw error;
		return data;
	},
	async togglePromotionConfig(id, isActive) {
		const { error } = await requireSupabase().from("promotion_configs").update({ is_active: isActive }).eq("id", id);
		if (error) throw error;
		await writeAuditLog(isActive ? "promotion_enabled" : "promotion_disabled", "promotion", id);
	}
};
var _jsxFileName = "/app/applet/src/components/campus/admin.tsx";
var NAV_ITEMS = [
	{
		id: "overview",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		id: "listings",
		label: "Listings",
		icon: ShoppingBag
	},
	{
		id: "reports",
		label: "Reports",
		icon: Flag
	},
	{
		id: "users",
		label: "Users",
		icon: Users
	},
	{
		id: "universities",
		label: "Universities",
		icon: GraduationCap
	},
	{
		id: "categories",
		label: "Categories",
		icon: Tag
	},
	{
		id: "broadcasts",
		label: "Announcements",
		icon: Megaphone
	},
	{
		id: "promotions",
		label: "Promotions",
		icon: Sparkles
	},
	{
		id: "audit",
		label: "Audit Log",
		icon: History
	}
];
function formatShortDate(value) {
	try {
		return new Date(value).toLocaleDateString("en-GH", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	} catch {
		return value;
	}
}
function formatDateTime(value) {
	try {
		return new Date(value).toLocaleString("en-GH", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return value;
	}
}
function AdminPage() {
	const { backendConfigured, authLoading, user, refreshMetadata, refreshListings, refreshNotifications } = useCampus();
	const [section, setSection] = (0, import_react.useState)("overview");
	const [loadingAdmin, setLoadingAdmin] = (0, import_react.useState)(false);
	const [workspaceError, setWorkspaceError] = (0, import_react.useState)(null);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [adminListings, setAdminListings] = (0, import_react.useState)([]);
	const [adminReports, setAdminReports] = (0, import_react.useState)([]);
	const [adminProfiles, setAdminProfiles] = (0, import_react.useState)([]);
	const [adminUniversities, setAdminUniversities] = (0, import_react.useState)([]);
	const [adminCategories, setAdminCategories] = (0, import_react.useState)([]);
	const [promotionConfigs, setPromotionConfigs] = (0, import_react.useState)([]);
	const [auditLogs, setAuditLogs] = (0, import_react.useState)([]);
	const [listingSearch, setListingSearch] = (0, import_react.useState)("");
	const [listingStatusFilter, setListingStatusFilter] = (0, import_react.useState)("All");
	const [listingTypeFilter, setListingTypeFilter] = (0, import_react.useState)("all");
	const [listingFeaturedOnly, setListingFeaturedOnly] = (0, import_react.useState)(false);
	const [reportFilter, setReportFilter] = (0, import_react.useState)("all");
	const [userSearch, setUserSearch] = (0, import_react.useState)("");
	const [userFilter, setUserFilter] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [rejectTarget, setRejectTarget] = (0, import_react.useState)(null);
	const [rejectNote, setRejectNote] = (0, import_react.useState)("");
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [roleTarget, setRoleTarget] = (0, import_react.useState)(null);
	const [verifyTarget, setVerifyTarget] = (0, import_react.useState)(null);
	const [verifyDocUrl, setVerifyDocUrl] = (0, import_react.useState)(null);
	const [verifyLoadingDoc, setVerifyLoadingDoc] = (0, import_react.useState)(false);
	const [verifyRejectNote, setVerifyRejectNote] = (0, import_react.useState)("");
	const [confirmAuthenticId, setConfirmAuthenticId] = (0, import_react.useState)(false);
	const [confirmFaceMatch, setConfirmFaceMatch] = (0, import_react.useState)(false);
	const [editingUniId, setEditingUniId] = (0, import_react.useState)(void 0);
	const [newUniName, setNewUniName] = (0, import_react.useState)("");
	const [newUniShort, setNewUniShort] = (0, import_react.useState)("");
	const [newUniLocation, setNewUniLocation] = (0, import_react.useState)("");
	const [newUniRegion, setNewUniRegion] = (0, import_react.useState)("");
	const [newUniDesc, setNewUniDesc] = (0, import_react.useState)("");
	const [newUniOrder, setNewUniOrder] = (0, import_react.useState)("20");
	const [newUniLogoUrl, setNewUniLogoUrl] = (0, import_react.useState)(null);
	const [uploadingLogo, setUploadingLogo] = (0, import_react.useState)(false);
	const [editingCatId, setEditingCatId] = (0, import_react.useState)(void 0);
	const [newCatName, setNewCatName] = (0, import_react.useState)("");
	const [newCatType, setNewCatType] = (0, import_react.useState)("product");
	const [newCatDesc, setNewCatDesc] = (0, import_react.useState)("");
	const [newCatOrder, setNewCatOrder] = (0, import_react.useState)("20");
	const [broadcastScope, setBroadcastScope] = (0, import_react.useState)("all");
	const [broadcastUniId, setBroadcastUniId] = (0, import_react.useState)("");
	const [broadcastUserId, setBroadcastUserId] = (0, import_react.useState)("");
	const [broadcastType, setBroadcastType] = (0, import_react.useState)("platform_announcement");
	const [broadcastTitle, setBroadcastTitle] = (0, import_react.useState)("");
	const [broadcastMessage, setBroadcastMessage] = (0, import_react.useState)("");
	const [sendingBroadcast, setSendingBroadcast] = (0, import_react.useState)(false);
	const [newPromoName, setNewPromoName] = (0, import_react.useState)("");
	const [newPromoScope, setNewPromoScope] = (0, import_react.useState)("listing");
	const [newPromoDays, setNewPromoDays] = (0, import_react.useState)("7");
	const [newPromoFee, setNewPromoFee] = (0, import_react.useState)("25");
	const [newPromoDesc, setNewPromoDesc] = (0, import_react.useState)("");
	const isAdminUser = user?.role === "admin" && !user?.isSuspended;
	const loadAdminWorkspace = (0, import_react.useCallback)(async () => {
		if (!backendConfigured || !isAdminUser) return;
		setLoadingAdmin(true);
		setWorkspaceError(null);
		try {
			const [sum, listRows, reportRows, profileRows, uniRows, catRows, promoRows, logRows] = await Promise.all([
				adminService.getSummary(),
				adminService.listAllListings(120),
				adminService.listReports(),
				adminService.listAllProfiles(120),
				universityService.listAllUniversities(),
				categoryService.listAllCategories(),
				adminService.listPromotionConfigs(),
				adminService.listModerationLogs(80).catch(() => [])
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
			const safeMessage = toUserSafeErrorMessage(err);
			setWorkspaceError(safeMessage);
			toast.error(safeMessage);
		} finally {
			setLoadingAdmin(false);
		}
	}, [backendConfigured, isAdminUser]);
	(0, import_react.useEffect)(() => {
		loadAdminWorkspace();
	}, [loadAdminWorkspace]);
	const profileMap = (0, import_react.useMemo)(() => new Map(adminProfiles.map((p) => [p.id, p])), [adminProfiles]);
	const categoryMap = (0, import_react.useMemo)(() => new Map(adminCategories.map((c) => [c.id, c])), [adminCategories]);
	const listingTitleMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const item of adminListings) map.set(item.id, item.title);
		return map;
	}, [adminListings]);
	const filteredLiveListings = (0, import_react.useMemo)(() => {
		const q = listingSearch.trim().toLowerCase();
		return adminListings.filter((item) => {
			if (listingStatusFilter !== "All" && item.status !== listingStatusFilter) return false;
			if (listingTypeFilter !== "all" && item.listing_type !== listingTypeFilter) return false;
			if (listingFeaturedOnly && !item.is_featured) return false;
			if (!q) return true;
			const seller = profileMap.get(item.seller_id);
			const category = categoryMap.get(item.category_id);
			return item.title.toLowerCase().includes(q) || (seller?.full_name.toLowerCase().includes(q) ?? false) || (seller?.username.toLowerCase().includes(q) ?? false) || (category?.name.toLowerCase().includes(q) ?? false);
		});
	}, [
		adminListings,
		listingSearch,
		listingStatusFilter,
		listingTypeFilter,
		listingFeaturedOnly,
		profileMap,
		categoryMap
	]);
	const filteredReports = (0, import_react.useMemo)(() => {
		if (reportFilter === "all") return adminReports;
		return adminReports.filter((r) => r.status === reportFilter);
	}, [adminReports, reportFilter]);
	const filteredProfiles = (0, import_react.useMemo)(() => {
		const q = userSearch.trim().toLowerCase();
		return adminProfiles.filter((prof) => {
			if (userFilter === "verified" && prof.verification_status !== "verified") return false;
			if (userFilter === "pending" && prof.verification_status !== "pending") return false;
			if (userFilter === "unverified" && prof.verification_status !== "unverified") return false;
			if (userFilter === "suspended" && !prof.is_suspended) return false;
			if (userFilter === "admin" && prof.role !== "admin") return false;
			if (!q) return true;
			return prof.full_name.toLowerCase().includes(q) || prof.username.toLowerCase().includes(q) || prof.email.toLowerCase().includes(q);
		});
	}, [
		adminProfiles,
		userSearch,
		userFilter
	]);
	const broadcastTargets = (0, import_react.useMemo)(() => {
		if (!backendConfigured) return [];
		if (broadcastScope === "all") return adminProfiles.filter((p) => !p.is_suspended).map((p) => p.id);
		if (broadcastScope === "verified") return adminProfiles.filter((p) => !p.is_suspended && p.verification_status === "verified").map((p) => p.id);
		if (broadcastScope === "university" && broadcastUniId) return adminProfiles.filter((p) => !p.is_suspended && p.primary_university_id === broadcastUniId).map((p) => p.id);
		if (broadcastScope === "single" && broadcastUserId) return [broadcastUserId];
		return [];
	}, [
		backendConfigured,
		broadcastScope,
		broadcastUniId,
		broadcastUserId,
		adminProfiles
	]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 330,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 329,
		columnNumber: 7
	}, this);
	if (!isAdminUser) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel hero-panel curve-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 339,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "dashboard-top",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "page-intro",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "section-kicker",
							children: "Restricted Console"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 342,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Admin authorization required" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 343,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "This command center is reserved for active accounts assigned the platform administrator role." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 344,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 341,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/discover",
						children: "Back to marketplace"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 350,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 349,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 340,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
				title: "Access restricted",
				text: user?.isSuspended ? `Signed in as ${user.email}. This account is currently suspended.` : user ? `Signed in as ${user.email} (standard member). Return to your seller dashboard or sign in with an administrator account.` : "Sign in with an administrator account to access CampusLoop platform controls.",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: user ? "/dashboard" : "/auth",
						children: user ? "Return to Dashboard" : "Sign in"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 364,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 363,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 353,
				columnNumber: 11
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 338,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 337,
		columnNumber: 7
	}, this);
	if (!backendConfigured) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel hero-panel curve-accent",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 378,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
			title: "Service temporarily unavailable",
			text: TECHNICAL_ISSUE_MESSAGE,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/discover",
					children: "Back to marketplace"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 381,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 380,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 379,
			columnNumber: 11
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 377,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 376,
		columnNumber: 7
	}, this);
	const openReportCount = summary?.open_reports ?? adminReports.filter((r) => r.status === "open" || r.status === "reviewing").length;
	const verifiedSellerCount = adminProfiles.filter((p) => p.verification_status === "verified").length;
	const pendingVerificationCount = adminProfiles.filter((p) => p.verification_status === "pending").length;
	const totalSellersCount = summary?.total_sellers ?? adminProfiles.length;
	const activeListingsCount = summary?.active_listings ?? adminListings.filter((l) => l.status === "Active").length;
	const productListingsCount = summary?.total_products ?? adminListings.filter((l) => l.status === "Active" && l.listing_type === "product").length;
	const serviceListingsCount = summary?.total_services ?? adminListings.filter((l) => l.status === "Active" && l.listing_type === "service").length;
	const totalClicksCount = summary?.total_contact_clicks ?? adminListings.reduce((sum, l) => sum + (l.contact_click_count || 0), 0);
	const uniDistribution = summary?.university_distribution ?? [];
	const maxUniCount = Math.max(1, ...uniDistribution.map((u) => u.targeted_listings));
	async function handleListingStatus(id, title, nextStatus, note) {
		try {
			await adminService.moderateListing(id, nextStatus, note || "Updated by admin moderation");
			toast.success(`${title} marked as ${nextStatus}`);
			await Promise.all([loadAdminWorkspace(), refreshListings()]);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleConfirmReject(e) {
		e.preventDefault();
		if (!rejectTarget) return;
		await handleListingStatus(rejectTarget.id, rejectTarget.title, "Rejected", rejectNote.trim() || "Policy review required");
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
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleToggleFeatured(id, title, nextFeatured) {
		try {
			await adminService.toggleFeaturedListing(id, nextFeatured);
			toast.success(nextFeatured ? "Marked as featured" : "Removed from featured");
			await Promise.all([loadAdminWorkspace(), refreshListings()]);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleReportAction(repId, nextStatus, note) {
		try {
			await adminService.resolveReport(repId, nextStatus, note || `Marked ${nextStatus} by admin`);
			toast.success(`Report marked ${nextStatus}`);
			await loadAdminWorkspace();
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleUserVerification(prof, nextStatus, note) {
		try {
			await adminService.updateUserVerification(prof.id, nextStatus, note || (nextStatus === "verified" ? "Verified by platform admin" : "Verification update requested"));
			toast.success(nextStatus === "verified" ? `${prof.full_name} is now verified` : `Verification updated for ${prof.full_name}`);
			setVerifyTarget(null);
			setVerifyDocUrl(null);
			setVerifyRejectNote("");
			await loadAdminWorkspace();
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function openVerifyReview(prof) {
		setVerifyTarget(prof);
		setVerifyRejectNote(prof.verification_note || "");
		setConfirmAuthenticId(false);
		setConfirmFaceMatch(false);
		setVerifyDocUrl(null);
		if (!prof.id_document_path) return;
		setVerifyLoadingDoc(true);
		try {
			const signed = await profileService.getSignedVerificationDocUrl(prof.id_document_path);
			setVerifyDocUrl(signed);
		} catch {
			setVerifyDocUrl(null);
		} finally {
			setVerifyLoadingDoc(false);
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
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleUniversityLogoUpload(file) {
		if (!file) return;
		setUploadingLogo(true);
		try {
			const slug = (newUniShort || newUniName || "campus").toLowerCase().replace(/[^a-z0-9]+/g, "-");
			const url = await adminService.uploadUniversityLogo(file, slug);
			setNewUniLogoUrl(url);
			toast.success("University logo uploaded");
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		} finally {
			setUploadingLogo(false);
		}
	}
	function startEditUniversity(u) {
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
		setEditingUniId(void 0);
		setNewUniName("");
		setNewUniShort("");
		setNewUniLocation("");
		setNewUniRegion("");
		setNewUniDesc("");
		setNewUniOrder("20");
		setNewUniLogoUrl(null);
	}
	async function handleSaveUniversity(e) {
		e.preventDefault();
		if (!newUniName.trim() || !newUniShort.trim()) return;
		const slug = newUniShort.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
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
				logo_url: newUniLogoUrl
			});
			resetUniversityForm();
			toast.success("University saved");
			await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	function startEditCategory(c) {
		setEditingCatId(c.id);
		setNewCatName(c.name);
		setNewCatType(c.category_type);
		setNewCatDesc(c.description);
		setNewCatOrder(String(c.display_order));
	}
	function resetCategoryForm() {
		setEditingCatId(void 0);
		setNewCatName("");
		setNewCatDesc("");
		setNewCatOrder("20");
	}
	async function handleSaveCategory(e) {
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
				display_order: Number(newCatOrder) || 50
			});
			resetCategoryForm();
			toast.success("Category saved");
			await Promise.all([loadAdminWorkspace(), refreshMetadata()]);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleSendBroadcast(e) {
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
				scopeLabel: broadcastScope
			});
			toast.success(`Announcement delivered to ${sentCount} account${sentCount === 1 ? "" : "s"}`);
			setBroadcastTitle("");
			setBroadcastMessage("");
			await Promise.all([loadAdminWorkspace(), refreshNotifications()]);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		} finally {
			setSendingBroadcast(false);
		}
	}
	async function handleSavePromotion(e) {
		e.preventDefault();
		if (!newPromoName.trim()) return;
		const planKey = newPromoName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
		try {
			await adminService.upsertPromotionConfig({
				plan_key: planKey,
				name: newPromoName,
				description: newPromoDesc,
				target_scope: newPromoScope,
				duration_days: Number(newPromoDays) || 7,
				suggested_fee_ghs: Number(newPromoFee) || 0,
				is_active: false
			});
			setNewPromoName("");
			setNewPromoDesc("");
			toast.success("Promotion slot saved");
			await loadAdminWorkspace();
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel hero-panel admin-command-hero curve-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 704,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-hero-top",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-identity",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "admin-crest",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, {
								size: 24,
								strokeWidth: 2.2
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 708,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 707,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "admin-eyebrow",
								children: "CampusLoop Command Center · Live Control"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 711,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Platform Administration" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 712,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"Signed in as ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: user.email }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 714,
									columnNumber: 30
								}, this),
								" — full oversight across listings, sellers, campuses, reports, and announcements."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 713,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 710,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 706,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-hero-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								className: "whitespace-nowrap shrink-0",
								onClick: () => void loadAdminWorkspace(),
								disabled: loadingAdmin,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, {
									size: 15,
									className: loadingAdmin ? "animate-spin" : ""
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 726,
									columnNumber: 15
								}, this), "Refresh"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 720,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								className: "whitespace-nowrap shrink-0",
								onClick: () => setSection("broadcasts"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 734,
									columnNumber: 15
								}, this), "Announce"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 729,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								className: "dashboard-create-btn whitespace-nowrap shrink-0",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/discover",
									children: ["Marketplace", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 740,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 738,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 737,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 719,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 705,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "stats-grid admin-kpi-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "stat-top",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Accounts & Sellers" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 750,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 751,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 749,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "tabular-nums",
									children: totalSellersCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 753,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
									className: "tabular-nums",
									children: [
										verifiedSellerCount,
										" verified · ",
										summary?.suspended_accounts ?? 0,
										" suspended"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 754,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 748,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "stat-top",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Active Listings" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 760,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 761,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 759,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "tabular-nums",
									children: activeListingsCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 763,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
									className: "tabular-nums",
									children: [
										productListingsCount,
										" products · ",
										serviceListingsCount,
										" services"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 764,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 758,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "stat-top",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Reports Queue" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 770,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 771,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 769,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "tabular-nums",
									children: openReportCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 773,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
									className: "tabular-nums",
									children: [pendingVerificationCount, " pending verifications"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 774,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 768,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
							className: "stat",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "stat-top",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact Enquiries" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 778,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Megaphone, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 779,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 777,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "tabular-nums",
									children: totalClicksCount
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 781,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Direct buyer-seller connections" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 782,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 776,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 747,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 703,
			columnNumber: 7
		}, this),
		workspaceError && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel admin-warning-panel",
			role: "status",
			children: [
				/* @__PURE__ */ (void 0)("strong", { children: "Notice:" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 789,
					columnNumber: 11
				}, this),
				" ",
				workspaceError
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 788,
			columnNumber: 9
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "admin-workspace",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "surface-panel admin-sidebar",
				"aria-label": "Admin navigation",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-sidebar-kicker",
						children: "Controls"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 796,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
						className: "admin-sidebar-nav",
						role: "tablist",
						"aria-label": "Admin sections",
						children: NAV_ITEMS.map((item) => {
							const active = section === item.id;
							const badgeCount = item.id === "reports" ? openReportCount : item.id === "users" ? pendingVerificationCount : item.id === "listings" ? adminListings.filter((l) => l.status === "Paused").length : 0;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": active,
								className: `admin-nav-btn ${active ? "active" : ""}`,
								onClick: () => setSection(item.id),
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(item.icon, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 817,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item.label }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 818,
										columnNumber: 19
									}, this),
									badgeCount > 0 && /* @__PURE__ */ (void 0)("b", {
										className: "admin-nav-count tabular-nums",
										children: badgeCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 819,
										columnNumber: 38
									}, this)
								]
							}, item.id, true, {
								fileName: _jsxFileName,
								lineNumber: 809,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 797,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-sidebar-foot",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/dashboard",
							className: "admin-foot-link",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LayoutDashboard, { size: 14 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 827,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Seller Studio" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 828,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 826,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/post",
							className: "admin-foot-link",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 14 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 831,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Post Listing" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 832,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 830,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 825,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 795,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "surface-panel admin-content-panel",
				children: [loadingAdmin && adminListings.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "py-8",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 840,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 839,
					columnNumber: 13
				}, this) : section === "overview" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Platform Health",
							title: "Campus Distribution & Action Queue"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 844,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-overview-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-subpanel",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-subpanel-head",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: "Listings by University" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 849,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "tabular-nums text-xs text-muted-foreground",
										children: [uniDistribution.length, " campuses"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 850,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 848,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-bar-list",
									children: uniDistribution.slice(0, 10).map((uni) => {
										const pct = Math.max(4, Math.round(uni.targeted_listings / maxUniCount * 100));
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "admin-bar-row",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "admin-bar-label",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: uni.short_name }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 863,
													columnNumber: 29
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
													className: "tabular-nums",
													children: uni.targeted_listings
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 864,
													columnNumber: 29
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 862,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "admin-bar-track",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "admin-bar-fill",
													style: { width: `${pct}%` }
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 867,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 866,
												columnNumber: 27
											}, this)]
										}, uni.id, true, {
											fileName: _jsxFileName,
											lineNumber: 861,
											columnNumber: 25
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 854,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 847,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-subpanel",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-subpanel-head",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: "Priority Actions" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 877,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs text-muted-foreground",
										children: "Quick moderation"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 878,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 876,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-priority-list",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											className: "admin-priority-item",
											onClick: () => {
												setReportFilter("open");
												setSection("reports");
											},
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Review open reports" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 890,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
												className: "tabular-nums",
												children: [
													openReportCount,
													" report",
													openReportCount === 1 ? "" : "s",
													" awaiting action"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 891,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 889,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 16 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 895,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 881,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											className: "admin-priority-item",
											onClick: () => {
												setUserFilter("unverified");
												setSection("users");
											},
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Verify campus sellers" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 907,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
												className: "tabular-nums",
												children: [
													verifiedSellerCount,
													" verified · ",
													totalSellersCount,
													" total accounts"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 908,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 906,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 16 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 912,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 898,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											className: "admin-priority-item",
											onClick: () => setSection("universities"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Manage universities & categories" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 921,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
												className: "tabular-nums",
												children: [
													adminUniversities.length,
													" campuses · ",
													adminCategories.length,
													" categories"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 922,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 920,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 16 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 926,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 915,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											className: "admin-priority-item",
											onClick: () => setSection("broadcasts"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Send platform announcement" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 935,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Broadcast campus notices straight to user notifications" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 936,
												columnNumber: 25
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 934,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 16 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 938,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 929,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 880,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 875,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 846,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-subpanel",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-subpanel-head",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: "Recent Moderation Activity" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 946,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									className: "text-link",
									onClick: () => setSection("audit"),
									children: "Full log"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 947,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 945,
								columnNumber: 17
							}, this), auditLogs.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-log-list",
								children: auditLogs.slice(0, 6).map((log) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-log-row",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "admin-log-action",
											children: log.action.replace(/_/g, " ")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 955,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "admin-log-note",
											children: [
												log.target_type,
												" · ",
												log.notes || log.target_id.slice(0, 8)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 956,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("time", {
											className: "tabular-nums",
											children: formatDateTime(log.created_at)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 959,
											columnNumber: 25
										}, this)
									]
								}, log.id, true, {
									fileName: _jsxFileName,
									lineNumber: 954,
									columnNumber: 23
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 952,
								columnNumber: 19
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm text-muted-foreground",
								children: "Actions you take across listings, users, reports, and broadcasts are recorded here."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 964,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 944,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 843,
					columnNumber: 13
				}, this) : section === "listings" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Catalog Control",
							title: "All Marketplace Listings",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "tabular-nums text-xs text-muted-foreground",
								children: [filteredLiveListings.length, " shown"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 974,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 973,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-toolbar",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-search-input",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 981,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										"aria-label": "Search listings",
										placeholder: "Search title, seller, or category...",
										value: listingSearch,
										onChange: (e) => setListingSearch(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 982,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 980,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									variant: "filter",
									ariaLabel: "Filter by status",
									value: listingStatusFilter,
									onValueChange: setListingStatusFilter,
									options: [
										"All",
										"Active",
										"Paused",
										"Draft",
										"Sold",
										"Unavailable",
										"Rejected"
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 989,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									variant: "filter",
									ariaLabel: "Filter by listing type",
									value: listingTypeFilter,
									onValueChange: setListingTypeFilter,
									options: [
										{
											value: "all",
											label: "All types"
										},
										{
											value: "product",
											label: "Products"
										},
										{
											value: "service",
											label: "Services"
										}
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 996,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: listingFeaturedOnly ? "default" : "outline",
									className: "whitespace-nowrap shrink-0",
									onClick: () => setListingFeaturedOnly((prev) => !prev),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { size: 14 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1013,
										columnNumber: 19
									}, this), "Featured"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1007,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 979,
							columnNumber: 15
						}, this),
						filteredLiveListings.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-list",
							children: filteredLiveListings.map((item) => {
								const seller = profileMap.get(item.seller_id);
								const cat = categoryMap.get(item.category_id);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
									className: "admin-card-row",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "admin-row-main",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "admin-row-title",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/listing/$id",
												params: { id: item.id },
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: item.title }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1028,
													columnNumber: 31
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1027,
												columnNumber: 29
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/listing/$id",
												params: { id: item.id },
												"aria-label": `Open ${item.title}`,
												className: "text-muted-foreground hover:text-primary",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { size: 13 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1036,
													columnNumber: 31
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1030,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1026,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
											className: "tabular-nums",
											children: [
												item.listing_type,
												cat ? ` · ${cat.name}` : "",
												item.price !== null ? ` · GH₵ ${item.price}` : "",
												seller ? ` · ${seller.full_name}` : "",
												" · ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: item.status === "Active" ? "status-text-success" : item.status === "Rejected" ? "status-text-danger" : "status-text-warning",
													children: item.status
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1045,
													columnNumber: 29
												}, this),
												item.is_featured ? " · Featured" : "",
												` · ${item.view_count} views · ${item.contact_click_count} clicks`
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1039,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1025,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "admin-card-action",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: item.is_featured ? "default" : "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => void handleToggleFeatured(item.id, item.title, !item.is_featured),
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1069,
													columnNumber: 29
												}, this), item.is_featured ? "Featured" : "Feature"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1061,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => void handleListingStatus(item.id, item.title, item.status === "Active" ? "Paused" : "Active"),
												children: [item.status === "Active" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1084,
													columnNumber: 57
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1084,
													columnNumber: 80
												}, this), item.status === "Active" ? "Pause" : "Approve"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1072,
												columnNumber: 27
											}, this),
											item.status !== "Rejected" && /* @__PURE__ */ (void 0)(Button, {
												variant: "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => setRejectTarget({
													id: item.id,
													title: item.title
												}),
												children: [/* @__PURE__ */ (void 0)(Ban, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1094,
													columnNumber: 31
												}, this), "Reject"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1088,
												columnNumber: 29
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "destructive",
												size: "sm",
												"aria-label": `Delete ${item.title}`,
												onClick: () => setDeleteTarget({
													id: item.id,
													title: item.title
												}),
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1104,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1098,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1060,
										columnNumber: 25
									}, this)]
								}, item.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1024,
									columnNumber: 23
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1019,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
							title: "No matching listings",
							text: "Adjust your search or status filter."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1112,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 972,
					columnNumber: 13
				}, this) : section === "reports" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
						eyebrow: "Trust & Safety",
						title: "Reported Listings & Moderation Queue",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
							variant: "filter",
							ariaLabel: "Filter reports",
							value: reportFilter,
							onValueChange: setReportFilter,
							options: [
								{
									value: "all",
									label: "All reports"
								},
								{
									value: "open",
									label: "Open"
								},
								{
									value: "reviewing",
									label: "Reviewing"
								},
								{
									value: "resolved",
									label: "Resolved"
								},
								{
									value: "dismissed",
									label: "Dismissed"
								}
							]
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1118,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1117,
						columnNumber: 15
					}, this), filteredReports.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-list",
						children: filteredReports.map((rep) => {
							const reportedTitle = rep.listing_id ? listingTitleMap.get(rep.listing_id) || "Reported listing" : "Account report";
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
								className: "admin-card-row",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-row-main",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "admin-row-title",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: rep.reason }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1143,
											columnNumber: 29
										}, this), rep.listing_id && /* @__PURE__ */ (void 0)(Link, {
											to: "/listing/$id",
											params: { id: rep.listing_id },
											className: "text-link text-xs",
											children: ["View listing ", /* @__PURE__ */ (void 0)(ExternalLink, { size: 12 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1150,
												columnNumber: 46
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1145,
											columnNumber: 31
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1142,
										columnNumber: 27
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
										className: "tabular-nums",
										children: [
											reportedTitle,
											" ·",
											" ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: rep.status === "resolved" || rep.status === "dismissed" ? "status-text-success" : "status-text-danger",
												children: rep.status
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1156,
												columnNumber: 29
											}, this),
											" ",
											"· ",
											formatShortDate(rep.created_at),
											rep.description ? ` · ${rep.description}` : ""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1154,
										columnNumber: 27
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1141,
									columnNumber: 25
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-card-action",
									children: [
										rep.listing_id && /* @__PURE__ */ (void 0)(Button, {
											variant: "outline",
											size: "sm",
											className: "whitespace-nowrap shrink-0",
											onClick: () => void handleListingStatus(rep.listing_id, reportedTitle, "Paused", `Paused due to report: ${rep.reason}`),
											children: [/* @__PURE__ */ (void 0)(EyeOff, { size: 14 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1184,
												columnNumber: 31
											}, this), "Pause listing"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1171,
											columnNumber: 29
										}, this),
										rep.status === "open" && /* @__PURE__ */ (void 0)(Button, {
											variant: "outline",
											size: "sm",
											className: "whitespace-nowrap shrink-0",
											onClick: () => void handleReportAction(rep.id, "reviewing"),
											children: "Reviewing"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1189,
											columnNumber: 29
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: rep.status === "resolved" ? "secondary" : "default",
											size: "sm",
											className: "whitespace-nowrap shrink-0",
											onClick: () => void handleReportAction(rep.id, rep.status === "resolved" ? "open" : "resolved"),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { size: 14 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1209,
												columnNumber: 29
											}, this), rep.status === "resolved" ? "Reopen" : "Resolve"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1198,
											columnNumber: 27
										}, this),
										rep.status !== "dismissed" && rep.status !== "resolved" && /* @__PURE__ */ (void 0)(Button, {
											variant: "ghost",
											size: "sm",
											className: "whitespace-nowrap shrink-0",
											onClick: () => void handleReportAction(rep.id, "dismissed"),
											children: "Dismiss"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1213,
											columnNumber: 29
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1169,
									columnNumber: 25
								}, this)]
							}, rep.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1140,
								columnNumber: 23
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1134,
						columnNumber: 17
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
						title: "No matching reports",
						text: "All clear in this queue."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1228,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1116,
					columnNumber: 13
				}, this) : section === "users" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Accounts & Trust",
							title: "Users, Verification & Roles",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "tabular-nums text-xs text-muted-foreground",
								children: [filteredProfiles.length, " accounts"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1234,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1233,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-toolbar",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-search-input",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1241,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									"aria-label": "Search users",
									placeholder: "Search name, @username, or email...",
									value: userSearch,
									onChange: (e) => setUserSearch(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1242,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1240,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
								variant: "filter",
								ariaLabel: "Filter users",
								value: userFilter,
								onValueChange: setUserFilter,
								options: [
									{
										value: "all",
										label: "All accounts"
									},
									{
										value: "verified",
										label: "Verified sellers"
									},
									{
										value: "pending",
										label: "Pending review"
									},
									{
										value: "unverified",
										label: "Unverified"
									},
									{
										value: "suspended",
										label: "Suspended"
									},
									{
										value: "admin",
										label: "Administrators"
									}
								]
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1249,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1239,
							columnNumber: 15
						}, this),
						filteredProfiles.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-list",
							children: filteredProfiles.map((prof) => {
								const isSelf = prof.id === user.id;
								const isVerified = prof.verification_status === "verified";
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
									className: "admin-card-row",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "admin-row-main",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "admin-row-title",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [
												prof.full_name,
												" (@",
												prof.username,
												")"
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1274,
												columnNumber: 29
											}, this), isVerified && /* @__PURE__ */ (void 0)(BadgeCheck, {
												size: 15,
												className: "text-primary shrink-0",
												"aria-label": "Verified"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1278,
												columnNumber: 31
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1273,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
											className: "tabular-nums",
											children: [
												prof.email,
												" · ",
												prof.account_type,
												" ·",
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: prof.role === "admin" ? "text-primary font-bold" : void 0,
													children: prof.role
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1287,
													columnNumber: 29
												}, this),
												" · ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: prof.is_suspended ? "status-text-danger" : isVerified ? "status-text-success" : void 0,
													children: prof.is_suspended ? "Suspended" : isVerified ? "Verified" : prof.verification_status
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1295,
													columnNumber: 29
												}, this),
												` · ${prof.is_student ? "Student" : "Non-student"}`,
												prof.id_document_type ? ` · ${prof.id_document_type === "Voters ID" ? "Voter's ID" : prof.id_document_type}` : "",
												` · Joined ${formatShortDate(prof.created_at)}`
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1285,
											columnNumber: 27
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1272,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "admin-card-action",
										children: [
											(prof.id_document_path || prof.verification_status === "pending") && /* @__PURE__ */ (void 0)(Button, {
												variant: "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => void openVerifyReview(prof),
												children: [/* @__PURE__ */ (void 0)(FileCheckCorner, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1325,
													columnNumber: 31
												}, this), "Review ID"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1319,
												columnNumber: 29
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: isVerified ? "secondary" : "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => !isVerified ? void openVerifyReview(prof) : void handleUserVerification(prof, "unverified", "Verification revoked by administrator"),
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BadgeCheck, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1343,
													columnNumber: 29
												}, this), isVerified ? "Verified" : "Verify"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1329,
												columnNumber: 27
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => {
													setBroadcastScope("single");
													setBroadcastUserId(prof.id);
													setSection("broadcasts");
												},
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1356,
													columnNumber: 29
												}, this), "Notify"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1346,
												columnNumber: 27
											}, this),
											!isSelf && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(Button, {
												variant: "outline",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => setRoleTarget({
													id: prof.id,
													name: prof.full_name,
													nextRole: prof.role === "admin" ? "user" : "admin"
												}),
												children: [/* @__PURE__ */ (void 0)(UserCog, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1373,
													columnNumber: 33
												}, this), prof.role === "admin" ? "Demote" : "Make Admin"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1361,
												columnNumber: 31
											}, this), /* @__PURE__ */ (void 0)(Button, {
												variant: prof.is_suspended ? "outline" : "destructive",
												size: "sm",
												className: "whitespace-nowrap shrink-0",
												onClick: () => void adminService.toggleUserSuspension(prof.id, !prof.is_suspended, prof.is_suspended ? "Account restored" : "Suspended by administrator").then(() => {
													toast.success(prof.is_suspended ? `${prof.full_name} restored` : `${prof.full_name} suspended`);
													return loadAdminWorkspace();
												}).catch((err) => toast.error(toUserSafeErrorMessage(err))),
												children: [prof.is_suspended ? /* @__PURE__ */ (void 0)(RotateCcw, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1400,
													columnNumber: 54
												}, this) : /* @__PURE__ */ (void 0)(Ban, { size: 14 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1400,
													columnNumber: 80
												}, this), prof.is_suspended ? "Restore" : "Suspend"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1376,
												columnNumber: 31
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1360,
												columnNumber: 29
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1317,
										columnNumber: 25
									}, this)]
								}, prof.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1271,
									columnNumber: 23
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1266,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
							title: "No matching users",
							text: "Try another search term or filter."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1411,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1232,
					columnNumber: 13
				}, this) : section === "universities" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Campus Network",
							title: editingUniId ? "Edit University" : "Manage Universities",
							children: editingUniId && /* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: resetUniversityForm,
								children: "Cancel edit"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1421,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1416,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							className: "admin-form-panel",
							onSubmit: (e) => void handleSaveUniversity(e),
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-grid",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "University full name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1430,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											required: true,
											placeholder: "Kwame Nkrumah University of Science and Technology",
											value: newUniName,
											onChange: (e) => setNewUniName(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1431,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1429,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Short name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1439,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											required: true,
											placeholder: "KNUST",
											value: newUniShort,
											onChange: (e) => setNewUniShort(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1440,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1438,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1428,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-grid",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "City / Campus location" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1450,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											placeholder: "Kumasi",
											value: newUniLocation,
											onChange: (e) => setNewUniLocation(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1451,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1449,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Region" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1458,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											placeholder: "Ashanti",
											value: newUniRegion,
											onChange: (e) => setNewUniRegion(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1459,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1457,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1448,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-grid",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Description" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1468,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											placeholder: "Short campus summary...",
											value: newUniDesc,
											onChange: (e) => setNewUniDesc(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1469,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1467,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-wrap items-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "form-field w-24 !mb-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Order" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1477,
													columnNumber: 23
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
													type: "number",
													min: 1,
													value: newUniOrder,
													onChange: (e) => setNewUniOrder(e.target.value)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1478,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1476,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "admin-logo-upload",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { size: 14 }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1486,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: uploadingLogo ? "Uploading..." : newUniLogoUrl ? "Logo ready" : "Logo" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1487,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
														type: "file",
														accept: "image/*",
														className: "sr-only",
														disabled: uploadingLogo,
														onChange: (e) => {
															handleUniversityLogoUpload(e.target.files?.[0]);
															e.target.value = "";
														}
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1490,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1485,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "submit",
												className: "whitespace-nowrap shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 15 }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1502,
													columnNumber: 23
												}, this), editingUniId ? "Save campus" : "Add campus"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1501,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1475,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1466,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1427,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-list",
							children: adminUniversities.map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
								className: "admin-card-row",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-row-main",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [
										u.short_name,
										" — ",
										u.university_name
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1513,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: [
										u.location ? `${u.location} · ` : "",
										u.region,
										" ·",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: u.is_active ? "status-text-success" : "status-text-warning",
											children: u.is_active ? "Active" : "Disabled"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1519,
											columnNumber: 25
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1516,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1512,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-card-action",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => startEditUniversity(u),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { size: 14 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1528,
											columnNumber: 25
										}, this), "Edit"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1527,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											adminService.toggleUniversityActive(u.id, !u.is_active).then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()])).then(() => toast.success("University status updated")).catch((err) => toast.error(toUserSafeErrorMessage(err)));
										},
										children: u.is_active ? "Disable" : "Enable"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1531,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1526,
									columnNumber: 21
								}, this)]
							}, u.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1511,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1509,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1415,
					columnNumber: 13
				}, this) : section === "categories" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Taxonomy",
							title: editingCatId ? "Edit Category" : "Manage Categories",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "segmented compact-tabs",
								children: [
									"all",
									"product",
									"service"
								].map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									className: categoryFilter === t ? "selected" : "",
									onClick: () => setCategoryFilter(t),
									children: t === "all" ? "All" : t === "product" ? "Products" : "Services"
								}, t, false, {
									fileName: _jsxFileName,
									lineNumber: 1557,
									columnNumber: 21
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1555,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1551,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							className: "admin-form-panel",
							onSubmit: (e) => void handleSaveCategory(e),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Category name" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1572,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										required: true,
										placeholder: "Dorm Tech",
										value: newCatName,
										onChange: (e) => setNewCatName(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1573,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1571,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Category type" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1581,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
										ariaLabel: "Category type",
										value: newCatType,
										onValueChange: (v) => setNewCatType(v),
										options: [{
											value: "product",
											label: "Product category"
										}, {
											value: "service",
											label: "Service category"
										}]
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1582,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1580,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1570,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap gap-2 items-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field flex-1 !mb-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Description" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1595,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											placeholder: "Short category description...",
											value: newCatDesc,
											onChange: (e) => setNewCatDesc(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1596,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1594,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field w-24 !mb-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Order" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1603,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "number",
											min: 1,
											value: newCatOrder,
											onChange: (e) => setNewCatOrder(e.target.value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1604,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1602,
										columnNumber: 19
									}, this),
									editingCatId && /* @__PURE__ */ (void 0)(Button, {
										type: "button",
										variant: "ghost",
										onClick: resetCategoryForm,
										children: "Cancel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1612,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "submit",
										className: "whitespace-nowrap shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1617,
											columnNumber: 21
										}, this), editingCatId ? "Save category" : "Add category"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1616,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1593,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1569,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-list",
							children: adminCategories.filter((c) => categoryFilter === "all" || c.category_type === categoryFilter).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
								className: "admin-card-row",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-row-main",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: c.name }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1629,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: [
										c.category_type,
										" ·",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: c.is_active ? "status-text-success" : "status-text-warning",
											children: c.is_active ? "Active" : "Hidden"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1632,
											columnNumber: 27
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1630,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1628,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-card-action",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => startEditCategory(c),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { size: 14 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1641,
											columnNumber: 27
										}, this), "Edit"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1640,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											adminService.toggleCategoryActive(c.id, !c.is_active).then(() => Promise.all([loadAdminWorkspace(), refreshMetadata()])).then(() => toast.success("Category updated")).catch((err) => toast.error(toUserSafeErrorMessage(err)));
										},
										children: c.is_active ? "Hide" : "Show"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1644,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1639,
									columnNumber: 23
								}, this)]
							}, c.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1627,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1623,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1550,
					columnNumber: 13
				}, this) : section === "broadcasts" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
						eyebrow: "Communications",
						title: "Announcements & User Notifications",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "tabular-nums text-xs text-muted-foreground",
							children: [
								broadcastTargets.length,
								" recipient",
								broadcastTargets.length === 1 ? "" : "s"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1665,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1664,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						className: "admin-form-panel",
						onSubmit: (e) => void handleSendBroadcast(e),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Target audience" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1673,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
										ariaLabel: "Target audience",
										value: broadcastScope,
										onValueChange: (nextScope) => {
											setBroadcastScope(nextScope);
											if (nextScope === "university" && !broadcastUniId && adminUniversities[0]) setBroadcastUniId(adminUniversities[0].id);
											if (nextScope === "single" && !broadcastUserId) {
												const firstActive = adminProfiles.find((p) => !p.is_suspended);
												if (firstActive) setBroadcastUserId(firstActive.id);
											}
										},
										options: [
											{
												value: "all",
												label: "All active users"
											},
											{
												value: "verified",
												label: "Verified sellers only"
											},
											{
												value: "university",
												label: "Specific university"
											},
											{
												value: "single",
												label: "Single user account"
											}
										]
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1674,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1672,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Notification type" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1696,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
										ariaLabel: "Notification type",
										value: broadcastType,
										onValueChange: (v) => setBroadcastType(v),
										options: [
											{
												value: "platform_announcement",
												label: "Platform announcement"
											},
											{
												value: "account_update",
												label: "Account update"
											},
											{
												value: "listing_approved",
												label: "Marketplace highlight"
											}
										]
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1697,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1695,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1671,
								columnNumber: 17
							}, this),
							broadcastScope === "university" && /* @__PURE__ */ (void 0)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Select university" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1712,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(AnimatedSelect, {
									ariaLabel: "Select university",
									value: broadcastUniId,
									onValueChange: setBroadcastUniId,
									placeholder: "Choose campus",
									options: adminUniversities.map((u) => ({
										value: u.id,
										label: `${u.short_name} — ${u.university_name}`
									}))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1713,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1711,
								columnNumber: 19
							}, this),
							broadcastScope === "single" && /* @__PURE__ */ (void 0)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Select user" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1728,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)(AnimatedSelect, {
									ariaLabel: "Select recipient user",
									value: broadcastUserId,
									onValueChange: setBroadcastUserId,
									placeholder: "Choose user account",
									options: adminProfiles.map((p) => ({
										value: p.id,
										label: `${p.full_name} (@${p.username})`
									}))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1729,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1727,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Announcement headline" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1743,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									required: true,
									placeholder: "e.g. Semester move-in marketplace guidelines",
									value: broadcastTitle,
									onChange: (e) => setBroadcastTitle(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1744,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1742,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Message" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1753,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
									required: true,
									rows: 4,
									placeholder: "Write the message users will see in their Dashboard notifications...",
									value: broadcastMessage,
									onChange: (e) => setBroadcastMessage(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1754,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1752,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "submit",
									className: "dashboard-create-btn whitespace-nowrap shrink-0",
									disabled: sendingBroadcast,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1769,
										columnNumber: 21
									}, this), sendingBroadcast ? "Sending..." : "Send announcement"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1764,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1763,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1670,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1663,
					columnNumber: 13
				}, this) : section === "promotions" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
							eyebrow: "Featured Slots Prep",
							title: "Promotion Slot Configurations"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1777,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm text-muted-foreground mb-2",
							children: "Configure featured slot durations and reference values. CampusLoop has zero payment gateways or in-app checkout."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1778,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							className: "admin-form-panel",
							onSubmit: (e) => void handleSavePromotion(e),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Plan name" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1786,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										required: true,
										placeholder: "Hall Week Spotlight (5 days)",
										value: newPromoName,
										onChange: (e) => setNewPromoName(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1787,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1785,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap gap-2 items-end",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "form-field flex-1 min-w-[120px] !mb-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Scope" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1796,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
												ariaLabel: "Promotion scope",
												value: newPromoScope,
												onValueChange: setNewPromoScope,
												options: [
													"listing",
													"service",
													"banner"
												]
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1797,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1795,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "form-field w-24 !mb-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Days" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1805,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
												type: "number",
												min: 1,
												value: newPromoDays,
												onChange: (e) => setNewPromoDays(e.target.value)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1806,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1804,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "form-field w-28 !mb-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ref. GH₵" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1814,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
												type: "number",
												min: 0,
												value: newPromoFee,
												onChange: (e) => setNewPromoFee(e.target.value)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1815,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1813,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1794,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1784,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap gap-2 items-end",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field flex-1 min-w-[180px] !mb-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Description" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1826,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										placeholder: "Where and how this featured slot appears...",
										value: newPromoDesc,
										onChange: (e) => setNewPromoDesc(e.target.value)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1827,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1825,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "submit",
									className: "whitespace-nowrap shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1834,
										columnNumber: 21
									}, this), "Add slot"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1833,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1824,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1783,
							columnNumber: 15
						}, this),
						promotionConfigs.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "admin-list",
							children: promotionConfigs.map((promo) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
								className: "admin-card-row",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-row-main",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: promo.name }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1845,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
										className: "tabular-nums",
										children: [
											promo.target_scope,
											" · ",
											promo.duration_days,
											" days · Reference GH₵",
											" ",
											promo.suggested_fee_ghs,
											" ·",
											" ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: promo.is_active ? "status-text-success" : "status-text-warning",
												children: promo.is_active ? "Active" : "Disabled"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1849,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1846,
										columnNumber: 25
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1844,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "admin-card-action",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: promo.is_active ? "default" : "outline",
										size: "sm",
										onClick: () => void adminService.togglePromotionConfig(promo.id, !promo.is_active).then(() => loadAdminWorkspace()).then(() => toast.success("Promotion slot updated")).catch((err) => toast.error(toUserSafeErrorMessage(err))),
										children: promo.is_active ? "Disable" : "Enable"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1859,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1858,
									columnNumber: 23
								}, this)]
							}, promo.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1843,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1841,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
							title: "No promotion configs",
							text: "Add a featured slot configuration above."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1877,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1776,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "admin-section-stack",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
						eyebrow: "Accountability",
						title: "Moderation & Admin Audit Log",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "tabular-nums text-xs text-muted-foreground",
							children: [auditLogs.length, " entries"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1886,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1885,
						columnNumber: 15
					}, this), auditLogs.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "admin-log-list",
						children: auditLogs.map((log) => {
							const actor = profileMap.get(log.admin_id);
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "admin-log-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "admin-log-action",
										children: log.action.replace(/_/g, " ")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1896,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "admin-log-note",
										children: [
											actor ? `${actor.full_name} · ` : "",
											log.target_type,
											" · ",
											log.notes || log.target_id.slice(0, 12)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1897,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("time", {
										className: "tabular-nums",
										children: formatDateTime(log.created_at)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1901,
										columnNumber: 25
									}, this)
								]
							}, log.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1895,
								columnNumber: 23
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1891,
						columnNumber: 17
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
						title: "No audit events yet",
						text: "Listing approvals, suspensions, verifications, and announcements will appear here."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1907,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1884,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "admin-note",
					children: "CampusLoop Admin Command Center · Direct community oversight without order checkouts or payment processing."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1915,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 837,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 794,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: Boolean(rejectTarget),
			onOpenChange: () => setRejectTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Reject listing" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1925,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [
						"Provide a short reason for rejecting “",
						rejectTarget?.title,
						"”. The seller will receive this update in their notifications."
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1926,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						className: "modal-body",
						onSubmit: (e) => void handleConfirmReject(e),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "form-field",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Moderation note" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1932,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
								rows: 3,
								required: true,
								placeholder: "e.g. Prohibited item or misleading pricing",
								value: rejectNote,
								onChange: (e) => setRejectNote(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1933,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1931,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-bottom",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setRejectTarget(null),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1942,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								variant: "destructive",
								children: "Reject listing"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1945,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1941,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1930,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1924,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1923,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: Boolean(deleteTarget),
			onOpenChange: () => setDeleteTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Delete listing permanently?" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1956,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [
						"“",
						deleteTarget?.title,
						"” and its linked images and analytics will be permanently removed."
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1957,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "form-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setDeleteTarget(null),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1961,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "destructive",
							onClick: () => void handleConfirmDeleteListing(),
							children: "Delete permanently"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1964,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1960,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1955,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1954,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: Boolean(roleTarget),
			onOpenChange: () => setRoleTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: roleTarget?.nextRole === "admin" ? "Grant administrator access?" : "Revoke administrator access?" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1974,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: roleTarget?.nextRole === "admin" ? `${roleTarget?.name} will gain full control over all CampusLoop listings, accounts, campuses, and moderation tools.` : `${roleTarget?.name} will be returned to standard seller/member permissions.` }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1979,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "form-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setRoleTarget(null),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1985,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: roleTarget?.nextRole === "admin" ? "default" : "destructive",
							onClick: () => void handleConfirmRoleChange(),
							children: "Confirm role change"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1988,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1984,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1973,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1972,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: Boolean(verifyTarget),
			onOpenChange: () => {
				setVerifyTarget(null);
				setVerifyDocUrl(null);
				setConfirmAuthenticId(false);
				setConfirmFaceMatch(false);
			},
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog admin-verify-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Review seller identity — ", verifyTarget?.full_name] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2008,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [
						verifyTarget?.is_student ? "Student" : "Non-student",
						" ·",
						" ",
						verifyTarget?.id_document_type === "Voters ID" ? "Voter's ID" : verifyTarget?.id_document_type || "No ID uploaded yet",
						verifyTarget?.verification_photo_confirmed ? " · Seller confirmed photo matches ID" : ""
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2009,
						columnNumber: 11
					}, this),
					verifyTarget && /* @__PURE__ */ (void 0)("div", {
						className: "modal-body",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "admin-verify-compare",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "admin-verify-pane",
									children: [/* @__PURE__ */ (void 0)("small", { children: "Real Profile Photo" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2022,
										columnNumber: 19
									}, this), isSafeMediaUrl(verifyTarget.profile_image) ? /* @__PURE__ */ (void 0)("img", {
										src: verifyTarget.profile_image,
										alt: `${verifyTarget.full_name} profile`,
										referrerPolicy: "no-referrer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2024,
										columnNumber: 21
									}, this) : /* @__PURE__ */ (void 0)("div", {
										className: "admin-verify-missing",
										children: "No profile photo uploaded"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2030,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2021,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "admin-verify-pane",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (void 0)("small", { children: [/* @__PURE__ */ (void 0)(CreditCard, {
											size: 13,
											className: "inline mr-1"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 2036,
											columnNumber: 23
										}, this), verifyTarget.id_document_type === "Voters ID" ? "Voter's ID" : verifyTarget.id_document_type || "Submitted ID"] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2035,
											columnNumber: 21
										}, this), isSafeMediaUrl(verifyDocUrl) && /* @__PURE__ */ (void 0)("a", {
											href: verifyDocUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-link text-xs inline-flex items-center gap-1",
											children: ["Open full-size ID", /* @__PURE__ */ (void 0)(ExternalLink, { size: 12 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 2049,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2042,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 2034,
										columnNumber: 19
									}, this), verifyLoadingDoc ? /* @__PURE__ */ (void 0)("div", {
										className: "admin-verify-missing",
										children: "Loading secure ID photo..."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2054,
										columnNumber: 21
									}, this) : isSafeMediaUrl(verifyDocUrl) ? /* @__PURE__ */ (void 0)("img", {
										src: verifyDocUrl,
										alt: `${verifyTarget.full_name} ID document`,
										referrerPolicy: "no-referrer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2056,
										columnNumber: 21
									}, this) : /* @__PURE__ */ (void 0)("div", {
										className: "admin-verify-missing",
										children: "No ID image attached"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2062,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2033,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2020,
								columnNumber: 15
							}, this),
							verifyTarget.verification_checks && /* @__PURE__ */ (void 0)("div", {
								className: "admin-verify-checks-box",
								children: [/* @__PURE__ */ (void 0)("strong", { children: "Automated Image Pre-Checks" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2069,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "admin-verify-checks-grid",
									children: [
										/* @__PURE__ */ (void 0)("span", { children: [
											"Expected ID:",
											" ",
											/* @__PURE__ */ (void 0)("b", { children: verifyTarget.verification_checks.documentType === "Voters ID" ? "Voter's ID" : verifyTarget.verification_checks.documentType }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 2073,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2071,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: [
											"Resolution: ",
											/* @__PURE__ */ (void 0)("b", { children: verifyTarget.verification_checks.resolution }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 2080,
												columnNumber: 35
											}, this),
											" (",
											verifyTarget.verification_checks.format,
											")"
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2079,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: [
											"Card framing:",
											" ",
											/* @__PURE__ */ (void 0)("b", { children: verifyTarget.verification_checks.cardFramingPassed ? "Passed" : "Flagged" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 2085,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2083,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: [
											"Distinct from avatar:",
											" ",
											/* @__PURE__ */ (void 0)("b", { children: verifyTarget.verification_checks.distinctFromProfilePhoto ? "Passed" : "Duplicate detected" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 2091,
												columnNumber: 23
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 2089,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2070,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2068,
								columnNumber: 17
							}, this),
							(!verifyTarget.id_document_path || !verifyTarget.profile_image) && /* @__PURE__ */ (void 0)("div", {
								className: "verification-rejection-banner",
								role: "alert",
								children: [/* @__PURE__ */ (void 0)(Ban, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2103,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Cannot approve yet" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2105,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("p", { children: [
									"This seller must upload both a valid",
									" ",
									verifyTarget.is_student ? "Student ID" : "Ghana Card / Voter's ID",
									" and a real profile photo before an Admin can approve their shop."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2106,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2104,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2102,
								columnNumber: 17
							}, this),
							verifyTarget.id_document_path && verifyTarget.profile_image && /* @__PURE__ */ (void 0)("div", {
								className: "admin-verify-checklist",
								children: [/* @__PURE__ */ (void 0)("label", {
									className: "audience-check",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: confirmAuthenticId,
										onChange: (e) => setConfirmAuthenticId(e.target.checked)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2118,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", { children: [
										"I inspected the ID image and confirm it is an authentic",
										" ",
										/* @__PURE__ */ (void 0)("strong", { children: verifyTarget.id_document_type === "Voters ID" ? "Voter's ID" : verifyTarget.id_document_type || (verifyTarget.is_student ? "Student ID" : "Ghana Card / Voter's ID") }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 2125,
											columnNumber: 23
										}, this),
										"."
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 2123,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2117,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("label", {
									className: "audience-check",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: confirmFaceMatch,
										onChange: (e) => setConfirmFaceMatch(e.target.checked)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2135,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", { children: "I compared both photos side by side and confirm the seller's profile photo shows the same person as the ID." }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2140,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2134,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2116,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "admin-quick-notes",
								role: "group",
								"aria-label": "Quick rejection reasons",
								children: [
									"Wrong ID type (Students need Student ID; non-students need Ghana Card or Voter's ID).",
									"ID image is blurry or cropped — retake on a flat, well-lit surface.",
									"Real profile photo does not clearly match the face on the uploaded ID."
								].map((preset) => /* @__PURE__ */ (void 0)("button", {
									type: "button",
									className: "admin-quick-note-btn",
									onClick: () => setVerifyRejectNote(preset),
									children: preset.split(" — ")[0]?.split(" (")[0]
								}, preset, false, {
									fileName: _jsxFileName,
									lineNumber: 2154,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 2148,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Rejection note (required if requesting new photos)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2166,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("textarea", {
									rows: 2,
									placeholder: "e.g. Profile photo does not match the face on the Ghana Card, or ID text is blurry.",
									value: verifyRejectNote,
									onChange: (e) => setVerifyRejectNote(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2167,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2165,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "form-bottom",
								children: [/* @__PURE__ */ (void 0)(Button, {
									type: "button",
									variant: "destructive",
									onClick: () => void handleUserVerification(verifyTarget, "unverified", verifyRejectNote.trim() || "Please upload a clearer ID and a matching real profile photo."),
									children: "Request re-upload"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 2176,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Button, {
									type: "button",
									disabled: !verifyTarget.id_document_path || !verifyTarget.profile_image || !confirmAuthenticId || !confirmFaceMatch,
									onClick: () => void handleUserVerification(verifyTarget, "verified", "ID validity & face match verified and approved by admin"),
									children: [/* @__PURE__ */ (void 0)(BadgeCheck, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 2206,
										columnNumber: 19
									}, this), "Approve seller"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 2190,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 2175,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 2019,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 2007,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1998,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 701,
		columnNumber: 5
	}, this);
}
//#endregion
export { AdminPage };
