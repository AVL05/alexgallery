import { motionDuration, motionStagger } from "@/lib/motion/config";

// Reduced-motion resolution for JS-driven (GSAP) motion. CSS transitions are
// already neutralized globally; these helpers let future V2 animations and 3D
// collapse to instant/static when prefers-reduced-motion is active.
export function accessibleDuration(
  prefersReducedMotion: boolean,
  duration: number = motionDuration.normal,
): number {
  return prefersReducedMotion ? motionDuration.instant : duration;
}

export function accessibleDistance(
  prefersReducedMotion: boolean,
  distance: number,
): number {
  return prefersReducedMotion ? 0 : distance;
}

export function accessibleStagger(
  prefersReducedMotion: boolean,
  stagger: number = motionStagger.normal,
): number {
  return prefersReducedMotion ? 0 : stagger;
}
