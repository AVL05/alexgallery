import type { ArchiveSort } from "@/lib/archive/types";
import type { GalleryDictionary } from "@/types/dictionary";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function ArchiveToolbar({
  dictionary,
  query,
  sort,
  activeFilterCount,
  onQueryChange,
  onSortChange,
  onOpenFilters,
}: {
  dictionary: GalleryDictionary;
  query: string;
  sort: ArchiveSort;
  activeFilterCount: number;
  onQueryChange: (value: string) => void;
  onSortChange: (value: ArchiveSort) => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="grid gap-4 border-y border-border py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <label htmlFor="archive-search" className="rv-label mb-2 block">
          {dictionary.searchLabel}
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            id="archive-search"
            type="search"
            value={query}
            maxLength={120}
            autoComplete="off"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={dictionary.searchPlaceholder}
            className="rv-field pl-10 pr-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              data-press-feedback
              className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-[var(--color-text-muted)] hover:text-foreground"
              aria-label={dictionary.clearSearch}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          data-press-feedback
          {...getCursorTargetAttributes({ type: "open" })}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-[var(--color-border-strong)] md:hidden"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {dictionary.filtersLabel}
          {activeFilterCount > 0 && (
            <span className="font-mono text-accent">{activeFilterCount}</span>
          )}
        </button>
        <div className="hidden min-w-56 md:block">
          <label htmlFor="archive-sort" className="rv-label mb-2 block">
            {dictionary.sortLabel}
          </label>
          <select
            id="archive-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ArchiveSort)}
            className="rv-field"
          >
            <option value="curated">{dictionary.sort.curated}</option>
            <option value="newest">{dictionary.sort.newest}</option>
            <option value="oldest">{dictionary.sort.oldest}</option>
            <option value="title-asc">{dictionary.sort.titleAsc}</option>
            <option value="title-desc">{dictionary.sort.titleDesc}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
