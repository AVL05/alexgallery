import type { ArchiveState } from "@/lib/archive/types";
import type { GalleryDictionary } from "@/types/dictionary";
import type { GalleryFilter } from "@/types/photo";

export function ArchiveFilters({
  dictionary,
  state,
  categories,
  categoryCounts,
  years,
  yearCounts,
  onCategoryChange,
  onYearChange,
}: {
  dictionary: GalleryDictionary;
  state: ArchiveState;
  categories: readonly GalleryFilter[];
  categoryCounts: Record<GalleryFilter, number>;
  years: readonly string[];
  yearCounts: Record<string, number>;
  onCategoryChange: (category: GalleryFilter) => void;
  onYearChange: (year: string) => void;
}) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="rv-label mb-4">{dictionary.categoriesLabel}</legend>
        <div className="grid border-t border-border sm:grid-cols-2 lg:block">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={state.category === category}
              onClick={() => onCategoryChange(category)}
              className="group flex min-h-12 w-full items-center justify-between gap-4 border-b border-border px-1 text-left text-sm transition-colors hover:bg-[var(--color-hover)] focus-visible:bg-[var(--color-hover)]"
            >
              <span
                className={
                  state.category === category
                    ? "text-accent"
                    : "text-[var(--color-text-secondary)] group-hover:text-foreground"
                }
              >
                {dictionary.categories[category] || category}
              </span>
              <span className="rv-index tabular-nums">
                {String(categoryCounts[category] || 0).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="rv-label mb-4">{dictionary.yearLabel}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <button
            type="button"
            aria-pressed={state.year === "all"}
            onClick={() => onYearChange("all")}
            className={`min-h-11 border-b px-1 text-xs uppercase tracking-[0.14em] transition-colors ${
              state.year === "all"
                ? "border-accent text-accent"
                : "border-transparent text-[var(--color-text-muted)] hover:text-foreground"
            }`}
          >
            {dictionary.allYears}
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={state.year === year}
              disabled={!yearCounts[year]}
              onClick={() => onYearChange(year)}
              className={`min-h-11 border-b px-1 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                state.year === year
                  ? "border-accent text-accent"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-foreground"
              }`}
            >
              {year} <span aria-hidden="true">· {yearCounts[year] || 0}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
