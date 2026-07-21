import { photos } from "@/lib/gallery-data";
import {
  homeChapterOrder,
  homeCuration,
  type HomeChapterCategory,
  type HomeCuration,
} from "@/lib/home/curation";
import { assertValidHomeCuration } from "@/lib/home/validation";
import { assertValidHomeExperience } from "@/lib/home/experience";
import { getLocalizedPhotoContent } from "@/lib/photo-detail/content";
import type { Locale } from "@/types/dictionary";
import type {
  BasePhoto,
  ImagesData,
  OptimizedImageData,
} from "@/types/photo";

export type NarrativePhoto = BasePhoto &
  Omit<OptimizedImageData, "id"> & {
    id: number;
    alt: string;
  };

export type HomeChapter = {
  category: HomeChapterCategory;
  count: number;
  photo: NarrativePhoto;
};

export type ArchiveSummary = {
  total: number;
  categories: Array<{ category: HomeChapterCategory; count: number }>;
  years: Array<{ year: string; count: number }>;
  startYear: string;
  endYear: string;
};

export type HomeNarrativeData = {
  featured: NarrativePhoto;
  expansive: NarrativePhoto;
  chapters: HomeChapter[];
  selected: NarrativePhoto[];
  archive: ArchiveSummary;
};

function mergePhoto(
  photo: BasePhoto,
  optimized: OptimizedImageData | undefined,
  locale: Locale,
): NarrativePhoto {
  const localized = getLocalizedPhotoContent(photo, locale);
  return {
    ...photo,
    ...localized,
    src: optimized?.src ?? photo.image,
    srcAvif: optimized?.srcAvif,
    width: optimized?.width ?? 1200,
    height: optimized?.height ?? 1600,
    blurDataURL: optimized?.blurDataURL,
    exif: optimized?.exif,
    histogram: optimized?.histogram,
    variants: optimized?.variants,
  };
}

export function getNarrativePhotos(
  imagesData: ImagesData,
  locale: Locale = "es",
): NarrativePhoto[] {
  const optimizedById = new Map(
    imagesData.images.map((image) => [Number(image.id), image]),
  );

  return photos.map((photo) =>
    mergePhoto(photo, optimizedById.get(photo.id), locale),
  );
}

function resolvePhoto(
  allPhotos: readonly NarrativePhoto[],
  requestedId: number,
  category?: HomeChapterCategory,
): NarrativePhoto {
  const requested = allPhotos.find(
    (photo) =>
      photo.id === requestedId && (!category || photo.category === category),
  );
  const fallback = allPhotos.find(
    (photo) => !category || photo.category === category,
  );

  if (!requested && !fallback) {
    throw new Error(`No photograph is available for ${category ?? "the home"}.`);
  }

  return requested ?? fallback!;
}

export function getArchiveSummary(): ArchiveSummary {
  const categories = homeChapterOrder.map((category) => ({
    category,
    count: photos.filter((photo) => photo.category === category).length,
  }));
  const years = Array.from(new Set(photos.map((photo) => photo.year)))
    .sort((a, b) => Number(a) - Number(b))
    .map((year) => ({
      year,
      count: photos.filter((photo) => photo.year === year).length,
    }));

  return {
    total: photos.length,
    categories,
    years,
    startYear: years.at(0)?.year ?? "-",
    endYear: years.at(-1)?.year ?? "-",
  };
}

export function getHomeNarrativeData(
  imagesData: ImagesData,
  locale: Locale = "es",
  curation: HomeCuration = homeCuration,
): HomeNarrativeData {
  assertValidHomeCuration(curation, imagesData);
  assertValidHomeExperience(curation);
  const allPhotos = getNarrativePhotos(imagesData, locale);

  return {
    featured: resolvePhoto(allPhotos, curation.featuredPhotoId),
    expansive: resolvePhoto(allPhotos, curation.expansivePhotoId),
    chapters: homeChapterOrder.map((category) => ({
      category,
      count: photos.filter((photo) => photo.category === category).length,
      photo: resolvePhoto(allPhotos, curation.chapterPhotoIds[category], category),
    })),
    selected: curation.selectedPhotoIds.map((id) => resolvePhoto(allPhotos, id)),
    archive: getArchiveSummary(),
  };
}
