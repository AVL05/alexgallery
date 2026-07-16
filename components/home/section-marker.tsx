export function SectionMarker({
  current,
  total = 8,
  label,
}: {
  current: number;
  total?: number;
  label: string;
}) {
  const accessibleLabel = label
    .replace("{current}", String(current))
    .replace("{total}", String(total));

  return (
    <span
      aria-label={accessibleLabel}
      className="rv-index inline-flex items-center gap-2 text-[var(--color-text-muted)]"
    >
      <span aria-hidden="true">{String(current).padStart(2, "0")}</span>
      <span aria-hidden="true" className="h-px w-5 bg-border" />
      <span aria-hidden="true">{String(total).padStart(2, "0")}</span>
    </span>
  );
}
