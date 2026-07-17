import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { chooseGraphicsQuality } from "../../lib/graphics/capabilities";
import { graphicsConfig } from "../../lib/graphics/config";
import {
  cancelScheduledContextLoss,
  getActiveGraphicsContextCount,
  registerGraphicsContext,
  scheduleContextLoss,
} from "../../lib/graphics/context-registry";
import { getCoverTransform } from "../../lib/graphics/cover";
import {
  getGraphicsSignalSubscriberCounts,
  publishHeroScrollProgress,
  publishPointerSample,
  subscribeHeroScrollProgress,
  subscribePointerSample,
} from "../../lib/graphics/signals";
import type { GraphicsCapabilities } from "../../types/graphics";

const root = process.cwd();
const source = (path: string) => readFileSync(`${root}/${path}`, "utf8");

function capabilities(overrides: Partial<GraphicsCapabilities> = {}): GraphicsCapabilities {
  return {
    webgl: true,
    webgl2: true,
    webgpu: false,
    contextCreated: true,
    hasFinePointer: true,
    hasHover: true,
    hasCoarsePointer: false,
    hasTouch: false,
    prefersReducedMotion: false,
    saveData: false,
    deviceMemory: 8,
    hardwareConcurrency: 8,
    viewportWidth: 1440,
    viewportHeight: 900,
    devicePixelRatio: 2,
    ...overrides,
  };
}

test("graphics capabilities select full, adaptive and disabled paths", () => {
  assert.equal(chooseGraphicsQuality(capabilities()).quality, "full");
  assert.equal(chooseGraphicsQuality(capabilities({ webgl2: false })).quality, "reduced");
  assert.equal(chooseGraphicsQuality(capabilities({ hasTouch: true })).quality, "reduced");
  assert.deepEqual(
    [
      capabilities({ webgl: false, contextCreated: false }),
      capabilities({ prefersReducedMotion: true }),
      capabilities({ saveData: true }),
      capabilities({ hardwareConcurrency: 2 }),
      capabilities({ hasFinePointer: false, hasHover: false, hasCoarsePointer: true }),
    ].map((value) => chooseGraphicsQuality(value).quality),
    ["disabled", "disabled", "disabled", "disabled", "disabled"],
  );
});

test("cover transform reproduces object-fit cover without invalid arithmetic", () => {
  assert.deepEqual(getCoverTransform(100, 100, 0, 100), { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 });
  const landscape = getCoverTransform(1000, 1000, 1500, 1000);
  assert.ok(Math.abs(landscape.scaleX - 2 / 3) < 0.00001);
  assert.equal(landscape.scaleY, 1);
  assert.ok(Math.abs(landscape.offsetX - 1 / 6) < 0.00001);
  const portrait = getCoverTransform(1500, 1000, 1000, 1500);
  assert.equal(portrait.scaleX, 1);
  assert.ok(Math.abs(portrait.scaleY - 4 / 9) < 0.00001);
});

test("pointer and hero scroll signals reuse publishers and clean subscribers", () => {
  const before = getGraphicsSignalSubscriberCounts();
  let pointer = { x: -1, y: -1, pointerType: "unknown" };
  let scroll = -1;
  const unsubscribePointer = subscribePointerSample((value) => { pointer = value; });
  const unsubscribeScroll = subscribeHeroScrollProgress((value) => { scroll = value; });
  publishPointerSample({ x: 120, y: 240, pointerType: "mouse" });
  publishHeroScrollProgress(2);
  assert.deepEqual(pointer, { x: 120, y: 240, pointerType: "mouse" });
  assert.equal(scroll, 1);
  unsubscribePointer();
  unsubscribeScroll();
  assert.deepEqual(getGraphicsSignalSubscriberCounts(), before);
});

test("context registry is idempotent for Strict Mode cleanup", () => {
  const before = getActiveGraphicsContextCount();
  const release = registerGraphicsContext();
  assert.equal(getActiveGraphicsContextCount(), before + 1);
  release();
  release();
  assert.equal(getActiveGraphicsContextCount(), before);
});

test("Strict Mode remount cancels deferred irreversible context loss", async () => {
  const canvas = {} as HTMLCanvasElement;
  let losses = 0;
  scheduleContextLoss(canvas, { forceContextLoss: () => { losses += 1; } });
  assert.equal(cancelScheduledContextLoss(canvas), true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(losses, 0);
});

test("hero graphics stays client-only, progressive and route-local", () => {
  const bootstrap = source("components/graphics/hero-graphics-bootstrap.tsx");
  const media = source("components/hero/hero-media.tsx");
  const localeLayout = source("app/[locale]/layout.tsx");
  assert.match(bootstrap, /dynamic\([\s\S]*hero-webgl-effect[\s\S]*ssr: false/);
  assert.match(bootstrap, /if \(!enabled \|\| !decision \|\| decision\.quality === "disabled"\) return null/);
  assert.match(media, /<Image[\s\S]*<HeroGraphicsBootstrap/);
  assert.doesNotMatch(localeLayout, /HeroGraphicsBootstrap|HeroWebglEffect/);
  assert.match(source("components/graphics/hero-webgl-effect.tsx"), /aria-hidden="true"/);
});

test("runtime is demand-driven and owns complete GPU cleanup", () => {
  const runtime = source("components/graphics/hero-webgl-effect.tsx");
  const cursor = source("components/interactions/cursor-layer.tsx");
  const heroMotion = source("components/hero/use-hero-motion.ts");
  assert.equal((cursor.match(/registry\.add\(window, "pointermove"/g) || []).length, 1);
  assert.equal((runtime.match(/pointermove/g) || []).length, 0);
  assert.equal((heroMotion.match(/scrollTrigger:/g) || []).length, 1);
  assert.equal((runtime.match(/scrollTrigger:/g) || []).length, 0);
  assert.match(runtime, /IntersectionObserver/);
  assert.match(runtime, /ResizeObserver/);
  assert.match(runtime, /visibilitychange/);
  assert.match(runtime, /webglcontextlost/);
  assert.match(runtime, /webglcontextrestored/);
  assert.match(runtime, /geometry\?\.dispose\(\)/);
  assert.match(runtime, /material\?\.dispose\(\)/);
  assert.match(runtime, /texture\?\.dispose\(\)/);
  assert.match(runtime, /renderer\?\.dispose\(\)/);
  assert.match(runtime, /scheduleContextLoss\(canvas, renderer\)/);
  assert.doesNotMatch(runtime, /uniform float uTime|setAnimationLoop/);
});

test("configuration keeps the effect subtle and bounded", () => {
  assert.ok(graphicsConfig.quality.full.pointerIntensity <= 0.015);
  assert.ok(graphicsConfig.quality.reduced.pointerIntensity < graphicsConfig.quality.full.pointerIntensity);
  assert.ok(graphicsConfig.quality.full.dpr <= 1.5);
  assert.ok(graphicsConfig.textureTimeoutMs > 0);
  assert.ok(graphicsConfig.pointer.damping > 0 && graphicsConfig.pointer.damping < 1);
});
