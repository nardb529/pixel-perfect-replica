import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { B as MailCheck, C as ShieldCheck, Tt as ArrowRight, et as Eye, tt as EyeOff, ut as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { I as useCampus, P as toUserSafeErrorMessage, R as validatePassword, a as DialogContent, c as TECHNICAL_ISSUE_MESSAGE, d as authenticationService, i as Dialog, n as Button, o as DialogDescription, s as DialogTitle, t as BRAND } from "./store-3n-kyzhz.mjs";
import { S as useNavigate, b as Link, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Logo, g as ThemeToggle, l as PageBackButton, t as AnimatedSelect } from "./shared-CshecdmH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CUUH76AB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/auth.tsx";
function AuthPage() {
	const [mode, setMode] = (0, import_react.useState)("signup");
	const [isStudent, setIsStudent] = (0, import_react.useState)(true);
	const [show, setShow] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [verificationPendingEmail, setVerificationPendingEmail] = (0, import_react.useState)(null);
	const [forgot, setForgot] = (0, import_react.useState)(false);
	const [forgotEmail, setForgotEmail] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const { backendConfigured, authLoading, user, universityNames, dbUniversities, refreshProfile, triggerSellerPostAuth } = useCampus();
	const navigate = useNavigate();
	if (!authLoading && user) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, {
		to: user.role === "admin" ? "/admin" : "/dashboard",
		replace: true
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 41,
		columnNumber: 12
	}, this);
	async function submit(e) {
		e.preventDefault();
		setError("");
		const data = new FormData(e.currentTarget);
		const email = String(data.get("email") || "").trim().toLowerCase();
		const password = String(data.get("password") || "");
		const confirm = mode === "signup" ? String(data.get("confirm") || "") : void 0;
		const validation = validatePassword(password, confirm);
		if (validation) {
			setError(validation);
			return;
		}
		const chosenUniName = String(data.get("university") || universityNames[0] || "KNUST");
		const chosenCapability = String(data.get("capability") || "Both");
		const fullName = String(data.get("name") || "").trim() || "Campus Seller";
		const fallbackUsername = String(data.get("username") || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "") || `${email.split("@")[0]?.replace(/[^a-z0-9_.-]/g, "") || "seller"}-${Math.floor(100 + Math.random() * 900)}`;
		const whatsapp = String(data.get("whatsapp") || "").trim();
		if (!backendConfigured) {
			setError(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		setSubmitting(true);
		try {
			if (mode === "signup") {
				const matchedUni = dbUniversities.find((u) => u.short_name === chosenUniName || u.university_name === chosenUniName);
				if ((await authenticationService.signUp({
					email,
					password,
					fullName,
					username: fallbackUsername,
					accountType: chosenCapability,
					primaryUniversityId: matchedUni?.id ?? null,
					universityName: chosenUniName,
					phoneNumber: whatsapp || void 0,
					whatsappNumber: whatsapp || void 0,
					isStudent
				})).needsEmailConfirmation) {
					setVerificationPendingEmail(email);
					toast.success("Check your inbox to verify your email address");
					return;
				}
			} else await authenticationService.signIn(email, password);
			const signedInUser = await refreshProfile();
			triggerSellerPostAuth();
			navigate({ to: signedInUser?.role === "admin" ? "/admin" : "/dashboard" });
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	}
	async function resendConfirmation() {
		if (!verificationPendingEmail) return;
		try {
			await authenticationService.resendVerificationEmail(verificationPendingEmail);
			toast.success("Verification email resent");
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	async function requestPasswordReset(e) {
		e.preventDefault();
		if (!forgotEmail.trim()) return;
		if (!backendConfigured) {
			toast.error(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		try {
			await authenticationService.sendPasswordResetEmail(forgotEmail);
			setSent(true);
		} catch (err) {
			toast.error(toUserSafeErrorMessage(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "auth-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "auth-aside",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "auth-aside-head",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Logo, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, { compact: true }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 142,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "auth-aside-copy surface-panel curve-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { children: "Sell safely across Ghanaian campuses." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Buyers never need an account to browse or contact sellers. Seller accounts require ID and photo verification before listing." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "auth-aside-points",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Students verify with a Student ID & real profile photo" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 153,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 158,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Non-students verify with a Ghana Card or Voter's ID" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 159,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 157,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Zero account required for buyers — direct campus chat" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 146,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 141,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "auth-main",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "auth-inner surface-panel curve-accent",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageBackButton, {
							fallbackTo: "/discover",
							label: "Back"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 172,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "auth-mobile-top mb-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Logo, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeToggle, { compact: true }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 173,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 171,
						columnNumber: 11
					}, this), verificationPendingEmail ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "modal-body",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "success-icon",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MailCheck, { size: 32 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 182,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Verify your email" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 184,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"We sent a confirmation link to ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: verificationPendingEmail }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 186,
									columnNumber: 48
								}, this),
								". Open your inbox and confirm your email to activate your seller dashboard."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 185,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								onClick: resendConfirmation,
								children: "Resend confirmation email"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									setVerificationPendingEmail(null);
									setMode("login");
								},
								children: "Back to sign in"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 192,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 180,
						columnNumber: 13
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: mode === "signup" ? "Create seller account" : "Welcome back" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 205,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: mode === "signup" ? "Set up one account to list products, offer services, or both." : "Sign in to manage your listings and enquiries." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 206,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "segmented",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "ghost",
								className: mode === "signup" ? "selected" : "",
								onClick: () => {
									setMode("signup");
									setError("");
								},
								children: "Sign Up"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 213,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "ghost",
								className: mode === "login" ? "selected" : "",
								onClick: () => {
									setMode("login");
									setError("");
								},
								children: "Log In"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 224,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 212,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							onSubmit: submit,
							children: [
								mode === "signup" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (void 0)("div", {
									className: "form-grid",
									children: [/* @__PURE__ */ (void 0)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Full name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 242,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("input", {
											name: "name",
											required: true,
											placeholder: "Ama Mensah",
											autoComplete: "name"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 243,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 241,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (void 0)("span", { children: "Username" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("input", {
											name: "username",
											placeholder: "amatech_knust",
											autoComplete: "username"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 247,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 240,
									columnNumber: 21
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 239,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Email address" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 258,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "email",
										name: "email",
										required: true,
										placeholder: "you@example.com",
										autoComplete: "email"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 259,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 257,
									columnNumber: 17
								}, this),
								mode === "signup" && /* @__PURE__ */ (void 0)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (void 0)("span", { children: "WhatsApp / Phone number" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 270,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "tel",
										name: "whatsapp",
										placeholder: "+233 24 000 0000",
										autoComplete: "tel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 271,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 269,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "form-field",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Password" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 281,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "password-input",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: show ? "text" : "password",
											name: "password",
											required: true,
											placeholder: "At least 8 characters",
											autoComplete: mode === "signup" ? "new-password" : "current-password"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 283,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "ghost",
											size: "icon",
											type: "button",
											"aria-label": show ? "Hide password" : "Show password",
											onClick: () => setShow(!show),
											children: show ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { size: 17 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 297,
												columnNumber: 31
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { size: 17 }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 297,
												columnNumber: 54
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 290,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 282,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 280,
									columnNumber: 17
								}, this),
								mode === "signup" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "form-field",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Confirm password" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 305,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: show ? "text" : "password",
											name: "confirm",
											required: true,
											placeholder: "Re-enter password",
											autoComplete: "new-password"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 306,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 304,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "form-grid",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "form-field",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "University" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 316,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
												name: "university",
												ariaLabel: "University",
												kicker: "Choose your university",
												defaultValue: universityNames[0] || "KNUST",
												options: universityNames
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 317,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 315,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "form-field",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Account type" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 326,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatedSelect, {
												name: "capability",
												ariaLabel: "Account type",
												kicker: "Seller capability",
												defaultValue: "Both",
												options: [
													{
														value: "Both",
														label: "Products & Services",
														description: "Sell items and offer services"
													},
													{
														value: "Product Seller",
														label: "Product Seller",
														description: "List gadgets, books & goods"
													},
													{
														value: "Service Provider",
														label: "Service Provider",
														description: "Offer skills & bookings"
													}
												]
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 327,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 325,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 314,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "form-field",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Seller verification status" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 353,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "segmented compact-tabs",
												role: "group",
												"aria-label": "Student or non-student seller",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													className: isStudent ? "selected" : "",
													onClick: () => setIsStudent(true),
													children: "I am a Student"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 359,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													className: !isStudent ? "selected" : "",
													onClick: () => setIsStudent(false),
													children: "Not a Student"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 366,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 354,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", {
												className: "text-xs text-muted-foreground mt-1 block",
												children: [
													isStudent ? "After sign-up you will upload your Student ID and a matching real profile photo." : "After sign-up you will upload your Ghana Card or Voter's ID and a matching real profile photo.",
													" ",
													"Documents are used strictly for verification only in accordance with Ghana’s Data Protection Act, 2012 (Act 843)."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 374,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 352,
										columnNumber: 21
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 19
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "forgot-row",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "button",
										variant: "link",
										onClick: () => {
											setSent(false);
											setForgot(true);
										},
										children: "Forgot password?"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 385,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 384,
									columnNumber: 19
								}, this),
								error && /* @__PURE__ */ (void 0)("p", {
									role: "alert",
									className: "form-error",
									children: error
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 399,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									className: "auth-submit",
									type: "submit",
									disabled: submitting || !backendConfigured,
									children: [submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 410,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 404,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 237,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "auth-footnote",
							children: [
								"Compliant with Ghana’s Data Protection Act, 2012 (Act 843) — by continuing you agree to our ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/terms",
									children: "Terms"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 24
								}, this),
								" &",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/privacy",
									children: "Privacy Policy"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 417,
									columnNumber: 17
								}, this),
								"."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "auth-browse",
							children: ["Buying only? No account needed — ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/discover",
								children: "Browse the marketplace"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 421,
								columnNumber: 50
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 420,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 204,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 170,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 169,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: forgot,
				onOpenChange: setForgot,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "mobile-dialog onboarding-dialog",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: sent ? "Check your email" : "Reset your password" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 430,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: sent ? `If an account exists for ${forgotEmail}, a reset link has been sent.` : `Enter your ${BRAND} account email address.` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 431,
							columnNumber: 11
						}, this),
						!sent && /* @__PURE__ */ (void 0)("form", {
							onSubmit: requestPasswordReset,
							children: [/* @__PURE__ */ (void 0)("label", {
								className: "form-field",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Email address" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 439,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "email",
									required: true,
									placeholder: "you@example.com",
									value: forgotEmail,
									onChange: (e) => setForgotEmail(e.target.value)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 440,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 438,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)(Button, {
								type: "submit",
								className: "w-full",
								children: "Send reset link"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 448,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 437,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 429,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 428,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 140,
		columnNumber: 5
	}, this);
}
//#endregion
export { AuthPage };
