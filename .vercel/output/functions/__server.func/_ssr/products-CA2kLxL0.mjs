import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as pageHead } from "./meta-BTNnRvC5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-CA2kLxL0.js
var $$splitComponentImporter = () => import("./products-Coe9Tb0k.mjs");
var Route = createFileRoute("/products")({
	validateSearch: (search) => ({
		category: typeof search["category"] === "string" ? search["category"] : void 0,
		maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : void 0,
		q: typeof search["q"] === "string" ? search["q"] : void 0
	}),
	head: () => pageHead("Buy & Sell Campus Products", "Shop laptops, phones, textbooks, fashion, food, and hostel essentials from verified student sellers across Ghanaian universities.", { path: "/products" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
