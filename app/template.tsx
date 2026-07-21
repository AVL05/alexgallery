"use client";

import { useRef } from "react";
import { useMotion } from "@/components/motion/motion-provider";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { photoMotionTokens } from "@/lib/motion/photo-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: photoMotionTokens.route.fallbackDuration,
          ease: "power2.out",
          clearProps: "opacity",
        },
      );
    },
    { dependencies: [prefersReducedMotion], scope: containerRef, revertOnUpdate: true },
  );

  return <div ref={containerRef}>{children}</div>;
}
