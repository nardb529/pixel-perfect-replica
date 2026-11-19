import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnimatedSelect, Logo, PageBackButton, ThemeToggle } from "./shared";
import { useCampus } from "./store";
import {
  BRAND,
  TECHNICAL_ISSUE_MESSAGE,
  toUserSafeErrorMessage,
  validatePassword,
} from "@/lib/campus/data";
import { authenticationService } from "@/services";
import type { AccountType } from "@/lib/supabase/database.types";

export function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [isStudent, setIsStudent] = useState(true);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sent, setSent] = useState(false);

  const {
    backendConfigured,
    authLoading,
    user,
    universityNames,
    dbUniversities,
    refreshProfile,
    triggerSellerPostAuth,
  } = useCampus();
  const navigate = useNavigate();

  if (!authLoading && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(data.get("password") || "");
    const confirm = mode === "signup" ? String(data.get("confirm") || "") : undefined;

    const validation = validatePassword(password, confirm);
    if (validation) {
      setError(validation);
      return;
    }

    const chosenUniName = String(data.get("university") || universityNames[0] || "KNUST");
    const chosenCapability = String(data.get("capability") || "Both") as AccountType;
    const fullName = String(data.get("name") || "").trim() || "Campus Seller";
    const rawUsername = String(data.get("username") || "")
      .trim()
      .toLowerCase();
    const fallbackUsername =
      rawUsername.replace(/[^a-z0-9_.-]/g, "") ||
      `${email.split("@")[0]?.replace(/[^a-z0-9_.-]/g, "") || "seller"}-${Math.floor(100 + Math.random() * 900)}`;
    const whatsapp = String(data.get("whatsapp") || "").trim();

    if (!backendConfigured) {
      setError(TECHNICAL_ISSUE_MESSAGE);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const matchedUni = dbUniversities.find(
          (u) => u.short_name === chosenUniName || u.university_name === chosenUniName,
        );
        const res = await authenticationService.signUp({
          email,
          password,
          fullName,
          username: fallbackUsername,
          accountType: chosenCapability,
          primaryUniversityId: matchedUni?.id ?? null,
          universityName: chosenUniName,
          phoneNumber: whatsapp || undefined,
          whatsappNumber: whatsapp || undefined,
          isStudent,
        });

        if (res.needsEmailConfirmation) {
          setVerificationPendingEmail(email);
          toast.success("Check your inbox to verify your email address");
          return;
        }
      } else {
        await authenticationService.signIn(email, password);
      }

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

  async function requestPasswordReset(e: FormEvent) {
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

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div className="auth-aside-head">
          <Logo />
          <ThemeToggle compact />
        </div>
        <div className="auth-aside-copy surface-panel curve-accent">
          <h2>Sell safely across Ghanaian campuses.</h2>
          <p>
            Buyers never need an account to browse or contact sellers. Seller accounts require ID
            and photo verification before listing.
          </p>
          <ul className="auth-aside-points">
            <li>
              <CheckCircle2 size={16} />
              <span>Sellers verify with a quick live selfie</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Buyers never need to verify</span>
            </li>
            <li>
              <ShieldCheck size={16} />
              <span>Zero account required for buyers — direct campus chat</span>
            </li>
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-inner surface-panel curve-accent">
          <div className="flex items-center justify-between gap-2 mb-4">
            <PageBackButton fallbackTo="/discover" label="Back" />
            <div className="auth-mobile-top mb-0">
              <Logo />
              <ThemeToggle compact />
            </div>
          </div>

          {verificationPendingEmail ? (
            <div className="modal-body">
              <span className="success-icon">
                <MailCheck size={32} />
              </span>
              <h1>Verify your email</h1>
              <p>
                We sent a confirmation link to <strong>{verificationPendingEmail}</strong>. Open
                your inbox and confirm your email to activate your seller dashboard.
              </p>
              <Button type="button" onClick={resendConfirmation}>
                Resend confirmation email
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setVerificationPendingEmail(null);
                  setMode("login");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h1>{mode === "signup" ? "Create seller account" : "Welcome back"}</h1>
              <p>
                {mode === "signup"
                  ? "Set up one account to list products, offer services, or both."
                  : "Sign in to manage your listings and enquiries."}
              </p>

              <div className="segmented">
                <Button
                  type="button"
                  variant="ghost"
                  className={mode === "signup" ? "selected" : ""}
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={mode === "login" ? "selected" : ""}
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Log In
                </Button>
              </div>

              <form onSubmit={submit}>
                {mode === "signup" && (
                  <>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Full name</span>
                        <input name="name" required placeholder="Ama Mensah" autoComplete="name" />
                      </label>
                      <label className="form-field">
                        <span>Username</span>
                        <input
                          name="username"
                          placeholder="amatech_knust"
                          autoComplete="username"
                        />
                      </label>
                    </div>
                  </>
                )}

                <label className="form-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                {mode === "signup" && (
                  <label className="form-field">
                    <span>WhatsApp / Phone number</span>
                    <input
                      type="tel"
                      name="whatsapp"
                      placeholder="+233 24 000 0000"
                      autoComplete="tel"
                    />
                  </label>
                )}

                <label className="form-field">
                  <span>Password</span>
                  <div className="password-input">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      required
                      placeholder="At least 8 characters"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </Button>
                  </div>
                </label>

                {mode === "signup" ? (
                  <>
                    <label className="form-field">
                      <span>Confirm password</span>
                      <input
                        type={show ? "text" : "password"}
                        name="confirm"
                        required
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                      />
                    </label>
                    <div className="form-grid">
                      <div className="form-field">
                        <span>University</span>
                        <AnimatedSelect
                          name="university"
                          ariaLabel="University"
                          kicker="Choose your university"
                          defaultValue={universityNames[0] || "KNUST"}
                          options={universityNames}
                        />
                      </div>
                      <div className="form-field">
                        <span>Account type</span>
                        <AnimatedSelect
                          name="capability"
                          ariaLabel="Account type"
                          kicker="Seller capability"
                          defaultValue="Both"
                          options={[
                            {
                              value: "Both",
                              label: "Products & Services",
                              description: "Sell items and offer services",
                            },
                            {
                              value: "Product Seller",
                              label: "Product Seller",
                              description: "List gadgets, books & goods",
                            },
                            {
                              value: "Service Provider",
                              label: "Service Provider",
                              description: "Offer skills & bookings",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <span>Seller verification status</span>
                      <div
                        className="segmented compact-tabs"
                        role="group"
                        aria-label="Student or non-student seller"
                      >
                        <button
                          type="button"
                          className={isStudent ? "selected" : ""}
                          onClick={() => setIsStudent(true)}
                        >
                          I am a Student
                        </button>
                        <button
                          type="button"
                          className={!isStudent ? "selected" : ""}
                          onClick={() => setIsStudent(false)}
                        >
                          Not a Student
                        </button>
                      </div>
                      <small className="text-xs text-muted-foreground mt-1 block">
                        Sellers and service providers take a quick live selfie with their camera
                        after sign-up. An Admin reviews it before you can post. Handled in line with
                        Ghana’s Data Protection Act, 2012 (Act 843).
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="forgot-row">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setSent(false);
                        setForgot(true);
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}

                <Button
                  className="auth-submit"
                  type="submit"
                  disabled={submitting || !backendConfigured}
                >
                  {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="auth-footnote">
                Compliant with Ghana’s Data Protection Act, 2012 (Act 843) — by continuing you agree
                to our <Link to="/terms">Terms</Link> &amp;{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>

              <div className="auth-browse">
                Buying only? No account needed — <Link to="/discover">Browse the marketplace</Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Dialog open={forgot} onOpenChange={setForgot}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>{sent ? "Check your email" : "Reset your password"}</DialogTitle>
          <DialogDescription>
            {sent
              ? `If an account exists for ${forgotEmail}, a reset link has been sent.`
              : `Enter your ${BRAND} account email address.`}
          </DialogDescription>
          {!sent && (
            <form onSubmit={requestPasswordReset}>
              <label className="form-field">
                <span>Email address</span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </label>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
