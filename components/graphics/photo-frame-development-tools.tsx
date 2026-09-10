"use client";

import dynamic from "next/dynamic";

const PhotoFramePreview =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@/components/graphics/photo-frame-preview").then(
            (module) => module.PhotoFramePreview,
          ),
        { ssr: false },
      )
    : () => null;

export function PhotoFrameDevelopmentTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <PhotoFramePreview />;
}
