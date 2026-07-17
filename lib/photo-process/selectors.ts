import { photoProcessEntries } from "@/lib/photo-process/config";
import { clampProcessPosition, PHOTO_PROCESS_DEFAULT_POSITION } from "@/lib/photo-process/interaction";
import type { ArchivePhoto } from "@/lib/archive/types";
import type { Locale, PhotoProcessDictionary } from "@/types/dictionary";
import type { PhotoProcessAsset, PhotoProcessPair, ResolvedPhotoProcess } from "@/types/photo-process";

const RATIO_TOLERANCE = 0.01;

export function getAssetRatio(asset: Pick<PhotoProcessAsset, "width" | "height">) {
  return asset.height > 0 ? asset.width / asset.height : 0;
}

export function areProcessRatiosCompatible(a: Pick<PhotoProcessAsset, "width" | "height">, b: Pick<PhotoProcessAsset, "width" | "height">) {
  const ratioA = getAssetRatio(a);
  const ratioB = getAssetRatio(b);
  return ratioA > 0 && ratioB > 0 && Math.abs(ratioA - ratioB) <= RATIO_TOLERANCE;
}

export function getProcessAssetUrl(asset: PhotoProcessAsset, width: number) {
  if (width <= 400) return asset.variants["400"];
  if (width <= 800) return asset.variants["800"];
  if (width <= 1200) return asset.variants["1200"];
  return asset.src;
}

export function getLocalizedProcessAlt(asset: PhotoProcessAsset, locale: Locale) {
  return asset.alt[locale] || asset.alt.es;
}

export function getProcessStageLabel(kind: PhotoProcessAsset["kind"], dictionary: PhotoProcessDictionary) {
  if (kind === "raw-preview") return dictionary.rawOriginal;
  if (kind === "camera-original") return dictionary.captureOriginal;
  if (kind === "unedited-export") return dictionary.unedited;
  if (kind === "technical-correction") return dictionary.technicalCorrection;
  return dictionary.finalResult;
}

export function getProcessInitialPosition(process: Pick<ResolvedPhotoProcess, "initialPosition">) {
  return clampProcessPosition(process.initialPosition ?? PHOTO_PROCESS_DEFAULT_POSITION);
}

export function getProcessPairs(process: ResolvedPhotoProcess): PhotoProcessPair[] {
  if (!process.corrected) return [{ id: "original-final", before: process.original, after: process.final }];
  return [
    { id: "original-corrected", before: process.original, after: process.corrected },
    { id: "corrected-final", before: process.corrected, after: process.final },
  ];
}

export function resolvePhotoProcess(photo: ArchivePhoto): ResolvedPhotoProcess | null {
  const entry = photoProcessEntries.find((candidate) => candidate.photoId === photo.id);
  if (!entry) return null;
  const final: PhotoProcessAsset = {
    src: photo.src,
    variants: {
      "400": photo.variants?.["400"] || photo.src,
      "800": photo.variants?.["800"] || photo.src,
      "1200": photo.variants?.["1200"] || photo.src,
    },
    width: photo.width,
    height: photo.height,
    kind: "final",
    alt: { es: photo.alt || photo.description, en: photo.alt || photo.description },
    blurDataURL: photo.blurDataURL,
  };
  if (!areProcessRatiosCompatible(entry.original, final)) return null;
  if (entry.corrected && (!areProcessRatiosCompatible(entry.original, entry.corrected) || !areProcessRatiosCompatible(entry.corrected, final))) return null;
  return { ...entry, final };
}

export function getEligiblePhotoProcessIds(photos: ArchivePhoto[]) {
  return photos.filter((photo) => resolvePhotoProcess(photo)).map((photo) => photo.id);
}
