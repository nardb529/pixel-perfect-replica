import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Tt as ArrowRight, U as LayoutGrid, Y as GraduationCap, at as Cpu, b as SlidersHorizontal, ct as Coffee, k as Scissors, mt as Camera, v as Sofa, wt as ArrowUpDown, x as ShoppingBag, y as Smartphone, z as MapPin } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { N as useCampus, T as listingService, _ as filterListings, n as Button } from "./store-BHsliIVM.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as HeroAmbient, f as SearchBar, i as Empty, l as PageIntro, m as Shell, p as SectionTitle, r as BrowseLink, s as ListingCard, t as AnimatedSelect } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discovery-DJlXN4qS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/discovery.tsx";
var shortcuts = [
	{
		name: "Electronics",
		icon: Smartphone,
		tone: "indigo"
	},
	{
		name: "Fashion",
		icon: ShoppingBag,
		tone: "violet"
	},
	{
		name: "Books & Academics",
		label: "Books",
		icon: GraduationCap,
		tone: "blue"
	},
	{
		name: "Food & Groceries",
		label: "Food",
		icon: Coffee,
		tone: "amber"
	},
	{
		name: "Hair & Beauty",
		label: "Beauty",
		icon: Scissors,
		tone: "rose"
	},
	{
		name: "Photography",
		label: "Photos",
		icon: Camera,
		tone: "cyan"
	},
	{
		name: "Hostel Essentials",
		label: "Hostel",
		icon: Sofa,
		tone: "emerald"
	},
	{
		name: "Technology & Repairs",
		label: "Repairs",
		icon: Cpu,
		tone: "slate"
	},
	{
		name: "All",
		label: "All items",
		icon: LayoutGrid,
		tone: "indigo"
	}
];
function DiscoverPage() {
	const { listings, listingsLoading, listingsError, refreshListings, university, setUniversity, universityNames, dbUniversities, backendConfigured, schemaReady } = useCampus();
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All");
	const [remoteSuggestions, setRemoteSuggestions] = (0, import_react.useState)([]);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		function handleDiscoverRefresh() {
			setQuery("");
			setCategory("All");
		}
		window.addEventListener("campusloop:discover-refresh", handleDiscoverRefresh);
		return () => window.removeEventListener("campusloop:discover-refresh", handleDiscoverRefresh);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!backendConfigured || !schemaReady || query.trim().length < 2) {
			setRemoteSuggestions([]);
			return;
		}
		let active = true;
		const timer = window.setTimeout(() => {
			listingService.getSearchSuggestions(query, 6).then((items) => {
				if (active) setRemoteSuggestions(items);
			}).catch(() => void 0);
		}, 300);
		return () => {
			active = false;
			window.clearTimeout(timer);
		};
	}, [
		backendConfigured,
		schemaReady,
		query
	]);
	const suggestions = (0, import_react.useMemo)(() => {
		if (backendConfigured && schemaReady && remoteSuggestions.length > 0) return remoteSuggestions;
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		return listings.filter((l) => l.status === "Active" && `${l.title} ${l.category}`.toLowerCase().includes(q)).slice(0, 5).map((l) => ({
			id: l.id,
			title: l.title,
			type: l.type
		}));
	}, [
		backendConfigured,
		schemaReady,
		remoteSuggestions,
		query,
		listings
	]);
	const results = (0, import_react.useMemo)(() => filterListings(listings, university, query, void 0, category), [
		listings,
		university,
		query,
		category
	]);
	const searching = Boolean(query.trim()) || category !== "All";
	const services = (0, import_react.useMemo)(() => filterListings(listings, university, "", "service").slice(0, 4), [listings, university]);
	const affordable = (0, import_react.useMemo)(() => filterListings(listings, university, "", void 0, "All", 100).slice(0, 4), [listings, university]);
	const featuredCampuses = (0, import_react.useMemo)(() => {
		if (dbUniversities.length > 0) return dbUniversities.filter((u) => u.is_active).slice(0, 4).map((u) => ({
			name: u.short_name || u.university_name,
			location: u.location || "Ghana"
		}));
		return universityNames.slice(0, 4).map((name, i) => ({
			name,
			location: [
				"Kumasi",
				"Legon, Accra",
				"Cape Coast",
				"Madina, Accra"
			][i] || "Ghana"
		}));
	}, [dbUniversities, universityNames]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel hero-panel curve-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "discover-heading",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "greeting",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "greeting-pulse",
							"aria-hidden": "true"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 15
						}, this), "Ghana University Campus Marketplace"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Buy, sell & book across campus" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 138,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "campus-scope-label",
						children: university
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 145,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SearchBar, {
					value: query,
					onChange: setQuery,
					suggestions,
					onSelectSuggestion: (s) => navigate({
						to: "/listing/$id",
						params: { id: s.id }
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 148,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "category-row",
					"aria-label": "Category shortcuts",
					children: shortcuts.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						className: `category-shortcut tone-${s.tone} ${category === s.name && s.name !== "All" ? "selected" : ""}`,
						onClick: () => {
							if (s.name === "All") {
								if (searching) {
									setQuery("");
									setCategory("All");
								} else navigate({ to: "/products" });
								return;
							}
							setCategory(s.name === category ? "All" : s.name);
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "category-icon-orb",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(s.icon, {
								size: 19,
								strokeWidth: 2
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: s.label || s.name }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 177,
							columnNumber: 15
						}, this)]
					}, s.name, true, {
						fileName: _jsxFileName,
						lineNumber: 157,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 155,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 134,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "surface-panel section-panel",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
				title: searching ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Just dropped",
				children: searching ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "link",
					onClick: () => {
						setQuery("");
						setCategory("All");
					},
					children: "Clear filters"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 192,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrowseLink, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 202,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 184,
				columnNumber: 9
			}, this), listingsLoading && results.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "listing-grid",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-card" }, i, false, {
					fileName: _jsxFileName,
					lineNumber: 209,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 207,
				columnNumber: 11
			}, this) : listingsError && results.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
				title: "Listings temporarily unavailable",
				text: listingsError,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => void refreshListings(),
					children: "Retry"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 214,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 213,
				columnNumber: 11
			}, this) : results.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: searching ? "listing-grid" : "listing-carousel",
				children: (searching ? results : results.slice(0, 4)).map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListingCard, { listing: l }, l.id, false, {
					fileName: _jsxFileName,
					lineNumber: 221,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 219,
				columnNumber: 11
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
				title: searching ? "No matching listings" : `No listings in ${university} yet`,
				text: searching ? "Try clearing your search or switching to All Universities." : "Be the first student or seller to post in this campus community.",
				children: searching ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => {
						setQuery("");
						setCategory("All");
					},
					children: ["Show all in ", university]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 234,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => setUniversity("All Universities"),
					children: "Browse All Universities"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 244,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 225,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 183,
			columnNumber: 7
		}, this),
		!searching && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
			/* @__PURE__ */ (void 0)("section", {
				className: "surface-panel section-panel",
				children: [/* @__PURE__ */ (void 0)(SectionTitle, {
					title: "Services on campus",
					children: /* @__PURE__ */ (void 0)(BrowseLink, { service: true }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 256,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 255,
					columnNumber: 13
				}, this), listingsLoading && services.length === 0 ? /* @__PURE__ */ (void 0)("div", {
					className: "listing-grid",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (void 0)("div", { className: "route-skeleton-card" }, i, false, {
						fileName: _jsxFileName,
						lineNumber: 261,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 259,
					columnNumber: 15
				}, this) : services.length ? /* @__PURE__ */ (void 0)("div", {
					className: "listing-carousel",
					children: services.map((l) => /* @__PURE__ */ (void 0)(ListingCard, { listing: l }, l.id, false, {
						fileName: _jsxFileName,
						lineNumber: 267,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 265,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (void 0)(Empty, {
					title: "No services listed yet",
					text: `Check back soon in ${university}.`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 271,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 254,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (void 0)("section", {
				className: "surface-panel section-panel",
				children: [/* @__PURE__ */ (void 0)(SectionTitle, {
					title: "Under GH₵ 100",
					children: /* @__PURE__ */ (void 0)(Link, {
						to: "/products",
						search: { maxPrice: "100" },
						className: "text-link",
						children: ["See all ", /* @__PURE__ */ (void 0)(ArrowRight, { size: 14 }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 278,
							columnNumber: 25
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 277,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 276,
					columnNumber: 13
				}, this), listingsLoading && affordable.length === 0 ? /* @__PURE__ */ (void 0)("div", {
					className: "listing-grid",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (void 0)("div", { className: "route-skeleton-card" }, i, false, {
						fileName: _jsxFileName,
						lineNumber: 284,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 282,
					columnNumber: 15
				}, this) : affordable.length ? /* @__PURE__ */ (void 0)("div", {
					className: "listing-carousel",
					children: affordable.map((l) => /* @__PURE__ */ (void 0)(ListingCard, { listing: l }, l.id, false, {
						fileName: _jsxFileName,
						lineNumber: 290,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 288,
					columnNumber: 15
				}, this) : /* @__PURE__ */ (void 0)(Empty, {
					title: "No items under GH₵ 100",
					text: "Try switching to All Universities."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 294,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 275,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ (void 0)("section", {
				className: "surface-panel section-panel",
				children: [/* @__PURE__ */ (void 0)(SectionTitle, { title: "Explore campuses" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 299,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "campus-grid",
					children: featuredCampuses.map((u) => /* @__PURE__ */ (void 0)("button", {
						type: "button",
						className: "campus-card",
						onClick: () => {
							setUniversity(u.name);
							navigate({ to: "/products" });
						},
						children: [
							/* @__PURE__ */ (void 0)("span", { children: /* @__PURE__ */ (void 0)(GraduationCap, { size: 19 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 21
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 311,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: u.name }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 315,
								columnNumber: 21
							}, this), /* @__PURE__ */ (void 0)("small", { children: u.location }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 316,
								columnNumber: 21
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 314,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (void 0)(ArrowRight, { size: 15 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 318,
								columnNumber: 19
							}, this)
						]
					}, u.name, true, {
						fileName: _jsxFileName,
						lineNumber: 302,
						columnNumber: 17
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 300,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 298,
				columnNumber: 11
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 253,
			columnNumber: 9
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 133,
		columnNumber: 5
	}, this);
}
var PAGE_SIZE = 12;
function BrowsePage({ type, initialCategory, initialMaxPrice, initialQuery }) {
	const { listings, university, setUniversity, universityNames, productCategoryNames, serviceCategoryNames, backendConfigured, schemaReady } = useCampus();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)(initialQuery || "");
	const [category, setCategory] = (0, import_react.useState)(initialCategory || "All");
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(initialMaxPrice || "any");
	const [sort, setSort] = (0, import_react.useState)("recent");
	const [dbResults, setDbResults] = (0, import_react.useState)([]);
	const [dbTotal, setDbTotal] = (0, import_react.useState)(0);
	const [dbLoading, setDbLoading] = (0, import_react.useState)(false);
	const [dbSearchFailed, setDbSearchFailed] = (0, import_react.useState)(false);
	const [offset, setOffset] = (0, import_react.useState)(0);
	const [localVisibleCount, setLocalVisibleCount] = (0, import_react.useState)(PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		if (initialCategory !== void 0) setCategory(initialCategory || "All");
	}, [initialCategory]);
	(0, import_react.useEffect)(() => {
		if (initialMaxPrice !== void 0) setMaxPrice(initialMaxPrice || "any");
	}, [initialMaxPrice]);
	(0, import_react.useEffect)(() => {
		if (initialQuery !== void 0) setQuery(initialQuery || "");
	}, [initialQuery]);
	const filterSignature = `${university}|${query}|${type}|${category}|${maxPrice}|${sort}`;
	const prevFilterSigRef = (0, import_react.useRef)(filterSignature);
	(0, import_react.useEffect)(() => {
		const filterChanged = prevFilterSigRef.current !== filterSignature;
		if (filterChanged) {
			prevFilterSigRef.current = filterSignature;
			setLocalVisibleCount(PAGE_SIZE);
			if (offset !== 0) {
				setOffset(0);
				return;
			}
		}
		if (!backendConfigured || !schemaReady) return;
		let active = true;
		setDbLoading(true);
		setDbSearchFailed(false);
		const effectiveOffset = filterChanged ? 0 : offset;
		const sortParam = sort === "low" ? "price_asc" : sort === "high" ? "price_desc" : sort === "popular" ? "popular" : query.trim() ? "relevant" : "recent";
		const timer = window.setTimeout(() => {
			listingService.searchListings({
				universityFilter: university === "All Universities" ? null : university,
				listingType: type,
				categoryFilter: category === "All" ? null : category,
				searchQuery: query.trim() || null,
				maxPrice: maxPrice === "any" ? null : Number(maxPrice),
				sort: sortParam,
				limit: PAGE_SIZE,
				offset: effectiveOffset
			}).then(({ items, totalCount }) => {
				if (!active) return;
				setDbResults((prev) => effectiveOffset === 0 ? items : [...prev, ...items]);
				setDbTotal(totalCount);
				setDbLoading(false);
			}).catch(() => {
				if (!active) return;
				setDbSearchFailed(true);
				setDbLoading(false);
			});
		}, 260);
		return () => {
			active = false;
			window.clearTimeout(timer);
		};
	}, [
		backendConfigured,
		schemaReady,
		university,
		query,
		type,
		category,
		maxPrice,
		sort,
		offset,
		filterSignature
	]);
	const localResults = (0, import_react.useMemo)(() => filterListings(listings, university, query, type, category, maxPrice === "any" ? Infinity : Number(maxPrice)).slice().sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "popular" ? b.views - a.views : (b.postedAt || 0) - (a.postedAt || 0)), [
		listings,
		university,
		query,
		type,
		category,
		maxPrice,
		sort
	]);
	const usingRemote = backendConfigured && schemaReady && !dbSearchFailed;
	const visibleResults = usingRemote ? dbResults : localResults.slice(0, localVisibleCount);
	const totalCount = usingRemote ? dbTotal : localResults.length;
	const hasMore = usingRemote ? dbResults.length < dbTotal : localVisibleCount < localResults.length;
	const service = type === "service";
	const categoryList = service ? serviceCategoryNames : productCategoryNames;
	const suggestions = (0, import_react.useMemo)(() => {
		if (query.trim().toLowerCase().length < 2) return [];
		return (usingRemote ? dbResults : localResults).slice(0, 5).map((l) => ({
			id: l.id,
			title: l.title,
			type: l.type
		}));
	}, [
		usingRemote,
		dbResults,
		localResults,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel hero-panel browse-panel curve-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroAmbient, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 492,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageIntro, {
				eyebrow: service ? "Service directory" : "Marketplace catalog",
				title: service ? "Campus services" : "Campus products",
				text: service ? "Photographers, designers, braiders, tutors and technicians around campus." : "Laptops, books, hostel essentials, food and everyday student finds."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 494,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SearchBar, {
				value: query,
				onChange: setQuery,
				suggestions,
				onSelectSuggestion: (s) => navigate({
					to: "/listing/$id",
					params: { id: s.id }
				}),
				placeholder: service ? "Search services or providers..." : "Search products or sellers..."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 504,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "filter-row",
				role: "tablist",
				"aria-label": "Categories",
				children: ["All", ...categoryList].map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "filter-chip",
					variant: c === category ? "default" : "outline",
					onClick: () => setCategory(c),
					children: c === "All" ? "All" : c
				}, c, false, {
					fileName: _jsxFileName,
					lineNumber: 516,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 514,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "filter-toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "filter-count",
					children: [
						totalCount,
						" ",
						service ? "services" : "products"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 528,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "filter-controls",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
							variant: "filter",
							ariaLabel: "Filter by university",
							kicker: "Campus filter",
							icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { size: 13 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 536,
								columnNumber: 21
							}, this),
							value: university,
							onValueChange: setUniversity,
							options: [{
								value: "All Universities",
								label: "All Universities",
								description: "Every campus"
							}, ...universityNames.map((u) => ({
								value: u,
								label: u
							}))]
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 532,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
							variant: "filter",
							ariaLabel: "Price range",
							kicker: "Budget limit",
							icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SlidersHorizontal, { size: 13 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 552,
								columnNumber: 21
							}, this),
							value: maxPrice,
							onValueChange: setMaxPrice,
							options: [
								{
									value: "any",
									label: "Any price"
								},
								{
									value: "50",
									label: "Under GH₵50"
								},
								{
									value: "100",
									label: "Under GH₵100"
								},
								{
									value: "500",
									label: "Under GH₵500"
								},
								{
									value: "3000",
									label: "Under GH₵3,000"
								}
							]
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 548,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
							variant: "filter",
							align: "end",
							ariaLabel: "Sort listings",
							kicker: "Sort order",
							icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpDown, { size: 13 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 568,
								columnNumber: 21
							}, this),
							value: sort,
							onValueChange: setSort,
							options: [
								{
									value: "recent",
									label: "Newest"
								},
								{
									value: "low",
									label: "Price: low to high"
								},
								{
									value: "high",
									label: "Price: high to low"
								},
								{
									value: "popular",
									label: "Most viewed"
								}
							]
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 563,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 531,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 527,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 491,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel section-panel",
		children: visibleResults.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "listing-grid",
			children: visibleResults.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListingCard, { listing: l }, l.id, false, {
				fileName: _jsxFileName,
				lineNumber: 587,
				columnNumber: 17
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 585,
			columnNumber: 13
		}, this), hasMore && /* @__PURE__ */ (void 0)("div", {
			className: "mt-6 flex justify-center",
			children: /* @__PURE__ */ (void 0)(Button, {
				variant: "outline",
				disabled: dbLoading,
				onClick: () => {
					if (backendConfigured) setOffset((prev) => prev + PAGE_SIZE);
					else setLocalVisibleCount((prev) => prev + PAGE_SIZE);
				},
				children: dbLoading ? "Loading more..." : "Load more listings"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 592,
				columnNumber: 17
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 591,
			columnNumber: 15
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 584,
			columnNumber: 11
		}, this) : dbLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "listing-grid",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "route-skeleton-card" }, i, false, {
				fileName: _jsxFileName,
				lineNumber: 611,
				columnNumber: 15
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 609,
			columnNumber: 11
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "outline",
			onClick: () => {
				setQuery("");
				setCategory("All");
				setMaxPrice("any");
			},
			children: "Reset filters"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 616,
			columnNumber: 13
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 615,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 582,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 490,
		columnNumber: 5
	}, this);
}
//#endregion
export { BrowsePage, DiscoverPage };
