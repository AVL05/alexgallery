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
import { useEffect, useState } from "react";

export function MotionDebugPanel() {
  const motion = useMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [introState, setIntroState] = useState<IntroStateDetail | null>(null);
  const [introSeen, setIntroSeen] = useState(false);
  const [heroState, setHeroState] = useState<HeroStateDetail | null>(null);

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

    syncSession();
    window.addEventListener(INTRO_STATE_EVENT, handleIntroState);
    return () => window.removeEventListener(INTRO_STATE_EVENT, handleIntroState);
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
