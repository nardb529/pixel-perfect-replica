import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo, ThemeToggle } from "@/components/campus/shared";
import { useCampus } from "@/components/campus/store";
import { validatePassword } from "@/lib/campus/data";
import { pageHead } from "@/lib/campus/meta";
import { authenticationService } from "@/services";

export const Route = createFileRoute("/reset-password")({
  head: () =>
    pageHead(
      "Reset password",
      "Set a new password for your CampusLoop seller or service provider account.",
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validatePassword(password, confirm);
    if (validation) {
      setError(validation);
      return;
    }
    if (!backendConfigured) {
      setError("Connect Supabase environment variables to complete password recovery.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await authenticationService.updatePassword(password);
      setDone(true);
      toast.success("Password updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
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
