import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as pageHead } from "./meta-BTNnRvC5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post-D-3RmHGq.js
var $$splitComponentImporter = () => import("./post-3culPwi3.mjs");
var Route = createFileRoute("/post")({
	validateSearch: (search) => ({ type: search["type"] === "product" || search["type"] === "service" ? search["type"] : void 0 }),
	head: () => pageHead("Share a product or service", "Create and publish a campus product or service listing on CampusLoop.", {
		path: "/post",
		noIndex: true
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
