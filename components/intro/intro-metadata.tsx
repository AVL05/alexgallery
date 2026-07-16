import type { IntroDictionary } from "@/types/dictionary";

export function IntroMetadata({ dictionary }: { dictionary: IntroDictionary }) {
  return (
    <div
      data-intro-meta
      className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[var(--color-border)] pt-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      <MetadataItem label={dictionary.system} value="RAW / 001" />
      <MetadataItem label={dictionary.location} value="39.4699 / 00.3763" />
      <MetadataItem
        className="hidden sm:block"
        label={dictionary.index}
        value="30 / FRAME"
      />
      <MetadataItem
        className="hidden lg:block"
        label={dictionary.memory}
        value="VISUAL / ACTIVE"
      />
    </div>
  );
}

function MetadataItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-[var(--color-text-muted)]">
        {value}
      </p>
    </div>
  );
}
