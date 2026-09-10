import { homeChapterOrder, homeCuration } from "@/lib/home/curation";
import { getLocalizedPhotoContent } from "@/lib/photo-detail/content";
import { getPhotoOrientation } from "@/lib/photo-detail/selectors";
import { getSeriesBySlug, getSeriesForPhoto, resolveSeriesPhotos } from "@/lib/series/selectors";
import type { Locale } from "@/types/dictionary";
import type {
  BasePhoto,
  ExifData,
  ImagesData,
  OptimizedImageData,
  PhotoCategory,
} from "@/types/photo";

// Shared merge of editorial content (ES base + EN overrides) with pipeline
// image data. Home, Archive and future pages (work, films) consume this so
// ordering and fallbacks stay identical everywhere.
export type MergedPhotoBase = BasePhoto & {
  title: string;
  description: string;
  alt: string;
  src: string;
  image: string;
  width: number;
  height: number;
  srcAvif?: string;
  blurDataURL?: string;
  exif?: ExifData;
  histogram?: number[];
  variants?: Record<string, string>;
};

export function indexOptimizedImages(imagesData: ImagesData): Map<string, OptimizedImageData> {
  return new Map(imagesData.images.map((image) => [String(image.id), image]));
}

export function mergePhotoBase(
  photo: BasePhoto,
  optimized: OptimizedImageData | undefined,
  locale: Locale,
): MergedPhotoBase {
  const localized = getLocalizedPhotoContent(photo, locale);
  const src = optimized?.src || photo.image;
  return {
    ...photo,
    ...localized,
    ...optimized,
    id: photo.id,
    src,
    image: src,
    alt: localized.alt,
    width: optimized?.width ?? 1200,
    height: optimized?.height ?? 1600,
  };
}

// Editorial entry layout for Selected Work / /work, driven by each photo's
// ratio and position. Server-safe so pages can resolve it during prerender.
export type WorkEntryVariant = "offset-right" | "offset-left" | "narrow" | "panorama";

export function resolveWorkEntryVariant(
  photo: Pick<MergedPhotoBase, "width" | "height">,
  index: number,
  total: number,
): WorkEntryVariant {
  if (getPhotoOrientation(photo) === "vertical") return "narrow";
  if (total > 1 && index === total - 1) return "panorama";
  return index % 2 === 0 ? "offset-right" : "offset-left";
}

export function selectSelectedPhotos<T extends { id: number }>(all: readonly T[]): T[] {
  return homeCuration.selectedPhotoIds.flatMap((id) => {
    const photo = all.find((entry) => entry.id === id);
    return photo ? [photo] : [];
  });
}

export function selectFeaturedPhotos<T extends { id: number; featured?: boolean }>(
  all: readonly T[],
): T[] {
  return all.filter((photo) => photo.featured);
}

export function selectPhotosByCategory<T extends { category: PhotoCategory }>(
  all: readonly T[],
  category: PhotoCategory,
): T[] {
  return all.filter((photo) => photo.category === category);
}

export function selectPhotosByYear<T extends { year: string }>(
  all: readonly T[],
  year: string,
): T[] {
  return all.filter((photo) => photo.year === year);
}

export function selectPhotosBySeries<T extends { id: number }>(
  all: readonly T[],
  slug: string,
): T[] {
  const series = getSeriesBySlug(slug);
  if (!series) return [];
  return resolveSeriesPhotos(series, all);
}

type PreviewCandidate = {
  id: number;
  category: PhotoCategory;
  year: string;
  width: number;
  height: number;
};

// Deterministic preview pick: round-robin categories preferring fresh years,
// fresh series and alternating orientations. Stable for the same catalog.
export function selectArchivePreviewPhotos<T extends PreviewCandidate>(
  all: readonly T[],
  excludeIds: readonly number[] = [],
  limit = 8,
): T[] {
  const excluded = new Set(excludeIds);
  const pool = all.filter((photo) => !excluded.has(photo.id));
  const byCategory = new Map<PhotoCategory, T[]>();
  for (const photo of pool) {
    const list = byCategory.get(photo.category) ?? [];
    list.push(photo);
    byCategory.set(photo.category, list);
  }
  const orientation = (photo: PreviewCandidate) =>
    photo.width === photo.height ? "square" : photo.width > photo.height ? "landscape" : "portrait";
  const picked: T[] = [];
  const usedYears = new Set<string>();
  const usedSeries = new Set<string>();
  const usedCategories = new Set<PhotoCategory>();
  let lastOrientation: string | null = null;
  const orderedCategories = [
    ...homeChapterOrder.filter((category) => byCategory.has(category)),
    ...[...byCategory.keys()].filter((category) => !(homeChapterOrder as readonly string[]).includes(category)),
  ];
  while (picked.length < limit && pool.length > picked.length) {
    let best: T | null = null;
    let bestScore = -1;
    for (const category of orderedCategories) {
      for (const photo of byCategory.get(category) ?? []) {
        if (picked.includes(photo)) continue;
        const series = getSeriesForPhoto(photo.id)?.slug ?? null;
        let score = 0;
        if (!usedCategories.has(photo.category)) score += 2;
        if (!usedYears.has(photo.year)) score += 2;
        if (series && !usedSeries.has(series)) score += 2;
        if (!series) score += 1;
        if (orientation(photo) !== lastOrientation) score += 1;
        if (score > bestScore) {
          best = photo;
          bestScore = score;
        }
      }
    }
    if (!best) break;
    picked.push(best);
    usedCategories.add(best.category);
    usedYears.add(best.year);
    const series = getSeriesForPhoto(best.id)?.slug;
    if (series) usedSeries.add(series);
    lastOrientation = orientation(best);
  }
  return picked;
}
