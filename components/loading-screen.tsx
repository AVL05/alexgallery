"use client";

import { useEffect, useState, useRef } from "react";
import { useImagePreloader } from "@/hooks/use-image-preloader";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const HERO_IMAGES = [
  "/photos/optimized/original/14.webp",
  "/photos/optimized/original/46.webp",
  "/photos/optimized/original/1.webp",
  "/photos/optimized/original/3.webp",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { progress, allLoaded } = useImagePreloader(HERO_IMAGES);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Entrance animations on mount
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(".entrance-up", { opacity: 1, y: 0 });
        gsap.set('[data-corner="h"]', { scaleX: 1 });
        gsap.set('[data-corner="v"]', { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        ".entrance-up",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 },
      );

      gsap.fromTo(
        '[data-corner="h"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
        },
      );

      gsap.fromTo(
        '[data-corner="v"]',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.25,
        },
      );
    },
    { scope: containerRef },
  );

  // Exit animation when all images are loaded
  useGSAP(
    () => {
      if (allLoaded) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          setIsVisible(false);
          onComplete();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          },
        });

        tl.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
          delay: 0.5,
        });
      }
    },
    { dependencies: [allLoaded], scope: containerRef },
  );

  // Progress bar and logo fill animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: "power2.out",
      });
    }

  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center overflow-hidden bg-background"
      aria-label="raw.vives — System Initializing"
    >
      <div className="relative flex w-full max-w-xl flex-col px-6 sm:px-10">
        <div className="entrance-up mb-16 space-y-4 opacity-0 sm:mb-20">
          <p className="rv-kicker">Visual Archive</p>
          <p className="font-serif text-[clamp(3.25rem,14vw,7rem)] leading-[0.9] tracking-[-0.05em] text-foreground">
            raw.vives
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            by Alex Vicente
          </p>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div
            className="relative h-px w-full overflow-hidden bg-[var(--color-border)]"
            role="progressbar"
            aria-label="System Initializing"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progress)}
          >
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 bg-accent"
              style={{ width: "0%" }}
            />
          </div>

          <div className="flex w-full items-baseline justify-between">
            <span className="rv-meta">
              System Initializing
            </span>
            <span className="font-mono text-xl tabular-nums text-[var(--color-text-muted)]">
              {Math.floor(progress).toString().padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-6 opacity-50 sm:inset-10">
        <div
          data-corner="h"
          className="absolute left-0 top-0 h-px w-10 origin-left scale-x-0 bg-accent"
        />
        <div
          data-corner="v"
          className="absolute left-0 top-0 h-10 w-px origin-top scale-y-0 bg-accent"
        />
        <div
          data-corner="h"
          className="absolute bottom-0 right-0 h-px w-10 origin-right scale-x-0 bg-accent"
        />
        <div
          data-corner="v"
          className="absolute bottom-0 right-0 h-10 w-px origin-bottom scale-y-0 bg-accent"
        />
      </div>
    </div>
  );
}
