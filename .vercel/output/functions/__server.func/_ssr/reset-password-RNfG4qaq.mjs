import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Tt as ArrowRight, pt as Check, w as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { F as validatePassword, N as useCampus, j as toUserSafeErrorMessage, n as Button, u as authenticationService } from "./store-BHsliIVM.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Logo, h as ThemeToggle } from "./shared-DuAW8Ffu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-RNfG4qaq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/reset-password.tsx?tsr-split=component";
function ResetPasswordPage() {
	const { backendConfigured } = useCampus();
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [checkingSession, setCheckingSession] = (0, import_react.useState)(backendConfigured);
	const [hasRecoverySession, setHasRecoverySession] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!backendConfigured) {
			setCheckingSession(false);
			setHasRecoverySession(false);
			return;
		}
		let active = true;
		authenticationService.getSession().then((session) => {
			if (!active) return;
			setHasRecoverySession(Boolean(session?.user));
		}).finally(() => {
			if (active) setCheckingSession(false);
		});
		const sub = authenticationService.onAuthStateChange((event, session) => {
			if (!active) return;
			if (event === "PASSWORD_RECOVERY" || Boolean(session?.user)) {
				setHasRecoverySession(true);
				setCheckingSession(false);
			}
		});
		return () => {
			active = false;
			sub.unsubscribe();
		};
	}, [backendConfigured]);
	async function onSubmit(e) {
		e.preventDefault();
		const validation = validatePassword(password, confirm);
		if (validation) {
			setError(validation);
			return;
		}
		if (!backendConfigured || !hasRecoverySession) {
			setError("Open the password reset link sent to your email before changing your password.");
			return;
		}
		setError("");
		setSaving(true);
		try {
			await authenticationService.updatePassword(password);
			setDone(true);
			toast.success("Password updated");
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "auth-page",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "auth-main col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "auth-inner surface-panel curve-accent",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Logo, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, { compact: true }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 73,
					columnNumber: 11
				}, this), done ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "modal-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "success-icon",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { size: 32 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 79,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Password updated" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Your account credentials are ready. Continue to your seller studio." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 83,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => navigate({ to: "/dashboard" }),
							children: ["Go to Dashboard", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 16 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 88,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 19
				}, this) : checkingSession ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "modal-body",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Verifying reset link" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Checking your secure recovery session..." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 40
				}, this) : !backendConfigured || !hasRecoverySession ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "modal-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "success-icon",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldAlert, { size: 30 }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Reset link required" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Open the password reset link sent to your email to continue, or request a fresh one from the Sign In screen." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/auth",
								children: "Back to Sign In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 66
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Choose a new password" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Enter a strong password of at least 8 characters to secure your account." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "New password" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 111,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "At least 8 characters",
									autoComplete: "new-password"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 112,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 110,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Confirm new password" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "password",
									required: true,
									minLength: 8,
									value: confirm,
									onChange: (e) => setConfirm(e.target.value),
									placeholder: "Re-enter password",
									autoComplete: "new-password"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 117,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 115,
								columnNumber: 17
							}, this),
							error && /* @__PURE__ */ (void 0)("p", {
								role: "alert",
								className: "form-error",
								children: error
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 120,
								columnNumber: 27
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								className: "auth-submit",
								type: "submit",
								disabled: saving,
								children: [saving ? "Updating password..." : "Update password", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 126,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "auth-browse",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/auth",
							children: "Back to Sign In"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 22
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 72,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 71,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 70,
		columnNumber: 10
	}, this);
}
//#endregion
export { ResetPasswordPage as component };
