import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as RotateCcw, G as Laptop, I as MessageCircle, K as House, R as Maximize2, T as Share, _t as BookmarkCheck, bt as BellRing, g as SquarePlus, j as RefreshCw, l as TriangleAlert, r as WifiOff, rt as Download, t as Zap, ut as CircleCheck, y as Smartphone } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { N as useCampus, a as DialogContent, i as Dialog, n as Button, o as DialogDescription, r as CampusProvider, s as DialogTitle, t as BRAND } from "./store-BHsliIVM.mjs";
import { C as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as pageHead, i as SITE_URL, n as SITE_DESCRIPTION, r as SITE_TITLE, t as OG_IMAGE_URL } from "./meta-BTNnRvC5.mjs";
import { t as Route$11 } from "./listing._id-BEX-wh-W.mjs";
import { t as Route$12 } from "./listing._id_.edit-BBXF_fpW.mjs";
import { t as Route$13 } from "./post-D-3RmHGq.mjs";
import { t as Route$14 } from "./products-CA2kLxL0.mjs";
import { t as Route$15 } from "./services-fGULnK2f.mjs";
import { t as Route$16 } from "./seller._id-DvS__qUb.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D_aI9FwC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-5WxstpGG.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var _jsxFileName$3 = "/app/applet/src/components/campus/pwa.tsx";
function OnboardingPrompts() {
	const { user, isStandalone, isIOS, isMacSafari, canNativeInstall, triggerNativeInstall, buyerInstallOpen, closeBuyerInstallPrompt, sellerPostAuthStage, completeNotificationStep, dismissSellerPrompts, manualInstallOpen, closeInstallPrompt, requestAppNotifications } = useCampus();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [deviceTab, setDeviceTab] = (0, import_react.useState)("android");
	const [installing, setInstalling] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isIOS) setDeviceTab("ios");
		else if (typeof window !== "undefined" && window.innerWidth >= 900) setDeviceTab("desktop");
		else setDeviceTab("android");
	}, [isIOS]);
	const showSellerNotif = Boolean(user) && sellerPostAuthStage === "notifications" && pathname === "/dashboard";
	const showSellerInstall = Boolean(user) && sellerPostAuthStage === "install" && pathname === "/dashboard" && !isStandalone;
	const showBuyerInstall = buyerInstallOpen && pathname === "/discover" && !isStandalone;
	const showInstallDialog = showSellerNotif ? false : showSellerInstall || showBuyerInstall || manualInstallOpen;
	function handleCloseInstall() {
		if (showBuyerInstall) closeBuyerInstallPrompt();
		if (showSellerInstall) dismissSellerPrompts();
		if (manualInstallOpen) closeInstallPrompt();
	}
	async function handleEnableNotifications() {
		const result = await requestAppNotifications();
		if (result === "granted") toast.success("Notifications enabled for your seller account");
		else if (result === "denied") toast.info("Notifications blocked in browser settings");
		else if (result === "unsupported") toast.info("Notifications are not supported in this browser");
		completeNotificationStep(result === "granted");
	}
	async function handleInstallClick() {
		if (canNativeInstall) {
			setInstalling(true);
			const outcome = await triggerNativeInstall();
			setInstalling(false);
			if (outcome === "accepted") {
				toast.success(`${BRAND} added to your device`);
				handleCloseInstall();
			} else if (outcome === "dismissed") toast.info("You can install anytime from your Profile");
			return;
		}
		toast.info(deviceTab === "ios" ? "Tap Safari's Share icon, then choose Add to Home Screen" : deviceTab === "desktop" ? isMacSafari ? "Use Safari File menu -> Add to Dock" : "Click the Install icon in your browser address bar or menu" : "Open browser menu and tap Install app or Add to Home screen");
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open: showSellerNotif,
		onOpenChange: (open) => {
			if (!open) completeNotificationStep(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "mobile-dialog onboarding-dialog",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "onboarding-scroll-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-stage notif-stage",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "stage-orb stage-orb-a" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 126,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "stage-orb stage-orb-b" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 127,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "stage-waves",
								viewBox: "0 0 360 120",
								fill: "none",
								preserveAspectRatio: "none",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									className: "stage-wave-path wave-one",
									d: "M-10 88 C 68 38, 146 112, 232 62 C 288 30, 330 48, 370 72",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 134,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									className: "stage-wave-path wave-two",
									d: "M-10 56 C 72 98, 168 22, 256 76 C 306 106, 338 80, 370 46",
									stroke: "currentColor",
									strokeWidth: "1.6",
									strokeLinecap: "round"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 141,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 128,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "notif-float-pill notif-pill-left",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookmarkCheck, { size: 13 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 151,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Item saved" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 152,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 150,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "notif-float-pill notif-pill-right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { size: 13 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 155,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Buyer ping" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 156,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 154,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "notif-centerpiece",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "notif-pulse-ring ring-one" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 160,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "notif-pulse-ring ring-two" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 161,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "notif-bell-core",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BellRing, {
											size: 28,
											className: "notif-bell-glyph"
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 163,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "notif-live-dot" }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 164,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 162,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 159,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 125,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-copy",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "onboarding-title",
							children: "Turn on seller alerts"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 170,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "onboarding-desc",
							children: [
								"Never miss a campus buyer — get instant alerts when students save your items or reach out on ",
								BRAND,
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 171,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 169,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-perks",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "onboarding-perk-pill",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "perk-badge",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { size: 15 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 180,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 179,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Instant enquiry alerts while browsing" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 182,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 178,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "onboarding-perk-pill",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "perk-badge",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { size: 15 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 186,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 185,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Real-time updates when listings trend" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 188,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 184,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 177,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-actions",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							className: "onboarding-cta",
							onClick: handleEnableNotifications,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BellRing, { size: 17 }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 194,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Enable Notifications" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 195,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 193,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							className: "onboarding-skip",
							onClick: () => completeNotificationStep(false),
							children: "Not now"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 197,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 192,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 124,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 123,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 117,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open: showInstallDialog,
		onOpenChange: (open) => {
			if (!open) handleCloseInstall();
		},
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "mobile-dialog onboarding-dialog",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "onboarding-scroll-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-stage install-stage",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "stage-orb stage-orb-a" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 218,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "stage-orb stage-orb-c" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 219,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								className: "stage-waves violet",
								viewBox: "0 0 360 120",
								fill: "none",
								preserveAspectRatio: "none",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									className: "stage-wave-path wave-one",
									d: "M-10 46 C 78 96, 178 18, 266 66 C 310 90, 342 64, 370 38",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 226,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
									className: "stage-wave-path wave-two",
									d: "M-10 92 C 84 44, 186 106, 274 52 C 314 28, 344 42, 370 68",
									stroke: "currentColor",
									strokeWidth: "1.6",
									strokeLinecap: "round"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 233,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 220,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "notif-float-pill install-pill-left",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { size: 12 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 243,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "1-tap launch" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 244,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 242,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "notif-float-pill install-pill-right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Maximize2, { size: 12 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 247,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Full screen" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 248,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 246,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "install-centerpiece",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "install-orbit-halo" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 252,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "install-icon-shell",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: "/pwa-192x192.png",
										alt: `${BRAND} app icon`,
										className: "onboarding-app-icon",
										width: 66,
										height: 66
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 254,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "install-corner-badge",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { size: 13 }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 262,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 261,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 253,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 251,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 217,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-copy",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "onboarding-title",
							children: ["Install ", BRAND]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 269,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "onboarding-desc",
							children: [
								"Pin ",
								BRAND,
								" directly to your home screen for one-tap campus access and a smooth full-screen app feel."
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 270,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 268,
						columnNumber: 13
					}, this),
					canNativeInstall ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "install-ready-card",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "perk-badge",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { size: 16 }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 279,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 278,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Instant install ready" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 282,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Works offline with fast home-screen launch" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 283,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 281,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 277,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "device-switcher",
						role: "tablist",
						"aria-label": "Device install guide",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": deviceTab === "ios",
								className: deviceTab === "ios" ? "active" : "",
								onClick: () => setDeviceTab("ios"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { size: 13 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 296,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "iPhone" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 297,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 289,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": deviceTab === "android",
								className: deviceTab === "android" ? "active" : "",
								onClick: () => setDeviceTab("android"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Smartphone, { size: 13 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 306,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Android" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 307,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 299,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								role: "tab",
								"aria-selected": deviceTab === "desktop",
								className: deviceTab === "desktop" ? "active" : "",
								onClick: () => setDeviceTab("desktop"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Laptop, { size: 13 }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 316,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Desktop" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 317,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 309,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 288,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "install-steps-box",
						children: deviceTab === "ios" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "1"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 325,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"Tap ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share, {
									size: 14,
									className: "inline-icon"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 327,
									columnNumber: 31
								}, this),
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Share" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 327,
									columnNumber: 75
								}, this),
								" in your Safari bar"
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 326,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 324,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "2"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 332,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"Pick ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePlus, {
									size: 14,
									className: "inline-icon"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 334,
									columnNumber: 32
								}, this),
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Add to Home Screen" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 335,
									columnNumber: 27
								}, this),
								", then tap ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Add" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 335,
									columnNumber: 73
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 333,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 331,
							columnNumber: 23
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 323,
							columnNumber: 21
						}, this) : deviceTab === "android" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "1"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 342,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"Open your browser menu (",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "⋮" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 344,
									columnNumber: 51
								}, this),
								") in Chrome or Edge"
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 343,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 341,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "2"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 348,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"Tap ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Install app" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 350,
									columnNumber: 31
								}, this),
								" or ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Add to Home screen" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 350,
									columnNumber: 63
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 349,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 347,
							columnNumber: 23
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 340,
							columnNumber: 21
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "1"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 357,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: isMacSafari ? "Open Safari's File menu at the top of your screen" : "Click the Install icon on the right side of your address bar" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 358,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 356,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "install-step",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "step-num",
								children: "2"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 365,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: isMacSafari ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
								"Select ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Add to Dock" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 369,
									columnNumber: 38
								}, this),
								" to launch ",
								BRAND,
								" like an app"
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 368,
								columnNumber: 29
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
								"Confirm ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: ["Install ", BRAND] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 373,
									columnNumber: 39
								}, this),
								" to pin it to your desktop"
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 372,
								columnNumber: 29
							}, this) }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 366,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 364,
							columnNumber: 23
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 355,
							columnNumber: 21
						}, this)
					}, deviceTab, false, {
						fileName: _jsxFileName$3,
						lineNumber: 321,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 287,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "onboarding-actions",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							className: "onboarding-cta",
							onClick: handleInstallClick,
							disabled: installing,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { size: 17 }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 386,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: canNativeInstall ? installing ? "Opening installer..." : "Add to Home Screen" : deviceTab === "desktop" ? "Show Install Steps" : "Got it, Add to Home Screen" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 387,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 385,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							className: "onboarding-skip",
							onClick: handleCloseInstall,
							children: "Continue in browser"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 397,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 384,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 216,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 215,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 209,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 116,
		columnNumber: 5
	}, this);
}
function OfflineBanner() {
	const [offline, setOffline] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setOffline(!navigator.onLine);
		const goOffline = () => setOffline(true);
		const goOnline = () => setOffline(false);
		window.addEventListener("offline", goOffline);
		window.addEventListener("online", goOnline);
		return () => {
			window.removeEventListener("offline", goOffline);
			window.removeEventListener("online", goOnline);
		};
	}, []);
	if (!offline) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "offline-banner",
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WifiOff, { size: 15 }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 427,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "You are offline — showing cached campus listings" }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 428,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 426,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/error-boundary.tsx";
var ErrorBoundary = class extends import_react.Component {
	state = {
		hasError: false,
		error: null
	};
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("CampusLoop runtime error caught by ErrorBoundary:", error);
		reportLovableError(error, {
			boundary: "global_error_boundary",
			componentStack: errorInfo.componentStack
		});
	}
	handleReset = () => {
		this.setState({
			hasError: false,
			error: null
		});
		this.props.onReset?.();
	};
	handleReload = () => {
		if (typeof window !== "undefined") window.location.reload();
	};
	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) return this.props.fallback({
				error: this.state.error,
				reset: this.handleReset
			});
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "error-boundary-shell",
				role: "alert",
				"aria-live": "assertive",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "surface-panel error-boundary-card curve-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "error-boundary-orb",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { size: 24 }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 61,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 60,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "error-boundary-eyebrow",
							children: "CampusLoop"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 63,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "error-boundary-title",
							children: "Technical issue"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 64,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "error-boundary-desc",
							children: "We're experiencing a brief technical issue, and it is being worked on. Try again, reload the page, or return to Discover."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 65,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "error-boundary-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: this.handleReset,
									className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { size: 15 }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 75,
										columnNumber: 17
									}, this), "Try again"]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 70,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: this.handleReload,
									className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { size: 15 }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 83,
										columnNumber: 17
									}, this), "Reload page"]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 78,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "/discover",
									className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(House, { size: 15 }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 90,
										columnNumber: 17
									}, this), "Go to Discover"]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 86,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 69,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 59,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 58,
				columnNumber: 9
			}, this);
		}
		return this.props.children;
	}
};
var _jsxFileName$1 = "/app/applet/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		mobileOffset: {
			top: "calc(12px + env(safe-area-inset-top))",
			bottom: "calc(96px + env(safe-area-inset-bottom))",
			left: "max(12px, env(safe-area-inset-left))",
			right: "max(12px, env(safe-area-inset-right))"
		},
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "error-boundary-shell",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "surface-panel error-boundary-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 30,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 23,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "error-boundary-shell",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "surface-panel error-boundary-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Technical issue"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "We're experiencing a brief technical issue, and it is being worked on. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 51,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 50,
		columnNumber: 5
	}, this);
}
var STRUCTURED_DATA = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": `${SITE_URL}/#organization`,
			name: "CampusLoop",
			alternateName: "CampusLoop Ghana Campus Marketplace",
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}/pwa-512x512.png`,
				width: 512,
				height: 512
			},
			areaServed: {
				"@type": "Country",
				name: "Ghana"
			},
			description: SITE_DESCRIPTION
		},
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: SITE_URL,
			name: SITE_TITLE,
			description: SITE_DESCRIPTION,
			inLanguage: "en-GH",
			publisher: { "@id": `${SITE_URL}/#organization` },
			potentialAction: {
				"@type": "SearchAction",
				target: `${SITE_URL}/products?q={search_term_string}`,
				"query-input": "required name=search_term_string"
			}
		},
		{
			"@type": "WebApplication",
			"@id": `${SITE_URL}/#webapp`,
			name: SITE_TITLE,
			url: SITE_URL,
			applicationCategory: "ShoppingApplication",
			operatingSystem: "Any",
			browserRequirements: "Requires JavaScript",
			description: SITE_DESCRIPTION,
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "GHS"
			},
			areaServed: {
				"@type": "Country",
				name: "Ghana"
			}
		},
		{
			"@type": "FAQPage",
			"@id": `${SITE_URL}/#faq`,
			mainEntity: [
				{
					"@type": "Question",
					name: "What is CampusLoop?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "CampusLoop is Ghana's university campus marketplace where students and campus entrepreneurs buy, sell, and book products and services across Ghanaian universities."
					}
				},
				{
					"@type": "Question",
					name: "Do buyers need an account to use CampusLoop?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No. Buyers can browse listings, filter by university, bookmark items, and contact sellers directly via WhatsApp or phone call without creating an account."
					}
				},
				{
					"@type": "Question",
					name: "Which Ghanaian universities are supported on CampusLoop?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "CampusLoop supports KNUST, University of Ghana (Legon), University of Cape Coast (UCC), Central University, UPSA, UEW, UDS, UMaT, UENR, GCTU, UHAS, UESD, GIMPA, ATU, KsTU, TTU, and other accredited Ghanaian institutions."
					}
				},
				{
					"@type": "Question",
					name: "How are sellers verified on CampusLoop?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Students verify with a Student ID and matching face photo, while non-student sellers verify with a Ghana Card or Voter's ID and matching face photo, all reviewed by platform admins before listing."
					}
				},
				{
					"@type": "Question",
					name: "What currency and meetup safety rules apply on CampusLoop?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "All listings are priced in Ghanaian Cedis (GH₵). CampusLoop connects buyers and sellers directly and recommends meeting in busy, open public campus locations to inspect items before paying."
					}
				}
			]
		}
	]
};
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: SITE_TITLE },
			{
				name: "description",
				content: SITE_DESCRIPTION
			},
			{
				name: "keywords",
				content: "CampusLoop, Ghana campus marketplace, Ghanaian university marketplace, student marketplace Ghana, KNUST marketplace, University of Ghana marketplace, UCC marketplace, Central University marketplace, UPSA marketplace, buy and sell campus Ghana, student services Ghana"
			},
			{
				name: "author",
				content: "CampusLoop"
			},
			{
				name: "geo.region",
				content: "GH"
			},
			{
				name: "geo.country",
				content: "Ghana"
			},
			{
				name: "theme-color",
				content: "#4965F5"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "CampusLoop Marketplace"
			},
			{
				property: "og:site_name",
				content: SITE_TITLE
			},
			{
				property: "og:title",
				content: SITE_TITLE
			},
			{
				property: "og:description",
				content: SITE_DESCRIPTION
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:locale",
				content: "en_GH"
			},
			{
				property: "og:url",
				content: SITE_URL
			},
			{
				property: "og:image",
				content: OG_IMAGE_URL
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				property: "og:image:alt",
				content: SITE_TITLE
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: SITE_TITLE
			},
			{
				name: "twitter:description",
				content: SITE_DESCRIPTION
			},
			{
				name: "twitter:image",
				content: OG_IMAGE_URL
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en-GH",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('cl_theme_v1');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();` } }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 246,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(STRUCTURED_DATA) }
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 251,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 255,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 245,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 259,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 257,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 244,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorBoundary, {
			onReset: () => {
				router.invalidate();
			},
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CampusProvider, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OfflineBanner, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 278,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 279,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OnboardingPrompts, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 280,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, { position: "top-center" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 281,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 277,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 271,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 270,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$9 = () => import("./routes-CAz7qCq9.mjs");
var Route$9 = createFileRoute("/")({
	head: () => pageHead(SITE_TITLE, SITE_DESCRIPTION, { path: "/" }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin-CiEzSV1_.mjs");
var Route$8 = createFileRoute("/admin")({
	head: () => pageHead("Community admin console", "Manage CampusLoop listings, sellers, reports, universities, categories, and announcements.", {
		path: "/admin",
		noIndex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./auth-hksXGh37.mjs");
var Route$7 = createFileRoute("/auth")({
	head: () => pageHead("Seller Sign In & Registration", "Create a verified seller account to list products and offer campus services across Ghanaian universities on CampusLoop.", { path: "/auth" }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-DKMnIMMh.mjs");
var Route$6 = createFileRoute("/dashboard")({
	head: () => pageHead("Your seller dashboard", "Manage your campus listings and see interest in your products and services.", {
		path: "/dashboard",
		noIndex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./discover-ClaZU-5M.mjs");
var Route$5 = createFileRoute("/discover")({
	head: () => pageHead("Discover Campus Marketplace", "Explore verified student products, campus services, electronics, books, and hostel essentials across Ghanaian university campuses.", { path: "/discover" }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./manual-GPyYc77B.mjs");
var Route$4 = createFileRoute("/manual")({
	head: () => pageHead("Marketplace Guide & FAQs", "Learn how to buy without an account, verify your seller ID, stay safe at campus meetups, and install CampusLoop in Ghana.", { path: "/manual" }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./privacy-BJbSK0Me.mjs");
var Route$3 = createFileRoute("/privacy")({
	head: () => pageHead("Privacy Policy", "Learn how CampusLoop protects buyer privacy and seller verification records across Ghana's campus marketplace.", { path: "/privacy" }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./profile-B1F6YzwC.mjs");
var Route$2 = createFileRoute("/profile")({
	head: () => pageHead("Your campus profile", "Find your saved listings and manage your CampusLoop profile.", {
		path: "/profile",
		noIndex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./reset-password-RNfG4qaq.mjs");
var Route$1 = createFileRoute("/reset-password")({
	head: () => pageHead("Reset password", "Set a new password for your CampusLoop seller or service provider account.", {
		path: "/reset-password",
		noIndex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./terms-Cn7V6VMd.mjs");
var Route = createFileRoute("/terms")({
	head: () => pageHead("Marketplace Rules & Terms", "Community guidelines and safe campus meetup rules for buying and selling on CampusLoop Ghana.", { path: "/terms" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AdminRoute: Route$8.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$10
	}),
	AuthRoute: Route$7.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$10
	}),
	DashboardRoute: Route$6.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$10
	}),
	DiscoverRoute: Route$5.update({
		id: "/discover",
		path: "/discover",
		getParentRoute: () => Route$10
	}),
	ManualRoute: Route$4.update({
		id: "/manual",
		path: "/manual",
		getParentRoute: () => Route$10
	}),
	PostRoute: Route$13.update({
		id: "/post",
		path: "/post",
		getParentRoute: () => Route$10
	}),
	PrivacyRoute: Route$3.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$10
	}),
	ProductsRoute: Route$14.update({
		id: "/products",
		path: "/products",
		getParentRoute: () => Route$10
	}),
	ProfileRoute: Route$2.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$10
	}),
	ResetPasswordRoute: Route$1.update({
		id: "/reset-password",
		path: "/reset-password",
		getParentRoute: () => Route$10
	}),
	ServicesRoute: Route$15.update({
		id: "/services",
		path: "/services",
		getParentRoute: () => Route$10
	}),
	TermsRoute: Route.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$10
	}),
	ListingIdRoute: Route$11.update({
		id: "/listing/$id",
		path: "/listing/$id",
		getParentRoute: () => Route$10
	}),
	SellerIdRoute: Route$16.update({
		id: "/seller/$id",
		path: "/seller/$id",
		getParentRoute: () => Route$10
	}),
	ListingIdEditRoute: Route$12.update({
		id: "/listing/$id_/edit",
		path: "/listing/$id/edit",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 6e4,
		gcTime: 6e5,
		refetchOnWindowFocus: false,
		retry: 1
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadDelay: 40,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
