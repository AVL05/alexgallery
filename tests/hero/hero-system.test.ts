import assert from "node:assert/strict";
import test from "node:test";
import en from "../../dictionaries/en.json";
import es from "../../dictionaries/es.json";
import imagesDataJson from "../../lib/images-data.json";
import {
  getHeroArchiveFacts,
  getHeroImages,
  getHeroMotionProfile,
  heroImageConfig,
} from "../../lib/hero/config";
import type { ImagesData } from "../../types/photo";

test("hero resolves a local optimized primary image and fallback", () => {
  const { primary, fallback } = getHeroImages(imagesDataJson as ImagesData);

  assert.equal(primary.id, heroImageConfig.primaryId);
  assert.equal(fallback.id, heroImageConfig.fallbackId);
  assert.match(primary.src, /^\/photos\/optimized\/original\/14\.webp$/);
  assert.ok(primary.blurDataURL?.startsWith("data:image/"));
  assert.ok(fallback.blurDataURL?.startsWith("data:image/"));
});

test("hero archive facts are derived from the real catalog", () => {
  assert.deepEqual(getHeroArchiveFacts(), { count: 30, dateRange: "2022–2025" });
});

test("hero motion disables scroll effects for reduced motion and touch", () => {
  assert.equal(
    getHeroMotionProfile({ reducedMotion: true, isTouchDevice: false }).scrollMotionEnabled,
    false,
  );
  assert.equal(
    getHeroMotionProfile({ reducedMotion: false, isTouchDevice: true }).scrollMotionEnabled,
    false,
  );
  assert.equal(
    getHeroMotionProfile({ reducedMotion: false, isTouchDevice: false }).scrollMotionEnabled,
    true,
  );
});

test("hero translations expose equivalent accessible content", () => {
  const keys = [
    "title",
    "titleLineOne",
    "titleLineTwo",
    "eyebrow",
    "description",
    "cta",
    "scroll",
    "photographs",
    "location",
    "imageAlt",
  ] as const;

  for (const key of keys) {
    assert.equal(typeof es.hero[key], "string");
    assert.equal(typeof en.hero[key], "string");
    assert.ok(es.hero[key].length > 0);
    assert.ok(en.hero[key].length > 0);
  }
});
