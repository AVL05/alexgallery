import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import { homeCuration } from "../../lib/home/curation";
import {
  getHomeSectionPosition,
  homeExperienceConfig,
  orderHomeSeries,
  validateHomeExperience,
} from "../../lib/home/experience";
import { getPublishedSeries, getUnassignedPhotoIds } from "../../lib/series/selectors";

test("home experience keeps the required editorial order without redundant sections", () => {
  assert.deepEqual(validateHomeExperience(homeCuration), []);
  assert.deepEqual(homeExperienceConfig.sectionOrder, [
    "hero",
    "manifesto",
    "featuredStory",
    "series",
    "expansivePhoto",
    "selectedWork",
    "archive",
    "contact",
  ]);
  assert.equal(new Set(homeExperienceConfig.sectionOrder).size, homeExperienceConfig.sectionOrder.length);
  assert.ok(!homeExperienceConfig.sectionOrder.includes("visualChapters"));
  assert.ok(!homeExperienceConfig.sectionOrder.includes("closing"));
  assert.deepEqual(getHomeSectionPosition("series"), { current: 4, total: 8 });
});

test("Selected Work is limited to four photographs outside published series", () => {
  assert.equal(homeExperienceConfig.selectedWorkLimit, 4);
  assert.equal(homeCuration.selectedPhotoIds.length, 4);
  assert.deepEqual(getUnassignedPhotoIds(homeCuration.selectedPhotoIds), homeCuration.selectedPhotoIds);
});

test("all three public series remain visible with the configured lead series first", () => {
  const ordered = orderHomeSeries(getPublishedSeries());
  assert.equal(ordered.length, 3);
  assert.equal(ordered[0]?.id, homeExperienceConfig.featuredSeriesId);
  assert.deepEqual(new Set(ordered.map((series) => series.id)), new Set(getPublishedSeries().map((series) => series.id)));
});

test("Spanish and English calls to action describe their destination", () => {
  assert.equal(es.hero.cta, "Explorar el archivo");
  assert.equal(en.hero.cta, "Explore the archive");
  assert.equal(es.home.series.cta, "Ver todas las series");
  assert.equal(en.home.series.cta, "View all series");
  assert.equal(es.home.expansive.cta, "Abrir fotografía");
  assert.equal(en.home.expansive.cta, "Open photograph");
});

test("primary home anchors and public destinations remain available", () => {
  const homeClient = readFileSync("app/[locale]/home-client.tsx", "utf8");
  const navigation = readFileSync("components/navigation.tsx", "utf8");
  const footer = readFileSync("components/footer.tsx", "utf8");
  const series = readFileSync("components/home/home-series.tsx", "utf8");

  for (const anchor of ["#about", "#gallery", "#contact"]) {
    assert.match(`${homeClient}\n${navigation}\n${footer}`, new RegExp(anchor));
  }
  assert.match(series, /\`\/\$\{locale\}\/series\`/);
  assert.doesNotMatch(homeClient, /ClosingStatement/);
  assert.doesNotMatch(navigation.match(/const items = \[[\s\S]*?\];/)?.[0] ?? "", /dictionary\.policies/);
  assert.match(footer, /dictionary\.policies/);
  assert.match(footer, /dictionary\.privacy/);
});

test("route prefetch stays predictive instead of expanding across every card", () => {
  assert.equal(homeExperienceConfig.prefetch.featuredSeries, true);
  assert.equal(homeExperienceConfig.prefetch.secondarySeries, false);
  assert.equal(homeExperienceConfig.prefetch.selectedWork, false);
  assert.equal(homeExperienceConfig.prefetch.archiveItems, false);

  const archiveItem = readFileSync("components/archive/archive-item.tsx", "utf8");
  const selectedWork = readFileSync("components/home/selected-work.tsx", "utf8");
  const seriesPage = readFileSync("components/series/series-page.tsx", "utf8");
  assert.match(archiveItem, /prefetch=\{homeExperienceConfig\.prefetch\.archiveItems\}/);
  assert.match(selectedWork, /prefetch=\{homeExperienceConfig\.prefetch\.selectedWork\}/);
  assert.match(seriesPage, /prefetch=\{false\}/);
});
