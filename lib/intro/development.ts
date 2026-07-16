import type { IntroPhase } from "@/lib/intro/constants";
import type { Locale } from "@/types/dictionary";

export const INTRO_REPLAY_EVENT = "raw-vives:intro-replay";
export const INTRO_STATE_EVENT = "raw-vives:intro-state";

export type IntroPreviewOptions = {
  locale?: Locale;
  reducedMotion?: boolean;
  slow?: boolean;
  fail?: boolean;
};

export type IntroStateDetail = {
  phase: IntroPhase;
  locale: Locale;
  duration: number;
};

export function requestIntroReplay(options: IntroPreviewOptions = {}) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<IntroPreviewOptions>(INTRO_REPLAY_EVENT, { detail: options }));
}

export function reportIntroState(detail: IntroStateDetail) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<IntroStateDetail>(INTRO_STATE_EVENT, { detail }));
}
