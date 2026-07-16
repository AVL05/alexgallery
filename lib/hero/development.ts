export const HERO_PREVIEW_EVENT = "raw-vives:hero-preview";
export const HERO_STATE_EVENT = "raw-vives:hero-state";

export type HeroPreviewOptions = {
  reducedMotion?: boolean;
  slowImage?: boolean;
  failImage?: boolean;
  finalState?: boolean;
  source?: "intro-completed" | "intro-omitted" | "manual";
};

export type HeroStateDetail = HeroPreviewOptions & {
  phase: "waiting" | "playing" | "settled";
  imageState: "loading" | "loaded" | "fallback" | "failed";
  duration: number;
};

export function requestHeroPreview(options: HeroPreviewOptions = {}) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HERO_PREVIEW_EVENT, { detail: options }));
}

export function reportHeroState(detail: HeroStateDetail) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HERO_STATE_EVENT, { detail }));
}
