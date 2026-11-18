import { useEffect, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCampus } from "./store";
import { SectionTitle } from "./shared";
import { TECHNICAL_ISSUE_MESSAGE, isSafeMediaUrl, toUserSafeErrorMessage } from "@/lib/campus/data";
import {
  checkIdAndProfilePair,
  inspectVerificationImage,
  type ImageValidityResult,
  type VerificationChecksPayload,
} from "@/lib/campus/idVerification";
import { profileService } from "@/services";
import type { IdDocumentType, VerificationStatus } from "@/lib/supabase/database.types";

export interface VerificationSubmissionDraft {
  isStudent: boolean;
  idDocumentType: IdDocumentType;
  idDocumentPath: string;
  profileImageUrl: string;
  photoMatchConfirmed: boolean;
}

export function validateVerificationSubmission(draft: VerificationSubmissionDraft): string {
  if (draft.isStudent && draft.idDocumentType !== "Student ID") {
    return "Students must select and upload a clear photo of their Student ID.";
  }
  if (
    !draft.isStudent &&
    draft.idDocumentType !== "Ghana Card" &&
    draft.idDocumentType !== "Voters ID"
  ) {
    return "Non-students must select either a Ghana Card or Voter's ID.";
  }
  if (!draft.idDocumentPath.trim()) {
    return draft.isStudent
      ? "Upload a clear photo of your Student ID."
      : `Upload a clear photo of your ${draft.idDocumentType === "Voters ID" ? "Voter's ID" : "Ghana Card"}.`;
  }
  if (!draft.profileImageUrl.trim()) {
    return "Upload a real profile photo of yourself.";
  }
  if (!draft.photoMatchConfirmed) {
    return "Confirm that your profile photo is a real photo of the same person on the uploaded ID.";
  }
  return "";
}

export function SellerStatusIndicator({
  status,
  compact = false,
}: {
  status?: VerificationStatus | undefined;
  compact?: boolean;
}) {
  const resolved: VerificationStatus =
    status === "verified" ? "verified" : status === "pending" ? "pending" : "unverified";

  const copy =
    resolved === "verified"
      ? {
          label: "Verified Seller",
          detail: "Identity & ID background check approved by Admin",
          className: "is-verified",
          Icon: BadgeCheck,
        }
      : resolved === "pending"
        ? {
            label: "Verification Pending",
            detail: "ID & profile photo awaiting Admin review",
            className: "is-pending",
            Icon: Clock,
          }
        : {
            label: "Unverified Seller",
            detail: "Identity background check not completed yet",
            className: "is-unverified",
            Icon: ShieldAlert,
          };

  const { Icon } = copy;

  return (
    <div
      className={`shop-verification-indicator ${copy.className} ${compact ? "is-compact" : ""}`}
      role="status"
      aria-label={`Seller background check status: ${copy.label}`}
    >
      <span className="shop-verification-icon" aria-hidden="true">
        <Icon size={compact ? 15 : 18} />
      </span>
      <div className="shop-verification-copy">
        <strong>{copy.label}</strong>
        {!compact && <small>{copy.detail}</small>}
      </div>
    </div>
  );
}

