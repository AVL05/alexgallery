"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { usePhotoMotionRuntime } from "@/hooks/use-photo-motion-runtime";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getPhotoMotionProfile,
  consumePhotoTransition,
  hasPhotoRevealed,
  markPhotoRevealed,
  photoMotionTokens,
  type PhotoRevealVariant,
} from "@/lib/motion/photo-motion";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { motionMedia } from "@/lib/motion/config";

export function PhotoReveal({
  as: Component = "div",
  variant,
  children,
  className,
}: {
  as?: React.ElementType;
  variant: PhotoRevealVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Component
      className={cn("relative overflow-hidden", className)}
      data-photo-reveal={variant}
    >
      {children}
    </Component>
  );
}

function clearPhotoMotion(frames: HTMLElement[], copy: HTMLElement[]) {
  if (frames.length) gsap.set(frames, { clearProps: "clipPath,opacity,transform,willChange" });
  for (const frame of frames) {
    const media = frame.querySelector<HTMLElement>("[data-photo-motion-media],img");
    if (media) gsap.set(media, { clearProps: "opacity,transform,willChange" });
  }
  if (copy.length) gsap.set(copy, { clearProps: "opacity,transform,willChange" });
}

export function PhotoMotionGroup({
  as: Component = "div",
  children,
  className,
  groupKey,
  mode = "viewport",
  editorial = false,
  copySelector = "[data-photo-motion-copy]",
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  groupKey: string;
  mode?: "viewport" | "mount";
  editorial?: boolean;
  copySelector?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();
  const runtime = usePhotoMotionRuntime();
  const isDesktop = useMediaQuery(motionMedia.desktop);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (root.getClientRects().length === 0) return;
      const frames = gsap
        .utils.toArray<HTMLElement>("[data-photo-reveal]", root)
        .filter((frame) => frame.getClientRects().length > 0);
      const copy = gsap.utils.toArray<HTMLElement>(copySelector, root);
      const profile = getPhotoMotionProfile({
        reducedMotion: prefersReducedMotion,
        touch: isTouchDevice,
        intensity: runtime.mobileIntensity,
        enabled: runtime.enabled && runtime.gsap,
      });
      const detailMatch = /^photo-detail-(\d+)$/.exec(groupKey);
      if (detailMatch && consumePhotoTransition(Number(detailMatch[1]))) {
        markPhotoRevealed(groupKey);
      }
      const alreadyRevealed = runtime.revealOnce && hasPhotoRevealed(groupKey);

      if (!frames.length || profile.static || alreadyRevealed || (mode === "viewport" && !runtime.scrollTrigger)) {
        clearPhotoMotion(frames, copy);
        if (frames.length) markPhotoRevealed(groupKey);
        return;
      }

      const willChangeCleanups: Array<() => void> = [];
      frames.forEach((frame) => {
        const variant = frame.dataset.photoReveal as PhotoRevealVariant;
        const media = frame.querySelector<HTMLElement>("[data-photo-motion-media],img");
        willChangeCleanups.push(applyTemporaryWillChange(frame, "clip-path, opacity"));
        if (media) willChangeCleanups.push(applyTemporaryWillChange(media, "transform, opacity"));

        if (variant === "mask-up") {
          gsap.set(frame, { clipPath: "inset(100% 0 0 0)", opacity: 0.9 });
          if (media) gsap.set(media, { y: profile.distance, scale: profile.scale, opacity: 0.88 });
        } else if (variant === "mask-side") {
          gsap.set(frame, { clipPath: "inset(0 100% 0 0)", opacity: 0.92 });
          if (media) gsap.set(media, { x: -profile.distance, scale: profile.scale, opacity: 0.9 });
        } else {
          gsap.set(frame, { opacity: 0 });
          if (media) gsap.set(media, { y: profile.distance * 0.2, scale: profile.scale, opacity: 0.82 });
        }
      });
      copy.forEach((item) => {
        willChangeCleanups.push(applyTemporaryWillChange(item, "transform, opacity"));
        gsap.set(item, { opacity: 0, y: profile.distance * 0.55 });
      });

      const duration = editorial ? photoMotionTokens.editorial.duration : profile.duration;
      const timeline = gsap.timeline({
        paused: mode === "viewport",
        defaults: { ease: editorial ? photoMotionTokens.editorial.ease : photoMotionTokens.reveal.ease },
        onComplete: () => {
          markPhotoRevealed(groupKey);
          clearPhotoMotion(frames, copy);
          willChangeCleanups.forEach((cleanup) => cleanup());
        },
        scrollTrigger:
          mode === "viewport"
            ? {
                trigger: root,
                start: photoMotionTokens.reveal.threshold,
                once: runtime.revealOnce,
                onEnter: () => timeline.play(),
              }
            : undefined,
      });

      frames.forEach((frame, index) => {
        const media = frame.querySelector<HTMLElement>("[data-photo-motion-media],img");
        const position = editorial
          ? 0
          : Math.floor(index / 3) * duration * 0.82 + (index % 3) * profile.stagger;
        timeline.to(
          frame,
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration },
          position,
        );
        if (media) {
          timeline.to(media, { x: 0, y: 0, scale: 1, opacity: 1, duration }, position);
        }
      });

      if (copy.length) {
        timeline.to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: editorial ? 0.48 : profile.duration * 0.65,
            stagger: profile.stagger,
          },
          editorial ? photoMotionTokens.editorial.copyDelay : 0.16,
        );
      }

      if (mode === "mount") timeline.play();

      return () => {
        timeline.kill();
        willChangeCleanups.forEach((cleanup) => cleanup());
        clearPhotoMotion(frames, copy);
      };
    },
    {
      dependencies: [
        copySelector,
        editorial,
        groupKey,
        isDesktop,
        isTouchDevice,
        mode,
        prefersReducedMotion,
        runtime.enabled,
        runtime.gsap,
        runtime.mobileIntensity,
        runtime.revealOnce,
        runtime.scrollTrigger,
      ],
      scope: rootRef,
      revertOnUpdate: true,
    },
  );

  return (
    <Component ref={rootRef} className={className} data-photo-motion-group={groupKey}>
      {children}
    </Component>
  );
}
