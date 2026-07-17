export type CursorCapabilityInput = {
  enabled: boolean;
  hasFinePointer: boolean;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  userPrefersNative: boolean;
  initializationFailed?: boolean;
};

export function shouldEnableCursor(input: CursorCapabilityInput) {
  return input.enabled
    && input.hasFinePointer
    && input.hasHover
    && !input.prefersReducedMotion
    && !input.userPrefersNative
    && !input.initializationFailed;
}

export function isKeyboardNavigationKey(key: string) {
  return key === "Tab"
    || key === "ArrowLeft"
    || key === "ArrowRight"
    || key === "ArrowUp"
    || key === "ArrowDown"
    || key === "Home"
    || key === "End"
    || key === "PageUp"
    || key === "PageDown";
}

export function isFinePointerType(pointerType: string) {
  return pointerType === "mouse" || pointerType === "pen";
}
