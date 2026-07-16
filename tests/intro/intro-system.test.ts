import assert from "node:assert/strict";
import test from "node:test";
import { INTRO_STORAGE_KEY, isLocalizedHomePath } from "../../lib/intro/constants";
import { createIntroSafetyTimer } from "../../lib/intro/lifecycle";
import {
  markIntroSeen,
  readIntroSession,
  resetIntroSession,
  shouldShowIntro,
  getBrowserSessionStorage,
  type SessionStorageLike,
} from "../../lib/intro/persistence";

function createStorage(): SessionStorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("intro is eligible only on the first localized home entry", () => {
  const storage = createStorage();
  const firstSession = readIntroSession(storage);

  assert.equal(
    shouldShowIntro({
      isHome: true,
      prefersReducedMotion: false,
      session: firstSession,
      isAutomated: false,
    }),
    true,
  );

  assert.equal(markIntroSeen(storage), true);
  assert.equal(storage.getItem(INTRO_STORAGE_KEY), "1");
  assert.equal(
    shouldShowIntro({
      isHome: true,
      prefersReducedMotion: false,
      session: readIntroSession(storage),
      isAutomated: false,
    }),
    false,
  );
});

test("intro skips internal routes, direct photographs, reduced motion and automation", () => {
  const session = readIntroSession(createStorage());
  const base = { session, prefersReducedMotion: false, isAutomated: false };

  assert.equal(isLocalizedHomePath("/es"), true);
  assert.equal(isLocalizedHomePath("/en/"), true);
  assert.equal(isLocalizedHomePath("/es/photo/1"), false);
  assert.equal(isLocalizedHomePath("/es/politica-uso"), false);
  assert.equal(shouldShowIntro({ ...base, isHome: false }), false);
  assert.equal(shouldShowIntro({ ...base, isHome: true, prefersReducedMotion: true }), false);
  assert.equal(shouldShowIntro({ ...base, isHome: true, isAutomated: true }), false);
  assert.equal(shouldShowIntro({ ...base, isHome: true, timedOut: true }), false);
});

test("storage failures never block access and reset is safe", () => {
  const blockedStorage: SessionStorageLike = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };

  const session = readIntroSession(blockedStorage);
  assert.deepEqual(session, { available: false, seen: false });
  assert.equal(markIntroSeen(blockedStorage), false);
  assert.equal(resetIntroSession(blockedStorage), false);
  assert.equal(
    shouldShowIntro({
      isHome: true,
      prefersReducedMotion: false,
      session,
      isAutomated: false,
    }),
    false,
  );
});

test("intro persistence imports safely without a browser", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Reflect.deleteProperty(globalThis, "window");
  assert.equal(getBrowserSessionStorage(), null);
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
});

test("safety timeout can be cleaned before it completes", () => {
  let callback: (() => void) | undefined;
  let cleared = false;
  const timerToken = {} as ReturnType<typeof globalThis.setTimeout>;
  const cleanup = createIntroSafetyTimer(
    () => {
      throw new Error("cleaned timer must not execute");
    },
    3400,
    {
      setTimeout: ((next: () => void) => {
        callback = next;
        return timerToken;
      }) as typeof globalThis.setTimeout,
      clearTimeout: ((timer: ReturnType<typeof globalThis.setTimeout>) => {
        cleared = timer === timerToken;
        callback = undefined;
      }) as typeof globalThis.clearTimeout,
    },
  );

  cleanup();
  assert.equal(cleared, true);
  assert.equal(callback, undefined);
});
