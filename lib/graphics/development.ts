import type { GraphicsDebugSnapshot } from "@/types/graphics";

export const GRAPHICS_STATE_EVENT = "raw-vives:graphics-state";
export const GRAPHICS_CONTROL_EVENT = "raw-vives:graphics-control";

export type GraphicsControlDetail = {
  enabled?: boolean;
  forceQuality?: "full" | "reduced";
  intensity?: number;
  simulateContextLoss?: boolean;
};

let latestGraphicsState: GraphicsDebugSnapshot | null = null;

export function publishGraphicsState(detail: GraphicsDebugSnapshot) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  latestGraphicsState = detail;
  window.dispatchEvent(new CustomEvent(GRAPHICS_STATE_EVENT, { detail }));
}

export function getLatestGraphicsState() {
  return latestGraphicsState;
}

export function requestGraphicsControl(detail: GraphicsControlDetail) {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GRAPHICS_CONTROL_EVENT, { detail }));
}
