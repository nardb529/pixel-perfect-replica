import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as pageHead } from "./meta-DK7DBi9q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BCZplHQw.js
var $$splitComponentImporter = () => import("./products-GjAkgETj.mjs");
var Route = createFileRoute("/products")({
	validateSearch: (search) => ({
		category: typeof search["category"] === "string" ? search["category"] : void 0,
		maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : void 0,
		q: typeof search["q"] === "string" ? search["q"] : void 0
	}),
	head: () => pageHead("Campus products", "Find electronics, fashion, books and hostel essentials from your Ghanaian university community."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
