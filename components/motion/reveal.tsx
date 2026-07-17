"use client";

import { useMotion } from "@/components/motion/motion-provider";
import {
  motionDistance,
  motionDuration,
  motionEase,
  shouldShowMotionMarkers,
} from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type RevealProps = {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  start?: string;
};

export function Reveal({
  as: Component = "div",
  children,
  className,
  delay = 0,
  distance = motionDistance.section,
  once = true,
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      if (prefersReducedMotion) {
        gsap.set(element, { clearProps: "opacity,transform" });
        return;
      }

      const clearWillChange = applyTemporaryWillChange(element);
      const tween = gsap.fromTo(
        element,
        { opacity: 0, y: isTouchDevice ? Math.min(distance, 14) : distance },
        {
          opacity: 1,
          y: 0,
          delay: isTouchDevice ? 0 : delay,
          duration: isTouchDevice ? motionDuration.normal : motionDuration.slow,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
          onComplete: clearWillChange,
          scrollTrigger: {
            trigger: element,
            start,
            once,
            markers: shouldShowMotionMarkers(),
          },
        },
      );

      return () => {
        clearWillChange();
        tween.kill();
      };
    },
    {
      dependencies: [delay, distance, isTouchDevice, once, prefersReducedMotion, start],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

export function StaggerGroup({
  as: Component = "div",
  children,
  className,
  selector = "[data-motion-item]",
}: RevealProps & { selector?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>(selector, root);
      if (!items.length || prefersReducedMotion) {
        gsap.set(items, { clearProps: "opacity,transform" });
        return;
      }

      const cleanups = items.map((item) => applyTemporaryWillChange(item));
      const tween = gsap.fromTo(
        items,
        { opacity: 0, y: isTouchDevice ? 8 : motionDistance.compact },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.normal,
          stagger: isTouchDevice ? 0.025 : 0.06,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
          onComplete: () => cleanups.forEach((cleanup) => cleanup()),
          scrollTrigger: {
            trigger: root,
            start: "top 90%",
            once: true,
            markers: shouldShowMotionMarkers(),
          },
        },
      );

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        tween.kill();
      };
    },
    {
      dependencies: [isTouchDevice, prefersReducedMotion, selector],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  return (
    <Component ref={ref} className={cn(className)}>
      {children}
    </Component>
  );
}

export function MaskReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  useGSAP(
    () => {
      const item = ref.current?.firstElementChild;
      if (!item || prefersReducedMotion) return;
      gsap.fromTo(
        item,
        { opacity: 0, yPercent: isTouchDevice ? 20 : 55 },
        {
          opacity: 1,
          yPercent: 0,
          duration: isTouchDevice ? motionDuration.normal : motionDuration.slow,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
            markers: shouldShowMotionMarkers(),
          },
        },
      );
    },
    {
      dependencies: [isTouchDevice, prefersReducedMotion],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
