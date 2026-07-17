export type GraphicsQuality = "disabled" | "reduced" | "full";

export type GraphicsCapabilities = {
  webgl: boolean;
  webgl2: boolean;
  webgpu: boolean;
  contextCreated: boolean;
  hasFinePointer: boolean;
  hasHover: boolean;
  hasCoarsePointer: boolean;
  hasTouch: boolean;
  prefersReducedMotion: boolean;
  saveData: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
};

export type GraphicsDecision = {
  quality: GraphicsQuality;
  reason: string;
  capabilities: GraphicsCapabilities;
};

export type GraphicsDebugSnapshot = {
  status: "idle" | "loading" | "ready" | "paused" | "fallback" | "lost";
  quality: GraphicsQuality;
  reason: string;
  renderer: "three-webgl" | "none";
  webgl: boolean;
  webgl2: boolean;
  webgpu: boolean;
  dpr: number;
  fps: number;
  frames: number;
  drawCalls: number;
  triangles: number;
  textureLoaded: boolean;
  imageSource: string;
  visible: boolean;
  overlayOpen: boolean;
  contextLost: boolean;
  activeContexts: number;
  hasFinePointer: boolean;
  hasHover: boolean;
  hasTouch: boolean;
  prefersReducedMotion: boolean;
  saveData: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  viewport: string;
};
