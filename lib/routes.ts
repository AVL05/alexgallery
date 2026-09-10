import { getSeriesHref } from "@/lib/series/selectors";
import type { Locale } from "@/types/dictionary";

// V2 route registry (Fase 1: helpers only, no new pages yet). Every path is
// locale-prefixed to keep ES/EN working. Existing pages keep their URLs;
// /work, /archive, /films, /about and /contact land in Fase 2.

export const v2RouteTemplates = [
  "/",
  "/work",
  "/archive",
  "/photo/[slug]",
  "/series",
  "/series/[slug]",
  "/films",
  "/about",
  "/contact",
] as const;

type LocaleParam = Locale | string;

export function homeHref(locale: LocaleParam): string {
  return `/${locale}`;
}

export function workHref(locale: LocaleParam): string {
  return `/${locale}/work`;
}

// Future standalone archive page. Unrelated to lib/archive/url.ts
// getArchiveHref, which points at the current home "#gallery" section.
export function archivePageHref(locale: LocaleParam): string {
  return `/${locale}/archive`;
}

export function photoHref(locale: LocaleParam, idOrSlug: number | string): string {
  return `/${locale}/photo/${idOrSlug}`;
}

export function seriesIndexHref(locale: LocaleParam): string {
  return `/${locale}/series`;
}

export function seriesDetailHref(locale: LocaleParam, slug: string): string {
  return getSeriesHref(locale, slug);
}

export function filmsHref(locale: LocaleParam): string {
  return `/${locale}/films`;
}

export function aboutHref(locale: LocaleParam): string {
  return `/${locale}/about`;
}

export function contactHref(locale: LocaleParam): string {
  return `/${locale}/contact`;
}
