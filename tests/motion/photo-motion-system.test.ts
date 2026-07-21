import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getArchiveMotionPlan,
  getPhotoMotionProfile,
  getPhotoMotionRuntimeOptions,
  getPhotoOrientation,
  getPhotoRevealVariant,
  getPhotoViewTransitionName,
  hasPhotoRevealed,
  markPhotoRevealed,
  photoMotionConfig,
  photoMotionTokens,
  resetPhotoRevealRegistryForTests,
  shouldEnhancePhotoNavigation,
} from "@/lib/motion/photo-motion";

test("photo reveal variants are deterministic by orientation and editorial role", () => {
  assert.equal(getPhotoOrientation(1500, 1000), "horizontal");
  assert.equal(getPhotoOrientation(1000, 1500), "vertical");
  assert.equal(getPhotoOrientation(1000, 1000), "square");
  assert.equal(getPhotoRevealVariant({ width: 1000, height: 1500, role: "selected" }), "mask-up");
  assert.equal(getPhotoRevealVariant({ width: 1500, height: 1000, role: "selected" }), "mask-side");
  assert.equal(getPhotoRevealVariant({ width: 1000, height: 1000, role: "selected" }), "soft-scale");
  assert.equal(getPhotoRevealVariant({ width: 1000, height: 1500, role: "featured" }), "mask-side");
  assert.equal(getPhotoRevealVariant({ width: 1500, height: 1000, role: "archive" }), "soft-scale");
});

test("central configuration bounds the photography motion vocabulary", () => {
  assert.equal(photoMotionConfig.archiveBatchSize, 6);
  assert.equal(photoMotionConfig.revealOnce, true);
  assert.equal(photoMotionConfig.reducedMotionMode, "static");
  assert.ok(photoMotionConfig.mobileIntensity > 0 && photoMotionConfig.mobileIntensity < 1);
  assert.ok(photoMotionTokens.hover.editorialScale <= 1.025);
  assert.ok(photoMotionTokens.fullscreen.duration >= 0.2 && photoMotionTokens.fullscreen.duration <= 0.35);
  assert.ok(photoMotionTokens.editorial.duration <= 1.2);
});

test("reduced motion is static and mobile intensity reduces distance and scale", () => {
  const desktop = getPhotoMotionProfile({ reducedMotion: false, touch: false });
  const mobile = getPhotoMotionProfile({ reducedMotion: false, touch: true });
  const reduced = getPhotoMotionProfile({ reducedMotion: true, touch: false });
  assert.equal(reduced.static, true);
  assert.equal(desktop.static, false);
  assert.ok(mobile.distance < desktop.distance);
  assert.ok(mobile.scale < desktop.scale);
  assert.ok(mobile.duration < desktop.duration);
});

test("runtime defaults preserve progressive enhancement flags", () => {
  const runtime = getPhotoMotionRuntimeOptions();
  assert.equal(runtime.enabled, true);
  assert.equal(runtime.gsap, true);
  assert.equal(runtime.scrollTrigger, true);
  assert.equal(runtime.viewTransitions, true);
  assert.equal(runtime.revealOnce, true);
});

test("reveal-once registry remains stable across locale and route remounts", () => {
  resetPhotoRevealRegistryForTests();
  assert.equal(hasPhotoRevealed("photo-detail-21"), false);
  markPhotoRevealed("photo-detail-21");
  assert.equal(hasPhotoRevealed("photo-detail-21"), true);
  assert.equal(hasPhotoRevealed("photo-detail-21"), true);
});

test("archive initial load and load-more animate only unseen blocks", () => {
  const initial = getArchiveMotionPlan({
    collectionKey: "all",
    visibleIds: [1, 3, 4, 5, 6, 7],
    seenIds: new Set(),
  });
  assert.equal(initial.mode, "initial");
  assert.deepEqual(initial.animateIds, [1, 3, 4, 5, 6, 7]);

  const append = getArchiveMotionPlan({
    previousCollectionKey: "all",
    collectionKey: "all",
    visibleIds: [1, 3, 4, 5, 6, 7, 11, 12],
    seenIds: new Set([1, 3, 4, 5, 6, 7]),
  });
  assert.equal(append.mode, "append");
  assert.deepEqual(append.animateIds, [11, 12]);
});

test("archive filters update immediately without replaying old cards", () => {
  const plan = getArchiveMotionPlan({
    previousCollectionKey: "all",
    collectionKey: "Fauna|all||curated",
    visibleIds: [1, 4, 5, 7],
    seenIds: new Set([1]),
  });
  assert.equal(plan.mode, "filter");
  assert.deepEqual(plan.animateIds, []);
});

test("view transition enhancement excludes modifiers, new tabs and unsupported browsers", () => {
  const base = { reducedMotion: false, enabled: true, apiAvailable: true };
  assert.equal(shouldEnhancePhotoNavigation(base), true);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, ctrlKey: true }), false);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, metaKey: true }), false);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, button: 1 }), false);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, target: "_blank" }), false);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, apiAvailable: false }), false);
  assert.equal(shouldEnhancePhotoNavigation({ ...base, reducedMotion: true }), false);
  assert.equal(getPhotoViewTransitionName(21), "archive-photo-21");
});

test("photography groups and chapter transitions own and clean their timelines", async () => {
  const [group, chapter] = await Promise.all([
    readFile("components/motion/photo-reveal.tsx", "utf8"),
    readFile("components/home/chapter-photo-stage.tsx", "utf8"),
  ]);
  assert.match(group, /useGSAP/);
  assert.match(group, /revertOnUpdate: true/);
  assert.match(group, /timeline\.kill\(\)/);
  assert.match(chapter, /gsap\.killTweensOf/);
  assert.match(chapter, /timeline\.kill\(\)/);
  assert.doesNotMatch(chapter, /setInterval|requestAnimationFrame/);
});

test("archive uses one observer strategy and no ScrollTrigger per card", async () => {
  const [hook, grid, item] = await Promise.all([
    readFile("hooks/use-archive-photo-motion.ts", "utf8"),
    readFile("components/archive/archive-grid.tsx", "utf8"),
    readFile("components/archive/archive-item.tsx", "utf8"),
  ]);
  assert.match(hook, /new IntersectionObserver/);
  assert.match(hook, /observer\.disconnect\(\)/);
  assert.doesNotMatch(hook, /ScrollTrigger/);
  assert.doesNotMatch(grid, /ScrollTrigger/);
  assert.doesNotMatch(item, /addEventListener|requestAnimationFrame/);
});

test("photo navigation keeps Link fallback and immediate cross-document enhancement", async () => {
  const source = await readFile("components/motion/photo-transition-link.tsx", "utf8");
  assert.match(source, /<Link/);
  assert.match(source, /typeof document\.startViewTransition/);
  assert.match(source, /window\.location\.assign\(href\)/);
  assert.doesNotMatch(source, /MutationObserver|setTimeout/);
});

test("fullscreen motion remains short and restores trigger focus", async () => {
  const source = await readFile("components/photo-detail/photo-fullscreen-dialog.tsx", "utf8");
  assert.match(source, /photoMotionTokens\.fullscreen\.duration/);
  assert.match(source, /triggerRef\.current\?\.focus/);
  assert.match(source, /prefersReducedMotion \? 1/);
});
