"use client";

import type { Locale, PhotoProcessDictionary } from "@/types/dictionary";
import dynamic from "next/dynamic";

const PhotoProcessDebugPanel = process.env.NODE_ENV === "development"
  ? dynamic(() => import("@/components/photo-process/photo-process-debug-panel").then((module) => module.PhotoProcessDebugPanel), { ssr: false })
  : () => null;

export function PhotoProcessDevelopmentTools({ locale, dictionary }: { locale: Locale; dictionary: PhotoProcessDictionary }) {
  if (process.env.NODE_ENV !== "development") return null;
  return <PhotoProcessDebugPanel locale={locale} dictionary={dictionary} />;
}
