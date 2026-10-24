import assert from "node:assert/strict";
import test from "node:test";
import imagesDataJson from "@/lib/images-data.json";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { defaultArchiveState } from "@/lib/archive/types";
import { parseArchiveSearch } from "@/lib/archive/url";
import { categories } from "@/lib/gallery-data";
import { getLocalizedPhotos, translatedPhotoIds } from "@/lib/photo-detail/content";
import { getCleanShareUrl, shouldIgnorePhotoArrowKey } from "@/lib/photo-detail/interaction";
import { getPhotoDetailHref, getPhotoOrientation, resolvePhotoNavigation, selectRelatedPhotos } from "@/lib/photo-detail/selectors";
import { buildPhotoStructuredData, getCleanPhotoPath } from "@/lib/photo-detail/seo";
import type { ImagesData } from "@/types/photo";

const imagesData = imagesDataJson as ImagesData;
const esPhotos = buildArchivePhotos(imagesData, "es");
const enPhotos = buildArchivePhotos(imagesData, "en");
const years = [...new Set(esPhotos.map((photo) => photo.year))];

test("all 45 photographs have stable localized English content and fallback-ready Spanish content", () => {
  assert.equal(translatedPhotoIds.length, 45);
  assert.equal(new Set(translatedPhotoIds).size, 45);
  assert.equal(getLocalizedPhotos("en").length, 45);
  assert.ok(enPhotos.every((photo, index) => photo.title !== esPhotos[index]?.title && photo.description && photo.alt));
});

test("Spanish alt text describes the scene independently of the editorial note", () => {
  for (const photo of esPhotos) {
    assert.ok(photo.alt);
    assert.ok(photo.alt.length > 10 && photo.alt.length < 180, `photo ${photo.id}`);
    assert.notEqual(photo.alt, photo.description, `photo ${photo.id}`);
  }
});

test("the selected storm photograph has bilingual content and real image metadata", () => {
  const spanish = esPhotos.find((photo) => photo.id === 66)!;
  const english = enPhotos.find((photo) => photo.id === 66)!;
  assert.equal(spanish.title, "La grieta del cielo");
  assert.equal(english.title, "A crack in the sky");
  assert.equal(spanish.category, "Meteorología");
  assert.equal(spanish.year, "2026");
  assert.equal(spanish.src, "/photos/optimized/original/66.webp");
  assert.equal(spanish.width, 3840);
  assert.equal(spanish.height, 2160);
  assert.deepEqual(spanish.exif, {});
  assert.ok(spanish.alt);
  assert.ok(english.alt);
  assert.match(spanish.alt, /rayo ramificado/);
  assert.match(english.alt, /branching lightning bolt/);
  assert.equal(buildPhotoStructuredData(english, "en").name, english.title);
});

test("context navigation reconstructs combined filters without becoming circular", () => {
  const state = { ...defaultArchiveState, category: "Urbano" as const, year: "2024", sort: "title-asc" as const };
  const contextual = resolvePhotoNavigation(esPhotos, 21, state);
  assert.equal(contextual.collection.length, 5);
  assert.equal(contextual.isContextual, true);
  assert.equal(contextual.collection[contextual.index]?.id, 21);
  const first = resolvePhotoNavigation(esPhotos, contextual.collection[0]!.id, state);
  const last = resolvePhotoNavigation(esPhotos, contextual.collection.at(-1)!.id, state);
  assert.equal(first.previous, null);
  assert.equal(last.next, null);
});

test("a photograph outside the reconstructed set falls back to the global editorial order", () => {
  const navigation = resolvePhotoNavigation(esPhotos, 1, { ...defaultArchiveState, category: "Arquitectura" });
  assert.equal(navigation.isContextual, false);
  assert.equal(navigation.collection.length, 45);
  assert.equal(navigation.previous, null);
  assert.equal(navigation.next?.id, 3);
});

test("invalid parameters normalize through the Phase 6 parser", () => {
  assert.deepEqual(parseArchiveSearch("?category=nope&year=2099&sort=random&page=-2", categories, years), defaultArchiveState);
  assert.equal(getPhotoDetailHref("en", 21, { ...defaultArchiveState, sort: "newest", page: 2 }), "/en/photo/21?sort=newest&page=2");
});

test("related photographs are deterministic, unique and exclude the current work", () => {
  const one = selectRelatedPhotos(esPhotos, 21, 4);
  const two = selectRelatedPhotos(esPhotos, 21, 4);
  assert.deepEqual(one.map((photo) => photo.id), two.map((photo) => photo.id));
  assert.equal(one.length, 4);
  assert.equal(new Set(one.map((photo) => photo.id)).size, 4);
  assert.ok(one.every((photo) => photo.id !== 21));
});

test("orientation, clean share URLs and keyboard guards are explicit", () => {
  assert.equal(getPhotoOrientation(esPhotos.find((photo) => photo.id === 3)!), "horizontal");
  assert.equal(getPhotoOrientation(esPhotos.find((photo) => photo.id === 13)!), "vertical");
  assert.equal(getPhotoOrientation(esPhotos.find((photo) => photo.id === 11)!), "square");
  assert.equal(getCleanShareUrl("https://rawvives.aleviclop.dev", "/es/photo/21"), "https://rawvives.aleviclop.dev/es/photo/21");
  assert.equal(shouldIgnorePhotoArrowKey({ tagName: "INPUT" }), true);
  assert.equal(shouldIgnorePhotoArrowKey({ tagName: "DIV" }), false);
  assert.equal(shouldIgnorePhotoArrowKey({ overlayOpen: true }), true);
});

test("SEO uses a clean localized canonical and real structured image data", () => {
  const photo = enPhotos.find((entry) => entry.id === 21)!;
  assert.equal(getCleanPhotoPath("en", 21), "/en/photo/21");
  const schema = buildPhotoStructuredData(photo, "en");
  assert.equal(schema["@type"], "ImageObject");
  assert.equal(schema.name, photo.title);
  assert.equal(schema.width, photo.width);
  assert.ok(!schema.url.includes("?"));
  assert.ok(schema.contentUrl.endsWith("/photos/optimized/original/21.webp"));
});
