"use client";

import { AnimatedDivider } from "@/components/motion/animated-divider";
import { MotionImage } from "@/components/motion/motion-image";
import { useMotion } from "@/components/motion/motion-provider";
import { MaskReveal, Reveal, StaggerGroup } from "@/components/motion/reveal";
import { MotionText } from "@/components/motion/motion-text";
import {
  INTRO_STATE_EVENT,
  requestIntroReplay,
  type IntroStateDetail,
} from "@/lib/intro/development";
import {
  getBrowserSessionStorage,
  readIntroSession,
  resetIntroSession,
} from "@/lib/intro/persistence";
import {
  HERO_STATE_EVENT,
  requestHeroPreview,
  type HeroStateDetail,
} from "@/lib/hero/development";
import {
  HOME_STATE_EVENT,
  requestHomePreview,
  type HomeStateDetail,
} from "@/lib/home/development";
import { useEffect, useState } from "react";
import {
  INTERACTION_STATE_EVENT,
  requestInteractionControl,
} from "@/lib/interactions/development";
import type { CursorDebugSnapshot } from "@/types/cursor";
import {
  GRAPHICS_STATE_EVENT,
  getLatestGraphicsState,
  requestGraphicsControl,
} from "@/lib/graphics/development";
import type { GraphicsDebugSnapshot } from "@/types/graphics";

