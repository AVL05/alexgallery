import { defaultArchiveState, type ArchivePhoto, type ArchiveState } from "@/lib/archive/types";
import { selectArchivePhotos } from "@/lib/archive/selectors";
import { serializeArchiveState } from "@/lib/archive/url";
import { getHomeNarrativePhotoIds } from "@/lib/home/curation";
import { getSeriesForPhoto, getSeriesNavigation } from "@/lib/series/selectors";

const homeNarrativePhotoIds = new Set(getHomeNarrativePhotoIds());

export type PhotoOrientation = "horizontal" | "vertical" | "square";

export function getPhotoOrientation(photo: Pick<ArchivePhoto, "width" | "height">): PhotoOrientation {
  if (photo.width === photo.height) return "square";
  return photo.width > photo.height ? "horizontal" : "vertical";
}

export function getPhotoDetailHref(locale: string, id: number, state?: ArchiveState, seriesSlug?: string | null) {
  return `/${locale}/photo/${id}${seriesSlug ? `?series=${encodeURIComponent(seriesSlug)}` : state ? serializeArchiveState(state) : ""}`;
}

export function resolvePhotoNavigation(
  photos: readonly ArchivePhoto[],
  photoId: number,
  state: ArchiveState = defaultArchiveState,
  seriesSlug?: string | null,
) {
  const series = seriesSlug ? getSeriesForPhoto(photoId) : null;
  if (series && series.slug === seriesSlug) {
    const navigation = getSeriesNavigation(series, photoId, photos);
    return { ...navigation, contextType: "series" as const, isContextual: true, series };
  }
  const contextual = selectArchivePhotos(photos, state);
  const contextualIndex = contextual.findIndex((photo) => photo.id === photoId);
  const collection = contextualIndex >= 0 ? contextual : selectArchivePhotos(photos, defaultArchiveState);
  const index = collection.findIndex((photo) => photo.id === photoId);
  return {
    collection,
    index,
    contextType: contextualIndex >= 0 && serializeArchiveState(state) !== "" ? ("archive" as const) : ("global" as const),
    isContextual: contextualIndex >= 0 && serializeArchiveState(state) !== "",
    series: null,
    previous: index > 0 ? collection[index - 1] : null,
    next: index >= 0 && index < collection.length - 1 ? collection[index + 1] : null,
  };
}

export function selectRelatedPhotos(photos: readonly ArchivePhoto[], currentId: number, limit = 4) {
  const current = photos.find((photo) => photo.id === currentId);
  if (!current) return [];
  const series = getSeriesForPhoto(currentId);
  const sameSeries = series
    ? series.photoIds
        .filter((id) => id !== currentId)
        .flatMap((id) => {
          const photo = photos.find((candidate) => candidate.id === id);
          return photo ? [photo] : [];
        })
        .slice(0, Math.min(1, limit))
    : [];
  const reservedIds = new Set([currentId, ...sameSeries.map((photo) => photo.id)]);
  const currentSeriesIds = new Set<number>(series ? [...series.photoIds] : []);
  const external = photos
    .filter((photo) => !reservedIds.has(photo.id) && !currentSeriesIds.has(photo.id))
    .map((photo) => ({
      photo,
      score:
        Number(photo.category === current.category) * 100 +
        Number(photo.year === current.year) * 20 -
        Math.abs(photo.curatedIndex - current.curatedIndex) -
        Number(homeNarrativePhotoIds.has(photo.id)) * 0.25,
    }))
    .sort((left, right) => right.score - left.score || left.photo.curatedIndex - right.photo.curatedIndex)
    .slice(0, Math.max(0, limit - sameSeries.length))
    .map(({ photo }) => photo);
  return [...sameSeries, ...external];
}

export function getAvailableExif(photo: ArchivePhoto) {
  const entries = photo.exif
    ? Object.entries(photo.exif).filter(([, value]) => value !== undefined && value !== null && value !== "")
    : [];
  return Object.fromEntries(entries);
}
