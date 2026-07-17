import type {
  CursorContrast,
  CursorState,
  CursorTarget,
  CursorTargetDescriptor,
} from "@/types/cursor";

const nativeCursorSelector = [
  "textarea",
  "select",
  "iframe",
  "[contenteditable='true']",
  "[data-native-cursor]",
  ":disabled",
  "[aria-disabled='true']",
  "[aria-busy='true']",
  "[data-cursor-loading='true']",
  "input:not([type='range']):not([type='button']):not([type='submit']):not([type='reset'])",
].join(",");

const cursorStates = new Set<CursorState>([
  "default", "view", "open", "drag", "next", "previous", "close",
  "fullscreen", "compare", "explore",
]);

const contrasts = new Set<CursorContrast>(["default", "light", "dark"]);

export function getCursorTargetAttributes({
  type,
  label,
  contrast = "default",
  priority = 0,
  preview,
  disabled,
}: {
  type: CursorState;
  label?: string;
  contrast?: CursorContrast;
  priority?: number;
  preview?: string;
  disabled?: boolean;
}) {
  return {
    "data-cursor": type,
    "data-cursor-label": label,
    "data-cursor-contrast": contrast,
    "data-cursor-priority": priority || undefined,
    "data-cursor-preview": preview,
    "data-cursor-disabled": disabled ? "true" : undefined,
  } as const;
}

export function selectCursorTarget(descriptors: CursorTargetDescriptor[]) {
  const available = descriptors.filter((descriptor) => !descriptor.disabled && !descriptor.loading);
  if (available.length === 0) return null;
  return available.reduce((selected, candidate) => {
    if (candidate.priority > selected.priority) return candidate;
    if (candidate.priority === selected.priority && candidate.depth < selected.depth) return candidate;
    return selected;
  });
}

export function shouldUseNativeCursor(element: Element | null) {
  return Boolean(element?.closest(nativeCursorSelector));
}

export function resolveCursorTarget(element: Element | null): CursorTarget | null {
  const descriptors: Array<CursorTargetDescriptor & { element: Element }> = [];
  let current = element;
  let depth = 0;

  while (current && current !== document.documentElement) {
    const value = current.getAttribute("data-cursor") as CursorState | null;
    if (value && cursorStates.has(value)) {
      const contrastValue = current.getAttribute("data-cursor-contrast") as CursorContrast | null;
      descriptors.push({
        element: current,
        type: value,
        label: current.getAttribute("data-cursor-label") || undefined,
        contrast: contrastValue && contrasts.has(contrastValue) ? contrastValue : "default",
        priority: Number(current.getAttribute("data-cursor-priority")) || 0,
        depth,
        disabled: current.matches(":disabled")
          || current.getAttribute("aria-disabled") === "true"
          || current.getAttribute("data-cursor-disabled") === "true",
        loading: current.getAttribute("aria-busy") === "true"
          || current.getAttribute("data-cursor-loading") === "true",
        preview: current.getAttribute("data-cursor-preview") || undefined,
      });
    }
    current = current.parentElement;
    depth += 1;
  }

  const selected = selectCursorTarget(descriptors);
  if (!selected) return null;
  const match = descriptors.find((descriptor) => descriptor === selected);
  return match ? { ...match, element: match.element } : null;
}
