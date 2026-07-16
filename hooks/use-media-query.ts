"use client";

import {
  getMediaQuerySnapshot,
  subscribeMediaQuery,
} from "@/lib/motion/media-query-store";
import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (listener: () => void) => subscribeMediaQuery(query, listener),
    [query],
  );
  const getSnapshot = useCallback(() => getMediaQuerySnapshot(query), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
