import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as ShieldCheck, H as Lock, St as BadgeCheck, Y as GraduationCap, c as Upload, it as CreditCard, lt as Clock, mt as Camera, ut as CircleCheck, w as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as isSafeMediaUrl, I as useCampus, M as profileService, P as toUserSafeErrorMessage, S as inspectVerificationImage, c as TECHNICAL_ISSUE_MESSAGE, h as checkIdAndProfilePair, n as Button } from "./store-3n-kyzhz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as SectionTitle } from "./shared-CshecdmH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verification-CW3r5Iad.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/campus/verification.tsx";
function validateVerificationSubmission(draft) {
	if (draft.isStudent && draft.idDocumentType !== "Student ID") return "Students must select and upload a clear photo of their Student ID.";
	if (!draft.isStudent && draft.idDocumentType !== "Ghana Card" && draft.idDocumentType !== "Voters ID") return "Non-students must select either a Ghana Card or Voter's ID.";
	if (!draft.idDocumentPath.trim()) return draft.isStudent ? "Upload a clear photo of your Student ID." : `Upload a clear photo of your ${draft.idDocumentType === "Voters ID" ? "Voter's ID" : "Ghana Card"}.`;
	if (!draft.profileImageUrl.trim()) return "Upload a real profile photo of yourself.";
	if (!draft.photoMatchConfirmed) return "Confirm that your profile photo is a real photo of the same person on the uploaded ID.";
	return "";
}
function SellerStatusIndicator({ status, compact = false }) {
	const resolved = status === "verified" ? "verified" : status === "pending" ? "pending" : "unverified";
	const copy = resolved === "verified" ? {
		label: "Verified Seller",
		detail: "Identity & ID background check approved by Admin",
		className: "is-verified",
		Icon: BadgeCheck
	} : resolved === "pending" ? {
		label: "Verification Pending",
		detail: "ID & profile photo awaiting Admin review",
		className: "is-pending",
		Icon: Clock
	} : {
		label: "Unverified Seller",
		detail: "Identity background check not completed yet",
		className: "is-unverified",
		Icon: ShieldAlert
	};
	const { Icon } = copy;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `shop-verification-indicator ${copy.className} ${compact ? "is-compact" : ""}`,
		role: "status",
		"aria-label": `Seller background check status: ${copy.label}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "shop-verification-icon",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { size: compact ? 15 : 18 }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 102,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 101,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "shop-verification-copy",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: copy.label }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 9
			}, this), !compact && /* @__PURE__ */ (void 0)("small", { children: copy.detail }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 22
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 96,
		columnNumber: 5
	}, this);
}
function SellerVerificationCard({ onSubmitted, compact = false }) {
	const { backendConfigured, user, refreshProfile } = useCampus();
	const initialStudent = user?.isStudent ?? true;
	const initialDocType = initialStudent ? "Student ID" : user?.idDocumentType === "Voters ID" ? "Voters ID" : "Ghana Card";
	const [isStudent, setIsStudent] = (0, import_react.useState)(initialStudent);
	const [idDocumentType, setIdDocumentType] = (0, import_react.useState)(initialDocType);
	const [idDocumentPath, setIdDocumentPath] = (0, import_react.useState)(user?.idDocumentPath || "");
	const [idPreviewUrl, setIdPreviewUrl] = (0, import_react.useState)(null);
	const [idValidity, setIdValidity] = (0, import_react.useState)(null);
	const [profileImageUrl, setProfileImageUrl] = (0, import_react.useState)(user?.avatar || "");
	const [profileValidity, setProfileValidity] = (0, import_react.useState)(null);
	const [photoMatchConfirmed, setPhotoMatchConfirmed] = (0, import_react.useState)(Boolean(user?.verificationPhotoConfirmed));
	const [uploadingId, setUploadingId] = (0, import_react.useState)(false);
	const [uploadingAvatar, setUploadingAvatar] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [editingPending, setEditingPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const nextStudent = user.isStudent ?? true;
		setIsStudent(nextStudent);
		setIdDocumentType(nextStudent ? "Student ID" : user.idDocumentType === "Voters ID" ? "Voters ID" : "Ghana Card");
		setIdDocumentPath(user.idDocumentPath || "");
		setProfileImageUrl(user.avatar || "");
		setPhotoMatchConfirmed(Boolean(user.verificationPhotoConfirmed));
	}, [
		user?.id,
		user?.isStudent,
		user?.idDocumentType,
		user?.idDocumentPath,
		user?.avatar,
		user?.verificationPhotoConfirmed
	]);
	(0, import_react.useEffect)(() => {
		let active = true;
		if (!backendConfigured || !user?.idDocumentPath) {
			setIdPreviewUrl(null);
			return;
		}
		profileService.getSignedVerificationDocUrl(user.idDocumentPath).then((url) => {
			if (active && url) setIdPreviewUrl(url);
		});
		return () => {
			active = false;
		};
	}, [backendConfigured, user?.idDocumentPath]);
	if (!user) return null;
	if (user.verificationStatus === "verified") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel section-panel verification-card verification-approved",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "verification-status-row",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "verification-status-icon is-verified",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BadgeCheck, { size: 22 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 184,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 183,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Verified Campus Seller" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 187,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Approved by CampusLoop Admin using",
					" ",
					user.idDocumentType === "Voters ID" ? "Voter's ID" : user.idDocumentType || (user.isStudent ? "Student ID" : "National ID"),
					". You can publish and manage products and services."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 188,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 186,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 182,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 181,
		columnNumber: 7
	}, this);
	function handleStudentSwitch(studentChoice) {
		if (studentChoice !== isStudent) {
			setIdDocumentPath("");
			setIdPreviewUrl(null);
			setIdValidity(null);
		}
		setIsStudent(studentChoice);
		setError("");
		if (studentChoice) setIdDocumentType("Student ID");
		else if (idDocumentType === "Student ID") setIdDocumentType("Ghana Card");
	}
	async function handleIdFileChange(file) {
		if (!file) return;
		setError("");
		if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
			setError("Upload a clear JPG, PNG, or WebP photo of your ID card.");
			return;
		}
		if (!backendConfigured) {
			setError(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		setUploadingId(true);
		try {
			const check = await inspectVerificationImage(file, "id", idDocumentType);
			if (!check.valid) {
				setIdValidity(check);
				setError(check.reason || "ID image failed automated quality & validity checks.");
				return;
			}
			const pairError = checkIdAndProfilePair(check.dHash, profileValidity?.dHash);
			if (pairError) {
				setError(pairError);
				return;
			}
			const uploaded = await profileService.uploadVerificationId(file, idDocumentType);
			setIdValidity(uploaded.validity);
			setIdDocumentPath(uploaded.path);
			setIdPreviewUrl(uploaded.signedUrl);
			toast.success("ID card passed pre-checks and uploaded securely");
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setUploadingId(false);
		}
	}
	async function handleProfilePhotoChange(file) {
		if (!file) return;
		setError("");
		if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
			setError("Upload a clear JPG, PNG, or WebP photo of yourself.");
			return;
		}
		if (!backendConfigured) {
			setError(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		setUploadingAvatar(true);
		try {
			const check = await inspectVerificationImage(file, "profile");
			if (!check.valid) {
				setProfileValidity(check);
				setError(check.reason || "Profile photo failed image quality checks.");
				return;
			}
			const pairError = checkIdAndProfilePair(idValidity?.dHash, check.dHash);
			if (pairError) {
				setError(pairError);
				return;
			}
			const publicUrl = await profileService.uploadProfileImage(file);
			setProfileValidity(check);
			setProfileImageUrl(publicUrl);
			toast.success("Real profile photo checked and uploaded");
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setUploadingAvatar(false);
		}
	}
	async function handleSubmit(e) {
		e.preventDefault();
		const validation = validateVerificationSubmission({
			isStudent,
			idDocumentType,
			idDocumentPath,
			profileImageUrl,
			photoMatchConfirmed
		});
		if (validation) {
			setError(validation);
			return;
		}
		const pairError = checkIdAndProfilePair(idValidity?.dHash, profileValidity?.dHash);
		if (pairError) {
			setError(pairError);
			return;
		}
		if (!backendConfigured) {
			setError(TECHNICAL_ISSUE_MESSAGE);
			return;
		}
		const verificationChecks = {
			documentType: idDocumentType,
			isStudent,
			format: idValidity?.format || "JPEG",
			resolution: idValidity && idValidity.width > 0 ? `${idValidity.width}×${idValidity.height}` : "Verified on upload",
			aspectRatio: idValidity?.aspectRatio || 1.58,
			cardFramingPassed: idValidity ? idValidity.valid : true,
			clarityPassed: idValidity ? idValidity.valid && idValidity.contrastStdDev >= 12 : true,
			distinctFromProfilePhoto: !pairError,
			checkedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setSubmitting(true);
		setError("");
		try {
			await profileService.submitSellerVerification({
				isStudent,
				idDocumentType,
				idDocumentPath,
				profileImageUrl,
				photoMatchConfirmed,
				verificationChecks
			});
			await refreshProfile();
			setEditingPending(false);
			toast.success("Submitted — an Admin will verify & approve your seller account");
			onSubmitted?.();
		} catch (err) {
			setError(toUserSafeErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	}
	if (user.verificationStatus === "pending" && !editingPending) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "surface-panel section-panel verification-card verification-pending",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "verification-status-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "verification-status-icon is-pending",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { size: 22 }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 352,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 351,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Seller Verification Pending Admin Review" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 355,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Your real profile photo and",
							" ",
							user.idDocumentType === "Voters ID" ? "Voter's ID" : user.idDocumentType || "ID card",
							" ",
							"passed initial image validity checks. A CampusLoop Admin will personally verify your ID and approve your seller account before you can post products or services."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 356,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 354,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => setEditingPending(true),
					children: "Update documents"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 365,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 350,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 349,
		columnNumber: 7
	}, this);
	const requiredDocLabel = isStudent ? "Student ID" : idDocumentType === "Voters ID" ? "Voter's ID" : "Ghana Card";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: `surface-panel section-panel verification-card ${compact ? "is-compact" : ""}`,
		"aria-label": "Seller identity verification",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionTitle, {
				eyebrow: "Seller Security Layer",
				title: "Verify your identity to sell on CampusLoop"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 384,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "profile-bio",
				children: [
					"Buyers browse and contact sellers freely with zero account required. To protect students on campus, anyone who wants to sell products or offer services must submit a matching",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "real profile photo" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 392,
						columnNumber: 9
					}, this),
					" and valid ID.",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Only an Admin approves seller accounts" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 393,
						columnNumber: 9
					}, this),
					" after verifying your ID."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 389,
				columnNumber: 7
			}, this),
			user.verificationNote && /* @__PURE__ */ (void 0)("div", {
				className: "verification-rejection-banner",
				role: "alert",
				children: [/* @__PURE__ */ (void 0)(ShieldAlert, { size: 18 }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 398,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("strong", { children: "Update requested by Admin" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 400,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("p", { children: user.verificationNote }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 401,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 399,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 397,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "verification-form",
				onSubmit: (e) => void handleSubmit(e),
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "verification-step-block",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "field-label",
							children: "1. Are you a university student?"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 408,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "verification-role-grid",
							role: "group",
							"aria-label": "Student status",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: `verification-choice-btn ${isStudent ? "selected" : ""}`,
								onClick: () => handleStudentSwitch(true),
								"aria-pressed": isStudent,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Yes, I am a student" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 418,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Requires photo of your Student ID" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 419,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 417,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 410,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								className: `verification-choice-btn ${!isStudent ? "selected" : ""}`,
								onClick: () => handleStudentSwitch(false),
								"aria-pressed": !isStudent,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CreditCard, { size: 18 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 429,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "No, I am not a student" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 431,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Requires Ghana Card or Voter's ID" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 430,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 423,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 409,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 407,
						columnNumber: 9
					}, this),
					!isStudent && /* @__PURE__ */ (void 0)("div", {
						className: "verification-step-block",
						children: [/* @__PURE__ */ (void 0)("label", {
							className: "field-label",
							children: "Select national ID document type"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 440,
							columnNumber: 13
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "segmented compact-tabs",
							role: "group",
							"aria-label": "Non-student ID type",
							children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								className: idDocumentType === "Ghana Card" ? "selected" : "",
								onClick: () => {
									if (idDocumentType !== "Ghana Card") {
										setIdDocumentPath("");
										setIdPreviewUrl(null);
										setIdValidity(null);
									}
									setIdDocumentType("Ghana Card");
									setError("");
								},
								children: "Ghana Card"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 442,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								className: idDocumentType === "Voters ID" ? "selected" : "",
								onClick: () => {
									if (idDocumentType !== "Voters ID") {
										setIdDocumentPath("");
										setIdPreviewUrl(null);
										setIdValidity(null);
									}
									setIdDocumentType("Voters ID");
									setError("");
								},
								children: "Voter's ID"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 457,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 441,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 439,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "verification-uploads-grid",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "verification-upload-box",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "verification-upload-head",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CreditCard, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 479,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: ["2. Photo of ", requiredDocLabel] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 481,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Private · Checked for sharpness & card framing" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 482,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 480,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 478,
									columnNumber: 13
								}, this),
								isSafeMediaUrl(idPreviewUrl) && /* @__PURE__ */ (void 0)("div", {
									className: "verification-preview-frame",
									children: /* @__PURE__ */ (void 0)("img", {
										src: idPreviewUrl,
										alt: `${requiredDocLabel} verification preview`,
										referrerPolicy: "no-referrer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 488,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 487,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "profile-upload-row verification-file-trigger",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 497,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: uploadingId ? "Checking & uploading ID..." : idDocumentPath ? `Replace ${requiredDocLabel} photo` : `Upload ${requiredDocLabel} photo` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 498,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											"aria-label": `${requiredDocLabel} image`,
											type: "file",
											accept: "image/jpeg,image/png,image/webp,image/avif",
											className: "sr-only",
											disabled: uploadingId,
											onChange: (e) => {
												handleIdFileChange(e.target.files?.[0]);
												e.target.value = "";
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 496,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 477,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "verification-upload-box",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "verification-upload-head",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { size: 16 }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 521,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "3. Your Real Profile Photo" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("small", { children: "Must clearly show your face & match your ID" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 524,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 522,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 13
								}, this),
								isSafeMediaUrl(profileImageUrl) && /* @__PURE__ */ (void 0)("div", {
									className: "verification-preview-frame is-portrait",
									children: /* @__PURE__ */ (void 0)("img", {
										src: profileImageUrl,
										alt: "Your seller profile photo",
										referrerPolicy: "no-referrer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 530,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 529,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "profile-upload-row verification-file-trigger",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { size: 15 }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 539,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: uploadingAvatar ? "Checking & uploading photo..." : profileImageUrl ? "Change real profile photo" : "Upload real profile photo" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 540,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											"aria-label": "Real profile photo",
											type: "file",
											accept: "image/jpeg,image/png,image/webp,image/avif",
											className: "sr-only",
											disabled: uploadingAvatar,
											onChange: (e) => {
												handleProfilePhotoChange(e.target.files?.[0]);
												e.target.value = "";
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 547,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 538,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 519,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 476,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "verification-validity-list",
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "verification-validity-item",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, {
									size: 15,
									className: idDocumentPath && (!idValidity || idValidity.valid) ? "text-primary shrink-0" : "text-muted-foreground shrink-0"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 564,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: [requiredDocLabel, " validity pre-check:"] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 573,
										columnNumber: 15
									}, this),
									" ",
									idValidity ? idValidity.summary : idDocumentPath ? "ID file attached for Admin inspection." : `Waiting for clear rectangular ${requiredDocLabel} photo.`
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 572,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 563,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "verification-validity-item",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, {
									size: 15,
									className: profileImageUrl && (!profileValidity || profileValidity.valid) ? "text-primary shrink-0" : "text-muted-foreground shrink-0"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 582,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Real profile photo pre-check:" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 591,
										columnNumber: 15
									}, this),
									" ",
									profileValidity ? profileValidity.summary : profileImageUrl ? "Profile photo attached (must show same person as ID)." : "Waiting for real front-facing portrait."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 590,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "verification-validity-item",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, {
									size: 15,
									className: "text-primary shrink-0"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 600,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Admin approval required:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 602,
									columnNumber: 15
								}, this), " Automated checks screen photo clarity only — a CampusLoop Admin personally inspects your ID and approves seller status."] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 601,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 599,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 562,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "data-protection-notice",
						role: "note",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, {
							size: 16,
							className: "shrink-0 text-primary"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 609,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Ghana Data Protection Law (Act 843) Guarantee" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "We comply with Ghana’s Data Protection Act, 2012 (Act 843). Your uploaded ID card and photo are encrypted in private storage, used strictly for seller identity verification only, and never sold or shown publicly on your shop." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 612,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 608,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "audience-check verification-attestation",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "checkbox",
							checked: photoMatchConfirmed,
							onChange: (e) => {
								setPhotoMatchConfirmed(e.target.checked);
								setError("");
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 621,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							"I confirm that my uploaded profile photo is a real photo of me and matches the exact person on my submitted ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: requiredDocLabel }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 631,
								columnNumber: 36
							}, this),
							"."
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 629,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 620,
						columnNumber: 9
					}, this),
					error && /* @__PURE__ */ (void 0)("p", {
						role: "alert",
						className: "form-error",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 636,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								disabled: submitting || uploadingId || uploadingAvatar,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { size: 16 }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 643,
									columnNumber: 13
								}, this), submitting ? "Submitting for Admin review..." : "Submit for Admin review"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 642,
								columnNumber: 11
							}, this),
							editingPending && /* @__PURE__ */ (void 0)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setEditingPending(false),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 647,
								columnNumber: 13
							}, this),
							idDocumentPath && profileImageUrl && /* @__PURE__ */ (void 0)("span", {
								className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (void 0)(CircleCheck, {
									size: 14,
									className: "text-primary"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 653,
									columnNumber: 15
								}, this), "Both photos ready for Admin inspection"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 652,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 641,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 406,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 380,
		columnNumber: 5
	}, this);
}
//#endregion
export { SellerVerificationCard as n, SellerStatusIndicator as t };
