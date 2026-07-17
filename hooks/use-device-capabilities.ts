"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { motionMedia } from "@/lib/motion/config";

export function useDeviceCapabilities() {
  const hasCoarsePointer = useMediaQuery(motionMedia.touch);
  const hasFinePointer = useMediaQuery(motionMedia.finePointer);
  const hasHover = useMediaQuery(motionMedia.hover);
  const forcedColors = useMediaQuery(motionMedia.forcedColors);

  const hasTouchPoints =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  return {
    hasCoarsePointer,
    hasFinePointer,
    hasHover,
    forcedColors,
    isTouchDevice: hasCoarsePointer || hasTouchPoints,
  };
}
