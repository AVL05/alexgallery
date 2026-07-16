import { photos } from "@/lib/gallery-data";
import type { ImagesData, OptimizedImageData } from "@/types/photo";

export const heroImageConfig = {
  primaryId: "14",
  fallbackId: "46",
  objectPosition: "50% 50%",
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
    entryDuration: reducedMotion ? 0 : isTouchDevice ? 0.82 : 1.28,
    entryDistance: reducedMotion ? 0 : isTouchDevice ? 14 : 24,
    mediaScale: reducedMotion ? 1 : isTouchDevice ? 1.015 : 1.035,
    scrollMotionEnabled: !reducedMotion && !isTouchDevice,
  } as const;
}
