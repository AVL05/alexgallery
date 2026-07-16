import type { IntroDictionary } from "@/types/dictionary";

export function IntroBrand({ dictionary }: { dictionary: IntroDictionary }) {
  return (
    <div data-intro-brand className="max-w-[min(92vw,76rem)]">
      <p className="font-serif text-[clamp(3.75rem,15vw,11.5rem)] leading-[0.78] tracking-[-0.065em] text-foreground">
        raw.vives
      </p>
      <div
        data-intro-descriptor
        className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-7 sm:gap-x-5"
      >
        <p className="text-[clamp(0.95rem,1.5vw,1.25rem)] text-[var(--color-text-secondary)]">
          {dictionary.descriptor}
        </p>
        <span aria-hidden="true" className="h-px w-8 bg-[var(--color-border-strong)]" />
        <p className="text-sm text-[var(--color-text-muted)]">{dictionary.author}</p>
      </div>
    </div>
  );
}
