// Adaptive quality for the hero 3D scene. Deterministic and conservative:
// capabilities only, no UA sniffing, no benchmarks. Missing APIs fall back
// to conservative defaults. Reduced motion is intentionally NOT a signal —
// the scene renders statically instead of disabling 3D.

export type HeroQualityTier = "high" | "medium" | "low" | "off";

export type HeroQualitySignals = {
  webgl: boolean;
  devicePixelRatio: number;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  coarsePointer: boolean;
  saveData: boolean;
};

export type HeroQualityProfile = {
  tier: HeroQualityTier;
  maxPixelRatio: number;
  maxFrames: number;
  scrollScale: number;
  driftScale: number;
};

const profiles: Record<HeroQualityTier, Omit<HeroQualityProfile, "tier">> = {
  high: { maxPixelRatio: 1.5, maxFrames: 4, scrollScale: 1, driftScale: 1 },
  medium: { maxPixelRatio: 1.25, maxFrames: 3, scrollScale: 0.7, driftScale: 0.6 },
  low: { maxPixelRatio: 1, maxFrames: 2, scrollScale: 0.25, driftScale: 0 },
  off: { maxPixelRatio: 1, maxFrames: 0, scrollScale: 0, driftScale: 0 },
};

export function resolveHeroQuality(signals: HeroQualitySignals): HeroQualityProfile {
  let tier: HeroQualityTier;
  if (!signals.webgl || signals.saveData) {
    tier = "off";
  } else if (
    (signals.deviceMemory !== null && signals.deviceMemory <= 2) ||
    signals.hardwareConcurrency <= 2
  ) {
    tier = "low";
  } else if (
    signals.coarsePointer &&
    (signals.deviceMemory === null || signals.deviceMemory <= 3) &&
    signals.hardwareConcurrency <= 4
  ) {
    tier = "low";
  } else if (
    signals.coarsePointer ||
    (signals.deviceMemory !== null && signals.deviceMemory <= 4) ||
    signals.hardwareConcurrency <= 6
  ) {
    tier = "medium";
  } else {
    tier = "high";
  }
  return { tier, ...profiles[tier] };
}

// Minimal WebGL probe. Safe to call in Node (no document): reports false.
export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

type NavigatorHints = {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
};

// Live signals for the current browser. Missing APIs degrade to the most
// conservative plausible value; safe to call in Node for tests.
export function readQualitySignals(): HeroQualitySignals {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      webgl: false,
      devicePixelRatio: 1,
      deviceMemory: null,
      hardwareConcurrency: 1,
      coarsePointer: false,
      saveData: false,
    };
  }
  const hints = navigator as Navigator & NavigatorHints;
  return {
    webgl: isWebGLAvailable(),
    devicePixelRatio: window.devicePixelRatio || 1,
    deviceMemory: hints.deviceMemory ?? null,
    hardwareConcurrency: hints.hardwareConcurrency || 1,
    coarsePointer:
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches,
    saveData: hints.connection?.saveData === true,
  };
}
