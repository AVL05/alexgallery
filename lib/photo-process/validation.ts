import { areProcessRatiosCompatible } from "@/lib/photo-process/selectors";
import type { PhotoProcessAsset, PhotoProcessConfig, PhotoProcessStageId } from "@/types/photo-process";

export type PhotoProcessValidationCode =
  | "duplicate-photo"
  | "unknown-photo"
  | "missing-resource"
  | "invalid-path"
  | "unsupported-format"
  | "invalid-dimensions"
  | "duplicate-stage"
  | "same-as-final"
  | "incompatible-ratio"
  | "incomplete-translation"
  | "duplicate-step"
  | "invalid-step-stage";

export type PhotoProcessValidationIssue = {
  code: PhotoProcessValidationCode;
  photoId: number;
  message: string;
};

type ValidationOptions = {
  photoIds: Iterable<number>;
  finalAssets: Map<number, PhotoProcessAsset>;
  resourceExists?: (path: string) => boolean;
};

const supportedFormat = /\.(avif|webp)$/i;
const publicProcessPath = /^\/photos\/process\//;

function hasLocalizedText(value: { es?: string; en?: string } | undefined) {
  return Boolean(value?.es?.trim() && value?.en?.trim());
}

function validateAsset(asset: PhotoProcessAsset, photoId: number, resourceExists?: (path: string) => boolean) {
  const issues: PhotoProcessValidationIssue[] = [];
  const paths = [asset.src, ...Object.values(asset.variants)];
  if (asset.width <= 0 || asset.height <= 0) issues.push({ code: "invalid-dimensions", photoId, message: `Photo ${photoId} has invalid process dimensions.` });
  if (!hasLocalizedText(asset.alt)) issues.push({ code: "incomplete-translation", photoId, message: `Photo ${photoId} has incomplete process alt text.` });
  for (const path of paths) {
    if (!publicProcessPath.test(path)) issues.push({ code: "invalid-path", photoId, message: `Process asset must use /photos/process/: ${path}` });
    if (!supportedFormat.test(path)) issues.push({ code: "unsupported-format", photoId, message: `Unsupported public process format: ${path}` });
    if (resourceExists && !resourceExists(path)) issues.push({ code: "missing-resource", photoId, message: `Missing process asset: ${path}` });
  }
  return issues;
}

export function validatePhotoProcessEntries(entries: PhotoProcessConfig[], options: ValidationOptions) {
  const issues: PhotoProcessValidationIssue[] = [];
  const validPhotoIds = new Set(options.photoIds);
  const seenPhotos = new Set<number>();
  for (const entry of entries) {
    if (seenPhotos.has(entry.photoId)) issues.push({ code: "duplicate-photo", photoId: entry.photoId, message: `Photo ${entry.photoId} is configured more than once.` });
    seenPhotos.add(entry.photoId);
    if (!validPhotoIds.has(entry.photoId)) issues.push({ code: "unknown-photo", photoId: entry.photoId, message: `Photo ${entry.photoId} does not exist in the catalog.` });
    issues.push(...validateAsset(entry.original, entry.photoId, options.resourceExists));
    if (entry.corrected) issues.push(...validateAsset(entry.corrected, entry.photoId, options.resourceExists));
    const final = options.finalAssets.get(entry.photoId);
    if (!final) continue;
    if (entry.original.src === final.src) issues.push({ code: "same-as-final", photoId: entry.photoId, message: `Photo ${entry.photoId} uses the final image as its original.` });
    if (entry.corrected && (entry.corrected.src === entry.original.src || entry.corrected.src === final.src)) issues.push({ code: "duplicate-stage", photoId: entry.photoId, message: `Photo ${entry.photoId} repeats a visual stage.` });
    if (!areProcessRatiosCompatible(entry.original, final) || (entry.corrected && !areProcessRatiosCompatible(entry.original, entry.corrected))) issues.push({ code: "incompatible-ratio", photoId: entry.photoId, message: `Photo ${entry.photoId} has incompatible process ratios.` });
    if (entry.notes && !hasLocalizedText(entry.notes)) issues.push({ code: "incomplete-translation", photoId: entry.photoId, message: `Photo ${entry.photoId} has incomplete process notes.` });
    const stageIds = new Set<PhotoProcessStageId>(["original", "final", ...(entry.corrected ? ["corrected" as const] : [])]);
    const seenSteps = new Set<string>();
    for (const step of entry.steps || []) {
      if (seenSteps.has(step.id)) issues.push({ code: "duplicate-step", photoId: entry.photoId, message: `Photo ${entry.photoId} repeats process step ${step.id}.` });
      seenSteps.add(step.id);
      if (!stageIds.has(step.stage)) issues.push({ code: "invalid-step-stage", photoId: entry.photoId, message: `Step ${step.id} references unavailable stage ${step.stage}.` });
      if (!hasLocalizedText(step.title) || !hasLocalizedText(step.description) || (step.tool && !hasLocalizedText(step.tool))) issues.push({ code: "incomplete-translation", photoId: entry.photoId, message: `Step ${step.id} has incomplete localized content.` });
    }
  }
  return issues;
}
