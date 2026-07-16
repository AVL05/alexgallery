import type { IntroDictionary } from "@/types/dictionary";

export function IntroProgress({ dictionary }: { dictionary: IntroDictionary }) {
  return (
    <div data-intro-progress className="w-full">
      <div
        className="h-px overflow-hidden bg-[var(--color-border)]"
        role="progressbar"
        aria-label={dictionary.initializing}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          data-intro-progress-line
          aria-hidden="true"
          className="h-full origin-left scale-x-0 bg-accent"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="relative min-h-5 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span data-intro-initializing className="text-[var(--color-text-secondary)]">
            {dictionary.initializing}
          </span>
          <span
            data-intro-ready
            className="invisible absolute inset-0 text-accent"
          >
            {dictionary.ready}
          </span>
        </div>
        <span
          data-intro-counter
          aria-hidden="true"
          className="font-mono text-lg tabular-nums text-[var(--color-text-secondary)] sm:text-xl"
        >
          000
        </span>
      </div>
    </div>
  );
}
