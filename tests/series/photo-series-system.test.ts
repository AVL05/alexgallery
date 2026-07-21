import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sitemap from "@/app/sitemap";
import imagesDataJson from "@/lib/images-data.json";
import { buildArchivePhotos } from "@/lib/archive/selectors";
import { defaultArchiveState } from "@/lib/archive/types";
import { photos } from "@/lib/gallery-data";
import { getHomeNarrativePhotoIds, homeCuration } from "@/lib/home/curation";
import { resolvePhotoNavigation, selectRelatedPhotos } from "@/lib/photo-detail/selectors";
import { photoSeries } from "@/lib/series/config";
import {
  getLocalizedSeries,
  getNextSeries,
  getPublishedSeries,
  getSeriesById,
  getSeriesBySlug,
  getSeriesForPhoto,
  getSeriesNavigation,
  getSeriesPosition,
  getUnassignedPhotoIds,
  getValidSeriesContext,
  resolveSeriesCover,
  resolveSeriesPhotos,
} from "@/lib/series/selectors";
import { validatePhotoSeries } from "@/lib/series/validation";
import type { PhotoSeries } from "@/lib/series/types";
import type { ImagesData } from "@/types/photo";

const root = process.cwd();
const read = (path: string) => readFileSync(`${root}/${path}`, "utf8");
const archivePhotos = buildArchivePhotos(imagesDataJson as ImagesData, "es");

test("published series configuration is valid, centralized and intentionally limited", () => {
  assert.deepEqual(validatePhotoSeries(photoSeries, photos), []);
  assert.equal(getPublishedSeries().length, 3);
  assert.ok(photoSeries.every((series) => series.photoIds.length >= 3 && series.photoIds.length <= 8));
  assert.equal(new Set(photoSeries.map((series) => series.id)).size, photoSeries.length);
  assert.equal(new Set(photoSeries.map((series) => series.slug)).size, photoSeries.length);
});

test("series titles, descriptions, covers and explicit block order are complete", () => {
  for (const series of photoSeries) {
    assert.ok(series.title.es && series.title.en && series.description.es && series.description.en);
    assert.ok((series.photoIds as readonly number[]).includes(series.coverPhotoId));
    assert.equal(resolveSeriesCover(series, archivePhotos)?.id, series.coverPhotoId);
    assert.deepEqual(series.blocks.flatMap((block) => block.photoIds), series.photoIds);
  }
});

test("manual diptychs have exactly two photographs and stack from semantic DOM order", () => {
  const diptychs = photoSeries.flatMap((series) => series.blocks.filter((block) => block.layout === "diptych"));
  assert.ok(diptychs.length >= 3);
  assert.ok(diptychs.every((block) => block.photoIds.length === 2));
  assert.match(read("components/series/series-page.tsx"), /md:grid-cols-2/);
});

test("selectors resolve stable IDs, slugs, membership, covers and manual order", () => {
  const series = photoSeries[0];
  assert.equal(getSeriesById(series.id)?.slug, series.slug);
  assert.equal(getSeriesBySlug(series.slug)?.id, series.id);
  assert.equal(getSeriesForPhoto(series.photoIds[0])?.id, series.id);
  assert.equal(getSeriesForPhoto(1), null);
  assert.deepEqual(resolveSeriesPhotos(series, archivePhotos).map((photo) => photo.id), series.photoIds);
});

test("position and previous/next boundaries follow series order without circular navigation", () => {
  const series = photoSeries[0];
  const firstId = series.photoIds[0];
  const middleId = series.photoIds[2];
  const lastId = series.photoIds.at(-1)!;
  assert.deepEqual(getSeriesPosition(series, middleId), { index: 2, current: 3, total: series.photoIds.length });
  assert.equal(getSeriesNavigation(series, firstId, archivePhotos).previous, null);
  assert.equal(getSeriesNavigation(series, lastId, archivePhotos).next, null);
  assert.equal(getSeriesNavigation(series, middleId, archivePhotos).previous?.id, series.photoIds[1]);
  assert.equal(getSeriesNavigation(series, middleId, archivePhotos).next?.id, series.photoIds[3]);
});

