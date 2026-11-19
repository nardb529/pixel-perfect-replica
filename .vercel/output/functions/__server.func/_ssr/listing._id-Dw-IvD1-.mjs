import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { u as PagePendingFallback } from "./shared-DuAW8Ffu.mjs";
import { t as Route } from "./listing._id-BEX-wh-W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing._id-Dw-IvD1-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/listing.$id.tsx?tsr-split=component";
var DetailPage = (0, import_react.lazy)(() => import("./details-B-OGsv_p.mjs").then((m) => ({ default: m.DetailPage })));
function ListingDetail() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PagePendingFallback, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 11,
			columnNumber: 30
		}, this),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DetailPage, { id }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 12,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 11,
		columnNumber: 10
	}, this);
}
//#endregion
export { ListingDetail as component };
