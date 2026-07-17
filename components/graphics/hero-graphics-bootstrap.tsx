"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { inspectBrowserGraphicsCapabilities } from "@/lib/graphics/capabilities";
import { graphicsConfig } from "@/lib/graphics/config";
import {
  GRAPHICS_CONTROL_EVENT,
  publishGraphicsState,
  type GraphicsControlDetail,
} from "@/lib/graphics/development";
import { getActiveGraphicsContextCount } from "@/lib/graphics/context-registry";
import type { GraphicsDecision } from "@/types/graphics";
import type { OptimizedImageData } from "@/types/photo";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroWebglEffect = dynamic(
  () => import("@/components/graphics/hero-webgl-effect").then((module) => module.HeroWebglEffect),
  { ssr: false, loading: () => null },
);

export function HeroGraphicsBootstrap({
  image,
  imageReady,
  entryReady,
}: {
  image: OptimizedImageData;
  imageReady: boolean;
  entryReady: boolean;
}) {
  const { prefersReducedMotion, hasFinePointer, hasHover, isTouchDevice, isScrollLocked } = useMotion();
  const [decision, setDecision] = useState<GraphicsDecision | null>(null);
  const [enabled, setEnabled] = useState<boolean>(graphicsConfig.enabled);

  useEffect(() => {
    if (!imageReady || !entryReady || !enabled) return;
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setDecision(inspectBrowserGraphicsCapabilities({
      prefersReducedMotion,
      hasFinePointer,
      hasHover,
      hasCoarsePointer,
      hasTouch: isTouchDevice,
    }));
  }, [enabled, entryReady, hasFinePointer, hasHover, imageReady, isTouchDevice, prefersReducedMotion]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handleControl = (event: Event) => {
      const detail = (event as CustomEvent<GraphicsControlDetail>).detail;
      if (typeof detail.enabled === "boolean") setEnabled(detail.enabled);
      if (detail.forceQuality) {
        setDecision((current) => current ? { ...current, quality: detail.forceQuality!, reason: "debug-override" } : current);
      }
    };
    window.addEventListener(GRAPHICS_CONTROL_EVENT, handleControl);
    return () => window.removeEventListener(GRAPHICS_CONTROL_EVENT, handleControl);
  }, []);

  useEffect(() => {
    if (!decision || decision.quality !== "disabled") return;
    const capability = decision.capabilities;
    publishGraphicsState({
      status: "fallback",
      quality: "disabled",
      reason: decision.reason,
      renderer: "none",
      webgl: capability.webgl,
      webgl2: capability.webgl2,
      webgpu: capability.webgpu,
      dpr: 0,
      fps: 0,
      frames: 0,
      drawCalls: 0,
      triangles: 0,
      textureLoaded: false,
      imageSource: image.src,
      visible: true,
      overlayOpen: isScrollLocked,
      contextLost: false,
      activeContexts: getActiveGraphicsContextCount(),
      hasFinePointer: capability.hasFinePointer,
      hasHover: capability.hasHover,
      hasTouch: capability.hasTouch,
      prefersReducedMotion: capability.prefersReducedMotion,
      saveData: capability.saveData,
      deviceMemory: capability.deviceMemory,
      hardwareConcurrency: capability.hardwareConcurrency,
      viewport: `${capability.viewportWidth}x${capability.viewportHeight}`,
    });
  }, [decision, image.src, isScrollLocked]);

  if (!enabled || !decision || decision.quality === "disabled") return null;
  return <HeroWebglEffect image={image} decision={decision} overlayOpen={isScrollLocked} />;
}
