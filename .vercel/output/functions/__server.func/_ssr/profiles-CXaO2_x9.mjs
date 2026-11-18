import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as ShieldCheck, E as Share2, Et as ArrowLeft, F as Moon, I as MessageCircle, N as Phone, O as Search, P as Pencil, Q as FileText, S as Shield, St as BadgeCheck, V as LogOut, a as UserRound, c as Upload, dt as ChevronRight, ht as Briefcase, m as Store, p as Sun, rt as Download, vt as BookOpen, x as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as isSafeMediaUrl, D as ownsListing, N as useCampus, T as listingService, a as DialogContent, c as TECHNICAL_ISSUE_MESSAGE, d as buildPhoneHref, f as buildWhatsAppUrl, i as Dialog, j as toUserSafeErrorMessage, k as profileService, n as Button, o as DialogDescription, s as DialogTitle } from "./store-BHsliIVM.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as HeroAmbient, i as Empty, m as Shell, p as SectionTitle, s as ListingCard, t as AnimatedSelect, u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
import { t as SellerStatusIndicator } from "./verification-BMeJn_oZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profiles-CXaO2_x9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/profiles.tsx";
function ProfilePage({ sellerId }) {
	const { backendConfigured, authLoading, user, signOutUser, refreshProfile, listings, myListings, saved, liked, university, universityNames, dbUniversities, theme, toggleTheme, openInstallPrompt, isStandalone } = useCampus();
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [uploadingAvatar, setUploadingAvatar] = (0, import_react.useState)(false);
	const [avatar, setAvatar] = (0, import_react.useState)(void 0);
	const [collectionTab, setCollectionTab] = (0, import_react.useState)("saved");
	const [shopTab, setShopTab] = (0, import_react.useState)("all");
	const [shopQuery, setShopQuery] = (0, import_react.useState)("");
	const [remoteProfile, setRemoteProfile] = (0, import_react.useState)(null);
	const [remoteListings, setRemoteListings] = (0, import_react.useState)([]);
	const [affiliations, setAffiliations] = (0, import_react.useState)([]);
	const [selectedEditAffiliations, setSelectedEditAffiliations] = (0, import_react.useState)([]);
	const [loadingSeller, setLoadingSeller] = (0, import_react.useState)(Boolean(sellerId && backendConfigured));
	const dbUniversitiesRef = (0, import_react.useRef)(dbUniversities);
	dbUniversitiesRef.current = dbUniversities;
	(0, import_react.useEffect)(() => {
		if (!sellerId || !backendConfigured) {
			setLoadingSeller(false);
			return;
		}
		let active = true;
		setLoadingSeller(true);
		async function loadSeller() {
			try {
				let targetUserId = sellerId;
				let pub = await profileService.getPublicSellerProfile(targetUserId);
				if (!pub) {
					const fallbackListing = await listingService.getListingById(sellerId);
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
					const matchedUni = dbUniversitiesRef.current.find((u) => u.id === pub.primary_university_id);
					const campusLabel = matchedUni?.short_name || matchedUni?.university_name || sellerItems[0]?.university || "";
					setAffiliations(campusLabel ? [campusLabel] : []);
				}
			} catch {} finally {
				if (active) setLoadingSeller(false);
			}
		}
		loadSeller();
		return () => {
			active = false;
		};
	}, [sellerId, backendConfigured]);
	(0, import_react.useEffect)(() => {
		if (!backendConfigured || sellerId || !user?.id) return;
		profileService.listUserUniversities(user.id).then((rows) => {
			const names = rows.map((u) => u.university?.short_name || u.university?.university_name || "").filter(Boolean);
			setAffiliations(names);
			setSelectedEditAffiliations(names.length ? names : [user.university]);
		}).catch(() => void 0);
	}, [
		backendConfigured,
		sellerId,
		user?.id,
		user?.university
	]);
	if (loadingSeller || !sellerId && authLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 155,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 154,
		columnNumber: 7
	}, this);
	const listing = listings.find((l) => l.id === sellerId || l.sellerId === sellerId);
	if (sellerId && (backendConfigured ? !remoteProfile : !listing)) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
		title: "Profile unavailable",
		text: "This seller’s profile is no longer available."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 164,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 163,
		columnNumber: 7
	}, this);
	const publicOwner = listing?.ownerEmail && user?.email === listing.ownerEmail ? user : void 0;
	const remoteUniName = dbUniversities.find((u) => u.id === remoteProfile?.primary_university_id)?.short_name || dbUniversities.find((u) => u.id === remoteProfile?.primary_university_id)?.university_name || affiliations[0] || listing?.university || "Ghana Campus";
	const profile = sellerId ? remoteProfile ? {
		name: remoteProfile.full_name,
		username: remoteProfile.username,
		university: remoteUniName,
		bio: remoteProfile.bio || "Sharing products and services across campus.",
		capability: remoteProfile.account_type,
		contact: remoteProfile.preferred_contact_method || "WhatsApp",
		contactDetails: remoteProfile.public_contact_handle || void 0,
		avatar: remoteProfile.profile_image || void 0,
		verificationStatus: remoteProfile.verification_status
	} : publicOwner || {
		name: listing.seller,
		university: listing.university,
		bio: "Sharing products and services across campus.",
		capability: listing.type === "product" ? "Product Seller" : "Service Provider",
		contact: listing.contactMethod || "WhatsApp",
		contactDetails: listing.contact,
		avatar: void 0,
		verificationStatus: listing.verificationStatus
	} : user;
	const safeProfileAvatar = isSafeMediaUrl(profile?.avatar) ? profile?.avatar : void 0;
	const active = sellerId ? remoteListings.length > 0 ? remoteListings.map((item) => ({
		...item,
		seller: profile?.name || item.seller
	})) : listings.filter((l) => l.status === "Active" && (l.sellerId === sellerId || l.seller === profile?.name)) : backendConfigured ? myListings.filter((l) => l.status === "Active") : listings.filter((l) => l.status === "Active" && ownsListing(l, user?.email));
	const trimmedShopQuery = shopQuery.trim().toLowerCase();
	const shopFiltered = active.filter((item) => {
		if (!trimmedShopQuery) return true;
		return item.title.toLowerCase().includes(trimmedShopQuery) || item.category.toLowerCase().includes(trimmedShopQuery) || item.description.toLowerCase().includes(trimmedShopQuery);
	});
	const shopProducts = shopFiltered.filter((l) => l.type === "product");
	const shopServices = shopFiltered.filter((l) => l.type === "service");
	const favourites = listings.filter((l) => saved.includes(l.id));
	const likedList = listings.filter((l) => liked.includes(l.id));
	const visibleCollection = collectionTab === "saved" ? favourites : likedList;
	const whatsappHref = buildWhatsAppUrl(profile?.contactDetails, `Hi ${profile?.name || ""}, I visited your shop on CampusLoop.`);
	const phoneHref = buildPhoneHref(profile?.contactDetails);
	async function shareShop() {
		const shareUrl = typeof window !== "undefined" ? window.location.href : "";
		try {
			if (navigator.share) await navigator.share({
				title: `${profile?.name || "Seller"} — CampusLoop Shop`,
				url: shareUrl
			});
			else {
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Shop link copied");
			}
		} catch {
			toast.info("Share cancelled");
		}
	}
	async function handleAvatarSelect(file) {
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
	async function save(e) {
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
			const primaryUni = dbUniversities.find((u) => u.short_name === nextUni || u.university_name === nextUni);
			await profileService.updateMyProfile({
				full_name: nextName,
				username: nextUsername || void 0,
				primary_university_id: primaryUni?.id ?? null,
				bio: nextBio,
				preferred_contact_method: nextContact,
				whatsapp_number: nextContact === "WhatsApp" ? nextDetails || null : user.whatsappNumber,
				phone_number: nextContact !== "Email" ? nextDetails || null : user.phoneNumber,
				profile_image: avatar ?? user.avatar ?? null
			});
			const rows = Array.from(/* @__PURE__ */ new Set([nextUni, ...selectedEditAffiliations])).map((name) => {
				const match = dbUniversities.find((u) => u.short_name === name || u.university_name === name);
				if (!match) return null;
				return {
					university_id: match.id,
					affiliation_type: user.capability === "Service Provider" ? "Service Provider" : "Student",
					is_primary: match.id === primaryUni?.id
				};
			}).filter((r) => Boolean(r));
			if (rows.length > 0) await profileService.saveUserUniversities(rows);
			await refreshProfile();
			toast.success("Profile updated");
			setEditing(false);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		} finally {
			setSavingProfile(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [
		sellerId && /* @__PURE__ */ (void 0)(Link, {
			to: "/discover",
			className: "back-link",
			children: [/* @__PURE__ */ (void 0)(ArrowLeft, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 338,
				columnNumber: 11
			}, this), "Back to marketplace"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 337,
			columnNumber: 9
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel hero-panel profile-hero-panel curve-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 344,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "profile-top",
					children: [
						safeProfileAvatar ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							className: "profile-avatar",
							src: safeProfileAvatar,
							alt: profile?.name || "Profile photo",
							decoding: "async"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 347,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "profile-avatar",
							children: profile ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("") : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserRound, { size: 30 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 362,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 354,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "profile-heading",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "greeting",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "greeting-pulse",
										"aria-hidden": "true"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 368,
										columnNumber: 15
									}, this), sellerId ? "Seller shop storefront" : user ? "Seller studio" : "Buyer pass"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 367,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
									className: "seller-name-inline",
									children: [sellerId ? `${profile?.name || "Seller"}’s Shop` : profile?.name || "Guest buyer", profile?.verificationStatus === "verified" && /* @__PURE__ */ (void 0)(BadgeCheck, {
										size: 18,
										className: "verified-inline-icon",
										"aria-label": "Verified campus seller"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 374,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 371,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [profile?.username ? `@${profile.username} · ` : "", affiliations.length > 1 ? affiliations.join(" · ") : profile?.university || `Browsing ${university}`] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 381,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: [profile?.capability || "Browse & contact sellers without an account", profile?.verificationStatus === "verified" ? " · Verified seller" : ""] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 387,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 11
						}, this),
						user && !sellerId && /* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							className: "profile-edit-btn",
							onClick: () => {
								setAvatar(user.avatar);
								setEditing(true);
							},
							children: [/* @__PURE__ */ (void 0)(Pencil, { size: 15 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 15
							}, this), "Edit profile"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 393,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 345,
					columnNumber: 9
				}, this),
				profile?.bio && /* @__PURE__ */ (void 0)("p", {
					className: "profile-bio",
					children: profile.bio
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 407,
					columnNumber: 26
				}, this),
				sellerId && profile && /* @__PURE__ */ (void 0)(SellerStatusIndicator, { status: profile.verificationStatus }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 409,
					columnNumber: 33
				}, this),
				sellerId && profile && /* @__PURE__ */ (void 0)("div", {
					className: "shop-summary-bar",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "shop-metrics tabular-nums",
						children: [
							/* @__PURE__ */ (void 0)("span", { children: [
								/* @__PURE__ */ (void 0)("strong", { children: active.length }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 415,
									columnNumber: 17
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("small", { children: active.length === 1 ? "Listing" : "Total items" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 414,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								"aria-hidden": "true",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 418,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", { children: [
								/* @__PURE__ */ (void 0)("strong", { children: active.filter((i) => i.type === "product").length }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 17
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("small", { children: "Products" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 421,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 419,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								"aria-hidden": "true",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 423,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", { children: [
								/* @__PURE__ */ (void 0)("strong", { children: active.filter((i) => i.type === "service").length }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 425,
									columnNumber: 17
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("small", { children: "Services" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 426,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 424,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 413,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "shop-cta-row",
						children: [
							whatsappHref && /* @__PURE__ */ (void 0)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (void 0)("a", {
									href: whatsappHref,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (void 0)(MessageCircle, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 434,
										columnNumber: 21
									}, this), "Message seller"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 433,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 432,
								columnNumber: 17
							}, this),
							phoneHref && /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (void 0)("a", {
									href: phoneHref,
									children: [/* @__PURE__ */ (void 0)(Phone, { size: 15 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 442,
										columnNumber: 21
									}, this), "Call"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 440,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								onClick: () => void shareShop(),
								children: [/* @__PURE__ */ (void 0)(Share2, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 448,
									columnNumber: 17
								}, this), "Share shop"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 447,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 430,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 412,
					columnNumber: 11
				}, this),
				profile && !sellerId && /* @__PURE__ */ (void 0)("p", {
					className: "profile-contact-note",
					children: [/* @__PURE__ */ (void 0)(MessageCircle, { size: 15 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 457,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", { children: [
						"Preferred contact: ",
						/* @__PURE__ */ (void 0)("strong", { children: profile.contact }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 459,
							columnNumber: 34
						}, this),
						profile.contactDetails ? ` · ${profile.contactDetails}` : ""
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 458,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 456,
					columnNumber: 11
				}, this),
				!sellerId && /* @__PURE__ */ (void 0)("div", {
					className: "quick-actions profile-actions",
					children: user ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						user.role === "admin" && /* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							className: "admin-launch-btn",
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Link, {
								to: "/admin",
								children: [/* @__PURE__ */ (void 0)(Shield, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 472,
									columnNumber: 23
								}, this), "Admin Console"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 471,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 470,
							columnNumber: 19
						}, this),
						user.id && /* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Link, {
								to: "/seller/$id",
								params: { id: user.id },
								children: [/* @__PURE__ */ (void 0)(Store, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 480,
									columnNumber: 23
								}, this), "View my shop"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 479,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 478,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (void 0)(Button, {
							className: "dashboard-create-btn",
							asChild: true,
							children: /* @__PURE__ */ (void 0)(Link, {
								to: "/dashboard",
								children: "Dashboard"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 486,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 485,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (void 0)(Button, {
							variant: "outline",
							className: "profile-edit-btn",
							onClick: () => void signOutUser(),
							children: [/* @__PURE__ */ (void 0)(LogOut, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 493,
								columnNumber: 19
							}, this), "Log out"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 488,
							columnNumber: 17
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 468,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (void 0)(Button, {
						className: "dashboard-create-btn",
						asChild: true,
						children: /* @__PURE__ */ (void 0)(Link, {
							to: "/auth",
							children: "Verify & Sell on CampusLoop"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 499,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 498,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 466,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 343,
			columnNumber: 7
		}, this),
		sellerId && profile ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel section-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
					eyebrow: "Storefront catalog",
					title: "Products & services in this shop",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "segmented compact-tabs",
						role: "tablist",
						"aria-label": "Filter shop items",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": shopTab === "all",
								className: shopTab === "all" ? "selected" : "",
								onClick: () => setShopTab("all"),
								children: [
									"All (",
									shopFiltered.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 511,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": shopTab === "product",
								className: shopTab === "product" ? "selected" : "",
								onClick: () => setShopTab("product"),
								children: [
									"Products (",
									shopProducts.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 520,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": shopTab === "service",
								className: shopTab === "service" ? "selected" : "",
								onClick: () => setShopTab("service"),
								children: [
									"Services (",
									shopServices.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 529,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 510,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 509,
					columnNumber: 13
				}, this),
				active.length > 1 && /* @__PURE__ */ (void 0)("div", {
					className: "shop-search-row",
					children: [/* @__PURE__ */ (void 0)(Search, {
						size: 16,
						"aria-hidden": "true"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 543,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("input", {
						"aria-label": "Search inside this seller shop",
						placeholder: `Search products & services from ${profile.name}...`,
						value: shopQuery,
						onChange: (e) => setShopQuery(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 544,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 542,
					columnNumber: 15
				}, this),
				shopFiltered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
					title: "No matching items in this shop",
					text: active.length === 0 ? "This seller hasn't published active products or services yet." : "Try clearing your search or switching between Products and Services."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 554,
					columnNumber: 15
				}, this) : shopTab === "all" && shopProducts.length > 0 && shopServices.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "shop-catalog-sections",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "shop-catalog-group",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "shop-group-head",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 566,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: [
								"Products (",
								shopProducts.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 567,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 565,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "listing-grid",
							children: shopProducts.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListingCard, { listing: l }, l.id, false, {
								fileName: _jsxFileName,
								lineNumber: 571,
								columnNumber: 23
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 569,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 564,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "shop-catalog-group",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "shop-group-head",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Briefcase, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 578,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: [
								"Services (",
								shopServices.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 579,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 577,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "listing-grid",
							children: shopServices.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListingCard, { listing: l }, l.id, false, {
								fileName: _jsxFileName,
								lineNumber: 583,
								columnNumber: 23
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 581,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 576,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 563,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "listing-grid",
					children: (shopTab === "product" ? shopProducts : shopTab === "service" ? shopServices : shopFiltered).map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListingCard, { listing: l }, l.id, false, {
						fileName: _jsxFileName,
						lineNumber: 596,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 589,
					columnNumber: 15
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 508,
			columnNumber: 11
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 507,
			columnNumber: 9
		}, this) : profile && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel",
			children: [/* @__PURE__ */ (void 0)(SectionTitle, { title: "Your public listings" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 605,
				columnNumber: 13
			}, this), active.length ? /* @__PURE__ */ (void 0)("div", {
				className: "listing-grid",
				children: active.map((l) => /* @__PURE__ */ (void 0)(ListingCard, { listing: l }, l.id, false, {
					fileName: _jsxFileName,
					lineNumber: 609,
					columnNumber: 19
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 607,
				columnNumber: 15
			}, this) : /* @__PURE__ */ (void 0)(Empty, {
				title: "No active listings",
				text: "Published listings will appear here."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 613,
				columnNumber: 15
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 604,
			columnNumber: 11
		}, this),
		!sellerId && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel",
			children: [/* @__PURE__ */ (void 0)(SectionTitle, {
				title: "Saved & liked",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "segmented compact-tabs",
					children: [/* @__PURE__ */ (void 0)("button", {
						type: "button",
						className: collectionTab === "saved" ? "selected" : "",
						onClick: () => setCollectionTab("saved"),
						children: [
							"Saved (",
							favourites.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 623,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("button", {
						type: "button",
						className: collectionTab === "liked" ? "selected" : "",
						onClick: () => setCollectionTab("liked"),
						children: [
							"Liked (",
							likedList.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 630,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 622,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 621,
				columnNumber: 11
			}, this), visibleCollection.length ? /* @__PURE__ */ (void 0)("div", {
				className: "listing-grid",
				children: visibleCollection.map((l) => /* @__PURE__ */ (void 0)(ListingCard, { listing: l }, l.id, false, {
					fileName: _jsxFileName,
					lineNumber: 642,
					columnNumber: 17
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 640,
				columnNumber: 13
			}, this) : /* @__PURE__ */ (void 0)(Empty, {
				title: collectionTab === "saved" ? "Nothing saved yet" : "No liked listings yet",
				text: collectionTab === "saved" ? "Tap the bookmark on any listing to keep it handy." : "Tap Like on any product or service to save it here.",
				children: /* @__PURE__ */ (void 0)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (void 0)(Link, {
						to: "/discover",
						children: "Explore marketplace"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 655,
						columnNumber: 17
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 654,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 646,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 620,
			columnNumber: 9
		}, this),
		!sellerId && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel",
			children: [/* @__PURE__ */ (void 0)(SectionTitle, { title: "App & guides" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 664,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "utility-links-grid",
				children: [
					/* @__PURE__ */ (void 0)("button", {
						type: "button",
						className: "utility-link-row",
						onClick: toggleTheme,
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "utility-icon",
								children: theme === "dark" ? /* @__PURE__ */ (void 0)(Sun, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 668,
									columnNumber: 37
								}, this) : /* @__PURE__ */ (void 0)(Moon, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 668,
									columnNumber: 57
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 667,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: theme === "dark" ? "Light appearance" : "Dark appearance" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 671,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("small", { children: [
								"Currently using ",
								theme,
								" mode"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 672,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 670,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(ChevronRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 674,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 666,
						columnNumber: 13
					}, this),
					!isStandalone && /* @__PURE__ */ (void 0)("button", {
						type: "button",
						className: "utility-link-row",
						onClick: openInstallPrompt,
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "utility-icon",
								children: /* @__PURE__ */ (void 0)(Download, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 680,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 679,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Add to Home Screen" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 683,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("small", { children: "Install on iPhone, Android or desktop" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 684,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 682,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(ChevronRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 686,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 678,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/manual",
						className: "utility-link-row",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "utility-icon",
								children: /* @__PURE__ */ (void 0)(BookOpen, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 692,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 691,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "User Manual" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 695,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("small", { children: "How to buy, sell & stay safe" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 696,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 694,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(ChevronRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 698,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 690,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/privacy",
						className: "utility-link-row",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "utility-icon",
								children: /* @__PURE__ */ (void 0)(ShieldCheck, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 703,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 702,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Privacy Policy" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 706,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("small", { children: "Data & permissions transparency" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 707,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 705,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(ChevronRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 709,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 701,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Link, {
						to: "/terms",
						className: "utility-link-row",
						children: [
							/* @__PURE__ */ (void 0)("span", {
								className: "utility-icon",
								children: /* @__PURE__ */ (void 0)(FileText, { size: 17 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 714,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 713,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Terms of Use" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 717,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("small", { children: "Campus trading guidelines" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 718,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 716,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(ChevronRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 720,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 712,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 665,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 663,
			columnNumber: 9
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: editing,
			onOpenChange: setEditing,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Edit profile" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 728,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Update your storefront identity and campus contact details." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 729,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: (e) => void save(e),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Profile photo" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 734,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "profile-upload-row",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 736,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: uploadingAvatar ? "Uploading photo..." : "Choose photo" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 737,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "file",
											accept: "image/*",
											className: "sr-only",
											disabled: uploadingAvatar,
											onChange: (e) => void handleAvatarSelect(e.target.files?.[0])
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 738,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 735,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 733,
								columnNumber: 13
							}, this),
							isSafeMediaUrl(avatar) && /* @__PURE__ */ (void 0)("img", {
								className: "profile-avatar mb-3",
								src: avatar,
								alt: "Your new profile photo"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 748,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Display name" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 752,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										name: "name",
										defaultValue: user?.name,
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 753,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 751,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Username" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 756,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										name: "username",
										defaultValue: user?.username || "",
										placeholder: "campus_handle"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 757,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 755,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 750,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Primary university" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 765,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									name: "university",
									ariaLabel: "University",
									kicker: "Your campus",
									defaultValue: user?.university,
									options: universityNames
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 766,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 764,
								columnNumber: 13
							}, this),
							backendConfigured && /* @__PURE__ */ (void 0)("fieldset", {
								className: "audience-fieldset",
								children: [/* @__PURE__ */ (void 0)("legend", {
									className: "field-label",
									children: "Campus affiliations"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 777,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "university-checks",
									children: universityNames.slice(0, 8).map((u) => /* @__PURE__ */ (void 0)("label", {
										className: "audience-check",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "checkbox",
											checked: selectedEditAffiliations.includes(u),
											onChange: (e) => setSelectedEditAffiliations((prev) => e.target.checked ? [...prev, u] : prev.filter((item) => item !== u))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 781,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("span", { children: u }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 790,
											columnNumber: 23
										}, this)]
									}, u, true, {
										fileName: _jsxFileName,
										lineNumber: 780,
										columnNumber: 21
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 778,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 776,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Short bio" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 798,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
									name: "bio",
									defaultValue: user?.bio
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 799,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 797,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact preference" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 803,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
										name: "contact",
										ariaLabel: "Contact preference",
										kicker: "Preferred channel",
										defaultValue: user?.contact,
										options: [
											"WhatsApp",
											"Phone call",
											"Email"
										]
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 804,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 802,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact details" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 813,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										name: "contactDetails",
										placeholder: "+233 XX XXX XXXX",
										defaultValue: user?.contactDetails || ""
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 814,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 812,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 801,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								className: "w-full",
								disabled: savingProfile || uploadingAvatar,
								children: savingProfile ? "Saving..." : "Save profile"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 821,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 732,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 727,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 726,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 335,
		columnNumber: 5
	}, this);
}
//#endregion
export { ProfilePage };
