import { cursorConfig } from "@/lib/interactions/config";

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function clampCursorPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
  cursorSize: number,
) {
  const inset = cursorSize / 2 + cursorConfig.viewportPadding;
  return {
    x: clamp(x, inset, Math.max(inset, viewportWidth - inset)),
    y: clamp(y, inset, Math.max(inset, viewportHeight - inset)),
  };
}

export function getMagneticOffset(
  pointer: number,
  center: number,
  strength: number = cursorConfig.magnetic.strength,
  maximum: number = cursorConfig.magnetic.maxOffset,
) {
  return clamp((pointer - center) * strength, -maximum, maximum);
}
