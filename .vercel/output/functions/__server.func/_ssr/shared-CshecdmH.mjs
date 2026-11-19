import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Ct as ArrowUpRight, Et as ArrowLeft, F as Moon, I as MessageCircle, J as Heart, M as Plus, N as Phone, O as Search, S as Shield, St as BadgeCheck, Tt as ArrowRight, W as LayoutDashboard, X as Globe, Y as GraduationCap, a as UserRound, ft as ChevronDown, gt as Bookmark, ht as Briefcase, n as X, nt as ExternalLink, ot as Copy, p as Sun, pt as Check, st as Compass, x as ShoppingBag, z as MapPin } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as isSafeMediaUrl, I as useCampus, a as DialogContent, f as buildPhoneHref, g as cn, i as Dialog, n as Button, o as DialogDescription, p as buildWhatsAppUrl, s as DialogTitle, t as BRAND, y as formatListingPrice } from "./store-3n-kyzhz.mjs";
import { C as useRouter, S as useNavigate, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-CshecdmH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/popover.tsx";
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 6, collisionPadding = 12, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent$1, {
	ref,
	align,
	sideOffset,
	collisionPadding,
	className: cn("z-[90] pointer-events-auto w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 17,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 16,
	columnNumber: 3
}, void 0));
PopoverContent.displayName = PopoverContent$1.displayName;
var _jsxFileName = "/app/applet/src/components/campus/shared.tsx";
function BrandMark({ size = 34, animated = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 64 64",
		fill: "none",
		className: animated ? "brand-mark-animated" : void 0,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
				width: "64",
				height: "64",
				rx: "16",
				fill: "currentColor"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				className: "brand-loop-stroke",
				d: "M22.5 41.5C17.25 41.5 13 37.25 13 32C13 26.75 17.25 22.5 22.5 22.5C27.2 22.5 30.2 25.9 32 32C33.8 38.1 36.8 41.5 41.5 41.5C46.75 41.5 51 37.25 51 32C51 26.75 46.75 22.5 41.5 22.5C37.9 22.5 35.3 24.5 33.7 28",
				stroke: "#FFFFFF",
				strokeWidth: "5.2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
				className: "brand-loop-node",
				cx: "41.5",
				cy: "32",
				r: "2.8",
				fill: "#FFFFFF"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 71,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 54,
		columnNumber: 5
	}, this);
}
function HeroAmbient() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "hero-ambient",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "hero-orb hero-orb-a" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 79,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "hero-orb hero-orb-b" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "hero-orb hero-orb-c" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
				className: "panel-curve-line hero-wave-svg",
				viewBox: "0 0 720 140",
				fill: "none",
				preserveAspectRatio: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
						className: "wave-primary",
						d: "M0 96 C 140 24, 300 132, 480 56 C 580 14, 655 34, 720 62",
						stroke: "currentColor",
						strokeWidth: "2.4",
						strokeLinecap: "round"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
						className: "wave-secondary",
						d: "M0 54 C 165 118, 340 16, 520 88 C 605 120, 670 84, 720 44",
						stroke: "currentColor",
						strokeWidth: "1.6",
						strokeLinecap: "round"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
						className: "wave-shimmer",
						d: "M0 118 C 190 76, 360 128, 545 48 C 625 14, 682 28, 720 46",
						stroke: "currentColor",
						strokeWidth: "1.8",
						strokeLinecap: "round"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 78,
		columnNumber: 5
	}, this);
}
function AnimatedSelect({ options, value, defaultValue, onValueChange, name, placeholder = "Choose option", ariaLabel, icon, kicker, variant = "field", align = "start", className = "" }) {
	const normalized = options.map((opt) => typeof opt === "string" ? {
		value: opt,
		label: opt
	} : opt);
	const isControlled = value !== void 0;
	const [internalValue, setInternalValue] = (0, import_react.useState)(defaultValue ?? normalized[0]?.value ?? "");
	const [open, setOpen] = (0, import_react.useState)(false);
	const currentValue = isControlled ? value : internalValue;
	const selectedOption = normalized.find((o) => o.value === currentValue);
	const displayLabel = selectedOption?.label || currentValue || placeholder;
	function choose(next) {
		if (!isControlled) setInternalValue(next);
		onValueChange?.(next);
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [name && /* @__PURE__ */ (void 0)("input", {
		type: "hidden",
		name,
		value: currentValue
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 171,
		columnNumber: 16
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				className: `ui-dropdown-trigger variant-${variant} ${className}`,
				"data-open": open,
				"data-tone": selectedOption?.tone,
				"aria-label": ariaLabel || placeholder,
				"aria-expanded": open,
				children: [
					icon && /* @__PURE__ */ (void 0)("span", {
						className: "ui-dropdown-lead-icon",
						"aria-hidden": "true",
						children: icon
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 183,
						columnNumber: 15
					}, this),
					selectedOption?.tone && /* @__PURE__ */ (void 0)("span", {
						className: `ui-dropdown-tone-dot tone-${selectedOption.tone}`,
						"aria-hidden": "true"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "ui-dropdown-label",
						children: displayLabel
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 193,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, {
						size: 14,
						className: "ui-dropdown-chevron",
						"aria-hidden": "true"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 194,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 174,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 173,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent, {
			align,
			sideOffset: 8,
			className: `ui-dropdown-panel variant-${variant}`,
			"aria-label": ariaLabel || kicker || "Options",
			children: [kicker && /* @__PURE__ */ (void 0)("span", {
				className: "ui-dropdown-kicker",
				children: kicker
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 203,
				columnNumber: 22
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "ui-dropdown-list",
				role: "listbox",
				"aria-label": ariaLabel || kicker,
				children: normalized.map((opt, idx) => {
					const active = opt.value === currentValue;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						role: "option",
						"aria-selected": active,
						style: { "--opt-index": idx },
						className: `ui-dropdown-option ${active ? "active" : ""}`,
						onClick: () => choose(opt.value),
						children: [
							opt.tone && /* @__PURE__ */ (void 0)("span", {
								className: `ui-dropdown-tone-dot tone-${opt.tone}`,
								"aria-hidden": "true"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "ui-dropdown-option-text",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: opt.label }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 221,
									columnNumber: 21
								}, this), opt.description && /* @__PURE__ */ (void 0)("small", { children: opt.description }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 222,
									columnNumber: 41
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 220,
								columnNumber: 19
							}, this),
							active && /* @__PURE__ */ (void 0)("span", {
								className: "ui-dropdown-check",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (void 0)(Check, {
									size: 12,
									strokeWidth: 2.7
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 226,
									columnNumber: 23
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 225,
								columnNumber: 21
							}, this)
						]
					}, opt.value, true, {
						fileName: _jsxFileName,
						lineNumber: 208,
						columnNumber: 17
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 204,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 197,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 172,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 170,
		columnNumber: 5
	}, this);
}
function Logo({ light = false }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const router = useRouter();
	function handleLogoClick(e) {
		if (path === "/discover") {
			e.preventDefault();
			if (typeof window !== "undefined") {
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				window.dispatchEvent(new CustomEvent("campusloop:discover-refresh"));
			}
			router.invalidate();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
		to: "/discover",
		onClick: handleLogoClick,
		className: `brand ${light ? "brand-light" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "brand-symbol",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandMark, { size: 34 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 261,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 260,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [BRAND, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "brand-dot",
			children: "."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 265,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 263,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 255,
		columnNumber: 5
	}, this);
}
function ThemeToggle({ compact = false }) {
	const { theme, toggleTheme } = useCampus();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		type: "button",
		onClick: toggleTheme,
		className: `theme-toggle-btn ${compact ? "compact" : ""}`,
		"aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
		title: isDark ? "Light mode" : "Dark mode",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "theme-toggle-icon",
			children: isDark ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sun, { size: 17 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 283,
				columnNumber: 53
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Moon, { size: 17 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 283,
				columnNumber: 73
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 283,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 276,
		columnNumber: 5
	}, this);
}
function UniversitySelect({ compact = false }) {
	const { university, setUniversity, myUniversity, universityNames } = useCampus();
	const [open, setOpen] = (0, import_react.useState)(false);
	const label = university === "All Universities" ? "All Campuses" : university;
	function choose(value) {
		setUniversity(value);
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				className: `university-select-trigger ${compact ? "compact" : ""}`,
				"data-open": open,
				"aria-label": "Choose campus location",
				"aria-expanded": open,
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uni-pin-orb",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, {
							size: 13,
							strokeWidth: 2.25
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 310,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 309,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uni-trigger-label",
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 312,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, {
						size: 13,
						className: "uni-trigger-chevron",
						"aria-hidden": "true"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 313,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 302,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 301,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent, {
			align: "end",
			sideOffset: 10,
			className: "university-popover-panel",
			"aria-label": "Campus locations",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "uni-pop-section",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uni-pop-kicker",
						children: "My Campus"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 323,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						className: `uni-option-btn ${university === myUniversity ? "active" : ""}`,
						onClick: () => choose(myUniversity),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "uni-option-icon",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 330,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 329,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "uni-option-text",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: myUniversity }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 333,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Home university" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 334,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 332,
								columnNumber: 13
							}, this),
							university === myUniversity && /* @__PURE__ */ (void 0)("span", {
								className: "uni-option-check",
								children: /* @__PURE__ */ (void 0)(Check, {
									size: 13,
									strokeWidth: 2.6
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 338,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 337,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 324,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 322,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "uni-pop-section",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uni-pop-kicker",
						children: "Browse Scope"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 345,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						className: `uni-option-btn ${university === "All Universities" ? "active" : ""}`,
						onClick: () => choose("All Universities"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "uni-option-icon globe",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { size: 15 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 352,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 351,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "uni-option-text",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "All Universities" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 355,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Every campus in Ghana" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 356,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 354,
								columnNumber: 13
							}, this),
							university === "All Universities" && /* @__PURE__ */ (void 0)("span", {
								className: "uni-option-check",
								children: /* @__PURE__ */ (void 0)(Check, {
									size: 13,
									strokeWidth: 2.6
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 360,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 359,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 346,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 344,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "uni-pop-section",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "uni-pop-kicker",
						children: "Switch Campus"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 367,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "uni-pop-list",
						children: universityNames.filter((u) => u !== myUniversity).map((u) => {
							const isSelected = university === u;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: `uni-option-pill ${isSelected ? "active" : ""}`,
								onClick: () => choose(u),
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { size: 12 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 380,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: u }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 381,
										columnNumber: 21
									}, this),
									isSelected && /* @__PURE__ */ (void 0)(Check, {
										size: 12,
										strokeWidth: 2.6
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 382,
										columnNumber: 36
									}, this)
								]
							}, u, true, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 19
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 368,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 366,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 316,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 300,
		columnNumber: 5
	}, this);
}
function Shell({ children }) {
	const { user, saved } = useCampus();
	const navigate = useNavigate();
	const router = useRouter();
	const path = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || typeof router.preloadRoute !== "function") return;
		const warmRoutes = () => {
			const targets = [
				"/discover",
				"/products",
				"/services",
				"/profile",
				...user ? ["/dashboard"] : []
			];
			for (const to of targets) if (to !== path) router.preloadRoute({ to }).catch(() => void 0);
		};
		const w = window;
		if (w.requestIdleCallback) {
			const id = w.requestIdleCallback(warmRoutes, { timeout: 600 });
			return () => w.cancelIdleCallback?.(id);
		}
		const t = window.setTimeout(warmRoutes, 150);
		return () => window.clearTimeout(t);
	}, [
		path,
		router,
		user
	]);
	const nav = [
		{
			to: "/discover",
			label: "Discover",
			icon: Compass
		},
		{
			to: "/products",
			label: "Products",
			icon: ShoppingBag
		},
		{
			to: "/services",
			label: "Services",
			icon: Briefcase
		}
	];
	const leftDock = [{
		to: "/discover",
		label: "Discover",
		icon: Compass
	}, {
		to: "/products",
		label: "Products",
		icon: ShoppingBag
	}];
	const rightDock = [{
		to: "/services",
		label: "Services",
		icon: Briefcase
	}, {
		to: "/profile",
		label: "Profile",
		icon: UserRound
	}];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "app-header-wrap",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "app-header",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "header-inner",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Logo, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 448,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
								className: "desktop-nav",
								"aria-label": "Main navigation",
								children: [
									nav.map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: n.to,
										className: path === n.to ? "nav-link active" : "nav-link",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(n.icon, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 457,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: n.label }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 458,
											columnNumber: 19
										}, this)]
									}, n.to, true, {
										fileName: _jsxFileName,
										lineNumber: 452,
										columnNumber: 17
									}, this)),
									user && /* @__PURE__ */ (void 0)(Link, {
										to: "/dashboard",
										className: path === "/dashboard" ? "nav-link active" : "nav-link",
										children: [/* @__PURE__ */ (void 0)(LayoutDashboard, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 466,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Dashboard" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 467,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 462,
										columnNumber: 17
									}, this),
									user?.role === "admin" && /* @__PURE__ */ (void 0)(Link, {
										to: "/admin",
										className: path === "/admin" ? "nav-link active" : "nav-link",
										children: [/* @__PURE__ */ (void 0)(Shield, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 472,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", { children: "Admin" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 473,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 471,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 450,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "header-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UniversitySelect, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 479,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, { compact: true }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 480,
										columnNumber: 15
									}, this),
									user?.role === "admin" && /* @__PURE__ */ (void 0)(Link, {
										to: "/admin",
										className: "header-icon-btn header-admin-btn",
										title: "Admin Command Center",
										"aria-label": "Admin Command Center",
										children: /* @__PURE__ */ (void 0)(Shield, { size: 16 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 488,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 482,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										className: "desktop-post",
										onClick: () => navigate({ to: user ? "/post" : "/auth" }),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 495,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Post" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 496,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 491,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/profile",
										className: "header-icon-btn header-profile-btn",
										title: saved.length > 0 ? `Profile · ${saved.length} saved` : "Your profile",
										"aria-label": "Your profile",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserRound, { size: 17 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 504,
											columnNumber: 17
										}, this), saved.length > 0 && /* @__PURE__ */ (void 0)("span", {
											className: "save-count",
											children: saved.length
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 38
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 498,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 478,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 447,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 446,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 445,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "market-main",
				children
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 512,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "market-footer-wrap",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "market-footer surface-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Logo, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 516,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "footer-links",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/manual",
									children: "User Manual"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 518,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/privacy",
									children: "Privacy"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 519,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/terms",
									children: "Terms"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 517,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "footer-copy",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" ",
								BRAND,
								" · Ghana Campus Marketplace"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 522,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 515,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 514,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "floating-bottom-nav",
				"aria-label": "Mobile navigation",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "floating-dock-inner",
					children: [
						leftDock.map((n) => {
							const active = path === n.to;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: n.to,
								className: active ? "dock-item active" : "dock-item",
								"aria-label": n.label,
								title: n.label,
								"aria-current": active ? "page" : void 0,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "dock-icon-wrap",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(n.icon, {
										size: 23,
										strokeWidth: active ? 2.85 : 2.35
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 542,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 541,
									columnNumber: 17
								}, this), active && /* @__PURE__ */ (void 0)("span", {
									className: "dock-active-dot",
									"aria-hidden": "true"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 544,
									columnNumber: 28
								}, this)]
							}, n.to, true, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 15
							}, this);
						}),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "dock-post",
							onClick: () => navigate({ to: user ? "/post" : "/auth" }),
							"aria-label": "Post a listing",
							title: "Post a listing",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "dock-post-orb",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, {
									size: 26,
									strokeWidth: 2.9
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 557,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 556,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 549,
							columnNumber: 11
						}, this),
						rightDock.map((n) => {
							const active = path === n.to;
							const showSavedDot = n.to === "/profile" && saved.length > 0;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: n.to,
								className: active ? "dock-item active" : "dock-item",
								"aria-label": n.label,
								title: n.label,
								"aria-current": active ? "page" : void 0,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "dock-icon-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(n.icon, {
										size: 23,
										strokeWidth: active ? 2.85 : 2.35
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 574,
										columnNumber: 19
									}, this), showSavedDot && /* @__PURE__ */ (void 0)("span", {
										className: "dock-badge",
										"aria-hidden": "true"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 575,
										columnNumber: 36
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 17
								}, this), active && /* @__PURE__ */ (void 0)("span", {
									className: "dock-active-dot",
									"aria-hidden": "true"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 577,
									columnNumber: 28
								}, this)]
							}, n.to, true, {
								fileName: _jsxFileName,
								lineNumber: 565,
								columnNumber: 15
							}, this);
						})
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 529,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 528,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 444,
		columnNumber: 5
	}, this);
}
function PageBackButton({ fallbackTo = "/discover", label = "Back", className = "" }) {
	const navigate = useNavigate();
	const router = useRouter();
	function handleBack() {
		if (typeof window !== "undefined" && window.history.length > 1) {
			const historyApi = router.history;
			if (typeof historyApi?.back === "function") {
				historyApi.back();
				return;
			}
			window.history.back();
			return;
		}
		navigate({ to: fallbackTo });
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		type: "button",
		onClick: handleBack,
		className: `page-back-btn ${className}`.trim(),
		"aria-label": label,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, {
			size: 16,
			strokeWidth: 2.25,
			"aria-hidden": "true"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 619,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: label }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 620,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 613,
		columnNumber: 5
	}, this);
}
function ListingCard({ listing, compact = false }) {
	const { saved, toggleSave, recordContact } = useCampus();
	const [imgFailed, setImgFailed] = (0, import_react.useState)(false);
	const [quickOpen, setQuickOpen] = (0, import_react.useState)(false);
	const isSaved = saved.includes(listing.id);
	const hasPrice = listing.type === "product" || listing.price > 0;
	const isService = listing.type === "service";
	const metaTag = isService ? "Service" : listing.condition === "New" ? "New" : listing.condition;
	const enquiryText = `Hi ${listing.seller}, I saw “${listing.title}” on CampusLoop. Is it still available?`;
	const whatsappUrl = buildWhatsAppUrl(listing.contact, enquiryText);
	const phoneHref = buildPhoneHref(listing.contact);
	const safeImage = isSafeMediaUrl(listing.image) ? listing.image : "";
	function handleQuickAction() {
		recordContact(listing.id, listing.contactMethod || "WhatsApp");
		setQuickOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
		className: `listing-card ${compact ? "compact" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "listing-image",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/listing/$id",
				params: { id: listing.id },
				"aria-label": `View ${listing.title}`,
				children: !imgFailed && safeImage ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: safeImage,
					alt: listing.title,
					loading: "lazy",
					decoding: "async",
					referrerPolicy: "no-referrer",
					width: 1024,
					height: 1024,
					onError: () => setImgFailed(true)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 650,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "listing-image-fallback",
					children: [isService ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Briefcase, { size: 24 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 662,
						columnNumber: 30
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { size: 24 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 662,
						columnNumber: 56
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.category }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 663,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 661,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 648,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				type: "button",
				className: `save-button ${isSaved ? "saved" : ""}`,
				onClick: () => toggleSave(listing.id),
				"aria-label": `${isSaved ? "Unsave" : "Save"} ${listing.title}`,
				title: "Save listing",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bookmark, {
					size: 15,
					fill: isSaved ? "currentColor" : "none"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 674,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 667,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 647,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "listing-info",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "listing-meta-top",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "listing-category",
						children: listing.category
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 679,
						columnNumber: 13
					}, this), metaTag && /* @__PURE__ */ (void 0)("span", {
						className: "listing-kind",
						children: ["· ", metaTag]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 680,
						columnNumber: 25
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 678,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/listing/$id",
					params: { id: listing.id },
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: listing.title }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 683,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 682,
					columnNumber: 11
				}, this),
				isService && /* @__PURE__ */ (void 0)("p", {
					className: "listing-desc",
					children: listing.description
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 685,
					columnNumber: 25
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `listing-price ${!hasPrice ? "on-request" : ""}`,
					children: [
						isService && hasPrice && listing.priceType !== "Free" && /* @__PURE__ */ (void 0)("small", { children: "From " }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 687,
							columnNumber: 71
						}, this),
						formatListingPrice(listing),
						isService && /* @__PURE__ */ (void 0)(ArrowUpRight, { size: 15 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 689,
							columnNumber: 27
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 686,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "listing-location",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { size: 12 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 692,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.audience.includes("All Universities") ? "All Universities" : listing.audience.length > 1 ? `${listing.audience.length} Campuses` : listing.university }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 693,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 691,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "listing-byline",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/seller/$id",
						params: { id: listing.sellerId || listing.id },
						className: "listing-seller-link inline-flex items-center gap-1",
						"aria-label": `Visit ${listing.seller}'s shop`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.seller }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 708,
							columnNumber: 15
						}, this), listing.verificationStatus === "verified" && /* @__PURE__ */ (void 0)(BadgeCheck, {
							size: 12,
							"aria-label": "Verified seller",
							className: "text-primary"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 710,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 702,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.time }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 713,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 701,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: `listing-cta-btn ${isService ? "is-service" : "is-product"}`,
					onClick: handleQuickAction,
					children: isService ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, {
						size: 13,
						strokeWidth: 2.2
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 722,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Contact" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 723,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 721,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, {
						size: 13,
						strokeWidth: 2.2
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 727,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Get now" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 728,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 726,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 715,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 677,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 646,
		columnNumber: 7
	}, this), quickOpen && /* @__PURE__ */ (void 0)(Dialog, {
		open: quickOpen,
		onOpenChange: setQuickOpen,
		children: /* @__PURE__ */ (void 0)(DialogContent, {
			className: "mobile-dialog onboarding-dialog",
			children: [
				/* @__PURE__ */ (void 0)(DialogTitle, { children: isService ? `Contact ${listing.seller}` : `Get ${listing.title}` }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 738,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (void 0)(DialogDescription, { children: isService ? "Reach out directly on campus to discuss availability and booking." : "Connect directly with the seller to inspect and pick up on campus." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 741,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (void 0)("div", {
					className: "modal-body",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "quick-listing-preview",
							children: [!imgFailed && safeImage ? /* @__PURE__ */ (void 0)("img", {
								src: safeImage,
								alt: listing.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 749,
								columnNumber: 19
							}, this) : /* @__PURE__ */ (void 0)("span", {
								className: "quick-listing-thumb-fallback",
								children: isService ? /* @__PURE__ */ (void 0)(Briefcase, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 752,
									columnNumber: 34
								}, this) : /* @__PURE__ */ (void 0)(ShoppingBag, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 752,
									columnNumber: 60
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 751,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "quick-listing-meta",
								children: [
									/* @__PURE__ */ (void 0)("small", { children: [
										listing.category,
										" · ",
										listing.university
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 756,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("strong", { children: listing.title }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 759,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("span", { children: formatListingPrice(listing) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 760,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 755,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 747,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "contact-method",
							children: [
								/* @__PURE__ */ (void 0)(MessageCircle, { size: 20 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 765,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: listing.contactMethod || "WhatsApp" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 767,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("small", { children: listing.contact || "Contact available via seller" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 768,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 766,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(Check, {
									className: "ml-auto",
									size: 16
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 770,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 764,
							columnNumber: 15
						}, this),
						phoneHref && /* @__PURE__ */ (void 0)("a", {
							href: phoneHref,
							className: "contact-method",
							children: [
								/* @__PURE__ */ (void 0)(Phone, { size: 20 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 775,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Call directly" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 777,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("small", { children: listing.contact }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 778,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 776,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(ExternalLink, {
									className: "ml-auto",
									size: 15
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 780,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 774,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "modal-actions",
							children: [
								whatsappUrl ? /* @__PURE__ */ (void 0)(Button, {
									asChild: true,
									className: "onboarding-cta",
									children: /* @__PURE__ */ (void 0)("a", {
										href: whatsappUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										onClick: () => {
											toast.success(`Opening WhatsApp chat with ${listing.seller}`);
											setQuickOpen(false);
										},
										children: [/* @__PURE__ */ (void 0)(ExternalLink, { size: 16 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 796,
											columnNumber: 23
										}, this), "Message on WhatsApp"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 787,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 786,
									columnNumber: 19
								}, this) : /* @__PURE__ */ (void 0)(Button, {
									className: "onboarding-cta",
									onClick: async () => {
										try {
											await navigator.clipboard.writeText(enquiryText);
											toast.success("Enquiry copied — reach out via seller contact");
										} catch {
											toast.error("Copy failed — reach out using the contact details above");
										}
										setQuickOpen(false);
									},
									children: [/* @__PURE__ */ (void 0)(ExternalLink, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 813,
										columnNumber: 21
									}, this), "Message on WhatsApp"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 801,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									className: "rounded-full",
									onClick: async () => {
										try {
											await navigator.clipboard.writeText(enquiryText);
											toast.success("Enquiry message copied");
										} catch {
											toast.error("Could not copy message automatically");
										}
									},
									children: [/* @__PURE__ */ (void 0)(Copy, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 829,
										columnNumber: 19
									}, this), "Copy enquiry message"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 817,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									className: "onboarding-skip",
									asChild: true,
									onClick: () => setQuickOpen(false),
									children: /* @__PURE__ */ (void 0)(Link, {
										to: "/listing/$id",
										params: { id: listing.id },
										children: ["View full listing details", /* @__PURE__ */ (void 0)(ArrowRight, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 840,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 838,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 832,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 784,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 746,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 737,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 736,
		columnNumber: 9
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 645,
		columnNumber: 5
	}, this);
}
function SearchBar({ value, onChange, placeholder = "Search products, services, sellers...", suggestions = [], onSelectSuggestion }) {
	const [focused, setFocused] = (0, import_react.useState)(false);
	const blurTimerRef = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		return () => {
			if (blurTimerRef.current !== void 0) window.clearTimeout(blurTimerRef.current);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative z-10",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "search-bar",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, {
					size: 18,
					"aria-hidden": "true"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 879,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					"aria-label": "Search marketplace",
					placeholder,
					value,
					onFocus: () => {
						if (blurTimerRef.current !== void 0) window.clearTimeout(blurTimerRef.current);
						setFocused(true);
					},
					onBlur: () => {
						blurTimerRef.current = window.setTimeout(() => setFocused(false), 140);
					},
					onChange: (e) => onChange(e.target.value)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 880,
					columnNumber: 9
				}, this),
				value && /* @__PURE__ */ (void 0)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Clear search",
					onClick: () => onChange(""),
					children: /* @__PURE__ */ (void 0)(X, { size: 17 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 902,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 896,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 878,
			columnNumber: 7
		}, this), focused && value.trim().length >= 2 && suggestions.length > 0 && /* @__PURE__ */ (void 0)("div", {
			className: "surface-panel mt-2 p-2 flex flex-col gap-1",
			role: "listbox",
			"aria-label": "Search suggestions",
			children: suggestions.map((s) => /* @__PURE__ */ (void 0)("button", {
				type: "button",
				role: "option",
				"aria-selected": false,
				className: "ui-dropdown-option",
				onMouseDown: (e) => {
					e.preventDefault();
					if (onSelectSuggestion) onSelectSuggestion(s);
					else onChange(s.title);
					setFocused(false);
				},
				children: [/* @__PURE__ */ (void 0)("span", {
					className: "ui-dropdown-option-text",
					children: [/* @__PURE__ */ (void 0)("strong", { children: s.title }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 930,
						columnNumber: 17
					}, this), /* @__PURE__ */ (void 0)("small", { children: s.type === "service" ? "Service" : "Product" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 931,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 929,
					columnNumber: 15
				}, this), /* @__PURE__ */ (void 0)(ArrowUpRight, { size: 14 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 933,
					columnNumber: 15
				}, this)]
			}, s.id, true, {
				fileName: _jsxFileName,
				lineNumber: 913,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 907,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 877,
		columnNumber: 5
	}, this);
}
function SectionTitle({ eyebrow, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "section-title",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [eyebrow && /* @__PURE__ */ (void 0)("span", {
			className: "section-kicker",
			children: eyebrow
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 954,
			columnNumber: 21
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { children: title }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 955,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 953,
			columnNumber: 7
		}, this), children]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 952,
		columnNumber: 5
	}, this);
}
function Empty({ title = "No matches found", text = "Try another campus, category or search.", children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "empty-state surface-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "empty-orb",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { size: 24 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 974,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 973,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: title }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 976,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: text }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 977,
				columnNumber: 7
			}, this),
			children
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 972,
		columnNumber: 5
	}, this);
}
function BrowseLink({ service = false }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
		className: "text-link",
		to: service ? "/services" : "/products",
		children: ["See all ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 15 }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 986,
			columnNumber: 15
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 985,
		columnNumber: 5
	}, this);
}
function PageIntro({ eyebrow, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "page-intro",
		children: [
			eyebrow && /* @__PURE__ */ (void 0)("span", {
				className: "section-kicker",
				children: eyebrow
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1002,
				columnNumber: 19
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: title }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1003,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: text }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1004,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1001,
		columnNumber: 5
	}, this);
}
function Likes({ id }) {
	const { liked, toggleLike } = useCampus();
	const isLiked = liked.includes(id);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
		variant: "outline",
		onClick: () => toggleLike(id),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, {
			size: 16,
			fill: isLiked ? "currentColor" : "none"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1014,
			columnNumber: 7
		}, this), isLiked ? "Liked" : "Like"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1013,
		columnNumber: 5
	}, this);
}
function SaveButton({ id }) {
	const { saved, toggleSave } = useCampus();
	const isSaved = saved.includes(id);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
		variant: isSaved ? "secondary" : "outline",
		onClick: () => toggleSave(id),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bookmark, {
			size: 16,
			fill: isSaved ? "currentColor" : "none"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1025,
			columnNumber: 7
		}, this), isSaved ? "Saved" : "Save"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1024,
		columnNumber: 5
	}, this);
}
function PagePendingFallback() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel hero-panel curve-accent route-skeleton-hero",
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1038,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-bar w-28 h-3" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1039,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-bar w-64 h-7 mt-3" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1040,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-bar w-full h-12 mt-4 rounded-full" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1041,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1034,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel section-panel",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "listing-grid",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-card" }, i, false, {
				fileName: _jsxFileName,
				lineNumber: 1046,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1044,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1043,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1033,
		columnNumber: 5
	}, this);
}
//#endregion
export { HeroAmbient as a, Logo as c, PagePendingFallback as d, SaveButton as f, ThemeToggle as g, Shell as h, Empty as i, PageBackButton as l, SectionTitle as m, BrandMark as n, Likes as o, SearchBar as p, BrowseLink as r, ListingCard as s, AnimatedSelect as t, PageIntro as u };
