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
  // Full-travel scroll offsets from base (progress 1). Interpolated with
  // smoothstep; intensity tiers scale them per breakpoint.
  scroll: {
    position: readonly [number, number, number];
    rotation: readonly [number, number, number];
    scale: number;
  };
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
    scroll: { position: [-0.1, 0.05, 0.45], rotation: [0, -0.03, 0], scale: 0.06 },
  },
  {
    photo: framePhotos.sevilla,
    position: [-1.7, 0.85, -1],
    rotation: [0, 0.2, 0],
    scale: 0.78,
    driftPhase: 1.7,
    scroll: { position: [-0.55, 0.25, -0.6], rotation: [0, 0.05, 0], scale: -0.04 },
  },
  {
    photo: framePhotos.clerigos,
    position: [2, -0.75, -0.7],
    rotation: [0, -0.2, 0],
    scale: 0.6,
    driftPhase: 3.4,
    scroll: { position: [0.45, -0.2, -0.5], rotation: [0, -0.04, 0], scale: -0.03 },
  },
  {
    photo: framePhotos.porto,
    position: [0.2, 1.05, -1.6],
    rotation: [0.03, -0.06, 0],
    scale: 0.55,
    driftPhase: 5.1,
    scroll: { position: [0.1, 0.3, -0.4], rotation: [0.02, 0, 0], scale: -0.02 },
  },
];

const mobileComposition: HeroFramePlacement[] = [
  {
    photo: framePhotos.valley,
    position: [0.55, 0.3, 0.2],
    rotation: [0.02, -0.14, 0],
    scale: 0.6,
    driftPhase: 0,
    scroll: { position: [0, 0.05, 0.2], rotation: [0, 0, 0], scale: 0.03 },
  },
  {
    photo: framePhotos.sevilla,
    position: [-0.5, -0.6, -0.7],
    rotation: [0, 0.16, 0],
    scale: 0.48,
    driftPhase: 2.6,
    scroll: { position: [-0.2, -0.1, -0.3], rotation: [0, 0, 0], scale: -0.02 },
  },
];

export const heroFramesConfig = {
  camera: { fov: 32, position: [0, 0, 5.6] as const },
  maxPixelRatio: 1.5,
  drift: { positionAmplitude: 0.035, rotationAmplitude: 0.02, positionPeriod: 9, rotationPeriod: 12 },
  mobileBreakpoint: 768,
  tabletBreakpoint: 1280,
  // Scroll-travel intensity per breakpoint: full on desktop, softer mid-size,
  // clearly reduced on mobile.
  scrollIntensity: { desktop: 1, tablet: 0.7, mobile: 0.35 },
} as const;

export function getHeroFrameLayout(viewportWidth: number): HeroFramePlacement[] {
  return viewportWidth < heroFramesConfig.mobileBreakpoint ? mobileComposition : desktopComposition;
}

export function getScrollIntensity(viewportWidth: number): number {
  if (viewportWidth < heroFramesConfig.mobileBreakpoint) return heroFramesConfig.scrollIntensity.mobile;
  if (viewportWidth < heroFramesConfig.tabletBreakpoint) return heroFramesConfig.scrollIntensity.tablet;
  return heroFramesConfig.scrollIntensity.desktop;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Smoothstep easing so raw scroll progress never maps mechanically.
export function smoothstep01(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export type ScrollTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export function createScrollTransform(): ScrollTransform {
  return { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 };
}

// Base transform interpolated toward its scroll offset. Writes into a
// caller-owned scratch object so animation frames allocate nothing.
export function writeScrollTransform(
  placement: HeroFramePlacement,
  progress: number,
  intensity: number,
  out: ScrollTransform,
): void {
  const eased = smoothstep01(progress) * intensity;
  out.position[0] = placement.position[0] + placement.scroll.position[0] * eased;
  out.position[1] = placement.position[1] + placement.scroll.position[1] * eased;
  out.position[2] = placement.position[2] + placement.scroll.position[2] * eased;
  out.rotation[0] = placement.rotation[0] + placement.scroll.rotation[0] * eased;
  out.rotation[1] = placement.rotation[1] + placement.scroll.rotation[1] * eased;
  out.rotation[2] = placement.rotation[2] + placement.scroll.rotation[2] * eased;
  out.scale = placement.scale * (1 + placement.scroll.scale * eased);
}
