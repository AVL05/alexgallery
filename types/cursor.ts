export type CursorState =
  | "default"
  | "view"
  | "open"
  | "drag"
  | "next"
  | "previous"
  | "close"
  | "fullscreen"
  | "compare"
  | "explore";

export type CursorContrast = "default" | "light" | "dark";
export type InputModality = "keyboard" | "pointer" | "touch" | "unknown";

export type CursorTargetDescriptor = {
  type: CursorState;
  label?: string;
  contrast: CursorContrast;
  priority: number;
  depth: number;
  disabled: boolean;
  loading: boolean;
  preview?: string;
};

export type CursorTarget = CursorTargetDescriptor & {
  element: Element | null;
};

export type CursorDebugSnapshot = {
  mounted: boolean;
  eligible: boolean;
  enabled: boolean;
  visible: boolean;
  modality: InputModality;
  state: CursorState;
  label: string;
  contrast: CursorContrast;
  preview: string | null;
  globalPointerListeners: number;
  magneticEnabled: boolean;
  simulatedTouch: boolean;
  simulatedReducedMotion: boolean;
  position: { x: number; y: number };
  overlayOpen: boolean;
  route: string;
};
