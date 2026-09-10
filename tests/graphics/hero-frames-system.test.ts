import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createScrollTransform,
  getHeroFrameLayout,
  getScrollIntensity,
  heroFramesConfig,
  smoothstep01,
  writeScrollTransform,
} from "../../lib/graphics/hero-frames";

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

test("scroll interpolation is eased, bounded and intensity-aware", () => {
  assert.equal(smoothstep01(0), 0);
  assert.equal(smoothstep01(1), 1);
  assert.ok(smoothstep01(0.5) === 0.5);
  assert.ok(smoothstep01(0.25) < 0.25 && smoothstep01(0.75) > 0.75);
  assert.equal(getScrollIntensity(390), 0.35);
  assert.equal(getScrollIntensity(1024), 0.7);
  assert.equal(getScrollIntensity(1440), 1);

  const [main] = getHeroFrameLayout(1440);
  const atZero = createScrollTransform();
  writeScrollTransform(main, 0, 1, atZero);
  assert.deepEqual(atZero.position, [...main.position]);
  assert.deepEqual(atZero.rotation, [...main.rotation]);
  assert.equal(atZero.scale, main.scale);
  const atFull = createScrollTransform();
  writeScrollTransform(main, 1, 1, atFull);
  assert.ok(atFull.position[2] > main.position[2]);
  assert.ok(atFull.position[2] < 1.6);
  assert.ok(atFull.scale > main.scale && atFull.scale < main.scale * 1.1);
  const atHalf = createScrollTransform();
  writeScrollTransform(main, 0.5, 0.35, atHalf);
  assert.ok(Math.abs(atHalf.position[2] - main.position[2]) < Math.abs(atFull.position[2] - main.position[2]));
  // Same scratch object reused: no per-frame allocation shape change.
  const reuse = createScrollTransform();
  writeScrollTransform(main, 0.2, 1, reuse);
  const snapshot = JSON.stringify(reuse);
  writeScrollTransform(main, 0.9, 1, reuse);
  assert.equal(typeof reuse, "object");
  assert.notEqual(JSON.stringify(reuse), snapshot);
});

test("hero scene reuses the frame factory without new libraries", () => {
  const scene = read("components/graphics/hero-frames-scene.tsx");
  assert.match(scene, /loadPhotoFrameAsset/);
  assert.match(scene, /createPhotoFrameInstance/);
  assert.match(scene, /loadPhotoTexture/);
  assert.match(scene, /prefersReducedMotion/);
  assert.match(scene, /IntersectionObserver/);
  assert.match(scene, /visibilitychange/);
  assert.match(scene, /subscribeHeroScrollProgress/);
  assert.match(scene, /writeScrollTransform/);
  assert.doesNotMatch(scene, /new ScrollTrigger|addEventListener\("scroll"|ScrollTrigger\.create/);
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
