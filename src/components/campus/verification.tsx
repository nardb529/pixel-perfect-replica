import { useState } from "react";
import { BadgeCheck, Camera, Clock, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCampus } from "./store";
import { SectionTitle } from "./shared";
import { TECHNICAL_ISSUE_MESSAGE, toUserSafeErrorMessage } from "@/lib/campus/data";
import type { LiveSelfieChecks } from "@/lib/campus/idVerification";
import { profileService } from "@/services";
import { LiveSelfieCapture, type LiveSelfieResult } from "./liveSelfie";
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
          detail: "Live selfie reviewed and approved by an Admin",
          className: "is-verified",
          Icon: BadgeCheck,
        }
      : resolved === "pending"
        ? {
            label: "Verification Pending",
            detail: "Live selfie awaiting Admin review",
            className: "is-pending",
            Icon: Clock,
          }
        : {
            label: "Unverified Seller",
            detail: "Live selfie verification not completed yet",
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
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [retaking, setRetaking] = useState(false);

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
              Approved by a CampusLoop Admin. You can publish and manage products and services.
            </p>
          </div>
        </div>
      </section>
    );
  }

  async function handleConfirm(result: LiveSelfieResult) {
    if (!consent) {
      setError("Please tick the box to agree before submitting your selfie.");
      return;
    }
    if (!backendConfigured) {
      setError(TECHNICAL_ISSUE_MESSAGE);
      return;
    }
    const checks: LiveSelfieChecks = {
      method: "live_selfie",
      challenges: result.challenges,
      livenessPassedAt: result.livenessPassedAt,
      width: result.selfie.width,
      height: result.selfie.height,
      sizeKb: result.selfie.sizeKb,
    };
    setSubmitting(true);
    setError("");
    try {
      await profileService.submitLiveSelfieVerification(result.selfie.blob, checks);
      await refreshProfile();
      setRetaking(false);
      toast.success("Submitted. An Admin will review your selfie and approve your seller account.");
      onSubmitted?.();
    } catch (err) {
      setError(toUserSafeErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (user.verificationStatus === "pending" && !retaking) {
    return (
      <section className="surface-panel section-panel verification-card verification-pending">
        <div className="verification-status-row">
          <span className="verification-status-icon is-pending">
            <Clock size={22} />
          </span>
          <div className="flex-1 min-w-0">
            <strong>Seller Verification Pending Admin Review</strong>
            <p className="text-xs text-muted-foreground">
              Your live selfie has been sent. A CampusLoop Admin will review it and approve your
              seller account before you can post products or services. Passing the camera check does
              not approve you automatically.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setRetaking(true)}>
            Retake selfie
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`surface-panel section-panel verification-card ${compact ? "is-compact" : ""}`}
      aria-label="Seller live selfie verification"
    >
      <SectionTitle
        eyebrow="Seller Security Layer"
        title="Verify with a quick live selfie to sell on CampusLoop"
      />

      <p className="profile-bio">
        Buyers browse and buy with no verification. To protect students on campus, anyone who wants
        to sell products or offer services takes a short <strong>live selfie</strong> with their
        camera. <strong>Only an Admin approves seller accounts</strong>, after looking at your
        selfie.
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

      <div className="verification-step-block">
        <label className="field-label">
          <Camera size={14} className="inline mr-1" />
          Take your live selfie
        </label>
        <small className="text-xs text-muted-foreground block mb-2">
          You will be asked to do two quick actions (like blinking or smiling) so we know it is
          really you. Photos from your gallery are not accepted.
        </small>
        <LiveSelfieCapture onConfirm={(r) => void handleConfirm(r)} disabled={submitting} />
      </div>

      <div className="data-protection-notice" role="note">
        <Lock size={16} className="shrink-0 text-primary" />
        <div>
          <strong>Why we collect your selfie, and what happens to it</strong>
          <p>
            We collect one selfie only so an Admin can check that a real person is behind the seller
            account. The camera check runs on your phone. Camera pictures and video are never
            uploaded or saved, only the one final selfie is. It is kept in private storage, visible
            only to you and CampusLoop Admins, and is never shown publicly. We do not build or keep
            face-recognition data. We delete your selfie if your verification is returned for
            resubmission or when you ask us to delete it or close your account. This is a basic
            safety check. It does not prove legal identity or guarantee fraud prevention. Handled
            under Ghana&apos;s Data Protection Act, 2012 (Act 843).
          </p>
        </div>
      </div>

      <label className="audience-check verification-attestation">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setError("");
          }}
        />
        <span>
          I agree that CampusLoop may store my selfie privately for seller verification, as
          explained above.
        </span>
      </label>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {submitting && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="text-primary" />
            Sending your selfie for Admin review...
          </span>
        )}
        {retaking && (
          <Button type="button" variant="ghost" onClick={() => setRetaking(false)}>
            Cancel
          </Button>
        )}
      </div>
    </section>
  );
}
