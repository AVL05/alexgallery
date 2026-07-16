"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { motionMedia } from "@/lib/motion/config";

export function useReducedMotion() {
  return useMediaQuery(motionMedia.reduced);
}
