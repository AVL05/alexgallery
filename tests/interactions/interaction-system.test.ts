import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isFinePointerType,
  isKeyboardNavigationKey,
  shouldEnableCursor,
} from "../../lib/interactions/capabilities";
import { cursorConfig, getCursorSize } from "../../lib/interactions/config";
import {
  getCursorTargetAttributes,
  selectCursorTarget,
  shouldUseNativeCursor,
} from "../../lib/interactions/cursor-target";
import { clampCursorPosition, getMagneticOffset } from "../../lib/interactions/geometry";
import {
  CURSOR_GLOBAL_POINTER_LISTENERS,
  InteractionListenerRegistry,
} from "../../lib/interactions/listener-registry";
import enDictionary from "../../dictionaries/en.json";
import esDictionary from "../../dictionaries/es.json";
import type { CursorTargetDescriptor } from "../../types/cursor";

const root = process.cwd();
const source = (path: string) => readFileSync(`${root}/${path}`, "utf8");

function capability(overrides: Partial<Parameters<typeof shouldEnableCursor>[0]> = {}) {
  return shouldEnableCursor({
    enabled: true,
    hasFinePointer: true,
    hasHover: true,
    prefersReducedMotion: false,
    userPrefersNative: false,
    ...overrides,
  });
}

function target(overrides: Partial<CursorTargetDescriptor> = {}): CursorTargetDescriptor {
  return {
    type: "view",
    contrast: "default",
    priority: 0,
    depth: 0,
    disabled: false,
    loading: false,
    ...overrides,
  };
}

test("cursor eligibility requires pointer fine, hover and every accessibility guard", () => {
  assert.equal(capability(), true);
  assert.equal(capability({ hasFinePointer: false }), false);
  assert.equal(capability({ hasHover: false }), false);
  assert.equal(capability({ prefersReducedMotion: true }), false);
  assert.equal(capability({ userPrefersNative: true }), false);
  assert.equal(capability({ enabled: false }), false);
  assert.equal(capability({ initializationFailed: true }), false);
  assert.equal(capability({ forcedColors: true }), false);
});

test("pointer and keyboard modality helpers reject touch and typing keys", () => {
  assert.equal(isFinePointerType("mouse"), true);
  assert.equal(isFinePointerType("pen"), true);
  assert.equal(isFinePointerType("touch"), false);
  assert.equal(isKeyboardNavigationKey("Tab"), true);
  assert.equal(isKeyboardNavigationKey("ArrowRight"), true);
  assert.equal(isKeyboardNavigationKey("a"), false);
});

test("target attributes expose the complete declarative contract", () => {
  assert.deepEqual(getCursorTargetAttributes({
    type: "open",
    label: "Abrir",
    contrast: "dark",
    priority: 4,
    preview: "/thumb.webp",
    disabled: true,
  }), {
    "data-cursor": "open",
    "data-cursor-label": "Abrir",
    "data-cursor-contrast": "dark",
    "data-cursor-priority": 4,
    "data-cursor-preview": "/thumb.webp",
    "data-cursor-disabled": "true",
  });
});

test("nested targets resolve by priority and then nearest depth", () => {
  const parent = target({ type: "open", priority: 2, depth: 3 });
  const child = target({ type: "view", priority: 2, depth: 0 });
  assert.equal(selectCursorTarget([parent, child]), child);
  const modalClose = target({ type: "close", priority: 10, depth: 4 });
  assert.equal(selectCursorTarget([child, modalClose]), modalClose);
});

test("disabled and loading targets never advertise an available action", () => {
  assert.equal(selectCursorTarget([target({ disabled: true })]), null);
  assert.equal(selectCursorTarget([target({ loading: true })]), null);
  assert.equal(selectCursorTarget([
    target({ type: "open", disabled: true, priority: 10 }),
    target({ type: "view" }),
  ])?.type, "view");
});

test("native cursor is preserved for editable, embedded and opted-out regions", () => {
  const matching = { closest: () => ({}) } as unknown as Element;
  const plain = { closest: () => null } as unknown as Element;
  assert.equal(shouldUseNativeCursor(matching), true);
  assert.equal(shouldUseNativeCursor(plain), false);
  assert.equal(shouldUseNativeCursor(null), false);
});

