import assert from "node:assert/strict";
import test from "node:test";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import { getCategoryArchiveHref } from "../../lib/archive/url";
import { categories, photos } from "../../lib/gallery-data";
import {
  getHomeNarrativePhotoIds,
  homeChapterOrder,
  homeCuration,
  type HomeCuration,
} from "../../lib/home/curation";
import {
  getArchiveSummary,
  getHomeNarrativeData,
  getNarrativePhotos,
} from "../../lib/home/selectors";
import { validateHomeCuration } from "../../lib/home/validation";
import imagesDataJson from "../../lib/images-data.json";
import type { ImagesData } from "../../types/photo";

const imagesData = imagesDataJson as ImagesData;

function withCuration(overrides: Partial<HomeCuration>): HomeCuration {
  return { ...homeCuration, ...overrides };
}

test("home curation is valid and every configured ID exists", () => {
  assert.deepEqual(validateHomeCuration(homeCuration, imagesData), []);
  const catalogIds = new Set(photos.map((photo) => photo.id));
  const imageIds = new Set(imagesData.images.map((image) => Number(image.id)));
  assert.ok(imageIds.has(homeCuration.heroPhotoId));
  assert.ok(
    [
      homeCuration.featuredPhotoId,
      homeCuration.expansivePhotoId,
      ...Object.values(homeCuration.chapterPhotoIds),
      ...homeCuration.selectedPhotoIds,
    ].every((id) => catalogIds.has(id)),
  );
});

test("hero, story, expansive image, chapters and Selected Work are exclusive", () => {
  const narrativeIds = getHomeNarrativePhotoIds();
  const allCuratedIds = [
    homeCuration.heroPhotoId,
    ...narrativeIds,
  ];
  assert.equal(new Set(allCuratedIds).size, allCuratedIds.length);
  assert.ok(!narrativeIds.includes(homeCuration.heroPhotoId));
  assert.equal(homeCuration.selectedPhotoIds.length, 4);
});

test("chapters cover every category once and use matching photographs", () => {
  const data = getHomeNarrativeData(imagesData);
  const chapterIds = data.chapters.map((chapter) => chapter.photo.id);
  assert.deepEqual(data.chapters.map((chapter) => chapter.category), homeChapterOrder);
  assert.equal(new Set(chapterIds).size, chapterIds.length);
  assert.ok(data.chapters.every((chapter) => chapter.photo.category === chapter.category));
  assert.equal(data.chapters.reduce((total, chapter) => total + chapter.count, 0), photos.length);
});

test("Selected Work has stable order and no earlier narrative photograph", () => {
  const data = getHomeNarrativeData(imagesData);
  const reserved = new Set([
    data.featured.id,
    data.expansive.id,
    ...data.chapters.map((chapter) => chapter.photo.id),
  ]);
  assert.deepEqual(data.selected.map((photo) => photo.id), homeCuration.selectedPhotoIds);
  assert.equal(new Set(data.selected.map((photo) => photo.id)).size, data.selected.length);
  assert.ok(data.selected.every((photo) => !reserved.has(photo.id)));
});

test("all categories are represented without architecture dominating", () => {
  const data = getHomeNarrativeData(imagesData);
  const selectedPhotos = [
    data.featured,
    data.expansive,
    ...data.chapters.map((chapter) => chapter.photo),
    ...data.selected,
  ];
  const counts = Object.fromEntries(
    homeChapterOrder.map((category) => [
      category,
      selectedPhotos.filter((photo) => photo.category === category).length,
    ]),
  );
  assert.deepEqual(counts, {
    Fauna: 2,
    Arquitectura: 2,
    Paisaje: 3,
    Personas: 2,
    Meteorología: 2,
  });
});

