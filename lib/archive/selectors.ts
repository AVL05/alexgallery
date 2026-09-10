import { photos as basePhotos } from "@/lib/gallery-data";
import type {
  ArchiveItemVariant,
  ArchivePhoto,
  ArchiveState,
} from "@/lib/archive/types";
import type { GalleryFilter, ImagesData } from "@/types/photo";
import type { Locale } from "@/types/dictionary";
import { indexOptimizedImages, mergePhotoBase } from "@/lib/photos/selectors";
import { matchesArchiveSeries } from "@/lib/archive/series";

export function buildArchivePhotos(imagesData: ImagesData, locale: Locale = "es"): ArchivePhoto[] {
  const optimizedById = indexOptimizedImages(imagesData);

  return basePhotos.map((photo, curatedIndex) => ({
    ...mergePhotoBase(photo, optimizedById.get(String(photo.id)), locale),
    curatedIndex,
  }));
}

export function normalizeArchiveText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function matchesQuery(photo: ArchivePhoto, query: string) {
  const normalizedQuery = normalizeArchiveText(query);
  if (!normalizedQuery) return true;
  return normalizeArchiveText(
    [photo.title, photo.description, photo.category, photo.year].join(" "),
  ).includes(normalizedQuery);
}

export function selectArchivePhotos(
  photos: readonly ArchivePhoto[],
  state: ArchiveState,
) {
  const filtered = photos.filter(
    (photo) =>
      (state.category === "Todo" || photo.category === state.category) &&
      (state.year === "all" || photo.year === state.year) &&
      matchesArchiveSeries(photo, state.series) &&
      matchesQuery(photo, state.query),
  );

  return [...filtered].sort((left, right) => {
    if (state.sort === "newest") {
      return Number(right.year) - Number(left.year) || left.curatedIndex - right.curatedIndex;
    }
    if (state.sort === "oldest") {
      return Number(left.year) - Number(right.year) || left.curatedIndex - right.curatedIndex;
    }
    if (state.sort === "title-asc") {
      return left.title.localeCompare(right.title, "es", { sensitivity: "base" });
    }
    if (state.sort === "title-desc") {
      return right.title.localeCompare(left.title, "es", { sensitivity: "base" });
    }
    return left.curatedIndex - right.curatedIndex;
  });
}

export function getArchiveCategoryCounts(
  photos: readonly ArchivePhoto[],
  state: ArchiveState,
  categories: readonly GalleryFilter[],
) {
  const scoped = photos.filter(
    (photo) =>
      (state.year === "all" || photo.year === state.year) &&
      matchesArchiveSeries(photo, state.series) &&
      matchesQuery(photo, state.query),
  );
  return Object.fromEntries(
    categories.map((category) => [
      category,
      category === "Todo"
        ? scoped.length
        : scoped.filter((photo) => photo.category === category).length,
    ]),
  ) as Record<GalleryFilter, number>;
}

export function getArchiveYearCounts(
  photos: readonly ArchivePhoto[],
  state: ArchiveState,
  years: readonly string[],
) {
  const scoped = photos.filter(
    (photo) =>
      (state.category === "Todo" || photo.category === state.category) &&
      matchesArchiveSeries(photo, state.series) &&
      matchesQuery(photo, state.query),
  );
  return Object.fromEntries(
    years.map((year) => [year, scoped.filter((photo) => photo.year === year).length]),
  );
}

export function getArchiveSeriesCounts(
  photos: readonly ArchivePhoto[],
  state: ArchiveState,
  filters: readonly string[],
) {
  const scoped = photos.filter(
    (photo) =>
      (state.category === "Todo" || photo.category === state.category) &&
      (state.year === "all" || photo.year === state.year) &&
      matchesQuery(photo, state.query),
  );
  return Object.fromEntries(
    filters.map((filter) => [
      filter,
      scoped.filter((photo) => matchesArchiveSeries(photo, filter)).length,
    ]),
  ) as Record<string, number>;
}

export function getArchiveItemVariant(
  photo: ArchivePhoto,
  index: number,
): ArchiveItemVariant {
  const position = index % 6;
  if (position === 0) return "featured";
  if (position === 5 && photo.width >= photo.height) return "panorama";
  if (position === 2 || position === 3 || position === 4) return "sequence";
  return "standard";
}

export function getVisibleArchiveCount(page: number, total: number) {
  if (total === 0) return 0;
  return Math.min(total, 12 + Math.max(0, page - 1) * 8);
}
