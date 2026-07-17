import type { GalleryFilter, Photo } from "@/types/photo";

export const ARCHIVE_DEFAULT_PAGE_SIZE = 12;
export const ARCHIVE_PAGE_SIZE = 8;

export const archiveSortOptions = [
  "curated",
  "newest",
  "oldest",
  "title-asc",
  "title-desc",
] as const;

export type ArchiveSort = (typeof archiveSortOptions)[number];
export type ArchiveYear = "all" | string;

export type ArchiveState = {
  category: GalleryFilter;
  year: ArchiveYear;
  query: string;
  sort: ArchiveSort;
  page: number;
};

export type ArchivePhoto = Photo & {
  id: number;
  year: string;
  curatedIndex: number;
};

export type ArchiveItemVariant =
  | "featured"
  | "standard"
  | "sequence"
  | "panorama";

export const defaultArchiveState: ArchiveState = {
  category: "Todo",
  year: "all",
  query: "",
  sort: "curated",
  page: 1,
};