export function SellerVerificationCard({
  onSubmitted,
  compact = false,
}: {
  onSubmitted?: () => void;
  compact?: boolean;
}) {
  const { backendConfigured, user, refreshProfile } = useCampus();

  const initialStudent = user?.isStudent ?? true;
  const initialDocType: IdDocumentType = initialStudent
    ? "Student ID"
    : user?.idDocumentType === "Voters ID"
      ? "Voters ID"
      : "Ghana Card";

  const [isStudent, setIsStudent] = useState<boolean>(initialStudent);
  const [idDocumentType, setIdDocumentType] = useState<IdDocumentType>(initialDocType);
  const [idDocumentPath, setIdDocumentPath] = useState<string>(user?.idDocumentPath || "");
  const [idPreviewUrl, setIdPreviewUrl] = useState<string | null>(null);
  const [idValidity, setIdValidity] = useState<ImageValidityResult | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.avatar || "");
  const [profileValidity, setProfileValidity] = useState<ImageValidityResult | null>(null);
  const [photoMatchConfirmed, setPhotoMatchConfirmed] = useState<boolean>(
    Boolean(user?.verificationPhotoConfirmed),
  );
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingPending, setEditingPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    const nextStudent = user.isStudent ?? true;
    setIsStudent(nextStudent);
    setIdDocumentType(
      nextStudent ? "Student ID" : user.idDocumentType === "Voters ID" ? "Voters ID" : "Ghana Card",
    );
    setIdDocumentPath(user.idDocumentPath || "");
    setProfileImageUrl(user.avatar || "");
    setPhotoMatchConfirmed(Boolean(user.verificationPhotoConfirmed));
  }, [
    user?.id,
    user?.isStudent,
    user?.idDocumentType,
    user?.idDocumentPath,
    user?.avatar,
    user?.verificationPhotoConfirmed,
  ]);

  useEffect(() => {
    let active = true;
    if (!backendConfigured || !user?.idDocumentPath) {
      setIdPreviewUrl(null);
      return;
    }
    void profileService.getSignedVerificationDocUrl(user.idDocumentPath).then((url) => {
      if (active && url) setIdPreviewUrl(url);
    });
    return () => {
      active = false;
    };
  }, [backendConfigured, user?.idDocumentPath]);

  if (!user) return null;

  if (user.verificationStatus === "verified") {
    return (
      <section className="surface-panel section-panel verification-card verification-approved">
        <div className="verification-status-row">
          <span className="verification-status-icon is-verified">
            <BadgeCheck size={22} />
          </span>
          <div>
            <strong>Verified Campus Seller</strong>
            <p className="text-xs text-muted-foreground">
              Approved by CampusLoop Admin using{" "}
              {user.idDocumentType === "Voters ID"
                ? "Voter's ID"
                : user.idDocumentType || (user.isStudent ? "Student ID" : "National ID")}
              . You can publish and manage products and services.
            </p>
          </div>
        </div>
      </section>
    );
  }

  function handleStudentSwitch(studentChoice: boolean) {
    if (studentChoice !== isStudent) {
      setIdDocumentPath("");
      setIdPreviewUrl(null);
      setIdValidity(null);
    }
    setIsStudent(studentChoice);
    setError("");
    if (studentChoice) {
      setIdDocumentType("Student ID");
    } else if (idDocumentType === "Student ID") {
      setIdDocumentType("Ghana Card");
    }
  }

  async function handleIdFileChange(file?: File) {
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

  async function handleProfilePhotoChange(file?: File) {
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateVerificationSubmission({
      isStudent,
      idDocumentType,
      idDocumentPath,
      profileImageUrl,
      photoMatchConfirmed,
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

    const verificationChecks: VerificationChecksPayload = {
      documentType: idDocumentType,
      isStudent,
      format: idValidity?.format || "JPEG",
      resolution:
        idValidity && idValidity.width > 0
          ? `${idValidity.width}×${idValidity.height}`
          : "Verified on upload",
      aspectRatio: idValidity?.aspectRatio || 1.58,
      cardFramingPassed: idValidity ? idValidity.valid : true,
      clarityPassed: idValidity ? idValidity.valid && idValidity.contrastStdDev >= 12 : true,
      distinctFromProfilePhoto: !pairError,
      checkedAt: new Date().toISOString(),
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
        verificationChecks,
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

  if (user.verificationStatus === "pending" && !editingPending) {
    return (
      <section className="surface-panel section-panel verification-card verification-pending">
        <div className="verification-status-row">
          <span className="verification-status-icon is-pending">
            <Clock size={22} />
          </span>
          <div className="flex-1 min-w-0">
            <strong>Seller Verification Pending Admin Review</strong>
            <p className="text-xs text-muted-foreground">
              Your real profile photo and{" "}
              {user.idDocumentType === "Voters ID"
                ? "Voter's ID"
                : user.idDocumentType || "ID card"}{" "}
              passed initial image validity checks. A CampusLoop Admin will personally verify your
              ID and approve your seller account before you can post products or services.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setEditingPending(true)}>
            Update documents
          </Button>
        </div>
      </section>
    );
  }

  const requiredDocLabel = isStudent
    ? "Student ID"
    : idDocumentType === "Voters ID"
      ? "Voter's ID"
      : "Ghana Card";

  return (
    <section
      className={`surface-panel section-panel verification-card ${compact ? "is-compact" : ""}`}
      aria-label="Seller identity verification"
    >
      <SectionTitle
        eyebrow="Seller Security Layer"
        title="Verify your identity to sell on CampusLoop"
      />

      <p className="profile-bio">
        Buyers browse and contact sellers freely with zero account required. To protect students on
        campus, anyone who wants to sell products or offer services must submit a matching{" "}
        <strong>real profile photo</strong> and valid ID.{" "}
        <strong>Only an Admin approves seller accounts</strong> after verifying your ID.
      </p>

      {user.verificationNote && (
        <div className="verification-rejection-banner" role="alert">
          <ShieldAlert size={18} />
          <div>
            <strong>Update requested by Admin</strong>
            <p>{user.verificationNote}</p>
          </div>
        </div>
      )}

      <form className="verification-form" onSubmit={(e) => void handleSubmit(e)}>
        <div className="verification-step-block">
          <label className="field-label">1. Are you a university student?</label>
          <div className="verification-role-grid" role="group" aria-label="Student status">
            <button
              type="button"
              className={`verification-choice-btn ${isStudent ? "selected" : ""}`}
              onClick={() => handleStudentSwitch(true)}
              aria-pressed={isStudent}
            >
              <GraduationCap size={18} />
              <span>
                <strong>Yes, I am a student</strong>
                <small>Requires photo of your Student ID</small>
              </span>
            </button>

            <button
              type="button"
              className={`verification-choice-btn ${!isStudent ? "selected" : ""}`}
              onClick={() => handleStudentSwitch(false)}
              aria-pressed={!isStudent}
            >
              <CreditCard size={18} />
              <span>
                <strong>No, I am not a student</strong>
                <small>Requires Ghana Card or Voter&apos;s ID</small>
              </span>
            </button>
          </div>
        </div>

        {!isStudent && (
          <div className="verification-step-block">
            <label className="field-label">Select national ID document type</label>
            <div className="segmented compact-tabs" role="group" aria-label="Non-student ID type">
              <button
                type="button"
                className={idDocumentType === "Ghana Card" ? "selected" : ""}
                onClick={() => {
                  if (idDocumentType !== "Ghana Card") {
                    setIdDocumentPath("");
                    setIdPreviewUrl(null);
                    setIdValidity(null);
                  }
                  setIdDocumentType("Ghana Card");
                  setError("");
                }}
              >
                Ghana Card
              </button>
              <button
                type="button"
                className={idDocumentType === "Voters ID" ? "selected" : ""}
                onClick={() => {
                  if (idDocumentType !== "Voters ID") {
                    setIdDocumentPath("");
                    setIdPreviewUrl(null);
                    setIdValidity(null);
                  }
                  setIdDocumentType("Voters ID");
                  setError("");
                }}
              >
                Voter&apos;s ID
              </button>
            </div>
          </div>
        )}

        <div className="verification-uploads-grid">
          <div className="verification-upload-box">
            <div className="verification-upload-head">
              <CreditCard size={16} />
              <div>
                <strong>2. Photo of {requiredDocLabel}</strong>
                <small>Private · Checked for sharpness &amp; card framing</small>
              </div>
            </div>

            {isSafeMediaUrl(idPreviewUrl) && (
              <div className="verification-preview-frame">
                <img
                  src={idPreviewUrl!}
                  alt={`${requiredDocLabel} verification preview`}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <label className="profile-upload-row verification-file-trigger">
              <Upload size={15} />
              <span>
                {uploadingId
                  ? "Checking & uploading ID..."
                  : idDocumentPath
                    ? `Replace ${requiredDocLabel} photo`
                    : `Upload ${requiredDocLabel} photo`}
              </span>
              <input
                aria-label={`${requiredDocLabel} image`}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploadingId}
                onChange={(e) => {
                  void handleIdFileChange(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="verification-upload-box">
            <div className="verification-upload-head">
              <Camera size={16} />
              <div>
                <strong>3. Your Real Profile Photo</strong>
                <small>Must clearly show your face &amp; match your ID</small>
              </div>
            </div>

            {isSafeMediaUrl(profileImageUrl) && (
              <div className="verification-preview-frame is-portrait">
                <img
                  src={profileImageUrl}
                  alt="Your seller profile photo"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <label className="profile-upload-row verification-file-trigger">
              <Upload size={15} />
              <span>
                {uploadingAvatar
                  ? "Checking & uploading photo..."
                  : profileImageUrl
                    ? "Change real profile photo"
                    : "Upload real profile photo"}
              </span>
              <input
                aria-label="Real profile photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploadingAvatar}
                onChange={(e) => {
                  void handleProfilePhotoChange(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="verification-validity-list" aria-live="polite">
          <div className="verification-validity-item">
            <CheckCircle2
              size={15}
              className={
                idDocumentPath && (!idValidity || idValidity.valid)
                  ? "text-primary shrink-0"
                  : "text-muted-foreground shrink-0"
              }
            />
            <span>
              <strong>{requiredDocLabel} validity pre-check:</strong>{" "}
              {idValidity
                ? idValidity.summary
                : idDocumentPath
                  ? "ID file attached for Admin inspection."
                  : `Waiting for clear rectangular ${requiredDocLabel} photo.`}
            </span>
          </div>
          <div className="verification-validity-item">
            <CheckCircle2
              size={15}
              className={
                profileImageUrl && (!profileValidity || profileValidity.valid)
                  ? "text-primary shrink-0"
                  : "text-muted-foreground shrink-0"
              }
            />
            <span>
              <strong>Real profile photo pre-check:</strong>{" "}
              {profileValidity
                ? profileValidity.summary
                : profileImageUrl
                  ? "Profile photo attached (must show same person as ID)."
                  : "Waiting for real front-facing portrait."}
            </span>
          </div>
          <div className="verification-validity-item">
            <ShieldCheck size={15} className="text-primary shrink-0" />
            <span>
              <strong>Admin approval required:</strong> Automated checks screen photo clarity only —
              a CampusLoop Admin personally inspects your ID and approves seller status.
            </span>
          </div>
        </div>

        <label className="audience-check verification-attestation">
          <input
            type="checkbox"
            checked={photoMatchConfirmed}
            onChange={(e) => {
              setPhotoMatchConfirmed(e.target.checked);
              setError("");
            }}
          />
          <span>
            I confirm that my uploaded profile photo is a real photo of me and matches the exact
            person on my submitted <strong>{requiredDocLabel}</strong>.
          </span>
        </label>

        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={submitting || uploadingId || uploadingAvatar}>
            <ShieldCheck size={16} />
            {submitting ? "Submitting for Admin review..." : "Submit for Admin review"}
          </Button>
          {editingPending && (
            <Button type="button" variant="ghost" onClick={() => setEditingPending(false)}>
              Cancel
            </Button>
          )}
          {idDocumentPath && profileImageUrl && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 size={14} className="text-primary" />
              Both photos ready for Admin inspection
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
