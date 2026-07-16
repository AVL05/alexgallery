import { photos } from "@/lib/gallery-data";
import {
  homeChapterOrder,
  homeCuration,
  type HomeCuration,
} from "@/lib/home/curation";
import type {
  BasePhoto,
  ImagesData,
  OptimizedImageData,
  PhotoCategory,
} from "@/types/photo";

export type NarrativePhoto = BasePhoto &
  Omit<OptimizedImageData, "id"> & {
    id: number;
    alt: string;
  };

export type HomeChapter = {
  category: Exclude<PhotoCategory, "Virtual">;
  count: number;
  photo: NarrativePhoto;
};

export type ArchiveSummary = {
  total: number;
  categories: Array<{ category: Exclude<PhotoCategory, "Virtual">; count: number }>;
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
): NarrativePhoto {
  return {
    ...photo,
    src: optimized?.src ?? photo.image,
    srcAvif: optimized?.srcAvif,
    width: optimized?.width ?? 1200,
    height: optimized?.height ?? 1600,
    blurDataURL: optimized?.blurDataURL,
    alt: photo.description || photo.title,
    exif: optimized?.exif,
    histogram: optimized?.histogram,
    variants: optimized?.variants,
  };
}

export function getNarrativePhotos(imagesData: ImagesData): NarrativePhoto[] {
  const optimizedById = new Map(
    imagesData.images.map((image) => [Number(image.id), image]),
  );

  return photos.map((photo) => mergePhoto(photo, optimizedById.get(photo.id)));
}

function resolvePhoto(
  allPhotos: NarrativePhoto[],
  requestedId: number,
  excludedIds: ReadonlySet<number> = new Set(),
  category?: Exclude<PhotoCategory, "Virtual">,
): NarrativePhoto {
  const requested = allPhotos.find(
    (photo) =>
      photo.id === requestedId &&
      !excludedIds.has(photo.id) &&
      (!category || photo.category === category),
  );

  const fallback = allPhotos.find(
    (photo) =>
      !excludedIds.has(photo.id) &&
      (!category || photo.category === category),
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
  curation: HomeCuration = homeCuration,
): HomeNarrativeData {
  const allPhotos = getNarrativePhotos(imagesData);
  const featured = resolvePhoto(allPhotos, curation.featuredPhotoId);
  const expansive = resolvePhoto(
    allPhotos,
    curation.expansivePhotoId,
    new Set([featured.id]),
  );

  const chapters = homeChapterOrder.map((category) => ({
    category,
    count: photos.filter((photo) => photo.category === category).length,
    photo: resolvePhoto(
      allPhotos,
      curation.chapterPhotoIds[category],
      new Set(),
      category,
    ),
  }));

  const selected: NarrativePhoto[] = [];
  const reservedIds = new Set([featured.id, expansive.id]);
  for (const id of curation.selectedPhotoIds) {
    const photo = allPhotos.find(
      (candidate) => candidate.id === id && !reservedIds.has(candidate.id),
    );
    if (photo && !selected.some((candidate) => candidate.id === photo.id)) {
      selected.push(photo);
    }
  }

  for (const photo of allPhotos) {
    if (selected.length >= curation.selectedPhotoIds.length) break;
    if (!reservedIds.has(photo.id) && !selected.some((item) => item.id === photo.id)) {
      selected.push(photo);
    }
  }

  return {
    featured,
    expansive,
    chapters,
    selected,
    archive: getArchiveSummary(),
  };
}
