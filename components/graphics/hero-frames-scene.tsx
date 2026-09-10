"use client";

import { useMotion } from "@/components/motion/motion-provider";
import {
  createPhotoFrameInstance,
  loadPhotoFrameAsset,
  loadPhotoTexture,
  type PhotoFrameInstance,
} from "@/lib/graphics/photo-frame";
import { getHeroFrameLayout, heroFramesConfig } from "@/lib/graphics/hero-frames";
import * as THREE from "three";
import { useEffect, useRef } from "react";

// Cinematic hero scene: a few floating frames with real project photos.
// Decorative only: photo, content and navigation never wait for it, and any
// failure leaves an empty (invisible) slot.
export function HeroFramesScene({ entryReady }: { entryReady: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const entryReadyRef = useRef(entryReady);
  entryReadyRef.current = entryReady;
  const { prefersReducedMotion, forcedColors } = useMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || forcedColors) return;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let visible = true;
    let documentVisible = document.visibilityState === "visible";
    const instances: PhotoFrameInstance[] = [];
    const baseTransforms: Array<{ y: number; rotationY: number; phase: number }> = [];

    const init = async () => {
      // Progressive: wait for the hero entry so FCP never depends on the GLB.
      while (!entryReadyRef.current && !cancelled) {
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
      if (cancelled) return;
      const asset = await loadPhotoFrameAsset().catch(() => null);
      if (!asset || cancelled) return;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, heroFramesConfig.maxPixelRatio));
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
        baseTransforms.splice(0);
        for (const placement of getHeroFrameLayout(window.innerWidth)) {
          const instance = createPhotoFrameInstance(asset, {
            position: placement.position,
            rotation: placement.rotation,
            scale: placement.scale,
          });
          instances.push(instance);
          scene.add(instance.group);
          baseTransforms.push({ y: placement.position[1], rotationY: placement.rotation[1], phase: placement.driftPhase });
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

      const reduced = prefersReducedMotion;
      const { positionAmplitude, rotationAmplitude, positionPeriod, rotationPeriod } = heroFramesConfig.drift;
      const start = performance.now();
      let framesRendered = 0;
      const tick = () => {
        if (cancelled || !renderer) return;
        if (!visible || !documentVisible) {
          raf = window.requestAnimationFrame(tick);
          return;
        }
        const elapsed = (performance.now() - start) / 1000;
        if (!reduced) {
          for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];
            const base = baseTransforms[i];
            instance.group.position.y =
              base.y + Math.sin((elapsed / positionPeriod) * Math.PI * 2 + base.phase) * positionAmplitude;
            instance.group.rotation.y =
              base.rotationY + Math.sin((elapsed / rotationPeriod) * Math.PI * 2 + base.phase * 1.3) * rotationAmplitude;
          }
        }
        renderer.render(scene, camera);
        framesRendered += 1;
        // Reduced motion: settle on a static frame instead of looping.
        if (reduced && framesRendered >= 3) return;
        raf = window.requestAnimationFrame(tick);
      };
      tick();

      return () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        observer.disconnect();
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

  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
