import type { CursorState } from "@/types/cursor";

export const cursorConfig = {
  enabled: true,
  disableQuery: "native-cursor",
  debugQuery: "motion-debug",
  followDuration: 0.12,
  followEase: "power2.out",
  labelDelay: 0,
  previewEnabled: false,
  reducedMotionStrategy: "native" as const,
  viewportPadding: 8,
  sizes: {
    default: 18,
    compact: 58,
    label: 76,
  },
  magnetic: {
    enabled: true,
    strength: 0.12,
    maxOffset: 8,
    scale: 1.02,
    duration: 0.18,
  },
} as const;

const compactStates = new Set<CursorState>(["close", "next", "previous"]);

export function getCursorSize(state: CursorState) {
  if (state === "default") return cursorConfig.sizes.default;
  if (compactStates.has(state)) return cursorConfig.sizes.compact;
  return cursorConfig.sizes.label;
}
