import assert from "node:assert/strict";
import test from "node:test";
import imagesDataJson from "@/lib/images-data.json";
import { categories } from "@/lib/gallery-data";
import {
  buildArchivePhotos,
  getArchiveCategoryCounts,
  getArchiveItemVariant,
  getArchiveYearCounts,
  getVisibleArchiveCount,
  normalizeArchiveText,
  selectArchivePhotos,
} from "@/lib/archive/selectors";
import { defaultArchiveState } from "@/lib/archive/types";
import {
  getCategoryArchiveHref,
  parseArchiveSearch,
  serializeArchiveState,
} from "@/lib/archive/url";
import type { ImagesData } from "@/types/photo";

const photos = buildArchivePhotos(imagesDataJson as ImagesData);
const years = [...new Set(photos.map((photo) => photo.year))];

test("archive resolves the complete real catalog with unique optimized images", () => {
  assert.equal(photos.length, 30);
  assert.equal(new Set(photos.map((photo) => photo.id)).size, photos.length);
  assert.ok(photos.every((photo) => photo.width > 0 && photo.height > 0));
  assert.deepEqual(new Set(photos.map((photo) => photo.category)), new Set(categories.slice(1)));
});

test("archive URL parsing validates values and serialization removes defaults", () => {
  const state = parseArchiveSearch(
    "?category=fauna&year=2025&q=niebla&sort=newest&page=2&motion-debug=1",
    categories,
    years,
  );
  assert.deepEqual(state, {
    category: "Fauna",
    year: "2025",
    query: "niebla",
    sort: "newest",
    page: 2,
  });
  assert.equal(
    serializeArchiveState(state, "?motion-debug=1"),
    "?motion-debug=1&category=fauna&year=2025&q=niebla&sort=newest&page=2",
  );
  assert.equal(serializeArchiveState(defaultArchiveState), "");

  const invalid = parseArchiveSearch(
    "?category=unknown&year=2099&sort=popular&page=-5",
    categories,
    years,
  );
  assert.deepEqual(invalid, defaultArchiveState);
});

test("category links remain localized and shareable without JavaScript", () => {
  assert.equal(getCategoryArchiveHref("es", "Meteorología"), "/es?category=meteorologia#gallery");
  assert.equal(getCategoryArchiveHref("en", "Retrato"), "/en?category=retrato#gallery");
});

test("search is accent and case insensitive across real searchable fields", () => {
  assert.equal(normalizeArchiveText("Meteorología"), "meteorologia");
  const byTitle = selectArchivePhotos(photos, {
    ...defaultArchiveState,
    query: "TRIO EN LA NIEBLA",
  });
  assert.deepEqual(byTitle.map((photo) => photo.id), [1]);

  const byCategory = selectArchivePhotos(photos, {
    ...defaultArchiveState,
    query: "meteorologia",
  });
  assert.equal(byCategory.length, 2);
});

test("filters combine and sorting preserves deterministic editorial fallbacks", () => {
  const filtered = selectArchivePhotos(photos, {
    ...defaultArchiveState,
    category: "Arquitectura",
    year: "2024",
    sort: "title-asc",
  });
  assert.equal(filtered.length, 8);
  assert.deepEqual(
    filtered.map((photo) => photo.title),
    [...filtered.map((photo) => photo.title)].sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" }),
    ),
  );

  const newest = selectArchivePhotos(photos, {
    ...defaultArchiveState,
    sort: "newest",
  });
  assert.equal(newest[0]?.year, "2025");
  assert.equal(newest.at(-1)?.year, "2022");
});

test("facet counts are conditioned by the other active filters", () => {
  const state = { ...defaultArchiveState, year: "2024" };
  const categoryCounts = getArchiveCategoryCounts(photos, state, categories);
  assert.equal(categoryCounts.Todo, 11);
  assert.equal(categoryCounts.Arquitectura, 8);

  const yearCounts = getArchiveYearCounts(
    photos,
    { ...defaultArchiveState, category: "Fauna" },
    years,
  );
  assert.equal(yearCounts["2023"], 1);
  assert.equal(yearCounts["2025"], 5);
});

test("progressive loading and editorial variants are bounded and stable", () => {
  assert.equal(getVisibleArchiveCount(1, 30), 12);
  assert.equal(getVisibleArchiveCount(2, 30), 20);
  assert.equal(getVisibleArchiveCount(4, 30), 30);
  assert.equal(getVisibleArchiveCount(1, 3), 3);

  const firstPass = photos.slice(0, 12).map(getArchiveItemVariant);
  const secondPass = photos.slice(0, 12).map(getArchiveItemVariant);
  assert.deepEqual(firstPass, secondPass);
  assert.equal(firstPass[0], "featured");
});
