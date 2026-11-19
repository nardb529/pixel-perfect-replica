import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { C as Slot, a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-3n-kyzhz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$2 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 43,
		columnNumber: 7
	}, void 0);
});
Button.displayName = "Button";
var _jsxFileName$1 = "/app/applet/src/components/ui/dialog.tsx";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/55 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 48,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 49,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 47,
		columnNumber: 7
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 57,
	columnNumber: 3
}, void 0);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 62,
	columnNumber: 3
}, void 0);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 73,
	columnNumber: 3
}, void 0));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 85,
	columnNumber: 3
}, void 0));
DialogDescription.displayName = DialogDescription$1.displayName;
var BRAND = "CampusLoop";
var TECHNICAL_ISSUE_MESSAGE = "Technical issue — it is being worked on. Please try again shortly.";
var UserInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "UserInputError";
	}
};
function toUserSafeErrorMessage(err) {
	if (err instanceof UserInputError && err.message.trim()) return err.message;
	const rawMessage = typeof err === "string" ? err : err instanceof Error ? err.message : err && typeof err === "object" && "message" in err ? String(err.message ?? "") : "";
	const rawCode = err && typeof err === "object" && "code" in err ? String(err.code ?? "") : "";
	const normalized = rawMessage.toLowerCase();
	if (!(rawCode.startsWith("PGRST") || normalized.includes("pgrst") || normalized.includes("relation ") || normalized.includes("does not exist") || normalized.includes("schema cache") || normalized.includes("failed to fetch") || normalized.includes("networkerror") || normalized.includes("load failed") || normalized.includes("supabase is not configured")) && rawMessage.trim()) {
		if (normalized.includes("invalid login credentials") || rawCode === "invalid_credentials") return "Incorrect email or password. Please check your details and try again.";
		if (normalized.includes("email not confirmed") || rawCode === "email_not_confirmed") return "Please verify your email address using the confirmation link sent to your inbox before signing in.";
		if (normalized.includes("user already registered") || normalized.includes("already been registered") || rawCode === "user_already_exists") return "An account with this email already exists. Switch to Log In or reset your password.";
		if (normalized.includes("password should be at least") || rawCode === "weak_password") return "Choose a stronger password (at least 8 characters).";
		if (normalized.includes("new password should be different") || normalized.includes("same password")) return "Choose a new password that is different from your current password.";
		if (normalized.includes("unable to validate email address") || normalized.includes("invalid format") || normalized.includes("valid email")) return "Enter a valid email address and try again.";
		if (normalized.includes("rate limit") || normalized.includes("too many requests") || normalized.includes("only request this after") || rawCode === "over_email_send_rate_limit" || rawCode === "over_request_rate_limit") return "Too many attempts right now. Please wait a minute and try again.";
		if (normalized.includes("profiles_username_key") || rawCode === "23505" && normalized.includes("username")) return "That username is already taken. Try adding a few numbers or initials.";
		if (normalized.includes("listing_quota_reached")) return "You have reached your current limit of 5 listings per account.";
		if (normalized.includes("listing_subscription_required")) return "An active seller plan (starting 1st December, 2026) is required before adding more listings.";
		if (normalized.includes("listing_image_limit_reached")) return "You have reached the maximum number of photos allowed per listing on your plan.";
		if (normalized.includes("auth session missing")) return "Your session expired. Please sign in again to continue.";
	}
	if (err !== void 0 && err !== null) console.error("[CampusLoop handled error]", err);
	return TECHNICAL_ISSUE_MESSAGE;
}
var universities = [
	"KNUST",
	"University of Ghana",
	"University of Cape Coast",
	"UPSA",
	"UEW",
	"UDS",
	"UMaT",
	"UENR",
	"GCTU",
	"UHAS",
	"UESD",
	"GIMPA",
	"ATU",
	"KsTU",
	"TTU",
	"Other institutions"
];
var productCategories = [
	"Electronics",
	"Fashion",
	"Books & Academics",
	"Food & Groceries",
	"Beauty",
	"Hostel Essentials",
	"Sports",
	"Accessories",
	"Home and Living",
	"Others"
];
var serviceCategories = [
	"Graphic Design",
	"Photography",
	"Hair & Beauty",
	"Technology & Repairs",
	"Tutoring",
	"Laundry",
	"Printing",
	"Food Services",
	"Transport",
	"Cleaning",
	"Events",
	"Others"
];
var priceTypes = [
	"Fixed",
	"Starting from",
	"Price range",
	"Negotiable",
	"Free"
];
function isSafeMediaUrl(url) {
	if (!url || typeof url !== "string") return false;
	const trimmed = url.trim();
	if (!trimmed) return false;
	if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
	if (trimmed.startsWith("blob:")) return true;
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" || parsed.protocol === "http:";
	} catch {
		return false;
	}
}
function matchesCategoryFilter(listingCategory, selectedCategory) {
	const target = selectedCategory.trim().toLowerCase();
	if (!target || target === "all") return true;
	const current = listingCategory.trim().toLowerCase();
	if (current === target) return true;
	if (target === "beauty" && current === "hair & beauty") return true;
	if (target === "hair & beauty" && current === "beauty") return true;
	return false;
}
function filterListings(listings, university, query = "", type, category = "All", maxPrice = Infinity) {
	const q = query.trim().toLowerCase();
	return listings.filter((l) => l.status === "Active" && (university === "All Universities" || l.audience.includes("All Universities") || l.audience.includes(university)) && (!type || l.type === type) && matchesCategoryFilter(l.category, category) && l.price <= maxPrice && (!q || `${l.title} ${l.seller} ${l.category} ${l.description} ${l.university} ${l.audience.join(" ")}`.toLowerCase().includes(q)));
}
function ownsListing(listing, identifier) {
	if (!identifier) return false;
	return Boolean(listing.ownerEmail && listing.ownerEmail === identifier || listing.sellerId && listing.sellerId === identifier);
}
function validatePassword(password, confirm) {
	if (password.length < 8) return "Use a password with at least 8 characters.";
	if (confirm !== void 0 && password !== confirm) return "Your passwords don’t match. Please try again.";
	return "";
}
function validateListing(values) {
	const maxImages = values.maxImages ?? 3;
	if (!values.images.length) return "Add at least one image.";
	if (values.images.length > maxImages) return `Upload up to ${maxImages} image${maxImages === 1 ? "" : "s"} per listing.`;
	const title = values.title.trim();
	const description = values.description.trim();
	if (!title || !description) return "Add a name and description.";
	if (title.length < 2 || title.length > 120) return "Title must be between 2 and 120 characters.";
	if (description.length < 10 || description.length > 3e3) return "Description must be between 10 and 3,000 characters.";
	const isFree = values.priceType === "Free";
	const parsedPrice = Number(values.price);
	if (!isFree && values.type === "product" && !values.price.trim() || values.price.trim() && (!Number.isFinite(parsedPrice) || parsedPrice < 0 || parsedPrice > 1e7)) return "Enter a valid price in GH₵.";
	if (!values.audience.length) return "Choose at least one university.";
	if (values.contact.trim().length < 5) return "Add valid contact details.";
	return "";
}
var money = (amount) => `GH₵ ${amount.toLocaleString("en-GH")}`;
function formatListingPrice(listing) {
	if (listing.priceType === "Free") return "Free";
	if (listing.type === "service" && (!listing.price || listing.price <= 0)) return "Contact for pricing";
	if (listing.priceType === "Negotiable") return listing.price > 0 ? `${money(listing.price)} (Neg.)` : "Negotiable";
	return money(listing.price);
}
function normalizeGhanaPhoneDigits(raw) {
	if (!raw) return "";
	const digits = raw.replace(/\D/g, "");
	if (!digits) return "";
	if (digits.startsWith("0") && digits.length === 10) return `233${digits.slice(1)}`;
	return digits;
}
function buildWhatsAppUrl(contact, message) {
	const digits = normalizeGhanaPhoneDigits(contact);
	if (digits.length < 9) return null;
	return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
function buildPhoneHref(contact) {
	const digits = normalizeGhanaPhoneDigits(contact);
	if (digits.length < 9) return null;
	return `tel:+${digits}`;
}
var supabaseUrl = typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
} ? {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_SUPABASE_URL"] : void 0;
var supabaseAnonKey = typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
} ? {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_SUPABASE_ANON_KEY"] : void 0;
var cleanUrl = supabaseUrl?.trim() || "";
var cleanAnonKey = supabaseAnonKey?.trim() || "";
var isSupabaseConfigured = cleanUrl.length > 0 && cleanAnonKey.length > 0 && !cleanUrl.includes("your-project-ref") && !cleanAnonKey.includes("your-supabase-anon");
var cachedClient = null;
function getSupabaseClient() {
	if (!isSupabaseConfigured) return null;
	if (!cachedClient) cachedClient = createClient(cleanUrl, cleanAnonKey, { auth: {
		persistSession: typeof window !== "undefined",
		autoRefreshToken: typeof window !== "undefined",
		detectSessionInUrl: typeof window !== "undefined"
	} });
	return cachedClient;
}
function requireSupabase() {
	const client = getSupabaseClient();
	if (!client) throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
	return client;
}
async function getSessionUser(client) {
	const target = client ?? getSupabaseClient();
	if (!target) return null;
	const { data } = await target.auth.getSession();
	return data.session?.user ?? null;
}
function isSchemaMissingError(err) {
	if (!err || typeof err !== "object") return false;
	const record = err;
	const code = typeof record.code === "string" ? record.code : "";
	const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
	return code === "PGRST202" || code === "PGRST204" || code === "PGRST205" || code === "42P01" || code === "42703" || code === "42883" || message.includes("schema cache") || message.includes("could not find the table") || message.includes("could not find the function") || message.includes("column") && message.includes("does not exist");
}
var VISITOR_SESSION_KEY = "cl_visitor_session_v1";
function getVisitorSessionId() {
	if (typeof window === "undefined") return "ssr-session";
	try {
		const existing = window.sessionStorage.getItem(VISITOR_SESSION_KEY);
		if (existing) return existing;
		const generated = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
		window.sessionStorage.setItem(VISITOR_SESSION_KEY, generated);
		return generated;
	} catch {
		return "anon-browser";
	}
}
function resetVisitorSessionId() {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.removeItem(VISITOR_SESSION_KEY);
	} catch {}
}
async function compressImageFile(file, maxDimension = 1400, quality = .84) {
	if (typeof document === "undefined" || !file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
	try {
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
		const width = Math.max(1, Math.round(bitmap.width * scale));
		const height = Math.max(1, Math.round(bitmap.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return file;
		ctx.drawImage(bitmap, 0, 0, width, height);
		bitmap.close();
		const targetType = file.type === "image/png" ? "image/webp" : "image/jpeg";
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, targetType, quality));
		if (!blob || blob.size >= file.size) return file;
		const ext = targetType === "image/webp" ? "webp" : "jpg";
		const cleanName = file.name.replace(/\.[^.]+$/, "") || "upload";
		return new File([blob], `${cleanName}.${ext}`, { type: targetType });
	} catch {
		return file;
	}
}
var VIEW_DEDUPE_KEY = "cl_viewed_listings_v1";
var VIEW_DEDUPE_MS = 9e5;
function readViewedMap() {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.sessionStorage.getItem(VIEW_DEDUPE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function wasRecentlyViewed(listingId) {
	const now = Date.now();
	const seenAt = readViewedMap()[listingId];
	return typeof seenAt === "number" && now - seenAt < VIEW_DEDUPE_MS;
}
function markListingViewed(listingId) {
	if (typeof window === "undefined") return;
	try {
		const now = Date.now();
		const map = readViewedMap();
		const next = {};
		for (const [key, ts] of Object.entries(map)) if (typeof ts === "number" && now - ts < VIEW_DEDUPE_MS) next[key] = ts;
		next[listingId] = now;
		window.sessionStorage.setItem(VIEW_DEDUPE_KEY, JSON.stringify(next));
	} catch {}
}
function clearAnalyticsSessionCache() {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.removeItem(VIEW_DEDUPE_KEY);
	} catch {}
}
var analyticsService = {
	async recordView(listingId, universityId, source = "marketplace") {
		const client = getSupabaseClient();
		if (!client) return false;
		if (wasRecentlyViewed(listingId)) return false;
		const { data, error } = await client.rpc("record_listing_view", {
			p_listing_id: listingId,
			p_university_id: universityId ?? null,
			p_visitor_session_id: getVisitorSessionId(),
			p_source: source
		});
		if (error) return false;
		markListingViewed(listingId);
		return Boolean(data);
	},
	async recordContactClick(listingId, contactMethod, universityId) {
		const client = getSupabaseClient();
		if (!client) return false;
		const { data, error } = await client.rpc("record_contact_click", {
			p_listing_id: listingId,
			p_contact_method: contactMethod,
			p_university_id: universityId ?? null,
			p_visitor_session_id: getVisitorSessionId()
		});
		if (error) return false;
		return Boolean(data);
	},
	async toggleLike(listingId) {
		const client = getSupabaseClient();
		if (!client) return false;
		const { data, error } = await client.rpc("toggle_listing_like", {
			p_listing_id: listingId,
			p_visitor_session_id: getVisitorSessionId()
		});
		if (error) throw error;
		return Boolean(data);
	},
	async getSellerAnalytics(range = "all") {
		const { data, error } = await requireSupabase().rpc("get_seller_analytics", { p_range: range });
		if (error) throw error;
		return data;
	}
};
function urlBase64ToUint8Array(base64String) {
	const base64 = (base64String + "=".repeat((4 - base64String.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputBuffer = new ArrayBuffer(rawData.length);
	const outputArray = new Uint8Array(outputBuffer);
	for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
}
function isPushSupported() {
	return typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window && "PushManager" in window;
}
async function showDeviceNotification(input) {
	if (typeof window === "undefined" || !("Notification" in window)) return false;
	if (Notification.permission !== "granted") return false;
	const options = {
		body: input.body,
		icon: "/pwa-192x192.png",
		badge: "/pwa-192x192.png",
		tag: input.tag || "campusloop-alert",
		renotify: true,
		data: { url: input.url || "/dashboard" }
	};
	try {
		if ("serviceWorker" in navigator) {
			const reg = await navigator.serviceWorker.ready;
			if (reg && typeof reg.showNotification === "function") {
				await reg.showNotification(input.title, options);
				return true;
			}
		}
	} catch {}
	try {
		new Notification(input.title, options);
		return true;
	} catch {
		return false;
	}
}
async function syncPushSubscriptionForCurrentUser() {
	if (!isPushSupported()) return {
		subscribed: false,
		reason: "unsupported"
	};
	if (Notification.permission !== "granted") return {
		subscribed: false,
		reason: "permission_not_granted"
	};
	const client = getSupabaseClient();
	if (!client) return {
		subscribed: false,
		reason: "backend_unconfigured"
	};
	const user = await getSessionUser(client);
	if (!user) return {
		subscribed: false,
		reason: "unauthenticated"
	};
	try {
		const reg = await navigator.serviceWorker.ready;
		const vapidKey = typeof import.meta !== "undefined" && {
			"BASE_URL": "/",
			"DEV": true,
			"MODE": "production",
			"PROD": false,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_VAPID_PUBLIC_KEY"] ? String({
			"BASE_URL": "/",
			"DEV": true,
			"MODE": "production",
			"PROD": false,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_VAPID_PUBLIC_KEY"]).trim() : "";
		let subscription = await reg.pushManager.getSubscription();
		if (!subscription && vapidKey) subscription = await reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapidKey)
		});
		if (!subscription) return {
			subscribed: false,
			reason: vapidKey ? "subscribe_failed" : "missing_vapid_key"
		};
		const json = subscription.toJSON();
		const endpoint = json.endpoint;
		const p256dh = json.keys?.["p256dh"];
		const auth = json.keys?.["auth"];
		if (!endpoint || !p256dh || !auth) return {
			subscribed: false,
			reason: "invalid_keys"
		};
		const { error } = await client.from("push_subscriptions").upsert({
			user_id: user.id,
			endpoint,
			p256dh,
			auth,
			user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : "",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "user_id,endpoint" });
		if (error) return {
			subscribed: false,
			reason: error.message
		};
		return { subscribed: true };
	} catch {
		return {
			subscribed: false,
			reason: "subscription_error"
		};
	}
}
async function removePushSubscriptionForCurrentUser() {
	if (!isPushSupported()) return;
	const client = getSupabaseClient();
	try {
		const subscription = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
		if (!subscription) return;
		if (client) {
			const user = await getSessionUser(client).catch(() => null);
			if (user) await client.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", subscription.endpoint);
		}
		await subscription.unsubscribe().catch(() => void 0);
	} catch {}
}
var authenticationService = {
	async getSession() {
		const client = getSupabaseClient();
		if (!client) return null;
		const { data, error } = await client.auth.getSession();
		if (error) throw error;
		return data.session;
	},
	async getCurrentUser() {
		const client = getSupabaseClient();
		if (!client) return null;
		const { data, error } = await client.auth.getUser();
		if (error) return null;
		return data.user;
	},
	onAuthStateChange(callback) {
		const client = getSupabaseClient();
		if (!client) return { unsubscribe: () => void 0 };
		const { data } = client.auth.onAuthStateChange(callback);
		return data.subscription;
	},
	async signUp(payload) {
		const supabase = requireSupabase();
		const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : void 0;
		const { data, error } = await supabase.auth.signUp({
			email: payload.email.trim().toLowerCase(),
			password: payload.password,
			options: {
				...redirectTo ? { emailRedirectTo: redirectTo } : {},
				data: {
					full_name: payload.fullName.trim(),
					username: payload.username.trim().toLowerCase(),
					account_type: payload.accountType,
					primary_university_id: payload.primaryUniversityId ?? null,
					university_name: payload.universityName ?? null,
					phone_number: payload.phoneNumber?.trim() || null,
					whatsapp_number: payload.whatsappNumber?.trim() || null,
					is_student: payload.isStudent ?? true
				}
			}
		});
		if (error) throw error;
		return {
			user: data.user,
			session: data.session,
			needsEmailConfirmation: Boolean(data.user && !data.session)
		};
	},
	async signIn(email, password) {
		const { data, error } = await requireSupabase().auth.signInWithPassword({
			email: email.trim().toLowerCase(),
			password
		});
		if (error) throw error;
		return data;
	},
	async signOut() {
		const client = getSupabaseClient();
		if (!client) return;
		const { error } = await client.auth.signOut();
		if (error) throw error;
	},
	async resendVerificationEmail(email) {
		const { error } = await requireSupabase().auth.resend({
			type: "signup",
			email: email.trim().toLowerCase()
		});
		if (error) throw error;
	},
	async sendPasswordResetEmail(email) {
		const supabase = requireSupabase();
		const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : void 0;
		const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), redirectTo ? { redirectTo } : void 0);
		if (error) throw error;
	},
	async updatePassword(newPassword) {
		const { data, error } = await requireSupabase().auth.updateUser({ password: newPassword });
		if (error) throw error;
		return data.user;
	}
};
async function readHeaderBytes(file, maxBytes = 16) {
	const slice = file.slice(0, maxBytes);
	if (typeof slice.arrayBuffer === "function") try {
		return new Uint8Array(await slice.arrayBuffer());
	} catch {}
	if (typeof file.arrayBuffer === "function") try {
		return new Uint8Array(await file.arrayBuffer()).slice(0, maxBytes);
	} catch {}
	if (typeof FileReader !== "undefined") try {
		const buffer = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(reader.error || /* @__PURE__ */ new Error("FileReader failed"));
			reader.readAsArrayBuffer(slice);
		});
		return new Uint8Array(buffer);
	} catch {
		return null;
	}
	return null;
}
async function verifyImageBinarySignature(file) {
	if (!file || typeof file.slice !== "function") return {
		valid: false,
		format: "Unknown",
		reason: "No readable image file was selected."
	};
	if (file.size < 4096) return {
		valid: false,
		format: "Unknown",
		reason: "Image file is too small or corrupted. Upload a full-quality photo."
	};
	if (file.size > 5242880) return {
		valid: false,
		format: "Unknown",
		reason: "Image must be 5 MB or smaller."
	};
	const bytes = await readHeaderBytes(file, 16);
	if (!bytes) return {
		valid: false,
		format: "Unknown",
		reason: "Could not read image file bytes."
	};
	if (bytes.length < 12) return {
		valid: false,
		format: "Unknown",
		reason: "Image header is truncated or invalid."
	};
	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return {
		valid: true,
		format: "JPEG"
	};
	if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) return {
		valid: true,
		format: "PNG"
	};
	const riff = bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70;
	const webp = bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80;
	if (riff && webp) return {
		valid: true,
		format: "WebP"
	};
	if (bytes[4] === 102 && bytes[5] === 116 && bytes[6] === 121 && bytes[7] === 112) {
		const brand = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
		if (brand === "avif" || brand === "avis" || brand === "mif1") return {
			valid: true,
			format: "AVIF"
		};
	}
	return {
		valid: false,
		format: "Unknown",
		reason: "Unsupported or spoofed image file. Upload a genuine JPG, PNG, WebP, or AVIF photo."
	};
}
function hammingDistanceHex(a, b) {
	if (!a || !b || a.length !== b.length || a.length === 0) return Number.POSITIVE_INFINITY;
	let dist = 0;
	for (let i = 0; i < a.length; i++) {
		const xor = Number.parseInt(a[i], 16) ^ Number.parseInt(b[i], 16);
		if (Number.isNaN(xor)) return Number.POSITIVE_INFINITY;
		let v = xor;
		while (v > 0) {
			dist += v & 1;
			v >>= 1;
		}
	}
	return dist;
}
function checkIdAndProfilePair(idHash, profileHash) {
	if (!idHash || !profileHash) return "";
	if (hammingDistanceHex(idHash, profileHash) <= 6) return "Your ID image and real profile photo appear to be the same photo. Upload your ID card separately from your real profile photo.";
	return "";
}
function docDisplayLabel(docType) {
	if (docType === "Voters ID") return "Voter's ID";
	return docType || "ID card";
}
function computeImagePixelMetrics(ctx, width, height) {
	const { data } = ctx.getImageData(0, 0, width, height);
	const totalPixels = width * height;
	const luma = new Float32Array(totalPixels);
	let sum = 0;
	for (let i = 0; i < totalPixels; i++) {
		const offset = i * 4;
		const y = .299 * data[offset] + .587 * data[offset + 1] + .114 * data[offset + 2];
		luma[i] = y;
		sum += y;
	}
	const meanLuma = sum / Math.max(1, totalPixels);
	let varianceSum = 0;
	for (let i = 0; i < totalPixels; i++) {
		const diff = luma[i] - meanLuma;
		varianceSum += diff * diff;
	}
	const contrastStdDev = Math.sqrt(varianceSum / Math.max(1, totalPixels));
	let edgeCount = 0;
	let sampleCount = 0;
	for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
		const idx = y * width + x;
		if (Math.abs(luma[idx + 1] - luma[idx - 1]) + Math.abs(luma[idx + width] - luma[idx - width]) > 24) edgeCount++;
		sampleCount++;
	}
	const edgeDensity = sampleCount > 0 ? edgeCount / sampleCount : 0;
	const hashCanvas = document.createElement("canvas");
	hashCanvas.width = 9;
	hashCanvas.height = 8;
	const hctx = hashCanvas.getContext("2d");
	let dHash = "";
	if (hctx) {
		hctx.drawImage(ctx.canvas, 0, 0, 9, 8);
		const hData = hctx.getImageData(0, 0, 9, 8).data;
		let nibble = 0;
		let bitPos = 0;
		for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
			const leftIdx = (row * 9 + col) * 4;
			const rightIdx = (row * 9 + col + 1) * 4;
			if (.299 * hData[leftIdx] + .587 * hData[leftIdx + 1] + .114 * hData[leftIdx + 2] > .299 * hData[rightIdx] + .587 * hData[rightIdx + 1] + .114 * hData[rightIdx + 2]) nibble |= 1 << 3 - bitPos;
			bitPos++;
			if (bitPos === 4) {
				dHash += nibble.toString(16);
				nibble = 0;
				bitPos = 0;
			}
		}
	}
	return {
		meanLuma,
		contrastStdDev,
		edgeDensity,
		dHash
	};
}
async function inspectVerificationImage(file, kind, expectedDocType) {
	const sig = await verifyImageBinarySignature(file);
	if (!sig.valid) return {
		valid: false,
		reason: sig.reason,
		format: sig.format,
		width: 0,
		height: 0,
		aspectRatio: 0,
		meanLuma: 0,
		contrastStdDev: 0,
		edgeDensity: 0,
		dHash: "",
		fileSizeBytes: file?.size ?? 0,
		summary: sig.reason || "Invalid image file."
	};
	if (typeof document === "undefined" || typeof createImageBitmap === "undefined") return {
		valid: true,
		format: sig.format,
		width: 0,
		height: 0,
		aspectRatio: 0,
		meanLuma: 128,
		contrastStdDev: 32,
		edgeDensity: .1,
		dHash: "",
		fileSizeBytes: file.size,
		summary: `${sig.format} signature verified (${Math.round(file.size / 1024)} KB).`
	};
	let bitmap = null;
	try {
		bitmap = await createImageBitmap(file);
		const width = bitmap.width;
		const height = bitmap.height;
		const aspectRatio = height > 0 ? Number((width / height).toFixed(2)) : 0;
		if (kind === "id") {
			if (Math.max(width, height) < 420 || Math.min(width, height) < 240) return {
				valid: false,
				reason: `ID image resolution (${width}×${height}) is too low to verify card text. Upload a sharp photo of your ${docDisplayLabel(expectedDocType)}.`,
				format: sig.format,
				width,
				height,
				aspectRatio,
				meanLuma: 0,
				contrastStdDev: 0,
				edgeDensity: 0,
				dHash: "",
				fileSizeBytes: file.size,
				summary: `Resolution ${width}×${height} too low.`
			};
			if (aspectRatio < .45 || aspectRatio > 2.7) return {
				valid: false,
				reason: `This image framing does not match a physical ${docDisplayLabel(expectedDocType)}. Capture the full rectangular card clearly without tall chat screenshots.`,
				format: sig.format,
				width,
				height,
				aspectRatio,
				meanLuma: 0,
				contrastStdDev: 0,
				edgeDensity: 0,
				dHash: "",
				fileSizeBytes: file.size,
				summary: `Unexpected card aspect ratio (${aspectRatio}).`
			};
			if (aspectRatio >= .9 && aspectRatio <= 1.12) return {
				valid: false,
				reason: `Square 1:1 images are usually avatars rather than an ID card. Frame the full rectangular ${docDisplayLabel(expectedDocType)} so all edges and details are visible.`,
				format: sig.format,
				width,
				height,
				aspectRatio,
				meanLuma: 0,
				contrastStdDev: 0,
				edgeDensity: 0,
				dHash: "",
				fileSizeBytes: file.size,
				summary: `Square crop (${width}×${height}) rejected for ID card.`
			};
		} else if (width < 200 || height < 200) return {
			valid: false,
			reason: `Profile photo (${width}×${height}) is too small. Upload a clear real photo of your face (at least 200×200 px).`,
			format: sig.format,
			width,
			height,
			aspectRatio,
			meanLuma: 0,
			contrastStdDev: 0,
			edgeDensity: 0,
			dHash: "",
			fileSizeBytes: file.size,
			summary: `Profile photo resolution ${width}×${height} too low.`
		};
		const scale = Math.min(1, 240 / Math.max(width, height));
		const sw = Math.max(24, Math.round(width * scale));
		const sh = Math.max(24, Math.round(height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = sw;
		canvas.height = sh;
		const ctx = canvas.getContext("2d");
		if (!ctx) return {
			valid: true,
			format: sig.format,
			width,
			height,
			aspectRatio,
			meanLuma: 128,
			contrastStdDev: 32,
			edgeDensity: .1,
			dHash: "",
			fileSizeBytes: file.size,
			summary: `${sig.format} · ${width}×${height} px verified.`
		};
		ctx.drawImage(bitmap, 0, 0, sw, sh);
		const metrics = computeImagePixelMetrics(ctx, sw, sh);
		if (metrics.meanLuma < 22 || metrics.meanLuma > 246) return {
			valid: false,
			reason: metrics.meanLuma < 22 ? "Photo is too dark to inspect. Retake it in bright, even lighting." : "Photo is overexposed or blank white. Retake it with clear lighting.",
			format: sig.format,
			width,
			height,
			aspectRatio,
			...metrics,
			fileSizeBytes: file.size,
			summary: "Exposure out of readable range."
		};
		const minStdDev = kind === "id" ? 12 : 10;
		if (metrics.contrastStdDev < minStdDev || kind === "id" && metrics.edgeDensity < .025) return {
			valid: false,
			reason: kind === "id" ? `This image lacks readable card edges or text for a ${docDisplayLabel(expectedDocType)}. Place the card on a flat surface and capture a sharp photo.` : "This image appears blank or uniformly flat. Upload a clear real photo of yourself.",
			format: sig.format,
			width,
			height,
			aspectRatio,
			...metrics,
			fileSizeBytes: file.size,
			summary: "Insufficient image detail/contrast."
		};
		return {
			valid: true,
			format: sig.format,
			width,
			height,
			aspectRatio,
			...metrics,
			fileSizeBytes: file.size,
			summary: `${sig.format} · ${width}×${height} px · Clear detail`
		};
	} catch {
		return {
			valid: false,
			reason: "Unable to decode this image file. Choose a standard JPG or PNG photo.",
			format: sig.format,
			width: 0,
			height: 0,
			aspectRatio: 0,
			meanLuma: 0,
			contrastStdDev: 0,
			edgeDensity: 0,
			dHash: "",
			fileSizeBytes: file.size,
			summary: "Image decode failed."
		};
	} finally {
		bitmap?.close();
	}
}
var PROFILE_COLUMNS_BASE = "id, full_name, username, email, phone_number, whatsapp_number, preferred_contact_method, show_public_contact, profile_image, bio, account_type, primary_university_id, verification_status, is_student, id_document_type, id_document_path, verification_photo_confirmed, verification_submitted_at, verification_note, role, is_suspended, notification_preferences, created_at, updated_at";
var PROFILE_COLUMNS = `${PROFILE_COLUMNS_BASE}, verification_checks, subscription_tier, subscription_status, subscription_expires_at`;
var PUBLIC_SELLER_COLUMNS = "id, full_name, username, profile_image, bio, account_type, primary_university_id, verification_status, preferred_contact_method, public_contact_handle, is_suspended, created_at";
var profileService = {
	async getMyProfile(userId) {
		const client = getSupabaseClient();
		if (!client) return null;
		let targetId = userId;
		if (!targetId) targetId = (await getSessionUser(client))?.id;
		if (!targetId) return null;
		const { data, error } = await client.from("profiles").select(PROFILE_COLUMNS).eq("id", targetId).maybeSingle();
		if (error) {
			if (isSchemaMissingError(error)) {
				const fallback = await client.from("profiles").select(PROFILE_COLUMNS_BASE).eq("id", targetId).maybeSingle();
				if (fallback.error) throw fallback.error;
				return fallback.data;
			}
			throw error;
		}
		return data;
	},
	async getPublicSellerProfile(sellerId) {
		const client = getSupabaseClient();
		if (!client) return null;
		const { data, error } = await client.from("public_seller_profiles").select(PUBLIC_SELLER_COLUMNS).eq("id", sellerId).maybeSingle();
		if (error) throw error;
		return data;
	},
	async updateMyProfile(input) {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Authentication required");
		const sanitized = {};
		if (input.full_name !== void 0) sanitized["full_name"] = input.full_name.trim().slice(0, 80);
		if (input.username !== void 0) sanitized["username"] = input.username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 40);
		if (input.phone_number !== void 0) sanitized["phone_number"] = input.phone_number?.trim().slice(0, 40) || null;
		if (input.whatsapp_number !== void 0) sanitized["whatsapp_number"] = input.whatsapp_number?.trim().slice(0, 40) || null;
		if (input.preferred_contact_method !== void 0) sanitized["preferred_contact_method"] = input.preferred_contact_method;
		if (input.show_public_contact !== void 0) sanitized["show_public_contact"] = input.show_public_contact;
		if (input.profile_image !== void 0) sanitized["profile_image"] = input.profile_image;
		if (input.bio !== void 0) sanitized["bio"] = input.bio.trim().slice(0, 600);
		if (input.account_type !== void 0) sanitized["account_type"] = input.account_type;
		if (input.primary_university_id !== void 0) sanitized["primary_university_id"] = input.primary_university_id;
		const { data, error } = await supabase.from("profiles").update(sanitized).eq("id", user.id).select(PROFILE_COLUMNS).single();
		if (error) {
			if (isSchemaMissingError(error)) {
				const fallback = await supabase.from("profiles").update(sanitized).eq("id", user.id).select(PROFILE_COLUMNS_BASE).single();
				if (fallback.error) throw fallback.error;
				return fallback.data;
			}
			throw error;
		}
		return data;
	},
	async listUserUniversities(userId) {
		const client = getSupabaseClient();
		if (!client) return [];
		const { data, error } = await client.from("user_universities").select("id, user_id, university_id, affiliation_type, is_primary, created_at, university:universities(id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at)").eq("user_id", userId).order("is_primary", { ascending: false });
		if (error) throw error;
		return data || [];
	},
	async saveUserUniversities(affiliations) {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Authentication required");
		const { error: deleteErr } = await supabase.from("user_universities").delete().eq("user_id", user.id);
		if (deleteErr) throw deleteErr;
		if (affiliations.length > 0) {
			const { error: insertErr } = await supabase.from("user_universities").insert(affiliations.map((a) => ({
				user_id: user.id,
				university_id: a.university_id,
				affiliation_type: a.affiliation_type,
				is_primary: a.is_primary
			})));
			if (insertErr) throw insertErr;
		}
	},
	async uploadProfileImage(file) {
		const supabase = requireSupabase();
		if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new UserInputError("Choose a JPG, PNG, or WebP image file.");
		if (file.size > 5242880) throw new UserInputError("Profile images must be 5 MB or smaller.");
		const validity = await inspectVerificationImage(file, "profile");
		if (!validity.valid) throw new UserInputError(validity.reason || "Profile photo failed image quality checks.");
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Authentication required");
		const optimized = await compressImageFile(file, 720, .85);
		const ext = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"image/webp": "webp",
			"image/avif": "avif"
		}[optimized.type] || "jpg";
		const path = `${user.id}/avatar-${Date.now()}.${ext}`;
		const { error: uploadErr } = await supabase.storage.from("profile-images").upload(path, optimized, {
			upsert: true,
			contentType: optimized.type,
			cacheControl: "2592000"
		});
		if (uploadErr) throw uploadErr;
		const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
		return data.publicUrl;
	},
	async uploadVerificationId(file, expectedDocType) {
		const supabase = requireSupabase();
		if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new UserInputError("Upload a clear JPG, PNG, or WebP photo of your ID card.");
		if (file.size > 5242880) throw new UserInputError("ID document image must be 5 MB or smaller.");
		const validity = await inspectVerificationImage(file, "id", expectedDocType);
		if (!validity.valid) throw new UserInputError(validity.reason || "Uploaded ID image failed quality & validity checks.");
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Sign in to upload verification documents.");
		const optimized = await compressImageFile(file, 1400, .88);
		const ext = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"image/webp": "webp",
			"image/avif": "avif"
		}[optimized.type] || "jpg";
		const path = `${user.id}/id-doc-${Date.now()}.${ext}`;
		const { error: uploadErr } = await supabase.storage.from("seller-verifications").upload(path, optimized, {
			upsert: true,
			contentType: optimized.type,
			cacheControl: "3600"
		});
		if (uploadErr) throw uploadErr;
		const { data: signedData, error: signErr } = await supabase.storage.from("seller-verifications").createSignedUrl(path, 600);
		if (signErr) throw signErr;
		return {
			path,
			signedUrl: signedData.signedUrl,
			validity
		};
	},
	async getSignedVerificationDocUrl(path) {
		const client = getSupabaseClient();
		if (!client || !path) return null;
		const { data, error } = await client.storage.from("seller-verifications").createSignedUrl(path, 300);
		if (error || !data?.signedUrl) return null;
		return data.signedUrl;
	},
	async submitSellerVerification(input) {
		if (input.isStudent && input.idDocumentType !== "Student ID") throw new UserInputError("Students must upload a valid Student ID.");
		if (!input.isStudent && !["Ghana Card", "Voters ID"].includes(input.idDocumentType)) throw new UserInputError("Non-students must upload either a Ghana Card or Voter's ID.");
		if (!input.idDocumentPath.trim()) throw new UserInputError("Upload a clear photo of your required ID card.");
		if (!input.profileImageUrl.trim()) throw new UserInputError("Upload a real profile photo matching the person on your ID.");
		if (!input.photoMatchConfirmed) throw new UserInputError("Confirm that your profile photo matches the person on your ID card.");
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Authentication required");
		const basePayload = {
			is_student: input.isStudent,
			id_document_type: input.idDocumentType,
			id_document_path: input.idDocumentPath.trim(),
			profile_image: input.profileImageUrl.trim(),
			verification_photo_confirmed: true,
			verification_submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
			verification_status: "pending"
		};
		const { data, error } = await supabase.from("profiles").update(input.verificationChecks ? {
			...basePayload,
			verification_checks: input.verificationChecks
		} : basePayload).eq("id", user.id).select(PROFILE_COLUMNS).single();
		if (error) {
			if (isSchemaMissingError(error)) {
				const fallback = await supabase.from("profiles").update(basePayload).eq("id", user.id).select(PROFILE_COLUMNS_BASE).single();
				if (fallback.error) throw fallback.error;
				return fallback.data;
			}
			throw error;
		}
		return data;
	}
};
var UNIVERSITY_COLUMNS = "id, university_name, short_name, slug, logo_url, location, region, description, display_order, is_active, created_at";
var CACHE_KEY$1 = "cl_active_universities_v1";
var CACHE_TTL_MS$1 = 18e5;
var memoryCache$1 = null;
function readCachedUniversities() {
	if (memoryCache$1 && memoryCache$1.expiresAt > Date.now()) return memoryCache$1.data;
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(CACHE_KEY$1);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed?.expiresAt === "number" && parsed.expiresAt > Date.now() && Array.isArray(parsed.data)) {
			memoryCache$1 = {
				expiresAt: parsed.expiresAt,
				data: parsed.data
			};
			return parsed.data;
		}
	} catch {}
	return null;
}
function writeCachedUniversities(data) {
	const expiresAt = Date.now() + CACHE_TTL_MS$1;
	memoryCache$1 = {
		expiresAt,
		data
	};
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(CACHE_KEY$1, JSON.stringify({
			expiresAt,
			data
		}));
	} catch {}
}
function invalidateUniversityCache() {
	memoryCache$1 = null;
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(CACHE_KEY$1);
	} catch {}
}
var universityService = {
	async listActiveUniversities(options) {
		const client = getSupabaseClient();
		if (!client) return [];
		if (!options?.forceRefresh) {
			const cached = readCachedUniversities();
			if (cached) return cached;
		}
		const { data, error } = await client.from("universities").select(UNIVERSITY_COLUMNS).eq("is_active", true).order("display_order", { ascending: true }).order("university_name", { ascending: true });
		if (error) throw error;
		const rows = data || [];
		if (rows.length > 0) writeCachedUniversities(rows);
		return rows;
	},
	async listAllUniversities() {
		const client = getSupabaseClient();
		if (!client) return [];
		const { data, error } = await client.from("universities").select(UNIVERSITY_COLUMNS).order("display_order", { ascending: true }).order("university_name", { ascending: true });
		if (error) throw error;
		return data || [];
	}
};
var CATEGORY_COLUMNS = "id, name, slug, category_type, icon, description, display_order, is_active, created_at";
var CACHE_KEY = "cl_active_categories_v1";
var CACHE_TTL_MS = 18e5;
var memoryCache = null;
function readCachedCategories() {
	if (memoryCache && memoryCache.expiresAt > Date.now()) return memoryCache.data;
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed?.expiresAt === "number" && parsed.expiresAt > Date.now() && Array.isArray(parsed.data)) {
			memoryCache = {
				expiresAt: parsed.expiresAt,
				data: parsed.data
			};
			return parsed.data;
		}
	} catch {}
	return null;
}
function writeCachedCategories(data) {
	const expiresAt = Date.now() + CACHE_TTL_MS;
	memoryCache = {
		expiresAt,
		data
	};
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(CACHE_KEY, JSON.stringify({
			expiresAt,
			data
		}));
	} catch {}
}
function invalidateCategoryCache() {
	memoryCache = null;
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(CACHE_KEY);
	} catch {}
}
var categoryService = {
	async listActiveCategories(type, options) {
		const client = getSupabaseClient();
		if (!client) return [];
		if (!options?.forceRefresh) {
			const cached = readCachedCategories();
			if (cached) return type ? cached.filter((c) => c.category_type === type) : cached;
		}
		const { data, error } = await client.from("categories").select(CATEGORY_COLUMNS).eq("is_active", true).order("display_order", { ascending: true }).order("name", { ascending: true });
		if (error) throw error;
		const rows = data || [];
		if (rows.length > 0) writeCachedCategories(rows);
		return type ? rows.filter((c) => c.category_type === type) : rows;
	},
	async listAllCategories() {
		const client = getSupabaseClient();
		if (!client) return [];
		const { data, error } = await client.from("categories").select(CATEGORY_COLUMNS).order("category_type", { ascending: true }).order("display_order", { ascending: true });
		if (error) throw error;
		return data || [];
	}
};
var LISTING_BASE_COLUMNS = "id, seller_id, listing_type, title, slug, description, category_id, price, price_type, currency, status, condition, location, contact_method, contact_value, audience_scope, is_featured, view_count, like_count, favorite_count, contact_click_count, published_at, created_at";
function slugifyTitle(title) {
	const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
	const suffix = Math.random().toString(36).slice(2, 7);
	return `${base || "listing"}-${suffix}`;
}
function formatRelativeTime(isoDate) {
	if (!isoDate) return "Recently";
	const diffMs = Date.now() - new Date(isoDate).getTime();
	const mins = Math.max(1, Math.floor(diffMs / 6e4));
	if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
	return new Date(isoDate).toLocaleDateString("en-GH", {
		month: "short",
		day: "numeric"
	});
}
function mapSearchRowToListing(row) {
	const orderedImages = (row.images || []).slice().sort((a, b) => a.display_order - b.display_order).map((img) => img.image_url).filter((url) => isSafeMediaUrl(url));
	return {
		id: row.id,
		sellerId: row.seller_id,
		sellerUsername: row.seller_username,
		verificationStatus: row.seller_verification,
		title: row.title,
		slug: row.slug,
		type: row.listing_type,
		category: row.category_name,
		categoryId: row.category_id,
		price: Number(row.price ?? 0),
		priceType: row.price_type,
		currency: row.currency,
		image: orderedImages[0] || "",
		images: orderedImages,
		seller: row.seller_name,
		university: row.primary_university_name,
		audience: row.audience_scope === "all" ? ["All Universities"] : row.audience_universities?.length ? row.audience_universities : [row.primary_university_name],
		audienceScope: row.audience_scope,
		description: row.description,
		condition: row.condition ?? void 0,
		location: row.location || void 0,
		time: formatRelativeTime(row.published_at || row.created_at),
		status: row.status === "Active" || row.status === "Paused" || row.status === "Sold" || row.status === "Unavailable" ? row.status : "Paused",
		rawStatus: row.status,
		views: row.view_count,
		likes: row.like_count,
		favoriteCount: row.favorite_count,
		contactClicks: row.contact_click_count,
		featured: row.is_featured,
		contact: row.contact_value,
		contactMethod: row.contact_method,
		postedAt: new Date(row.published_at || row.created_at).getTime()
	};
}
var listingService = {
	async searchListings(params = {}) {
		const client = getSupabaseClient();
		if (!client) return {
			items: [],
			totalCount: 0
		};
		const { data, error } = await client.rpc("search_marketplace_listings", {
			p_university_filter: params.universityFilter ?? null,
			p_listing_type: params.listingType ?? null,
			p_category_filter: params.categoryFilter ?? null,
			p_search_query: params.searchQuery ?? null,
			p_min_price: params.minPrice ?? null,
			p_max_price: params.maxPrice ?? null,
			p_featured_only: Boolean(params.featuredOnly),
			p_sort: params.sort ?? "recent",
			p_limit: params.limit ?? 24,
			p_offset: params.offset ?? 0
		});
		if (error) throw error;
		const rows = data || [];
		return {
			items: rows.map(mapSearchRowToListing),
			totalCount: Number(rows[0]?.total_count ?? 0)
		};
	},
	async getSearchSuggestions(query, limit = 6) {
		const client = getSupabaseClient();
		const cleaned = query.trim().replace(/[\\%_]/g, "\\$&").slice(0, 80);
		if (!client || !cleaned) return [];
		const { data, error } = await client.from("listings").select("id, title, listing_type").eq("status", "Active").ilike("title", `%${cleaned}%`).order("view_count", { ascending: false }).limit(limit);
		if (error) return [];
		return (data || []).map((row) => ({
			id: String(row["id"]),
			title: String(row["title"]),
			type: row["listing_type"]
		}));
	},
	async getListingById(listingId) {
		const client = getSupabaseClient();
		if (!client) return null;
		const { data, error } = await client.from("listings").select(`
        ${LISTING_BASE_COLUMNS},
        category:categories(id, name, slug),
        images:listing_images(id, image_url, storage_path, display_order),
        product_details(condition, brand, stock_status),
        service_details(starting_price, duration, service_area, delivery_method),
        targets:listing_universities(university_id, university:universities(short_name, university_name))
      `).eq("id", listingId).maybeSingle();
		if (error) throw error;
		if (!data) return null;
		const sellerId = String(data["seller_id"]);
		const { data: sellerPublic } = await client.from("public_seller_profiles").select("id, full_name, username, verification_status, primary_university_id").eq("id", sellerId).maybeSingle();
		if (!sellerPublic) {
			const viewerId = (await getSessionUser(client))?.id;
			let canViewHiddenSeller = viewerId === sellerId;
			if (!canViewHiddenSeller && viewerId) {
				const { data: viewerProfile } = await client.from("profiles").select("role").eq("id", viewerId).maybeSingle();
				canViewHiddenSeller = viewerProfile?.["role"] === "admin";
			}
			if (!canViewHiddenSeller) return null;
		}
		let primaryUniName = "Ghana Campus";
		if (sellerPublic?.["primary_university_id"]) {
			const { data: uniRow } = await client.from("universities").select("short_name, university_name").eq("id", sellerPublic["primary_university_id"]).maybeSingle();
			if (uniRow) primaryUniName = String(uniRow["short_name"] || uniRow["university_name"]);
		}
		const rawImages = (data["images"] || []).slice().sort((a, b) => a.display_order - b.display_order).map((i) => i.image_url).filter((url) => isSafeMediaUrl(url));
		const targets = data["targets"] || [];
		const audience = data["audience_scope"] === "all" ? ["All Universities"] : targets.map((t) => t.university?.short_name || t.university?.university_name || "").filter(Boolean);
		const category = data["category"];
		const prodDetails = data["product_details"];
		const servDetails = data["service_details"];
		const rawStatus = data["status"];
		return {
			id: String(data["id"]),
			sellerId,
			sellerUsername: sellerPublic?.["username"] ? String(sellerPublic["username"]) : void 0,
			verificationStatus: sellerPublic?.["verification_status"] || "unverified",
			title: String(data["title"]),
			slug: String(data["slug"]),
			type: data["listing_type"],
			category: category?.name || "Others",
			categoryId: String(data["category_id"]),
			price: Number(data["price"] ?? 0),
			priceType: data["price_type"],
			currency: String(data["currency"] || "GHS"),
			image: rawImages[0] || "",
			images: rawImages,
			seller: String(sellerPublic?.["full_name"] || "Campus Seller"),
			university: primaryUniName,
			audience: audience.length ? audience : [primaryUniName],
			audienceScope: data["audience_scope"],
			description: String(data["description"]),
			condition: prodDetails?.condition || data["condition"] || void 0,
			brand: prodDetails?.brand || void 0,
			stockStatus: prodDetails?.stock_status || void 0,
			duration: servDetails?.duration || void 0,
			serviceArea: servDetails?.service_area || void 0,
			deliveryMethod: servDetails?.delivery_method || void 0,
			location: data["location"] || void 0,
			time: formatRelativeTime(data["published_at"] || data["created_at"]),
			status: rawStatus === "Active" || rawStatus === "Paused" || rawStatus === "Sold" || rawStatus === "Unavailable" ? rawStatus : "Paused",
			rawStatus,
			views: Number(data["view_count"] || 0),
			likes: Number(data["like_count"] || 0),
			favoriteCount: Number(data["favorite_count"] || 0),
			contactClicks: Number(data["contact_click_count"] || 0),
			featured: Boolean(data["is_featured"]),
			contact: String(data["contact_value"] || ""),
			contactMethod: String(data["contact_method"] || "WhatsApp"),
			postedAt: new Date(data["published_at"] || data["created_at"]).getTime()
		};
	},
	async getListingsBySeller(sellerId) {
		const client = getSupabaseClient();
		if (!client) return [];
		const { data, error } = await client.from("listings").select(`
        ${LISTING_BASE_COLUMNS},
        category:categories(id, name),
        images:listing_images(image_url, display_order),
        product_details(condition, brand, stock_status),
        service_details(starting_price, duration, service_area, delivery_method),
        targets:listing_universities(university:universities(short_name))
      `).eq("seller_id", sellerId).eq("status", "Active").order("is_featured", { ascending: false }).order("created_at", { ascending: false }).limit(60);
		if (error) throw error;
		return (data || []).map((row) => mapSellerRowToListing(row, "Campus Seller", "Ghana Campus"));
	},
	async getMyListings() {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) return [];
		const { data, error } = await supabase.from("listings").select(`
        ${LISTING_BASE_COLUMNS},
        category:categories(id, name),
        images:listing_images(image_url, display_order),
        product_details(condition, brand, stock_status),
        service_details(starting_price, duration, service_area, delivery_method),
        targets:listing_universities(university:universities(short_name, university_name))
      `).eq("seller_id", user.id).neq("status", "Archived").order("created_at", { ascending: false });
		if (error) throw error;
		return (data || []).map((row) => mapSellerRowToListing(row, String(user.user_metadata?.["full_name"] || "You"), "My Campus", user.email));
	},
	async createListing(input) {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Sign in to publish listings.");
		const slug = slugifyTitle(input.title);
		const { data: created, error } = await supabase.from("listings").insert({
			seller_id: user.id,
			listing_type: input.listingType,
			title: input.title.trim(),
			slug,
			description: input.description.trim(),
			category_id: input.categoryId,
			price: input.price,
			price_type: input.priceType,
			currency: "GHS",
			status: input.status ?? "Active",
			condition: input.listingType === "product" ? input.condition || "New" : null,
			location: input.location?.trim() || "",
			contact_method: input.contactMethod,
			contact_value: input.contactValue.trim(),
			audience_scope: input.audienceScope,
			published_at: input.status === "Draft" ? null : (/* @__PURE__ */ new Date()).toISOString()
		}).select("id").single();
		if (error) throw error;
		const listingId = String(created["id"]);
		await syncListingChildren(supabase, listingId, input);
		const full = await this.getListingById(listingId);
		if (!full) throw new Error("Listing was saved but could not be reloaded.");
		return full;
	},
	async updateListing(listingId, input) {
		const supabase = requireSupabase();
		const { error } = await supabase.from("listings").update({
			listing_type: input.listingType,
			title: input.title.trim(),
			description: input.description.trim(),
			category_id: input.categoryId,
			price: input.price,
			price_type: input.priceType,
			status: input.status ?? "Active",
			condition: input.listingType === "product" ? input.condition || "New" : null,
			location: input.location?.trim() || "",
			contact_method: input.contactMethod,
			contact_value: input.contactValue.trim(),
			audience_scope: input.audienceScope
		}).eq("id", listingId);
		if (error) throw error;
		await syncListingChildren(supabase, listingId, input);
		const full = await this.getListingById(listingId);
		if (!full) throw new Error("Updated listing could not be reloaded.");
		return full;
	},
	async updateListingStatus(listingId, status) {
		const { error } = await requireSupabase().from("listings").update({ status }).eq("id", listingId);
		if (error) throw error;
	},
	async archiveListing(listingId) {
		const { error } = await requireSupabase().from("listings").update({ status: "Archived" }).eq("id", listingId);
		if (error) throw error;
	},
	async uploadListingImage(file) {
		const supabase = requireSupabase();
		if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new UserInputError("Only JPG, PNG, WebP or AVIF images are allowed.");
		if (file.size > 5242880) throw new UserInputError("Images must be 5 MB or smaller.");
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Sign in to upload images.");
		const optimized = await compressImageFile(file, 1400, .84);
		const ext = {
			"image/jpeg": "jpg",
			"image/png": "png",
			"image/webp": "webp",
			"image/avif": "avif"
		}[optimized.type] || "jpg";
		const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;
		const { error } = await supabase.storage.from("listing-images").upload(storagePath, optimized, {
			upsert: false,
			contentType: optimized.type,
			cacheControl: "31536000"
		});
		if (error) throw error;
		const { data } = supabase.storage.from("listing-images").getPublicUrl(storagePath);
		return {
			imageUrl: data.publicUrl,
			storagePath
		};
	},
	async removeListingStorageObject(storagePath) {
		const client = getSupabaseClient();
		if (!client || !storagePath) return;
		await client.storage.from("listing-images").remove([storagePath]);
	},
	resolveUniversityIdsFromNames(audienceNames, universitiesList) {
		if (audienceNames.includes("All Universities")) return {
			scope: "all",
			universityIds: []
		};
		const ids = audienceNames.map((name) => universitiesList.find((u) => u.short_name === name || u.university_name === name || u.slug === name || u.id === name)?.id).filter((id) => Boolean(id));
		return {
			scope: ids.length > 1 ? "multiple" : "single",
			universityIds: ids
		};
	}
};
async function syncListingChildren(supabase, listingId, input) {
	await supabase.from("listing_images").delete().eq("listing_id", listingId);
	if (input.images.length > 0) {
		const { error: imgErr } = await supabase.from("listing_images").insert(input.images.map((img, index) => ({
			listing_id: listingId,
			image_url: img.imageUrl,
			storage_path: img.storagePath ?? null,
			display_order: index
		})));
		if (imgErr) throw imgErr;
	}
	if (input.listingType === "product") {
		const { error: pdErr } = await supabase.from("product_details").upsert({
			listing_id: listingId,
			condition: input.condition || "New",
			brand: input.brand?.trim() || null,
			stock_status: input.stockStatus || "In stock"
		});
		if (pdErr) throw pdErr;
	} else {
		const { error: sdErr } = await supabase.from("service_details").upsert({
			listing_id: listingId,
			starting_price: input.price,
			duration: input.duration?.trim() || null,
			service_area: input.serviceArea?.trim() || null,
			delivery_method: input.deliveryMethod?.trim() || null
		});
		if (sdErr) throw sdErr;
	}
	await supabase.from("listing_universities").delete().eq("listing_id", listingId);
	if (input.audienceScope !== "all" && input.universityIds.length > 0) {
		const { error: uniErr } = await supabase.from("listing_universities").insert(input.universityIds.map((universityId) => ({
			listing_id: listingId,
			university_id: universityId
		})));
		if (uniErr) throw uniErr;
	}
}
function mapSellerRowToListing(row, sellerName, fallbackUni, ownerEmail) {
	const images = (row["images"] || []).slice().sort((a, b) => a.display_order - b.display_order).map((i) => i.image_url).filter((url) => isSafeMediaUrl(url));
	const targets = row["targets"] || [];
	const category = row["category"];
	const prod = row["product_details"];
	const serv = row["service_details"];
	const audienceScope = row["audience_scope"];
	const audience = audienceScope === "all" ? ["All Universities"] : targets.map((t) => t.university?.short_name || t.university?.university_name || "").filter(Boolean);
	const rawStatus = row["status"];
	return {
		id: String(row["id"]),
		sellerId: String(row["seller_id"]),
		title: String(row["title"]),
		slug: String(row["slug"]),
		type: row["listing_type"],
		category: category?.name || "Others",
		categoryId: String(row["category_id"]),
		price: Number(row["price"] ?? 0),
		priceType: row["price_type"],
		currency: String(row["currency"] || "GHS"),
		image: images[0] || "",
		images,
		seller: sellerName,
		university: audience[0] && audience[0] !== "All Universities" ? audience[0] : fallbackUni,
		audience: audience.length ? audience : [fallbackUni],
		audienceScope,
		description: String(row["description"]),
		condition: prod?.condition || row["condition"] || void 0,
		brand: prod?.brand || void 0,
		stockStatus: prod?.stock_status || void 0,
		duration: serv?.duration || void 0,
		serviceArea: serv?.service_area || void 0,
		deliveryMethod: serv?.delivery_method || void 0,
		location: row["location"] || void 0,
		time: formatRelativeTime(row["published_at"] || row["created_at"]),
		status: rawStatus === "Active" || rawStatus === "Paused" || rawStatus === "Sold" || rawStatus === "Unavailable" ? rawStatus : "Paused",
		rawStatus,
		views: Number(row["view_count"] || 0),
		likes: Number(row["like_count"] || 0),
		favoriteCount: Number(row["favorite_count"] || 0),
		contactClicks: Number(row["contact_click_count"] || 0),
		featured: Boolean(row["is_featured"]),
		ownerEmail,
		contact: String(row["contact_value"] || ""),
		contactMethod: String(row["contact_method"] || "WhatsApp"),
		postedAt: new Date(row["published_at"] || row["created_at"]).getTime()
	};
}
var ANON_FAVORITES_KEY = "cl_anon_saved_v1";
var favoriteService = {
	getAnonymousFavorites() {
		if (typeof window === "undefined") return [];
		try {
			const raw = window.localStorage.getItem(ANON_FAVORITES_KEY);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
		} catch {
			return [];
		}
	},
	setAnonymousFavorites(ids) {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(ANON_FAVORITES_KEY, JSON.stringify(Array.from(new Set(ids))));
		} catch {}
	},
	async listFavorites() {
		const client = getSupabaseClient();
		if (!client) return this.getAnonymousFavorites();
		const user = await getSessionUser(client);
		if (!user) return this.getAnonymousFavorites();
		const { data, error } = await client.from("favorites").select("listing_id").eq("user_id", user.id).order("created_at", { ascending: false });
		if (error) throw error;
		return (data || []).map((row) => String(row["listing_id"]));
	},
	async saveFavorite(listingId) {
		const client = getSupabaseClient();
		const user = client ? await getSessionUser(client) : null;
		if (!client || !user) {
			const current = this.getAnonymousFavorites();
			if (!current.includes(listingId)) this.setAnonymousFavorites([...current, listingId]);
			return;
		}
		const { error } = await client.from("favorites").upsert({
			user_id: user.id,
			listing_id: listingId
		}, { onConflict: "user_id,listing_id" });
		if (error) throw error;
	},
	async removeFavorite(listingId) {
		const client = getSupabaseClient();
		const user = client ? await getSessionUser(client) : null;
		if (!client || !user) {
			this.setAnonymousFavorites(this.getAnonymousFavorites().filter((id) => id !== listingId));
			return;
		}
		const { error } = await client.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
		if (error) throw error;
	}
};
var reportService = { async submitReport(input) {
	const supabase = requireSupabase();
	const user = await getSessionUser(supabase);
	const { error } = await supabase.from("reports").insert({
		reporter_id: user?.id ?? null,
		listing_id: input.listingId,
		reported_user_id: input.reportedUserId ?? null,
		reason: input.reason,
		description: (input.description || "").trim().slice(0, 1500),
		status: "open"
	});
	if (error) throw error;
} };
var NOTIFICATION_COLUMNS = "id, user_id, title, message, notification_type, is_read, metadata, created_at";
var notificationService = {
	async listNotifications(limit = 25) {
		const client = getSupabaseClient();
		if (!client) return [];
		const user = await getSessionUser(client);
		if (!user) return [];
		const { data, error } = await client.from("notifications").select(NOTIFICATION_COLUMNS).eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit);
		if (error) throw error;
		return data || [];
	},
	async markAsRead(notificationId) {
		const { error } = await requireSupabase().from("notifications").update({ is_read: true }).eq("id", notificationId);
		if (error) throw error;
	},
	async markAllAsRead() {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) return;
		const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
		if (error) throw error;
	},
	async updatePreferences(preferences) {
		const supabase = requireSupabase();
		const user = await getSessionUser(supabase);
		if (!user) throw new Error("Authentication required");
		const { error } = await supabase.from("profiles").update({ notification_preferences: preferences }).eq("id", user.id);
		if (error) throw error;
	},
	subscribeToRealtimeNotifications(userId, onInsert) {
		const client = getSupabaseClient();
		if (!client || !userId) return () => void 0;
		const channel = client.channel(`notifications:${userId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${userId}`
		}, (payload) => {
			const row = payload.new;
			if (row?.id) onInsert(row);
		}).subscribe();
		return () => {
			client.removeChannel(channel);
		};
	}
};
var _jsxFileName = "/app/applet/src/components/campus/store.tsx";
var NOTIF_PROMPTED_KEY = "cl_notif_prompted_v1";
var THEME_STORAGE_KEY = "cl_theme_v1";
function mapProfileToUser(profile, uniList) {
	const matchedUni = uniList.find((u) => u.id === profile.primary_university_id);
	const universityName = matchedUni?.short_name || matchedUni?.university_name || "Ghana Campus";
	return {
		id: profile.id,
		name: profile.full_name,
		username: profile.username,
		email: profile.email,
		university: universityName,
		primaryUniversityId: profile.primary_university_id,
		capability: profile.account_type,
		bio: profile.bio || "",
		contact: profile.preferred_contact_method || "WhatsApp",
		contactDetails: profile.whatsapp_number || profile.phone_number || void 0,
		phoneNumber: profile.phone_number,
		whatsappNumber: profile.whatsapp_number,
		avatar: profile.profile_image || void 0,
		role: profile.role,
		verificationStatus: profile.verification_status,
		isStudent: profile.is_student,
		idDocumentType: profile.id_document_type,
		idDocumentPath: profile.id_document_path,
		verificationPhotoConfirmed: profile.verification_photo_confirmed,
		verificationSubmittedAt: profile.verification_submitted_at,
		verificationNote: profile.verification_note,
		verificationChecks: profile.verification_checks ?? null,
		isSuspended: profile.is_suspended,
		subscriptionTier: profile.subscription_tier ?? "free_launch",
		subscriptionStatus: profile.subscription_status ?? "active",
		subscriptionExpiresAt: profile.subscription_expires_at ?? null,
		notificationPreferences: profile.notification_preferences
	};
}
var CampusContext = (0, import_react.createContext)(null);
function detectStandalone() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function CampusProvider({ children }) {
	const [backendConfigured] = (0, import_react.useState)(isSupabaseConfigured);
	const [schemaReady, setSchemaReady] = (0, import_react.useState)(isSupabaseConfigured);
	const [listingsLoading, setListingsLoading] = (0, import_react.useState)(isSupabaseConfigured);
	const [listingsError, setListingsError] = (0, import_react.useState)(null);
	const [authLoading, setAuthLoading] = (0, import_react.useState)(isSupabaseConfigured);
	const [myUniversity, setMyUniversity] = (0, import_react.useState)("KNUST");
	const [university, setUniversity] = (0, import_react.useState)("KNUST");
	const [dbUniversities, setDbUniversities] = (0, import_react.useState)([]);
	const [dbCategories, setDbCategories] = (0, import_react.useState)([]);
	const [user, setUserState] = (0, import_react.useState)(null);
	const [listings, setListings] = (0, import_react.useState)([]);
	const [myListings, setMyListings] = (0, import_react.useState)([]);
	const [saved, setSaved] = (0, import_react.useState)(() => typeof window !== "undefined" ? favoriteService.getAnonymousFavorites() : []);
	const [liked, setLiked] = (0, import_react.useState)([]);
	const [contacts, setContacts] = (0, import_react.useState)([]);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [isStandalone, setIsStandalone] = (0, import_react.useState)(false);
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	const [isMacSafari, setIsMacSafari] = (0, import_react.useState)(false);
	const [canNativeInstall, setCanNativeInstall] = (0, import_react.useState)(false);
	const [buyerInstallOpen, setBuyerInstallOpen] = (0, import_react.useState)(false);
	const [sellerPostAuthStage, setSellerPostAuthStage] = (0, import_react.useState)("none");
	const [manualInstallOpen, setManualInstallOpen] = (0, import_react.useState)(false);
	const [notificationsEnabled, setNotificationsEnabled] = (0, import_react.useState)(false);
	const deferredPromptRef = (0, import_react.useRef)(null);
	const dbUniversitiesRef = (0, import_react.useRef)([]);
	dbUniversitiesRef.current = dbUniversities;
	const universityNames = (0, import_react.useMemo)(() => dbUniversities.length > 0 ? dbUniversities.filter((u) => u.is_active).map((u) => u.short_name || u.university_name) : universities, [dbUniversities]);
	const productCategoryNames = (0, import_react.useMemo)(() => {
		const active = dbCategories.filter((c) => c.is_active && c.category_type === "product");
		return active.length > 0 ? active.map((c) => c.name) : productCategories;
	}, [dbCategories]);
	const serviceCategoryNames = (0, import_react.useMemo)(() => {
		const active = dbCategories.filter((c) => c.is_active && c.category_type === "service");
		return active.length > 0 ? active.map((c) => c.name) : serviceCategories;
	}, [dbCategories]);
	const refreshMetadata = (0, import_react.useCallback)(async () => {
		if (!isSupabaseConfigured) return;
		try {
			const [unis, cats] = await Promise.all([universityService.listActiveUniversities(), categoryService.listActiveCategories()]);
			setSchemaReady(true);
			setDbUniversities(unis);
			setDbCategories(cats);
		} catch (err) {
			if (isSchemaMissingError(err)) setSchemaReady(false);
		}
	}, []);
	const refreshListings = (0, import_react.useCallback)(async () => {
		if (!isSupabaseConfigured) {
			setListingsLoading(false);
			setListings([]);
			return;
		}
		setListingsLoading(true);
		setListingsError(null);
		try {
			const { items } = await listingService.searchListings({
				universityFilter: university === "All Universities" ? null : university,
				limit: 24,
				offset: 0
			});
			setSchemaReady(true);
			setListings(items);
		} catch (err) {
			if (isSchemaMissingError(err)) setSchemaReady(false);
			setListingsError(toUserSafeErrorMessage(err));
			setListings([]);
		} finally {
			setListingsLoading(false);
		}
	}, [university]);
	const refreshMyListings = (0, import_react.useCallback)(async () => {
		if (!isSupabaseConfigured) return;
		try {
			const mine = await listingService.getMyListings();
			setMyListings(mine);
		} catch {
			setMyListings([]);
		}
	}, []);
	const refreshNotifications = (0, import_react.useCallback)(async () => {
		if (!isSupabaseConfigured) return;
		try {
			const items = await notificationService.listNotifications(25);
			setNotifications(items);
		} catch {
			setNotifications([]);
		}
	}, []);
	const activeUserIdRef = (0, import_react.useRef)(null);
	const resetPrivateUserState = (0, import_react.useCallback)((clearVisitorCaches = false) => {
		setUserState(null);
		setMyListings([]);
		setNotifications([]);
		setLiked([]);
		setContacts([]);
		setSellerPostAuthStage("none");
		setSaved(favoriteService.getAnonymousFavorites());
		if (clearVisitorCaches) {
			clearAnalyticsSessionCache();
			resetVisitorSessionId();
		}
	}, []);
	const refreshProfile = (0, import_react.useCallback)(async () => {
		if (!isSupabaseConfigured) {
			setAuthLoading(false);
			return null;
		}
		try {
			const session = await authenticationService.getSession();
			const nextUid = session?.user?.id ?? null;
			if (!nextUid || !session?.user) {
				const hadPrevUser = activeUserIdRef.current !== null;
				activeUserIdRef.current = null;
				resetPrivateUserState(hadPrevUser);
				setAuthLoading(false);
				return null;
			}
			if (activeUserIdRef.current && activeUserIdRef.current !== nextUid) resetPrivateUserState(true);
			activeUserIdRef.current = nextUid;
			const [profile, unis] = await Promise.all([profileService.getMyProfile(session.user.id).catch((err) => {
				if (isSchemaMissingError(err)) setSchemaReady(false);
				return null;
			}), dbUniversitiesRef.current.length > 0 ? Promise.resolve(dbUniversitiesRef.current) : universityService.listActiveUniversities().catch((err) => {
				if (isSchemaMissingError(err)) setSchemaReady(false);
				return [];
			})]);
			if (unis.length > 0 && dbUniversitiesRef.current.length === 0) setDbUniversities(unis);
			let resolvedUser;
			if (profile) {
				resolvedUser = mapProfileToUser(profile, unis);
				setUserState(resolvedUser);
				setMyUniversity(resolvedUser.university);
			} else {
				resolvedUser = {
					id: session.user.id,
					name: String(session.user.user_metadata?.["full_name"] || "Campus Seller"),
					email: session.user.email || "",
					university: String(session.user.user_metadata?.["university_name"] || "Ghana Campus"),
					capability: String(session.user.user_metadata?.["account_type"] || "Both"),
					isStudent: session.user.user_metadata?.["is_student"] !== false,
					verificationStatus: "unverified",
					subscriptionTier: "free_launch",
					subscriptionStatus: "active",
					subscriptionExpiresAt: null,
					bio: "",
					contact: "WhatsApp"
				};
				setUserState(resolvedUser);
			}
			const [favIds, mine, notifs] = await Promise.all([
				favoriteService.listFavorites().catch(() => favoriteService.getAnonymousFavorites()),
				listingService.getMyListings().catch(() => []),
				notificationService.listNotifications(25).catch(() => [])
			]);
			setSaved(favIds);
			setMyListings(mine);
			setNotifications(notifs);
			return resolvedUser;
		} catch {
			return null;
		} finally {
			setAuthLoading(false);
		}
	}, [resetPrivateUserState]);
	(0, import_react.useEffect)(() => {
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const resolvedTheme = savedTheme || (prefersDark ? "dark" : "light");
		setTheme(resolvedTheme);
		document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
		document.documentElement.style.colorScheme = resolvedTheme;
		setIsStandalone(detectStandalone());
		const ua = navigator.userAgent;
		const iosDevice = /iPad|iPhone|iPod/.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
		setIsIOS(iosDevice);
		setIsMacSafari(/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua));
		if ("Notification" in window) setNotificationsEnabled(Notification.permission === "granted");
		if ("serviceWorker" in navigator) {
			const registerSW = () => {
				navigator.serviceWorker.register("/sw.js").catch(() => void 0);
			};
			if (document.readyState === "complete") registerSW();
			else window.addEventListener("load", registerSW, { once: true });
		}
		const onBeforeInstallPrompt = (event) => {
			event.preventDefault();
			deferredPromptRef.current = event;
			setCanNativeInstall(true);
		};
		const onAppInstalled = () => {
			deferredPromptRef.current = null;
			setCanNativeInstall(false);
			setIsStandalone(true);
			setBuyerInstallOpen(false);
			setManualInstallOpen(false);
			setSellerPostAuthStage((prev) => prev === "install" ? "none" : prev);
		};
		window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
		window.addEventListener("appinstalled", onAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
			window.removeEventListener("appinstalled", onAppInstalled);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured) return;
		Promise.all([refreshMetadata(), refreshProfile()]);
		const sub = authenticationService.onAuthStateChange((event, session) => {
			if (event === "INITIAL_SESSION") return;
			if (event === "SIGNED_OUT") {
				activeUserIdRef.current = null;
				resetPrivateUserState(true);
				setAuthLoading(false);
				return;
			}
			const nextUid = session?.user?.id ?? null;
			if (event === "TOKEN_REFRESHED" && nextUid === activeUserIdRef.current) return;
			refreshProfile();
		});
		return () => sub.unsubscribe();
	}, [
		refreshMetadata,
		refreshProfile,
		resetPrivateUserState
	]);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured) return;
		refreshListings();
	}, [refreshListings]);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured || !user?.id) return;
		if (notificationsEnabled) syncPushSubscriptionForCurrentUser();
		return notificationService.subscribeToRealtimeNotifications(user.id, (row) => {
			setNotifications((prev) => prev.some((n) => n.id === row.id) ? prev : [row, ...prev]);
			showDeviceNotification({
				title: row.title,
				body: row.message,
				url: "/dashboard",
				tag: row.id
			});
		});
	}, [notificationsEnabled, user?.id]);
	const toggleTheme = (0, import_react.useCallback)(() => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			localStorage.setItem(THEME_STORAGE_KEY, next);
			document.documentElement.classList.toggle("dark", next === "dark");
			document.documentElement.style.colorScheme = next;
			return next;
		});
	}, []);
	const triggerNativeInstall = (0, import_react.useCallback)(async () => {
		const promptEvent = deferredPromptRef.current;
		if (!promptEvent) return "unavailable";
		try {
			await promptEvent.prompt();
			const { outcome } = await promptEvent.userChoice;
			if (outcome === "accepted") {
				deferredPromptRef.current = null;
				setCanNativeInstall(false);
			}
			return outcome;
		} catch {
			return "unavailable";
		}
	}, []);
	const triggerBuyerInstallPrompt = (0, import_react.useCallback)(() => {
		if (detectStandalone()) return;
		setBuyerInstallOpen(true);
	}, []);
	const closeBuyerInstallPrompt = (0, import_react.useCallback)(() => {
		setBuyerInstallOpen(false);
	}, []);
	const requestAppNotifications = (0, import_react.useCallback)(async () => {
		if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
		try {
			const permission = await Notification.requestPermission();
			localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
			const granted = permission === "granted";
			setNotificationsEnabled(granted);
			if (granted) syncPushSubscriptionForCurrentUser();
			return permission;
		} catch {
			localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
			return "denied";
		}
	}, []);
	const triggerSellerPostAuth = (0, import_react.useCallback)(() => {
		const isNotGranted = typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted";
		const isFirstTimePrompt = localStorage.getItem(NOTIF_PROMPTED_KEY) !== "1";
		if (isNotGranted && isFirstTimePrompt) {
			setSellerPostAuthStage("notifications");
			return;
		}
		if (!detectStandalone()) setSellerPostAuthStage("install");
		else setSellerPostAuthStage("none");
	}, []);
	const completeNotificationStep = (0, import_react.useCallback)((_enabled) => {
		localStorage.setItem(NOTIF_PROMPTED_KEY, "1");
		if (!detectStandalone()) setSellerPostAuthStage("install");
		else setSellerPostAuthStage("none");
	}, []);
	const dismissSellerPrompts = (0, import_react.useCallback)(() => {
		setSellerPostAuthStage("none");
	}, []);
	const openInstallPrompt = (0, import_react.useCallback)(() => {
		setManualInstallOpen(true);
	}, []);
	const closeInstallPrompt = (0, import_react.useCallback)(() => {
		setManualInstallOpen(false);
	}, []);
	const listingsRef = (0, import_react.useRef)(listings);
	listingsRef.current = listings;
	const setUser = (0, import_react.useCallback)((next) => {
		setUserState(next);
		if (next) setMyUniversity(next.university);
	}, []);
	const signOutUser = (0, import_react.useCallback)(async () => {
		await removePushSubscriptionForCurrentUser();
		if (isSupabaseConfigured) await authenticationService.signOut();
		activeUserIdRef.current = null;
		resetPrivateUserState(true);
	}, [resetPrivateUserState]);
	const selectedUniversityId = (0, import_react.useMemo)(() => dbUniversities.find((u) => u.short_name === university || u.university_name === university)?.id ?? null, [dbUniversities, university]);
	const recordView = (0, import_react.useCallback)((id, source = "marketplace") => {
		if (!isSupabaseConfigured) return;
		analyticsService.recordView(id, selectedUniversityId, source).then((recorded) => {
			if (recorded) setListings((prev) => prev.map((l) => l.id === id ? {
				...l,
				views: l.views + 1
			} : l));
		});
	}, [selectedUniversityId]);
	const recordContact = (0, import_react.useCallback)((id, method = "WhatsApp") => {
		setContacts((prev) => prev.includes(id) ? prev : [...prev, id]);
		if (!isSupabaseConfigured) return;
		analyticsService.recordContactClick(id, method, selectedUniversityId);
	}, [selectedUniversityId]);
	const reportListing = (0, import_react.useCallback)(async (listingId, reason, description = "") => {
		if (!isSupabaseConfigured) return false;
		const target = listingsRef.current.find((l) => l.id === listingId);
		await reportService.submitReport({
			listingId,
			reportedUserId: target?.sellerId ?? null,
			reason,
			description
		});
		return true;
	}, []);
	const toggleSave = (0, import_react.useCallback)((id) => {
		setSaved((prev) => {
			const exists = prev.includes(id);
			const next = exists ? prev.filter((v) => v !== id) : [...prev, id];
			if (isSupabaseConfigured && user?.id) (exists ? favoriteService.removeFavorite(id) : favoriteService.saveFavorite(id)).catch(() => void 0);
			else favoriteService.setAnonymousFavorites(next);
			return next;
		});
	}, [user?.id]);
	const toggleLike = (0, import_react.useCallback)((id) => {
		setLiked((prev) => {
			const exists = prev.includes(id);
			setListings((list) => list.map((l) => l.id === id ? {
				...l,
				likes: Math.max(0, l.likes + (exists ? -1 : 1))
			} : l));
			if (isSupabaseConfigured) analyticsService.toggleLike(id).catch(() => void 0);
			return exists ? prev.filter((v) => v !== id) : [...prev, id];
		});
	}, []);
	const markNotificationRead = (0, import_react.useCallback)(async (id) => {
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			is_read: true
		} : n));
		if (isSupabaseConfigured) await notificationService.markAsRead(id);
	}, []);
	const markAllNotificationsRead = (0, import_react.useCallback)(async () => {
		setNotifications((prev) => prev.map((n) => ({
			...n,
			is_read: true
		})));
		if (isSupabaseConfigured) await notificationService.markAllAsRead();
	}, []);
	const unreadNotificationCount = (0, import_react.useMemo)(() => notifications.filter((n) => !n.is_read).length, [notifications]);
	const contextValue = (0, import_react.useMemo)(() => ({
		backendConfigured,
		schemaReady,
		listingsLoading,
		listingsError,
		authLoading,
		university,
		setUniversity,
		myUniversity,
		setMyUniversity,
		dbUniversities,
		universityNames,
		dbCategories,
		productCategoryNames,
		serviceCategoryNames,
		refreshMetadata,
		refreshListings,
		user,
		setUser,
		signOutUser,
		refreshProfile,
		listings,
		setListings,
		myListings,
		refreshMyListings,
		saved,
		toggleSave,
		liked,
		toggleLike,
		contacts,
		recordContact,
		recordView,
		reportListing,
		notifications,
		unreadNotificationCount,
		refreshNotifications,
		markNotificationRead,
		markAllNotificationsRead,
		theme,
		toggleTheme,
		isStandalone,
		isIOS,
		isMacSafari,
		canNativeInstall,
		triggerNativeInstall,
		buyerInstallOpen,
		triggerBuyerInstallPrompt,
		closeBuyerInstallPrompt,
		sellerPostAuthStage,
		triggerSellerPostAuth,
		completeNotificationStep,
		dismissSellerPrompts,
		manualInstallOpen,
		openInstallPrompt,
		closeInstallPrompt,
		notificationsEnabled,
		requestAppNotifications
	}), [
		backendConfigured,
		schemaReady,
		listingsLoading,
		listingsError,
		authLoading,
		university,
		myUniversity,
		dbUniversities,
		universityNames,
		dbCategories,
		productCategoryNames,
		serviceCategoryNames,
		refreshMetadata,
		refreshListings,
		user,
		setUser,
		signOutUser,
		refreshProfile,
		listings,
		myListings,
		refreshMyListings,
		saved,
		toggleSave,
		liked,
		toggleLike,
		contacts,
		recordContact,
		recordView,
		reportListing,
		notifications,
		unreadNotificationCount,
		refreshNotifications,
		markNotificationRead,
		markAllNotificationsRead,
		theme,
		toggleTheme,
		isStandalone,
		isIOS,
		isMacSafari,
		canNativeInstall,
		triggerNativeInstall,
		buyerInstallOpen,
		triggerBuyerInstallPrompt,
		closeBuyerInstallPrompt,
		sellerPostAuthStage,
		triggerSellerPostAuth,
		completeNotificationStep,
		dismissSellerPrompts,
		manualInstallOpen,
		openInstallPrompt,
		closeInstallPrompt,
		notificationsEnabled,
		requestAppNotifications
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CampusContext.Provider, {
		value: contextValue,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 830,
		columnNumber: 10
	}, this);
}
function useCampus() {
	const value = (0, import_react.useContext)(CampusContext);
	if (!value) throw new Error("CampusProvider is required");
	return value;
}
//#endregion
export { ownsListing as A, invalidateCategoryCache as C, isSchemaMissingError as D, isSafeMediaUrl as E, universityService as F, useCampus as I, validateListing as L, profileService as M, requireSupabase as N, listingService as O, toUserSafeErrorMessage as P, validatePassword as R, inspectVerificationImage as S, isPushSupported as T, compressImageFile as _, DialogContent as a, getSessionUser as b, TECHNICAL_ISSUE_MESSAGE as c, authenticationService as d, buildPhoneHref as f, cn as g, checkIdAndProfilePair as h, Dialog as i, priceTypes as j, notificationService as k, UserInputError as l, categoryService as m, Button as n, DialogDescription as o, buildWhatsAppUrl as p, CampusProvider as r, DialogTitle as s, BRAND as t, analyticsService as u, filterListings as v, invalidateUniversityCache as w, getSupabaseClient as x, formatListingPrice as y };
