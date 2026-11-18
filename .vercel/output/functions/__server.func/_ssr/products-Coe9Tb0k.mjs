import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
import { t as Route } from "./products-CA2kLxL0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-Coe9Tb0k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/products.tsx?tsr-split=component";
var BrowsePage = (0, import_react.lazy)(() => import("./discovery-DJlXN4qS.mjs").then((m) => ({ default: m.BrowsePage })));
function Products() {
	const { category, maxPrice, q } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 18,
			columnNumber: 30
		}, this),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrowsePage, {
			type: "product",
			initialCategory: category,
			initialMaxPrice: maxPrice,
			initialQuery: q
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 10
	}, this);
}
//#endregion
export { Products as component };
