import type { PhotoCategory } from "@/types/photo";

export type HomeCuration = {
  featuredPhotoId: number;
  expansivePhotoId: number;
  chapterPhotoIds: Record<Exclude<PhotoCategory, "Virtual">, number>;
  selectedPhotoIds: readonly number[];
};

export const homeChapterOrder = [
  "Fauna",
  "Arquitectura",
  "Paisaje",
  "Retrato",
  "Meteorología",
] as const satisfies readonly Exclude<PhotoCategory, "Virtual">[];

export const homeCuration = {
  featuredPhotoId: 46,
  expansivePhotoId: 3,
  chapterPhotoIds: {
    Fauna: 1,
    Arquitectura: 6,
    Paisaje: 17,
    Retrato: 44,
    Meteorología: 41,
  },
  selectedPhotoIds: [5, 13, 21, 35, 49, 51],
} as const satisfies HomeCuration;

export const homeImageFallbackSrc = "/photos/optimized/800/1.webp";

export const alternateHomeCuration = {
  featuredPhotoId: 17,
  expansivePhotoId: 41,
  chapterPhotoIds: {
    Fauna: 7,
    Arquitectura: 21,
    Paisaje: 30,
    Retrato: 46,
    Meteorología: 3,
  },
  selectedPhotoIds: [1, 6, 11, 16, 24, 50],
} as const satisfies HomeCuration;
