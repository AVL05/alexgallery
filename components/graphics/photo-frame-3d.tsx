"use client";

import {
  createPhotoFrameInstance,
  loadPhotoFrameAsset,
  loadPhotoTexture,
  type PhotoFrameInstance,
  type PhotoFrameOptions,
  type PhotoFramePhoto,
} from "@/lib/graphics/photo-frame";
import * as THREE from "three";
import { useEffect, useRef } from "react";

// Reusable single-frame viewer: loads the cached GLB once, shows one project
// photo on the inner plane. Scene-agnostic (own camera/lights/loop) so future
// scenes can either reuse it or compose instances via the factory directly.
export function PhotoFrame3D({
  photo,
  position,
  rotation,
  scale,
  visible = true,
  autoRotate = false,
  className,
}: {
  photo: PhotoFramePhoto | null;
  position?: PhotoFrameOptions["position"];
  rotation?: PhotoFrameOptions["rotation"];
  scale?: PhotoFrameOptions["scale"];
  visible?: boolean;
  autoRotate?: boolean;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef(photo);
  photoRef.current = photo;
  const instanceRef = useRef<PhotoFrameInstance | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const anisotropyRef = useRef(4);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;

    const init = async () => {
      const asset = await loadPhotoFrameAsset().catch(() => null);
      if (!asset || cancelled) return;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      mount.appendChild(renderer.domElement);
      anisotropyRef.current = renderer.capabilities.getMaxAnisotropy();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
      camera.position.set(0, 0.05, 3.4);
      camera.lookAt(0, 0, 0);

      const resize = () => {
        if (!renderer || !mount) return;
        const { clientWidth, clientHeight } = mount;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(1, clientHeight);
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 0.85));
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(1.6, 2.2, 2.6);
      scene.add(key);

      const instance = createPhotoFrameInstance(asset, { position, rotation, scale, visible });
      instanceRef.current = instance;
      scene.add(instance.group);
      const pendingTexture = textureRef.current;
      const pendingPhoto = photoRef.current;
      if (pendingTexture && pendingPhoto) {
        instance.setPhotoTexture(
          pendingTexture,
          pendingPhoto.width / pendingPhoto.height,
          anisotropyRef.current,
        );
      }

      const clock = new THREE.Clock();
      const tick = () => {
        if (cancelled) return;
        raf = window.requestAnimationFrame(tick);
        const delta = clock.getDelta();
        if (autoRotateRef.current) instance.group.rotation.y += delta * 0.35;
        if (renderer) renderer.render(scene, camera);
      };
      tick();

      return () => window.removeEventListener("resize", resize);
    };

    let detachResize: (() => void) | undefined;
    void init().then((cleanup) => {
      detachResize = cleanup;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      detachResize?.();
      textureRef.current?.dispose();
      textureRef.current = null;
      instanceRef.current?.dispose();
      instanceRef.current = null;
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
      }
    };
    // Mounted once; photo and rotation flags flow through refs/effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    instanceRef.current?.setVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    void loadPhotoTexture(photo)
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        textureRef.current?.dispose();
        textureRef.current = texture;
        instanceRef.current?.setPhotoTexture(
          texture,
          photo.width / photo.height,
          anisotropyRef.current,
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [photo?.src]);

  return <div ref={mountRef} className={className} role="img" aria-label="Vista 3D del marco fotográfico" />;
}
