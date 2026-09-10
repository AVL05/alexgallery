"use client";

import {
  createPhotoFrameInstance,
  loadPhotoFrameAsset,
  loadPhotoTexture,
  photoFrameMeasurements,
  type PhotoFrameInstance,
  type PhotoFramePhoto,
} from "@/lib/graphics/photo-frame";
import imagesDataJson from "@/lib/images-data.json";
import type { ImagesData } from "@/types/photo";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef, useState } from "react";

const PREVIEW_PHOTO_IDS = ["49", "35", "37"] as const;

function getPreviewPhotos(): PhotoFramePhoto[] {
  const images = (imagesDataJson as ImagesData).images;
  return PREVIEW_PHOTO_IDS.flatMap((id) => {
    const image = images.find((entry) => entry.id === id);
    return image ? [{ src: image.src, width: image.width, height: image.height }] : [];
  });
}

// Technical inspector for the Meshy frame: orbit, photo swap, live stats.
// Dev only, mounted behind ?photo-frame=1. Never part of the public routes.
export function PhotoFramePreview() {
  const [enabled, setEnabled] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [status, setStatus] = useState("cargando modelo…");
  const [stats, setStats] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<PhotoFrameInstance | null>(null);
  const photos = useRef<PhotoFramePhoto[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setEnabled(new URLSearchParams(window.location.search).get("photo-frame") === "1");
    }
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !enabled) return;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    photos.current = getPreviewPhotos();

    const init = async () => {
      setStatus("cargando modelo…");
      const asset = await loadPhotoFrameAsset().catch(() => null);
      if (!asset || cancelled) {
        setStatus("error: no se pudo cargar el GLB");
        return;
      }
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);
      camera.position.set(0.6, 0.35, 3.2);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.target.set(0, 0, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(1.6, 2.2, 2.6);
      scene.add(key);

      const instance = createPhotoFrameInstance(asset, {});
      instanceRef.current = instance;
      scene.add(instance.group);

      const resize = () => {
        if (!renderer || !mount) return;
        const { clientWidth, clientHeight } = mount;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(1, clientHeight);
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const tick = () => {
        if (cancelled) return;
        raf = window.requestAnimationFrame(tick);
        controls.update();
        if (renderer) {
          renderer.render(scene, camera);
          setStats((current) =>
            current ??
            `draws ${renderer!.info.render.calls} · tris ${(renderer!.info.render.triangles / 1e6).toFixed(2)}M · backing ${photoFrameMeasurements.backing.width}×${photoFrameMeasurements.backing.height}`,
          );
        }
      };
      setStatus("modelo listo");
      tick();

      return () => {
        window.removeEventListener("resize", resize);
        controls.dispose();
      };
    };

    let detach: (() => void) | undefined;
    void init().then((cleanup) => {
      detach = cleanup;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      detach?.();
      instanceRef.current?.dispose();
      instanceRef.current = null;
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const photo = photos.current[photoIndex];
    const instance = instanceRef.current;
    if (!photo || !instance) return;
    let cancelled = false;
    setStatus(`cargando foto ${photo.src}…`);
    void loadPhotoTexture(photo)
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        instance.setPhotoTexture(texture, photo.width / photo.height, 8);
        setStatus("foto aplicada");
      })
      .catch(() => setStatus("error: no se pudo cargar la foto"));
    return () => {
      cancelled = true;
    };
  }, [enabled, photoIndex]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[var(--z-modal)] w-[min(92vw,24rem)] border border-border bg-background p-4" role="dialog" aria-label="Inspector del marco 3D">
      <p className="rv-kicker">photo-frame · dev</p>
      <div ref={mountRef} className="mt-3 aspect-[4/3] w-full overflow-hidden bg-black" />
      <p className="mt-3 font-mono text-[10px] text-[var(--color-text-secondary)]">{status}</p>
      {stats ? <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">{stats}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {photos.current.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setPhotoIndex(index)}
            aria-pressed={photoIndex === index}
            className={`min-h-9 border px-3 font-mono text-[10px] ${photoIndex === index ? "border-accent text-accent" : "border-border text-[var(--color-text-secondary)]"}`}
          >
            {photo.src.split("/").pop()}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        Arrastra para orbitar · rueda para zoom · frontal por defecto +Z
      </p>
    </div>
  );
}
