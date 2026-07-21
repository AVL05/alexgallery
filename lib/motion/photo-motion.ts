export type PhotoRevealVariant = "mask-up" | "mask-side" | "soft-scale";
export type PhotoMotionRole =
  | "featured"
  | "chapter"
  | "selected"
  | "archive"
  | "related"
  | "detail"
  | "index";

export const photoMotionConfig = {
  enabled: true,
  mobileIntensity: 0.6,
  revealOnce: true,
  archiveBatchSize: 6,
  viewTransitions: true,
  scrubs: true,
  debug: false,
  reducedMotionMode: "static",
} as const;

export const photoMotionTokens = {
  reveal: {
    duration: 0.75,
    ease: "power3.out",
    distance: 28,
    scale: 1.035,
    stagger: 0.075,
    threshold: "top 88%",
  },
  editorial: {
    duration: 1.05,
    ease: "power4.out",
    copyDelay: 0.22,
  },
  hover: {
    duration: 0.45,
    editorialScale: 1.025,
    utilityScale: 1.015,
  },
  route: {
    duration: 0.55,
    fallbackDuration: 0.18,
    readyTimeout: 650,
  },
  hero: {
    duration: 1.28,
    touchDuration: 0.82,
    distance: 24,
    touchDistance: 14,
    scale: 1.035,
    touchScale: 1.015,
    titleDelay: 0.12,
    copyDelay: 0.32,
    scrollScale: 1.025,
    scrollDistance: 22,
  },
  expansive: {
    startScale: 0.84,
    scrub: 0.72,
    inset: 7,
    radius: 12,
  },
  chapter: {
    duration: 0.55,
    distance: 14,
  },
  fullscreen: {
    duration: 0.28,
    scale: 0.985,
  },
} as const;

export type PhotoMotionRuntimeOptions = {
  enabled: boolean;
  gsap: boolean;
  scrollTrigger: boolean;
  viewTransitions: boolean;
  revealOnce: boolean;
  mobileIntensity: number;
};

export type PhotoMotionProfile = {
  static: boolean;
  intensity: number;
  duration: number;
  distance: number;
  scale: number;
  stagger: number;
};

export function getPhotoOrientation(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "square" as const;
  }
  const ratio = width / height;
  if (ratio > 1.08) return "horizontal" as const;
  if (ratio < 0.92) return "vertical" as const;
  return "square" as const;
}

export function getPhotoRevealVariant({
  width,
  height,
  role,
}: {
  width: number;
  height: number;
  role?: PhotoMotionRole;
}): PhotoRevealVariant {
  if (role === "featured" || role === "chapter") return "mask-side";
  if (role === "archive" || role === "related" || role === "detail" || role === "index") {
    return "soft-scale";
  }
  const orientation = getPhotoOrientation(width, height);
  if (orientation === "vertical") return "mask-up";
  if (orientation === "horizontal") return "mask-side";
  return "soft-scale";
}

export function getPhotoMotionProfile({
  reducedMotion,
  touch,
  intensity = photoMotionConfig.mobileIntensity,
  enabled = photoMotionConfig.enabled,
}: {
  reducedMotion: boolean;
  touch: boolean;
  intensity?: number;
  enabled?: boolean;
}): PhotoMotionProfile {
  const resolvedIntensity = touch ? Math.min(1, Math.max(0, intensity)) : 1;
  return {
    static: !enabled || reducedMotion,
    intensity: resolvedIntensity,
    duration: photoMotionTokens.reveal.duration * (touch ? 0.76 : 1),
    distance: photoMotionTokens.reveal.distance * resolvedIntensity,
    scale: 1 + (photoMotionTokens.reveal.scale - 1) * resolvedIntensity,
    stagger: photoMotionTokens.reveal.stagger * (touch ? 0.55 : 1),
  };
}

export function getPhotoMotionRuntimeOptions(search = ""): PhotoMotionRuntimeOptions {
  const params = new URLSearchParams(search);
  const debug = process.env.NODE_ENV === "development";
  const intensity = Number(params.get("photo-mobile-intensity"));
  return {
    enabled: photoMotionConfig.enabled && !(debug && params.get("photo-motion") === "off"),
    gsap: !(debug && params.get("photo-gsap") === "off"),
    scrollTrigger: !(debug && params.get("photo-scrolltrigger") === "off"),
    viewTransitions:
      photoMotionConfig.viewTransitions && !(debug && params.get("photo-vt") === "off"),
    revealOnce:
      photoMotionConfig.revealOnce && !(debug && params.get("photo-reveal-once") === "0"),
    mobileIntensity:
      debug && Number.isFinite(intensity)
        ? Math.min(1, Math.max(0, intensity))
        : photoMotionConfig.mobileIntensity,
  };
}

export function getPhotoViewTransitionName(photoId: number | string) {
  return `archive-photo-${photoId}`;
}

export function shouldEnhancePhotoNavigation({
  reducedMotion,
  enabled,
  apiAvailable,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  button = 0,
  target,
}: {
  reducedMotion: boolean;
  enabled: boolean;
  apiAvailable: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  button?: number;
  target?: string | null;
}) {
  return (
    enabled &&
    !reducedMotion &&
    apiAvailable &&
    !ctrlKey &&
    !metaKey &&
    !shiftKey &&
    !altKey &&
    button === 0 &&
    (!target || target === "_self")
  );
}

export function getArchiveMotionPlan({
  previousCollectionKey,
  collectionKey,
  visibleIds,
  seenIds,
}: {
  previousCollectionKey?: string;
  collectionKey: string;
  visibleIds: number[];
  seenIds: ReadonlySet<number>;
}) {
  if (previousCollectionKey !== undefined && previousCollectionKey !== collectionKey) {
    return { mode: "filter" as const, animateIds: [] as number[] };
  }
  return {
    mode: previousCollectionKey === undefined ? ("initial" as const) : ("append" as const),
    animateIds: visibleIds.filter((id) => !seenIds.has(id)),
  };
}

const revealedKeys = new Set<string>();
const PHOTO_TRANSITION_STORAGE_KEY = "raw-vives-photo-transition";

export function hasPhotoRevealed(key: string) {
  return revealedKeys.has(key);
}

export function markPhotoRevealed(key: string) {
  revealedKeys.add(key);
}

export function resetPhotoRevealRegistryForTests() {
  revealedKeys.clear();
}

export function preparePhotoTransition(photoId: number) {
  try {
    window.sessionStorage.setItem(PHOTO_TRANSITION_STORAGE_KEY, String(photoId));
  } catch {
    // Navigation remains native when storage is unavailable.
  }
}

export function consumePhotoTransition(photoId: number) {
  try {
    const matches = window.sessionStorage.getItem(PHOTO_TRANSITION_STORAGE_KEY) === String(photoId);
    window.sessionStorage.removeItem(PHOTO_TRANSITION_STORAGE_KEY);
    return matches;
  } catch {
    return false;
  }
}
