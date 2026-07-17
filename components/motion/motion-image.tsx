"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { motionDuration, motionEase, shouldShowMotionMarkers } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useRef, useState } from "react";

export function MotionImage({
  className,
  frameClassName,
  style,
  onLoad,
  ...props
}: ImageProps & { frameClassName?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { prefersReducedMotion, isTouchDevice, refreshScrollTriggers } = useMotion();

  useGSAP(
    () => {
      const image = imageRef.current;
      if (!loaded || !image || prefersReducedMotion) return;
      const clearWillChange = applyTemporaryWillChange(image);
      const tween = gsap.fromTo(
        image,
        { opacity: 0, scale: isTouchDevice ? 1 : 1.025 },
        {
          opacity: 1,
          scale: 1,
          duration: isTouchDevice ? motionDuration.normal : motionDuration.slow,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
          onComplete: clearWillChange,
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top 90%",
            once: true,
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
      dependencies: [isTouchDevice, loaded, prefersReducedMotion],
      scope: frameRef,
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={frameRef}
      className={cn("relative overflow-hidden bg-[var(--color-surface)]", frameClassName)}
      style={style}
    >
      <Image
        ref={imageRef}
        className={className}
        onLoad={(event) => {
          setLoaded(true);
          refreshScrollTriggers();
          onLoad?.(event);
        }}
        {...props}
      />
    </div>
  );
}
