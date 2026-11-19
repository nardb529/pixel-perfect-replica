import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Et as ArrowLeft, I as MessageCircle, M as Plus, P as Pencil, S as Shield, Tt as ArrowRight, V as LogOut, c as Upload, d as Trash2, et as Eye, gt as Bookmark, ht as Briefcase, m as Store, pt as Check, u as TrendingUp, x as ShoppingBag, yt as Bell } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as ownsListing, E as notificationService, N as useCampus, O as priceTypes, P as validateListing, T as listingService, a as DialogContent, c as TECHNICAL_ISSUE_MESSAGE, i as Dialog, j as toUserSafeErrorMessage, k as profileService, l as analyticsService, n as Button, o as DialogDescription, s as DialogTitle, v as formatListingPrice } from "./store-BHsliIVM.mjs";
import { S as useNavigate, b as Link, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as HeroAmbient, i as Empty, l as PageIntro, m as Shell, p as SectionTitle, t as AnimatedSelect, u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
import { n as SellerVerificationCard } from "./verification-BMeJn_oZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/management-wrgGEGHg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/management.tsx";
var RANGE_OPTIONS = [
	{
		value: "today",
		label: "Today"
	},
	{
		value: "7d",
		label: "Last 7 days"
	},
	{
		value: "30d",
		label: "Last 30 days"
	},
	{
		value: "all",
		label: "All time"
	}
];
function DashboardPage() {
	const { backendConfigured, authLoading, user, myListings, refreshMyListings, refreshListings, refreshProfile, notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead, universityNames, dbUniversities, signOutUser } = useCampus();
	const [tab, setTab] = (0, import_react.useState)("Overview");
	const [range, setRange] = (0, import_react.useState)("all");
	const [analytics, setAnalytics] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [savingSettings, setSavingSettings] = (0, import_react.useState)(false);
	const [selectedAffiliations, setSelectedAffiliations] = (0, import_react.useState)([]);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!backendConfigured || !user?.id) return;
		let active = true;
		analyticsService.getSellerAnalytics(range).then((res) => {
			if (active) setAnalytics(res);
		}).catch(() => void 0);
		return () => {
			active = false;
		};
	}, [
		backendConfigured,
		user?.id,
		range,
		myListings.length
	]);
	(0, import_react.useEffect)(() => {
		if (!backendConfigured || !user?.id) return;
		profileService.listUserUniversities(user.id).then((rows) => {
			const names = rows.map((r) => r.university?.short_name || r.university?.university_name || "").filter(Boolean);
			setSelectedAffiliations(names.length ? names : [user.university]);
		}).catch(() => setSelectedAffiliations([user.university]));
	}, [
		backendConfigured,
		user?.id,
		user?.university
	]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 128,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 127,
		columnNumber: 7
	}, this);
	if (!user) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, {
		to: "/auth",
		replace: true
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 133,
		columnNumber: 21
	}, this);
	const isSuspended = Boolean(user.isSuspended);
	const mine = backendConfigured ? myListings : [];
	const activeCount = analytics?.active_listings ?? mine.filter((l) => l.status === "Active").length;
	const viewCount = analytics?.total_views ?? mine.reduce((s, l) => s + l.views, 0);
	const clickCount = analytics?.contact_clicks ?? mine.reduce((s, l) => s + (l.contactClicks || 0), 0);
	const favCount = analytics?.saved_listings ?? mine.reduce((s, l) => s + (l.favoriteCount || 0), 0);
	const topListings = analytics?.top_listings?.length ? analytics.top_listings : mine.slice().sort((a, b) => b.views + (b.contactClicks || 0) - (a.views + (a.contactClicks || 0))).slice(0, 4).map((l) => ({
		id: l.id,
		title: l.title,
		listing_type: l.type,
		status: l.status,
		views: l.views,
		clicks: l.contactClicks || 0,
		saves: l.favoriteCount || 0
	}));
	async function updateSettings(e) {
		e.preventDefault();
		if (!user) return;
		if (!backendConfigured) {
			toast.error(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		const data = new FormData(e.currentTarget);
		const nextUni = String(data.get("university") || user.university);
		const nextCapability = String(data.get("capability") || user.capability);
		const nextContact = String(data.get("contact") || user.contact);
		const nextContactDetails = String(data.get("contactDetails") || "").trim();
		setSavingSettings(true);
		try {
			const primaryUni = dbUniversities.find((u) => u.short_name === nextUni || u.university_name === nextUni);
			await profileService.updateMyProfile({
				primary_university_id: primaryUni?.id ?? null,
				account_type: nextCapability,
				preferred_contact_method: nextContact,
				whatsapp_number: nextContact === "WhatsApp" ? nextContactDetails || null : user.whatsappNumber,
				phone_number: nextContact !== "Email" ? nextContactDetails || null : user.phoneNumber
			});
			const affiliationRows = Array.from(/* @__PURE__ */ new Set([nextUni, ...selectedAffiliations])).map((name) => {
				const match = dbUniversities.find((u) => u.short_name === name || u.university_name === name);
				if (!match) return null;
				return {
					university_id: match.id,
					affiliation_type: nextCapability === "Service Provider" ? "Service Provider" : "Student",
					is_primary: match.id === primaryUni?.id
				};
			}).filter((row) => Boolean(row));
			if (affiliationRows.length > 0) await profileService.saveUserUniversities(affiliationRows);
			await refreshProfile();
			toast.success("Settings saved to your CampusLoop account");
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		} finally {
			setSavingSettings(false);
		}
	}
	async function handleStatusChange(listing, nextStatus) {
		if (!backendConfigured) {
			toast.error(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		if (isSuspended && nextStatus === "Active") {
			toast.error("Suspended accounts cannot reactivate listings.");
			return;
		}
		try {
			await listingService.updateListingStatus(listing.id, nextStatus);
			await Promise.all([refreshMyListings(), refreshListings()]);
			toast.success(`${listing.title} marked as ${nextStatus}`);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function handleDeleteListing(target) {
		if (!backendConfigured) {
			toast.error(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		try {
			await listingService.archiveListing(target.id);
			await Promise.all([refreshMyListings(), refreshListings()]);
			setDeleting(null);
			toast.success("Listing removed");
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function toggleNotificationPref(key, checked) {
		if (!user) return;
		if (!backendConfigured) {
			toast.error(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		const nextPrefs = {
			listing_updates: user.notificationPreferences?.listing_updates ?? true,
			enquiries: user.notificationPreferences?.enquiries ?? true,
			announcements: user.notificationPreferences?.announcements ?? true,
			[key]: checked
		};
		try {
			await notificationService.updatePreferences(nextPrefs);
			await refreshProfile();
			toast.success("Notification preferences updated");
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel hero-panel dashboard-hero-panel curve-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 282,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "dashboard-top",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageIntro, {
						eyebrow: user.role === "admin" ? "Administrator & Seller studio" : "Seller studio",
						title: `Welcome back, ${user.name.split(" ")[0]}`,
						text: "Manage your products, services, performance and enquiries."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 285,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							user.role === "admin" && !isSuspended && /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								className: "admin-launch-btn",
								asChild: true,
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/admin",
									children: [/* @__PURE__ */ (void 0)(Shield, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 294,
										columnNumber: 19
									}, this), "Admin Command Center"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 293,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 15
							}, this),
							user.id && /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/seller/$id",
									params: { id: user.id },
									children: [/* @__PURE__ */ (void 0)(Store, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 302,
										columnNumber: 19
									}, this), "View my shop"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 301,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 15
							}, this),
							!isSuspended && (user.verificationStatus === "verified" || user.role === "admin") && /* @__PURE__ */ (void 0)(Button, {
								className: "dashboard-create-btn",
								asChild: true,
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/post",
									children: [/* @__PURE__ */ (void 0)(Plus, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 310,
										columnNumber: 19
									}, this), "Create listing"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 309,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 308,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 290,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 284,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "dashboard-nav",
					role: "tablist",
					"aria-label": "Dashboard sections",
					children: [
						["Overview", "My Listings"].map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: tab === t ? "default" : "ghost",
							onClick: () => setTab(t),
							children: t
						}, t, false, {
							fileName: _jsxFileName,
							lineNumber: 320,
							columnNumber: 13
						}, this)),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: tab === "Notifications" ? "default" : "ghost",
							onClick: () => setTab("Notifications"),
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 328,
									columnNumber: 13
								}, this),
								"Notifications",
								unreadNotificationCount > 0 ? ` (${unreadNotificationCount})` : ""
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 324,
							columnNumber: 11
						}, this),
						!isSuspended && (user.verificationStatus === "verified" || user.role === "admin") && /* @__PURE__ */ (void 0)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Link, {
								to: "/post",
								children: "Create Listing"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 333,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 332,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/profile",
								children: "Profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 337,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 336,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: tab === "Settings" ? "default" : "ghost",
							onClick: () => setTab("Settings"),
							children: "Settings"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 339,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 318,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 281,
			columnNumber: 7
		}, this),
		isSuspended && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel",
			role: "alert",
			children: [/* @__PURE__ */ (void 0)(SectionTitle, {
				eyebrow: "Account status",
				title: "Your seller account is suspended"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 350,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("p", {
				className: "profile-bio",
				children: "Posting new listings and reactivating listings is disabled while your account is suspended. Contact CampusLoop support if you believe this is an error."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 351,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 349,
			columnNumber: 9
		}, this),
		!isSuspended && user.role !== "admin" && user.verificationStatus !== "verified" && /* @__PURE__ */ (void 0)(SellerVerificationCard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 359,
			columnNumber: 9
		}, this),
		tab === "Settings" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel section-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, { title: "Account settings" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 364,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "profile-bio",
					children: [
						"Signed in as ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: user.email }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 26
						}, this),
						"."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 365,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					className: "settings-form",
					onSubmit: updateSettings,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Primary University" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 371,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									name: "university",
									ariaLabel: "University",
									kicker: "Home university",
									defaultValue: user.university,
									options: universityNames
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 372,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 370,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Account type" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 381,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									name: "capability",
									ariaLabel: "Account type",
									kicker: "Seller capability",
									defaultValue: user.capability,
									options: [
										{
											value: "Both",
											label: "Products & Services"
										},
										{
											value: "Product Seller",
											label: "Product Seller"
										},
										{
											value: "Service Provider",
											label: "Service Provider"
										}
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 382,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 380,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 369,
							columnNumber: 13
						}, this),
						backendConfigured && /* @__PURE__ */ (void 0)("fieldset", {
							className: "audience-fieldset",
							children: [/* @__PURE__ */ (void 0)("legend", {
								className: "field-label",
								children: "Additional university affiliations"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 398,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "university-checks",
								children: universityNames.slice(0, 12).map((uniName) => /* @__PURE__ */ (void 0)("label", {
									className: "audience-check",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: selectedAffiliations.includes(uniName),
										onChange: (e) => setSelectedAffiliations((prev) => e.target.checked ? [...prev, uniName] : prev.filter((item) => item !== uniName))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 402,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("span", { children: uniName }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 23
									}, this)]
								}, uniName, true, {
									fileName: _jsxFileName,
									lineNumber: 401,
									columnNumber: 21
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 399,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 397,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Preferred contact method" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 422,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									name: "contact",
									ariaLabel: "Preferred contact method",
									kicker: "Primary channel",
									defaultValue: user.contact,
									options: [
										"WhatsApp",
										"Phone call",
										"Email"
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 423,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 421,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact details" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									name: "contactDetails",
									placeholder: "+233 XX XXX XXXX",
									defaultValue: user.contactDetails || ""
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 433,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 431,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 420,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "settings-actions",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								disabled: savingSettings,
								children: savingSettings ? "Saving..." : "Save settings"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 441,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									signOutUser().then(() => navigate({ to: "/discover" }));
								},
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 451,
									columnNumber: 17
								}, this), "Log out"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 444,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 440,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 368,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 363,
			columnNumber: 9
		}, this) : tab === "Notifications" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel section-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
					title: "Notifications",
					children: notifications.length > 0 && unreadNotificationCount > 0 && /* @__PURE__ */ (void 0)(Button, {
						variant: "outline",
						onClick: () => void markAllNotificationsRead(),
						children: "Mark all read"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 461,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 459,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "university-checks mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "audience-check",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								checked: user.notificationPreferences?.listing_updates ?? true,
								onChange: (e) => void toggleNotificationPref("listing_updates", e.target.checked)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 469,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Listing approvals & status updates" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 474,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 468,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "audience-check",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								checked: user.notificationPreferences?.enquiries ?? true,
								onChange: (e) => void toggleNotificationPref("enquiries", e.target.checked)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 477,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Buyer contact alerts" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 482,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 476,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "audience-check",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								checked: user.notificationPreferences?.announcements ?? true,
								onChange: (e) => void toggleNotificationPref("announcements", e.target.checked)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 485,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Platform announcements" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 490,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 484,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 467,
					columnNumber: 11
				}, this),
				notifications.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "activity-list",
					children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "activity-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 498,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [n.title, !n.is_read && " · New"] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 500,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground",
									children: n.message
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 504,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 499,
								columnNumber: 19
							}, this),
							!n.is_read && /* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => void markNotificationRead(n.id),
								children: "Mark read"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 507,
								columnNumber: 21
							}, this)
						]
					}, n.id, true, {
						fileName: _jsxFileName,
						lineNumber: 497,
						columnNumber: 17
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 495,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
					title: "All caught up",
					text: "Listing approvals, moderation updates, and campus announcements will appear here."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 519,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 458,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
			tab === "Overview" && /* @__PURE__ */ (void 0)("section", {
				className: "surface-panel section-panel",
				children: [
					/* @__PURE__ */ (void 0)(SectionTitle, {
						title: "Performance",
						children: /* @__PURE__ */ (void 0)("div", {
							className: "segmented compact-tabs",
							children: RANGE_OPTIONS.map((opt) => /* @__PURE__ */ (void 0)("button", {
								type: "button",
								className: range === opt.value ? "selected" : "",
								onClick: () => setRange(opt.value),
								children: opt.label
							}, opt.value, false, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 530,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 529,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "stats-grid",
						children: [
							{
								label: "Active Listings",
								value: activeCount,
								icon: ShoppingBag
							},
							{
								label: "Total Views",
								value: viewCount,
								icon: Eye
							},
							{
								label: "Contact Clicks",
								value: clickCount,
								icon: MessageCircle
							},
							{
								label: "Saved",
								value: favCount,
								icon: Bookmark
							}
						].map((s) => /* @__PURE__ */ (void 0)("article", {
							className: "stat",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "stat-top",
									children: [/* @__PURE__ */ (void 0)("span", { children: s.label }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 569,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)(s.icon, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 570,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 568,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (void 0)("strong", {
									className: "tabular-nums",
									children: s.value
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 572,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (void 0)("small", { children: RANGE_OPTIONS.find((r) => r.value === range)?.label }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 21
								}, this)
							]
						}, s.label, true, {
							fileName: _jsxFileName,
							lineNumber: 567,
							columnNumber: 19
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 544,
						columnNumber: 15
					}, this),
					topListings.length > 0 && /* @__PURE__ */ (void 0)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "detail-kicker mb-2",
							children: [/* @__PURE__ */ (void 0)(TrendingUp, { size: 14 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 21
							}, this), /* @__PURE__ */ (void 0)("span", { children: "Best performing & most viewed" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 582,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 580,
							columnNumber: 19
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "activity-list",
							children: topListings.map((item) => /* @__PURE__ */ (void 0)(Link, {
								to: "/listing/$id",
								params: { id: item.id },
								className: "activity-row",
								children: [
									/* @__PURE__ */ (void 0)(Eye, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 592,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (void 0)("span", { children: item.title }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 593,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (void 0)("small", { children: [
										item.views,
										" views · ",
										item.clicks,
										" clicks · ",
										item.saves,
										" saves"
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 594,
										columnNumber: 25
									}, this)
								]
							}, item.id, true, {
								fileName: _jsxFileName,
								lineNumber: 586,
								columnNumber: 23
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 584,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 579,
						columnNumber: 17
					}, this),
					!isSuspended && /* @__PURE__ */ (void 0)("div", {
						className: "quick-actions",
						children: [
							/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/post",
									search: { type: "product" },
									children: [/* @__PURE__ */ (void 0)(ShoppingBag, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 607,
										columnNumber: 23
									}, this), "Post a Product"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 606,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 605,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/post",
									search: { type: "service" },
									children: [/* @__PURE__ */ (void 0)(Briefcase, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 613,
										columnNumber: 23
									}, this), "Offer a Service"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 612,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 611,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								onClick: () => setTab("My Listings"),
								children: ["Manage Listings", /* @__PURE__ */ (void 0)(ArrowRight, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 619,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 617,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 604,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 528,
				columnNumber: 13
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "surface-panel section-panel",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, { title: "Your listings" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 627,
					columnNumber: 13
				}, this), mine.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "manage-list",
					children: mine.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
						className: "manage-row",
						children: [
							l.image ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: l.image,
								alt: l.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 633,
								columnNumber: 23
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "avatar",
								children: l.title.slice(0, 2).toUpperCase()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 635,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "manage-row-info",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/listing/$id",
									params: { id: l.id },
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: l.title }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 639,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: [
									formatListingPrice(l),
									" · ",
									l.views,
									" views",
									l.contactClicks ? ` · ${l.contactClicks} enquiries` : ""
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 641,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 637,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "manage-row-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
										variant: "status",
										align: "end",
										kicker: "Listing visibility",
										ariaLabel: `Status of ${l.title}`,
										value: l.status,
										onValueChange: (nextStatus) => void handleStatusChange(l, nextStatus),
										options: isSuspended ? [{
											value: "Paused",
											label: "Paused",
											description: "Temporarily hidden",
											tone: "warning"
										}, {
											value: l.type === "product" ? "Sold" : "Unavailable",
											label: l.type === "product" ? "Sold" : "Unavailable",
											description: "No longer accepting requests",
											tone: "muted"
										}] : [
											{
												value: "Active",
												label: "Active",
												description: "Visible to campus buyers",
												tone: "success"
											},
											{
												value: "Paused",
												label: "Paused",
												description: "Temporarily hidden",
												tone: "warning"
											},
											{
												value: l.type === "product" ? "Sold" : "Unavailable",
												label: l.type === "product" ? "Sold" : "Unavailable",
												description: "No longer accepting requests",
												tone: "muted"
											}
										]
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 647,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Edit listing",
										"aria-label": `Edit ${l.title}`,
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/listing/$id/edit",
											params: { id: l.id },
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { size: 16 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 702,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 701,
											columnNumber: 25
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 694,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Delete listing",
										"aria-label": `Delete ${l.title}`,
										onClick: () => setDeleting(l),
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { size: 16 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 712,
											columnNumber: 25
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 705,
										columnNumber: 23
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 646,
								columnNumber: 21
							}, this)
						]
					}, l.id, true, {
						fileName: _jsxFileName,
						lineNumber: 631,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 629,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
					title: "No listings yet",
					text: "Post a product or service to reach students on campus.",
					children: !isSuspended && /* @__PURE__ */ (void 0)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (void 0)(Link, {
							to: "/post",
							children: [/* @__PURE__ */ (void 0)(Plus, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 726,
								columnNumber: 23
							}, this), "Create listing"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 725,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 724,
						columnNumber: 19
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 719,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 626,
				columnNumber: 11
			}, this),
			tab === "Overview" && /* @__PURE__ */ (void 0)("section", {
				className: "surface-panel section-panel",
				children: [/* @__PURE__ */ (void 0)(SectionTitle, { title: "Recent activity" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 737,
					columnNumber: 15
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "activity-list",
					children: analytics?.recent_activity?.length ? analytics.recent_activity.map((act) => /* @__PURE__ */ (void 0)("div", {
						className: "activity-row",
						children: [
							act.kind === "contact" ? /* @__PURE__ */ (void 0)(MessageCircle, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 742,
								columnNumber: 49
							}, this) : /* @__PURE__ */ (void 0)(Eye, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 742,
								columnNumber: 79
							}, this),
							/* @__PURE__ */ (void 0)("span", { children: act.text }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 743,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (void 0)("small", { children: new Date(act.occurred_at).toLocaleDateString("en-GH") }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 744,
								columnNumber: 23
							}, this)
						]
					}, act.id, true, {
						fileName: _jsxFileName,
						lineNumber: 741,
						columnNumber: 21
					}, this)) : mine.length > 0 ? mine.slice(0, 4).map((l) => /* @__PURE__ */ (void 0)("div", {
						className: "activity-row",
						children: [
							/* @__PURE__ */ (void 0)(Check, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 750,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (void 0)("span", { children: [
								"“",
								l.title,
								"” is ",
								l.status.toLowerCase(),
								" in ",
								l.audience.join(", ")
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 751,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (void 0)("small", { children: l.time }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 754,
								columnNumber: 23
							}, this)
						]
					}, l.id, true, {
						fileName: _jsxFileName,
						lineNumber: 749,
						columnNumber: 21
					}, this)) : /* @__PURE__ */ (void 0)("p", {
						className: "profile-bio",
						children: "Views, saves and contact clicks on your listings will appear here."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 758,
						columnNumber: 19
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 738,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 736,
				columnNumber: 13
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 526,
			columnNumber: 9
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: Boolean(deleting),
			onOpenChange: () => setDeleting(null),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Delete listing?" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 770,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [deleting?.title, " will be removed from your active listings."] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 771,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "form-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setDeleting(null),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 775,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "destructive",
							onClick: () => {
								if (deleting) handleDeleteListing(deleting);
							},
							children: "Delete"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 778,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 774,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 769,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 768,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 280,
		columnNumber: 5
	}, this);
}
function PostPage({ editId, initialType }) {
	const { backendConfigured, authLoading, user, listings, myListings, refreshMyListings, refreshListings, universityNames, productCategoryNames, serviceCategoryNames, dbUniversities, dbCategories } = useCampus();
	const navigate = useNavigate();
	const defaultProductCategory = productCategoryNames[0] ?? "Electronics";
	const defaultServiceCategory = serviceCategoryNames[0] ?? "Graphic Design";
	const localExisting = editId ? [...myListings, ...listings].find((l) => l.id === editId && (ownsListing(l, user?.email) || ownsListing(l, user?.id))) : void 0;
	const [loadedExisting, setLoadedExisting] = (0, import_react.useState)(localExisting);
	(0, import_react.useEffect)(() => {
		if (!editId || localExisting || !backendConfigured) return;
		listingService.getListingById(editId).then((item) => {
			if (item && (ownsListing(item, user?.email) || ownsListing(item, user?.id))) setLoadedExisting(item);
		}).catch(() => void 0);
	}, [
		editId,
		localExisting,
		backendConfigured,
		user?.email,
		user?.id
	]);
	const existing = localExisting || loadedExisting;
	const startType = existing?.type || initialType || "product";
	const [step, setStep] = (0, import_react.useState)(editId || initialType ? 1 : 0);
	const [error, setError] = (0, import_react.useState)("");
	const [uploadingImages, setUploadingImages] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [published, setPublished] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(() => ({
		type: startType,
		title: existing?.title || "",
		description: existing?.description || "",
		category: existing?.category || (startType === "service" ? defaultServiceCategory : defaultProductCategory),
		price: existing && existing.price > 0 ? String(existing.price) : "",
		priceType: existing?.priceType || (startType === "service" ? "Starting from" : "Fixed"),
		condition: existing?.condition || "New",
		brand: existing?.brand || "",
		stockStatus: existing?.stockStatus || "In stock",
		duration: existing?.duration || "",
		serviceArea: existing?.serviceArea || "",
		deliveryMethod: existing?.deliveryMethod || "",
		location: existing?.location || "",
		images: existing?.images?.map((imageUrl) => ({ imageUrl })) || (existing?.image ? [{ imageUrl: existing.image }] : []),
		audience: existing?.audience || [user?.university || universityNames[0] || "KNUST"],
		contact: existing?.contact || user?.contactDetails || "",
		contactMethod: existing?.contactMethod || user?.contact || "WhatsApp"
	}));
	(0, import_react.useEffect)(() => {
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
			images: existing.images?.map((imageUrl) => ({ imageUrl })) || (existing.image ? [{ imageUrl: existing.image }] : []),
			audience: existing.audience,
			contact: existing.contact || user?.contactDetails || "",
			contactMethod: existing.contactMethod || user?.contact || "WhatsApp"
		});
	}, [
		existing,
		user?.contactDetails,
		user?.contact
	]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 923,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 922,
		columnNumber: 7
	}, this);
	if (!user) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, {
		to: "/auth",
		replace: true
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 928,
		columnNumber: 21
	}, this);
	if (user.isSuspended) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
		title: "Account suspended",
		text: "Suspended accounts cannot create or edit listings. Contact CampusLoop support if you need assistance.",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/dashboard",
				children: "Back to dashboard"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 938,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 937,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 933,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 932,
		columnNumber: 7
	}, this);
	if (!editId && user.role !== "admin" && user.verificationStatus !== "verified") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "post-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: "/dashboard",
			className: "back-link",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 950,
				columnNumber: 13
			}, this), "Dashboard"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 949,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SellerVerificationCard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 953,
			columnNumber: 11
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 948,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 947,
		columnNumber: 7
	}, this);
	if (editId && !existing) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
		title: "Listing unavailable",
		text: "Only your own listings can be edited.",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/dashboard",
				children: "Back to dashboard"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 964,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 963,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 962,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 961,
		columnNumber: 7
	}, this);
	const update = (key, value) => setDraft((prev) => ({
		...prev,
		[key]: value
	}));
	const imageUrls = draft.images.map((i) => i.imageUrl);
	const preview = {
		id: existing?.id || "preview",
		sellerId: user.id,
		type: draft.type,
		title: draft.title,
		description: draft.description,
		category: draft.category,
		price: draft.priceType === "Free" ? 0 : draft.price.trim() ? Number(draft.price) : 0,
		priceType: draft.priceType,
		condition: draft.type === "product" ? draft.condition : void 0,
		brand: draft.type === "product" ? draft.brand || void 0 : void 0,
		stockStatus: draft.type === "product" ? draft.stockStatus : void 0,
		duration: draft.type === "service" ? draft.duration || void 0 : void 0,
		serviceArea: draft.type === "service" ? draft.serviceArea || void 0 : void 0,
		deliveryMethod: draft.type === "service" ? draft.deliveryMethod || void 0 : void 0,
		location: draft.location || void 0,
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
		ownerEmail: user.email
	};
	async function upload(files) {
		if (!files || !files.length) return;
		if (!backendConfigured) {
			setError(TECHNICAL_ISSUE_MESSAGE);
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
			const uploaded = await Promise.all(selected.map((file) => listingService.uploadListingImage(file)));
			setDraft((prev) => ({
				...prev,
				images: [...prev.images, ...uploaded]
			}));
			toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`);
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
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
			contact: draft.contact
		});
	}
	function review(e) {
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
			setError(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		const matchedCategory = dbCategories.find((c) => c.category_type === draft.type && c.name === draft.category) || dbCategories.find((c) => c.category_type === draft.type);
		if (!matchedCategory) {
			setError("Category catalog is still loading. Try again in a moment.");
			return;
		}
		const { scope, universityIds } = listingService.resolveUniversityIdsFromNames(draft.audience, dbUniversities);
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
				condition: draft.type === "product" ? draft.condition : void 0,
				brand: draft.type === "product" ? draft.brand : void 0,
				stockStatus: draft.type === "product" ? draft.stockStatus : void 0,
				duration: draft.type === "service" ? draft.duration : void 0,
				serviceArea: draft.type === "service" ? draft.serviceArea : void 0,
				deliveryMethod: draft.type === "service" ? draft.deliveryMethod : void 0,
				location: draft.location,
				contactMethod: draft.contactMethod,
				contactValue: draft.contact,
				status: existing?.rawStatus || "Active",
				audienceScope: scope,
				universityIds,
				images: draft.images
			};
			const savedListing = existing ? await listingService.updateListing(existing.id, payload) : await listingService.createListing(payload);
			await Promise.all([refreshMyListings(), refreshListings()]);
			setPublished(savedListing.id);
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	}
	if (published) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "surface-panel success-screen curve-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "success-icon",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { size: 34 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1132,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1131,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: editId ? "Listing updated" : "Listing published" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1134,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [draft.title, " is now live on the marketplace."] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1135,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "success-actions",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/listing/$id",
						params: { id: published },
						children: ["View listing", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 16 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1140,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1138,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1137,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/dashboard",
						children: "Dashboard"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1144,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1143,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1136,
				columnNumber: 11
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1130,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1129,
		columnNumber: 7
	}, this);
	const categoryList = draft.type === "product" ? productCategoryNames : serviceCategoryNames;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "post-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: "/dashboard",
			className: "back-link",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1158,
				columnNumber: 11
			}, this), "Dashboard"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1157,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel curve-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageIntro, {
					title: editId ? "Edit listing" : "What would you like to post?",
					text: "Fill in a few details so campus buyers can find and contact you."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1163,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "post-steps",
					children: [
						"Choose",
						"Details",
						"Preview"
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: step === i ? "current" : "",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: i + 1 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1171,
							columnNumber: 17
						}, this), s]
					}, s, true, {
						fileName: _jsxFileName,
						lineNumber: 1170,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1168,
					columnNumber: 11
				}, this),
				step === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "type-options",
					children: ["product", "service"].map((type) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						className: "type-option",
						onClick: () => {
							setDraft((prev) => ({
								...prev,
								type,
								priceType: type === "product" ? "Fixed" : "Starting from",
								category: type === "product" ? defaultProductCategory : defaultServiceCategory
							}));
							setStep(1);
						},
						children: [
							type === "product" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { size: 28 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1195,
								columnNumber: 41
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Briefcase, { size: 28 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1195,
								columnNumber: 69
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: type === "product" ? "A Product" : "A Service" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1196,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: type === "product" ? "Electronics, fashion, books, hostel items." : "Design, hair, photography, tutoring, repairs." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1197,
								columnNumber: 19
							}, this)
						]
					}, type, true, {
						fileName: _jsxFileName,
						lineNumber: 1180,
						columnNumber: 17
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1178,
					columnNumber: 13
				}, this) : step === 1 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: review,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "upload-area",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { size: 22 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1208,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: uploadingImages ? "Uploading optimized images..." : `Add ${draft.type === "product" ? "product" : "portfolio"} photos` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1209,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Tap to upload from your device (up to 5 MB each)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1214,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									"aria-label": "Listing images",
									className: "sr-only",
									type: "file",
									accept: "image/*",
									multiple: true,
									disabled: uploadingImages,
									onChange: (e) => {
										upload(e.target.files);
										e.target.value = "";
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1215,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1207,
							columnNumber: 15
						}, this),
						draft.images.length > 0 && /* @__PURE__ */ (void 0)("div", {
							className: "upload-previews",
							children: draft.images.map((image, i) => /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("img", {
								src: image.imageUrl,
								alt: `Uploaded image ${i + 1}`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1233,
								columnNumber: 23
							}, this), /* @__PURE__ */ (void 0)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": `Remove image ${i + 1}`,
								title: "Remove image",
								onClick: () => {
									if (backendConfigured && image.storagePath) listingService.removeListingStorageObject(image.storagePath);
									update("images", draft.images.filter((_, index) => i !== index));
								},
								children: /* @__PURE__ */ (void 0)(Trash2, { size: 13 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1250,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1234,
								columnNumber: 23
							}, this)] }, i, true, {
								fileName: _jsxFileName,
								lineNumber: 1232,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1230,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "form-field",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: draft.type === "product" ? "Product name" : "Service name" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1258,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								required: true,
								placeholder: draft.type === "product" ? "HP EliteBook 840 G5" : "Knotless braids & styling",
								value: draft.title,
								onChange: (e) => update("title", e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1259,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1257,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "form-field",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Description" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1270,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
								required: true,
								placeholder: "Share condition, pickup location or what is included...",
								value: draft.description,
								onChange: (e) => update("description", e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1271,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1269,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Category" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1281,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Category",
									kicker: draft.type === "product" ? "Product category" : "Service category",
									value: draft.category,
									onValueChange: (val) => update("category", val),
									options: categoryList
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1282,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1280,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Pricing style" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1292,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Pricing style",
									kicker: "How pricing works",
									value: draft.priceType,
									onValueChange: (val) => update("priceType", val),
									options: priceTypes
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1293,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1291,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1279,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: draft.priceType === "Free" ? "Price (Free)" : draft.type === "product" ? "Price in GH₵" : "Starting price in GH₵ (optional)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1305,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "number",
									min: "0",
									step: "0.01",
									disabled: draft.priceType === "Free",
									placeholder: draft.priceType === "Free" ? "0" : draft.type === "product" ? "150" : "Optional",
									required: draft.type === "product" && draft.priceType !== "Free",
									value: draft.priceType === "Free" ? "0" : draft.price,
									onChange: (e) => update("price", e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1312,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1304,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Campus pickup / meetup area" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1331,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									placeholder: "e.g. Republic Hall, Pent Hostel",
									value: draft.location,
									onChange: (e) => update("location", e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1332,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1330,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1303,
							columnNumber: 15
						}, this),
						draft.type === "product" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Condition" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1343,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Condition",
									kicker: "Item condition",
									value: draft.condition,
									onValueChange: (val) => update("condition", val),
									options: [
										{
											value: "New",
											label: "New",
											description: "Unused or sealed"
										},
										{
											value: "Like New",
											label: "Like New",
											description: "Barely used, mint shape"
										},
										{
											value: "Used",
											label: "Used",
											description: "Pre-owned & working"
										}
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1344,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1342,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Brand (optional)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1361,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									placeholder: "HP, Apple, Nike...",
									value: draft.brand,
									onChange: (e) => update("brand", e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1362,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1360,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1341,
							columnNumber: 17
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Typical turnaround / duration" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1372,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									placeholder: "e.g. 45 mins, Same day",
									value: draft.duration,
									onChange: (e) => update("duration", e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1373,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1371,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Delivery mode" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1380,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Delivery mode",
									kicker: "How you serve students",
									value: draft.deliveryMethod || "In-person on campus",
									onValueChange: (val) => update("deliveryMethod", val),
									options: [
										"In-person on campus",
										"Hostel visit",
										"Online / Remote",
										"Campus & Remote"
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1381,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1379,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1370,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("fieldset", {
							className: "audience-fieldset",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("legend", {
									className: "field-label",
									children: "University audience"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1398,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "audience-options",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "audience-check",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "checkbox",
											checked: draft.audience.includes("All Universities"),
											onChange: (e) => update("audience", e.target.checked ? ["All Universities"] : [user.university])
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1401,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "All Universities" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1411,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1400,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1399,
									columnNumber: 17
								}, this),
								!draft.audience.includes("All Universities") && /* @__PURE__ */ (void 0)("div", {
									className: "university-checks",
									children: universityNames.map((u) => /* @__PURE__ */ (void 0)("label", {
										className: "audience-check",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "checkbox",
											checked: draft.audience.includes(u),
											onChange: (e) => update("audience", e.target.checked ? [...draft.audience, u] : draft.audience.filter((v) => v !== u))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1418,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("span", { children: u }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1430,
											columnNumber: 25
										}, this)]
									}, u, true, {
										fileName: _jsxFileName,
										lineNumber: 1417,
										columnNumber: 23
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1415,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1397,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact method" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1439,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Contact method",
									kicker: "How buyers reach you",
									value: draft.contactMethod,
									onValueChange: (val) => update("contactMethod", val),
									options: [
										"WhatsApp",
										"Phone call",
										"Email"
									]
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1440,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1438,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact details" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1449,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									required: true,
									placeholder: draft.contactMethod === "Email" ? "you@example.com" : "+233 XX XXX XXXX",
									value: draft.contact,
									onChange: (e) => update("contact", e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1450,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1448,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1437,
							columnNumber: 15
						}, this),
						error && /* @__PURE__ */ (void 0)("p", {
							role: "alert",
							className: "form-error",
							children: error
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1462,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "form-bottom",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => editId ? navigate({ to: "/dashboard" }) : setStep(0),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1473,
									columnNumber: 19
								}, this), "Back"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1468,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								disabled: uploadingImages,
								children: ["Preview listing", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1478,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1476,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1467,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1206,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "post-preview",
						children: [
							preview.image && /* @__PURE__ */ (void 0)("img", {
								src: preview.image,
								alt: draft.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1485,
								columnNumber: 35
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "section-kicker",
								children: [
									draft.category,
									" · ",
									draft.priceType
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1486,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { children: draft.title }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1489,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "detail-price",
								children: formatListingPrice(preview)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1490,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "profile-bio",
								children: draft.description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1491,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "profile-bio",
								children: [
									draft.audience.join(" · "),
									draft.location ? ` · ${draft.location}` : "",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1495,
										columnNumber: 19
									}, this),
									draft.contactMethod,
									" · ",
									draft.contact
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1492,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1484,
						columnNumber: 15
					}, this),
					error && /* @__PURE__ */ (void 0)("p", {
						role: "alert",
						className: "form-error",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1500,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "form-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setStep(1),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { size: 15 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1506,
								columnNumber: 19
							}, this), "Edit details"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1505,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							disabled: submitting,
							onClick: () => void publish(),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1510,
								columnNumber: 19
							}, this), submitting ? "Publishing..." : editId ? "Save changes" : "Publish listing"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1509,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1504,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1483,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1162,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1156,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1155,
		columnNumber: 5
	}, this);
}
//#endregion
export { DashboardPage, PostPage };
