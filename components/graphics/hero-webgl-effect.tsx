"use client";

import { getCoverTransform } from "@/lib/graphics/cover";
import { graphicsConfig } from "@/lib/graphics/config";
import {
  cancelScheduledContextLoss,
  getActiveGraphicsContextCount,
  registerGraphicsContext,
  scheduleContextLoss,
} from "@/lib/graphics/context-registry";
import {
  GRAPHICS_CONTROL_EVENT,
  publishGraphicsState,
  type GraphicsControlDetail,
} from "@/lib/graphics/development";
import { heroFragmentShader, heroVertexShader } from "@/lib/graphics/shaders";
import { subscribeHeroScrollProgress, subscribePointerSample } from "@/lib/graphics/signals";
import type { GraphicsDebugSnapshot, GraphicsDecision } from "@/types/graphics";
import type { OptimizedImageData } from "@/types/photo";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type RuntimeStatus = GraphicsDebugSnapshot["status"];

export function HeroWebglEffect({
  image,
  decision,
  overlayOpen,
}: {
  image: OptimizedImageData;
  decision: GraphicsDecision;
  overlayOpen: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayOpenRef = useRef(overlayOpen);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
    if (!overlayOpen) requestRenderRef.current?.();
  }, [overlayOpen]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    cancelScheduledContextLoss(canvas);

    const quality = graphicsConfig.quality[decision.quality as "full" | "reduced"];
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let texture: THREE.Texture | null = null;
    let frame: number | null = null;
    let destroyed = false;
    let visible = false;
    let contextLost = false;
    let textureLoaded = false;
    let runtimeEnabled = true;
    let firstFrameRendered = false;
    let intensityMultiplier = 1;
    let frames = 0;
    let fps = 0;
    let fpsFrames = 0;
    let fpsStartedAt = performance.now();
    let lastReportAt = 0;
    let status: RuntimeStatus = "loading";
    const pointer = { currentX: 0.5, currentY: 0.5, targetX: 0.5, targetY: 0.5 };
    const scroll = { current: 0, target: 0 };
    const releaseContext = registerGraphicsContext();

    const snapshot = (): GraphicsDebugSnapshot => ({
      status,
      quality: decision.quality,
      reason: decision.reason,
      renderer: renderer ? "three-webgl" : "none",
      webgl: decision.capabilities.webgl,
      webgl2: decision.capabilities.webgl2,
      webgpu: decision.capabilities.webgpu,
      dpr: renderer?.getPixelRatio() ?? 0,
      fps,
      frames,
      drawCalls: renderer?.info.render.calls ?? 0,
      triangles: renderer?.info.render.triangles ?? 0,
      textureLoaded,
      imageSource: image.src,
      visible,
      overlayOpen: overlayOpenRef.current,
      contextLost,
      activeContexts: getActiveGraphicsContextCount(),
      hasFinePointer: decision.capabilities.hasFinePointer,
      hasHover: decision.capabilities.hasHover,
      hasTouch: decision.capabilities.hasTouch,
      prefersReducedMotion: decision.capabilities.prefersReducedMotion,
      saveData: decision.capabilities.saveData,
      deviceMemory: decision.capabilities.deviceMemory,
      hardwareConcurrency: decision.capabilities.hardwareConcurrency,
      viewport: `${decision.capabilities.viewportWidth}x${decision.capabilities.viewportHeight}`,
    });

    const report = (force = false) => {
      if (process.env.NODE_ENV !== "development") return;
      const now = performance.now();
      if (!force && now - lastReportAt < 250) return;
      lastReportAt = now;
      publishGraphicsState(snapshot());
    };
    const canRender = () => !destroyed
      && runtimeEnabled
      && visible
      && !document.hidden
      && !overlayOpenRef.current
      && !contextLost
      && renderer !== null
      && material !== null;

    const updateSize = () => {
      if (!renderer || !material) return;
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dpr);
      renderer.setPixelRatio(dpr);
      renderer.setSize(rect.width, rect.height, false);
      const cover = getCoverTransform(rect.width, rect.height, image.width, image.height);
      material.uniforms.uCover.value.set(cover.scaleX, cover.scaleY, cover.offsetX, cover.offsetY);
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    let mesh: THREE.Mesh | null = null;

    const renderStableFrame = (now: number) => {
      frame = null;
      if (!canRender() || !renderer || !material || !mesh) return;
      pointer.currentX += (pointer.targetX - pointer.currentX) * graphicsConfig.pointer.damping;
      pointer.currentY += (pointer.targetY - pointer.currentY) * graphicsConfig.pointer.damping;
      scroll.current += (scroll.target - scroll.current) * graphicsConfig.scroll.damping;
      material.uniforms.uPointer.value.set(pointer.currentX, pointer.currentY);
      material.uniforms.uPointerIntensity.value = quality.pointerIntensity * intensityMultiplier;
      material.uniforms.uScroll.value = scroll.current;
      renderer.render(scene, camera);
      frames += 1;
      fpsFrames += 1;
      if (now - fpsStartedAt >= 500) {
        fps = Math.round((fpsFrames * 1000) / (now - fpsStartedAt));
        fpsFrames = 0;
        fpsStartedAt = now;
      }
      if (!firstFrameRendered) {
        firstFrameRendered = true;
        setReady(true);
      }
      status = "ready";
      report(!firstFrameRendered);
      const unsettled = Math.abs(pointer.targetX - pointer.currentX) > graphicsConfig.pointer.settleEpsilon
        || Math.abs(pointer.targetY - pointer.currentY) > graphicsConfig.pointer.settleEpsilon
        || Math.abs(scroll.target - scroll.current) > graphicsConfig.scroll.settleEpsilon;
      if (unsettled) frame = window.requestAnimationFrame(renderStableFrame);
    };

    const schedule = () => {
      if (frame === null && canRender()) frame = window.requestAnimationFrame(renderStableFrame);
    };
    requestRenderRef.current = schedule;

    const loadTexture = () => new Promise<THREE.Texture>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("texture-timeout")), graphicsConfig.textureTimeoutMs);
      new THREE.TextureLoader().load(
        image.src,
        (loaded) => { window.clearTimeout(timeout); resolve(loaded); },
        undefined,
        () => { window.clearTimeout(timeout); reject(new Error("texture-load-failed")); },
      );
    });

    const boot = async () => {
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        texture = await loadTexture();
        if (destroyed) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        geometry = new THREE.PlaneGeometry(2, 2, quality.segmentsX, quality.segmentsY);
        material = new THREE.ShaderMaterial({
          vertexShader: heroVertexShader,
          fragmentShader: heroFragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uPointer: { value: new THREE.Vector2(0.5, 0.5) },
            uCover: { value: new THREE.Vector4(1, 1, 0, 0) },
            uPointerIntensity: { value: quality.pointerIntensity },
            uScroll: { value: 0 },
            uScrollIntensity: { value: quality.scrollIntensity },
            uRadius: { value: graphicsConfig.pointer.radius },
          },
          transparent: false,
          depthTest: false,
          depthWrite: false,
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        textureLoaded = true;
        updateSize();
        schedule();
      } catch {
        status = "fallback";
        setReady(false);
        report(true);
      }
    };

    const unsubscribePointer = subscribePointerSample((sample) => {
      const rect = host.getBoundingClientRect();
      const inside = sample.x >= rect.left && sample.x <= rect.right && sample.y >= rect.top && sample.y <= rect.bottom;
      pointer.targetX = inside ? (sample.x - rect.left) / rect.width : 0.5;
      pointer.targetY = inside ? 1 - (sample.y - rect.top) / rect.height : 0.5;
      schedule();
    });
    const unsubscribeScroll = subscribeHeroScrollProgress((progress) => {
      scroll.target = progress;
      schedule();
    });
    const resizeObserver = new ResizeObserver(() => { updateSize(); schedule(); });
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frame !== null) { window.cancelAnimationFrame(frame); frame = null; }
      report(true);
    }, { rootMargin: graphicsConfig.intersectionMargin });
    intersectionObserver.observe(host);

    const handleVisibility = () => {
      if (document.hidden && frame !== null) { window.cancelAnimationFrame(frame); frame = null; }
      else schedule();
      report(true);
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      firstFrameRendered = false;
      status = "lost";
      setReady(false);
      if (frame !== null) { window.cancelAnimationFrame(frame); frame = null; }
      report(true);
    };
    const handleContextRestored = () => {
      contextLost = false;
      status = "loading";
      updateSize();
      schedule();
    };
    const handleControl = (event: Event) => {
      if (process.env.NODE_ENV !== "development") return;
      const detail = (event as CustomEvent<GraphicsControlDetail>).detail;
      if (typeof detail.enabled === "boolean") runtimeEnabled = detail.enabled;
      if (typeof detail.intensity === "number") intensityMultiplier = Math.max(0, Math.min(2, detail.intensity));
      if (detail.simulateContextLoss) {
        const extension = renderer?.getContext().getExtension("WEBGL_lose_context");
        extension?.loseContext();
        window.setTimeout(() => extension?.restoreContext(), 650);
      }
      if (!runtimeEnabled) { setReady(false); status = "fallback"; }
      else schedule();
      report(true);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener(GRAPHICS_CONTROL_EVENT, handleControl);
    void boot();

    return () => {
      destroyed = true;
      requestRenderRef.current = null;
      if (frame !== null) window.cancelAnimationFrame(frame);
      unsubscribePointer();
      unsubscribeScroll();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener(GRAPHICS_CONTROL_EVENT, handleControl);
      if (mesh) scene.remove(mesh);
      geometry?.dispose();
      material?.dispose();
      texture?.dispose();
      renderer?.renderLists.dispose();
      renderer?.dispose();
      if (renderer) scheduleContextLoss(canvas, renderer);
      releaseContext();
      status = "idle";
      publishGraphicsState({ ...snapshot(), activeContexts: getActiveGraphicsContextCount() });
    };
  }, [decision, image.height, image.src, image.width]);

  return (
    <div ref={hostRef} data-hero-graphics className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full transition-opacity"
        style={{
          opacity: ready ? 1 : 0,
          transitionDuration: `${graphicsConfig.fadeDurationMs}ms`,
        }}
      />
    </div>
  );
}
