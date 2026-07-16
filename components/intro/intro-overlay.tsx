"use client";

import { IntroBrand } from "@/components/intro/intro-brand";
import { IntroMetadata } from "@/components/intro/intro-metadata";
import { IntroProgress } from "@/components/intro/intro-progress";
import { IntroSkipButton } from "@/components/intro/intro-skip-button";
import { useIntroSequence } from "@/components/intro/use-intro-sequence";
import { useMotion } from "@/components/motion/motion-provider";
import {
  INTRO_SCROLL_LOCK_SOURCE,
  introTiming,
  isLocalizedHomePath,
  type IntroPhase,
} from "@/lib/intro/constants";
import {
  INTRO_REPLAY_EVENT,
  reportIntroState,
  type IntroPreviewOptions,
} from "@/lib/intro/development";
import {
  getBrowserSessionStorage,
  markIntroSeen,
  readIntroSession,
  shouldShowIntro,
} from "@/lib/intro/persistence";
import { createIntroSafetyTimer } from "@/lib/intro/lifecycle";
import type { IntroDictionary, Locale } from "@/types/dictionary";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type ActiveIntro = IntroPreviewOptions & { key: number };

export type IntroSettledResult = "completed" | "skipped" | "omitted";

export function IntroOverlay({
  dictionary,
  locale,
  onInitialSettled,
}: {
  dictionary: IntroDictionary;
  locale: Locale;
  onInitialSettled?: (result: IntroSettledResult) => void;
}) {
  const { prefersReducedMotion } = useMotion();
  const [activeIntro, setActiveIntro] = useState<ActiveIntro | null>(null);
  const sequenceKeyRef = useRef(0);
  const initialSettledRef = useRef(false);

  const settleInitialIntro = useCallback(
    (result: IntroSettledResult) => {
      if (initialSettledRef.current) return;
      initialSettledRef.current = true;
      onInitialSettled?.(result);
    },
    [onInitialSettled],
  );

  const startIntro = useCallback((options: IntroPreviewOptions = {}) => {
    sequenceKeyRef.current += 1;
    setActiveIntro({ ...options, key: sequenceKeyRef.current });
  }, []);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcePreview =
      process.env.NODE_ENV === "development" && params.get("intro-preview") === "1";
    const sessionStorage = getBrowserSessionStorage();
    const session = readIntroSession(sessionStorage);
    const isHome = isLocalizedHomePath(window.location.pathname);
    const show = shouldShowIntro({
      isHome,
      prefersReducedMotion,
      session,
      isAutomated: navigator.webdriver === true,
      timedOut: document.documentElement.dataset.introExpired === "true",
      force: forcePreview,
    });

    if (show && (forcePreview || markIntroSeen(sessionStorage))) {
      startIntro({ reducedMotion: forcePreview && prefersReducedMotion });
    } else {
      reportIntroState({ phase: "completed", locale, duration: 0 });
      settleInitialIntro("omitted");
    }

    delete document.documentElement.dataset.introPending;
    delete document.documentElement.dataset.introExpired;
  }, [locale, prefersReducedMotion, settleInitialIntro, startIntro]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const handleReplay = (event: Event) => {
      const options = (event as CustomEvent<IntroPreviewOptions>).detail ?? {};
      startIntro(options);
    };

    window.addEventListener(INTRO_REPLAY_EVENT, handleReplay);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, handleReplay);
  }, [startIntro]);

  if (!activeIntro) return null;

  return (
    <IntroExperience
      key={activeIntro.key}
      dictionary={dictionary}
      locale={activeIntro.locale ?? locale}
      options={activeIntro}
      onFinished={(result) => {
        setActiveIntro(null);
        settleInitialIntro(result);
      }}
    />
  );
}

function IntroExperience({
  dictionary,
  locale,
  options,
  onFinished,
}: {
  dictionary: IntroDictionary;
  locale: Locale;
  options: IntroPreviewOptions;
  onFinished: (result: "completed" | "skipped") => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const releaseScrollRef = useRef<(() => void) | null>(null);
  const finishedRef = useRef(false);
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const { lockScroll, refreshScrollTriggers, prefersReducedMotion } = useMotion();
  const effectiveReducedMotion = options.reducedMotion ?? prefersReducedMotion;
  const duration = effectiveReducedMotion
    ? introTiming.reduced
    : options.slow
      ? introTiming.normal / 0.48
      : introTiming.normal;

  const changePhase = useCallback(
    (nextPhase: IntroPhase) => {
      setPhase(nextPhase);
      reportIntroState({ phase: nextPhase, locale, duration });
    },
    [duration, locale],
  );

  const releaseScroll = useCallback(() => {
    releaseScrollRef.current?.();
    releaseScrollRef.current = null;
    delete document.documentElement.dataset.introActive;
  }, []);

  const finish = useCallback(
    (result: "completed" | "skipped") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      changePhase(result);

      const shouldRestoreFocus = rootRef.current?.contains(document.activeElement) ?? false;
      releaseScroll();
      onFinished(result);

      window.requestAnimationFrame(() => {
        refreshScrollTriggers();
        if (shouldRestoreFocus) {
          document.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true });
        }
      });
    },
    [changePhase, onFinished, refreshScrollTriggers, releaseScroll],
  );

  const failSafely = useCallback(() => finish("completed"), [finish]);
  const skip = useIntroSequence({
    scope: rootRef,
    reducedMotion: effectiveReducedMotion,
    slow: options.slow === true,
    fail: options.fail === true,
    onPhaseChange: changePhase,
    onComplete: finish,
    onError: failSafely,
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.introActive = "true";
    releaseScrollRef.current = lockScroll(INTRO_SCROLL_LOCK_SOURCE);

    return () => releaseScroll();
  }, [lockScroll, releaseScroll]);

  useEffect(() => {
    const timeoutSeconds = options.slow ? 7.2 : introTiming.safetyTimeout;
    return createIntroSafetyTimer(skip, timeoutSeconds * 1000, window);
  }, [options.slow, skip]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [skip]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[var(--z-modal)] h-[100dvh] min-h-[100svh] overflow-hidden text-foreground"
      data-intro-overlay
      data-phase={phase}
      role="region"
      aria-label={dictionary.accessibleLabel}
    >
      <div
        data-intro-panel
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-background"
      />
      <div
        data-intro-panel
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[calc(50%+1px)] bg-background"
      />
      <div className="rv-intro-grain absolute inset-0 z-[1]" aria-hidden="true" />

      <p className="sr-only">{dictionary.accessibleLabel}</p>

      <div
        data-intro-content
        className="relative z-[2] flex h-full flex-col px-[var(--layout-gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:pb-8 sm:pt-7 lg:pb-10 lg:pt-9"
      >
        <div className="flex items-start justify-between gap-6">
          <p className="shrink font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            <span className="sm:hidden">RV / 001</span>
            <span className="hidden sm:inline">RAW.VIVES / SYSTEM 001</span>
          </p>
          <IntroSkipButton label={dictionary.skip} onSkip={skip} />
        </div>

        <div className="mt-5 sm:mt-8">
          <IntroMetadata dictionary={dictionary} />
        </div>

        <div className="flex flex-1 items-center py-8 sm:py-12">
          <IntroBrand dictionary={dictionary} />
        </div>

        <IntroProgress dictionary={dictionary} />
      </div>
    </div>
  );
}
