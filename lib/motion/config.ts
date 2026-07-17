export const motionDuration = {
  instant: 0.01,
  fast: 0.18,
  normal: 0.42,
  slow: 0.72,
  cinematic: 1.05,
} as const;

export const motionEase = {
  standard: "power2.out",
  enter: "power3.out",
  exit: "power2.in",
  cinematic: "power4.inOut",
  linear: "none",
} as const;

export const motionDistance = {
  label: 8,
  compact: 16,
  section: 28,
  image: 36,
} as const;

export const motionStagger = {
  tight: 0.035,
  normal: 0.07,
  relaxed: 0.1,
} as const;

export const motionMedia = {
  reduced: "(prefers-reduced-motion: reduce)",
  touch: "(pointer: coarse)",
  finePointer: "(pointer: fine)",
  hover: "(hover: hover)",
  forcedColors: "(forced-colors: active)",
  desktop: "(min-width: 1024px)",
} as const;

export const lenisOptions = {
  duration: 1,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  anchors: { offset: -80 },
  autoRaf: false,
} as const;

export function shouldShowMotionMarkers() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("motion-markers") === "1";
}
