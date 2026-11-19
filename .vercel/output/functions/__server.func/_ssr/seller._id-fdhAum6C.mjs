import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as pageHead } from "./meta-DK7DBi9q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller._id-fdhAum6C.js
var $$splitComponentImporter = () => import("./seller._id-DLyoCVU2.mjs");
var Route = createFileRoute("/seller/$id")({
	head: () => pageHead("Seller Shop Storefront", "Explore all campus products and services from this CampusLoop seller shop. Contact directly on WhatsApp or phone — no buyer account required.", {
		imagePath: "/og-shop.jpg",
		imageAlt: "CampusLoop Seller Shop Storefront — Campus Products and Services",
		type: "profile"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