test("viewport and magnetic movement remain clamped", () => {
  assert.deepEqual(clampCursorPosition(-100, 900, 320, 568, 76), { x: 46, y: 522 });
  assert.equal(getMagneticOffset(1000, 0), cursorConfig.magnetic.maxOffset);
  assert.equal(getMagneticOffset(-1000, 0), -cursorConfig.magnetic.maxOffset);
  assert.equal(getMagneticOffset(120, 100, 0.1, 10), 2);
  assert.equal(getCursorSize("default"), 18);
  assert.equal(getCursorSize("close"), 58);
  assert.equal(getCursorSize("view"), 76);
});

test("listener registry removes every registered listener exactly once", () => {
  const added: string[] = [];
  const removed: string[] = [];
  const fakeTarget = {
    addEventListener: (type: string) => added.push(type),
    removeEventListener: (type: string) => removed.push(type),
  } as unknown as EventTarget;
  const registry = new InteractionListenerRegistry();
  const listener = () => undefined;
  registry.add(fakeTarget, "pointermove", listener);
  registry.add(fakeTarget, "scroll", listener);
  assert.equal(registry.count, 2);
  registry.clear();
  assert.deepEqual(removed, added);
  assert.equal(registry.count, 0);
  registry.clear();
  assert.equal(removed.length, 2);
});

test("cursor labels remain complete and localized in both dictionaries", () => {
  assert.deepEqual(esDictionary.cursor, {
    view: "Ver", open: "Abrir", drag: "Arrastrar", next: "Siguiente",
    previous: "Anterior", close: "Cerrar", fullscreen: "Ampliar",
    compare: "Comparar", explore: "Explorar", copied: "Copiado",
    unavailable: "No disponible",
  });
  assert.deepEqual(enDictionary.cursor, {
    view: "View", open: "Open", drag: "Drag", next: "Next",
    previous: "Previous", close: "Close", fullscreen: "Fullscreen",
    compare: "Compare", explore: "Explore", copied: "Copied",
    unavailable: "Unavailable",
  });
});

test("runtime contract uses one delegated pointer listener and no per-frame React state", () => {
  const cursorLayer = source("components/interactions/cursor-layer.tsx");
  const pointerHandler = cursorLayer.slice(
    cursorLayer.indexOf("const handlePointerMove"),
    cursorLayer.indexOf("const handleKeyboard"),
  );
  assert.equal(CURSOR_GLOBAL_POINTER_LISTENERS, 1);
  assert.equal((cursorLayer.match(/registry\.add\(window, "pointermove"/g) || []).length, 1);
  assert.equal(pointerHandler.includes("setPosition"), false);
  assert.equal(pointerHandler.includes("requestAnimationFrame"), false);
  assert.equal(cursorLayer.includes("INTERACTION_RESET_EVENT"), true);
});

test("cursor, magnetism and intro preserve cleanup and fallback contracts", () => {
  const cursorLayer = source("components/interactions/cursor-layer.tsx");
  const magnetic = source("components/interactions/magnetic.tsx");
  const intro = source("components/intro/intro-overlay.tsx");
  const css = source("app/globals.css");
  assert.match(cursorLayer, /catch \{\s*restoreNativeCursor\(\)/);
  assert.match(cursorLayer, /registry\.clear\(\)/);
  assert.match(magnetic, /gsap\.killTweensOf/);
  assert.match(magnetic, /restoreWillChangeRef\.current\?\.\(\)/);
  assert.match(intro, /data-native-cursor/);
  assert.match(css, /\.rv-editorial-link:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("cursor is dynamically imported and remains outside critical SSR", () => {
  const bootstrap = source("components/interactions/interaction-bootstrap.tsx");
  assert.match(bootstrap, /dynamic\(\s*\(\) => import\("@\/components\/interactions\/cursor-layer"\)/);
  assert.match(bootstrap, /ssr: false/);
  assert.match(bootstrap, /shouldEnableCursor/);
  assert.match(source("lib/interactions/config.ts"), /native-cursor/);
});
