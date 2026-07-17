import type { GraphicsCapabilities, GraphicsDecision } from "@/types/graphics";

type CapabilityInput = Omit<GraphicsCapabilities, "webgl" | "webgl2" | "webgpu" | "contextCreated"> & {
  webgl?: boolean;
  webgl2?: boolean;
  webgpu?: boolean;
  contextCreated?: boolean;
};

export function chooseGraphicsQuality(capabilities: GraphicsCapabilities): GraphicsDecision {
  if (!capabilities.contextCreated || !capabilities.webgl) {
    return { quality: "disabled", reason: "webgl-unavailable", capabilities };
  }
  if (capabilities.prefersReducedMotion) {
    return { quality: "disabled", reason: "reduced-motion", capabilities };
  }
  if (capabilities.saveData) {
    return { quality: "disabled", reason: "save-data", capabilities };
  }
  if (capabilities.hardwareConcurrency <= 2 || (capabilities.deviceMemory !== null && capabilities.deviceMemory <= 2)) {
    return { quality: "disabled", reason: "constrained-device", capabilities };
  }
  if (capabilities.hasCoarsePointer && !capabilities.hasFinePointer && !capabilities.hasHover) {
    return { quality: "disabled", reason: "touch-primary", capabilities };
  }
  const reduced = !capabilities.webgl2
    || !capabilities.hasFinePointer
    || !capabilities.hasHover
    || capabilities.hasTouch
    || capabilities.hardwareConcurrency <= 6
    || (capabilities.deviceMemory !== null && capabilities.deviceMemory <= 4);
  return {
    quality: reduced ? "reduced" : "full",
    reason: reduced ? "adaptive-quality" : "desktop-capable",
    capabilities,
  };
}
export function detectGraphicsCapabilities(input: CapabilityInput): GraphicsDecision {
  const base: GraphicsCapabilities = {
    ...input,
    webgl: input.webgl ?? false,
    webgl2: input.webgl2 ?? false,
    webgpu: input.webgpu ?? false,
    contextCreated: input.contextCreated ?? false,
  };
  return chooseGraphicsQuality(base);
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
  gpu?: unknown;
};

export function inspectBrowserGraphicsCapabilities({
  prefersReducedMotion,
  hasFinePointer,
  hasHover,
  hasCoarsePointer,
  hasTouch,
}: {
  prefersReducedMotion: boolean;
  hasFinePointer: boolean;
  hasHover: boolean;
  hasCoarsePointer: boolean;
  hasTouch: boolean;
}): GraphicsDecision {
  const browserNavigator = navigator as NavigatorWithHints;
  const saveData = browserNavigator.connection?.saveData === true;
  const common = {
    hasFinePointer,
    hasHover,
    hasCoarsePointer,
    hasTouch,
    prefersReducedMotion,
    saveData,
    deviceMemory: browserNavigator.deviceMemory ?? null,
    hardwareConcurrency: browserNavigator.hardwareConcurrency || 1,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };

  // Accessibility and data-saving preferences are resolved before any probe canvas exists.
  if (prefersReducedMotion || saveData) {
    return detectGraphicsCapabilities(common);
  }

  const probe = document.createElement("canvas");
  let webgl2 = false;
  let webgl = false;
  let contextCreated = false;
  try {
    const context = probe.getContext("webgl2", { powerPreference: "high-performance" })
      ?? probe.getContext("webgl", { powerPreference: "high-performance" });
    contextCreated = context !== null;
    webgl2 = typeof WebGL2RenderingContext !== "undefined" && context instanceof WebGL2RenderingContext;
    webgl = contextCreated;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    contextCreated = false;
  }

  return detectGraphicsCapabilities({
    ...common,
    webgl,
    webgl2,
    webgpu: "gpu" in browserNavigator,
    contextCreated,
  });
}
