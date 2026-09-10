// Deterministic hero 3D composition: floating photo frames around the hero
// content. Photos avoid the hero image (52) and Selected Work [1, 35, 37, 49];
// two are series members (19, 26), legible at small size. No runtime random.

export type HeroFramePhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export type HeroFramePlacement = {
  photo: HeroFramePhoto;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  driftPhase: number;
};

const framePhotos: Record<string, HeroFramePhoto> = {
  valley: { id: "30", src: "/photos/optimized/800/30.webp", width: 1320, height: 1980 },
  sevilla: { id: "6", src: "/photos/optimized/800/6.webp", width: 3139, height: 2158 },
  clerigos: { id: "26", src: "/photos/optimized/800/26.webp", width: 1024, height: 576 },
  porto: { id: "19", src: "/photos/optimized/800/19.webp", width: 1024, height: 683 },
};

const desktopComposition: HeroFramePlacement[] = [
  {
    photo: framePhotos.valley,
    position: [1.35, 0.1, 0.4],
    rotation: [0.02, -0.16, 0],
    scale: 1,
    driftPhase: 0,
  },
  {
    photo: framePhotos.sevilla,
    position: [-1.7, 0.85, -1],
    rotation: [0, 0.2, 0],
    scale: 0.78,
    driftPhase: 1.7,
  },
  {
    photo: framePhotos.clerigos,
    position: [2, -0.75, -0.7],
    rotation: [0, -0.2, 0],
    scale: 0.6,
    driftPhase: 3.4,
  },
  {
    photo: framePhotos.porto,
    position: [0.2, 1.05, -1.6],
    rotation: [0.03, -0.06, 0],
    scale: 0.55,
    driftPhase: 5.1,
  },
];

const mobileComposition: HeroFramePlacement[] = [
  {
    photo: framePhotos.valley,
    position: [0.55, 0.3, 0.2],
    rotation: [0.02, -0.14, 0],
    scale: 0.6,
    driftPhase: 0,
  },
  {
    photo: framePhotos.sevilla,
    position: [-0.5, -0.6, -0.7],
    rotation: [0, 0.16, 0],
    scale: 0.48,
    driftPhase: 2.6,
  },
];

export const heroFramesConfig = {
  camera: { fov: 32, position: [0, 0, 5.6] as const },
  maxPixelRatio: 1.5,
  drift: { positionAmplitude: 0.035, rotationAmplitude: 0.02, positionPeriod: 9, rotationPeriod: 12 },
  mobileBreakpoint: 768,
} as const;

export function getHeroFrameLayout(viewportWidth: number): HeroFramePlacement[] {
  return viewportWidth < heroFramesConfig.mobileBreakpoint ? mobileComposition : desktopComposition;
}
