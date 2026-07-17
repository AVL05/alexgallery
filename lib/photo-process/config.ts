import type { PhotoProcessConfig } from "@/types/photo-process";

/**
 * Only add entries backed by an authentic, documented source asset.
 * The current repository contains final exports only, so production stays empty.
 */
export const photoProcessEntries: PhotoProcessConfig[] = [];

export const photoProcessCuration: { featuredPhotoId: number | null } = {
  featuredPhotoId: null,
};
