import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as pageHead } from "./meta-DK7DBi9q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-DlBwi79x.js
var $$splitComponentImporter = () => import("./services-BSzT7Uhz.mjs");
var Route = createFileRoute("/services")({
	validateSearch: (search) => ({
		category: typeof search["category"] === "string" ? search["category"] : void 0,
		maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : void 0,
		q: typeof search["q"] === "string" ? search["q"] : void 0
	}),
	head: () => pageHead("Campus services", "Discover photographers, designers, tutors and service providers serving university communities in Ghana."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
