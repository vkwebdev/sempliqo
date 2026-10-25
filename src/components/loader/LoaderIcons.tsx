// Branded Sempliqo geometric 'S' mark in pure animated SVG
// Colors: Primary Blue (#0878f9), Electric Blue (#19a7ff), Deep Navy (#07182e)
export function SempliqoBrandIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sempliqo-loader-brand-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sq-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#19a7ff" />
          <stop offset="100%" stopColor="#0878f9" />
        </linearGradient>
        <linearGradient id="sq-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0878f9" />
          <stop offset="100%" stopColor="#04326d" />
        </linearGradient>
      </defs>
      {/* Dynamic S geometric facets reflecting Sempliqo's polygon brandmark */}
      <polygon points="22,4 36,12 28,24 16,16" fill="url(#sq-grad-1)" opacity="0.95" />
      <polygon points="16,16 28,24 22,36 8,28" fill="url(#sq-grad-2)" opacity="0.9" />
      <polygon points="28,24 38,30 30,40 22,36" fill="url(#sq-grad-1)" opacity="0.8" />
    </svg>
  );
}

export function Spinner({
  size = 18,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      className={`sempliqo-spinner ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle className="sempliqo-spinner-track" cx="12" cy="12" r="9.5" strokeOpacity="0.2" />
      <path className="sempliqo-spinner-arc" d="M12 2.5 A9.5 9.5 0 0 1 21.5 12" />
    </svg>
  );
}
