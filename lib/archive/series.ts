import { getPublishedSeries, getSeriesForPhoto } from "@/lib/series/selectors";
import type { ArchivePhoto } from "@/lib/archive/types";

export const archiveSeriesFilters = [
  "all",
  ...getPublishedSeries().map((series) => series.slug),
  "unassigned",
] as const;

export function isArchiveSeriesFilter(value: string | null): value is (typeof archiveSeriesFilters)[number] {
  return Boolean(value && archiveSeriesFilters.includes(value as (typeof archiveSeriesFilters)[number]));
}

export function matchesArchiveSeries(photo: Pick<ArchivePhoto, "id">, filter: string) {
  if (filter === "all") return true;
  const series = getSeriesForPhoto(photo.id);
  return filter === "unassigned" ? series === null : series?.slug === filter;
}
