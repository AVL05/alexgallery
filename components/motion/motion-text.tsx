"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { motionDistance, motionDuration, motionEase } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";

export function MotionText({
  text,
  as: Component = "span",
  className,
  mode = "word",
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  mode?: "word" | "line";
}) {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();
  const segments = useMemo(
    () => (mode === "line" ? text.split("\n") : text.split(/(\s+)/)),
    [mode, text],
  );

  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLElement>("[data-motion-text]");
      if (!items?.length || prefersReducedMotion) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: isTouchDevice ? 6 : motionDistance.label },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.normal,
          stagger: isTouchDevice ? 0.015 : 0.035,
          ease: motionEase.enter,
          clearProps: "opacity,transform",
        },
      );
    },
    {
      dependencies: [isTouchDevice, mode, prefersReducedMotion, text],
      scope: ref,
      revertOnUpdate: true,
    },
  );

  return (
    <Component ref={ref} className={cn(className)} aria-label={text}>
      {segments.map((segment, index) =>
        /^\s+$/.test(segment) ? (
          segment
        ) : (
          <span
            key={`${segment}-${index}`}
            aria-hidden="true"
            data-motion-text
            className={mode === "line" ? "block" : "inline-block"}
          >
            {segment}
          </span>
        ),
      )}
    </Component>
  );
}
