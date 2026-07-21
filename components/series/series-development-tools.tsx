"use client";

import dynamic from "next/dynamic";

const SeriesDebugPanel = process.env.NODE_ENV === "development"
  ? dynamic(() => import("@/components/series/series-debug-panel").then((module) => module.SeriesDebugPanel), { ssr: false })
  : () => null;

export function SeriesDevelopmentTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <SeriesDebugPanel />;
}