export function MotionDebugPanel() {
  const motion = useMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [introState, setIntroState] = useState<IntroStateDetail | null>(null);
  const [introSeen, setIntroSeen] = useState(false);
  const [heroState, setHeroState] = useState<HeroStateDetail | null>(null);
  const [homeState, setHomeState] = useState<HomeStateDetail | null>(null);
  const [interactionState, setInteractionState] = useState<CursorDebugSnapshot | null>(null);
  const [graphicsState, setGraphicsState] = useState<GraphicsDebugSnapshot | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    setVisible(new URLSearchParams(window.location.search).get("motion-debug") === "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const update = () => setTriggerCount(motion.getActiveTriggerCount());
    update();
    const interval = window.setInterval(update, 750);
    return () => window.clearInterval(interval);
  }, [motion, visible]);

  useEffect(() => {
    if (!visible) return;

    const syncSession = () => setIntroSeen(readIntroSession(getBrowserSessionStorage()).seen);
    const handleIntroState = (event: Event) => {
      setIntroState((event as CustomEvent<IntroStateDetail>).detail);
      syncSession();
    };
    setGraphicsState(getLatestGraphicsState());

    syncSession();
    window.addEventListener(INTRO_STATE_EVENT, handleIntroState);
    return () => window.removeEventListener(INTRO_STATE_EVENT, handleIntroState);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleInteractionState = (event: Event) => {
      setInteractionState((event as CustomEvent<CursorDebugSnapshot>).detail);
    };
    window.addEventListener(INTERACTION_STATE_EVENT, handleInteractionState);
    return () => window.removeEventListener(INTERACTION_STATE_EVENT, handleInteractionState);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleGraphicsState = (event: Event) => {
      setGraphicsState((event as CustomEvent<GraphicsDebugSnapshot>).detail);
    };
    window.addEventListener(GRAPHICS_STATE_EVENT, handleGraphicsState);
    return () => window.removeEventListener(GRAPHICS_STATE_EVENT, handleGraphicsState);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleHomeState = (event: Event) => {
      setHomeState((event as CustomEvent<HomeStateDetail>).detail);
    };
    window.addEventListener(HOME_STATE_EVENT, handleHomeState);
    return () => window.removeEventListener(HOME_STATE_EVENT, handleHomeState);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleHeroState = (event: Event) => {
      setHeroState((event as CustomEvent<HeroStateDetail>).detail);
    };
    window.addEventListener(HERO_STATE_EVENT, handleHeroState);
    return () => window.removeEventListener(HERO_STATE_EVENT, handleHeroState);
  }, [visible]);

  const previewLocale = (locale: "en" | "es") => {
    resetIntroSession(getBrowserSessionStorage());
    window.location.assign(`/${locale}?motion-debug=1&intro-preview=1`);
  };

  if (process.env.NODE_ENV !== "development" || !visible) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[999] w-[min(24rem,calc(100vw-2rem))] border border-border bg-[var(--color-surface-elevated)] p-4 text-foreground">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="rv-kicker">Motion debug</p>
          <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
            triggers {triggerCount} / lenis {motion.isSmoothScrollEnabled ? "on" : "off"}
          </p>
        </div>
        <button
          type="button"
          className="min-h-11 border border-border px-3 text-[10px] uppercase tracking-wider"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Close" : "Reference"}
        </button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-[var(--color-text-muted)]">
        <div><dt>reduced</dt><dd>{String(motion.prefersReducedMotion)}</dd></div>
        <div><dt>touch</dt><dd>{String(motion.isTouchDevice)}</dd></div>
        <div><dt>hover</dt><dd>{String(motion.hasHover)}</dd></div>
        <div><dt>locked</dt><dd>{String(motion.isScrollLocked)}</dd></div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="min-h-11 border border-border px-3 text-xs" onClick={motion.refreshScrollTriggers}>Refresh</button>
        <button type="button" className="min-h-11 border border-border px-3 text-xs" onClick={() => motion.pauseScroll("debug")}>Pause</button>
        <button type="button" className="min-h-11 border border-border px-3 text-xs" onClick={() => motion.resumeScroll("debug")}>Resume</button>
      </div>

      {expanded && (
        <div className="mt-4 max-h-[55vh] space-y-5 overflow-y-auto border-t border-border pt-4">
          <section className="border border-border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rv-meta">Intro system</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                  {introState?.phase ?? "idle"} / {introState?.duration.toFixed(2) ?? "0.00"}s / session {introSeen ? "seen" : "new"}
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent">
                {introState?.locale?.toUpperCase() ?? "--"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestIntroReplay()}>Replay</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => {
                resetIntroSession(getBrowserSessionStorage());
                setIntroSeen(false);
              }}>Reset session</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestIntroReplay({ reducedMotion: true })}>Reduced</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestIntroReplay({ slow: true })}>Slow load</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestIntroReplay({ fail: true })}>Resource fail</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => previewLocale("es")}>Preview ES</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => previewLocale("en")}>Preview EN</button>
            </div>
            <p className="mt-3 font-mono text-[9px] text-[var(--color-text-muted)]">
              scroll {motion.isScrollLocked ? "locked" : "open"} / triggers {triggerCount}
            </p>
          </section>
          <section className="border border-border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rv-meta">Graphics system</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                  {graphicsState?.status ?? "idle"} / {graphicsState?.renderer ?? "none"} / {graphicsState?.quality ?? "disabled"}
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent">
                {graphicsState?.webgl2 ? "WEBGL2" : graphicsState?.webgl ? "WEBGL1" : "HTML"}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[9px] text-[var(--color-text-muted)]">
              <div><dt>reason</dt><dd>{graphicsState?.reason ?? "not mounted"}</dd></div>
              <div><dt>WebGPU</dt><dd>{String(graphicsState?.webgpu ?? false)}</dd></div>
              <div><dt>DPR</dt><dd>{graphicsState?.dpr.toFixed(2) ?? "0.00"}</dd></div>
              <div><dt>FPS demand</dt><dd>{graphicsState?.fps ?? 0}</dd></div>
              <div><dt>frames</dt><dd>{graphicsState?.frames ?? 0}</dd></div>
              <div><dt>draw calls</dt><dd>{graphicsState?.drawCalls ?? 0}</dd></div>
              <div><dt>triangles</dt><dd>{graphicsState?.triangles ?? 0}</dd></div>
              <div><dt>texture</dt><dd>{graphicsState?.textureLoaded ? "ready" : "fallback"}</dd></div>
              <div><dt>visible</dt><dd>{String(graphicsState?.visible ?? false)}</dd></div>
              <div><dt>overlay</dt><dd>{String(graphicsState?.overlayOpen ?? false)}</dd></div>
              <div><dt>context lost</dt><dd>{String(graphicsState?.contextLost ?? false)}</dd></div>
              <div><dt>contexts</dt><dd>{graphicsState?.activeContexts ?? 0}</dd></div>
              <div><dt>fine / hover</dt><dd>{String(graphicsState?.hasFinePointer ?? false)} / {String(graphicsState?.hasHover ?? false)}</dd></div>
              <div><dt>touch / reduced</dt><dd>{String(graphicsState?.hasTouch ?? false)} / {String(graphicsState?.prefersReducedMotion ?? false)}</dd></div>
              <div><dt>save data</dt><dd>{String(graphicsState?.saveData ?? false)}</dd></div>
              <div><dt>memory / cores</dt><dd>{graphicsState?.deviceMemory ?? "?"} / {graphicsState?.hardwareConcurrency ?? 0}</dd></div>
              <div><dt>viewport</dt><dd>{graphicsState?.viewport ?? "--"}</dd></div>
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ enabled: graphicsState?.status === "fallback" })}>Toggle</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ forceQuality: "full" })}>Full</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ forceQuality: "reduced" })}>Reduced</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ intensity: 0 })}>Zero effect</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ intensity: 1 })}>Normal effect</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestGraphicsControl({ simulateContextLoss: true })}>Lose context</button>
            </div>
            <p className="mt-3 break-all font-mono text-[9px] text-[var(--color-text-muted)]">
              source {graphicsState?.imageSource ?? "HTML hero fallback"}
            </p>
          </section>
          <section className="border border-border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rv-meta">Interaction system</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                  {interactionState?.state ?? "default"} / {interactionState?.label || "no label"}
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent">
                {interactionState?.modality?.toUpperCase() ?? "UNKNOWN"}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[9px] text-[var(--color-text-muted)]">
              <div><dt>pointer fine</dt><dd>{String(motion.hasFinePointer)}</dd></div>
              <div><dt>hover</dt><dd>{String(motion.hasHover)}</dd></div>
              <div><dt>touch</dt><dd>{String(motion.isTouchDevice)}</dd></div>
              <div><dt>reduced</dt><dd>{String(motion.prefersReducedMotion)}</dd></div>
              <div><dt>eligible</dt><dd>{String(interactionState?.eligible ?? false)}</dd></div>
              <div><dt>enabled</dt><dd>{String(interactionState?.enabled ?? false)}</dd></div>
              <div><dt>contrast</dt><dd>{interactionState?.contrast ?? "default"}</dd></div>
              <div><dt>preview</dt><dd>{interactionState?.preview ?? "off"}</dd></div>
              <div><dt>listeners</dt><dd>{interactionState?.globalPointerListeners ?? 0}</dd></div>
              <div><dt>magnetic</dt><dd>{String(interactionState?.magneticEnabled ?? false)}</dd></div>
              <div><dt>sim touch</dt><dd>{String(interactionState?.simulatedTouch ?? false)}</dd></div>
              <div><dt>sim reduced</dt><dd>{String(interactionState?.simulatedReducedMotion ?? false)}</dd></div>
              <div><dt>position</dt><dd>{Math.round(interactionState?.position.x ?? 0)},{Math.round(interactionState?.position.y ?? 0)}</dd></div>
              <div><dt>overlay</dt><dd>{String(interactionState?.overlayOpen ?? false)}</dd></div>
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["view", "drag", "next"] as const).map((state) => (
                <button key={state} type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ state })}>{state.toUpperCase()}</button>
              ))}
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ state: "default" })}>DEFAULT</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ state: interactionState?.state || "view", contrast: interactionState?.contrast === "light" ? "dark" : "light" })}>Contrast</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ disabled: interactionState?.enabled ?? true })}>{interactionState?.enabled ? "Disable" : "Enable"}</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ simulateTouch: !(interactionState?.simulatedTouch ?? false) })}>Touch</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ simulateReducedMotion: !(interactionState?.simulatedReducedMotion ?? false) })}>Reduced</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ state: "view", edge: "top-left" })}>Top left</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestInteractionControl({ state: "view", edge: "bottom-right" })}>Bottom right</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => previewLocale("es")}>Cursor ES</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => previewLocale("en")}>Cursor EN</button>
            </div>
            <p className="mt-3 font-mono text-[9px] text-[var(--color-text-muted)]">
              route {interactionState?.route ?? "--"} / layer {interactionState?.mounted ? "mounted" : "idle"}
            </p>
          </section>
          <section className="border border-border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rv-meta">Hero system</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                  {heroState?.phase ?? "idle"} / {heroState?.duration.toFixed(2) ?? "0.00"}s / image {heroState?.imageState ?? "--"}
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent">
                {motion.isTouchDevice ? "TOUCH" : "DESKTOP"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ source: "manual" })}>Replay</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ finalState: true, source: "manual" })}>Final state</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ reducedMotion: true, source: "manual" })}>Reduced</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ slowImage: true, source: "manual" })}>Slow image</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ failImage: true, source: "manual" })}>Image fail</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ source: "intro-completed" })}>Intro complete</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHeroPreview({ source: "intro-omitted" })}>Intro omitted</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => previewLocale("en")}>Hero EN</button>
            </div>
            <p className="mt-3 font-mono text-[9px] text-[var(--color-text-muted)]">
              source {heroState?.source ?? "initial"} / triggers {triggerCount} / scroll {motion.isScrollLocked ? "locked" : "open"}
            </p>
          </section>
          <section className="border border-border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rv-meta">Home narrative</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                  chapters {homeState?.chapterCount ?? 5} / selected {homeState?.selectedCount ?? 6}
                </p>
              </div>
              <span className="font-mono text-[10px] text-accent">
                {homeState?.alternate ? "ALT" : "CURATED"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview()}>Default</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ alternate: true })}>Alternate</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ reducedMotion: true })}>Reduced</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ slowImages: true })}>Slow images</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ failImages: true })}>Image fail</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ fewPhotos: true })}>Few photos</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => requestHomePreview({ emptyCategories: true })}>No chapters</button>
              <button type="button" className="min-h-11 border border-border px-2 text-[10px]" onClick={() => document.querySelector("#selected-work")?.scrollIntoView()}>Selected</button>
            </div>
            <p className="mt-3 font-mono text-[9px] text-[var(--color-text-muted)]">
              images {homeState?.failImages ? "fallback" : "primary"} / motion {homeState?.reducedMotion ? "reduced" : "system"}
            </p>
          </section>
          <Reveal><p className="rv-card-title">Reveal simple</p></Reveal>
          <MotionText text="Reveal by word" className="rv-body" />
          <MotionText text={'Reveal by\nline'} mode="line" className="rv-body" />
          <StaggerGroup className="flex gap-2">
            <span data-motion-item className="rv-meta">01</span>
            <span data-motion-item className="rv-meta">02</span>
            <span data-motion-item className="rv-meta">03</span>
          </StaggerGroup>
          <MaskReveal><p className="rv-card-title">Mask reveal</p></MaskReveal>
          <MotionImage
            src="/photos/optimized/400/46.webp"
            alt="Motion image reference"
            width={400}
            height={500}
            unoptimized
            className="h-full w-full object-cover"
            frameClassName="aspect-[4/3]"
          />
          <AnimatedDivider />
          <div className="border border-border p-3">
            <p className="rv-meta">Reduced-motion fallback</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Visible immediately, without displacement.</p>
          </div>
        </div>
      )}
    </aside>
  );
}
