import assert from "node:assert/strict";
import test from "node:test";
import { buildArchivePhotos } from "../../lib/archive/selectors";
import { photoProcessCuration, photoProcessEntries } from "../../lib/photo-process/config";
import {
  beginProcessPointer,
  clampProcessPosition,
  finishProcessPointer,
  getPointerIntent,
  getPositionFromPointer,
  getProcessPositionForKey,
  moveProcessPointer,
} from "../../lib/photo-process/interaction";
import {
  areProcessRatiosCompatible,
  getEligiblePhotoProcessIds,
  getProcessInitialPosition,
  getProcessPairs,
  getProcessStageLabel,
  resolvePhotoProcess,
} from "../../lib/photo-process/selectors";
import { validatePhotoProcessEntries } from "../../lib/photo-process/validation";
import imagesDataJson from "../../lib/images-data.json";
import enDictionary from "../../dictionaries/en.json";
import esDictionary from "../../dictionaries/es.json";
import type { ImagesData } from "../../types/photo";
import type { PhotoProcessAsset, PhotoProcessConfig, ResolvedPhotoProcess } from "../../types/photo-process";

const imagesData = imagesDataJson as ImagesData;

function asset(name: string, kind: PhotoProcessAsset["kind"] = "camera-original", width = 1200, height = 800): PhotoProcessAsset {
  return {
    src: `/photos/process/1/${name}.webp`,
    variants: {
      "400": `/photos/process/1/${name}-400.webp`,
      "800": `/photos/process/1/${name}-800.webp`,
      "1200": `/photos/process/1/${name}-1200.webp`,
    },
    width,
    height,
    kind,
    alt: { es: `Etapa ${name}`, en: `${name} stage` },
  };
}

const final = asset("final", "final");
const finalAssets = new Map([[1, final]]);

test("production remains honest when no authentic process resources exist", () => {
  const photos = buildArchivePhotos(imagesData, "es");
  assert.equal(photoProcessEntries.length, 0);
  assert.equal(photoProcessCuration.featuredPhotoId, null);
  assert.deepEqual(getEligiblePhotoProcessIds(photos), []);
  assert.ok(photos.every((photo) => resolvePhotoProcess(photo) === null));
});

test("two-stage and three-stage models resolve deterministic comparison pairs", () => {
  const two: ResolvedPhotoProcess = { photoId: 1, original: asset("original"), final, initialPosition: 63 };
  const three: ResolvedPhotoProcess = { ...two, corrected: asset("corrected", "technical-correction") };
  assert.deepEqual(getProcessPairs(two).map((pair) => pair.id), ["original-final"]);
  assert.deepEqual(getProcessPairs(three).map((pair) => pair.id), ["original-corrected", "corrected-final"]);
  assert.equal(getProcessInitialPosition(two), 63);
  assert.equal(getProcessInitialPosition({ initialPosition: 140 }), 100);
});

test("valid process configuration accepts real-shaped localized web assets", () => {
  const entry: PhotoProcessConfig = {
    photoId: 1,
    original: asset("original"),
    corrected: asset("corrected", "technical-correction"),
    notes: { es: "Nota confirmada", en: "Confirmed note" },
    steps: [{ id: "correction", stage: "corrected", order: 1, title: { es: "Corrección", en: "Correction" }, description: { es: "Descripción", en: "Description" } }],
  };
  const issues = validatePhotoProcessEntries([entry], { photoIds: [1], finalAssets, resourceExists: () => true });
  assert.deepEqual(issues, []);
});

test("validation reports missing, duplicated, incompatible and undocumented stages", () => {
  const brokenOriginal = asset("final", "camera-original", 0, 800);
  brokenOriginal.src = final.src;
  brokenOriginal.variants["400"] = "/outside/original.jpg";
  brokenOriginal.alt.en = "";
  const entry: PhotoProcessConfig = {
    photoId: 1,
    original: brokenOriginal,
    corrected: brokenOriginal,
    notes: { es: "Solo español", en: "" },
    steps: [
      { id: "same", stage: "corrected", order: 1, title: { es: "Paso", en: "Step" }, description: { es: "Texto", en: "Text" } },
      { id: "same", stage: "original", order: 2, title: { es: "", en: "Step" }, description: { es: "Texto", en: "Text" } },
    ],
  };
  const issues = validatePhotoProcessEntries([entry, entry, { ...entry, photoId: 999 }], { photoIds: [1], finalAssets, resourceExists: () => false });
  const codes = new Set(issues.map((issue) => issue.code));
  for (const code of ["duplicate-photo", "unknown-photo", "missing-resource", "invalid-path", "unsupported-format", "invalid-dimensions", "duplicate-stage", "same-as-final", "incompatible-ratio", "incomplete-translation", "duplicate-step"] as const) assert.ok(codes.has(code), code);
});

test("ratio validation distinguishes aligned and incompatible assets", () => {
  assert.equal(areProcessRatiosCompatible(asset("a", "camera-original", 1500, 1000), asset("b", "final", 1200, 800)), true);
  assert.equal(areProcessRatiosCompatible(asset("a", "camera-original", 1000, 1500), asset("b", "final", 1200, 800)), false);
});

test("range helpers clamp, reset and support arrows, Home, End and page keys", () => {
  assert.equal(clampProcessPosition(-2), 0);
  assert.equal(clampProcessPosition(101), 100);
  assert.equal(getProcessPositionForKey("ArrowLeft", 50), 48);
  assert.equal(getProcessPositionForKey("ArrowRight", 50), 52);
  assert.equal(getProcessPositionForKey("Home", 50), 0);
  assert.equal(getProcessPositionForKey("End", 50), 100);
  assert.equal(getProcessPositionForKey("PageDown", 50), 40);
  assert.equal(getProcessPositionForKey("PageUp", 50), 60);
  assert.equal(getProcessPositionForKey("Escape", 50), null);
});

test("pointer lifecycle preserves vertical scroll and cleans up up/cancel state", () => {
  const started = beginProcessPointer(7, 100, 100);
  assert.equal(moveProcessPointer(started, 7, 104, 130)?.intent, "vertical");
  assert.equal(moveProcessPointer(started, 7, 140, 104)?.intent, "horizontal");
  assert.equal(getPointerIntent(2, 2), "pending");
  assert.equal(getPositionFromPointer(175, 100, 300), 25);
  assert.equal(finishProcessPointer(started, 7), null);
  assert.equal(finishProcessPointer(started, 9), started);
});

test("stage terminology and process interface are complete in both languages", () => {
  assert.equal(getProcessStageLabel("camera-original", esDictionary.photoProcess), "Captura original");
  assert.equal(getProcessStageLabel("raw-preview", enDictionary.photoProcess), "Original RAW");
  assert.equal(getProcessStageLabel("technical-correction", esDictionary.photoProcess), "Corrección técnica");
  assert.equal(getProcessStageLabel("final", enDictionary.photoProcess), "Final result");
  assert.deepEqual(Object.keys(enDictionary.photoProcess).sort(), Object.keys(esDictionary.photoProcess).sort());
});
