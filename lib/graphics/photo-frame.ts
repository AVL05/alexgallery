import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const PHOTO_FRAME_MODEL_URL = "/models/raw-vives/photo-frame-v2.glb";

// Measured audit (Fase 5.6, Blender GLB): nodes `frame` + `backing`,
// ~5.5k tris total, Y-up, front face toward +Z. The backing mesh carries the
// dynamic photo; only `frame_material` ships in the file, so each instance
// owns its photo material while sharing frame geometry and material.
export const photoFrameMeasurements = {
  outer: { width: 1.903, height: 1.388, depth: 0.047 },
  backing: { width: 1.506, height: 0.865, depth: -0.01 },
} as const;

export type PhotoFrameAsset = {
  root: THREE.Group;
  frame: THREE.Mesh;
  backing: THREE.Mesh;
};

function findMesh(root: THREE.Group, name: "frame" | "backing"): THREE.Mesh {
  const found = root.getObjectByName(name);
  if (found && (found as THREE.Mesh).isMesh) return found as THREE.Mesh;
  throw new Error(`photo-frame-v2.glb: objeto "${name}" no encontrado o no es un mesh`);
}

let cachedAsset: Promise<PhotoFrameAsset> | null = null;

// Single download per app lifetime: promise cache plus THREE.Cache for the
// underlying FileLoader, so N instances share one fetch and one parse.
export function loadPhotoFrameAsset(): Promise<PhotoFrameAsset> {
  if (!cachedAsset) {
    THREE.Cache.enabled = true;
    cachedAsset = new Promise<PhotoFrameAsset>((resolve, reject) => {
      new GLTFLoader().load(
        PHOTO_FRAME_MODEL_URL,
        (gltf) => {
          try {
            const root = gltf.scene;
            resolve({ root, frame: findMesh(root, "frame"), backing: findMesh(root, "backing") });
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        },
        undefined,
        (error) => reject(error instanceof Error ? error : new Error(String(error))),
      );
    });
  }
  return cachedAsset;
}

export type PhotoFramePhoto = {
  src: string;
  width: number;
  height: number;
};

// Cover-fit UV transform: fills the surface without deforming the photo
// (excess crops symmetrically). Pure math, no renderer needed.
export function coverTextureTransform(photoAspect: number, surfaceAspect: number) {
  if (!(photoAspect > 0) || !(surfaceAspect > 0)) {
    return { repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 } };
  }
  if (photoAspect > surfaceAspect) {
    const repeatX = surfaceAspect / photoAspect;
    return { repeat: { x: repeatX, y: 1 }, offset: { x: (1 - repeatX) / 2, y: 0 } };
  }
  const repeatY = photoAspect / surfaceAspect;
  return { repeat: { x: 1, y: repeatY }, offset: { x: 0, y: (1 - repeatY) / 2 } };
}

export function applyPhotoTexture(
  material: THREE.MeshStandardMaterial,
  texture: THREE.Texture,
  photoAspect: number,
  anisotropy = 4,
) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.max(1, Math.floor(anisotropy));
  const surfaceAspect =
    photoFrameMeasurements.backing.width / photoFrameMeasurements.backing.height;
  const transform = coverTextureTransform(photoAspect, surfaceAspect);
  texture.repeat.set(transform.repeat.x, transform.repeat.y);
  texture.offset.set(transform.offset.x, transform.offset.y);
  texture.needsUpdate = true;
  material.map = texture;
  material.needsUpdate = true;
}

export type PhotoFrameOptions = {
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number | readonly [number, number, number];
  visible?: boolean;
};

// One instance = fresh nodes sharing cached frame/backing geometry and the
// original frame material; the backing gets its own photo material so each
// copy can show another photo.
export function createPhotoFrameInstance(
  asset: PhotoFrameAsset,
  options: PhotoFrameOptions = {},
) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(asset.frame.geometry, asset.frame.material));
  // Backing normals face +Z (audited), so FrontSide is correct.
  const photoMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.9,
    metalness: 0,
    side: THREE.FrontSide,
  });
  const backing = new THREE.Mesh(asset.backing.geometry, photoMaterial);
  group.add(backing);

  if (options.position) group.position.set(...options.position);
  if (options.rotation) group.rotation.set(...options.rotation);
  const scale = options.scale ?? 1;
  if (typeof scale === "number") group.scale.setScalar(scale);
  else group.scale.set(...scale);
  group.visible = options.visible ?? true;

  return {
    group,
    backing,
    photoMaterial,
    setPhotoTexture(texture: THREE.Texture, photoAspect: number, anisotropy?: number) {
      applyPhotoTexture(photoMaterial, texture, photoAspect, anisotropy);
    },
    setVisible(visible: boolean) {
      group.visible = visible;
    },
    dispose() {
      photoMaterial.map?.dispose();
      photoMaterial.dispose();
    },
  };
}

export type PhotoFrameInstance = ReturnType<typeof createPhotoFrameInstance>;

const sharedTextureLoader = () => new THREE.TextureLoader();

// Loads a project photo as sRGB texture. Served through THREE.Cache, so
// repeated instances reuse one download.
export function loadPhotoTexture(photo: PhotoFramePhoto): Promise<THREE.Texture> {
  THREE.Cache.enabled = true;
  return new Promise<THREE.Texture>((resolve, reject) => {
    sharedTextureLoader().load(
      photo.src,
      (texture) => resolve(texture),
      undefined,
      () => reject(new Error(`No se pudo cargar la textura ${photo.src}`)),
    );
  });
}
