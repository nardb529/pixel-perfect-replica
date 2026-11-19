import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Ct as ArrowUpRight, G as Laptop, Tt as ArrowRight, mt as Camera, vt as BookOpen, x as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { I as useCampus, n as Button, t as BRAND } from "./store-3n-kyzhz.mjs";
import { C as useRouter, S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as ThemeToggle, n as BrandMark } from "./shared-CshecdmH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dfx0MLZK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function Welcome() {
	const { triggerBuyerInstallPrompt, user, authLoading } = useCampus();
	const navigate = useNavigate();
	const router = useRouter();
	const sellDestination = !authLoading && user ? user.role === "admin" ? "/admin" : "/post" : "/auth";
	(0, import_react.useEffect)(() => {
		router.preloadRoute({ to: "/discover" }).catch(() => void 0);
		router.preloadRoute({ to: "/auth" }).catch(() => void 0);
	}, [router]);
	function handleExplore() {
		triggerBuyerInstallPrompt();
		navigate({ to: "/discover" });
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "launch-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "launch-ambient",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "launch-orb launch-orb-one" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "launch-orb launch-orb-two" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 34,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "launch-orb launch-orb-three" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						className: "launch-ribbon",
						viewBox: "0 0 1200 500",
						fill: "none",
						preserveAspectRatio: "none",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
								d: "M-40 310 C 210 110, 440 430, 720 220 C 930 60, 1080 280, 1260 170",
								stroke: "currentColor",
								strokeWidth: "2.6",
								strokeLinecap: "round"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 37,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
								d: "M-40 380 C 240 210, 510 490, 810 280 C 1020 130, 1120 330, 1260 250",
								stroke: "currentColor",
								strokeWidth: "1.75",
								strokeDasharray: "10 10",
								strokeLinecap: "round"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 38,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
								d: "M-40 185 C 220 320, 480 40, 760 210 C 960 330, 1110 120, 1260 195",
								stroke: "currentColor",
								strokeWidth: "1.4",
								strokeLinecap: "round",
								opacity: "0.48"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 39,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 36,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "launch-topbar",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 44,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 43,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "launch-stage",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "launch-orbital",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-tile launch-tile-icon launch-tile-a",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, {
								size: 36,
								strokeWidth: 1.7
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 50,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-tile launch-tile-icon launch-tile-b",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, {
								size: 36,
								strokeWidth: 1.7
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 53,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-tile launch-tile-icon launch-tile-c",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, {
								size: 36,
								strokeWidth: 1.7
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 56,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-tile launch-tile-icon launch-tile-d",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Laptop, {
								size: 36,
								strokeWidth: 1.7
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "launch-center-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-emblem",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandMark, {
								size: 64,
								animated: true
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 65,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "launch-wordmark",
							children: [BRAND, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "launch-tagline",
							children: "Ghana’s university campus marketplace."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 63,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 47,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "launch-dock",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "lg",
						className: "launch-primary",
						onClick: handleExplore,
						children: ["Explore Marketplace", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 18 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "lg",
						className: "launch-secondary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: sellDestination,
							children: ["Sell or Offer a Service", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 17 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "launch-hint-pill",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Buyers need no account — browse & contact sellers free" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 87,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 86,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 75,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 31,
		columnNumber: 10
	}, this);
}
//#endregion
export { Welcome as component };
