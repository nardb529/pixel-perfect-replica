import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Ct as ArrowUpRight, G as Laptop, Tt as ArrowRight, mt as Camera, vt as BookOpen, x as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { N as useCampus, n as Button, t as BRAND } from "./store-BHsliIVM.mjs";
import { C as useRouter, S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as ThemeToggle, n as BrandMark } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CAz7qCq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function Welcome() {
	const { triggerBuyerInstallPrompt } = useCampus();
	const navigate = useNavigate();
	const router = useRouter();
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
						lineNumber: 30,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "launch-orb launch-orb-two" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "launch-orb launch-orb-three" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 32,
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
								lineNumber: 34,
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
								lineNumber: 35,
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
								lineNumber: 36,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "launch-topbar",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 41,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 40,
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
								lineNumber: 47,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 46,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "launch-tile launch-tile-icon launch-tile-b",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookOpen, {
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
							className: "launch-tile launch-tile-icon launch-tile-c",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, {
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
							className: "launch-tile launch-tile-icon launch-tile-d",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Laptop, {
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
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 45,
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
								lineNumber: 62,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 61,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "launch-wordmark",
							children: [BRAND, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 66,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "launch-tagline",
							children: "Ghana’s University Campus Marketplace"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 max-w-xs text-center text-xs leading-relaxed text-muted-foreground",
							children: "Buy, sell & book student products and campus services across KNUST, UG, UCC, Central University & more."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 44,
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
							lineNumber: 79,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "lg",
						className: "launch-secondary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/auth",
							children: ["Sell or Offer a Service", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { size: 17 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 84,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "launch-hint-pill",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Browse freely without an account" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 76,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 28,
		columnNumber: 10
	}, this);
}
//#endregion
export { Welcome as component };
