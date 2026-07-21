"use client";

import { useEffect } from "react";

export function SeriesReturnFocus() {
  useEffect(() => {
    if (!window.location.hash.startsWith("#series-photo-")) return;
    document.querySelector<HTMLElement>(window.location.hash)?.focus({ preventScroll: true });
  }, []);
  return null;
}
