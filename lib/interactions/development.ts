import type { CursorContrast, CursorDebugSnapshot, CursorState } from "@/types/cursor";

export const INTERACTION_STATE_EVENT = "raw-vives:interaction-state";
export const INTERACTION_CONTROL_EVENT = "raw-vives:interaction-control";
export const INTERACTION_RESET_EVENT = "raw-vives:interaction-reset";
export const CURSOR_OVERRIDE_EVENT = "raw-vives:cursor-override";

export type CursorOverrideDetail = {
  active: boolean;
  state?: CursorState;
  contrast?: CursorContrast;
  label?: string;
  hideLabel?: boolean;
};

export type InteractionControlDetail = {
  state?: CursorState;
  contrast?: CursorContrast;
  disabled?: boolean;
  simulateTouch?: boolean;
  simulateReducedMotion?: boolean;
  edge?: "top-left" | "bottom-right" | null;
};

export function publishInteractionState(snapshot: CursorDebugSnapshot) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTERACTION_STATE_EVENT, { detail: snapshot }));
}

export function requestInteractionControl(detail: InteractionControlDetail) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTERACTION_CONTROL_EVENT, { detail }));
}

export function resetContextualCursor() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INTERACTION_RESET_EVENT));
}

export function setCursorOverride(detail: CursorOverrideDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CURSOR_OVERRIDE_EVENT, { detail }));
}
