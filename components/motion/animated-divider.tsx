"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { motionDuration, motionEase, shouldShowMotionMarkers } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function AnimatedDivider({ className }: { className?: string }) {
  const ref = useRef<HTMLHRElement>(null);
  const { prefersReducedMotion } = useMotion();

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion) return;
      gsap.fromTo(
        ref.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: motionDuration.slow,
          ease: motionEase.enter,
          clearProps: "transform",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 92%",
            once: true,
            markers: shouldShowMotionMarkers(),
          },
        },
      );
    },
    { dependencies: [prefersReducedMotion], scope: ref, revertOnUpdate: true },
  );

  return <hr ref={ref} className={cn("rv-divider", className)} />;
}
