export function Logo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="30" height="30" rx="7" fill="var(--color-foreground)" />
      <path
        d="M8 16 L11 12 L14 20 L17 8 L20 24 L23 14 L26 16"
        stroke="var(--color-accent)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={`text-[1.05rem] leading-none tracking-[-0.03em] font-bold ${className ?? ""}`}
      style={{ fontFeatureSettings: '"ss01","cv11"' }}
    >
      NoTo<span className="text-accent">.</span>
    </span>
  );
}
