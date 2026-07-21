import { photoSeries } from "@/lib/series/config";
import type {
  LocalizedPhotoSeries,
  PhotoSeries,
} from "@/lib/series/types";
import type { Locale } from "@/types/dictionary";

export function getPublishedSeries() {
  return photoSeries.filter((series) => series.status === "published");
}

export function getSeriesById(id: string) {
  return photoSeries.find((series) => series.id === id) ?? null;
}

export function getSeriesBySlug(slug: string) {
  return photoSeries.find((series) => series.slug === slug) ?? null;
}

export function getSeriesForPhoto(photoId: number) {
  return getPublishedSeries().find((series) => (series.photoIds as readonly number[]).includes(photoId)) ?? null;
}

export function getLocalizedSeries(
  series: PhotoSeries,
  locale: Locale,
): LocalizedPhotoSeries {
  return {
    ...series,
    title: series.title[locale] || series.title.es,
    description: series.description[locale] || series.description.es,
    location: series.location?.[locale] || series.location?.es,
  };
}

export function resolveSeriesCover<T extends { id: number }>(
  series: PhotoSeries,
  photos: readonly T[],
) {
  return photos.find((photo) => photo.id === series.coverPhotoId) ?? null;
}

export function resolveSeriesPhotos<T extends { id: number }>(
  series: PhotoSeries,
  photos: readonly T[],
) {
  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  return series.photoIds.flatMap((id) => {
    const photo = byId.get(id);
    return photo ? [photo] : [];
  });
}

export function getSeriesPosition(series: Pick<PhotoSeries, "photoIds">, photoId: number) {
  const index = (series.photoIds as readonly number[]).indexOf(photoId);
  return index < 0 ? null : { index, current: index + 1, total: series.photoIds.length };
}

export function getSeriesNavigation<T extends { id: number }>(
  series: PhotoSeries,
  currentId: number,
  photos: readonly T[],
) {
  const ordered = resolveSeriesPhotos(series, photos);
  const index = ordered.findIndex((photo) => photo.id === currentId);
  return {
    collection: ordered,
    index,
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

export function getRelatedSeries(seriesId: string, limit = 2) {
  const published = getPublishedSeries();
  const index = published.findIndex((series) => series.id === seriesId);
  if (index < 0 || published.length < 2) return [];
  return Array.from({ length: Math.min(limit, published.length - 1) }, (_, offset) =>
    published[(index + offset + 1) % published.length],
  );
}

export function getNextSeries(seriesId: string) {
  return getRelatedSeries(seriesId, 1)[0] ?? null;
}

export function getSeriesHref(locale: Locale | string, slug: string) {
  return `/${locale}/series/${slug}`;
}

export function getSeriesPhotoHref(
  locale: Locale | string,
  photoId: number,
  slug: string,
) {
  return `/${locale}/photo/${photoId}?series=${encodeURIComponent(slug)}`;
}

export function getSeriesReturnHref(
  locale: Locale | string,
  slug: string,
  photoId: number,
) {
  return `${getSeriesHref(locale, slug)}#series-photo-${photoId}`;
}

export function getValidSeriesContext(search: string, photoId: number) {
  const slug = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("series");
  if (!slug) return null;
  const series = getSeriesBySlug(slug);
  return series?.status === "published" && (series.photoIds as readonly number[]).includes(photoId) ? series : null;
}

export function getUnassignedPhotoIds(photoIds: readonly number[]) {
  const assigned = new Set<number>(getPublishedSeries().flatMap((series) => [...series.photoIds]));
  return photoIds.filter((id) => !assigned.has(id));
}
