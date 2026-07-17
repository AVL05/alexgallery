"use client";

import { useSyncExternalStore } from "react";

export const LOCATION_CHANGE_EVENT = "raw-vives:location-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(LOCATION_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(LOCATION_CHANGE_EVENT, onChange);
  };
}

function getSnapshot() {
  return `${window.location.pathname}|${window.location.search}|${window.location.hash}`;
}

export function useLocationSnapshot() {
  const value = useSyncExternalStore(subscribe, getSnapshot, () => "||");
  const [pathname = "", search = "", hash = ""] = value.split("|");
  return { pathname, search, hash };
}
