"use client";

import { categories } from "@/lib/gallery-data";
import { GALLERY_FILTER_EVENT } from "@/lib/gallery-filter-events";
import {
  defaultArchiveState,
  type ArchiveSort,
  type ArchiveState,
} from "@/lib/archive/types";
import { parseArchiveSearch, serializeArchiveState } from "@/lib/archive/url";
import type { GalleryFilter } from "@/types/photo";
import { useCallback, useEffect, useState } from "react";
import { LOCATION_CHANGE_EVENT } from "@/hooks/use-location-snapshot";

type HistoryMode = "push" | "replace";

export function useArchiveState(years: readonly string[]) {
  const [state, setState] = useState<ArchiveState>(defaultArchiveState);
  const [hydrated, setHydrated] = useState(false);

  const commitState = useCallback(
    (next: ArchiveState, historyMode: HistoryMode = "push") => {
      setState(next);
      if (typeof window === "undefined") return;
      const search = serializeArchiveState(next, window.location.search);
      const nextUrl = `${window.location.pathname}${search}#gallery`;
      window.history[historyMode === "push" ? "pushState" : "replaceState"](
        { ...window.history.state, rawVivesArchive: true },
        "",
        nextUrl,
      );
      window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    },
    [],
  );

  useEffect(() => {
    const readLocation = () => {
      const parsed = parseArchiveSearch(window.location.search, categories, years);
      setState(parsed);
      const normalizedSearch = serializeArchiveState(parsed, window.location.search);
      if (normalizedSearch !== window.location.search) {
        window.history.replaceState(
          { ...window.history.state, rawVivesArchive: true },
          "",
          `${window.location.pathname}${normalizedSearch}${window.location.hash || "#gallery"}`,
        );
        window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
      }
      setHydrated(true);
    };
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [years]);

  useEffect(() => {
    const handleRequestedFilter = (event: Event) => {
      const category = (event as CustomEvent<GalleryFilter>).detail;
      if (!(categories as readonly GalleryFilter[]).includes(category)) return;
      commitState({ ...state, category, page: 1 });
    };
    window.addEventListener(GALLERY_FILTER_EVENT, handleRequestedFilter);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, handleRequestedFilter);
  }, [commitState, state]);

  const setCategory = useCallback(
    (category: GalleryFilter) => commitState({ ...state, category, page: 1 }),
    [commitState, state],
  );
  const setYear = useCallback(
    (year: string) => commitState({ ...state, year, page: 1 }),
    [commitState, state],
  );
  const setSort = useCallback(
    (sort: ArchiveSort) => commitState({ ...state, sort, page: 1 }),
    [commitState, state],
  );
  const setQuery = useCallback(
    (query: string) =>
      commitState({ ...state, query: query.trim().slice(0, 120), page: 1 }, "replace"),
    [commitState, state],
  );
  const setPage = useCallback(
    (page: number, historyMode: HistoryMode = "push") =>
      commitState({ ...state, page: Math.max(1, page) }, historyMode),
    [commitState, state],
  );
  const clear = useCallback(
    () => commitState(defaultArchiveState),
    [commitState],
  );

  return {
    state,
    hydrated,
    setCategory,
    setYear,
    setSort,
    setQuery,
    setPage,
    clear,
  };
}
