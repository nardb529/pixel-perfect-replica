import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { E as Share2, Et as ArrowLeft, I as MessageCircle, N as Phone, St as BadgeCheck, Z as Flag, nt as ExternalLink, ot as Copy, pt as Check, x as ShoppingBag, z as MapPin } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as isSafeMediaUrl, N as useCampus, T as listingService, a as DialogContent, c as TECHNICAL_ISSUE_MESSAGE, d as buildPhoneHref, f as buildWhatsAppUrl, i as Dialog, j as toUserSafeErrorMessage, n as Button, o as DialogDescription, s as DialogTitle, v as formatListingPrice } from "./store-BHsliIVM.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as SaveButton, i as Empty, m as Shell, o as Likes, p as SectionTitle, s as ListingCard, t as AnimatedSelect, u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/details-B-OGsv_p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/details.tsx";
var REPORT_REASONS = [
	"Scam or suspicious activity",
	"Misleading listing",
	"Inappropriate content",
	"Duplicate listing",
	"Prohibited product or service",
	"Other"
];
function DetailPage({ id }) {
	const { listings, backendConfigured, recordView, recordContact, reportListing } = useCampus();
	const cachedListing = listings.find((l) => l.id === id) || null;
	const [fetchedListing, setFetchedListing] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(backendConfigured && !cachedListing);
	const [contact, setContact] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(false);
	const [reporting, setReporting] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)(REPORT_REASONS[1] ?? "Misleading listing");
	const [reportDescription, setReportDescription] = (0, import_react.useState)("");
	const [imageIndex, setImageIndex] = (0, import_react.useState)(0);
	const viewedId = (0, import_react.useRef)(null);
	const hasCachedRef = (0, import_react.useRef)(Boolean(cachedListing));
	hasCachedRef.current = Boolean(cachedListing);
	(0, import_react.useEffect)(() => {
		let active = true;
		setImageIndex(0);
		setFetchedListing(null);
		if (backendConfigured) {
			if (!hasCachedRef.current) setLoading(true);
			listingService.getListingById(id).then((res) => {
				if (active && res) setFetchedListing(res);
			}).catch(() => void 0).finally(() => {
				if (active) setLoading(false);
			});
		} else setLoading(false);
		if (viewedId.current !== id) {
			viewedId.current = id;
			recordView(id, "detail_page");
		}
		return () => {
			active = false;
		};
	}, [
		id,
		backendConfigured,
		recordView
	]);
	const listing = fetchedListing || cachedListing;
	if (loading && !listing) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 101,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 100,
		columnNumber: 7
	}, this);
	if (!listing) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
		title: "Listing unavailable",
		text: "This item may have been removed or paused. Explore other listings nearby.",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/discover",
				children: "Back to Discover"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 114,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 113,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 109,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 108,
		columnNumber: 7
	}, this);
	const images = (listing.images?.length ? listing.images : listing.image ? [listing.image] : []).filter((url) => isSafeMediaUrl(url));
	const others = listings.filter((l) => l.id !== id && l.status === "Active" && (listing.sellerId && l.sellerId === listing.sellerId || l.seller === listing.seller));
	const hasPrice = listing.price > 0;
	const enquiryText = `Hi ${listing.seller}, I saw “${listing.title}” on CampusLoop. Is it still available?`;
	const whatsappUrl = buildWhatsAppUrl(listing.contact, enquiryText);
	const phoneHref = buildPhoneHref(listing.contact);
	const sellerProfileParam = listing.sellerId || listing.id;
	async function share() {
		try {
			if (navigator.share) await navigator.share({
				title: listing?.title || "CampusLoop",
				url: window.location.href
			});
			else {
				await navigator.clipboard.writeText(window.location.href);
				toast.success("Link copied");
			}
		} catch {
			toast.info("Sharing cancelled");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: "/discover",
			className: "back-link",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { size: 15 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 154,
				columnNumber: 9
			}, this), "Back"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 153,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "detail-grid",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "surface-panel detail-media-panel",
				children: [images[imageIndex] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					className: "detail-image",
					src: images[imageIndex],
					alt: listing.title,
					referrerPolicy: "no-referrer",
					loading: "eager",
					fetchPriority: "high",
					decoding: "async",
					width: 1024,
					height: 1024
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 161,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "detail-image listing-image-fallback",
					children: "No photo provided"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 173,
					columnNumber: 13
				}, this), images.length > 1 && /* @__PURE__ */ (void 0)("div", {
					className: "detail-thumbs",
					children: images.map((im, i) => /* @__PURE__ */ (void 0)(Button, {
						type: "button",
						variant: imageIndex === i ? "default" : "outline",
						"aria-label": `View image ${i + 1}`,
						onClick: () => setImageIndex(i),
						children: /* @__PURE__ */ (void 0)("img", {
							src: im,
							alt: `${listing.title} view ${i + 1}`,
							decoding: "async"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 185,
							columnNumber: 19
						}, this)
					}, i, false, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 17
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 176,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 159,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "surface-panel detail-content curve-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "detail-kicker",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.category }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 194,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.type === "service" ? "Service" : "Product" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 13
							}, this),
							listing.priceType && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("span", { children: "·" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", { children: listing.priceType }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 193,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: listing.title }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 204,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "detail-price",
						children: [listing.type === "service" && hasPrice && listing.priceType !== "Free" && /* @__PURE__ */ (void 0)("small", { children: "From " }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 207,
							columnNumber: 15
						}, this), formatListingPrice(listing)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 205,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "detail-meta-line",
						children: [
							listing.condition && /* @__PURE__ */ (void 0)("span", { children: listing.condition }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 213,
								columnNumber: 35
							}, this),
							listing.condition && /* @__PURE__ */ (void 0)("span", {
								"aria-hidden": "true",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 214,
								columnNumber: 35
							}, this),
							listing.brand && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("span", { children: listing.brand }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("span", {
								"aria-hidden": "true",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 216,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { size: 13 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 15
							}, this), listing.location ? `${listing.location} (${listing.audience.join(", ")})` : listing.audience.join(", ")] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 221,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								"aria-hidden": "true",
								children: "·"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.time }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 212,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "detail-description",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: "Details" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: listing.description }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 13
							}, this),
							(listing.stockStatus || listing.duration || listing.serviceArea || listing.deliveryMethod) && /* @__PURE__ */ (void 0)("div", {
								className: "detail-extra-specs",
								children: [
									listing.stockStatus && /* @__PURE__ */ (void 0)("span", { children: [
										/* @__PURE__ */ (void 0)("strong", { children: "Availability:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 241,
											columnNumber: 21
										}, this),
										" ",
										listing.stockStatus
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 19
									}, this),
									listing.duration && /* @__PURE__ */ (void 0)("span", { children: [
										/* @__PURE__ */ (void 0)("strong", { children: "Typical duration:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 21
										}, this),
										" ",
										listing.duration
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 19
									}, this),
									listing.serviceArea && /* @__PURE__ */ (void 0)("span", { children: [
										/* @__PURE__ */ (void 0)("strong", { children: "Service area:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 251,
											columnNumber: 21
										}, this),
										" ",
										listing.serviceArea
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 19
									}, this),
									listing.deliveryMethod && /* @__PURE__ */ (void 0)("span", { children: [
										/* @__PURE__ */ (void 0)("strong", { children: "Delivery:" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 256,
											columnNumber: 21
										}, this),
										" ",
										listing.deliveryMethod
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 255,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 238,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 231,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "seller-strip",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/seller/$id",
								params: { id: sellerProfileParam },
								className: "avatar",
								"aria-label": `Open ${listing.seller}'s shop`,
								children: listing.seller.split(" ").map((n) => n[0]).slice(0, 2).join("")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 264,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/seller/$id",
								params: { id: sellerProfileParam },
								className: "seller-name-inline hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: listing.seller }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 282,
									columnNumber: 17
								}, this), listing.verificationStatus === "verified" && /* @__PURE__ */ (void 0)(BadgeCheck, {
									size: 14,
									className: "verified-inline-icon",
									"aria-label": "Verified seller"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 284,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 277,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: [
								listing.university,
								" ·",
								" ",
								listing.verificationStatus === "verified" ? "Verified Seller" : listing.verificationStatus === "pending" ? "Verification Pending" : "Unverified Seller"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 291,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 276,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/seller/$id",
								params: { id: sellerProfileParam },
								className: "text-link",
								children: "Visit shop"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 263,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "detail-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								className: "contact-button",
								onClick: () => {
									recordContact(id, listing.contactMethod || "WhatsApp");
									setContact(true);
								},
								children: listing.type === "service" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 315,
									columnNumber: 19
								}, this), "Contact Provider"] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 314,
									columnNumber: 17
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 320,
									columnNumber: 19
								}, this), "Get now"] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 319,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 306,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SaveButton, { id }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 325,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Likes, { id }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								onClick: share,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 328,
									columnNumber: 15
								}, this), "Share"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 327,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 305,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						className: "detail-report",
						onClick: () => setReport(true),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag, { size: 13 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 334,
							columnNumber: 13
						}, this), "Report listing"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 333,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 192,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 158,
			columnNumber: 7
		}, this),
		others.length > 0 && /* @__PURE__ */ (void 0)("section", {
			className: "surface-panel section-panel",
			children: [/* @__PURE__ */ (void 0)(SectionTitle, { title: `More from ${listing.seller}` }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 342,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "listing-carousel",
				children: others.map((l) => /* @__PURE__ */ (void 0)(ListingCard, { listing: l }, l.id, false, {
					fileName: _jsxFileName,
					lineNumber: 345,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 343,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 341,
			columnNumber: 9
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: contact,
			onOpenChange: setContact,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Connect with ", listing.seller] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 353,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Choose a contact option to reach out on campus." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 354,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "modal-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "contact-method",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { size: 20 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 357,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: listing.contactMethod || "WhatsApp" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 359,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: listing.contact || "+233 XX XXX XXXX" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 360,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, {
										className: "ml-auto",
										size: 16
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 362,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 356,
								columnNumber: 13
							}, this),
							phoneHref && /* @__PURE__ */ (void 0)("a", {
								href: phoneHref,
								className: "contact-method contact-method-link",
								children: [
									/* @__PURE__ */ (void 0)(Phone, { size: 20 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 366,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Call directly" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 368,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("small", { children: listing.contact }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 369,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 367,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)(ExternalLink, {
										className: "ml-auto",
										size: 15
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 371,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Meet in an open campus space and inspect items before making any payment." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "modal-actions",
								children: [whatsappUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: whatsappUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										onClick: () => {
											toast.success(`Opening WhatsApp chat for ${listing.seller}`);
											setContact(false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { size: 16 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 387,
											columnNumber: 21
										}, this), "Message on WhatsApp"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 378,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 377,
									columnNumber: 17
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									onClick: () => {
										toast.success(`Contact ${listing.seller} via ${listing.contactMethod || "their listed handle"}`);
										setContact(false);
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { size: 16 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 400,
											columnNumber: 19
										}, this),
										"Reach out via ",
										listing.contactMethod || "Seller contact"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 392,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									onClick: async () => {
										try {
											await navigator.clipboard.writeText(enquiryText);
											toast.success("Message copied");
										} catch {
											toast.error("Could not copy enquiry automatically");
										}
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 415,
										columnNumber: 17
									}, this), "Copy enquiry message"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 404,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 375,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 355,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 352,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 351,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: report,
			onOpenChange: setReport,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "mobile-dialog onboarding-dialog",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Report listing" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 425,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Tell us what looks wrong so our moderation team can review this listing." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 426,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "modal-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Reason" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 431,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
									ariaLabel: "Report reason",
									kicker: "Select a reason",
									value: reason,
									onValueChange: setReason,
									options: REPORT_REASONS
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 430,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Additional details (optional)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
									placeholder: "Describe what happened or what seems suspicious...",
									maxLength: 1500,
									value: reportDescription,
									onChange: (e) => setReportDescription(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 442,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 440,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								disabled: reporting,
								onClick: async () => {
									setReporting(true);
									try {
										if (!await reportListing(id, reason, reportDescription)) {
											toast.error(TECHNICAL_ISSUE_MESSAGE);
											return;
										}
										toast.success("Report submitted for moderation review");
										setReportDescription("");
										setReport(false);
									} catch (err) {
										toast.error(toUserSafeErrorMessage(err));
									} finally {
										setReporting(false);
									}
								},
								children: reporting ? "Submitting..." : "Submit report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 449,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 429,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 424,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 423,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 152,
		columnNumber: 5
	}, this);
}
//#endregion
export { DetailPage };
