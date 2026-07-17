import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { photoProcessEntries } from "../lib/photo-process/config";
import { validatePhotoProcessEntries } from "../lib/photo-process/validation";
import { photos } from "../lib/gallery-data";
import imagesDataJson from "../lib/images-data.json";
import type { ImagesData } from "../types/photo";
import type { PhotoProcessAsset } from "../types/photo-process";

const imagesData = imagesDataJson as ImagesData;
const publicRoot = path.resolve(process.cwd(), "public");
const imageById = new Map(imagesData.images.map((image) => [Number(image.id), image]));
const finalAssets = new Map<number, PhotoProcessAsset>();

for (const photo of photos) {
  const image = imageById.get(photo.id);
  if (!image) continue;
  finalAssets.set(photo.id, {
    src: image.src,
    variants: {
      "400": image.variants?.["400"] || image.src,
      "800": image.variants?.["800"] || image.src,
      "1200": image.variants?.["1200"] || image.src,
    },
    width: image.width,
    height: image.height,
    kind: "final",
    alt: { es: photo.description, en: photo.description },
  });
}

function toPublicFile(assetPath: string) {
  return path.resolve(publicRoot, assetPath.replace(/^\//, ""));
}

function resourceExists(assetPath: string) {
  const resolved = toPublicFile(assetPath);
  return resolved.startsWith(`${publicRoot}${path.sep}`) && fs.existsSync(resolved);
}

async function validateDeclaredDimensions(asset: PhotoProcessAsset, photoId: number) {
  const metadata = await sharp(toPublicFile(asset.src)).metadata();
  if (metadata.width !== asset.width || metadata.height !== asset.height) {
    throw new Error(`Photo ${photoId} declares ${asset.width}x${asset.height}, but ${asset.src} is ${metadata.width}x${metadata.height}.`);
  }
}

async function main() {
  const issues = validatePhotoProcessEntries(photoProcessEntries, {
    photoIds: photos.map((photo) => photo.id),
    finalAssets,
    resourceExists,
  });

  if (issues.length) {
    for (const issue of issues) console.error(`[${issue.code}] ${issue.message}`);
    process.exitCode = 1;
    return;
  }
  for (const entry of photoProcessEntries) {
    await validateDeclaredDimensions(entry.original, entry.photoId);
    if (entry.corrected) await validateDeclaredDimensions(entry.corrected, entry.photoId);
  }
  console.log(`Photo process validation: ${photoProcessEntries.length} configured, ${photoProcessEntries.length} eligible.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
