import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as pageHead } from "./meta-BTNnRvC5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-fGULnK2f.js
var $$splitComponentImporter = () => import("./services-BVy-04z8.mjs");
var Route = createFileRoute("/services")({
	validateSearch: (search) => ({
		category: typeof search["category"] === "string" ? search["category"] : void 0,
		maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : void 0,
		q: typeof search["q"] === "string" ? search["q"] : void 0
	}),
	head: () => pageHead("Book Student Campus Services", "Find verified photographers, graphic designers, tutors, hair stylists, and tech repair providers across Ghanaian campuses.", { path: "/services" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
