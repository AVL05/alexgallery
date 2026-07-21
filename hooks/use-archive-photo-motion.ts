"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { usePhotoMotionRuntime } from "@/hooks/use-photo-motion-runtime";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import {
  getArchiveMotionPlan,
  photoMotionConfig,
  photoMotionTokens,
} from "@/lib/motion/photo-motion";
import type { RefObject } from "react";
import { useRef } from "react";

const seenArchiveIds = new Set<number>();

export function useArchivePhotoMotion({
  scope,
  collectionKey,
  visibleIds,
}: {
  scope: RefObject<HTMLElement | null>;
  collectionKey: string;
  visibleIds: number[];
}) {
  const previousCollectionKeyRef = useRef<string | undefined>(undefined);
  const { prefersReducedMotion } = useMotion();
  const runtime = usePhotoMotionRuntime();
  const idsKey = visibleIds.join("-");

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const items = new Map(
        [...root.querySelectorAll<HTMLElement>("[data-archive-item]")].map((item) => [
          Number(item.dataset.photoId),
          item,
        ]),
      );
      const plan = getArchiveMotionPlan({
        previousCollectionKey: previousCollectionKeyRef.current,
        collectionKey,
        visibleIds,
        seenIds: seenArchiveIds,
      });
      previousCollectionKeyRef.current = collectionKey;

      const showImmediately = () => {
        visibleIds.forEach((id) => seenArchiveIds.add(id));
        gsap.set([...items.values()], { clearProps: "opacity,transform,willChange" });
      };

      if (!runtime.enabled || !runtime.gsap || prefersReducedMotion) {
        showImmediately();
        return;
      }

      if (plan.mode === "filter") {
        showImmediately();
        const tween = gsap.fromTo(
          root,
          { opacity: 0.82 },
          {
            opacity: 1,
            duration: photoMotionTokens.route.fallbackDuration,
            ease: "power2.out",
            clearProps: "opacity",
          },
        );
        return () => tween.kill();
      }

      const targets = plan.animateIds
        .map((id) => items.get(id))
        .filter((item): item is HTMLElement => Boolean(item));
      if (!targets.length) return;

      if (typeof IntersectionObserver === "undefined") {
        showImmediately();
        return;
      }

      gsap.set(targets, { opacity: 0, scale: photoMotionTokens.reveal.scale, y: 5 });
      const tweens = new Set<gsap.core.Tween>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const first = entry.target as HTMLElement;
            const startIndex = targets.indexOf(first);
            const batch = targets.slice(startIndex, startIndex + photoMotionConfig.archiveBatchSize);
            batch.forEach((item) => seenArchiveIds.add(Number(item.dataset.photoId)));
            const tween = gsap.to(batch, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: photoMotionTokens.reveal.duration * 0.72,
              stagger: photoMotionTokens.reveal.stagger * 0.55,
              ease: photoMotionTokens.reveal.ease,
              clearProps: "opacity,transform,willChange",
              onComplete: () => tweens.delete(tween),
            });
            tweens.add(tween);
            observer.unobserve(first);
          }
        },
        { rootMargin: "0px 0px 12% 0px", threshold: 0.01 },
      );

      for (let index = 0; index < targets.length; index += photoMotionConfig.archiveBatchSize) {
        const target = targets[index];
        if (target) observer.observe(target);
      }

      return () => {
        observer.disconnect();
        tweens.forEach((tween) => tween.kill());
        gsap.set(targets, { clearProps: "opacity,transform,willChange" });
      };
    },
    {
      dependencies: [collectionKey, idsKey, prefersReducedMotion, runtime.enabled, runtime.gsap],
      scope,
      revertOnUpdate: true,
    },
  );
}

export function resetArchivePhotoMotionForTests() {
  seenArchiveIds.clear();
}
