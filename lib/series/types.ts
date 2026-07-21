import type { Locale } from "@/types/dictionary";

export type LocalizedText = Record<Locale, string>;

export type SeriesEditorialBlock = {
  layout: "single" | "diptych";
  photoIds: readonly number[];
};

export type PhotoSeries = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  coverPhotoId: number;
  photoIds: readonly number[];
  period?: string;
  location?: LocalizedText;
  criterion: "confirmed-location" | "editorial-affinity";
  status: "published" | "draft";
  blocks: readonly SeriesEditorialBlock[];
};

export type LocalizedPhotoSeries = Omit<
  PhotoSeries,
  "title" | "description" | "location"
> & {
  title: string;
  description: string;
  location?: string;
};
