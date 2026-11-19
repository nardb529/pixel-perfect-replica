import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
import { t as Route } from "./post-D-3RmHGq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post-3culPwi3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/post.tsx?tsr-split=component";
var PostPage = (0, import_react.lazy)(() => import("./management-wrgGEGHg.mjs").then((m) => ({ default: m.PostPage })));
function PostRoute() {
	const { type } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 14,
			columnNumber: 30
		}, this),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PostPage, { initialType: type }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 10
	}, this);
}
//#endregion
export { PostRoute as component };
