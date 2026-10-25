import React from "react";
import { useLoading } from "../../context/LoadingContext";
import { Spinner, SempliqoBrandIcon } from "./LoaderIcons";

/**
 * 1. TopProgressBar: Minimal, ultra-sleek progress line at top of viewport for fast feedback.
 */
export function TopProgressBar() {
  const { isGlobalLoading } = useLoading();

  if (!isGlobalLoading) return null;

  return (
    <div className="sq-top-progress-bar" role="progressbar" aria-valuetext="Loading" aria-busy="true">
      <div className="sq-top-progress-glow" />
    </div>
  );
}

/**
 * 2. FullPageLoader: Used for initial application launch or blocking transitions.
 */
export function FullPageLoader({ message = "Initializing Sempliqo..." }: { message?: string }) {
  return (
    <div
      className="sq-full-page-loader"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="sq-loader-box">
        <div className="sq-brand-pulse-wrap">
          <SempliqoBrandIcon size={46} />
          <div className="sq-radar-ring" />
        </div>
        <p className="sq-loader-text">{message}</p>
      </div>
    </div>
  );
}

/**
 * 3. OverlayLoader: Subtle backdrop overlay for blocking actions.
 */
export function OverlayLoader({ message }: { message?: string }) {
  const { isOverlayLoading, activeLoaders } = useLoading();

  if (!isOverlayLoading) return null;

  const currentMsg =
    message || activeLoaders.find((l) => l.scope === "overlay")?.message || "Processing request...";

  return (
    <div
      className="sq-overlay-loader"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={currentMsg}
    >
      <div className="sq-overlay-card">
        <Spinner size={24} color="#0878f9" />
        <span>{currentMsg}</span>
      </div>
    </div>
  );
}

/**
 * 4. InlineLoader: Small indicator for sections, cards, or lists.
 */
export function InlineLoader({
  text = "Loading data...",
  size = 18,
  compact = false,
}: {
  text?: string;
  size?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`sq-inline-loader ${compact ? "sq-inline-compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} color="#0878f9" />
      {text && <span className="sq-inline-text">{text}</span>}
    </div>
  );
}

/**
 * 5. ActionButton: Reusable button component with automatic loading spinner, disabled state, and double-click prevention.
 */
export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline" | "light";
  children: React.ReactNode;
}

export function ActionButton({
  loading = false,
  loadingText = "Processing...",
  variant = "primary",
  disabled,
  className = "",
  children,
  onClick,
  ...props
}: ActionButtonProps) {
  const btnClass = `btn btn-${variant} ${className} ${loading ? "is-loading" : ""}`;

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={btnClass}
      aria-busy={loading}
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {loading ? (
        <>
          <Spinner size={16} color="currentColor" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
