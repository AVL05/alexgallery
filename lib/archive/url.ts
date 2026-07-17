import type { GalleryFilter } from "@/types/photo";
import {
  archiveSortOptions,
  defaultArchiveState,
  type ArchiveSort,
  type ArchiveState,
} from "@/lib/archive/types";

const categorySlugs: Record<GalleryFilter, string> = {
  Todo: "all",
  Fauna: "fauna",
  Arquitectura: "arquitectura",
  Paisaje: "paisaje",
  Retrato: "retrato",
  Meteorología: "meteorologia",
  Virtual: "virtual",
};

const archiveParameterNames = ["category", "year", "q", "sort", "page"] as const;

export function getArchiveCategorySlug(category: GalleryFilter) {
  return categorySlugs[category];
}

export function parseArchiveSearch(
  search: string,
  validCategories: readonly GalleryFilter[],
  validYears: readonly string[],
): ArchiveState {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const categoryEntry = Object.entries(categorySlugs).find(
    ([category, slug]) =>
      slug === params.get("category") &&
      validCategories.includes(category as GalleryFilter),
  );
  const year = params.get("year");
  const sort = params.get("sort");
  const page = Number.parseInt(params.get("page") || "1", 10);

  return {
    category: (categoryEntry?.[0] as GalleryFilter | undefined) ?? "Todo",
    year: year && validYears.includes(year) ? year : "all",
    query: (params.get("q") || "").trim().slice(0, 120),
    sort: archiveSortOptions.includes(sort as ArchiveSort)
      ? (sort as ArchiveSort)
      : "curated",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function serializeArchiveState(
  state: ArchiveState,
  currentSearch = "",
): string {
  const params = new URLSearchParams(
    currentSearch.startsWith("?") ? currentSearch.slice(1) : currentSearch,
  );

  archiveParameterNames.forEach((name) => params.delete(name));

  if (state.category !== defaultArchiveState.category) {
    params.set("category", getArchiveCategorySlug(state.category));
  }
  if (state.year !== defaultArchiveState.year) params.set("year", state.year);
  if (state.query) params.set("q", state.query.trim());
  if (state.sort !== defaultArchiveState.sort) params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function getArchiveHref(
  locale: string,
  state: ArchiveState = defaultArchiveState,
) {
  return `/${locale}${serializeArchiveState(state)}#gallery`;
}

export function getCategoryArchiveHref(locale: string, category: GalleryFilter) {
  return getArchiveHref(locale, { ...defaultArchiveState, category });
}
