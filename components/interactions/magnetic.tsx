"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { isFinePointerType } from "@/lib/interactions/capabilities";
import { cursorConfig } from "@/lib/interactions/config";
import { getMagneticOffset } from "@/lib/interactions/geometry";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { applyTemporaryWillChange } from "@/lib/motion/will-change";
import { Slot } from "@radix-ui/react-slot";
import type React from "react";
import { useRef } from "react";

export function Magnetic({
  children,
  disabled = false,
  strength = cursorConfig.magnetic.strength,
  maxOffset = cursorConfig.magnetic.maxOffset,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  strength?: number;
  maxOffset?: number;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const restoreWillChangeRef = useRef<(() => void) | null>(null);
  const restoreCallRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);
  const xToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const scaleToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const { hasFinePointer, hasHover, prefersReducedMotion } = useMotion();
  const enabled = cursorConfig.magnetic.enabled
    && !disabled
    && hasFinePointer
    && hasHover
    && !prefersReducedMotion;

  useGSAP(() => () => {
    restoreCallRef.current?.kill();
    if (contentRef.current) gsap.killTweensOf(contentRef.current);
    restoreWillChangeRef.current?.();
  }, { scope: rootRef });

  const restore = () => {
    xToRef.current?.(0);
    yToRef.current?.(0);
    scaleToRef.current?.(1);
    boundsRef.current = null;
    restoreCallRef.current?.kill();
    restoreCallRef.current = gsap.delayedCall(cursorConfig.magnetic.duration, () => {
      restoreWillChangeRef.current?.();
      restoreWillChangeRef.current = null;
    });
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    if (!enabled || !isFinePointerType(event.pointerType)) return;
    const content = event.currentTarget.querySelector<HTMLElement>("[data-magnetic-content]");
    if (!content) return;
    contentRef.current = content;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
    restoreCallRef.current?.kill();
    restoreWillChangeRef.current?.();
    restoreWillChangeRef.current = applyTemporaryWillChange(content, "transform");
    xToRef.current = gsap.quickTo(content, "x", { duration: cursorConfig.magnetic.duration, ease: "power2.out" });
    yToRef.current = gsap.quickTo(content, "y", { duration: cursorConfig.magnetic.duration, ease: "power2.out" });
    scaleToRef.current = gsap.quickTo(content, "scale", { duration: cursorConfig.magnetic.duration, ease: "power2.out" });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = boundsRef.current;
    if (!enabled || !bounds || !isFinePointerType(event.pointerType)) return;
    xToRef.current?.(getMagneticOffset(event.clientX, bounds.left + bounds.width / 2, strength, maxOffset));
    yToRef.current?.(getMagneticOffset(event.clientY, bounds.top + bounds.height / 2, strength, maxOffset));
    scaleToRef.current?.(cursorConfig.magnetic.scale);
  };

  return (
    <Slot
      ref={rootRef}
      data-magnetic={enabled ? "true" : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={restore}
      onPointerCancel={restore}
      onBlur={restore}
    >
      {children}
    </Slot>
  );
}
