import { photos } from "@/lib/gallery-data";
import { homeCuration } from "@/lib/home/curation";
import type { ImagesData, OptimizedImageData } from "@/types/photo";
import { photoMotionTokens } from "@/lib/motion/photo-motion";

export const heroImageConfig = {
  primaryId: String(homeCuration.heroPhotoId),
  fallbackId: "46",
  objectPosition: "50% 50%",
  // Curated, reversible crop for narrow screens only: a square detail centred
  // on the lightning. Wider screens always show the complete 2.17:1 frame.
  mobileDetail: { ratio: 1, objectPosition: "46% 55%" },
} as const;

export type HeroArchiveFacts = {
  count: number;
  dateRange: string;
};

export function getHeroImages(imagesData: ImagesData): {
  primary: OptimizedImageData;
  fallback: OptimizedImageData;
} {
  const primary = imagesData.images.find((image) => image.id === heroImageConfig.primaryId);
  const fallback = imagesData.images.find((image) => image.id === heroImageConfig.fallbackId);

  if (!primary || !fallback) {
    throw new Error("Hero image configuration does not match images-data.json");
  }

  return { primary, fallback };
}

export function getHeroArchiveFacts(): HeroArchiveFacts {
  const years = photos.map((photo) => Number(photo.year)).filter(Number.isFinite);
  const start = Math.min(...years);
  const end = Math.max(...years);

  return {
    count: photos.length,
    dateRange: start === end ? String(start) : `${start}–${end}`,
  };
}

export function getHeroMotionProfile({
  reducedMotion,
  isTouchDevice,
}: {
  reducedMotion: boolean;
  isTouchDevice: boolean;
}) {
  return {
    entryDuration: reducedMotion ? 0 : isTouchDevice ? photoMotionTokens.hero.touchDuration : photoMotionTokens.hero.duration,
    entryDistance: reducedMotion ? 0 : isTouchDevice ? photoMotionTokens.hero.touchDistance : photoMotionTokens.hero.distance,
    mediaScale: reducedMotion ? 1 : isTouchDevice ? photoMotionTokens.hero.touchScale : photoMotionTokens.hero.scale,
    scrollMotionEnabled: !reducedMotion && !isTouchDevice,
  } as const;
}
