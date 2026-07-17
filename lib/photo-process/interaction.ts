export const PHOTO_PROCESS_DEFAULT_POSITION = 50;
export const PHOTO_PROCESS_KEYBOARD_STEP = 2;
export const PHOTO_PROCESS_LARGE_STEP = 10;

export function clampProcessPosition(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getProcessPositionForKey(key: string, current: number) {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  if (key === "ArrowLeft" || key === "ArrowDown") return clampProcessPosition(current - PHOTO_PROCESS_KEYBOARD_STEP);
  if (key === "ArrowRight" || key === "ArrowUp") return clampProcessPosition(current + PHOTO_PROCESS_KEYBOARD_STEP);
  if (key === "PageDown") return clampProcessPosition(current - PHOTO_PROCESS_LARGE_STEP);
  if (key === "PageUp") return clampProcessPosition(current + PHOTO_PROCESS_LARGE_STEP);
  return null;
}

export function getPointerIntent(deltaX: number, deltaY: number, threshold = 6) {
  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) return "pending" as const;
  return Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" as const : "vertical" as const;
}

export function getPositionFromPointer(clientX: number, left: number, width: number) {
  if (width <= 0) return PHOTO_PROCESS_DEFAULT_POSITION;
  return clampProcessPosition(((clientX - left) / width) * 100);
}

export type ProcessPointerState = {
  id: number;
  x: number;
  y: number;
  intent: "pending" | "horizontal" | "vertical";
};

export function beginProcessPointer(id: number, x: number, y: number): ProcessPointerState {
  return { id, x, y, intent: "pending" };
}

export function moveProcessPointer(state: ProcessPointerState | null, id: number, x: number, y: number) {
  if (!state || state.id !== id || state.intent !== "pending") return state;
  return { ...state, intent: getPointerIntent(x - state.x, y - state.y) };
}

export function finishProcessPointer(state: ProcessPointerState | null, id: number) {
  return state?.id === id ? null : state;
}
