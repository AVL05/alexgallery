import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isWebGLAvailable,
  readQualitySignals,
  resolveHeroQuality,
  type HeroQualitySignals,
} from "../../lib/graphics/quality";

const read = (path: string) => readFileSync(path, "utf8");

const capableDesktop: HeroQualitySignals = {
  webgl: true,
  devicePixelRatio: 2,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
  saveData: false,
};

test("capable desktop resolves high without raising quality", () => {
  const profile = resolveHeroQuality(capableDesktop);
  assert.equal(profile.tier, "high");
  assert.equal(profile.maxPixelRatio, 1.5);
  assert.equal(profile.maxFrames, 4);
  assert.equal(profile.scrollScale, 1);
  assert.equal(profile.driftScale, 1);
});

test("mid desktop and capable touch resolve medium", () => {
  assert.equal(
    resolveHeroQuality({ ...capableDesktop, hardwareConcurrency: 4 }).tier,
    "medium",
  );
  assert.equal(
    resolveHeroQuality({ ...capableDesktop, deviceMemory: 4 }).tier,
    "medium",
  );
  const capablePhone: HeroQualitySignals = {
    webgl: true,
    devicePixelRatio: 3,
    deviceMemory: null,
    hardwareConcurrency: 8,
    coarsePointer: true,
    saveData: false,
  };
  const medium = resolveHeroQuality(capablePhone);
  assert.equal(medium.tier, "medium");
  assert.equal(medium.maxPixelRatio, 1.25);
  assert.equal(medium.maxFrames, 3);
});

test("constrained devices resolve low with minimal load", () => {
  const lowMemory = resolveHeroQuality({ ...capableDesktop, deviceMemory: 2 });
  assert.equal(lowMemory.tier, "low");
  const fewCores = resolveHeroQuality({ ...capableDesktop, hardwareConcurrency: 2 });
  assert.equal(fewCores.tier, "low");
  const typicalPhone: HeroQualitySignals = {
    webgl: true,
    devicePixelRatio: 3,
    deviceMemory: null,
    hardwareConcurrency: 4,
    coarsePointer: true,
    saveData: false,
  };
  const low = resolveHeroQuality(typicalPhone);
  assert.equal(low.tier, "low");
  assert.equal(low.maxPixelRatio, 1);
  assert.equal(low.maxFrames, 2);
  assert.equal(low.driftScale, 0);
  assert.ok(low.scrollScale < 0.7);
});

test("missing webgl, saveData or a 2G connection disables 3d entirely", () => {
  assert.equal(resolveHeroQuality({ ...capableDesktop, webgl: false }).tier, "off");
  assert.equal(resolveHeroQuality({ ...capableDesktop, saveData: true }).tier, "off");
  assert.equal(resolveHeroQuality({ ...capableDesktop, effectiveType: "slow-2g" }).tier, "off");
  assert.equal(resolveHeroQuality({ ...capableDesktop, effectiveType: "2g" }).tier, "off");
  assert.equal(resolveHeroQuality({ ...capableDesktop, effectiveType: "4g" }).tier, "high");
  const off = resolveHeroQuality({ ...capableDesktop, webgl: false });
  assert.equal(off.maxFrames, 0);
});

test("missing browser APIs degrade conservatively without hardware", () => {
  assert.equal(isWebGLAvailable(), false);
  const fallback = readQualitySignals();
  assert.equal(fallback.webgl, false);
  assert.equal(fallback.hardwareConcurrency, 1);
  assert.equal(resolveHeroQuality(fallback).tier, "off");
});

test("scene gates downloads, handles context loss and exposes debug", () => {
  const scene = read("components/graphics/hero-frames-scene.tsx");
  assert.match(scene, /readQualitySignals\(\)/);
  assert.match(scene, /resolveHeroQuality\(signals\)/);
  assert.match(scene, /if \(quality\.tier === "off"\) return;/);
  assert.match(scene, /quality\.maxPixelRatio/);
  assert.match(scene, /quality\.maxFrames/);
  assert.match(scene, /quality\.scrollScale/);
  assert.match(scene, /quality\.driftScale/);
  assert.match(scene, /webglcontextlost/);
  assert.match(scene, /webglcontextrestored/);
  assert.match(scene, /getTier/);
  assert.match(scene, /getSaveData/);
  assert.doesNotMatch(scene, /iPhone|Android|userAgent/);
});
