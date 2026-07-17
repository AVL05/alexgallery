export const graphicsConfig = {
  enabled: true,
  debugQuery: "motion-debug",
  textureTimeoutMs: 8_000,
  quality: {
    full: { dpr: 1.5, segmentsX: 24, segmentsY: 16, pointerIntensity: 0.012, scrollIntensity: 0.006 },
    reduced: { dpr: 1, segmentsX: 12, segmentsY: 8, pointerIntensity: 0.007, scrollIntensity: 0.0035 },
  },
  pointer: { damping: 0.12, radius: 0.34, settleEpsilon: 0.00035 },
  scroll: { damping: 0.1, settleEpsilon: 0.00025 },
  fadeDurationMs: 320,
  intersectionMargin: "120px 0px",
} as const;

