export const INTRO_STORAGE_KEY = "raw-vives:intro-seen";
export const INTRO_SCROLL_LOCK_SOURCE = "raw-vives-intro";

export const introTiming = {
  normal: 2.64,
  skip: 0.32,
  reduced: 0.2,
  safetyTimeout: 3.4,
} as const;

export type IntroPhase =
  | "checking"
  | "playing"
  | "exiting"
  | "completed"
  | "skipped";

export function isLocalizedHomePath(pathname: string) {
  return /^\/(es|en)\/?$/.test(pathname);
}
