import type { PhotoCategory } from "@/types/photo";

export type HomeChapterCategory = Exclude<PhotoCategory, "Virtual">;

export type HomeCuration = {
  heroPhotoId: number;
  featuredPhotoId: number;
  expansivePhotoId: number;
  chapterPhotoIds: Record<HomeChapterCategory, number>;
  selectedPhotoIds: readonly number[];
  archiveIndexPhotoIds: readonly number[];
};

export const homeChapterOrder = [
  "Fauna",
  "Arquitectura",
  "Paisaje",
  "Personas",
  "Meteorología",
] as const satisfies readonly HomeChapterCategory[];

export const homeCuration = {
  heroPhotoId: 14,
  featuredPhotoId: 46,
  expansivePhotoId: 3,
  chapterPhotoIds: {
    Fauna: 7,
    Arquitectura: 48,
    Paisaje: 30,
    Personas: 44,
    Meteorología: 41,
  },
  selectedPhotoIds: [1, 35, 21, 37, 49],
  archiveIndexPhotoIds: [11],
} as const satisfies HomeCuration;

export const homeImageFallbackSrc = "/photos/optimized/800/1.webp";

export const alternateHomeCuration = {
  heroPhotoId: 14,
  featuredPhotoId: 17,
  expansivePhotoId: 41,
  chapterPhotoIds: {
    Fauna: 1,
    Arquitectura: 6,
    Paisaje: 30,
    Personas: 46,
    Meteorología: 3,
  },
  selectedPhotoIds: [7, 11, 13, 21, 44],
  archiveIndexPhotoIds: [12],
} as const satisfies HomeCuration;

export function getHomeNarrativePhotoIds(curation: HomeCuration = homeCuration) {
  return [
    curation.featuredPhotoId,
    curation.expansivePhotoId,
    ...homeChapterOrder.map((category) => curation.chapterPhotoIds[category]),
    ...curation.selectedPhotoIds,
  ] as const;
}
