"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDistance, motionDuration, motionEase } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: motionDistance.compact },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.normal,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [prefersReducedMotion], scope: containerRef, revertOnUpdate: true },
  );

  return <div ref={containerRef}>{children}</div>;
}
