import { t as BRAND } from "./store-BHsliIVM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meta-BTNnRvC5.js
var SITE_URL = "https://campusloop-gh.vercel.app";
var SITE_TITLE = `${BRAND} – Ghana University Campus Marketplace`;
var SITE_DESCRIPTION = "Buy, sell, and discover verified student products and campus services across Ghanaian universities on CampusLoop. Browse freely without an account.";
var OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;
var pageHead = (title, description, options = {}) => {
	const fullTitle = title.includes("CampusLoop") ? title : `${title} | ${BRAND} Marketplace`;
	const canonicalUrl = `${SITE_URL}${options.path ? options.path === "/" ? "" : options.path.startsWith("/") ? options.path : `/${options.path}` : ""}`;
	const ogImage = options.ogImage || OG_IMAGE_URL;
	const robots = options.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
	return {
		meta: [
			{ title: fullTitle },
			{
				name: "description",
				content: description
			},
			{
				name: "robots",
				content: robots
			},
			{
				property: "og:site_name",
				content: SITE_TITLE
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
				content: options.ogType || "website"
			},
			{
				property: "og:locale",
				content: "en_GH"
			},
			{
				property: "og:url",
				content: canonicalUrl
			},
			{
				property: "og:image",
				content: ogImage
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
				content: "CampusLoop – Ghana University Campus Marketplace"
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
				content: ogImage
			}
		],
		links: options.noIndex ? [] : [{
			rel: "canonical",
			href: canonicalUrl
		}]
	};
};
//#endregion
export { pageHead as a, SITE_URL as i, SITE_DESCRIPTION as n, SITE_TITLE as r, OG_IMAGE_URL as t };
