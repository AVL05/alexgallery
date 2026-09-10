import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getHeroFrameLayout, heroFramesConfig } from "../../lib/graphics/hero-frames";

const read = (path: string) => readFileSync(path, "utf8");

test("hero frames composition is deterministic and breakpoint-aware", () => {
  const desktop = getHeroFrameLayout(1440);
  const mobile = getHeroFrameLayout(390);
  assert.deepEqual(getHeroFrameLayout(1440), desktop);
  assert.equal(desktop.length, 4);
  assert.equal(mobile.length, 2);
  assert.ok(mobile.every((frame) => desktop.some((other) => other.photo.id === frame.photo.id)));
  for (const frame of [...desktop, ...mobile]) {
    assert.ok(Math.abs(frame.rotation[0]) <= 0.05);
    assert.ok(Math.abs(frame.rotation[1]) <= 0.25);
    assert.equal(frame.rotation[2], 0);
    assert.ok(frame.scale > 0 && frame.scale <= 1);
    assert.ok(frame.photo.src.includes("/photos/optimized/800/"));
  }
});

test("hero frames avoid the hero image and selected work", () => {
  const ids = getHeroFrameLayout(1440).map((frame) => frame.photo.id);
  assert.ok(!ids.includes("52"));
  for (const selected of ["1", "35", "37", "49"]) {
    assert.ok(!ids.includes(selected));
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(heroFramesConfig.maxPixelRatio <= 2);
  assert.ok(heroFramesConfig.drift.positionAmplitude <= 0.05);
  assert.ok(heroFramesConfig.drift.rotationAmplitude <= 0.03);
});

test("hero scene reuses the frame factory without new libraries", () => {
  const scene = read("components/graphics/hero-frames-scene.tsx");
  assert.match(scene, /loadPhotoFrameAsset/);
  assert.match(scene, /createPhotoFrameInstance/);
  assert.match(scene, /loadPhotoTexture/);
  assert.match(scene, /prefersReducedMotion/);
  assert.match(scene, /IntersectionObserver/);
  assert.match(scene, /visibilitychange/);
  assert.doesNotMatch(scene, /@react-three\/fiber/);
  assert.doesNotMatch(scene, /InstancedMesh|Points|ShaderMaterial|EffectComposer/);
  const slot = read("components/hero/hero-webgl-slot.tsx");
  assert.match(slot, /<HeroFramesScene/);
  assert.match(slot, /aria-hidden="true"/);
  assert.match(slot, /pointer-events-none/);
  const section = read("components/hero/hero-section.tsx");
  assert.match(section, /<HeroWebglSlot entryReady/);
  assert.doesNotMatch(section, /HeroGraphicsBootstrap/);
});
