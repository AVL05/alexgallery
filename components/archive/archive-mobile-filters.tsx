"use client";

import { ArchiveFilters } from "@/components/archive/archive-filters";
import { useMotion } from "@/components/motion/motion-provider";
import type { ArchiveSort, ArchiveState } from "@/lib/archive/types";
import type { GalleryDictionary } from "@/types/dictionary";
import type { GalleryFilter } from "@/types/photo";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function ArchiveMobileFilters({
  open,
  dictionary,
  state,
  categories,
  categoryCounts,
  years,
  yearCounts,
  resultCount,
  onClose,
  onClear,
  onCategoryChange,
  onYearChange,
  onSortChange,
}: {
  open: boolean;
  dictionary: GalleryDictionary;
  state: ArchiveState;
  categories: readonly GalleryFilter[];
  categoryCounts: Record<GalleryFilter, number>;
  years: readonly string[];
  yearCounts: Record<string, number>;
  resultCount: number;
  onClose: () => void;
  onClear: () => void;
  onCategoryChange: (category: GalleryFilter) => void;
  onYearChange: (year: string) => void;
  onSortChange: (sort: ArchiveSort) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { lockScroll } = useMotion();

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const releaseScroll = lockScroll("archive-mobile-filters");
    const panel = panelRef.current;
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), select, input, [href], [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const frame = window.requestAnimationFrame(() => first?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      releaseScroll();
      previousFocusRef.current?.focus();
    };
  }, [lockScroll, onClose, open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-mobile-filter-title"
      className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-background px-[var(--layout-gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:hidden"
    >
      <div className="mx-auto flex min-h-full max-w-xl flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 py-3 backdrop-blur-md">
          <div>
            <p className="rv-kicker">raw.vives</p>
            <h2 id="archive-mobile-filter-title" className="mt-2 font-serif text-3xl">
              {dictionary.filtersLabel}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-press-feedback
            {...getCursorTargetAttributes({ type: "close", contrast: "dark" })}
            className="flex size-11 items-center justify-center"
            aria-label={dictionary.closeFilters}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="flex-1 py-8">
          <ArchiveFilters
            dictionary={dictionary}
            state={state}
            categories={categories}
            categoryCounts={categoryCounts}
            years={years}
            yearCounts={yearCounts}
            onCategoryChange={onCategoryChange}
            onYearChange={onYearChange}
          />
          <div className="mt-8">
            <label htmlFor="archive-mobile-sort" className="rv-label mb-3 block">
              {dictionary.sortLabel}
            </label>
            <select
              id="archive-mobile-sort"
              value={state.sort}
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

        <footer className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border bg-background/95 py-4 backdrop-blur-md">
          <button type="button" onClick={onClear} data-press-feedback className="min-h-12 border border-border px-4 text-xs font-semibold uppercase tracking-[0.14em]">
            {dictionary.clearFilters}
          </button>
          <button type="button" onClick={onClose} data-press-feedback className="min-h-12 bg-accent px-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            {dictionary.showResults.replace("{count}", String(resultCount))}
          </button>
        </footer>
      </div>
    </div>
  );
}