test("series context has priority and invalid context falls back to archive or global order", () => {
  const series = photoSeries[0];
  const id = series.photoIds[2];
  const contextual = resolvePhotoNavigation(archivePhotos, id, defaultArchiveState, series.slug);
  assert.equal(contextual.contextType, "series");
  assert.deepEqual(contextual.collection.map((photo) => photo.id), series.photoIds);
  assert.equal(getValidSeriesContext(`?series=${series.slug}`, id)?.id, series.id);
  assert.equal(getValidSeriesContext(`?series=${series.slug}`, 1), null);
  const fallback = resolvePhotoNavigation(archivePhotos, 1, defaultArchiveState, series.slug);
  assert.equal(fallback.contextType, "global");
});

test("related photos reserve at most one series slot and retain external diversity", () => {
  const series = photoSeries[0];
  const currentId = series.photoIds[0];
  const related = selectRelatedPhotos(archivePhotos, currentId, 4);
  const sameSeriesIds = new Set<number>(series.photoIds);
  assert.equal(related.length, 4);
  assert.equal(related.filter((photo) => sameSeriesIds.has(photo.id)).length, 1);
  assert.equal(new Set(related.map((photo) => photo.id)).size, 4);
  assert.ok(related.every((photo) => photo.id !== currentId));
});

test("next series is deterministic and localized", () => {
  assert.equal(getNextSeries(photoSeries[0].id)?.id, photoSeries[1].id);
  assert.equal(getNextSeries(photoSeries[1].id)?.id, photoSeries[2].id);
  assert.notEqual(getLocalizedSeries(photoSeries[0], "es").title, getLocalizedSeries(photoSeries[0], "en").title);
});

test("eighteen catalog photographs remain intentionally unassigned", () => {
  const unassigned = getUnassignedPhotoIds(photos.map((photo) => photo.id));
  assert.equal(unassigned.length, 18);
  assert.ok(unassigned.includes(1));
});

test("validation reports duplicate photos, invalid slugs, missing covers and short series", () => {
  const invalid: PhotoSeries = {
    ...photoSeries[0],
    id: "invalid",
    slug: "Invalid Slug",
    coverPhotoId: 999,
    photoIds: [21, 21],
    blocks: [{ layout: "diptych", photoIds: [21, 21] }],
  };
  const errors = validatePhotoSeries([invalid], photos).join("\n");
  assert.match(errors, /slug inválido/);
  assert.match(errors, /menos de tres/);
  assert.match(errors, /portada 999/i);
  assert.match(errors, /photo-21 dos veces/);
});

test("localized routes, 404 behavior, canonical metadata and development checks exist", () => {
  const route = read("app/[locale]/series/[slug]/page.tsx");
  const index = read("app/[locale]/series/page.tsx");
  const debug = read("components/series/series-debug-panel.tsx");
  assert.match(route, /dynamicParams = false/);
  assert.match(route, /notFound\(\)/);
  assert.match(route, /alternates: \{ canonical/);
  assert.match(route, /BreadcrumbList/);
  assert.match(index, /CollectionPage/);
  assert.match(debug, /8-slot layout/);
  assert.match(debug, /invalid slug \/ 404/);
});

test("sitemap includes localized public indexes and all published series without query state", () => {
  const entries = sitemap();
  const seriesEntries = entries.filter((entry) => entry.url.includes("/series"));
  assert.equal(seriesEntries.length, 8);
  assert.ok(seriesEntries.every((entry) => !entry.url.includes("?")));
  for (const series of photoSeries) {
    assert.ok(entries.some((entry) => entry.url.endsWith(`/es/series/${series.slug}`)));
    assert.ok(entries.some((entry) => entry.url.endsWith(`/en/series/${series.slug}`)));
  }
});

test("home, archive and detail integrations remain compact and progressive", () => {
  const homeIds = new Set([homeCuration.heroPhotoId, ...getHomeNarrativePhotoIds(), ...photoSeries.map((series) => series.coverPhotoId)]);
  assert.equal(homeIds.size, 15);
  assert.ok(photoSeries.every((series) => Number(series.coverPhotoId) !== Number(homeCuration.heroPhotoId)));
  assert.match(read("components/home/home-narrative.tsx"), /<HomeSeries/);
  assert.match(read("components/archive/archive-item.tsx"), /seriesLabel/);
  assert.match(read("components/photo-detail/photo-detail-page.tsx"), /<PhotoDetailSeries/);
  assert.match(read("components/series/series-progress.tsx"), /IntersectionObserver/);
  assert.doesNotMatch(read("components/series/series-page.tsx"), /ScrollTrigger|scrub|pin:/);
});
