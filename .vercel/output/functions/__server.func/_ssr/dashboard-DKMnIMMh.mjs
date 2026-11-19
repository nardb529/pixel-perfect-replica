import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DKMnIMMh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/dashboard.tsx?tsr-split=component";
var DashboardPage = (0, import_react.lazy)(() => import("./management-wrgGEGHg.mjs").then((m) => ({ default: m.DashboardPage })));
function DashboardRouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 7,
			columnNumber: 30
		}, this),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DashboardPage, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 8,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 10
	}, this);
}
//#endregion
export { DashboardRouteComponent as component };
