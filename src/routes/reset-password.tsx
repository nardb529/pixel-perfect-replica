import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { toUserSafeErrorMessage, validatePassword } from "@/lib/campus/data";
import { pageHead } from "@/lib/campus/meta";
import { authenticationService } from "@/services";

export const Route = createFileRoute("/reset-password")({
  head: () =>
    pageHead(
      "Reset password",
      "Set a new password for your CampusLoop seller or service provider account.",
      { path: "/reset-password", noIndex: true },
    ),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { backendConfigured } = useCampus();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [checkingSession, setCheckingSession] = useState(backendConfigured);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    if (!backendConfigured) {
      setCheckingSession(false);
      setHasRecoverySession(false);
      return;
    }

    let active = true;
    void authenticationService
      .getSession()
      .then((session) => {
        if (!active) return;
        setHasRecoverySession(Boolean(session?.user));
      })
      .finally(() => {
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

  async function onSubmit(e: FormEvent) {
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

  return (
    <div className="auth-page">
      <main className="auth-main col-span-2">
        <div className="auth-inner surface-panel curve-accent">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <ThemeToggle compact />
          </div>

          {done ? (
            <div className="modal-body">
              <span className="success-icon">
                <Check size={32} />
              </span>
              <h1>Password updated</h1>
              <p>Your account credentials are ready. Continue to your seller studio.</p>
              <Button onClick={() => navigate({ to: "/dashboard" })}>
                Go to Dashboard
                <ArrowRight size={16} />
              </Button>
            </div>
          ) : checkingSession ? (
            <div className="modal-body">
              <h1>Verifying reset link</h1>
              <p>Checking your secure recovery session...</p>
            </div>
          ) : !backendConfigured || !hasRecoverySession ? (
            <div className="modal-body">
              <span className="success-icon">
                <ShieldAlert size={30} />
              </span>
              <h1>Reset link required</h1>
              <p>
                Open the password reset link sent to your email to continue, or request a fresh one
                from the Sign In screen.
              </p>
              <Button asChild>
                <Link to="/auth">Back to Sign In</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1>Choose a new password</h1>
              <p>Enter a strong password of at least 8 characters to secure your account.</p>

              <form onSubmit={onSubmit}>
                <label className="form-field">
                  <span>New password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                </label>

                <label className="form-field">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                </label>

                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}

                <Button className="auth-submit" type="submit" disabled={saving}>
                  {saving ? "Updating password..." : "Update password"}
                  <ArrowRight size={16} />
                </Button>
              </form>

              <div className="auth-browse">
                <Link to="/auth">Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
