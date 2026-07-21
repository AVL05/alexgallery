"use client";

import { HomeSeries, type HomeSeriesEntry } from "@/components/home/home-series";
import { ExpansivePhoto } from "@/components/home/expansive-photo";
import { FeaturedStory } from "@/components/home/featured-story";
import { HomeManifesto } from "@/components/home/home-manifesto";
import { SelectedWork } from "@/components/home/selected-work";
import { VisualChapters } from "@/components/home/visual-chapters";
import {
  HOME_PREVIEW_EVENT,
  reportHomeState,
  type HomePreviewOptions,
} from "@/lib/home/development";
import { alternateHomeCuration, homeCuration } from "@/lib/home/curation";
import {
  assertValidHomeExperience,
  homeExperienceConfig,
  orderHomeSeries,
} from "@/lib/home/experience";
import { getHomeNarrativeData, getNarrativePhotos } from "@/lib/home/selectors";
import { getLocalizedSeries, getPublishedSeries, getUnassignedPhotoIds, resolveSeriesCover } from "@/lib/series/selectors";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { Fragment, type ReactNode, useEffect, useMemo, useState } from "react";

export function HomeNarrative({
  dictionary,
  locale,
  imagesData,
  archiveSection,
  contactSection,
}: {
  dictionary: Dictionary;
  locale: Locale;
  imagesData: ImagesData;
  archiveSection: ReactNode;
  contactSection: ReactNode;
}) {
  const [preview, setPreview] = useState<HomePreviewOptions>({});
  const activeCuration = preview.alternate ? alternateHomeCuration : homeCuration;
  const data = useMemo(() => {
    assertValidHomeExperience(activeCuration);
    return getHomeNarrativeData(imagesData, locale, activeCuration);
  },
    [imagesData, locale, preview.alternate],
  );
  const chapters = preview.emptyCategories ? [] : data.chapters;
  const unassignedSelectedIds = new Set(getUnassignedPhotoIds(data.selected.map((photo) => photo.id)));
  const curatedSelected = homeExperienceConfig.selectedWorkOnlyUnassigned
    ? data.selected.filter((photo) => unassignedSelectedIds.has(photo.id))
    : data.selected;
  const selected = (preview.fewPhotos ? curatedSelected.slice(0, 2) : curatedSelected)
    .slice(0, homeExperienceConfig.selectedWorkLimit);
  const seriesEntries = useMemo(() => {
    const narrativePhotos = getNarrativePhotos(imagesData, locale);
    return orderHomeSeries(getPublishedSeries()).flatMap((rawSeries) => {
      const cover = resolveSeriesCover(rawSeries, narrativePhotos);
      return cover ? [{ series: getLocalizedSeries(rawSeries, locale), cover }] : [];
    }) as HomeSeriesEntry[];
  }, [imagesData, locale]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handlePreview = (event: Event) => {
      setPreview((event as CustomEvent<HomePreviewOptions>).detail ?? {});
    };
    window.addEventListener(HOME_PREVIEW_EVENT, handlePreview);
    return () => window.removeEventListener(HOME_PREVIEW_EVENT, handlePreview);
  }, []);

  useEffect(() => {
    reportHomeState({
      ...preview,
      selectedCount: selected.length,
      chapterCount: homeExperienceConfig.sectionOrder.includes("visualChapters") ? chapters.length : 0,
    });
  }, [chapters.length, preview, selected.length]);

  return (
    <>
      {homeExperienceConfig.sectionOrder.filter((section) => section !== "hero").map((section) => {
        let content: ReactNode = null;
        if (section === "manifesto") content = <HomeManifesto home={dictionary.home} about={dictionary.about} />;
        if (section === "featuredStory") content = <FeaturedStory photo={data.featured} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />;
        if (section === "series") content = <HomeSeries entries={seriesEntries} dictionary={dictionary.home} locale={locale} />;
        if (section === "expansivePhoto") content = <ExpansivePhoto photo={data.expansive} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} forceReducedMotion={preview.reducedMotion} slowImages={preview.slowImages} />;
        if (section === "visualChapters") content = <VisualChapters chapters={chapters} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />;
        if (section === "selectedWork") content = <SelectedWork photos={selected} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />;
        if (section === "archive") content = archiveSection;
        if (section === "contact") content = contactSection;
        return <Fragment key={section}>{content}</Fragment>;
      })}
    </>
  );
}
