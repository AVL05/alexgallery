"use client";

import { introTiming, type IntroPhase } from "@/lib/intro/constants";
import { motionEase } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { useCallback, useEffect, useRef, type RefObject } from "react";

type IntroSequenceOptions = {
  scope: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  slow: boolean;
  fail: boolean;
  onPhaseChange: (phase: IntroPhase) => void;
  onComplete: (phase: "completed" | "skipped") => void;
  onError: () => void;
};

export function useIntroSequence({
  scope,
  reducedMotion,
  slow,
  fail,
  onPhaseChange,
  onComplete,
  onError,
}: IntroSequenceOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitingRef = useRef(false);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) {
        onError();
        return;
      }

      const content = root.querySelector<HTMLElement>("[data-intro-content]");
      const metadata = root.querySelector<HTMLElement>("[data-intro-meta]");
      const brand = root.querySelector<HTMLElement>("[data-intro-brand]");
      const descriptor = root.querySelector<HTMLElement>("[data-intro-descriptor]");
      const progress = root.querySelector<HTMLElement>("[data-intro-progress]");
      const progressLine = root.querySelector<HTMLElement>("[data-intro-progress-line]");
      const counter = root.querySelector<HTMLElement>("[data-intro-counter]");
      const initializing = root.querySelector<HTMLElement>("[data-intro-initializing]");
      const ready = root.querySelector<HTMLElement>("[data-intro-ready]");
      const panels = gsap.utils.toArray<HTMLElement>("[data-intro-panel]", root);

      if (!content || !metadata || !brand || !descriptor || !progress || !progressLine || !counter || !initializing || !ready || panels.length !== 2) {
        onError();
        return;
      }

      if (fail) {
        gsap.delayedCall(0.05, onError);
        return;
      }

      const restoreWillChange = [
        applyTemporaryWillChange(brand, "transform, opacity"),
        ...panels.map((panel) => applyTemporaryWillChange(panel, "transform")),
      ];

      if (reducedMotion) {
        gsap.set([metadata, brand, descriptor, progress], { clearProps: "all" });
        gsap.set(progressLine, { scaleX: 1 });
        counter.textContent = "100";
        gsap.set(initializing, { autoAlpha: 0 });
        gsap.set(ready, { autoAlpha: 1 });
        const reducedCall = gsap.delayedCall(introTiming.reduced, () => onComplete("completed"));
        return () => {
          reducedCall.kill();
          restoreWillChange.forEach((restore) => restore());
        };
      }

      const progressValue = { value: 0 };
      const updateProgress = () => {
        counter.textContent = Math.round(progressValue.value).toString().padStart(3, "0");
      };

      gsap.set(metadata, { autoAlpha: 0, y: 8 });
      gsap.set(brand, { autoAlpha: 0, y: 24 });
      gsap.set(descriptor, { autoAlpha: 0, y: 8 });
      gsap.set(progress, { autoAlpha: 0 });
      gsap.set(progressLine, { scaleX: 0 });
      gsap.set(ready, { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: motionEase.enter },
        onComplete: () => onComplete("completed"),
      });

      timelineRef.current = timeline;
      onPhaseChange("playing");

      timeline
        .to(metadata, { autoAlpha: 1, y: 0, duration: 0.32 }, 0.05)
        .to(progress, { autoAlpha: 1, duration: 0.28 }, 0.12)
        .to(
          progressValue,
          { value: 72, duration: 1.15, ease: "power1.out", onUpdate: updateProgress },
          0.16,
        )
        .to(progressLine, { scaleX: 0.72, duration: 1.15, ease: "power1.out" }, 0.16)
        .to(brand, { autoAlpha: 1, y: 0, duration: 0.68 }, 0.38)
        .to(descriptor, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.68)
        .to(
          progressValue,
          { value: 100, duration: 0.44, ease: "power2.inOut", onUpdate: updateProgress },
          1.31,
        )
        .to(progressLine, { scaleX: 1, duration: 0.44, ease: "power2.inOut" }, 1.31)
        .to(initializing, { autoAlpha: 0, duration: 0.18 }, 1.48)
        .to(ready, { autoAlpha: 1, duration: 0.24 }, 1.56)
        .call(() => onPhaseChange("exiting"), [], 1.92)
        .to(content, { autoAlpha: 0, y: -10, duration: 0.26, ease: motionEase.exit }, 1.92)
        .to(
          panels[0],
          { yPercent: -101, duration: 0.62, ease: motionEase.cinematic },
          2.02,
        )
        .to(
          panels[1],
          { yPercent: 101, duration: 0.62, ease: motionEase.cinematic },
          2.02,
        );

      if (slow) timeline.timeScale(0.48);

      return () => {
        timeline.kill();
        timelineRef.current = null;
        restoreWillChange.forEach((restore) => restore());
      };
    },
    {
      scope,
      dependencies: [fail, reducedMotion, slow],
      revertOnUpdate: true,
    },
  );

  const skip = useCallback(() => {
    const root = scope.current;
    if (!root || exitingRef.current) return;

    exitingRef.current = true;
    onPhaseChange("exiting");
    timelineRef.current?.kill();
    exitTimelineRef.current?.kill();

    const content = root.querySelector<HTMLElement>("[data-intro-content]");
    const panels = gsap.utils.toArray<HTMLElement>("[data-intro-panel]", root);
    const counter = root.querySelector<HTMLElement>("[data-intro-counter]");
    const progressLine = root.querySelector<HTMLElement>("[data-intro-progress-line]");

    if (!content || panels.length !== 2) {
      onComplete("skipped");
      return;
    }

    if (counter) counter.textContent = "100";
    if (progressLine) gsap.set(progressLine, { scaleX: 1 });

    exitTimelineRef.current = gsap
      .timeline({ onComplete: () => onComplete("skipped") })
      .to(content, { autoAlpha: 0, duration: 0.12, ease: motionEase.exit }, 0)
      .to(
        panels[0],
        { yPercent: -101, duration: introTiming.skip, ease: motionEase.cinematic },
        0,
      )
      .to(
        panels[1],
        { yPercent: 101, duration: introTiming.skip, ease: motionEase.cinematic },
        0,
      );
  }, [onComplete, onPhaseChange, scope]);

  useEffect(
    () => () => {
      timelineRef.current?.kill();
      exitTimelineRef.current?.kill();
      timelineRef.current = null;
      exitTimelineRef.current = null;
    },
    [],
  );

  return skip;
}
