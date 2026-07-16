import assert from "node:assert/strict";
import test from "node:test";
import {
  getMediaQuerySnapshot,
  resetMediaQueryStoresForTests,
  subscribeMediaQuery,
} from "../../lib/motion/media-query-store";
import { ScrollLockManager } from "../../lib/motion/scroll-lock";
import { applyTemporaryWillChange } from "../../lib/motion/will-change";

test("media queries share one listener and clean it after the final subscriber", () => {
  let matches = true;
  let changeListener: (() => void) | undefined;
  let addCount = 0;
  let removeCount = 0;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      matchMedia: () => ({
        get matches() {
          return matches;
        },
        addEventListener: (_event: string, listener: () => void) => {
          addCount += 1;
          changeListener = listener;
        },
        removeEventListener: () => {
          removeCount += 1;
        },
      }),
    },
  });

  let notifications = 0;
  const unsubscribeA = subscribeMediaQuery("(prefers-reduced-motion: reduce)", () => {
    notifications += 1;
  });
  const unsubscribeB = subscribeMediaQuery("(prefers-reduced-motion: reduce)", () => {
    notifications += 1;
  });

  assert.equal(addCount, 1);
  assert.equal(getMediaQuerySnapshot("(prefers-reduced-motion: reduce)"), true);
  matches = false;
  changeListener?.();
  assert.equal(notifications, 2);

  unsubscribeA();
  assert.equal(removeCount, 0);
  unsubscribeB();
  assert.equal(removeCount, 1);
  resetMediaQueryStoresForTests();

  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

test("scroll locks pause once and resume only after every overlay releases", () => {
  const events: string[] = [];
  const manager = new ScrollLockManager();
  manager.setController({
    pause: () => events.push("pause"),
    resume: () => events.push("resume"),
  });

  const releaseMenu = manager.lock("menu");
  const releaseLightbox = manager.lock("lightbox");
  assert.equal(manager.count, 2);
  assert.deepEqual(events, ["pause"]);

  releaseMenu();
  assert.equal(manager.isLocked, true);
  assert.deepEqual(events, ["pause"]);

  releaseLightbox();
  assert.equal(manager.isLocked, false);
  assert.deepEqual(events, ["pause", "resume"]);
});

test("temporary will-change restores the previous inline value", () => {
  const target = { style: { willChange: "opacity" } };
  const cleanup = applyTemporaryWillChange(target, "transform, opacity");
  assert.equal(target.style.willChange, "transform, opacity");
  cleanup();
  assert.equal(target.style.willChange, "opacity");
});

test("central GSAP module imports without a browser and scoped contexts revert", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Reflect.deleteProperty(globalThis, "window");
  const { gsap } = await import("../../lib/motion/gsap");
  const target = { value: 0 };
  const context = gsap.context(() => {
    gsap.to(target, { value: 1, duration: 1 });
  });

  assert.equal(context.getTweens().length, 1);
  context.revert();
  assert.equal(context.getTweens().length, 0);

  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
});
