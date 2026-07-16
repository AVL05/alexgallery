import assert from "node:assert/strict";
import test from "node:test";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import { photos } from "../../lib/gallery-data";
import { homeChapterOrder, homeCuration, type HomeCuration } from "../../lib/home/curation";
import { getArchiveSummary, getHomeNarrativeData } from "../../lib/home/selectors";
import imagesDataJson from "../../lib/images-data.json";
import type { ImagesData } from "../../types/photo";

const imagesData = imagesDataJson as ImagesData;

test("home curation resolves real local photographs without selected duplicates", () => {
  const data = getHomeNarrativeData(imagesData);
  const catalogIds = new Set(photos.map((photo) => photo.id));
  const selectedIds = data.selected.map((photo) => photo.id);

  assert.equal(data.featured.id, homeCuration.featuredPhotoId);
  assert.equal(data.expansive.id, homeCuration.expansivePhotoId);
  assert.equal(data.selected.length, 6);
  assert.equal(new Set(selectedIds).size, selectedIds.length);
  assert.ok(!selectedIds.includes(data.featured.id));
  assert.ok(!selectedIds.includes(data.expansive.id));
  assert.ok([data.featured, data.expansive, ...data.selected].every((photo) => catalogIds.has(photo.id)));
  assert.ok([data.featured, data.expansive, ...data.selected].every((photo) => photo.src.startsWith("/photos/optimized/")));
});

test("home chapters cover each current category and use matching imagery", () => {
  const data = getHomeNarrativeData(imagesData);

  assert.deepEqual(data.chapters.map((chapter) => chapter.category), homeChapterOrder);
  assert.ok(data.chapters.every((chapter) => chapter.photo.category === chapter.category));
  assert.equal(data.chapters.reduce((total, chapter) => total + chapter.count, 0), photos.length);
});

test("home selectors recover from missing curated identifiers", () => {
  const missingCuration: HomeCuration = {
    featuredPhotoId: 9991,
    expansivePhotoId: 9992,
    chapterPhotoIds: {
      Fauna: 9993,
      Arquitectura: 9994,
      Paisaje: 9995,
      Retrato: 9996,
      Meteorología: 9997,
    },
    selectedPhotoIds: [9998, 9999, 10000, 10001, 10002, 10003],
  };

  const data = getHomeNarrativeData(imagesData, missingCuration);
  assert.equal(data.selected.length, 6);
  assert.ok(data.chapters.every((chapter) => chapter.photo.category === chapter.category));
  assert.notEqual(data.featured.id, data.expansive.id);
});

test("archive index is derived from the catalog", () => {
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
