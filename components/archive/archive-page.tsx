"use client";

import { ArchiveEmptyState } from "@/components/archive/archive-empty-state";
import { ArchiveFilters } from "@/components/archive/archive-filters";
import { ArchiveGrid } from "@/components/archive/archive-grid";
import { ArchiveHeader } from "@/components/archive/archive-header";
import { ArchiveMobileFilters } from "@/components/archive/archive-mobile-filters";
import { ArchivePagination } from "@/components/archive/archive-pagination";
import { ArchiveResultsSummary } from "@/components/archive/archive-results-summary";
import { ArchiveToolbar } from "@/components/archive/archive-toolbar";
import { useMotion } from "@/components/motion/motion-provider";
import { Container } from "@/components/ui/layout";
import { useArchiveState } from "@/hooks/use-archive-state";
import {
  getArchiveCategoryCounts,
  getArchiveYearCounts,
  getVisibleArchiveCount,
  selectArchivePhotos,
} from "@/lib/archive/selectors";
import { getArchiveContextKey, readArchiveContext } from "@/lib/archive/context";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { categories } from "@/lib/gallery-data";
import type { GalleryDictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function ArchivePage({
  dictionary,
  locale,
  imagesData,
}: {
  dictionary: GalleryDictionary;
  locale: Locale;
  imagesData: ImagesData;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const restoredRef = useRef(false);
  const photos = useMemo(() => buildArchivePhotos(imagesData), [imagesData]);
  const years = useMemo(
    () => [...new Set(photos.map((photo) => photo.year))].sort((a, b) => Number(b) - Number(a)),
    [photos],
  );
  const {
    state,
    hydrated,
    setCategory,
    setYear,
    setSort,
    setQuery,
    setPage,
    clear,
  } = useArchiveState(years);
  const [searchValue, setSearchValue] = useState(state.query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { refreshScrollTriggers, scrollTo } = useMotion();

  const filteredPhotos = useMemo(
    () => selectArchivePhotos(photos, state),
    [photos, state],
  );
  const categoryCounts = useMemo(
    () => getArchiveCategoryCounts(photos, state, categories),
    [photos, state],
  );
  const yearCounts = useMemo(
    () => getArchiveYearCounts(photos, state, years),
    [photos, state, years],
  );
  const visibleCount = getVisibleArchiveCount(state.page, filteredPhotos.length);
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const maxPage = Math.max(
    1,
    filteredPhotos.length <= 12
      ? 1
      : 1 + Math.ceil((filteredPhotos.length - 12) / 8),
  );
  const activeFilterCount =
    Number(state.category !== "Todo") +
    Number(state.year !== "all") +
    Number(state.sort !== "curated");
  const startYear = [...years].sort()[0] || "—";
  const endYear = [...years].sort().at(-1) || "—";
  const endDescription = dictionary.endDescription
    .replace("{total}", String(photos.length))
    .replace("{years}", String(years.length));
  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);

  useEffect(() => setSearchValue(state.query), [state.query]);

  useEffect(() => {
    if (!hydrated || searchValue === state.query) return;
    const timeout = window.setTimeout(() => setQuery(searchValue), 220);
    return () => window.clearTimeout(timeout);
  }, [hydrated, searchValue, setQuery, state.query]);

  useEffect(() => {
    if (!hydrated || state.page <= maxPage) return;
    setPage(maxPage, "replace");
  }, [hydrated, maxPage, setPage, state.page]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(refreshScrollTriggers);
    return () => window.cancelAnimationFrame(frame);
  }, [refreshScrollTriggers, visiblePhotos.length]);

  useEffect(() => {
    if (!hydrated || restoredRef.current) return;
    const context = readArchiveContext(locale);
    if (!context) return;
    const currentHref = `${window.location.pathname}${window.location.search}#gallery`;
    if (context.archiveHref !== currentHref) return;
    if (!visiblePhotos.some((photo) => photo.id === context.photoId)) return;

    restoredRef.current = true;
    const frame = window.requestAnimationFrame(() => {
      scrollTo(context.scrollY);
      document
        .getElementById(`archive-photo-${context.photoId}`)
        ?.querySelector<HTMLElement>("a")
        ?.focus({ preventScroll: true });
      try {
        window.sessionStorage.removeItem(getArchiveContextKey(locale));
      } catch {
        // Native history remains available when storage is blocked.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, locale, scrollTo, visiblePhotos]);

  return (
    <section
      ref={rootRef}
      id="gallery"
      aria-labelledby="archive-title"
      className="rv-section overflow-hidden bg-[var(--color-background-secondary)]"
    >
      <Container>
        <a
          href="#archive-results"
          className="sr-only fixed left-4 top-4 z-[var(--z-modal)] bg-accent px-4 py-3 text-accent-foreground focus:not-sr-only"
        >
          {dictionary.skipToResults}
        </a>
        <ArchiveHeader
          dictionary={dictionary}
          total={photos.length}
          startYear={startYear}
          endYear={endYear}
          categoryCount={categories.length - 1}
        />
        <noscript>
          <div className="mt-10 border-y border-border py-8">
            <p className="rv-label mb-5">{dictionary.photoPlural}</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <li key={photo.id}>
                  <a
                    href={`/${locale}/photo/${photo.id}`}
                    className="rv-editorial-link"
                  >
                    {photo.title} · {photo.year}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </noscript>

        <div className="mt-12 lg:mt-16">
          <ArchiveToolbar
            dictionary={dictionary}
            query={searchValue}
            sort={state.sort}
            activeFilterCount={activeFilterCount}
            onQueryChange={setSearchValue}
            onSortChange={setSort}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />

          <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-16">
            <aside className="hidden border-r border-border pr-8 pt-8 lg:block" aria-label={dictionary.filtersLabel}>
              <ArchiveFilters
                dictionary={dictionary}
                state={state}
                categories={categories}
                categoryCounts={categoryCounts}
                years={years}
                yearCounts={yearCounts}
                onCategoryChange={setCategory}
                onYearChange={setYear}
              />
            </aside>

            <div>
              <ArchiveResultsSummary
                dictionary={dictionary}
                state={state}
                count={filteredPhotos.length}
                onClear={clear}
              />
              {filteredPhotos.length === 0 ? (
                <ArchiveEmptyState dictionary={dictionary} onClear={clear} />
              ) : (
                <>
                  <ArchiveGrid
                    photos={visiblePhotos}
                    locale={locale}
                    state={state}
                    dictionary={dictionary}
                  />
                  <ArchivePagination
                    dictionary={dictionary}
                    visible={visiblePhotos.length}
                    total={filteredPhotos.length}
                    onLoadMore={() => setPage(Math.min(maxPage, state.page + 1))}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-20 grid gap-8 border-t border-border pt-8 md:grid-cols-12 md:items-end lg:mt-28">
          <div className="md:col-span-8">
            <p className="rv-kicker">{dictionary.endLabel}</p>
            <h3 className="mt-4 max-w-[15ch] font-serif text-[clamp(2rem,4vw,4.5rem)] leading-tight tracking-[-0.035em]">
              {dictionary.endTitle}
            </h3>
            <p className="mt-5 max-w-xl text-[var(--color-text-secondary)]">
              {endDescription}
            </p>
          </div>
          <Link href="#hero" className="rv-editorial-link md:col-span-4 md:justify-self-end">
            {dictionary.backToTop} <ArrowUp aria-hidden="true" className="size-4" />
          </Link>
        </footer>
      </Container>

      <ArchiveMobileFilters
        open={mobileFiltersOpen}
        dictionary={dictionary}
        state={state}
        categories={categories}
        categoryCounts={categoryCounts}
        years={years}
        yearCounts={yearCounts}
        resultCount={filteredPhotos.length}
        onClose={closeMobileFilters}
        onClear={clear}
        onCategoryChange={setCategory}
        onYearChange={setYear}
        onSortChange={setSort}
      />
    </section>
  );
}
