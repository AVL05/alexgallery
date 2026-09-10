import type { ArchiveState } from "@/lib/archive/types";
import type { Locale } from "@/types/dictionary";

export type ArchiveNavigationContext = {
  locale: Locale;
  photoId: number;
  archiveHref: string;
  scrollY: number;
  state: ArchiveState;
  savedAt: number;
};

const MAX_CONTEXT_AGE = 1000 * 60 * 60 * 6;

export function getArchiveContextKey(locale: Locale) {
  return `raw-vives:archive-context:${locale}`;
}

export function saveArchiveContext(context: ArchiveNavigationContext) {
  try {
    window.sessionStorage.setItem(
      getArchiveContextKey(context.locale),
      JSON.stringify(context),
    );
  } catch {
    // The URL and native history remain the functional fallback.
  }
}

export type PhotoReturnContext = {
  locale: Locale;
  photoId: number;
  returnHref: string;
  scrollY: number;
  savedAt: number;
};

const PHOTO_RETURN_PREFIX = "raw-vives:photo-return";

// Lightweight "back to origin" for photo pages: every gallery-like entry
// (home sections, /archive, series teasers) stores where the visit started.
// Series context (?series=) still wins; direct visits fall back to /archive.
export function savePhotoReturn(context: PhotoReturnContext) {
  try {
    window.sessionStorage.setItem(
      `${PHOTO_RETURN_PREFIX}:${context.locale}`,
      JSON.stringify(context),
    );
  } catch {
    // Native history remains the functional fallback.
  }
}

export function readPhotoReturn(locale: Locale, photoId: number): PhotoReturnContext | null {
  try {
    const raw = window.sessionStorage.getItem(`${PHOTO_RETURN_PREFIX}:${locale}`);
    if (!raw) return null;
    const context = JSON.parse(raw) as PhotoReturnContext;
    if (
      context.locale !== locale ||
      context.photoId !== photoId ||
      typeof context.returnHref !== "string" ||
      Date.now() - context.savedAt > MAX_CONTEXT_AGE
    ) {
      return null;
    }
    return context;
  } catch {
    return null;
  }
}

export function resolvePhotoReturnHref({
  seriesHref,
  storedHref,
  fallbackHref,
}: {
  seriesHref: string | null;
  storedHref: string | null;
  fallbackHref: string;
}): string {
  return seriesHref ?? storedHref ?? fallbackHref;
}

export function readArchiveContext(
  locale: Locale,
  photoId?: number,
): ArchiveNavigationContext | null {
  try {
    const raw = window.sessionStorage.getItem(getArchiveContextKey(locale));
    if (!raw) return null;
    const context = JSON.parse(raw) as ArchiveNavigationContext;
    if (
      context.locale !== locale ||
      (photoId !== undefined && context.photoId !== photoId) ||
      Date.now() - context.savedAt > MAX_CONTEXT_AGE
    ) {
      return null;
    }
    return context;
  } catch {
    return null;
  }
}
