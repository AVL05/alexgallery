"use client";

import { getHeroMotionProfile } from "@/lib/hero/config";
import { motionEase } from "@/lib/motion/config";
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

      const entryMedia = root.querySelector<HTMLElement>("[data-hero-entry-media]");
      const screen = root.querySelector<HTMLElement>("[data-hero-screen]");
      const entryImage = entryMedia?.querySelector<HTMLElement>("img") ?? null;
      if (!entryMedia) {
        onPhaseChange("settled", 0);
        return;
      }

      const effectiveReducedMotion = prefersReducedMotion || forceReducedMotion;
      const profile = getHeroMotionProfile({
        reducedMotion: effectiveReducedMotion,
        isTouchDevice,
      });
      const animatedElements = [entryMedia, screen, entryImage].filter((element): element is HTMLElement => element !== null);

      // A tab opened in the background has no animation frames to play the
      // opening with; show the settled projection instead of a dark slit.
      if (effectiveReducedMotion || finalState || document.hidden) {
        gsap.set(animatedElements, { clearProps: "opacity,visibility,transform,clipPath" });
        onPhaseChange("settled", 0);
        return;
      }

      const restoreWillChange = [applyTemporaryWillChange(entryMedia, "opacity")];

      // Projector warm-up: a slit of light opens into the full screen. Only the
      // photograph takes part; the author's title, the label and the actions are
      // part of the first paint and never wait on the timeline.
      gsap.set(entryMedia, { opacity: 0 });
      if (screen) gsap.set(screen, { clipPath: "inset(49.6% 0% 49.6% 0%)" });
      if (entryImage) gsap.set(entryImage, { scale: 1.06 });
      onPhaseChange("playing", profile.entryDuration);

      const entryTimeline = gsap.timeline({
        defaults: { ease: motionEase.enter },
        onComplete: () => {
          window.clearTimeout(failSafe);
          restoreWillChange.forEach((restore) => restore());
          onPhaseChange("settled", profile.entryDuration);
        },
      });

      entryTimeline
        .to(entryMedia, { opacity: 1, duration: profile.entryDuration * 0.35 }, 0)
        .to(screen, { clipPath: "inset(0% 0% 0% 0%)", duration: profile.entryDuration, ease: motionEase.cinematic, clearProps: "clipPath" }, 0.08)
        .to(entryImage, { scale: 1, duration: profile.entryDuration * 1.2, ease: motionEase.enter, clearProps: "transform" }, 0.08);

      // If frames stall (busy main thread, tab hidden mid-play), never leave the
      // photograph closed: jump to the final state shortly after the planned end.
      const failSafe = window.setTimeout(() => entryTimeline.progress(1), (entryTimeline.duration() + 1) * 1000);

      return () => {
        window.clearTimeout(failSafe);
        entryTimeline.kill();
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
