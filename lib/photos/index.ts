import { photos } from "@/lib/gallery-data";
import { homeCuration } from "@/lib/home/curation";
import { getSeriesForPhoto } from "@/lib/series/selectors";
import type { BasePhoto } from "@/types/photo";
import type { Locale } from "@/types/dictionary";

// Central photo identity for V2. Editorial content stays in
// lib/gallery-data.ts (+ EN overrides in lib/photo-detail/content.ts) and
// pipeline data in lib/images-data.json; this module only derives stable
// identity (slug), canonical hrefs and back-references (serie, selected).
// Record merging lives in lib/photos/selectors.ts.

export function slugifyPhotoTitle(title: string): string {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return slug || "foto";
}

function buildSlugById(entries: readonly BasePhoto[]): Map<number, string> {
  const used = new Set<string>();
  const byId = new Map<number, string>();
  for (const photo of entries) {
    if (photo.slug) {
      byId.set(photo.id, photo.slug);
      used.add(photo.slug);
      continue;
    }
    const base = slugifyPhotoTitle(photo.title);
    let slug = base;
    let counter = 2;
    while (used.has(slug)) slug = `${base}-${counter++}`;
    used.add(slug);
    byId.set(photo.id, slug);
  }
  return byId;
}

const slugById = buildSlugById(photos);

const idBySlug = new Map<string, number>(
  [...slugById.entries()].map(([id, slug]) => [slug, id]),
);

export function getPhotoSlug(photo: Pick<BasePhoto, "id" | "slug" | "title">): string {
  return photo.slug || slugById.get(photo.id) || slugifyPhotoTitle(photo.title);
}

export function getPhotoIdBySlug(slug: string): number | null {
  return idBySlug.get(slug) ?? null;
}

// Accepts a numeric id ("21") or a slug ("last-stop-night") and resolves to
// the numeric photo id. Returns null when the param matches nothing.
export function resolvePhotoParam(param: string): number | null {
  const asNumber = Number(param);
  if (Number.isInteger(asNumber) && photos.some((photo) => photo.id === asNumber)) {
    return asNumber;
  }
  return getPhotoIdBySlug(param);
}

// Canonical photo href. Numeric today to preserve existing URLs; a later
// phase can switch the default to slug without changing call sites.
export function getPhotoHref(locale: Locale | string, id: number): string {
  return `/${locale}/photo/${id}`;
}

export function getPhotoSlugHref(locale: Locale | string, slug: string): string {
  return `/${locale}/photo/${slug}`;
}

// Back-reference: series membership currently lives in lib/series/config.ts.
export function getPhotoSeriesSlug(photoId: number): string | null {
  return getSeriesForPhoto(photoId)?.slug ?? null;
}

const selectedIds = new Set<number>(homeCuration.selectedPhotoIds);

export function isSelectedPhoto(photoId: number): boolean {
  return selectedIds.has(photoId);
}

export function isFeaturedPhoto(photoId: number): boolean {
  return photos.some((photo) => photo.id === photoId && photo.featured);
}
