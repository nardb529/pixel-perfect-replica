import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as pageHead } from "./meta-DK7DBi9q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post-BHojf4Wu.js
var $$splitComponentImporter = () => import("./post-D1ha-_dJ.mjs");
var Route = createFileRoute("/post")({
	validateSearch: (search) => ({ type: search["type"] === "product" || search["type"] === "service" ? search["type"] : void 0 }),
	head: () => pageHead("Share a product or service", "Create and preview a campus product or service listing."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
