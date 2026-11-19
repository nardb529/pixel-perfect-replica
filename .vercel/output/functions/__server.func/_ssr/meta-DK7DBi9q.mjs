import { t as BRAND } from "./store-3n-kyzhz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meta-DK7DBi9q.js
var DEFAULT_SITE_URL = "https://pixel-perfect-replica-five-psi.vercel.app";
function getCanonicalSiteUrl() {
	const configured = typeof import.meta !== "undefined" && {
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
	}["VITE_SITE_URL"] ? String({
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
	}["VITE_SITE_URL"]).trim() : "";
	if (configured) return configured.replace(/\/+$/, "");
	if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
	return DEFAULT_SITE_URL;
}
function resolveAbsoluteOgImage(imagePath = "/og-marketplace.jpg") {
	if (/^https?:\/\//i.test(imagePath)) return imagePath;
	const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
	return `${getCanonicalSiteUrl()}${normalized}`;
}
var pageHead = (title, description, options) => {
	const fullTitle = `${title} · ${BRAND} Campus Marketplace`;
	const imageUrl = resolveAbsoluteOgImage(options?.imagePath || "/og-marketplace.jpg");
	const imageAlt = options?.imageAlt || `CampusLoop — Ghana University Campus Marketplace for student products and services`;
	return { meta: [
		{ title: fullTitle },
		{
			name: "description",
			content: description
		},
		{
			property: "og:site_name",
			content: `${BRAND} Marketplace`
		},
		{
			property: "og:title",
			content: fullTitle
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: options?.type || "website"
		},
		{
			property: "og:image",
			content: imageUrl
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
			content: imageAlt
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: fullTitle
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: imageUrl
		}
	] };
};
//#endregion
export { pageHead as t };
