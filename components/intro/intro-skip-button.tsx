export function IntroSkipButton({ label, onSkip }: { label: string; onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="group inline-flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap border-b border-[var(--color-border-strong)] font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--color-text-secondary)] transition-colors hover:border-accent hover:text-foreground focus-visible:text-foreground sm:tracking-[0.16em]"
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
      >
        →
      </span>
    </button>
  );
}
