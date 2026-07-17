"use client";

import { ArchiveIndex } from "@/components/home/archive-index";
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
import { getHomeNarrativeData } from "@/lib/home/selectors";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { useEffect, useMemo, useState } from "react";

export function HomeNarrative({
  dictionary,
  locale,
  imagesData,
}: {
  dictionary: Dictionary;
  locale: Locale;
  imagesData: ImagesData;
}) {
  const [preview, setPreview] = useState<HomePreviewOptions>({});
  const data = useMemo(
    () => getHomeNarrativeData(imagesData, preview.alternate ? alternateHomeCuration : homeCuration),
    [imagesData, preview.alternate],
  );
  const chapters = preview.emptyCategories ? [] : data.chapters;
  const selected = preview.fewPhotos ? data.selected.slice(0, 2) : data.selected;

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handlePreview = (event: Event) => {
      setPreview((event as CustomEvent<HomePreviewOptions>).detail ?? {});
    };
    window.addEventListener(HOME_PREVIEW_EVENT, handlePreview);
    return () => window.removeEventListener(HOME_PREVIEW_EVENT, handlePreview);
  }, []);

  useEffect(() => {
    reportHomeState({ ...preview, selectedCount: selected.length, chapterCount: chapters.length });
  }, [chapters.length, preview, selected.length]);

  return (
    <>
      <HomeManifesto home={dictionary.home} about={dictionary.about} />
      <FeaturedStory photo={data.featured} dictionary={dictionary.home} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />
      <ExpansivePhoto photo={data.expansive} dictionary={dictionary.home} locale={locale} failImages={preview.failImages} forceReducedMotion={preview.reducedMotion} slowImages={preview.slowImages} />
      <VisualChapters chapters={chapters} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />
      <SelectedWork photos={selected} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} locale={locale} failImages={preview.failImages} slowImages={preview.slowImages} />
      <ArchiveIndex archive={data.archive} dictionary={dictionary.home} galleryDictionary={dictionary.gallery} />
    </>
  );
}
