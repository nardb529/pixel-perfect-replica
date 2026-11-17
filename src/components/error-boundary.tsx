import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw, RotateCcw } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CampusLoop runtime error caught by ErrorBoundary:", error);
    reportLovableError(error, {
      boundary: "global_error_boundary",
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      return (
        <main className="error-boundary-shell" role="alert" aria-live="assertive">
          <div className="surface-panel error-boundary-card curve-accent">
            <span className="error-boundary-orb" aria-hidden="true">
              <AlertTriangle size={24} />
            </span>
            <p className="error-boundary-eyebrow">CampusLoop</p>
            <h1 className="error-boundary-title">Something unexpected happened</h1>
            <p className="error-boundary-desc">
              We caught an unexpected display error so your session stays safe. Try recovering this
              view, reloading the page, or heading back to Discover.
            </p>
            <div className="error-boundary-actions">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RotateCcw size={15} />
                Try again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <RefreshCw size={15} />
                Reload page
              </button>
              <a
                href="/discover"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Home size={15} />
                Go to Discover
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
