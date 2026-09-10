"use client";

import { useMotion } from "@/components/motion/motion-provider";
import {
  createPhotoFrameInstance,
  loadPhotoFrameAsset,
  loadPhotoTexture,
  type PhotoFrameInstance,
} from "@/lib/graphics/photo-frame";
import {
  createScrollTransform,
  getHeroFrameLayout,
  getScrollIntensity,
  heroFramesConfig,
  writeScrollTransform,
  type HeroFramePlacement,
  type ScrollTransform,
} from "@/lib/graphics/hero-frames";
import { readQualitySignals, resolveHeroQuality } from "@/lib/graphics/quality";
import { subscribeHeroScrollProgress } from "@/lib/graphics/signals";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

// Cinematic hero scene: floating frames driven by the shared hero scroll
// progress (0→1) plus a subtle ambient drift. Decorative only: photo,
// content and navigation never wait for it, and any failure leaves an empty
// (invisible) slot. Single RAF, direct three.js transforms, no React renders.
export function HeroFramesScene({ entryReady }: { entryReady: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  const entryReadyRef = useRef(entryReady);
  entryReadyRef.current = entryReady;
  const { prefersReducedMotion, forcedColors, isTouchDevice } = useMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || forcedColors) return;
      const reduced = prefersReducedMotion;
      const touch = isTouchDevice;
      const heroRoot = mount.closest("[data-hero]");
      // Context loss: suspend once, resume once, then stay suspended.
      // Never loops renderer recreation; the photographic hero persists.
      let contextLosses = 0;
      let contextSuspended = false;
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        contextLosses += 1;
        contextSuspended = true;
      };
      const handleContextRestored = () => {
        if (contextLosses <= 1) contextSuspended = false;
      };
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let visible = true;
    let documentVisible = document.visibilityState === "visible";
    const instances: PhotoFrameInstance[] = [];
    const placements: HeroFramePlacement[] = [];
    const scratch: ScrollTransform[] = [];
    let intensity = 1;
    let progress = 0;
    let lastEased = 0;
    let activity = 0;
    let fpsFrames = 0;
    let fpsTime = performance.now();
    let fps = 0;

    const init = async () => {
      // Adaptive gate first: off-tier devices never download the GLB.
      const signals = readQualitySignals();
      const quality = resolveHeroQuality(signals);
      if (quality.tier === "off") return;
      // Progressive: wait for the hero entry so FCP never depends on the GLB.
      while (!entryReadyRef.current && !cancelled) {
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
      if (cancelled) return;
      const asset = await loadPhotoFrameAsset().catch(() => null);
      if (!asset || cancelled) return;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(heroFramesConfig.camera.fov, 1, 0.05, 60);
      camera.position.set(...heroFramesConfig.camera.position);
      camera.lookAt(0, 0, 0);

      const resize = () => {
        if (!renderer || !mount) return;
        const { clientWidth, clientHeight } = mount;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(1, clientHeight);
        camera.updateProjectionMatrix();
      };

      const rebuild = () => {
        for (const instance of instances.splice(0)) {
          scene.remove(instance.group);
          instance.dispose();
        }
        placements.splice(0);
        scratch.splice(0);
        intensity = getScrollIntensity(window.innerWidth) * quality.scrollScale;
        for (const placement of getHeroFrameLayout(window.innerWidth).slice(0, quality.maxFrames)) {
          const instance = createPhotoFrameInstance(asset, {
            position: placement.position,
            rotation: placement.rotation,
            scale: placement.scale,
          });
          instances.push(instance);
          placements.push(placement);
          scratch.push(createScrollTransform());
          scene.add(instance.group);
          void loadPhotoTexture(placement.photo)
            .then((texture) => {
              if (cancelled) {
                texture.dispose();
                return;
              }
              instance.setPhotoTexture(
                texture,
                placement.photo.width / placement.photo.height,
                renderer?.capabilities.getMaxAnisotropy() ?? 4,
              );
            })
            .catch(() => undefined);
        }
        resize();
      };

      scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 0.55));
      const key = new THREE.DirectionalLight(0xfff2e0, 1.35);
      key.position.set(1.8, 2.4, 3);
      scene.add(key);
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);

      rebuild();
      let currentLayout = window.innerWidth < heroFramesConfig.mobileBreakpoint ? "mobile" : "desktop";
      const onResize = () => {
        const next = window.innerWidth < heroFramesConfig.mobileBreakpoint ? "mobile" : "desktop";
        if (next !== currentLayout) {
          currentLayout = next;
          rebuild();
        } else {
          resize();
        }
      };
      window.addEventListener("resize", onResize);

      // Single source of truth: the shared hero scroll signal (desktop).
      // Touch devices publish nothing, so derive progress from the hero rect
      // inside our own RAF instead of adding another scroll listener.
      let unsubscribe: (() => void) | null = null;
      if (!reduced) {
        unsubscribe = subscribeHeroScrollProgress((value) => {
          progress = value;
        });
      }

      const readTouchProgress = () => {
        if (!heroRoot) return 0;
        const rect = heroRoot.getBoundingClientRect();
        if (rect.height <= 0) return 0;
        const value = -rect.top / rect.height;
        return value < 0 ? 0 : value > 1 ? 1 : value;
      };

      const onVisibility = () => {
        documentVisible = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVisibility);
      const observer = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0 },
      );
      observer.observe(mount);

      if (process.env.NODE_ENV === "development") {
        (window as unknown as Record<string, unknown>).__heroFrames = {
          getProgress: () => progress,
          getFps: () => fps,
          getInstances: () => instances.length,
          getTier: () => quality.tier,
          getDpr: () => renderer?.getPixelRatio() ?? 0,
          getWebglStatus: () => (contextSuspended ? "suspended" : "active"),
          getReducedMotion: () => reduced,
          getSaveData: () => signals.saveData,
        };
      }

      const { positionAmplitude, rotationAmplitude, positionPeriod, rotationPeriod } = heroFramesConfig.drift;
      const start = performance.now();
      let framesRendered = 0;
      const tick = () => {
        if (cancelled || !renderer) return;
        if (!visible || !documentVisible || contextSuspended) {
          raf = window.requestAnimationFrame(tick);
          return;
        }
        const now = performance.now();
        fpsFrames += 1;
        if (now - fpsTime >= 1000) {
          fps = Math.round((fpsFrames * 1000) / (now - fpsTime));
          fpsFrames = 0;
          fpsTime = now;
        }
        if (touch && !reduced) progress = readTouchProgress();
        const elapsed = (now - start) / 1000;
        // Scroll activity decays the ambient drift so both never compete.
        const delta = progress - lastEased;
        lastEased = progress;
        activity += (Math.abs(delta) - activity) * 0.08;
        const driftScale = quality.driftScale * (1 - Math.min(1, activity * 60) * 0.7);
        for (let i = 0; i < instances.length; i++) {
          const frame = instances[i];
          const target = scratch[i];
          if (reduced) {
            frame.group.position.set(placements[i].position[0], placements[i].position[1], placements[i].position[2]);
            continue;
          }
          writeScrollTransform(placements[i], progress, intensity, target);
          const phase = placements[i].driftPhase;
          frame.group.position.set(
            target.position[0],
            target.position[1] + Math.sin((elapsed / positionPeriod) * Math.PI * 2 + phase) * positionAmplitude * driftScale,
            target.position[2],
          );
          frame.group.rotation.set(
            target.rotation[0],
            target.rotation[1] + Math.sin((elapsed / rotationPeriod) * Math.PI * 2 + phase * 1.3) * rotationAmplitude * driftScale,
            target.rotation[2],
          );
          frame.group.scale.setScalar(target.scale);
        }
        renderer.render(scene, camera);
        framesRendered += 1;
        if (framesRendered === 2) setSettled(true);
        // Reduced motion: settle on a static frame instead of looping.
        if (reduced && framesRendered >= 3) return;
        raf = window.requestAnimationFrame(tick);
      };
      tick();

      return () => {
        unsubscribe?.();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer?.domElement.removeEventListener("webglcontextlost", handleContextLost);
        renderer?.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
        observer.disconnect();
        if (process.env.NODE_ENV === "development") {
          delete (window as unknown as Record<string, unknown>).__heroFrames;
        }
      };
    };

    let detach: (() => void) | undefined;
    void init().then((cleanup) => {
      detach = cleanup ?? undefined;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      detach?.();
      for (const instance of instances) instance.dispose();
      instances.splice(0);
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
      }
    };
    // Mounted once; flags flow through refs, layout via resize rebuilds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-1000 [&>canvas]:h-full [&>canvas]:w-full ${settled ? "opacity-100" : "opacity-0"}`}
    />
  );
}
