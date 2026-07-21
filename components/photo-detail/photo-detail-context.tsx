"use client";

import { buildArchivePhotos } from "@/lib/archive/selectors";
import { defaultArchiveState, type ArchivePhoto, type ArchiveState } from "@/lib/archive/types";
import { getArchiveHref, parseArchiveSearch, serializeArchiveState } from "@/lib/archive/url";
import { readArchiveContext, saveArchiveContext } from "@/lib/archive/context";
import { categories } from "@/lib/gallery-data";
import { getPhotoDetailHref, resolvePhotoNavigation, selectRelatedPhotos } from "@/lib/photo-detail/selectors";
import { getLocalizedSeries, getSeriesForPhoto, getSeriesReturnHref, getValidSeriesContext } from "@/lib/series/selectors";
import type { LocalizedPhotoSeries } from "@/lib/series/types";
import type { Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type PhotoDetailContextValue = {
  photos: ArchivePhoto[];
  state: ArchiveState;
  current: ArchivePhoto;
  previous: ArchivePhoto | null;
  next: ArchivePhoto | null;
  index: number;
  total: number;
  isContextual: boolean;
  contextType: "series" | "archive" | "global";
  series: LocalizedPhotoSeries | null;
  seriesMembership: LocalizedPhotoSeries | null;
  returnHref: string;
  related: ArchivePhoto[];
  hrefFor: (id: number) => string;
  preserveContext: (id: number) => void;
};

const PhotoDetailContext = createContext<PhotoDetailContextValue | null>(null);

export function PhotoDetailContextProvider({ children, locale, currentId, imagesData }: {
  children: React.ReactNode;
  locale: Locale;
  currentId: number;
  imagesData: ImagesData;
}) {
  const photos = useMemo(() => buildArchivePhotos(imagesData, locale), [imagesData, locale]);
  const years = useMemo(() => [...new Set(photos.map((photo) => photo.year))], [photos]);
  const [state, setState] = useState<ArchiveState>(defaultArchiveState);
  const [returnHref, setReturnHref] = useState(`/${locale}#gallery`);
  const [seriesSlug, setSeriesSlug] = useState<string | null>(null);

  useEffect(() => {
    const validSeries = getValidSeriesContext(window.location.search, currentId);
    const searchParams = new URLSearchParams(window.location.search);
    if (validSeries) {
      [...searchParams.keys()].forEach((key) => { if (key !== "series") searchParams.delete(key); });
    } else {
      searchParams.delete("series");
    }
    const cleanedSearch = searchParams.size ? `?${searchParams.toString()}` : "";
    const parsed = parseArchiveSearch(validSeries ? "" : cleanedSearch, categories, years);
    const normalized = validSeries ? `?series=${encodeURIComponent(validSeries.slug)}` : serializeArchiveState(parsed, cleanedSearch);
    if (normalized !== window.location.search) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${normalized}${window.location.hash}`);
    }
    setState(parsed);
    setSeriesSlug(validSeries?.slug ?? null);
    if (validSeries) {
      setReturnHref(getSeriesReturnHref(locale, validSeries.slug, currentId));
      return;
    }
    const saved = readArchiveContext(locale, currentId);
    setReturnHref(saved?.archiveHref || getArchiveHref(locale, parsed));
  }, [currentId, locale, years]);

  const navigation = useMemo(() => resolvePhotoNavigation(photos, currentId, state, seriesSlug), [currentId, photos, seriesSlug, state]);
  const current = photos.find((photo) => photo.id === currentId) || photos[0];
  const hrefFor = useCallback((id: number) => getPhotoDetailHref(locale, id, state, seriesSlug), [locale, seriesSlug, state]);
  const preserveContext = useCallback((id: number) => {
    if (seriesSlug) return;
    const saved = readArchiveContext(locale);
    if (!saved) return;
    saveArchiveContext({ ...saved, photoId: id, state, savedAt: Date.now() });
  }, [locale, seriesSlug, state]);

  if (!current) return null;
  const membership = getSeriesForPhoto(currentId);
  const value = {
    photos,
    state,
    current,
    previous: navigation.previous,
    next: navigation.next,
    index: navigation.index,
    total: navigation.collection.length,
    isContextual: navigation.isContextual,
    contextType: navigation.contextType,
    series: navigation.series ? getLocalizedSeries(navigation.series, locale) : null,
    seriesMembership: membership ? getLocalizedSeries(membership, locale) : null,
    returnHref,
    related: selectRelatedPhotos(photos, currentId, 4),
    hrefFor,
    preserveContext,
  };
  return <PhotoDetailContext.Provider value={value}>{children}</PhotoDetailContext.Provider>;
}

export function usePhotoDetailContext() {
  const value = useContext(PhotoDetailContext);
  if (!value) throw new Error("usePhotoDetailContext must be used inside PhotoDetailContextProvider");
  return value;
}
