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
