"use client";

import { useMotion } from "@/components/motion/motion-provider";
import {
  motionDistance,
  motionDuration,
  motionEase,
  motionStagger,
} from "@/lib/motion/config";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";

export function useBatchReveal(
  scope: React.RefObject<HTMLElement | null>,
  selector: string,
  dependency: unknown,
) {
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const targets = gsap.utils.toArray<HTMLElement>(selector, root);

      if (!targets.length || prefersReducedMotion) {
        gsap.set(targets, { clearProps: "opacity,transform,visibility" });
        return;
      }

      gsap.set(targets, {
        autoAlpha: 0,
        y: isTouchDevice ? 10 : motionDistance.section,
      });

      const triggers = ScrollTrigger.batch(targets, {
        start: "top 92%",
        once: true,
        interval: 0.08,
        batchMax: () => (isTouchDevice ? 2 : 4),
        onEnter: (batch) => {
          const cleanups = batch.map((target) =>
            applyTemporaryWillChange(target as HTMLElement),
          );
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: isTouchDevice ? motionDuration.normal : motionDuration.slow,
            stagger: isTouchDevice ? motionStagger.tight : motionStagger.normal,
            ease: motionEase.enter,
            overwrite: true,
            clearProps: "opacity,transform,visibility",
            onComplete: () => cleanups.forEach((cleanup) => cleanup()),
          });
        },
      });

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    {
      dependencies: [dependency, isTouchDevice, prefersReducedMotion, selector],
      scope,
      revertOnUpdate: true,
    },
  );
}
