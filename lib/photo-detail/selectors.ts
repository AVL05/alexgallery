import { defaultArchiveState, type ArchivePhoto, type ArchiveState } from "@/lib/archive/types";
import { selectArchivePhotos } from "@/lib/archive/selectors";
import { serializeArchiveState } from "@/lib/archive/url";

export type PhotoOrientation = "horizontal" | "vertical" | "square";

export function getPhotoOrientation(photo: Pick<ArchivePhoto, "width" | "height">): PhotoOrientation {
  if (photo.width === photo.height) return "square";
  return photo.width > photo.height ? "horizontal" : "vertical";
}

export function getPhotoDetailHref(locale: string, id: number, state?: ArchiveState) {
  return `/${locale}/photo/${id}${state ? serializeArchiveState(state) : ""}`;
}

export function resolvePhotoNavigation(
  photos: readonly ArchivePhoto[],
  photoId: number,
  state: ArchiveState = defaultArchiveState,
) {
  const contextual = selectArchivePhotos(photos, state);
  const contextualIndex = contextual.findIndex((photo) => photo.id === photoId);
  const collection = contextualIndex >= 0 ? contextual : selectArchivePhotos(photos, defaultArchiveState);
  const index = collection.findIndex((photo) => photo.id === photoId);
  return {
    collection,
    index,
    isContextual: contextualIndex >= 0 && serializeArchiveState(state) !== "",
    previous: index > 0 ? collection[index - 1] : null,
    next: index >= 0 && index < collection.length - 1 ? collection[index + 1] : null,
  };
}

export function selectRelatedPhotos(photos: readonly ArchivePhoto[], currentId: number, limit = 4) {
  const current = photos.find((photo) => photo.id === currentId);
  if (!current) return [];
  return photos
    .filter((photo) => photo.id !== currentId)
    .map((photo) => ({
      photo,
      score:
        Number(photo.category === current.category) * 100 +
        Number(photo.year === current.year) * 20 -
        Math.abs(photo.curatedIndex - current.curatedIndex),
    }))
    .sort((left, right) => right.score - left.score || left.photo.curatedIndex - right.photo.curatedIndex)
    .slice(0, Math.max(0, limit))
    .map(({ photo }) => photo);
}

export function getAvailableExif(photo: ArchivePhoto) {
  const entries = photo.exif
    ? Object.entries(photo.exif).filter(([, value]) => value !== undefined && value !== null && value !== "")
    : [];
  return Object.fromEntries(entries);
}
