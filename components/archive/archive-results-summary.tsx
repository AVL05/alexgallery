import type { ArchiveState } from "@/lib/archive/types";
import type { GalleryDictionary } from "@/types/dictionary";

export function ArchiveResultsSummary({
  dictionary,
  state,
  count,
  onClear,
}: {
  dictionary: GalleryDictionary;
  state: ArchiveState;
  count: number;
  onClear: () => void;
}) {
  const hasFilters =
    state.category !== "Todo" || state.year !== "all" || Boolean(state.query);
  const resultLabel = count === 1 ? dictionary.photoSingular : dictionary.photoPlural;

  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite" aria-atomic="true">
          <span className="font-mono tabular-nums text-foreground">{count}</span> {resultLabel}
        </p>
        {hasFilters && (
          <p className="rv-meta mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {state.category !== "Todo" && <span>{dictionary.categories[state.category]}</span>}
            {state.year !== "all" && <span>{state.year}</span>}
            {state.query && <span>“{state.query}”</span>}
          </p>
        )}
      </div>
      {hasFilters && (
        <button type="button" onClick={onClear} className="rv-editorial-link self-start sm:self-auto" data-press-feedback>
          {dictionary.clearFilters}
        </button>
      )}
    </div>
  );
}