test("Spanish and English narrative content, categories and alt text are localized", () => {
  const spanish = getHomeNarrativeData(imagesData, "es");
  const english = getHomeNarrativeData(imagesData, "en");
  assert.equal(spanish.featured.title, "El acordeón y el abismo");
  assert.equal(english.featured.title, "The accordion and the abyss");
  assert.equal(spanish.expansive.title, "El ruido del cielo");
  assert.equal(english.expansive.title, "The sound of the sky");
  assert.notEqual(spanish.featured.alt, english.featured.alt);
  assert.notEqual(spanish.selected[0]?.title, english.selected[0]?.title);
  assert.equal(es.gallery.categories.Personas, "Personas");
  assert.equal(en.gallery.categories.Personas, "People");
});

test("Personas is the canonical category while the public retrato slug remains stable", () => {
  assert.ok(categories.includes("Personas"));
  assert.ok(!Object.keys(es.gallery.categories).includes("Retrato"));
  assert.ok(photos.filter((photo) => photo.category === "Personas").length > 0);
  assert.equal(
    getCategoryArchiveHref("es", "Personas"),
    "/es?category=retrato#gallery",
  );
});

test("missing optimized narrative data falls back to catalog data", () => {
  const partialImagesData: ImagesData = {
    images: imagesData.images.filter((image) => image.id !== "1"),
  };
  const data = getHomeNarrativeData(partialImagesData, "en");
  const photo = data.selected.find((candidate) => candidate.id === 1);
  assert.equal(photo?.src, "/1.webp");
  assert.equal(photo?.alt, "Three horses standing together in the mist.");
});

test("validation reports missing IDs, conflicts, wrong categories and invalid counts", () => {
  const invalid = withCuration({
    featuredPhotoId: 999,
    expansivePhotoId: homeCuration.heroPhotoId,
    chapterPhotoIds: {
      ...homeCuration.chapterPhotoIds,
      Fauna: 48,
    },
    selectedPhotoIds: [21, 21],
  });
  const message = validateHomeCuration(invalid, imagesData).join("\n");
  assert.match(message, /featuredStory usa photo-999/);
  assert.match(message, /photo-14 aparece en:/);
  assert.match(message, /photo-21 está duplicada dentro de selectedWork/);
  assert.match(message, /chapters\.Fauna usa photo-48, cuya categoría es Arquitectura/);
  assert.match(message, /Selected Work debe contener al menos tres fotografías/);

  const tooMany = withCuration({ selectedPhotoIds: [4, 12, 13, 16, 19, 23, 24] });
  assert.match(
    validateHomeCuration(tooMany, imagesData).join("\n"),
    /Selected Work no puede contener más de 4 fotografías/,
  );
});

test("archive summary remains derived from all 30 catalog photographs", () => {
  const archive = getArchiveSummary();
  assert.equal(archive.total, 30);
  assert.equal(archive.startYear, "2022");
  assert.equal(archive.endYear, "2025");
  assert.deepEqual(archive.years.map(({ year }) => year), ["2022", "2023", "2024", "2025"]);
  assert.equal(archive.categories.reduce((total, item) => total + item.count, 0), archive.total);
});

test("home narrative interface copy exists in Spanish and English", () => {
  for (const dictionary of [es.home, en.home]) {
    assert.ok(dictionary.manifesto.title.length > 0);
    assert.ok(dictionary.featured.cta.length > 0);
    assert.ok(dictionary.expansive.cta.length > 0);
    assert.ok(dictionary.chapters.title.length > 0);
    assert.ok(dictionary.selected.title.length > 0);
    assert.ok(dictionary.archive.cta.length > 0);
    assert.ok(dictionary.closing.title.length > 0);
    assert.deepEqual(Object.keys(dictionary.chapters.descriptions), homeChapterOrder);
  }
});

test("localized photos are derived from the shared catalog rather than duplicate objects", () => {
  const english = getNarrativePhotos(imagesData, "en");
  assert.deepEqual(english.map((photo) => photo.id), photos.map((photo) => photo.id));
  assert.equal(new Set(english.map((photo) => photo.id)).size, photos.length);
});
