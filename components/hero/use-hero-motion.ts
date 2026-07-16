"use client";

import { getHeroMotionProfile } from "@/lib/hero/config";
import { motionEase, motionStagger } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import type { RefObject } from "react";

export function useHeroMotion({
  scope,
  entryReady,
  replayKey,
  prefersReducedMotion,
  isTouchDevice,
  forceReducedMotion,
  finalState,
  onPhaseChange,
}: {
  scope: RefObject<HTMLElement | null>;
  entryReady: boolean;
  replayKey: number;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  forceReducedMotion: boolean;
  finalState: boolean;
  onPhaseChange: (phase: "waiting" | "playing" | "settled", duration: number) => void;
}) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !entryReady) {
        onPhaseChange("waiting", 0);
        return;
      }

      const titleLines = gsap.utils.toArray<HTMLElement>("[data-hero-title-line]", root);
      const secondary = gsap.utils.toArray<HTMLElement>("[data-hero-secondary]", root);
      const entryMedia = root.querySelector<HTMLElement>("[data-hero-entry-media]");
      const scrollMedia = root.querySelector<HTMLElement>("[data-hero-scroll-media]");
      const content = root.querySelector<HTMLElement>("[data-hero-content]");
      const overlay = root.querySelector<HTMLElement>("[data-hero-overlay]");
      if (!entryMedia || !scrollMedia || !content || !overlay || titleLines.length === 0) {
        onPhaseChange("settled", 0);
        return;
      }

      const effectiveReducedMotion = prefersReducedMotion || forceReducedMotion;
      const profile = getHeroMotionProfile({
        reducedMotion: effectiveReducedMotion,
        isTouchDevice,
      });
      const animatedElements = [entryMedia, ...titleLines, ...secondary];

      if (effectiveReducedMotion || finalState) {
        gsap.set(animatedElements, { clearProps: "opacity,visibility,transform" });
        onPhaseChange("settled", 0);
        return;
      }

      const restoreWillChange = [
        applyTemporaryWillChange(entryMedia, "transform, opacity"),
        ...titleLines.map((line) => applyTemporaryWillChange(line, "transform")),
      ];

      gsap.set(entryMedia, { autoAlpha: 0.84, scale: profile.mediaScale });
      gsap.set(titleLines, { yPercent: 112 });
      gsap.set(secondary, { autoAlpha: 0, y: profile.entryDistance });
      onPhaseChange("playing", profile.entryDuration);

      const entryTimeline = gsap.timeline({
        defaults: { ease: motionEase.enter },
        onComplete: () => {
          restoreWillChange.forEach((restore) => restore());
          onPhaseChange("settled", profile.entryDuration);
        },
      });

      entryTimeline
        .to(entryMedia, { autoAlpha: 1, scale: 1, duration: profile.entryDuration }, 0)
        .to(titleLines, { yPercent: 0, duration: profile.entryDuration * 0.66, stagger: motionStagger.normal }, 0.12)
        .to(secondary, { autoAlpha: 1, y: 0, duration: profile.entryDuration * 0.48, stagger: motionStagger.tight }, 0.32);

      const scrollTimeline = profile.scrollMotionEnabled
        ? gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.65,
            },
          })
            .to(scrollMedia, { scale: 1.025, yPercent: 1.8, ease: "none" }, 0)
            .to(content, { y: -22, ease: "none" }, 0)
            .to(overlay, { opacity: 1, ease: "none" }, 0)
        : null;

      return () => {
        entryTimeline.kill();
        scrollTimeline?.kill();
        restoreWillChange.forEach((restore) => restore());
      };
    },
    {
      scope,
      dependencies: [
        entryReady,
        finalState,
        forceReducedMotion,
        isTouchDevice,
        prefersReducedMotion,
        replayKey,
      ],
      revertOnUpdate: true,
    },
  );
}
